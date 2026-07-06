#!/usr/bin/env bash
set -euo pipefail
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR/mobile"
exec "$SCRIPT_DIR/mobile/node_modules/.bin/expo" start -c
