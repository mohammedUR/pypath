import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireSession } from '@/lib/auth/session';
import { progressBodySchema } from '@/lib/sync/schema';
import { jsonError, readJson, sameOrigin } from '@/lib/api/guards';

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
 */

const MAX_BODY = 2 * 1024 * 1024;

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

  const body = await readJson(req, MAX_BODY);
  if (!body) return jsonError('PYBADBODY', 400);
  const parsed = progressBodySchema.safeParse(body);
  if (!parsed.success) return jsonError('PYBADFIELD', 400);
  const { base, progress, certification, newXpEvents } = parsed.data;

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
    ...(certification !== undefined ? { certification } : {}),
  };

  await db.progress.upsert({
    where: { userId: me.id },
    create: { userId: me.id, ...data },
    update: data,
  });

  if (newXpEvents && newXpEvents.length) {
    // (userId, id) is the client's idempotency key — replays dedupe here.
    await db.xpEvent.createMany({
      data: newXpEvents.map((e) => ({
        userId: me.id,
        id: e.id,
        amount: e.amount,
        reason: e.reason,
        ts: new Date(e.ts),
      })),
      skipDuplicates: true,
    });
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

export async function DELETE() {
  const me = await requireSession();
  if (!me) return jsonError('PYANON', 401);
  await db.progress.delete({ where: { userId: me.id } }).catch(() => undefined);
  await db.xpEvent.deleteMany({ where: { userId: me.id } });
  return NextResponse.json({ ok: true });
}
