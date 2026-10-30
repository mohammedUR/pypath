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

export const CERT_PROOF_VERSION = 3 as const;
export const CERT_ALG = 'ECDSA_P256_SHA256' as const;
const KEYS_STORAGE = 'pypath.cert.keys.v1';

/** Verification thresholds (CERT-002/003) — self-contained so verification
 * never trusts caller-supplied numbers for the gates:
 *  - Part I gate binds the certificate to all 163 canonical lessons.
 *  - Capstone gate requires all 6 canonical artifacts.
 *  - Exam gate requires a pass mark of at least 0.8 (≙ ≥ 13/16 on the
 *    16-question draw); a forged payload with a lowered passMark is rejected.
 */
export const CERT_PART1_LESSONS = 163 as const;
export const CERT_CAPSTONE_ARTIFACTS = 6 as const;
export const CERT_MIN_EXAM_PASS_MARK = 0.8 as const;
/** Subject: trimmed, non-empty, no control characters, bounded length. */
const SUBJECT_MAX_LEN = 80;

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
  /** Genuine attempt records from the certification store (CERT-003). */
  attempts: { ts: number; score: number; passed: boolean }[];
  readiness: number;
  /** Canonical-counted artifacts (capstoneArtifactsDone) — must equal 6. */
  artifactsDone: number;
  rubricTotal: number;
  rubricMax: number;
  /** The learner's completed lesson ids — validated as a superset of the
   * canonical Part I ids before anything is signed (no bare counts). */
  part1CompletedIds: readonly string[];
  /** The canonical Part I lesson ids from the manifest (163 entries). */
  part1CanonicalIds: readonly string[];
}

/** Normalize a certificate subject: trim, collapse whitespace, strip control
 * characters, bound length. Returns null when nothing substantive remains. */
export function normalizeSubject(raw: string): string | null {
  const cleaned = raw
    .replace(/[\u0000-\u001f\u007f]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, SUBJECT_MAX_LEN);
  return cleaned.length > 0 ? cleaned : null;
}

/**
 * Pre-issuance snapshot validation (CERT-003). Rejects — with a precise
 * reason — any of: an empty/oversized subject, a missing genuine passing
 * exam attempt (passed && score ≥ 0.8), capstone artifacts below 6/6 or a
 * readiness below 80, a Part I completion set that does not cover ALL 163
 * canonical ids (duplicates/fake ids never satisfy a set-equality check),
 * or tampered total fields.
 */
export function validateProofInput(input: ProofInput): { ok: true } | { ok: false; reason: string } {
  const subject = normalizeSubject(input.subject);
  if (!subject) return { ok: false, reason: 'subject-empty-or-invalid' };
  const hasPass = input.attempts.some(
    (a) =>
      a &&
      a.passed === true &&
      typeof a.score === 'number' &&
      Number.isFinite(a.score) &&
      a.score >= CERT_MIN_EXAM_PASS_MARK &&
      a.score <= 1 &&
      typeof a.ts === 'number',
  );
  if (!hasPass) return { ok: false, reason: 'exam-gate-not-satisfied' };
  if (input.artifactsDone !== CERT_CAPSTONE_ARTIFACTS)
    return { ok: false, reason: 'capstone-artifacts-incomplete' };
  if (input.readiness < 80) return { ok: false, reason: 'capstone-readiness-below-80' };
  if (input.rubricMax <= 0 || input.rubricTotal < 0 || input.rubricTotal > input.rubricMax)
    return { ok: false, reason: 'rubric-out-of-range' };
  if (input.part1CanonicalIds.length !== CERT_PART1_LESSONS)
    return { ok: false, reason: 'canonical-part1-set-invalid' };
  const completed = new Set(input.part1CompletedIds);
  const missing = input.part1CanonicalIds.filter((id) => !completed.has(id));
  if (missing.length > 0)
    return { ok: false, reason: `part1-incomplete (${missing.length} missing)` };
  return { ok: true };
}

/** Issue (sign) a certificate proof with the device's local key. Throws when
 * the snapshot fails validateProofInput — the caller gates the UI, but the
 * proof layer re-validates so nothing unsigned-worthy can ever be signed. */
export async function issueCertificateProof(input: ProofInput): Promise<SignedProof> {
  const verdict = validateProofInput(input);
  if (!verdict.ok) throw new Error(`proof input rejected: ${verdict.reason}`);
  const best = input.attempts.reduce((b, a) => Math.max(b, a.score), 0);
  const payload: CertProofPayload = {
    v: CERT_PROOF_VERSION,
    kind: 'pypath.certificate',
    subject: normalizeSubject(input.subject) as string,
    issuedAt: Date.now(),
    exam: {
      best,
      attempts: input.attempts.length,
      passed: true,
      passMark: CERT_MIN_EXAM_PASS_MARK,
    },
    capstone: {
      readiness: input.readiness,
      artifactsDone: input.artifactsDone,
      artifactsTotal: CERT_CAPSTONE_ARTIFACTS,
      rubricTotal: input.rubricTotal,
      rubricMax: input.rubricMax,
    },
    curriculum: {
      completed: CERT_PART1_LESSONS,
      total: CERT_PART1_LESSONS,
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
    const p = proof.payload;
    const key = await importPublicKey(trustedPublicKey ?? proof.publicKey);
    const data = new TextEncoder().encode(canonicalJson(proof.payload));
    // Signature comparison happens inside WebCrypto's constant-time verify —
    // no JS `===` ever compares digests (CERT-002).
    const ok = await crypto.subtle.verify(
      { name: 'ECDSA', hash: 'SHA-256' },
      key,
      fromBase64(proof.signature),
      data,
    );
    if (!ok) return { valid: false, reason: 'bad-signature', payload: p };
    // Semantic gates — a signature over a failing/forged payload is still
    // invalid. Every gate value is checked against platform constants, never
    // against numbers echoed back from the payload itself.
    if (!normalizeSubject(p.subject)) return { valid: false, reason: 'subject-invalid', payload: p };
    if (!p.exam.passed || p.exam.best < CERT_MIN_EXAM_PASS_MARK)
      return { valid: false, reason: 'exam-gate-failed', payload: p };
    if (p.exam.passMark < CERT_MIN_EXAM_PASS_MARK)
      return { valid: false, reason: 'pass-mark-lowered', payload: p };
    if (p.capstone.readiness < 80 || p.capstone.artifactsDone !== CERT_CAPSTONE_ARTIFACTS)
      return { valid: false, reason: 'capstone-gate-failed', payload: p };
    if (p.curriculum.total !== CERT_PART1_LESSONS || p.curriculum.completed !== p.curriculum.total)
      return { valid: false, reason: 'curriculum-gate-failed', payload: p };
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
