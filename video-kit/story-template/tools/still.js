// Render stills of one scene, or of the composed video, to PNG.
//   tools/run.sh still.js scene s3 0,1.5,3 out/stills/agent4     -> out/stills/agent4/s3_t0.00.png ...
//   tools/run.sh still.js global - 0,5.9,6.1 out/stills/agent10  -> .../g_t0.00.png ...  (uses V.renderFrame, with transitions)
// Scene times are local seconds (0..duration). Global times are 0..30.
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');
(async () => {
  const [mode, id, times, outDir = 'out/stills'] = process.argv.slice(2);
  if (!mode || !times) { console.error('usage: still.js <scene|global> <sceneId|-> <t1,t2,...> [outDir]'); process.exit(2); }
  fs.mkdirSync(outDir, { recursive: true });
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
  let bad = 0;
  p.on('pageerror', e => { bad++; console.error('PAGE ERROR:', e.message); });
  p.on('console', m => { if (m.type() === 'error' || m.type() === 'warning') console.error('console.' + m.type() + ':', m.text()); });
  await p.goto('file://' + path.resolve('index.html'));
  await p.waitForFunction('window.V && window.V.ready', null, { timeout: 15000 });
  for (const t of times.split(',').map(Number)) {
    let url;
    try {
      url = await p.evaluate(([mode, id, t]) => {
        const c = document.getElementById('c'), ctx = c.getContext('2d');
        ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over'; ctx.clearRect(0, 0, c.width, c.height);
        if (mode === 'scene') V.drawScene(ctx, id, t); else V.renderFrame(ctx, t);
        return c.toDataURL('image/png');
      }, [mode, id, t]);
    } catch (e) { bad++; console.error('DRAW ERROR at t=' + t + ':', e.message.split('\n')[0]); continue; }
    const f = path.join(outDir, (mode === 'scene' ? id : 'g') + '_t' + t.toFixed(2) + '.png');
    fs.writeFileSync(f, Buffer.from(url.split(',')[1], 'base64'));
    console.log(f);
  }
  await b.close();
  process.exit(bad ? 1 : 0);
})();
