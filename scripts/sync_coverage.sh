#!/usr/bin/env bash
# Sync curriculum/coverage.json -> public/data/coverage.json (single source of truth).
set -euo pipefail
cd "$(dirname "$0")/.."
mkdir -p public/data
cp curriculum/coverage.json public/data/coverage.json
echo "synced: public/data/coverage.json ($(wc -c < public/data/coverage.json) bytes)"
