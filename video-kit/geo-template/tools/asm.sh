#!/bin/bash
cd "$(dirname "$0")/.."
cat scenes/dv_a.js scenes/dv_b.js scenes/dv_c.js scenes/dv_d.js scenes/dv_e.js > scenes/s1_dv.js
node -e "new Function(require('fs').readFileSync('scenes/s1_dv.js','utf8'))" && echo SYNTAX OK
cp tiles_raw/d0.jpg tiles/d0.jpg; cp tiles_raw/d1.jpg tiles/d1.jpg; cp tiles_raw/d2.jpg tiles/d2.jpg
