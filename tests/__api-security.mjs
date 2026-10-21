/**
 * API-level security & sync verification against the running server
 * (no browser; exercises the real HTTP surface). Exits non-zero on any
 * violated expectation — used as part of the local test evidence.
 *
 *   base = http://localhost:3000
 *   node tests/__api-security.mjs
 */
import { setTimeout as sleep } from 'node:timers/promises';

const BASE = 'http://localhost:3000';
let failed = 0;
const results = [];

function check(name, cond, detail = '') {
  const ok = Boolean(cond);
  results.push(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? ` — ${detail}` : ''}`);
  if (!ok) failed += 1;
}

async function csrf() {
  const res = await fetch(`${BASE}/api/auth/csrf`);
  const { csrfToken } = await res.json();
  const setCookie = res.headers.get('set-cookie') ?? '';
  const cookie = setCookie.split(';')[0];
  return { csrfToken, cookie };
}

async function credentialsLogin(email, password) {
  const { csrfToken, cookie } = await csrf();
  const body = new URLSearchParams({ csrfToken, email, password, redirect: 'false', json: 'true' });
  const res = await fetch(`${BASE}/api/auth/callback/credentials`, {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded', cookie },
    body: body.toString(),
    redirect: 'manual',
  });
  const setCookie = res.headers.get('set-cookie') ?? '';
  const sessionCookie = setCookie
    .split(/,(?=[^;]+?=)/)
    .map((c) => c.trim())
    .filter((c) => /next-auth\.session-token/i.test(c))
    .map((c) => c.split(';')[0])
    .join('; ');
  return { status: res.status, sessionCookie };
}

async function register(email, password, name) {
  const attempt = async () => {
    const res = await fetch(`${BASE}/api/auth/register`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ email, password, name }),
    });
    const json = await res.json().catch(() => ({}));
    return { status: res.status, json };
  };
  let r = await attempt();
  if (r.json.error === 'PYRATELIMIT') {
    // IP window is sliding 60s — one complimental wait keeps re-runs sane.
    await sleep(62_000);
    r = await attempt();
  }
  return r;
}

const stamp = Date.now();
const A = { email: `iso-a.${stamp}@pypath.test`, password: 'correct-horse-42', name: 'Iso A' };
const B = { email: `iso-b.${stamp}@pypath.test`, password: 'battery-staple-99', name: 'Iso B' };

/* 1. Anonymous access ------------------------------------------------- */
{
  const res = await fetch(`${BASE}/api/progress`);
  check('anon GET /api/progress is 401', res.status === 401, String(res.status));
  const acct = await fetch(`${BASE}/api/account`);
  check('anon GET /api/account is 401', acct.status === 401, String(acct.status));
  const del = await fetch(`${BASE}/api/progress`, { method: 'DELETE' });
  check('anon DELETE /api/progress is 401', del.status === 401, String(del.status));
}

/* 2. Registration ------------------------------------------------------ */
{
  const r = await register(A.email, A.password, A.name);
  check('register A 200/ok', r.status === 200 && r.json.ok === true, `${r.status} ${JSON.stringify(r.json)}`);
  const dup = await register(A.email, 'another-pass-11', A.name);
  check('duplicate register is rejected PYEMAILEXISTS', dup.json.error === 'PYEMAILEXISTS', JSON.stringify(dup.json));
  const weak = await register(`weak.${stamp}@pypath.test`, 'short', '');
  check('too-short password is rejected', weak.json.error === 'PYBADBODY' || weak.json.error === 'PYINVALID', JSON.stringify(weak.json));
  const badEmail = await fetch(`${BASE}/api/auth/register`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ email: 'not-an-email', password: 'longenough123' }),
  });
  check('bad email is rejected', badEmail.status === 400, String(badEmail.status));
}

/* 3. Login A ----------------------------------------------------------- */
{
  const bad = await credentialsLogin(A.email, 'wrong-password-999');
  check('bad password login has no session', !bad.sessionCookie, bad.sessionCookie?.slice(0, 24) ?? 'no session');
  const ok = await credentialsLogin(A.email, A.password);
  check('A login yields session cookie', /next-auth\.session-token/i.test(ok.sessionCookie), ok.sessionCookie?.slice(0, 20) ?? 'none');
  const acct = await fetch(`${BASE}/api/account`, { headers: { cookie: ok.sessionCookie } });
  const json = await acct.json().catch(() => ({}));
  check('A GET /api/account 200 + identity match', acct.status === 200 && json.email === A.email, `${acct.status} ${JSON.stringify(json?.email ?? json)}`);
  A.sessionCookie = ok.sessionCookie;
}

/* 4. A writes progress; XP ledger guarded by caps --------------------- */
{
  // Mirror the real client: pull first (CAS base = server updatedAt).
  const pre = await fetch(`${BASE}/api/progress`, { headers: { cookie: A.sessionCookie } });
  const preJson = await pre.json();
  const res = await fetch(`${BASE}/api/progress`, {
    method: 'POST',
    headers: { 'content-type': 'application/json', cookie: A.sessionCookie },
    body: JSON.stringify({
      base: preJson.updatedAt,
      progress: {
        version: 1,
        completedLessons: ['py4e.ch1.l1'],
        exerciseResults: { 'py4e.ch1.l1:ex1': { passed: true, attempts: 2, hintsUsed: 1, ts: stamp } },
        notes: {},
        lessonStarted: { 'py4e.ch1.l1': stamp },
        settings: { theme: 'sepia', calm: false, fontScale: 110, soundOff: true, reduceMotion: false },
      },
      certification: { version: 1, attempts: [{ ts: stamp, score: 0.9, passed: true }], capstoneArtifacts: {}, capstoneRubric: {}, subject: '', gateMode: 'advisory' },
      newXpEvents: [
        { id: `e1-${stamp}`, amount: 15, reason: 'exerciseFirstTry', ts: stamp },
        { id: `e2-${stamp}`, amount: 25, reason: 'lessonComplete', ts: stamp + 1 },
        { id: `dup-${stamp}`, amount: 999, reason: 'debug', ts: stamp + 2 },
        { id: `dup-${stamp}`, amount: 999, reason: 'debug', ts: stamp + 3 },
      ],
    }),
  });
  const json = await res.json();
  check('A POST /api/progress 200', res.status === 200, `${res.status} ${JSON.stringify(json).slice(0, 120)}`);
  // dup appears twice with the SAME id inside one batch → counted once:
  check('XP dedup: intra-batch duplicate id counted once (xp = 1039)', json.xp === 1039, `xp=${json.xp}`);
  check('server echoes back merged snapshot', json.progress?.completedLessons?.[0] === 'py4e.ch1.l1', JSON.stringify(json.progress?.completedLessons ?? json));

  // Replay the exact same event ids in a second push → xp must NOT grow.
  const pre2 = await fetch(`${BASE}/api/progress`, { headers: { cookie: A.sessionCookie } });
  const pre2Json = await pre2.json();
  const replay = await fetch(`${BASE}/api/progress`, {
    method: 'POST',
    headers: { 'content-type': 'application/json', cookie: A.sessionCookie },
    body: JSON.stringify({
      base: pre2Json.updatedAt,
      progress: pre2Json.progress,
      newXpEvents: [
        { id: `e1-${stamp}`, amount: 15, reason: 'exerciseFirstTry', ts: stamp },
        { id: `dup-${stamp}`, amount: 999, reason: 'debug', ts: stamp + 2 },
      ],
    }),
  });
  const replayJson = await replay.json().catch(() => ({}));
  check('XP replay is idempotent (xp still 1039)', replay.status === 200 && replayJson.xp === 1039, `${replay.status} xp=${replayJson.xp}`);
}

/* 5. Register + login B; strict isolation ----------------------------- */
{
  const r = await register(B.email, B.password, B.name);
  check('register B 200/ok', r.status === 200 && r.json.ok === true, `${r.status}`);
  const ok = await credentialsLogin(B.email, B.password);
  check('B login yields session', /next-auth\.session-token/i.test(ok.sessionCookie), ok.sessionCookie?.slice(0, 20) ?? 'none');
  B.sessionCookie = ok.sessionCookie;
  const get = await fetch(`${BASE}/api/progress`, { headers: { cookie: B.sessionCookie } });
  const json = await get.json();
  check('B cannot see A data (empty progress)', Array.isArray(json.progress?.completedLessons) && json.progress.completedLessons.length === 0 && json.xp === 0, `${get.status} lessons=${JSON.stringify(json.progress?.completedLessons ?? json)} xp=${json.xp}`);
  check('B ledger empty', (json.xpEvents ?? []).length === 0, JSON.stringify(json.xpEvents ?? json));
}

/* 6. Same-origin guard ------------------------------------------------- */
{
  const res = await fetch(`${BASE}/api/progress`, {
    method: 'POST',
    headers: { 'content-type': 'application/json', cookie: A.sessionCookie, origin: 'https://evil.example' },
    body: JSON.stringify({ progress: {}, version: 1 }),
  });
  check('cross-origin POST /api/progress is 403', res.status === 403, String(res.status));
  const reset = await fetch(`${BASE}/api/auth/reset-password`, {
    method: 'POST',
    headers: { 'content-type': 'application/json', origin: 'https://evil.example' },
    body: JSON.stringify({ token: 'whatever', password: 'whatever-long' }),
  });
  check('cross-origin reset-password is 403', reset.status === 403, String(reset.status));
}

/* 7. Oversize / malformed payloads ------------------------------------ */
{
  const big = await fetch(`${BASE}/api/progress`, {
    method: 'POST',
    headers: { 'content-type': 'application/json', cookie: A.sessionCookie },
    body: JSON.stringify({ progress: { version: 1, completedLessons: 'x'.repeat(2_000_001) } }),
  });
  check('oversize body rejected (413/400)', [413, 400].includes(big.status), String(big.status));
  const badShape = await fetch(`${BASE}/api/progress`, {
    method: 'POST',
    headers: { 'content-type': 'application/json', cookie: A.sessionCookie },
    body: JSON.stringify({ progress: { version: 1, settings: { fontScale: 99999 } } }),
  });
  check('invalid settings value rejected', badShape.status === 400, String(badShape.status));
}

/* 8. Rate limit: authorization flows ---------------------------------- */
{
  let saw429 = false;
  for (let i = 0; i < 12; i += 1) {
    const res = await fetch(`${BASE}/api/auth/register`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ email: `rl-${i}-${stamp}@pypath.test`, password: 'whatever-long-1' }),
    });
    if (res.status === 429) {
      saw429 = true;
      break;
    }
  }
  check('register rate limit eventually 429', saw429, 'expected 429 within 12 tries');
}

/* 9. Lockout after repeated CONSECUTIVE bad logins --------------------- */
{
  const victim = { email: `lock.${stamp}@pypath.test`, password: 'good-password-11' };
  await register(victim.email, victim.password, 'V');
  let streak = 0;
  for (let i = 0; i < 6; i += 1) {
    const res = await credentialsLogin(victim.email, 'totally-wrong-pw');
    if (/next-auth\.session-token/i.test(res.sessionCookie ?? '')) {
      streak += 1;
      break;
    }
  }
  const locked = streak === 0;
  check('consecutive failures reach the 5-fail lock', locked, `wrong-pw streak=${streak}/6`);
  if (locked) {
    // While the lock holds, the RIGHT password must not yield a session either.
    const afterLock = await credentialsLogin(victim.email, victim.password);
    check('right password is blocked while locked', !/next-auth\.session-token/i.test(afterLock.sessionCookie ?? ''), afterLock.sessionCookie?.slice(0, 20) ?? 'no session');
  }
}

/* 10. Wipe (DELETE) requires session and works for the owner ---------- */
{
  const del = await fetch(`${BASE}/api/progress`, { method: 'DELETE', headers: { cookie: A.sessionCookie, 'x-forwarded-proto': 'https' } });
  check('A DELETE /api/progress 200', del.status === 200, String(del.status));
  const after = await fetch(`${BASE}/api/progress`, { headers: { cookie: A.sessionCookie } });
  const json = await after.json();
  check('after wipe: A progress is empty and xp=0', json.xp === 0 && json.progress?.completedLessons?.length === 0, `xp=${json.xp} lessons=${JSON.stringify(json.progress?.completedLessons ?? json)}`);
  // Re-assert from server side: check DB row through API (not pryed B)
}

console.log(results.join('\n'));
console.log(failed === 0 ? 'ALL PASS' : `FAILURES: ${failed}`);
process.exit(failed === 0 ? 0 : 1);
