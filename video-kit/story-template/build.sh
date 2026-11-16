#!/bin/bash
set -e
cd "$(dirname "$0")"; mkdir -p out
tools/run.sh export_cues.js
python3 audio/build.py | tail -1
tools/run.sh render.js --from 0 --to 918 --jobs 2 --out out/video_silent.mp4 2>&1 | tail -c 100; echo
ffmpeg -y -v error -i out/video_silent.mp4 -i out/audio.wav -c:v copy -af loudnorm=I=-14:TP=-1.5:LRA=9 -c:a aac -b:a 192k -shortest out/lemaitre.mp4
python3 tools/qa.py out/lemaitre.mp4 > out/qa_stdout.txt; head -6 out/qa_stdout.txt
