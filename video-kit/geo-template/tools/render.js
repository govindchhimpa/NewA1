// Render the composed video (V.renderFrame) to out/video_silent.mp4 via Playwright + ffmpeg.
//   tools/run.sh render.js [--from 0] [--to 900] [--step 1] [--out out/video_silent.mp4] [--jobs 2]
// --to is exclusive. Frame i is tGlobal=i/30. Output is always 30 fps (step>1 gives a fast-forward preview).
// Mux audio:  ffmpeg -y -i out/video_silent.mp4 -i out/audio.wav -c:v copy -c:a aac -b:a 192k -shortest out/vessa_promo.mp4
const { chromium } = require('playwright');
const { spawn, spawnSync } = require('child_process');
const path = require('path'), fs = require('fs');
const a = process.argv.slice(2), opt = { from: 0, to: 900, step: 1, out: 'out/video_silent.mp4', jobs: 2 };
for (let i = 0; i < a.length; i += 2) { const k = a[i].replace(/^--/, ''); opt[k] = k === 'out' ? a[i + 1] : +a[i + 1]; }
const frames = []; for (let i = opt.from; i < opt.to; i += opt.step) frames.push(i);
const jobs = Math.max(1, Math.min(opt.jobs, frames.length));
fs.mkdirSync(path.dirname(opt.out), { recursive: true });
const t0 = Date.now(); let done = 0;
function tick() { done++; if (done % 10 === 0 || done === frames.length) { const s = (Date.now() - t0) / 1000; process.stderr.write(`\r${done}/${frames.length} frames  ${(done / s).toFixed(2)} fps  ${s.toFixed(0)}s `); } }
async function work(list, outFile) {
  const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-c:v', 'png', '-framerate', '30', '-i', '-',
    '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '16', '-preset', 'veryfast', '-r', '30', '-movflags', '+faststart', outFile], { stdio: ['pipe', 'inherit', 'inherit'] });
  const fin = new Promise(r => ff.on('close', r));
  const b = await chromium.launch({args:['--allow-file-access-from-files']}); const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
  p.on('pageerror', e => console.error('\nPAGE ERROR:', e.message));
  await p.goto('file://' + path.resolve('index.html'));
  await p.waitForFunction('window.V && window.V.ready', null, { timeout: 15000 });
  await p.evaluate(() => document.fonts && document.fonts.ready);
  for (const i of list) {
    const url = await p.evaluate(i => {
      const c = document.getElementById('c'), ctx = c.getContext('2d');
      ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over'; ctx.clearRect(0, 0, c.width, c.height);
      V.renderFrame(ctx, i / 30); return c.toDataURL('image/png');
    }, i);
    if (!ff.stdin.write(Buffer.from(url.slice(22), 'base64'))) await new Promise(r => ff.stdin.once('drain', r));
    tick();
  }
  ff.stdin.end(); await b.close(); await fin;
}
(async () => {
  if (jobs === 1) { await work(frames, opt.out); }
  else {
    const n = Math.ceil(frames.length / jobs), dir = opt.out + '.parts'; fs.mkdirSync(dir, { recursive: true });
    const parts = []; const ps = [];
    for (let j = 0; j < jobs; j++) { const l = frames.slice(j * n, (j + 1) * n); if (!l.length) continue; const f = path.resolve(dir, `p${j}.mp4`); parts.push(f); ps.push(work(l, f)); }
    await Promise.all(ps);
    const lst = path.join(dir, 'list.txt'); fs.writeFileSync(lst, parts.map(f => `file '${f}'`).join('\n'));
    const r = spawnSync('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'concat', '-safe', '0', '-i', lst, '-c', 'copy', '-movflags', '+faststart', opt.out], { stdio: 'inherit' });
    if (r.status) process.exit(1);
    fs.rmSync(dir, { recursive: true, force: true });
  }
  console.error(`\nwrote ${opt.out} (${frames.length} frames)`);
})().catch(e => { console.error(e); process.exit(1); });
