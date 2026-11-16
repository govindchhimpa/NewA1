
  /* ================= MANICOUAGAN ================= */
  var C0 = [-68.73, 51.39], KLAT = 1 / Math.cos(51.39 * R), RD = 0.272;
  function circ(r) { var p = []; for (var i = 0; i <= 90; i++) { var a = i / 90 * 6.2832 - 1.57; p.push([C0[0] + r * Math.cos(a) * KLAT, C0[1] + r * Math.sin(a)]); } return p; }
  var RING = circ(RD), t = {};
  t.ring = at('perfect ring'); t.and = at('and it was'); t.water = at('water'); t.years = at('two hundred fourteen'); t.ast = at('an asteroid'); t.hit = at('hit canada'); t.crater = at('the crater filled'); t.left = at('and left a ring'); t.seventy = at('seventy'); t.scar = at('a scar'); t.older = at('older than'); t.rex = at('rex');
  var END = WS[WS.length - 1][2];
  key(0, C0[0], C0[1], 1.25);
  key(t.years + 0.5, -69.5, 52.6, 16.5, 1.3);
  key(t.crater + 0.5, C0[0], C0[1], 1.5, 1.3);
  key(END + 0.8, C0[0], C0[1], 1.15, END - t.crater);
  dim(0, 0); dim(t.years, 0.1); dim(t.crater, 0);
  hudk(t.years + 0.1, '214 MILLION YEARS', 'num'); hudk(t.crater - 0.1, ''); hudk(t.seventy, '70 KM ACROSS', 'num'); hudk(t.scar - 0.1, '');
  shk(t.hit + 0.25, t.hit + 1.1, 18); shk(t.rex, t.rex + 0.5, 8);
  C(0.05, t.and - 0.1, 'A PERFECT RING', { size: 62, fill: '#ffd23f' });
  C(t.and, t.years - 0.15, 'NOT MADE BY WATER', { size: 58, fill: '#fff' });
  C(t.ast, t.crater - 0.15, 'A 5 KM ASTEROID HITS CANADA', { size: 46, fill: '#ff9f43', col: '#10243a' });
  C(t.crater, t.scar - 0.15, 'THE CRATER FILLED UP', { size: 54, fill: '#7fd8ff', col: '#10243a' });
  C(t.scar, t.older - 0.1, 'A SCAR FROM SPACE', { size: 60, fill: '#fff' });
  C(t.older, END + 3, 'OLDER THAN T. REX', { size: 62, fill: '#ff5a5f', col: '#fff' });
  function trace(ctx, vt, a0, dur, alpha) { var pr = sm01(a0, a0 + dur, vt); if (pr <= 0) return; ctx.save(); ctx.globalAlpha *= alpha; var tip = growLine(ctx, RING, pr, '#ffd23f', 8, '#ffd23f', null); if (tip && pr < 1) { V.circle(ctx, tip[0], tip[1], 12); ctx.fillStyle = '#fff'; ctx.fill(); } ctx.restore(); }
  ev(0.2, t.years, function (ctx, vt) { trace(ctx, vt, 0.3, 1.5, fadeIO(vt, 0.2, t.years, 0.1, 0.4)); });
  cue(0.3, 'riser', 0.3, 1.4); cue(t.ring + 0.5, 'ding', 0.45); cue(t.water, 'thud', 0.5); cue(t.years, 'whoosh', 0.4);
  /* the impact */
  ev(t.years + 0.3, t.crater + 0.3, function (ctx, vt) {
    var p = P(C0[0], C0[1]), hit = t.hit + 0.25, u = V.clamp((vt - (hit - 0.9)) / 0.9), a = fadeIO(vt, t.years + 0.3, t.crater + 0.3, 0.2, 0.3);
    pin(ctx, C0[0], C0[1], a * (vt < hit ? 1 : 0), '#ffd23f', 12); label(ctx, 'CANADA', -72, 55.5, { size: 60, tr: 14, col: '#ffffff', a: a * 0.8 });
    ctx.save(); ctx.globalAlpha = a;
    if (u > 0 && u < 1) { var x = lerp(p[0] + 600, p[0], u * u), y = lerp(p[1] - 1050, p[1], u * u), g = ctx.createLinearGradient(x, y, x + 260, y - 455); g.addColorStop(0, 'rgba(255,240,190,1)'); g.addColorStop(0.3, 'rgba(255,130,40,0.8)'); g.addColorStop(1, 'rgba(255,60,10,0)'); ctx.globalCompositeOperation = 'lighter'; ctx.strokeStyle = g; ctx.lineWidth = 64; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + 260, y - 455); ctx.stroke(); ctx.globalCompositeOperation = 'source-over'; V.circle(ctx, x, y, 30); ctx.fillStyle = '#3a2a22'; ctx.fill(); ctx.lineWidth = 5; ctx.strokeStyle = '#ffd9a0'; ctx.stroke(); }
    var d = vt - hit; if (d > 0) { if (d < 0.4) { ctx.fillStyle = 'rgba(255,245,220,' + (0.9 * (1 - d / 0.4)) + ')'; ctx.fillRect(0, 0, W, H); } for (var j = 0; j < 4; j++) ring(ctx, C0[0], C0[1], vt, hit + j * 0.2, '#ffb347', 600, a); ctx.globalCompositeOperation = 'lighter'; var rr = 60 + 200 * Math.min(1, d * 2), rg = ctx.createRadialGradient(p[0], p[1], 2, p[0], p[1], rr); rg.addColorStop(0, 'rgba(255,220,140,' + Math.max(0, 1 - d * 0.7) + ')'); rg.addColorStop(1, 'rgba(255,80,20,0)'); ctx.fillStyle = rg; ctx.fillRect(p[0] - rr, p[1] - rr, rr * 2, rr * 2); }
    ctx.restore();
  });
  cue(t.ast, 'riser', 0.35, t.hit + 0.25 - t.ast); cue(t.hit + 0.25, 'thud', 1.0); cue(t.hit + 0.3, 'swell', 0.4, 1.8);
  /* 70 km measure + final glow */
  ev(t.left, t.scar, function (ctx, vt) { var a = fadeIO(vt, t.left, t.scar, 0.15, 0.3), pr = sm01(t.left + 0.1, t.seventy + 0.3, vt), A = P(C0[0] - RD * KLAT, C0[1]), B = P(C0[0] + RD * KLAT, C0[1]), x1 = lerp(A[0], B[0], pr);
    ctx.save(); ctx.globalAlpha = a; ctx.strokeStyle = '#fff'; ctx.lineWidth = 8; ctx.lineCap = 'round'; ctx.shadowColor = '#000'; ctx.shadowBlur = 12; ctx.beginPath(); ctx.moveTo(A[0], A[1]); ctx.lineTo(x1, A[1]); ctx.moveTo(A[0], A[1] - 26); ctx.lineTo(A[0], A[1] + 26); if (pr > 0.98) { ctx.moveTo(B[0], B[1] - 26); ctx.lineTo(B[0], B[1] + 26); } ctx.stroke(); ctx.restore(); });
  cue(t.crater + 0.1, 'splash', 0.4); cue(t.seventy + 0.3, 'ding', 0.45);
  ev(t.scar - 0.1, END + 3, function (ctx, vt) { trace(ctx, vt, t.scar, 1.4, 0.95); });
  cue(t.scar, 'swell', 0.4, 2.0); cue(t.rex, 'thud', 0.9); cue(END - 0.1, 'sparkle', 0.4);
  ev(END + 0.3, END + 3, function (ctx, vt) { ctx.fillStyle = 'rgba(0,0,0,' + sm01(END + 0.35, END + 0.95, vt) + ')'; ctx.fillRect(0, 0, W, H); }).z = 2;
