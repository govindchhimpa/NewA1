// Collect every scene's sound cues into one list with global times: out/cues.json
//   tools/run.sh export_cues.js
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage();
  p.on('pageerror', e => console.error('PAGE ERROR:', e.message));
  await p.goto('file://' + path.resolve('index.html'));
  await p.waitForFunction('window.V && window.V.ready', null, { timeout: 15000 });
  const cues = await p.evaluate(() => V.scenes.flatMap(s => (s.cues || []).map(c => ({ t: +(s.start + c.t).toFixed(3), name: c.name, vol: c.vol === undefined ? 1 : c.vol, dur: c.dur || 0, file: c.file, scene: s.id }))).sort((a, b) => a.t - b.t));
  fs.mkdirSync('out', { recursive: true });
  fs.writeFileSync('out/cues.json', JSON.stringify(cues, null, 1));
  console.log(cues.length + ' cues -> out/cues.json');
  await b.close();
})();
