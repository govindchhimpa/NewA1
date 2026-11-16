
  /* ======================= ZWICKY ======================= */
  function who2(ctx, t, cos, o, g, ph) { o.cos = cos; return Q(ctx, t, o, g, ph); }
  function space(ctx, t, c1, c2) { plain(ctx, c1 || '#070a1e', c2 || '#1a1440'); var r = V.rand(21); for (var i = 0; i < 90; i++) { var x = r() * 1500 - 200, y = r() * 2200 - 400, s = 2 + r() * 4; ctx.fillStyle = 'rgba(255,255,255,' + (0.4 + 0.5 * Math.abs(Math.sin(t * 1.5 + i))) + ')'; ctx.fillRect(x, y, s, s); } }
  function mini(ctx, x, y, s, rot, t, seed) { galaxy(ctx, x, y, s, rot, t * 6, seed); }
  function cluster(ctx, t, cx, cy, speed, spread, halo) {
    if (halo > 0) { ctx.save(); ctx.globalAlpha = halo; V.circle(ctx, cx, cy, 430); ctx.fillStyle = V.rad(ctx, cx, cy, 40, cx, cy, 430, [[0, 'rgba(150,110,255,0.55)'], [0.7, 'rgba(110,80,230,0.28)'], [1, 'rgba(110,80,230,0)']]); ctx.fill(); ctx.setLineDash([26, 18]); ctx.lineDashOffset = -t * 40; ctx.lineWidth = 9; ctx.strokeStyle = '#c9b6ff'; V.circle(ctx, cx, cy, 400); ctx.stroke(); ctx.restore(); }
    for (var i = 0; i < 7; i++) { var a = i * 0.898 + t * speed * (0.8 + (i % 3) * 0.25), rr = (150 + (i % 4) * 62) * spread, x = cx + Math.cos(a) * rr, y = cy + Math.sin(a) * rr * 0.8;
      ctx.save(); ctx.globalAlpha = 0.5; C.ln(ctx, x, y, x + Math.sin(a) * 70 * speed / 3, y - Math.cos(a) * 56 * speed / 3, 10, '#9ad6ff'); ctx.restore(); mini(ctx, x, y, 0.28 + (i % 3) * 0.05, i, t, 3 + i); }
  }
  function scale(ctx, x, y, tilt, t, ghost) {
    ctx.save(); ctx.translate(x, y); ctx.scale(1.3, 1.3); C.ln(ctx, 0, 0, 0, 380, 26, '#c9a23a'); V.rr(ctx, -150, 370, 300, 40, 14); ctx.fillStyle = '#c9a23a'; ctx.fill(); ctx.lineWidth = 7; ctx.strokeStyle = INK; ctx.stroke();
    ctx.rotate(tilt); C.ln(ctx, -330, 0, 330, 0, 24, '#e8c85a'); V.circle(ctx, 0, 0, 26); ctx.fillStyle = '#e8c85a'; ctx.fill(); ctx.stroke();
    [-330, 330].forEach(function (px, i) { ctx.save(); ctx.translate(px, 0); ctx.rotate(-tilt); C.ln(ctx, 0, 0, -90, 200, 6, '#ddd'); C.ln(ctx, 0, 0, 90, 200, 6, '#ddd'); ctx.beginPath(); ctx.ellipse(0, 205, 120, 26, 0, 0, 7); ctx.fillStyle = '#c9a23a'; ctx.fill(); ctx.lineWidth = 7; ctx.strokeStyle = INK; ctx.stroke();
      if (i === 0) { mini(ctx, 0, 130, 0.42, 0.2, t, 5); V.text(ctx, 'WHAT WE SEE', 0, 300, { size: 38, weight: 900, color: '#fff', stroke: '#000', strokeW: 8 }); } else if (ghost > 0) { ctx.globalAlpha = ghost; V.rr(ctx, -95, 15, 190, 180, 30); ctx.fillStyle = 'rgba(120,90,230,0.55)'; ctx.fill(); ctx.setLineDash([18, 12]); ctx.lineWidth = 8; ctx.strokeStyle = '#d9ccff'; ctx.stroke(); ctx.setLineDash([]); V.text(ctx, '?', 0, 150, { size: 150, weight: 900, color: '#fff' }); V.text(ctx, 'HIDDEN', 0, 300, { size: 38, weight: 900, color: '#d9ccff', stroke: '#000', strokeW: 8 }); }
      ctx.restore(); });
    ctx.restore();
  }
  function curve(ctx, x, y, w, h, prog) {
    ctx.save(); ctx.translate(x, y); V.rr(ctx, -w / 2 - 30, -h / 2 - 40, w + 60, h + 110, 24); ctx.fillStyle = 'rgba(12,18,48,0.9)'; ctx.fill(); ctx.lineWidth = 6; ctx.strokeStyle = '#9ad6ff'; ctx.stroke(); C.ln(ctx, -w / 2, h / 2, -w / 2, -h / 2, 8, '#fff'); C.ln(ctx, -w / 2, h / 2, w / 2, h / 2, 8, '#fff');
    V.text(ctx, 'DISTANCE FROM CENTRE →', 0, h / 2 + 52, { size: 32, weight: 900, color: '#9ad6ff' }); V.text(ctx, 'STAR SPEED', -w / 2 + 12, -h / 2 - 2, { size: 30, weight: 900, align: 'left', color: '#9ad6ff' });
    function line(fn, col, pr, dash) { ctx.save(); ctx.strokeStyle = col; ctx.lineWidth = 12; ctx.lineCap = 'round'; if (dash) ctx.setLineDash([20, 18]); ctx.beginPath(); for (var i = 0; i <= 50 * pr; i++) { var u = i / 50, xx = -w / 2 + 10 + u * (w - 30), yy = h / 2 - 10 - fn(u) * (h - 40); if (i) ctx.lineTo(xx, yy); else ctx.moveTo(xx, yy); } ctx.stroke(); ctx.restore(); }
    var rise = function (u) { return Math.min(1, u / 0.18); };
    line(function (u) { return 0.82 * rise(u) * (u < 0.18 ? 1 : Math.sqrt(0.18 / u)); }, '#ff7a6a', V.clamp(prog * 2), true); line(function (u) { return 0.82 * rise(u); }, '#ffd83a', V.clamp(prog * 2 - 0.9));
    if (prog > 0.5) V.text(ctx, 'EXPECTED', w / 2 - 20, h / 2 - 0.36 * (h - 40) + 44, { size: 32, weight: 900, align: 'right', color: '#ff9a8a' }); if (prog > 0.95) V.text(ctx, 'MEASURED', w / 2 - 20, h / 2 - 0.82 * (h - 40) - 36, { size: 34, weight: 900, align: 'right', color: '#ffd83a' });
    ctx.restore();
  }
  function pie2(ctx, x, y, r, u) { ctx.save(); ctx.translate(x, y); var a0 = -Math.PI / 2, a1 = a0 + 6.2832 * 0.85 * V.clamp(u * 1.3), a2 = a0 + 6.2832 * V.clamp(u * 1.3); ctx.beginPath(); ctx.moveTo(0, 0); ctx.arc(0, 0, r, a0, a1); ctx.closePath(); ctx.fillStyle = '#5a3ad8'; ctx.fill(); ctx.lineWidth = 10; ctx.strokeStyle = INK; ctx.stroke(); if (a2 > a1) { ctx.beginPath(); ctx.moveTo(0, 0); ctx.arc(0, 0, r, a1, a2); ctx.closePath(); ctx.fillStyle = '#ffd83a'; ctx.fill(); ctx.stroke(); }
    if (u > 0.6) { V.text(ctx, 'DARK', 40, 60, { size: 96, weight: 900, color: '#fff' }); V.text(ctx, 'MATTER', 40, 150, { size: 78, weight: 900, color: '#fff' }); V.text(ctx, 'ORDINARY', -r * 0.95, -r * 0.7, { size: 46, weight: 900, color: '#ffd83a', stroke: '#000', strokeW: 9 }); } ctx.restore(); }
  var tAst = at('an astronomer said'), tFast = at('moving so fast'), tAns = at('his answer'), tDM = at('dark matter'), tStars = at('and the stars moved'), tEarly = at('he was forty');

  sh(0, [540, 800, 1.0, 1.12], function (ctx, t, lt, u, px) {
    glowBg(ctx, '#0a0a26', '#2a1a5a', 540, 780, 620, 0.35); var k = ck(lt, 0, 0.6), yr = lt < 0.62 ? String(1920 + Math.floor(13 * E.out2(k))) : '1933', pop = lt >= 0.62 ? 1 + 0.12 * Math.exp(-(lt - 0.62) * 10) : 1;
    calendar(ctx, 540, 790, 1.5 * pop, yr, ck(lt, 0, 0.2)); sparks(ctx, 540, 790, lt, 0.62, 22, 520, '#ffd23f'); star(ctx, 180, 480, 30, t); star(ctx, 900, 540, 38, t + 1);
  });
  sh(tAst, [540, 800, 1.0, 1.12], function (ctx, t, lt, u, px) {
    space(ctx, t); var g = ck(lt, 1.3, 0.4), tilt = -0.16 + 0.42 * E.outBack(ck(lt, 1.5, 0.6)); scale(ctx, 540, 600, tilt, t, g); sparks(ctx, 960, 820, lt, 1.5, 18, 380, '#c9b6ff');
    tagS(ctx, lt, [[0, 'THE UNIVERSE...'], [1.3, 'IS HIDING|MOST OF ITS WEIGHT']], { size: 74, y: 250 });
  }, 'zoom');
  sh(at('fritz zwicky saw'), [540, 800, 1.0, 1.12, 60], function (ctx, t, lt, u, px) {
    night2(ctx, t, px); telescope(ctx, 700, GY + 40, 1.25, -0.6); who2(ctx, t, 'zwicky', { x: 330, y: GY + 60, s: 0.95, face: 'determined', lean: 0.04 }, 'point'); mini(ctx, 880, 430, 0.3, 0.3, t, 4); mini(ctx, 740, 340, 0.2, 1, t, 6); tag(ctx, lt, 'FRITZ ZWICKY|COMA CLUSTER', { size: 80, y: 250 });
  }, 'whip', 1, 'night');
  sh(tFast, [540, 800, 1.0, 1.16], function (ctx, t, lt, u, px) {
    space(ctx, t, '#0a0618', '#3a1030'); cluster(ctx, t, 540, 800, 3.4, 1 + 0.25 * ck(lt, 1.2, 1.2), 0); bang(ctx, 880, 470, 1.1, ck(lt, 0.3, 0.25)); tagS(ctx, lt, [[0, 'MOVING|TOO FAST'], [1.3, 'THEY SHOULD|FLY APART']], { size: 80, y: 250, fill: '#ff6a5a', color: '#fff' });
  }, 'zoom');
  sh(tAns, [540, 800, 1.0, 1.14], function (ctx, t, lt, u, px) {
    var d = tDM - tAns; space(ctx, t, '#0a0618', '#201050'); cluster(ctx, t, 540, 800, 2.2, 1.0, ck(lt, 0.9, 0.7)); tagS(ctx, lt, [[0, 'HIS ANSWER'], [1.0, 'INVISIBLE MATTER|HOLDS THEM']], { size: 76, y: 250 }); sparks(ctx, 540, 800, lt, d, 30, 640, '#c9b6ff'); flashO(ctx, lt, d, 0.3);
    if (lt > d) C.stamp(ctx, 540, 1140, 'DARK MATTER', 1.2 * (0.8 + 0.2 * E.outBack(ck(lt, d, 0.25))), -0.05, '#c9b6ff');
  }, 'flash');
  sh(at('nobody listened'), [540, 800, 1.0, 1.12], function (ctx, t, lt, u, px) {
    hall(ctx); who2(ctx, t, 'zwicky', { x: 770, y: GY + 60, s: 0.92, face: 'worry', flip: -1 }, 'talk'); [150, 330, 510].forEach(function (x, i) { ctx.save(); ctx.translate(x, 0); P(ctx, t, { x: 0, y: GY + 60, s: 0.82, cos: 'expert', v: i, face: 'smug', flip: -1, lAbs: [-0.9, 0.3], rAbs: [0.9, -0.3] }); V.text(ctx, 'z', 40 + 16 * Math.sin(t * 2 + i), 560 - ((t * 60 + i * 40) % 120), { size: 70, weight: 900, color: '#fff', stroke: '#000', strokeW: 8 }); ctx.restore(); });
    var yr = String(1933 + Math.floor(40 * E.inOut2(ck(lt, 0.4, 1.9)))); calendar(ctx, 940, 600, 0.46, yr, 1); tag(ctx, lt, 'NOBODY LISTENED|ALMOST 40 YEARS', { size: 76, y: 250 });
  }, 'whip', -1, 'crowd');
  sh(at('then vera rubin'), [540, 800, 1.0, 1.12, -60], function (ctx, t, lt, u, px) {
    night2(ctx, t, px); telescope(ctx, 330, GY + 40, 1.25, 0.6); who2(ctx, t, 'rubin', { x: 740, y: GY + 60, s: 0.95, face: 'determined', flip: -1 }, 'pointL'); galaxy(ctx, 300, 430, 0.5, -0.3, t * 5, 9); tagS(ctx, lt, [[0, 'VERA RUBIN'], [1.6, 'SPINNING GALAXIES|THE 1970s']], { size: 78, y: 250 });
  }, 'slide', 1, 'night');
  sh(tStars, [540, 800, 1.0, 1.12], function (ctx, t, lt, u, px) {
    space(ctx, t); galaxy(ctx, 540, 520, 0.95, -0.25, t * 9, 7); curve(ctx, 540, 990, 760, 300, ck(lt, 0.25, 2.0)); tag(ctx, lt, 'THE SAME|IMPOSSIBLE WAY', { size: 80, y: 235, fill: '#ffd83a' });
  }, 'zoom');
  sh(at('today', 0), [540, 800, 1.0, 1.12], function (ctx, t, lt, u, px) {
    glowBg(ctx, '#0a0a26', '#2a1a6a', 540, 800, 700, 0.45); for (var i = 0; i < 6; i++) { var a = t * 0.8 + i * 1.047; star(ctx, 540 + Math.cos(a) * 450, 800 + Math.sin(a) * 430, 22, t + i); } pie2(ctx, 540, 800, 330, ck(lt, 0.6, 1.4)); tagS(ctx, lt, [[0, 'TODAY'], [0.7, 'MOST OF THE MATTER|IN THE UNIVERSE']], { size: 74, y: 240 });
  }, 'flash');
  sh(at('zwicky was not wrong'), [540, 800, 1.0, 1.12], function (ctx, t, lt, u, px) {
    glowBg(ctx, '#2a1840', '#7a4a1a', 540, 760, 700, 0.5); var d = tEarly - at('zwicky was not wrong'); rays(ctx, 540, 0, 0.3); who2(ctx, t, 'zwicky', { x: 540, y: GY + 60, s: 1.0, face: 'smile' }, lt > d + 0.9 ? 'cheer' : 'hips');
    C.check(ctx, 850, 600, 1.5, ck(lt, 0.75, 0.2)); if (lt > d) calendar(ctx, 220, 560, 0.62 * (0.8 + 0.2 * E.outBack(ck(lt, d, 0.25))), '1933', 1); if (lt > d + 0.9) C.confetti(ctx, t, t - lt + d + 0.9, 60);
    tagS(ctx, lt, [[0, 'ZWICKY WAS|NOT WRONG'], [d, 'HE WAS|40 YEARS EARLY']], { size: 80, y: 250 });
  }, 'whip', 1, '');

  for (var q = 0; q < S.length; q++) { S[q].b = q + 1 < S.length ? S[q + 1].a : END; if (S[q].b <= S[q].a) throw new Error('shot order bad at ' + q); }
  imp(0.62, 0.9); imp(tAst + 1.5, 1.0); imp(tFast + 0.3, 0.8); imp(tDM, 1.2); imp(at('zwicky was not wrong') + 0.75, 0.8); imp(tEarly + 0.9, 1.0);
