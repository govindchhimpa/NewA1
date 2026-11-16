#!/bin/bash
# usage: wur_asm.sh <proj> <title> <KWY regex> <KWR regex> <DUR> <frames> <outname>
set -e; cd /home/claude; D=$1
{ cat wur_head.js; cat $D/scenes/body.js; cat wur_tail.js
  cat <<'JS'
  var cues = [{ t: OFF, name: 'voice', file: 'voice' }];
  function cc(x, n, v, d) { var c = { t: T(x), name: n, vol: v }; if (d) c.dur = d; cues.push(c); }
  S.forEach(function (s, i) {
    if (i > 0) { var tn = { whip: 'swish', zoom: 'whoosh', iris: 'pop', slide: 'swish', flash: 'whoosh', cut: '' }[s.tr]; if (tn) cc(s.a - 0.04, tn, tn === 'pop' ? 0.4 : 0.34); }
    if (s.amb) cc(s.a, { night: 'crickets', birds: 'birds', room: 'room', crowd: 'crowd', applause: 'applause', pen: 'pen' }[s.amb], { night: 0.35, birds: 0.4, room: 0.25, crowd: 0.35, applause: 0.5, pen: 0.35 }[s.amb], s.b - s.a + 0.3);
  });
JS
  cat $D/scenes/cues.js; echo "  V.defineScene('s1', { cues: cues, draw: draw });"; echo "})();"; } > $D/scenes/s1_story.js
cat > $D/index.html <<HTML
<!doctype html>
<meta charset="utf-8">
<title>$2</title>
<body style="margin:0;background:#000">
<canvas id="c" width="1080" height="1920"></canvas>
<script>window.__KWY=/^($3)\$/;window.__KWR=/^($4)\$/;</script>
<script src="lib/core.js"></script>
<script src="data/caps.js"></script>
<script src="data/words.js"></script>
<script src="scenes/chars.js"></script>
<script src="scenes/people.js"></script>
<script src="scenes/s1_story.js"></script>
<script>V.ready = true;</script>
</body>
HTML
sed -i "s/DUR: [0-9.]*,/DUR: $5,/; s/s1: \[0, [0-9.]*\]/s1: [0, $5]/" $D/lib/core.js
sed "s/--to 978/--to $6/; s/nemo.mp4/$7.mp4/g" geo-nemo/build.sh > $D/build.sh; chmod +x $D/build.sh
node --check $D/scenes/s1_story.js && echo ok
