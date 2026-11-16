
  /* ================= RICHAT STRUCTURE ================= */
  var C0 = [-11.394, 21.13], KLAT = 1 / Math.cos(21.13 * R);
  function circ(r, n) { var p = []; for (var i = 0; i <= (n || 90); i++) { var a = i / (n || 90) * 6.2832 - 1.57; p.push([C0[0] + r * Math.cos(a) * KLAT, C0[1] + r * Math.sin(a)]); } return p; }
  var RR = [0.18, 0.125, 0.072], RINGS = RR.map(function (r) { return circ(r); });
  var t = {};
  t.sahara = at('the sahara'); t.staring = at('staring'); t.thisring = at('this ring of rock'); t.maur = at('mauritania'); t.forty = at('forty kilometers'); t.wide = at('wide'); t.perfect = at('so perfect'); t.stamped = at('stamped');
  t.sci = at('scientists first'); t.meteor = at('meteor'); t.but = at('but the ground'); t.no = at('no'); t.pushed = at('it was pushed'); t.dome = at('dome'); t.wind = at('and wind and water'); t.soft = at('soft rock'); t.hard = at('hard rock');
  t.eye = at('this eye'); t.notexp = at('not an explosion'); t.itis = at('it is erosion'); t.erosion = at('erosion'); t.drawing = at('drawing circles'); t.slow = at('slow motion'); var END = WS[WS.length - 1][2];

  key(0, C0[0], C0[1], 0.46);
  key(t.wide + 0.3, C0[0], C0[1], 0.78, t.wide + 0.25);
  key(t.sci + 0.2, C0[0], C0[1], 1.25, 1.4);
  key(t.eye + 0.1, C0[0], C0[1], 0.9, 2.0);
  key(END + 0.8, C0[0], C0[1], 0.6, END + 0.6 - t.eye);
  dim(0, 0.0); dim(t.sci - 0.2, 0.08); dim(t.pushed - 0.3, 0.5); dim(t.eye - 0.2, 0.05);
  hudk(t.forty + 0.15, '40 KM WIDE', 'num'); hudk(t.perfect - 0.1, '');
  shk(t.meteor + 0.45, t.meteor + 1.2, 16); shk(t.no, t.no + 0.6, 10); shk(t.erosion, t.erosion + 0.5, 8);

  C(0.05, t.thisring - 0.15, 'THE SAHARA IS STARING BACK', { size: 48, fill: '#fff' });
  C(t.thisring, t.maur - 0.05, 'A RING OF ROCK', { size: 60, fill: '#ffd23f' });
  C(t.maur, t.forty - 0.05, 'MAURITANIA', { size: 62, fill: '#7fd8ff', col: '#10243a' });
  C(t.perfect, t.sci - 0.15, 'STAMPED FROM SPACE?', { size: 54, fill: '#fff' });
  C(t.sci, t.but - 0.1, 'A GIANT METEOR?', { size: 60, fill: '#ff9f43', col: '#10243a' });
  C(t.but, t.pushed - 0.1, 'THE GROUND SAYS NO', { size: 58, fill: '#ff5a5f', col: '#fff' });
  C(t.pushed, t.wind - 0.1, 'PUSHED UP INTO A DOME', { size: 52, fill: '#ffd23f' });
  C(t.wind, t.soft - 0.05, 'WIND AND WATER', { size: 58, fill: '#7fd8ff', col: '#10243a' });
  C(t.soft, t.eye - 0.15, 'SOFT ROCK GOES FIRST', { size: 52, fill: '#fff' });
  C(t.eye, t.itis - 0.1, 'NOT AN EXPLOSION', { size: 58, fill: '#ff5a5f', col: '#fff' });
  C(t.itis, t.drawing - 0.1, 'IT IS EROSION', { size: 64, fill: '#35d07f', col: '#10243a', cue: 'ding' });
  C(t.drawing, END + 3, 'CIRCLES IN SLOW MOTION', { size: 52, fill: '#ffd23f' });

  /* hook: iris + lashes glow so the ring reads as an eye */
  ev(0, t.thisring + 0.3, function (ctx, vt) {
    var p = P(C0[0], C0[1]), a = fadeIO(vt, 0, t.thisring + 0.3, 0.15, 0.5), rpx = RR[0] * R * CAM.S, bl = Math.max(0, 1 - Math.abs(vt - 1.25) / 0.16);
    ctx.save(); ctx.globalAlpha = a; ctx.globalCompositeOperation = 'lighter'; var g = ctx.createRadialGradient(p[0], p[1], rpx * 0.2, p[0], p[1], rpx * 1.25); g.addColorStop(0, 'rgba(255,220,120,0.0)'); g.addColorStop(0.75, 'rgba(255,200,90,' + (0.22 + 0.08 * Math.sin(vt * 5)) + ')'); g.addColorStop(1, 'rgba(255,160,60,0)'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); ctx.restore();
    /* eyelids blink once */
    if (bl > 0) { ctx.fillStyle = '#120a04'; bl *= 0.93; var hh = (p[1] + 40) * bl; ctx.fillRect(0, 0, W, hh); ctx.fillRect(0, H - (H - p[1] + 40) * bl, W, (H - p[1] + 40) * bl); }
  });
  cue(1.05, 'whoosh', 0.3); cue(0.0, 'riser', 0.3, 1.1); cue(1.25, 'thud', 0.6);

  /* locator inset: where in Africa */
  ev(t.maur - 0.2, t.perfect - 0.2, function (ctx, vt) {
    var a = fadeIO(vt, t.maur - 0.2, t.perfect - 0.2, 0.25, 0.3), s = 0.6 + 0.4 * pop(vt, t.maur - 0.15), cx = 850, cy = 530, rr = 150, im = V.tiers[0].pieces[0].img, bb = V.tiers[0].bb;
    var mT = mer(bb[3]), mB = mer(bb[1]), lo0 = -19, lo1 = -1, la0 = 12.5, la1 = 29.5, sx = (lo0 - bb[0]) / (bb[2] - bb[0]) * im.width, sw = (lo1 - lo0) / (bb[2] - bb[0]) * im.width, sy = (mT - mer(la1)) / (mT - mB) * im.height, sh = (mer(la1) - mer(la0)) / (mT - mB) * im.height;
    ctx.save(); ctx.translate(cx, cy); ctx.scale(s, s); ctx.globalAlpha *= a; ctx.shadowColor = 'rgba(0,0,0,0.6)'; ctx.shadowBlur = 24; V.circle(ctx, 0, 0, rr); ctx.fillStyle = '#000'; ctx.fill(); ctx.shadowColor = 'transparent'; ctx.save(); V.circle(ctx, 0, 0, rr); ctx.clip(); ctx.drawImage(im, sx, sy, sw, sh, -rr, -rr * sh / sw, rr * 2, rr * 2 * sh / sw);
    var px = -rr + (C0[0] - lo0) / (lo1 - lo0) * rr * 2, py = -rr * sh / sw + (mer(la1) - mer(C0[1])) / (mer(la1) - mer(la0)) * rr * 2 * sh / sw; ctx.restore();
    V.circle(ctx, 0, 0, rr); ctx.lineWidth = 7; ctx.strokeStyle = '#fff'; ctx.stroke(); var u = (vt * 1.2) % 1; ctx.globalAlpha *= (1 - u); V.circle(ctx, px, py, 10 + u * 40); ctx.strokeStyle = '#ff3b30'; ctx.lineWidth = 6; ctx.stroke(); ctx.globalAlpha = a; V.circle(ctx, px, py, 10); ctx.fillStyle = '#ff3b30'; ctx.fill(); ctx.lineWidth = 3; ctx.strokeStyle = '#fff'; ctx.stroke();
    V.text(ctx, 'MAURITANIA', -20, -70, { size: 26, weight: 900, tracking: 3, color: '#fff', stroke: '#000', strokeW: 6 }); V.text(ctx, 'NW AFRICA', 0, rr + 44, { size: 28, weight: 900, tracking: 4, color: '#fff', stroke: '#000', strokeW: 7 }); ctx.restore();
  }).z = 1;
  cue(t.maur - 0.15, 'pop', 0.4);

  /* 40 km measure */
  ev(t.forty - 0.05, t.perfect - 0.1, function (ctx, vt) {
    var a = fadeIO(vt, t.forty - 0.05, t.perfect - 0.1, 0.15, 0.3), pr = sm01(t.forty, t.forty + 0.7, vt), A = P(C0[0] - RR[0] * KLAT, C0[1]), B = P(C0[0] + RR[0] * KLAT, C0[1]), x1 = lerp(A[0], B[0], pr);
    ctx.save(); ctx.globalAlpha = a; ctx.strokeStyle = '#fff'; ctx.lineWidth = 8; ctx.lineCap = 'round'; ctx.shadowColor = '#000'; ctx.shadowBlur = 12; ctx.beginPath(); ctx.moveTo(A[0], A[1]); ctx.lineTo(x1, A[1]); ctx.moveTo(A[0], A[1] - 26); ctx.lineTo(A[0], A[1] + 26); if (pr > 0.98) { ctx.moveTo(B[0], B[1] - 26); ctx.lineTo(B[0], B[1] + 26); } ctx.stroke(); ctx.restore();
  });
  cue(t.forty, 'riser', 0.25, 0.7); cue(t.forty + 0.7, 'ding', 0.45);

  /* perfect circles traced over the eye */
  function trace(ctx, vt, a0, dur, alpha, col) { RINGS.forEach(function (pts, i) { var pr = sm01(a0 + i * 0.18, a0 + dur + i * 0.18, vt); if (pr <= 0) return; ctx.save(); ctx.globalAlpha *= alpha; var tip = growLine(ctx, pts, pr, col, 7 - i, col, null); if (tip && pr < 1) { V.circle(ctx, tip[0], tip[1], 11); ctx.fillStyle = '#fff'; ctx.fill(); } ctx.restore(); }); }
  ev(t.perfect - 0.1, t.sci + 0.1, function (ctx, vt) { trace(ctx, vt, t.perfect, 1.3, fadeIO(vt, t.perfect - 0.1, t.sci, 0.1, 0.3), '#ffd23f'); var k = V.spring(vt - t.stamped, 14, 8); if (vt > t.stamped) stamp(ctx, 540, 1085, 'TOO PERFECT', 0.42 * Math.min(1.1, k), fadeIO(vt, t.stamped, t.sci, 0.08, 0.25), '#ffd23f', -0.05); });
  cue(t.stamped, 'thud', 0.7);

  /* meteor theory */
  ev(t.sci + 0.3, t.pushed - 0.2, function (ctx, vt) {
    var p = P(C0[0], C0[1]), hit = t.meteor + 0.45, u = V.clamp((vt - (hit - 0.75)) / 0.75), a = fadeIO(vt, t.sci + 0.3, t.pushed - 0.2, 0.1, 0.3);
    ctx.save(); ctx.globalAlpha = a;
    if (u > 0 && u < 1) { var x = lerp(p[0] + 560, p[0], u * u), y = lerp(p[1] - 1000, p[1], u * u), g = ctx.createLinearGradient(x, y, x + 240, y - 430); g.addColorStop(0, 'rgba(255,240,190,1)'); g.addColorStop(0.3, 'rgba(255,130,40,0.8)'); g.addColorStop(1, 'rgba(255,60,10,0)'); ctx.globalCompositeOperation = 'lighter'; ctx.strokeStyle = g; ctx.lineWidth = 60; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + 240, y - 430); ctx.stroke(); ctx.globalCompositeOperation = 'source-over'; V.circle(ctx, x, y, 30); ctx.fillStyle = '#3a2a22'; ctx.fill(); ctx.lineWidth = 5; ctx.strokeStyle = '#ffd9a0'; ctx.stroke(); }
    var d = vt - hit; if (d > 0) { if (d < 0.35) { ctx.fillStyle = 'rgba(255,245,220,' + (0.85 * (1 - d / 0.35)) + ')'; ctx.fillRect(0, 0, W, H); } for (var j = 0; j < 3; j++) ring(ctx, C0[0], C0[1], vt, hit + j * 0.22, '#ffb347', 520, a);
      if (vt > t.no) { var k = V.spring(vt - t.no, 15, 8), s = 1.0 * Math.min(1.15, k); ctx.strokeStyle = '#ff3b30'; ctx.lineWidth = 46; ctx.lineCap = 'round'; ctx.shadowColor = '#000'; ctx.shadowBlur = 20; ctx.beginPath(); ctx.moveTo(p[0] - 230 * s, p[1] - 230 * s); ctx.lineTo(p[0] + 230 * s, p[1] + 230 * s); ctx.moveTo(p[0] + 230 * s, p[1] - 230 * s); ctx.lineTo(p[0] - 230 * s, p[1] + 230 * s); ctx.stroke(); } }
    ctx.restore();
  });
  cue(t.meteor - 0.3, 'whoosh', 0.5); cue(t.meteor + 0.45, 'thud', 1.0); cue(t.no, 'thud', 0.8);

  /* cross-section card: dome rises, then erosion planes it off; hard layers stay as ridges */
  var LAY = [['#5b3a22', 1], ['#e2b56a', 0], ['#6e4526', 1], ['#edc987', 0], ['#4d2f1b', 1], ['#d9a85c', 0], ['#3f2616', 1]];
  ev(t.pushed - 0.35, t.eye - 0.1, function (ctx, vt) {
    var a = fadeIO(vt, t.pushed - 0.35, t.eye - 0.1, 0.35, 0.4); if (a <= 0.004) return; var x0 = 40, y0 = 395, w = 1000, h = 830;
    var kd = sm01(t.pushed, t.dome + 0.5, vt), ke = sm01(t.wind + 0.2, t.hard + 0.5, vt), flat = y0 + 470, TH = 62;
    ctx.save(); ctx.globalAlpha *= a; ctx.shadowColor = 'rgba(0,0,0,0.6)'; ctx.shadowBlur = 30; V.rr(ctx, x0, y0, w, h, 44); ctx.fillStyle = '#9fd3f2'; ctx.fill(); ctx.shadowColor = 'transparent'; ctx.save(); V.rr(ctx, x0, y0, w, h, 44); ctx.clip();
    ctx.fillStyle = V.lin(ctx, 0, y0, 0, y0 + h, [[0, '#7fc2ee'], [0.55, '#f4e2b8'], [1, '#f4e2b8']]); ctx.fillRect(x0, y0, w, h);
    for (var x = x0; x < x0 + w; x += 5) {
      var dx = (x - 540) / 250, up = 330 * kd * Math.exp(-dx * dx), top = flat - up, li = Math.floor((flat - top) / TH), hard = LAY[Math.min(LAY.length - 1, Math.max(0, li))][1], er = flat + (hard ? -16 : 26) * Math.min(1, up / 40), surf = lerp(top, Math.max(top, er), ke);
      for (var i = 0; i < LAY.length; i++) { var ya = top + i * TH, yb = i === LAY.length - 1 ? y0 + h : ya + TH; ya = Math.max(ya, surf); if (yb <= ya) continue; ctx.fillStyle = LAY[i][0]; ctx.fillRect(x, ya, 5.5, yb - ya); }
    }
    /* magma push arrow */
    if (kd > 0.02 && ke < 0.2) { ctx.globalAlpha *= (1 - ke * 5) * Math.min(1, kd * 3); ctx.fillStyle = '#ff5a2a'; var ay = y0 + h - 60 - 60 * kd; ctx.beginPath(); ctx.moveTo(540, ay - 150); ctx.lineTo(630, ay - 40); ctx.lineTo(578, ay - 40); ctx.lineTo(578, ay + 60); ctx.lineTo(502, ay + 60); ctx.lineTo(502, ay - 40); ctx.lineTo(450, ay - 40); ctx.closePath(); ctx.fill(); ctx.lineWidth = 6; ctx.strokeStyle = '#fff'; ctx.stroke(); ctx.globalAlpha = a; }
    /* wind streaks + rain */
    if (vt > t.wind) { var kw = fadeIO(vt, t.wind, t.eye - 0.3, 0.3, 0.4); ctx.strokeStyle = 'rgba(255,255,255,' + (0.75 * kw) + ')'; ctx.lineWidth = 6; ctx.lineCap = 'round'; for (var j = 0; j < 9; j++) { var wx = x0 + ((vt * 620 + j * 173) % (w + 300)) - 150, wy = y0 + 90 + j * 38 + 14 * Math.sin(vt * 3 + j); ctx.beginPath(); ctx.moveTo(wx, wy); ctx.quadraticCurveTo(wx + 70, wy - 18, wx + 150, wy); ctx.stroke(); }
      ctx.fillStyle = 'rgba(60,150,230,' + (0.9 * kw) + ')'; for (j = 0; j < 22; j++) { var rx = x0 + (j * 97 + 30) % w, ry = y0 + ((vt * 520 + j * 71) % 440); ctx.beginPath(); ctx.ellipse(rx, ry, 4, 11, 0.2, 0, 7); ctx.fill(); } }
    if (ke > 0.6) { var kl = V.clamp((ke - 0.6) / 0.3); chip(ctx, 300, flat - 70, 'HARD = RIDGE', { size: 34, fill: '#5b3a22', col: '#fff', a: kl }); chip(ctx, 770, flat - 70, 'SOFT = VALLEY', { size: 34, fill: '#edc987', col: '#3a2412', a: kl }); }
    V.text(ctx, 'SIDE VIEW', x0 + 44, y0 + 64, { size: 30, weight: 900, tracking: 5, align: 'left', color: '#10243a' });
    ctx.restore(); ctx.lineWidth = 5; ctx.strokeStyle = 'rgba(255,255,255,0.6)'; V.rr(ctx, x0, y0, w, h, 44); ctx.stroke(); ctx.restore();
  }).z = 1;
  cue(t.pushed - 0.3, 'whoosh', 0.4); cue(t.pushed, 'riser', 0.35, 1.6); cue(t.dome + 0.4, 'thud', 0.5); cue(t.wind, 'swell', 0.35, 3.0); cue(t.hard + 0.4, 'ding', 0.4);

  /* finale: erosion draws the circles */
  ev(t.eye - 0.1, END + 3, function (ctx, vt) { if (vt > t.drawing - 0.2) trace(ctx, vt, t.drawing - 0.1, 2.3, 0.95, '#ffd23f'); });
  cue(t.eye - 0.1, 'whoosh', 0.35); cue(t.erosion, 'thud', 0.7); cue(t.drawing, 'swell', 0.4, 2.4); cue(END - 0.1, 'sparkle', 0.4);
  ev(END + 0.3, END + 3, function (ctx, vt) { ctx.fillStyle = 'rgba(0,0,0,' + sm01(END + 0.35, END + 0.95, vt) + ')'; ctx.fillRect(0, 0, W, H); }).z = 2;
