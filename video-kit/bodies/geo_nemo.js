
  /* ================= POINT NEMO ================= */
  var C0 = [-123.393, -48.877], DUC = [-124.79, -24.67], EAS = [-109.45, -27.2];
  function dest(lon, lat, brg, dkm) {
    var d = dkm / 6371, la1 = lat * R, lo1 = lon * R, la2 = Math.asin(Math.sin(la1) * Math.cos(d) + Math.cos(la1) * Math.sin(d) * Math.cos(brg));
    var lo2 = lo1 + Math.atan2(Math.sin(brg) * Math.sin(d) * Math.cos(la1), Math.cos(d) - Math.sin(la1) * Math.sin(la2)); return [lo2 / R, la2 / R];
  }
  var ANT = dest(C0[0], C0[1], Math.PI, 2688), RING = [];
  for (var bb = 0; bb <= 360; bb += 3) RING.push(dest(C0[0], C0[1], (180 + bb) * R, 2688));

  /* ---------------- anchors ---------------- */
  var t = {};
  t.nearest = at('the nearest humans'); t.spot = at('this spot'); t.notearth = at('are not on earth'); t.point = at('point nemo'); t.pacific = at('south pacific'); t.almost = at('almost'); t.km = at('kilometers'); t.land = at('any land');
  t.when = at('when the space station'); t.astro = at('its astronauts'); t.closer = at('closer than'); t.ground = at('on the ground');
  t.that = at('that is why'); t.grave = at('graveyard'); t.space = at('space agencies'); t.steer = at('steer dying'); t.far = at('far from every city'); t.ocean = at('and let the ocean'); t.hund = at('hundreds already'); t.seaf = at('seafloor');
  t.lonely = at('the loneliest place'); t.rockets = at('our rockets'); t.die = at('die'); var END = WS[WS.length - 1][2];

  /* ---------------- camera, dimming, hud, shake ---------------- */
  key(0, C0[0], C0[1], 80);
  key(t.point - 0.05, C0[0], C0[1], 38, 1.9);
  key(t.almost + 0.35, C0[0], -52.4, 111, 1.9);
  key(t.that - 0.1, C0[0], C0[1], 30, 2.4);
  key(t.lonely - 0.3, C0[0], -50.5, 100, 2.6);
  dim(0, 0.06); dim(t.when - 0.3, 0.55); dim(t.that - 0.2, 0.2); dim(t.hund - 0.3, 0.5); dim(t.lonely - 0.1, 0.1);
  hudk(t.almost + 0.45, '~2,700 KM', 'num'); hudk(t.when - 0.3, '');
  shk(t.notearth, t.notearth + 0.6, 10); shk(t.grave, t.grave + 0.7, 12); shk(t.die, t.die + 0.9, 16);

  /* ---------------- chips ---------------- */
  C(0.05, t.notearth - 0.05, 'THE NEAREST HUMANS...', { size: 54, fill: '#fff' });
  C(t.notearth, t.point - 0.1, 'ARE NOT ON EARTH', { size: 62, fill: '#ff5a5f', col: '#fff', cue: 'thud' });
  C(t.point, t.pacific - 0.05, 'POINT NEMO', { size: 66, fill: '#ffd23f' });
  C(t.pacific, t.almost - 0.05, 'SOUTH PACIFIC', { size: 58, fill: '#7fd8ff', col: '#10243a' });
  C(t.when, t.astro - 0.05, 'THE SPACE STATION PASSES', { size: 50, fill: '#fff' });
  C(t.astro, t.closer - 0.05, 'ASTRONAUTS: 400 KM UP', { size: 54, fill: '#ffd23f' });
  C(t.closer, t.that - 0.1, 'CLOSER THAN ANYONE BELOW', { size: 50, fill: '#35d07f', col: '#10243a' });
  C(t.that, t.grave - 0.05, 'THAT IS WHY...', { size: 56, fill: '#fff' });
  C(t.space, t.far - 0.05, 'DYING SPACECRAFT STEERED HERE', { size: 44, fill: '#ffd23f' });
  C(t.far, t.ocean - 0.05, 'FAR FROM EVERY CITY', { size: 56, fill: '#fff' });
  C(t.ocean, t.hund - 0.1, 'THE OCEAN TAKES THEM', { size: 54, fill: '#7fd8ff', col: '#10243a' });
  C(t.hund, t.lonely - 0.1, 'HUNDREDS ON THE SEAFLOOR', { size: 48, fill: '#ffd23f' });
  C(t.lonely, t.rockets - 0.05, 'THE LONELIEST PLACE ON EARTH', { size: 44, fill: '#fff' });
  C(t.rockets, END + 3, 'WHERE OUR ROCKETS GO TO DIE', { size: 48, fill: '#ff5a5f', col: '#fff' });

  /* ---------------- drawing helpers ---------------- */
  function craft(ctx, x, y, kind, s, rot, a) {
    ctx.save(); ctx.translate(x, y); ctx.rotate(rot || 0); ctx.scale(s, s); ctx.globalAlpha *= (a === undefined ? 1 : a); ctx.lineJoin = 'round'; ctx.lineWidth = 4; ctx.strokeStyle = '#0a0f1a';
    if (kind === 0) {
      [-1, 1].forEach(function (d) { var x0 = d > 0 ? 34 : -108; V.rr(ctx, x0, -14, 74, 28, 3); ctx.fillStyle = '#2d63b8'; ctx.fill(); ctx.stroke(); ctx.save(); ctx.strokeStyle = 'rgba(255,255,255,0.4)'; ctx.lineWidth = 2; for (var i = 1; i < 4; i++) { ctx.beginPath(); ctx.moveTo(x0 + i * 18.5, -14); ctx.lineTo(x0 + i * 18.5, 14); ctx.stroke(); } ctx.restore(); });
      V.rr(ctx, -34, -26, 68, 52, 6); ctx.fillStyle = '#d9b44a'; ctx.fill(); ctx.stroke(); ctx.beginPath(); ctx.arc(0, -30, 18, Math.PI, 0); ctx.fillStyle = '#e8e8ee'; ctx.fill(); ctx.stroke();
    } else if (kind === 1) {
      ctx.beginPath(); ctx.moveTo(-22, -40); ctx.lineTo(22, -40); ctx.lineTo(44, 30); ctx.lineTo(-44, 30); ctx.closePath(); ctx.fillStyle = '#e8e4da'; ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.ellipse(0, 34, 46, 12, 0, 0, Math.PI); ctx.fillStyle = '#3a2a22'; ctx.fill(); ctx.stroke(); V.circle(ctx, 0, -8, 11); ctx.fillStyle = '#7fd8ff'; ctx.fill(); ctx.stroke();
    } else {
      V.rr(ctx, -24, -60, 48, 120, 8); ctx.fillStyle = '#f2f2f4'; ctx.fill(); ctx.stroke(); ctx.fillStyle = '#1b2230'; ctx.fillRect(-23, -20, 46, 22);
      ctx.beginPath(); ctx.moveTo(-14, 60); ctx.lineTo(14, 60); ctx.lineTo(22, 84); ctx.lineTo(-22, 84); ctx.closePath(); ctx.fillStyle = '#6b7280'; ctx.fill(); ctx.stroke();
    }
    ctx.restore();
  }
  function fireball(ctx, x, y, dx, dy, s, a) {
    var Ln = 340 * s, g = ctx.createLinearGradient(x, y, x - dx * Ln, y - dy * Ln); g.addColorStop(0, 'rgba(255,235,170,' + a + ')'); g.addColorStop(0.3, 'rgba(255,120,40,' + (0.7 * a) + ')'); g.addColorStop(1, 'rgba(255,60,10,0)');
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.strokeStyle = g; ctx.lineWidth = 50 * s; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x - dx * Ln, y - dy * Ln); ctx.stroke();
    var rg = ctx.createRadialGradient(x, y, 2, x, y, 80 * s); rg.addColorStop(0, 'rgba(255,248,210,' + a + ')'); rg.addColorStop(1, 'rgba(255,100,20,0)'); ctx.fillStyle = rg; ctx.fillRect(x - 80 * s, y - 80 * s, 160 * s, 160 * s); ctx.restore();
  }
  function helmet(ctx, x, y, s, a) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.globalAlpha *= a; V.circle(ctx, 0, 0, 38); ctx.fillStyle = '#f4f6fa'; ctx.fill(); ctx.lineWidth = 5; ctx.strokeStyle = '#10243a'; ctx.stroke(); V.rr(ctx, -26, -17, 52, 34, 17); ctx.fillStyle = '#16305a'; ctx.fill(); ctx.fillStyle = 'rgba(127,216,255,0.5)'; ctx.beginPath(); ctx.ellipse(-8, -6, 8, 4, -0.5, 0, 7); ctx.fill(); ctx.restore(); }
  function iss(ctx, x, y, s) {
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.lineWidth = 3; ctx.strokeStyle = '#0a0f1a';
    [-1, 1].forEach(function (d) { for (var k = 0; k < 2; k++) { V.rr(ctx, d > 0 ? 22 + k * 40 : -58 - k * 40, -30, 36, 60, 2); ctx.fillStyle = '#d8a93a'; ctx.fill(); ctx.stroke(); } });
    V.rr(ctx, -26, -9, 52, 18, 3); ctx.fillStyle = '#dfe3ea'; ctx.fill(); ctx.stroke(); V.rr(ctx, -9, -18, 18, 36, 3); ctx.fillStyle = '#cfd4dc'; ctx.fill(); ctx.stroke(); ctx.restore();
  }
  function arcPts(cx, cy, r, a0, a1, n) { var p = []; for (var i = 0; i <= n; i++) { var an = a0 + (a1 - a0) * i / n; p.push([cx + r * Math.cos(an), cy + r * Math.sin(an)]); } return p; }
  function dashPoly(ctx, pts, prog, col, w) { ctx.save(); ctx.strokeStyle = col; ctx.lineWidth = w; ctx.lineCap = 'round'; ctx.setLineDash([16, 12]); ctx.beginPath(); var n = Math.max(1, Math.floor((pts.length - 1) * prog)); for (var i = 0; i <= n; i++) { if (i) ctx.lineTo(pts[i][0], pts[i][1]); else ctx.moveTo(pts[i][0], pts[i][1]); } ctx.stroke(); ctx.restore(); }


  /* ---------------- graticule + radar sweep (map feel on the dark ocean) ---------------- */
  ev(0, END + 3, function (ctx, vt) {
    ctx.save(); ctx.lineWidth = 2; ctx.strokeStyle = 'rgba(160,200,255,0.13)'; ctx.fillStyle = 'rgba(190,220,255,0.35)'; ctx.font = '600 22px ' + V.font;
    for (var lo = -180; lo <= -60; lo += 10) { ctx.beginPath(); for (var la = -80; la <= 12; la += 4) { var q = P(lo, la); if (la === -80) ctx.moveTo(q[0], q[1]); else ctx.lineTo(q[0], q[1]); } ctx.stroke(); }
    for (var la2 = -80; la2 <= 10; la2 += 10) { ctx.beginPath(); for (var lo2 = -180; lo2 <= -60; lo2 += 4) { var q2 = P(lo2, la2); if (lo2 === -180) ctx.moveTo(q2[0], q2[1]); else ctx.lineTo(q2[0], q2[1]); } ctx.stroke(); }
    ctx.restore();
  }).z = -1;
  ev(0, t.point + 0.2, function (ctx, vt) {
    var p = P(C0[0], C0[1]), a = fadeIO(vt, 0, t.point + 0.2, 0.2, 0.4) * 0.55, an = vt * 3.4; if (!ctx.createConicGradient) return;
    var g = ctx.createConicGradient(an, p[0], p[1]); g.addColorStop(0, 'rgba(255,90,95,0)'); g.addColorStop(0.0, 'rgba(255,90,95,0)'); g.addColorStop(0.16, 'rgba(255,90,95,0.0)'); g.addColorStop(0.17, 'rgba(255,90,95,0)'); g.addColorStop(0.84, 'rgba(255,90,95,0)'); g.addColorStop(1, 'rgba(255,90,95,0.55)');
    ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = g; V.circle(ctx, p[0], p[1], 520); ctx.fill(); ctx.restore();
  });

  /* ---------------- hook: the spot ---------------- */
  ev(0, t.point - 0.15, function (ctx, vt) {
    var p = P(C0[0], C0[1]), a = fadeIO(vt, 0, t.point - 0.15, 0.2, 0.3);
    for (var k = 0; k < 8; k++) ring(ctx, C0[0], C0[1], vt, 0.05 + k * 0.5, '#ff5a5f', 170, a);
    ctx.save(); ctx.globalAlpha = a; V.circle(ctx, p[0], p[1], 15 + 3 * Math.sin(vt * 9)); ctx.fillStyle = '#ff3b30'; ctx.fill(); ctx.lineWidth = 5; ctx.strokeStyle = '#fff'; ctx.stroke(); ctx.restore();
    label(ctx, '48.88°S  123.39°W', C0[0], C0[1], { dy: 78, size: 30, tr: 4, col: '#cfe6ff', a: a * V.clamp((vt - 0.9) / 0.4) });
    label(ctx, 'THIS SPOT', C0[0], C0[1], { dy: -52, size: 46, tr: 6, col: '#ffffff', a: a * V.clamp((vt - 0.5) / 0.4) });
  });
  ev(t.point - 0.1, t.when - 0.25, function (ctx, vt) { var a = fadeIO(vt, t.point - 0.1, t.when - 0.25, 0.25, 0.35); pin(ctx, C0[0], C0[1], a * pop(vt, t.point), '#ff3b30', 15); label(ctx, 'POINT NEMO', C0[0], C0[1], { dy: 62, size: vt < t.almost + 0.3 ? 52 : 34, tr: 5, col: '#ffe08a', a: a }); });

  /* ---------------- the 2,700 km ring and the three nearest lands ---------------- */
  ev(t.almost + 0.1, t.when - 0.2, function (ctx, vt) {
    var a = fadeIO(vt, t.almost + 0.1, t.when - 0.2, 0.25, 0.3), pr = sm01(t.almost + 0.3, t.land + 0.1, vt);
    ctx.save(); ctx.globalAlpha *= a; growLine(ctx, RING, pr, 'rgba(255,90,95,0.95)', 7, '#ff5a5f', [20, 12]);
    [[DUC, 'DUCIE ISLAND', -150, 52], [EAS, 'EASTER ISLAND', 160, 44], [ANT, 'ANTARCTICA', 0, -38]].forEach(function (q, i) {
      var p2 = sm01(t.km - 0.05 + i * 0.2, t.km + 0.65 + i * 0.2, vt); growLine(ctx, [C0, q[0]], p2, '#ffffff', 4, 'rgba(0,0,0,0.7)', [12, 12]);
      pin(ctx, q[0][0], q[0][1], pop(vt, t.km + 0.55 + i * 0.2), '#ffd23f', 11, q[1], { dx: q[2], dy: q[3], size: 30 });
    });
    ctx.restore();
  });
  cue(t.almost + 0.3, 'riser', 0.3, 1.4); cue(t.land - 0.1, 'ding', 0.4);

  /* ---------------- the space-station card (true proportions: 400 km up vs 2,700 km sideways) ---------------- */
  ev(t.when - 0.35, t.that - 0.15, function (ctx, vt) {
    var a = fadeIO(vt, t.when - 0.35, t.that - 0.15, 0.35, 0.35); if (a <= 0.004) return;
    var x0 = 40, y0 = 395, w = 1000, h = 830, ex = 540, ey = 1980, er = 1100, py = ey - er; /* pin y = 880 */
    ctx.save(); ctx.globalAlpha *= a; ctx.shadowColor = 'rgba(0,0,0,0.6)'; ctx.shadowBlur = 30; V.rr(ctx, x0, y0, w, h, 44); ctx.fillStyle = '#02040c'; ctx.fill(); ctx.shadowColor = 'transparent'; ctx.save(); V.rr(ctx, x0, y0, w, h, 44); ctx.clip();
    var g = ctx.createLinearGradient(0, y0, 0, y0 + h); g.addColorStop(0, '#02040c'); g.addColorStop(0.7, '#08183a'); g.addColorStop(1, '#14407e'); ctx.fillStyle = g; ctx.fillRect(x0, y0, w, h);
    var rs = V.rand(9); for (var i = 0; i < 70; i++) { var sx = x0 + rs() * w, sy = y0 + rs() * 360, sr = 1 + rs() * 2; ctx.fillStyle = 'rgba(255,255,255,' + (0.35 + 0.4 * Math.abs(Math.sin(vt * 1.7 + i))) + ')'; ctx.fillRect(sx, sy, sr, sr); }
    /* earth */
    var eg = ctx.createRadialGradient(ex, ey, er * 0.9, ex, ey, er * 1.02); eg.addColorStop(0, '#0b2c5a'); eg.addColorStop(1, '#1d6fb8'); ctx.beginPath(); ctx.arc(ex, ey, er, 0, 7); ctx.fillStyle = eg; ctx.fill();
    ctx.lineWidth = 12; ctx.strokeStyle = 'rgba(127,216,255,0.55)'; ctx.shadowColor = '#7fd8ff'; ctx.shadowBlur = 24; ctx.stroke(); ctx.shadowColor = 'transparent';
    /* lands at +-24.2 degrees */
    var th = 2688 / 6371, lx = ex - er * Math.sin(th), rx = ex + er * Math.sin(th), ly = ey - er * Math.cos(th);
    [[lx, 'LAND', 56], [rx, 'LAND', -56]].forEach(function (q) { ctx.save(); ctx.translate(q[0], ly - 4); ctx.beginPath(); ctx.ellipse(0, 0, 34, 12, 0, Math.PI, 0); ctx.fillStyle = '#c8a964'; ctx.fill(); ctx.lineWidth = 3; ctx.strokeStyle = '#0a0f1a'; ctx.stroke(); ctx.restore(); V.text(ctx, q[1], q[0] + q[2], ly - 34, { size: 28, weight: 900, tracking: 4, color: '#ffe3b0', stroke: '#050a14', strokeW: 6 }); });
    /* pin */
    V.circle(ctx, ex, py, 13); ctx.fillStyle = '#ff3b30'; ctx.fill(); ctx.lineWidth = 4; ctx.strokeStyle = '#fff'; ctx.stroke(); V.text(ctx, 'POINT NEMO', ex, py + 64, { size: 34, weight: 900, tracking: 4, color: '#ffe08a', stroke: '#050a14', strokeW: 7 });
    /* ground arcs */
    var pg = sm01(t.closer - 0.1, t.closer + 0.9, vt);
    if (pg > 0) { dashPoly(ctx, arcPts(ex, ey, er + 4, -Math.PI / 2, -Math.PI / 2 - th, 40), pg, '#ff6b6f', 6); dashPoly(ctx, arcPts(ex, ey, er + 4, -Math.PI / 2, -Math.PI / 2 + th, 40), pg, '#ff6b6f', 6); chip(ctx, ex - 290, py - 44, '2,700 KM', { size: 38, fill: '#ff5a5f', col: '#fff', a: pg, s: 0.8 + 0.2 * pop(vt, t.closer + 0.6) }); chip(ctx, ex + 290, py - 44, '2,700 KM', { size: 38, fill: '#ff5a5f', col: '#fff', a: pg, s: 0.8 + 0.2 * pop(vt, t.closer + 0.6) }); }
    /* the station: flies in from the left, parks overhead */
    var s0 = t.astro + 0.1, u = V.clamp((vt - t.when) / (s0 - t.when)), ix = u < 1 ? V.lerp(-110, ex, E.out2(u)) : ex + 6 * Math.sin((vt - s0) * 1.4), iy = py - 69 + 3 * Math.sin(vt * 2.2);
    iss(ctx, ix, iy, 0.8);
    if (vt > t.astro) helmet(ctx, ix + 118, iy - 64, 0.9, V.clamp((vt - t.astro) / 0.2) * E.outBack(V.clamp((vt - t.astro) / 0.45)));
    var pb = sm01(t.astro + 0.2, t.astro + 0.75, vt);
    if (pb > 0) { ctx.save(); ctx.strokeStyle = '#7fe3a8'; ctx.lineWidth = 6; ctx.setLineDash([10, 8]); ctx.beginPath(); ctx.moveTo(ex - 48, py - 14); ctx.lineTo(ex - 48, py - 14 - 55 * pb); ctx.stroke(); ctx.restore(); chip(ctx, ex - 150, py - 170, '400 KM', { size: 40, fill: '#35d07f', col: '#10243a', a: pb, s: 0.8 + 0.2 * pop(vt, t.astro + 0.45) }); }
    ctx.restore(); ctx.lineWidth = 5; ctx.strokeStyle = 'rgba(255,255,255,0.45)'; V.rr(ctx, x0, y0, w, h, 44); ctx.stroke(); ctx.restore();
  }).z = 1;
  cue(t.when - 0.1, 'whoosh', 0.45); cue(t.astro + 0.45, 'pop', 0.4); cue(t.closer + 0.5, 'ding', 0.45);

  /* ---------------- the graveyard ---------------- */
  ev(t.that - 0.2, t.hund - 0.2, function (ctx, vt) {
    var a = fadeIO(vt, t.that - 0.2, t.hund - 0.2, 0.4, 0.35), p = P(C0[0], C0[1]); if (a <= 0.004) return;
    ctx.save(); ctx.globalAlpha *= a; V.circle(ctx, p[0], p[1], 215); ctx.fillStyle = 'rgba(255,60,70,0.10)'; ctx.fill(); ctx.setLineDash([26, 18]); ctx.lineDashOffset = -vt * 34; ctx.lineWidth = 7; ctx.strokeStyle = '#ff5a5f'; ctx.stroke(); ctx.restore();
    pin(ctx, C0[0], C0[1], a, '#ff3b30', 15);
  });
  ev(t.grave - 0.1, t.space + 0.1, function (ctx, vt) { var k = V.spring(vt - t.grave, 14, 8); stamp(ctx, 540, 600, 'GRAVEYARD', 0.5 * Math.min(1.12, k), fadeIO(vt, t.grave - 0.1, t.space, 0.1, 0.25), '#ff5a5f', -0.05); }).z = 1;
  cue(t.grave, 'thud', 0.8); cue(t.grave, 'swell', 0.3, 1.6);
  var FALL = [{ a: t.steer + 0.5, k: 0, o: [-640, -1000] }, { a: t.far - 0.2, k: 1, o: [720, -1100] }, { a: t.ocean - 0.1, k: 2, o: [-380, -1250] }, { a: t.hund - 0.75, k: 0, o: [520, -950] }];
  FALL.forEach(function (f, i) {
    var dur = 1.15; cue(f.a - dur + 0.1, 'whoosh', 0.22); cue(f.a, 'thud', 0.55); cue(f.a + 0.05, 'splash', 0.35);
    ev(f.a - dur, f.a + 1.6, function (ctx, vt) {
      var p = P(C0[0], C0[1]), u = V.clamp((vt - (f.a - dur)) / dur), A = [p[0] + f.o[0], p[1] + f.o[1]], M = [p[0] + f.o[0] * 0.45, p[1] + f.o[1] * 0.95], B = [p[0], p[1]];
      if (u > 0 && u < 1) { var e = E.in2(u), q = bez([A, M, B], e), q2 = bez([A, M, B], Math.min(1, e + 0.02)), dx = q2[0] - q[0], dy = q2[1] - q[1], dl = Math.hypot(dx, dy) || 1; fireball(ctx, q[0], q[1], dx / dl, dy / dl, 0.9, 1); craft(ctx, q[0], q[1], f.k, 0.7 * (1 - 0.3 * u), Math.atan2(dy, dx) - Math.PI / 2, 1); }
      var dt = vt - f.a; if (dt > 0 && dt < 1.5) { ring(ctx, C0[0], C0[1], vt, f.a, '#ffffff', 190, 0.95); ring(ctx, C0[0], C0[1], vt, f.a + 0.18, '#7fd8ff', 150, 0.8); for (var j = 0; j < 14; j++) { var ang = j / 14 * 6.283 + i, sp = 90 + (j % 4) * 38, px = p[0] + Math.cos(ang) * sp * dt * 1.5, py2 = p[1] - Math.abs(Math.sin(ang)) * sp * dt * 1.2 + 260 * dt * dt; ctx.fillStyle = 'rgba(220,240,255,' + (1 - dt / 1.5) + ')'; V.circle(ctx, px, py2, 5 * (1 - dt / 1.5) + 1); ctx.fill(); } }
    });
    ev(f.a + 0.3, t.hund - 0.2, function (ctx, vt) { var p = P(C0[0], C0[1]), an = i * 1.7 + 0.6; craft(ctx, p[0] + Math.cos(an) * 105, p[1] + Math.sin(an) * 95, f.k, 0.36, an, 0.75 * V.clamp((vt - f.a - 0.3) / 0.5) * fadeIO(vt, f.a, t.hund - 0.2, 0.1, 0.3)); });
    shk(f.a, f.a + 0.5, 7);
  });

  /* ---------------- the seafloor card ---------------- */
  ev(t.hund - 0.3, t.lonely - 0.05, function (ctx, vt) {
    var a = fadeIO(vt, t.hund - 0.3, t.lonely - 0.05, 0.4, 0.45); if (a <= 0.004) return;
    ctx.save(); ctx.globalAlpha *= a; var g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#0b2f5c'); g.addColorStop(0.55, '#061a33'); g.addColorStop(1, '#020912'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; for (var r = 0; r < 5; r++) { var rx = 120 + r * 220 + 40 * Math.sin(vt * 0.5 + r), rg = ctx.createLinearGradient(rx, 0, rx + 160, 1000); rg.addColorStop(0, 'rgba(120,190,255,0.16)'); rg.addColorStop(1, 'rgba(120,190,255,0)'); ctx.fillStyle = rg; ctx.beginPath(); ctx.moveTo(rx, 0); ctx.lineTo(rx + 110, 0); ctx.lineTo(rx + 330, 1000); ctx.lineTo(rx + 90, 1000); ctx.closePath(); ctx.fill(); } ctx.restore();
    function floorY(x) { return 880 + 38 * Math.sin(x * 0.006 + 0.6) + 26 * Math.sin(x * 0.019 + 1.3); }
    var items = [], rr2 = V.rand(41); for (var i = 0; i < 38; i++) { var ix = 30 + rr2() * 1020; items.push({ x: ix, y: floorY(ix) + 8 + rr2() * 170, k: Math.floor(rr2() * 3), s: 0.5 + rr2() * 0.55, rot: (rr2() - 0.5) * 2.6, t0: t.hund + 0.02 + i * 0.062 }); }
    items.sort(function (p, q) { return p.y - q.y; });
    ctx.beginPath(); ctx.moveTo(0, H); for (var xx = 0; xx <= W; xx += 20) ctx.lineTo(xx, floorY(xx)); ctx.lineTo(W, H); ctx.closePath(); ctx.fillStyle = '#0c1626'; ctx.fill(); ctx.lineWidth = 6; ctx.strokeStyle = '#1d3350'; ctx.beginPath(); for (xx = 0; xx <= W; xx += 20) { if (xx) ctx.lineTo(xx, floorY(xx)); else ctx.moveTo(xx, floorY(xx)); } ctx.stroke();
    items.forEach(function (it) { var u = V.clamp((vt - it.t0) / 0.55); if (u <= 0) return; var yy = V.lerp(-120, it.y, E.in2(u)); craft(ctx, it.x, yy, it.k, it.s, it.rot * (0.4 + 0.6 * u), 0.95); if (u >= 1 && vt - it.t0 < 1.1) { var dk = (vt - it.t0 - 0.55) / 0.55; ctx.fillStyle = 'rgba(160,190,220,' + (0.3 * (1 - dk)) + ')'; V.circle(ctx, it.x, it.y + 20, 20 + 40 * dk); ctx.fill(); } });
    var sn = V.rand(5); ctx.fillStyle = 'rgba(200,225,255,0.55)'; for (i = 0; i < 70; i++) { var sx = sn() * W, sy = ((sn() * H + vt * (20 + sn() * 30)) % H); V.circle(ctx, sx + 14 * Math.sin(vt + i), sy, 1.5 + sn() * 2); ctx.fill(); }
    ctx.fillStyle = 'rgba(2,14,34,0.28)'; ctx.fillRect(0, 0, W, H); ctx.restore();
  }).z = 1;
  cue(t.hund - 0.2, 'whoosh', 0.3); cue(t.hund + 0.1, 'swell', 0.3, 2.4);

  /* ---------------- finale ---------------- */
  ev(t.lonely - 0.2, END + 3, function (ctx, vt) {
    var p = P(C0[0], C0[1]), a = V.clamp((vt - (t.lonely - 0.1)) / 0.5), k = 1 + 0.12 * Math.sin(vt * 6);
    ctx.save(); ctx.globalAlpha *= a; growLine(ctx, RING, 1, 'rgba(255,90,95,0.55)', 5, null, [20, 14]);
    for (var j = 0; j < 6; j++) ring(ctx, C0[0], C0[1], vt, t.lonely + j * 0.55, '#ff5a5f', 200, a);
    if (vt > t.die) { var d = vt - t.die; ctx.globalCompositeOperation = 'lighter'; var rr3 = 90 + 260 * Math.min(1, d * 3), rg = ctx.createRadialGradient(p[0], p[1], 2, p[0], p[1], rr3); rg.addColorStop(0, 'rgba(255,200,120,' + Math.max(0, 0.9 - d) + ')'); rg.addColorStop(1, 'rgba(255,60,40,0)'); ctx.fillStyle = rg; ctx.fillRect(p[0] - rr3, p[1] - rr3, rr3 * 2, rr3 * 2); ctx.globalCompositeOperation = 'source-over'; }
    V.circle(ctx, p[0], p[1], 16 * k); ctx.fillStyle = '#ff3b30'; ctx.fill(); ctx.lineWidth = 5; ctx.strokeStyle = '#fff'; ctx.stroke(); ctx.restore();
    label(ctx, 'POINT NEMO', C0[0], C0[1], { dy: 66, size: 40, tr: 6, col: '#ffe08a', a: a });
  });
  cue(t.lonely - 0.2, 'whoosh', 0.35); cue(t.die, 'thud', 0.95); cue(t.die, 'swell', 0.4, 2.2);
  ev(END + 0.3, END + 3, function (ctx, vt) { ctx.fillStyle = 'rgba(0,0,0,' + sm01(END + 0.35, END + 0.95, vt) + ')'; ctx.fillRect(0, 0, W, H); }).z = 2;
