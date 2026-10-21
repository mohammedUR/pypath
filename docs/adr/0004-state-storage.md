# ADR-0004 — Progress state storage
**Context:** R-ARC-01: client-side IndexedDB, versioned schemas, no mandatory account.
**Decision:** IndexedDB via `idb-keyval` with a single namespaced store per domain: `progress:{userId=local}` documents (lessonState, skillMastery, srsCards, xpLedger, settings, notes). Schema version field + migration functions. Export/import = versioned JSON (R-GAM-05). XP ledger append-only + idempotent event IDs (R-GAM-04).
**Consequences:** Privacy by default (no data leaves device, R-ARC-10); one-click delete = dropdb; optional sync deferred (ADR-0001).
