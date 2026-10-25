#!/usr/bin/env bash
# Sync curriculum/coverage.json + content/manifest.json -> public/data/ (single source of truth).
# The app fetches /data/manifest.json (registry.ts); without this copy a reordered
# content/manifest.json never reaches the browser (Phase 1.5 defect).
set -euo pipefail
cd "$(dirname "$0")/.."
mkdir -p public/data
cp curriculum/coverage.json public/data/coverage.json
cp content/manifest.json public/data/manifest.json
echo "synced: public/data/coverage.json ($(wc -c < public/data/coverage.json) bytes)"
echo "synced: public/data/manifest.json ($(wc -c < public/data/manifest.json) bytes)"
