#!/bin/bash
# usage: gl_asm.sh <projdir> <body.js> <scene_out.js> <title> <bg> <credit> <DUR>
set -e
D=$1; cd /home/claude
{ cat gl_head.js; cat $D/scenes/$2; cat gl_tail.js; echo '})();'; } > $D/scenes/$3
cat > $D/index.html <<HTML
<!doctype html>
<meta charset="utf-8">
<title>$4</title>
<body style="margin:0;background:#000">
<canvas id="c" width="1080" height="1920"></canvas>
<script>window.__BG='$5';window.__CREDIT='$6';</script>
<script src="lib/core.js"></script>
<script src="data/tiers.js"></script>
<script src="data/words.js"></script>
<script src="data/caps.js"></script>
<script src="scenes/$3"></script>
<script>
var _files={},_n=0,_d=0;
TIERS.forEach(function(t){t.pieces.forEach(function(p){_files[p.file]=1;});});
_n+=Object.keys(_files).length;
function _ok(){if(++_d>=_n)V.ready=true;}
var _im={};Object.keys(_files).forEach(function(f){var g=new Image();g.onload=_ok;g.onerror=function(){console.error('tile fail '+f);};g.src='tiles/'+f+'.jpg';_im[f]=g;});
V.tiers=TIERS.map(function(t){return {name:t.name,always:!!t.always,bb:t.bb,pieces:t.pieces.map(function(p){return {img:_im[p.file],bb:p.bb};})};});
</script>
</body>
HTML
sed -i "s/DUR: [0-9.]*,/DUR: $7,/; s/s1: \[0, [0-9.]*\]/s1: [0, $7]/" $D/lib/core.js
# tiles: raw jpg -> web jpg q92 (keep size)
python3 - <<PY
import glob,os
from PIL import Image
Image.MAX_IMAGE_PIXELS=None
for f in glob.glob('$D/tiles_raw/*.jpg'):
    o='$D/tiles/'+os.path.basename(f)
    if not os.path.exists(o): Image.open(f).convert('RGB').save(o,quality=92)
PY
grep -o "DUR: [0-9.]*\|s1: \[0, [0-9.]*\]" $D/lib/core.js
