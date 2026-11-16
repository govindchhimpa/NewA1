#!/bin/bash
# usage: gl_audio.sh <proj> <DUR> "<python render call args>"
D=/home/claude/$1
sed -i "s/^SR = 44100; DUR = [0-9.]*;/SR = 44100; DUR = $2;/; s#^VLIB=.*#VLIB='$D/audio_src'#; s/import sfx, music4 as music/import sfx, music_new as music/; s/import sfx, music3 as music/import sfx, music_new as music/" $D/audio/build.py
cat > $D/audio/music_new.py <<PY
import sys; sys.path.insert(0, '/home/claude'); import score
def render(): return score.render($2, $3)
PY
grep -n "^SR\|^VLIB\|import sfx" $D/audio/build.py
