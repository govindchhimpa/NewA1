#!/usr/bin/env bash
# Runs every time the Codespace starts: launch the FreeLLMAPI server in the background.
APP_DIR="$HOME/freellmapi"
cd "$APP_DIR" || exit 0
if ! curl -s -o /dev/null http://localhost:3001/; then
  nohup npm start -w server > "$APP_DIR/server.log" 2>&1 &
fi
