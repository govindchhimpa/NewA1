  function hud(ctx, vt) {
    var h = hudAt(vt); if (!h || !h[1]) return; var str = h[1], a = V.clamp((vt - h[0]) / 0.3 + 0.4), num = h[2] === 'num'; ctx.save(); ctx.globalAlpha = Math.min(1, a); var w = V.textWidth(ctx, str, { size: 84, weight: 900, tracking: 2 }) + 70; ctx.shadowColor = 'rgba(0,0,0,0.5)'; ctx.shadowBlur = 14; V.rr(ctx, W / 2 - w / 2, 150, w, 112, 56); ctx.fillStyle = 'rgba(10,18,34,0.82)'; ctx.fill(); ctx.shadowColor = 'transparent'; ctx.lineWidth = 4; ctx.strokeStyle = num ? '#ffd23f' : '#7fd8ff'; ctx.stroke(); V.text(ctx, str, W / 2, 232, { size: 84, weight: 900, tracking: 2, color: num ? '#ffd23f' : '#7fd8ff' }); ctx.restore();
  }
  var CG = (function () {
    var g = [], cur = [], i, w, st = WS.map(function (x) { return (x[2] - x[1] > 1.2) ? x[2] - 0.3 : x[1]; });
    function flush() { if (!cur.length) return; g.push({ w: cur.map(function (k) { return WS[k][0].replace(/[,.?!;:"]/g, '').toUpperCase(); }), s: cur.map(function (k) { return st[k] + OFF; }), a: st[cur[0]] + OFF, e: WS[cur[cur.length - 1]][2] + OFF }); cur = []; }
    for (i = 0; i < WS.length; i++) { cur.push(i); w = WS[i][0]; if (cur.length >= 3 || /[,.?!;:]$/.test(w)) flush(); }
    flush();
    for (i = 0; i < g.length - 1; i++) { var gap = g[i + 1].a - g[i].e; g[i].e = gap < 0.7 ? g[i + 1].a : g[i].e + 0.15; }
    g[g.length - 1].e += 0.4; return g;
  })();
  function caption(ctx, t) {
    var g2 = ctx.createLinearGradient(0, 1180, 0, 1560); g2.addColorStop(0, 'rgba(5,12,26,0)'); g2.addColorStop(0.55, 'rgba(5,12,26,0.45)'); g2.addColorStop(1, 'rgba(5,12,26,0)'); ctx.fillStyle = g2; ctx.fillRect(0, 1180, W, 380);
    var cur = null; for (var q = 0; q < CG.length; q++) if (t >= CG[q].a && t < CG[q].e) { cur = CG[q]; break; }
    if (!cur) return; var words = cur.w, starts = cur.s;
    var oo = { size: 88, weight: 900, tracking: 2 }, ws = words.map(function (w) { return V.textWidth(ctx, w, oo); }), sp = V.textWidth(ctx, ' ', oo) + 16, total = ws.reduce(function (a, b) { return a + b; }, 0) + sp * (words.length - 1);
    var fit = Math.min(1, 960 / total), lu = V.clamp((t - cur.a) / 0.12), ls = (0.86 + 0.14 * E.outBack(lu)) * fit, act = 0; for (var i2 = 0; i2 < words.length; i2++) if (t >= starts[i2]) act = i2;
    ctx.save(); ctx.translate(W / 2, 1345); ctx.scale(ls, ls); ctx.globalAlpha = lu; var x = -total / 2;
    for (var j = 0; j < words.length; j++) { var hot = j === act, num = /\d/.test(words[j]), pp = hot ? 1 + 0.10 * Math.max(0, 1 - (t - starts[j]) / 0.16) : 1; ctx.save(); ctx.translate(x + ws[j] / 2, 0); ctx.scale(pp, pp); V.text(ctx, words[j], 0, 0, { size: 88, weight: 900, tracking: 2, align: 'center', color: (hot || num) ? '#ffd400' : '#ffffff', stroke: '#050505', strokeW: 15, shadow: ['rgba(0,0,0,0.55)', 14, 0, 6] }); ctx.restore(); x += ws[j] + sp; }
    ctx.restore();
  }
  function draw(ctx, t) {
    var vt = t - OFF, sm0 = shakeAt(vt); CAM = cam(vt); SX = sm0 * (Math.sin(vt * 47) + 0.6 * Math.sin(vt * 71 + 1)); SY = sm0 * (Math.cos(vt * 53) + 0.6 * Math.sin(vt * 83 + 2)); base(ctx, vt);
    for (var zz = -1; zz < 3; zz++) for (var i = 0; i < EV.length; i++) { var e = EV[i]; if ((e.z || 0) !== zz) continue; if (vt >= e.a - 0.05 && vt <= e.b + 0.5) { ctx.save(); e.fn(ctx, vt, e.a, e.b); ctx.restore(); } }
    SX = 0; SY = 0; hud(ctx, vt); caption(ctx, t);
    V.text(ctx, window.__CREDIT || 'Sentinel-2 cloudless by EOX (CC BY 4.0)', W / 2, 1884, { size: 21, weight: 600, align: 'center', color: 'rgba(255,255,255,0.75)', stroke: '#050505', strokeW: 4 });
    var vg = ctx.createRadialGradient(W / 2, H / 2, 650, W / 2, H / 2, 1250); vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, 'rgba(0,0,0,0.36)'); ctx.fillStyle = vg; ctx.fillRect(0, 0, W, H);
  }
  KEYS.forEach(function (k, i) { if (i > 0 && k.g > 1) cue(k.t - k.g, 'whoosh', 0.25); });
  window.__T = t; V.defineScene('s1', { cues: CUES, draw: draw });
