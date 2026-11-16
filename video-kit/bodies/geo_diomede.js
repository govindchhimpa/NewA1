
  /* ================= DIOMEDE ISLANDS ================= */
  var BIG = [-169.06, 65.78], LIT = [-168.925, 65.755], MID = [-168.99, 65.768], LX = -168.985;
  var t = {};
  t.four = at('four kilometers'); t.almost = at('and almost'); t.day = at('full day'); t.big = at('this is big'); t.russia = at('russia'); t.little = at('this is little'); t.america = at('america');
  t.between = at('between them runs'); t.line = at('international'); t.so = at('so when'); t.monday = at('monday'); t.tuesday = at('tuesday'); t.winter = at('in winter'); t.freeze = at('freezes'); t.walk = at('you could walk'); t.tomorrow = at('tomorrow'); t.not = at('not allowed');
  var END = WS[WS.length - 1][2];

  key(0, MID[0], MID[1], 0.34);
  key(t.big + 0.25, BIG[0] + 0.02, BIG[1], 0.2, 0.9);
  key(t.little + 0.3, LIT[0] - 0.02, LIT[1], 0.2, 0.9);
  key(t.between + 0.5, MID[0], MID[1], 0.33, 1.2);
  key(END + 0.8, MID[0], MID[1], 0.28, END - t.between);
  dim(0, 0.0); dim(t.so - 0.2, 0.12); dim(t.winter, 0.0);
  hudk(0.25, '4 KM APART', 'num'); hudk(t.almost - 0.1, '21 HOURS APART', 'num'); hudk(t.big - 0.15, '');
  shk(t.not, t.not + 0.7, 14);

  C(t.big, t.little - 0.1, 'BIG DIOMEDE · RUSSIA', { size: 50, fill: '#ff5a5f', col: '#fff' });
  C(t.little, t.between - 0.1, 'LITTLE DIOMEDE · USA', { size: 50, fill: '#4aa3ff', col: '#fff' });
  C(t.between, t.so - 0.1, 'INTERNATIONAL DATE LINE', { size: 48, fill: '#ffd23f' });
  C(t.so, t.winter - 0.15, 'SAME MOMENT. TWO DAYS.', { size: 52, fill: '#fff' });
  C(t.winter, t.walk - 0.1, 'IN WINTER THE SEA FREEZES', { size: 46, fill: '#cfeaff', col: '#10243a' });
  C(t.walk, t.not - 0.1, 'WALK INTO TOMORROW', { size: 56, fill: '#ffd23f' });
  C(t.not, END + 3, 'JUST NOT ALLOWED', { size: 60, fill: '#ff5a5f', col: '#fff' });

  function clock(ctx, lon, lat, day, hh, col, a, dy) { var p = P(lon, lat); if (a <= 0.01) return; ctx.save(); ctx.globalAlpha *= a; ctx.translate(p[0], p[1] + (dy || -150)); ctx.shadowColor = 'rgba(0,0,0,0.6)'; ctx.shadowBlur = 16; V.rr(ctx, -118, -62, 236, 124, 22); ctx.fillStyle = '#0c1424'; ctx.fill(); ctx.shadowColor = 'transparent'; ctx.lineWidth = 6; ctx.strokeStyle = col; ctx.stroke();
    V.text(ctx, day, 0, -24, { size: 36, weight: 900, tracking: 4, color: col }); V.text(ctx, hh, 0, 30, { size: 46, weight: 900, color: '#fff' }); ctx.restore(); }
  function hhmm(base, vt) { var m = Math.floor(base * 60 + vt * 2) % 1440, h = Math.floor(m / 60), mm = m % 60; return (h < 10 ? '0' : '') + h + ((Math.floor(vt * 2) % 2) ? ':' : ' ') + (mm < 10 ? '0' : '') + mm; }

  /* hook: 4 km measure */
  ev(0.1, t.almost - 0.05, function (ctx, vt) { var a = fadeIO(vt, 0.1, t.almost - 0.05, 0.15, 0.3), pr = sm01(0.3, 1.2, vt), A = P(BIG[0] + 0.022, 65.768), B = P(LIT[0] - 0.02, 65.768), x1 = lerp(A[0], B[0], pr);
    ctx.save(); ctx.globalAlpha = a; ctx.strokeStyle = '#fff'; ctx.lineWidth = 8; ctx.lineCap = 'round'; ctx.shadowColor = '#000'; ctx.shadowBlur = 12; ctx.beginPath(); ctx.moveTo(A[0], A[1]); ctx.lineTo(x1, A[1]); ctx.moveTo(A[0], A[1] - 24); ctx.lineTo(A[0], A[1] + 24); if (pr > 0.98) { ctx.moveTo(B[0], B[1] - 24); ctx.lineTo(B[0], B[1] + 24); } ctx.stroke(); ctx.restore(); });
  cue(0.3, 'riser', 0.3, 0.9); cue(1.2, 'ding', 0.45);
  /* clocks: one day apart */
  ev(t.almost - 0.1, t.big - 0.1, function (ctx, vt) { var a = fadeIO(vt, t.almost - 0.1, t.big - 0.1, 0.15, 0.25); clock(ctx, BIG[0], BIG[1], 'TUESDAY', hhmm(6, vt), '#ff6b6f', a * pop(vt, t.almost), -210); clock(ctx, LIT[0], LIT[1], 'MONDAY', hhmm(9, vt), '#6bb6ff', a * pop(vt, t.day - 0.2), 150); });
  cue(t.almost, 'pop', 0.4); cue(t.day - 0.2, 'pop', 0.4); cue(t.day + 0.3, 'thud', 0.6);
  /* island names */
  ev(t.big, t.little, function (ctx, vt) { label(ctx, 'RUSSIA', BIG[0], BIG[1], { dy: 0, size: 70, tr: 10, col: '#ffffff', a: fadeIO(vt, t.russia - 0.1, t.little, 0.2, 0.2) }); });
  ev(t.little, t.between, function (ctx, vt) { label(ctx, 'USA', LIT[0], LIT[1], { dy: 0, size: 70, tr: 10, col: '#ffffff', a: fadeIO(vt, t.america - 0.1, t.between, 0.2, 0.2) }); });
  cue(t.big, 'whoosh', 0.35); cue(t.little, 'whoosh', 0.35); cue(t.russia, 'thud', 0.4); cue(t.america, 'thud', 0.4);
  /* the date line + day tints */
  ev(t.between + 0.1, END + 3, function (ctx, vt) {
    var pr = sm01(t.line - 0.1, t.line + 1.0, vt), top = P(LX, 65.95), bot = P(LX, 65.55), x = top[0], y1 = lerp(-40, H + 40, pr), a = V.clamp((vt - t.between - 0.1) / 0.3);
    if (vt > t.so - 0.2 && vt < t.winter + 0.3) { var k = fadeIO(vt, t.so - 0.2, t.winter + 0.3, 0.4, 0.4) * 0.22; ctx.fillStyle = 'rgba(255,90,95,' + k + ')'; ctx.fillRect(0, 0, x, H); ctx.fillStyle = 'rgba(74,163,255,' + k + ')'; ctx.fillRect(x, 0, W - x, H); }
    ctx.save(); ctx.globalAlpha = a; ctx.strokeStyle = '#ffd23f'; ctx.lineWidth = 9; ctx.setLineDash([30, 20]); ctx.lineDashOffset = -vt * 30; ctx.shadowColor = '#000'; ctx.shadowBlur = 14; ctx.beginPath(); ctx.moveTo(x, -40); ctx.lineTo(x, y1); ctx.stroke(); ctx.restore();
    if (vt > t.so - 0.1 && vt < t.winter) { var a2 = fadeIO(vt, t.so - 0.1, t.winter, 0.2, 0.3); clock(ctx, LIT[0], LIT[1], 'MONDAY', hhmm(9, vt), '#6bb6ff', a2 * pop(vt, t.monday - 0.1), 170); clock(ctx, BIG[0], BIG[1], 'TUESDAY', hhmm(6, vt), '#ff6b6f', a2 * pop(vt, t.tuesday - 0.1), -230); }
  });
  cue(t.line - 0.1, 'riser', 0.3, 1.0); cue(t.monday - 0.1, 'pop', 0.45); cue(t.tuesday - 0.1, 'pop', 0.45); cue(t.tuesday + 0.2, 'ding', 0.4);
  /* winter: ice sheet + snow */
  ev(t.winter - 0.1, END + 3, function (ctx, vt) {
    var k = sm01(t.winter, t.freeze + 0.9, vt); ctx.save(); ctx.globalCompositeOperation = 'screen'; ctx.fillStyle = 'rgba(190,215,235,' + (0.62 * k) + ')'; ctx.fillRect(0, 0, W, H); ctx.restore();
    var r = V.rand(31); ctx.strokeStyle = 'rgba(255,255,255,' + (0.3 * k) + ')'; ctx.lineWidth = 3; for (var i = 0; i < 12; i++) { var p = P(-169.2 + r() * 0.42, 65.68 + r() * 0.17), an = r() * 6.28, L = (40 + r() * 120) * k; ctx.beginPath(); ctx.moveTo(p[0], p[1]); ctx.lineTo(p[0] + Math.cos(an) * L, p[1] + Math.sin(an) * L); ctx.lineTo(p[0] + Math.cos(an + 0.7) * L * 1.5, p[1] + Math.sin(an + 0.7) * L * 1.5); ctx.stroke(); }
    ctx.fillStyle = 'rgba(255,255,255,' + (0.85 * k) + ')'; for (i = 0; i < 70; i++) { var sx = (r() * W + vt * 40 * (0.5 + r())) % W, sy = (r() * H + vt * (120 + r() * 120)) % H; V.circle(ctx, sx, sy, 2 + r() * 4); ctx.fill(); }
  });
  cue(t.winter, 'swell', 0.4, 2.2); cue(t.freeze, 'sparkle', 0.4);
  /* the walk into tomorrow, and the stop */
  ev(t.walk - 0.1, END + 3, function (ctx, vt) {
    var A = P(LIT[0] - 0.012, LIT[1] + 0.003), B = P(BIG[0] + 0.028, BIG[1] - 0.006), stop = 0.56, pr = Math.min(stop, sm01(t.walk, t.not - 0.05, vt) * stop), n = 16;
    for (var i = 0; i <= n * pr; i++) { var u = i / n, x = lerp(A[0], B[0], u), y = lerp(A[1], B[1], u) + (i % 2 ? 9 : -9); ctx.fillStyle = 'rgba(30,50,80,0.9)'; ctx.beginPath(); ctx.ellipse(x, y, 9, 5.5, -0.2, 0, 7); ctx.fill(); }
    var hx = lerp(A[0], B[0], pr), hy = lerp(A[1], B[1], pr) - 34 - 4 * Math.abs(Math.sin(vt * 9)); V.circle(ctx, hx, hy - 30, 13); ctx.fillStyle = '#ffd23f'; ctx.fill(); ctx.lineWidth = 4; ctx.strokeStyle = '#10243a'; ctx.stroke(); V.rr(ctx, hx - 11, hy - 16, 22, 38, 8); ctx.fillStyle = '#ff7a3a'; ctx.fill(); ctx.stroke();
    if (vt > t.not) { var k = V.spring(vt - t.not, 15, 8), lp = P(LX, 65.768); ctx.save(); ctx.translate(lp[0], lp[1]); ctx.scale(Math.min(1.12, k), Math.min(1.12, k)); V.circle(ctx, 0, 0, 78); ctx.fillStyle = '#e02a2a'; ctx.fill(); ctx.lineWidth = 9; ctx.strokeStyle = '#fff'; ctx.stroke(); ctx.fillStyle = '#fff'; ctx.fillRect(-48, -13, 96, 26); ctx.restore(); stamp(ctx, 540, 1085, 'NOT ALLOWED', 0.44 * Math.min(1.1, k), 1, '#ff5a5f', -0.05); }
  });
  for (var fi = 0; fi < 8; fi++) cue(t.walk + 0.1 + fi * 0.22, 'tick', 0.4); cue(t.tomorrow, 'ding', 0.4); cue(t.not, 'thud', 1.0); cue(t.not, 'swell', 0.35, 1.6);
  ev(END + 0.3, END + 3, function (ctx, vt) { ctx.fillStyle = 'rgba(0,0,0,' + sm01(END + 0.35, END + 0.95, vt) + ')'; ctx.fillRect(0, 0, W, H); }).z = 2;
