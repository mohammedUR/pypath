import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireSession } from '@/lib/auth/session';
import { progressBodySchema } from '@/lib/sync/schema';
import { sanitizeProgressSnapshot, sanitizeXpEvent, sanitizeCertificationSnapshot } from '@/lib/sync/canonical';
import { rateLimit, clientIp } from '@/lib/auth/rate-limit';
import { jsonError, readJson, sameOrigin } from '@/lib/api/guards';
import manifestData from '../../../../content/manifest.json';

/**
 * Progress sync — the ONLY cloud store for learning progress.
 *
 * GET    → { progress, certification, updatedAt }   (server state)
 * POST   → optimistic CAS: if `base` (previous updatedAt ms) mismatches → 409
 *          with current state; else stores the submitted (client-merged)
 *          snapshot and inserts `newXpEvents` with dedup on (userId, id).
 * DELETE → wipes this account's cloud snapshot (settings' "delete data").
 *
 * Identity always comes from the session — the body cannot name a userId.
 * XP is never trusted from a snapshot: the ledger (XpEvent) is the source.
 *
 * SYNC-001 (server side): every stored field is canonicalized against the
 * 258-lesson manifest baked in below — fake lesson/exercise ids are dropped
 * before persistence, and XP event amounts are forced into the platform's
 * canonical envelope, so a tampered client can never inflate cloud XP.
 * AUTH-001/003: POST/DELETE are same-origin enforced and rate limited.
 */

const MAX_BODY = 2 * 1024 * 1024;

/** Canonical lesson ids from the committed manifest (258 entries). */
const CANONICAL_LESSONS = new Set<string>(
  (manifestData.lessons as Array<{ id: string }>).map((l) => l.id),
);

interface SnapshotRow {
  updatedAt: Date;
  version: number;
  completedLessons: unknown;
  exerciseResults: unknown;
  notes: unknown;
  lessonStarted: unknown;
  settings: unknown;
  certification: unknown;
}

function wireFromRow(row: SnapshotRow) {
  return {
    progress: {
      version: row.version,
      completedLessons: row.completedLessons,
      exerciseResults: row.exerciseResults,
      notes: row.notes,
      lessonStarted: row.lessonStarted,
      settings: row.settings,
    },
    certification: row.certification,
    updatedAt: row.updatedAt.getTime(),
  };
}

export async function GET() {
  const me = await requireSession();
  if (!me) return jsonError('PYANON', 401);
  const row = await db.progress.findUnique({
    where: { userId: me.id },
    include: { user: { select: { xpEvents: { select: { amount: true } } } } },
  });
  if (!row) {
    return NextResponse.json({
      progress: { version: 1, completedLessons: [], exerciseResults: {}, notes: {}, lessonStarted: {}, settings: { theme: 'system', calm: false, fontScale: 100, soundOff: true, reduceMotion: false } },
      certification: {},
      updatedAt: Date.now(),
      xpEvents: [],
      xp: 0,
    });
  }
  const events = await db.xpEvent.findMany({
    where: { userId: me.id },
    select: { id: true, amount: true, reason: true, ts: true },
    orderBy: { ts: 'asc' },
  });
  const xp = row.user.xpEvents.reduce((sum, e) => sum + Number(e.amount), 0);
  return NextResponse.json({
    ...wireFromRow(row),
    xpEvents: events.map((e) => ({ id: e.id, amount: e.amount, reason: e.reason, ts: e.ts.getTime() })),
    xp,
  });
}

export async function POST(req: Request) {
  if (!sameOrigin(req)) return jsonError('PYBADORIGIN', 403);
  const me = await requireSession();
  if (!me) return jsonError('PYANON', 401);

  // AUTH-001: per-account write throttle (sync pushes are debounced client
  // side; 60/min is far above any legitimate cadence).
  const rl = rateLimit(`prog:${me.id}`, 60, 60_000);
  if (!rl.allowed) return jsonError('PYRATELIMIT', 429, { retryAfterSec: rl.retryAfterSec });

  const body = await readJson(req, MAX_BODY);
  if (!body) return jsonError('PYBADBODY', 400);
  const parsed = progressBodySchema.safeParse(body);
  if (!parsed.success) return jsonError('PYBADFIELD', 400);
  const { base, certification, newXpEvents } = parsed.data;

  // SYNC-001: canonicalize BEFORE persisting — fake ids dropped, amounts
  // forced into the canonical XP envelope, dangerous record keys stripped.
  const progress = sanitizeProgressSnapshot(parsed.data.progress, CANONICAL_LESSONS);
  if (!progress) return jsonError('PYBADFIELD', 400);
  const certSanitized =
    certification !== undefined ? sanitizeCertificationSnapshot(certification) : undefined;

  const current = await db.progress.findUnique({ where: { userId: me.id } });

  // Optimistic concurrency: another device wrote since our last sync.
  if (current && base !== undefined && current.updatedAt.getTime() > base) {
    return jsonError('PYCONFLICT', 409, { updatedAt: current.updatedAt.getTime() });
  }

  const data = {
    version: progress.version,
    completedLessons: progress.completedLessons,
    exerciseResults: progress.exerciseResults,
    notes: progress.notes,
    lessonStarted: progress.lessonStarted,
    settings: progress.settings,
    ...(certSanitized !== null && certification !== undefined ? { certification: certSanitized } : {}),
  };

  await db.progress.upsert({
    where: { userId: me.id },
    create: { userId: me.id, ...data },
    update: data,
  });

  if (newXpEvents && newXpEvents.length) {
    // (userId, id) is the client's idempotency key — replays dedupe here.
    // Only canonical events (valid id shape + canonical lesson + reason
    // consistency) reach the ledger, with clamped amounts.
    const sanitizedEvents = newXpEvents
      .map((e) => sanitizeXpEvent(e, CANONICAL_LESSONS))
      .filter((e): e is NonNullable<typeof e> => e !== null);
    if (sanitizedEvents.length) {
      await db.xpEvent.createMany({
        data: sanitizedEvents.map((e) => ({
          userId: me.id,
          id: e.id,
          amount: e.amount,
          reason: e.reason,
          ts: new Date(e.ts),
        })),
        skipDuplicates: true,
      });
    }
  }

  // Return authoritative state (authoritative XP derived from the ledger).
  const fresh = await db.progress.findUnique({
    where: { userId: me.id },
    include: { user: { select: { xpEvents: { select: { amount: true } } } } },
  });
  if (!fresh) return jsonError('PYSERVER', 500);
  const events = await db.xpEvent.findMany({
    where: { userId: me.id },
    select: { id: true, amount: true, reason: true, ts: true },
    orderBy: { ts: 'asc' },
  });
  const xp = fresh.user.xpEvents.reduce((sum, e) => sum + Number(e.amount), 0);
  return NextResponse.json({
    ...wireFromRow(fresh),
    xpEvents: events.map((e) => ({ id: e.id, amount: e.amount, reason: e.reason, ts: e.ts.getTime() })),
    xp,
  });
}

export async function DELETE(req: Request) {
  if (!sameOrigin(req)) return jsonError('PYBADORIGIN', 403);
  const me = await requireSession();
  if (!me) return jsonError('PYANON', 401);
  const rl = rateLimit(`prog-del:${me.id}:${clientIp(req)}`, 10, 60_000);
  if (!rl.allowed) return jsonError('PYRATELIMIT', 429, { retryAfterSec: rl.retryAfterSec });
  await db.progress.delete({ where: { userId: me.id } }).catch(() => undefined);
  await db.xpEvent.deleteMany({ where: { userId: me.id } });
  return NextResponse.json({ ok: true });
}
