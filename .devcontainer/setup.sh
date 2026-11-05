#!/usr/bin/env bash
# Runs once when the Codespace is created: download, install and build FreeLLMAPI.
set -euo pipefail
APP_DIR="$HOME/freellmapi"
if [ ! -d "$APP_DIR" ]; then
  git clone --depth 1 https://github.com/tashfeenahmed/freellmapi.git "$APP_DIR"
fi
cd "$APP_DIR"
if [ ! -f .env ]; then
  KEY="$(node -e 'console.log(require("crypto").randomBytes(32).toString("hex"))')"
  printf "ENCRYPTION_KEY=%s\nPORT=3001\n" "$KEY" > .env
  chmod 600 .env
fi
npm install --no-audit --no-fund
npm run build
