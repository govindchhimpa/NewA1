#!/bin/sh
# mux6.sh — the same master as core/render/mux.sh (two-pass loudnorm to -14 LUFS / TP -1.2, limiter, grain 3, x264 crf 19, AAC 256k),
# written for ffmpeg 6.x, whose loudnorm under-reports audio length and makes mux.sh refuse the file.
set -e
V=$1; A=$2; O=$3; FPS=${4:-24}; GR=${5:-3}
M=$(ffmpeg -hide_banner -nostats -i "$A" -af loudnorm=I=-14:TP=-1.2:LRA=11:print_format=json -f null - 2>&1 | sed -n '/^{/,/^}/p')
g() { echo "$M" | sed -n "s/.*\"$1\" : \"\(.*\)\".*/\1/p"; }
LN="loudnorm=I=-14:TP=-1.2:LRA=11:measured_I=$(g input_i):measured_TP=$(g input_tp):measured_LRA=$(g input_lra):measured_thresh=$(g input_thresh):offset=$(g target_offset):linear=true"
ffmpeg -hide_banner -loglevel error -y -i "$A" -af "$LN,aresample=192000,alimiter=limit=0.83:attack=10:release=200:level=disabled,aresample=48000" -c:a pcm_f32le "${A%.wav}_norm.wav"
ffmpeg -hide_banner -loglevel error -y -i "$V" -i "${A%.wav}_norm.wav" -map 0:v -map 1:a -vf "fps=$FPS,noise=c0s=$GR:allf=t" \
  -c:v libx264 -preset slow -crf 19 -pix_fmt yuv420p -c:a aac -b:a 256k -movflags +faststart -shortest "$O"
ffmpeg -hide_banner -nostats -i "$O" -af ebur128=peak=true -f null - 2>&1 | grep -E "^\s+(I|True peak|Peak):" | head -3
