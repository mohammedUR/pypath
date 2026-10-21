# Gamification — system and formulas (R-GAM-01)

**Single source of truth for every number: `src/lib/gamification/config.ts`.** No magic numbers in components. Calm by design: XP is a gentle whisper, never a slot machine.

## 1. XP awards (verified outcomes only — never for clicks or time)

| Event | XP | Config key |
|-------|----|-----------|
| Exercise passed on the first attempt | 20 | `XP_PER_EXERCISE.firstTry` |
| Exercise passed after retries | 10 | `XP_PER_EXERCISE.retry` |
| Debug challenge fixed | 15 | `XP_PER_EXERCISE.debug` |
| Quiz item correct | 5 | `XP_PER_EXERCISE.quizItem` |
| Lesson completed (all required exercises passed) | 30 | `XP_PER_EXERCISE.lessonComplete` |

- Hint cost: **−5 XP per revealed hint** (`HINT_XP_PENALTY`), floored so an exercise can never award less than **5** (`HINT_XP_FLOOR`). Hints never block completion.
- The full solution button unlocks after **2 failed attempts** (`SOLUTION_UNLOCK_ATTEMPTS`).
- Repeating the same exercise never re-awards (idempotent ledger); review rewards are capped via `REVIEW_QUEUE_CAP = 20` items/day.

## 2. Level curve (smooth, documented)

```
level(xp)      = floor(sqrt(xp / 50))
xpForLevel(L)  = 50 · L²        → L1 @ 50, L2 @ 200, L3 @ 450, L4 @ 800, L5 @ 1250 …
ring progress  = (xp − 50L²) / (50(L+1)² − 50L²)
```

The ring (`levelProgress`) shows `into/span` so learners always see exact numbers — no hidden meters.

## 3. Daily plan

`DAILY_GOAL_LESSONS = 2` — the dashboard suggests the next two incomplete lessons in manifest order, filtered to prerequisite-unlocked ones. A suggestion, never a countdown.

## 4. Calm & Focus (R-GAM-03)

- **Calm Mode** (Settings, persisted): hides XP numbers, badges and ceremonies; keeps mastery rings. A learner in Calm still accrues XP silently (ledger intact).
- **Reduce Motion**: honors `prefers-reduced-motion` by default, override in Settings; drives a `data-reduce-motion` attribute consumed by CSS (no JS animation loops).
- No loss-aversion patterns anywhere: streaks never erase progress, missed days never punish; no guilt copy in either locale.
- No leaderboards. Only a private "personal best" comparison.

## 5. Integrity (R-GAM-04)

- The XP ledger is **append-only and event-sourced** (`useProgress.xpLedger`): each entry `{ reason, amount, lessonId, at }`.
- Derived state (level, ring, totals) is recomputable from the ledger at any time.
- Event ids make replays idempotent — duplicated events are dropped.
- Export/import (Settings) round-trips the ledger + SRS + settings as versioned JSON with schema migration hooks.

## 6. Certification (M2, signed proofs in M6+)

- **Python Professional exam**: 16 items drawn per attempt from a 52-item bilingual bank, 20-minute timer, pass ≥ 80% (R-GRD-04 per-attempt variants). Timer is per-attempt state, dismissible to the background, never a lesson pressure.
- **Capstone studio**: 6 artifacts with a 5-criterion rubric; Part II gate = capstone readiness ≥ 80% + exam pass.
- **Gate mode (OQ closed by shipped setting)**: `advisory` (default) or `enforced` — a learner-facing toggle in Settings; enforced additionally restricts the Part II world until the certification gate is met. The product decision is now delegated to the learner/instance owner instead of remaining open.
- **Signed certificate proof (R-GAM-02, OQ-7 closed with the documented safe default)**: on certification, the learner can issue a **signed JSON proof** — ECDSA P-256 + SHA-256 via WebCrypto (`src/lib/cert/proof.ts`). A key pair is generated locally on first issue (private key never leaves the device; public key embedded in every proof). The payload is hashed over a deterministic canonical JSON (sorted keys), so verification is byte-stable. `verifySignedProof` checks signature AND semantic gates (exam ≥ 80%, capstone ≥ 80) offline — no server involved. The proof file can be re-verified at any time via the "Verify an exported proof" file picker on the Capstone view.
- Honest scope of the signature: it proves integrity + origin (the payload was signed by the issuing device's key and not modified afterwards); the subject name is self-declared, so the proof is not a third-party identity claim. This is stated in the UI next to the issue button.
