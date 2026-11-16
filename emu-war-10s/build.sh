#!/bin/sh
# One-command rebuild of "The Great Emu War" (10 s). Needs the Lemo-Opuscar library with the core, voice and music tiers,
# and the vsco2ce + vcsl sample packs (sh tools/fetch.sh instruments vsco2ce; ... vcsl).
set -e
LIB=${LIB:-/root/lemo-opuscar}
HERE=$(cd "$(dirname "$0")" && pwd)
export LIB
[ -f "$LIB/core/render/video.mjs" ] || { echo "set LIB to the library folder"; exit 1; }
cd "$LIB"
.venv/bin/python core/tts/tts.py "$HERE/lines.json" "$HERE/voices"
node core/render/events.mjs "$HERE"
.venv/bin/python "$HERE/music/score.py"
.venv/bin/python "$HERE/mix.py"
.venv/bin/python core/render/srt.py "$HERE/cues.json" "$HERE/emu-war-10s.srt"
node core/render/video.mjs "$HERE" --fps 24 --workers 3 --out "$HERE/out/video.mp4"
# core/render/mux.sh needs ffmpeg 7+; with ffmpeg 6.x use the equivalent mux6.sh
if ffmpeg -version | head -1 | grep -qE 'version n?([7-9]|[1-9][0-9])\.'; then
  sh core/render/mux.sh "$HERE/out/video.mp4" "$HERE/out/mix.wav" "$HERE/emu-war-10s.mp4" 24 3
else
  sh "$HERE/mux6.sh" "$HERE/out/video.mp4" "$HERE/out/mix.wav" "$HERE/emu-war-10s.mp4" 24 3
fi
ffmpeg -hide_banner -loglevel error -y -ss 7.05 -i "$HERE/emu-war-10s.mp4" -frames:v 1 -q:v 2 "$HERE/poster.jpg"
