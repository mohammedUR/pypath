'use client';

/**
 * Signed certificate proof — R-GAM-02, OQ-7 (safe default: local key, M6).
 *
 * Design (honest, offline-first):
 * - ECDSA P-256 + SHA-256 via the platform WebCrypto (crypto.subtle).
 * - A key pair is generated locally on first issue and stored in localStorage.
 *   The PRIVATE key never leaves the device; the PUBLIC key is embedded in
 *   every exported proof so any verifier can check it offline.
 * - The payload is serialized with a deterministic canonical JSON (sorted
 *   keys) before signing, so verification is byte-stable across browsers.
 *
 * What a valid signature DOES prove: the payload was issued by the holder of
 * the key and has not been modified after signing (integrity + origin).
 * What it does NOT prove: real-world identity — `subject` is self-declared.
 * This is documented in docs/gamification.md (R-GAM-02) and OPEN-QUESTIONS.
 */

export const CERT_PROOF_VERSION = 2 as const;
export const CERT_ALG = 'ECDSA_P256_SHA256' as const;
const KEYS_STORAGE = 'pypath.cert.keys.v1';

export interface CertProofPayload {
  v: typeof CERT_PROOF_VERSION;
  kind: 'pypath.certificate';
  subject: string;
  issuedAt: number; // epoch ms
  exam: {
    best: number; // 0..1
    attempts: number;
    passed: boolean;
    passMark: number; // 0..1
  };
  capstone: {
    readiness: number; // 0..100
    artifactsDone: number;
    artifactsTotal: number;
    rubricTotal: number;
    rubricMax: number;
  };
  curriculum: {
    completed: number;
    total: number;
  };
  platform: {
    name: 'pypath';
    gate: 'part1';
  };
}

export interface SignedProof {
  payload: CertProofPayload;
  signature: string; // base64 (r||s)
  publicKey: JsonWebKey;
  alg: typeof CERT_ALG;
}

export interface VerifyResult {
  valid: boolean;
  reason?: string;
  payload?: CertProofPayload;
}

/** Deterministic JSON: object keys sorted recursively; arrays keep order. */
export function canonicalJson(value: unknown): string {
  if (value === null || typeof value !== 'object') return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(canonicalJson).join(',')}]`;
  const keys = Object.keys(value as Record<string, unknown>).sort();
  const body = keys
    .map((k) => `${JSON.stringify(k)}:${canonicalJson((value as Record<string, unknown>)[k])}`)
    .join(',');
  return `{${body}}`;
}

function toBase64(bytes: Uint8Array): string {
  let bin = '';
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin);
}

function fromBase64(s: string): Uint8Array<ArrayBuffer> {
  const bin = atob(s);
  const buf = new ArrayBuffer(bin.length);
  const out = new Uint8Array(buf);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

interface StoredKeyPair {
  publicJwk: JsonWebKey;
  privateJwk: JsonWebKey;
}

async function loadOrCreateKeyPair(): Promise<StoredKeyPair> {
  const raw = typeof localStorage !== 'undefined' ? localStorage.getItem(KEYS_STORAGE) : null;
  if (raw) {
    try {
      return JSON.parse(raw) as StoredKeyPair;
    } catch {
      // corrupted keys — fall through and regenerate
    }
  }
  const pair = (await crypto.subtle.generateKey({ name: 'ECDSA', namedCurve: 'P-256' }, true, [
    'sign',
    'verify',
  ])) as CryptoKeyPair;
  const publicJwk = await crypto.subtle.exportKey('jwk', pair.publicKey);
  const privateJwk = await crypto.subtle.exportKey('jwk', pair.privateKey);
  const stored: StoredKeyPair = { publicJwk, privateJwk };
  try {
    localStorage.setItem(KEYS_STORAGE, JSON.stringify(stored));
  } catch {
    // storage full/blocked — keys stay in-memory for this session only
  }
  return stored;
}

async function importPrivateKey(jwk: JsonWebKey): Promise<CryptoKey> {
  return crypto.subtle.importKey('jwk', jwk, { name: 'ECDSA', namedCurve: 'P-256' }, true, [
    'sign',
  ]);
}

async function importPublicKey(jwk: JsonWebKey): Promise<CryptoKey> {
  return crypto.subtle.importKey('jwk', jwk, { name: 'ECDSA', namedCurve: 'P-256' }, true, [
    'verify',
  ]);
}

export interface ProofInput {
  subject: string;
  examBest: number;
  examAttempts: number;
  examPassed: boolean;
  examPassMark: number;
  readiness: number;
  artifactsDone: number;
  artifactsTotal: number;
  rubricTotal: number;
  rubricMax: number;
  lessonsCompleted: number;
  lessonsTotal: number;
}

/** Issue (sign) a certificate proof with the device's local key. */
export async function issueCertificateProof(input: ProofInput): Promise<SignedProof> {
  const payload: CertProofPayload = {
    v: CERT_PROOF_VERSION,
    kind: 'pypath.certificate',
    subject: input.subject.trim() || 'Python learner',
    issuedAt: Date.now(),
    exam: {
      best: input.examBest,
      attempts: input.examAttempts,
      passed: input.examPassed,
      passMark: input.examPassMark,
    },
    capstone: {
      readiness: input.readiness,
      artifactsDone: input.artifactsDone,
      artifactsTotal: input.artifactsTotal,
      rubricTotal: input.rubricTotal,
      rubricMax: input.rubricMax,
    },
    curriculum: {
      completed: input.lessonsCompleted,
      total: input.lessonsTotal,
    },
    platform: { name: 'pypath', gate: 'part1' },
  };
  const { publicJwk, privateJwk } = await loadOrCreateKeyPair();
  const key = await importPrivateKey(privateJwk);
  const data = new TextEncoder().encode(canonicalJson(payload));
  const sig = await crypto.subtle.sign({ name: 'ECDSA', hash: 'SHA-256' }, key, data);
  return {
    payload,
    signature: toBase64(new Uint8Array(sig)),
    publicKey: publicJwk,
    alg: CERT_ALG,
  };
}

/**
 * Verify a signed proof offline. When `trustedPublicKey` is omitted the
 * embedded public key is used (integrity check only); pass an externally
 * pinned key to also authenticate the issuer.
 */
export async function verifySignedProof(
  proof: SignedProof,
  trustedPublicKey?: JsonWebKey,
): Promise<VerifyResult> {
  try {
    if (!proof || typeof proof !== 'object') return { valid: false, reason: 'malformed' };
    if (proof.alg !== CERT_ALG) return { valid: false, reason: 'unsupported-alg' };
    if (!proof.payload || proof.payload.kind !== 'pypath.certificate')
      return { valid: false, reason: 'not-a-certificate' };
    if (proof.payload.v !== CERT_PROOF_VERSION) return { valid: false, reason: 'bad-version' };
    const key = await importPublicKey(trustedPublicKey ?? proof.publicKey);
    const data = new TextEncoder().encode(canonicalJson(proof.payload));
    const ok = await crypto.subtle.verify(
      { name: 'ECDSA', hash: 'SHA-256' },
      key,
      fromBase64(proof.signature),
      data,
    );
    if (!ok) return { valid: false, reason: 'bad-signature' };
    // Semantic gates — a signature over a failing payload is still invalid.
    const p = proof.payload;
    if (!p.exam.passed || p.exam.best < p.exam.passMark)
      return { valid: false, reason: 'exam-gate-failed', payload: p };
    if (p.capstone.readiness < 80)
      return { valid: false, reason: 'capstone-gate-failed', payload: p };
    return { valid: true, payload: p };
  } catch (e) {
    return { valid: false, reason: e instanceof Error ? e.message : 'error' };
  }
}

/** Guard for untrusted JSON before verification. */
export function parseProofJson(text: string): SignedProof | null {
  try {
    const obj = JSON.parse(text) as SignedProof;
    if (!obj || typeof obj !== 'object' || typeof obj.signature !== 'string' || !obj.payload)
      return null;
    return obj;
  } catch {
    return null;
  }
}

export function downloadJson(filename: string, data: unknown): void {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
