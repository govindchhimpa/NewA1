
  /* ======================= LEMAITRE ======================= */
  function who2(ctx, t, cos, o, g, ph) { o.cos = cos; return Q(ctx, t, o, g, ph); }
  function space(ctx, t, c1, c2) { plain(ctx, c1 || '#070a1e', c2 || '#1a1440'); var r = V.rand(21); for (var i = 0; i < 90; i++) { var x = r() * 1500 - 200, y = r() * 2200 - 400, s = 2 + r() * 4; ctx.fillStyle = 'rgba(255,255,255,' + (0.4 + 0.5 * Math.abs(Math.sin(t * 1.5 + i))) + ')'; ctx.fillRect(x, y, s, s); } }
  function swarm(ctx, t, cx, cy, k, trail) { /* k: 0 = one point, 1 = spread */
    for (var i = 0; i < 9; i++) { var a = i * 0.698 + 0.3, rr = (170 + (i % 3) * 110) * k, x = cx + Math.cos(a) * rr, y = cy + Math.sin(a) * rr * 0.95;
      if (trail && k > 0.15) { ctx.save(); ctx.globalAlpha = 0.6; C.ln(ctx, cx + Math.cos(a) * rr * 0.72, cy + Math.sin(a) * rr * 0.95 * 0.72, x, y, 9, trail); ctx.restore(); }
      galaxy(ctx, x, y, (0.32 + (i % 3) * 0.07) * (0.25 + 0.75 * Math.min(1, k * 1.4)), i, t * 6, 3 + i); }
  }
  function burst(ctx, x, y, k, t) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; var r = 60 + 560 * k; ctx.fillStyle = V.rad(ctx, x, y, 4, x, y, r, [[0, 'rgba(255,250,220,1)'], [0.25, 'rgba(255,200,90,0.8)'], [1, 'rgba(255,90,40,0)']]); ctx.fillRect(x - r, y - r, r * 2, r * 2); ctx.restore(); for (var i = 0; i < 16; i++) { var a = i / 16 * 6.283 + t * 0.2; C.ln(ctx, x + Math.cos(a) * 50, y + Math.sin(a) * 50, x + Math.cos(a) * (90 + 520 * k), y + Math.sin(a) * (90 + 520 * k), 10, '#ffd23f'); } }
  var tAbo = at('abominable'), tExp = at('the universe is expanding'), tRun = at('run it backward'), tPoint = at('one tiny point'), tSaid = at('einstein said'), tPhys = at('but his physics'), tTwo = at('two years later'), tHub = at('hubble saw'), tRight = at('the priest was right'), tCall = at('we call it'), tBang = at('big bang'), tCalled = at('einstein called');

  sh(0, [540, 800, 1.0, 1.14], function (ctx, t, lt, u, px) {
    glowBg(ctx, '#0e1030', '#3a1a5a', 540, 640, 560, 0.4); burst(ctx, 540, 560, 0.12 + 0.1 * ck(lt, 1.6, 1.0), t);
    who2(ctx, t, 'lemaitre', { x: 250, y: GY + 60, s: 0.92, face: 'determined', lean: 0.03 }, 'point'); who2(ctx, t, 'einstein', { x: 840, y: GY + 60, s: 0.92, face: lt > 2.2 ? 'yuck' : 'smug', flip: -1 }, 'hips', 2);
    tag(ctx, lt, 'THE UNIVERSE|HAD A BEGINNING', { size: 80, y: 250 });
  });
  sh(tCalled, [540, 800, 1.05, 1.2], function (ctx, t, lt, u, px) {
    study(ctx); var d = tAbo - tCalled; who2(ctx, t, 'einstein', { x: 540, y: GY + 80, s: 1.15, face: 'yuck' }, 'down'); tag(ctx, lt, 'EINSTEIN|CALLED IT...', { size: 80, y: 250 });
    if (lt > d) { C.stamp(ctx, 540, 1150, 'ABOMINABLE', 1.25 * (0.8 + 0.2 * E.outBack(ck(lt, d, 0.25))), -0.06, '#ff5a4a'); C.x(ctx, 860, 520, 1.4, ck(lt, d + 0.1, 0.15)); }
  }, 'zoom');
  sh(at('in 1927'), [540, 800, 1.0, 1.12], function (ctx, t, lt, u, px) {
    glowBg(ctx, '#0a0a26', '#2a1a5a', 540, 780, 620, 0.35); var k = ck(lt, 0, 0.6), yr = lt < 0.62 ? String(1920 + Math.floor(7 * E.out2(k))) : '1927', pop = lt >= 0.62 ? 1 + 0.12 * Math.exp(-(lt - 0.62) * 10) : 1; calendar(ctx, 540, 790, 1.5 * pop, yr, ck(lt, 0, 0.2)); sparks(ctx, 540, 790, lt, 0.62, 22, 520, '#ffd23f');
  }, 'flash');
  sh(7.4, [540, 800, 1.0, 1.12], function (ctx, t, lt, u, px) {
    hall(ctx); spot(ctx, 540, 700, 760, 0.5); who2(ctx, t, 'lemaitre', { x: 540, y: GY + 60, s: 1.05, face: 'smile' }, 'hips'); C.ln(ctx, 512, 596, 568, 596, 16, '#ffffff'); tagS(ctx, lt, [[0, 'GEORGES LEMAITRE'], [1.3, 'PRIEST|AND PHYSICIST']], { size: 80, y: 250 });
  }, 'whip', 1, '');
  sh(at('did the math'), [540, 800, 1.0, 1.1], function (ctx, t, lt, u, px) {
    study(ctx); board(ctx, 640, 620, 640, 420, ck(lt, 0, 0.9)); who2(ctx, t, 'lemaitre', { x: 230, y: GY + 60, s: 0.92, face: 'determined' }, 'write'); tag(ctx, lt, 'HE DID|THE MATH', { size: 84, y: 250 });
  }, 'whip', -1, 'pen');
  sh(tExp, [540, 800, 1.0, 1.16], function (ctx, t, lt, u, px) {
    space(ctx, t); swarm(ctx, t, 540, 800, 0.45 + 0.6 * ck(lt, 0, 2.0), '#9ad6ff'); tag(ctx, lt, 'THE UNIVERSE|IS EXPANDING', { size: 80, y: 250 });
  }, 'zoom');
  sh(tRun, [540, 800, 1.16, 1.0], function (ctx, t, lt, u, px) {
    var d = tPoint - tRun, k = 1.05 - 1.05 * E.inOut2(ck(lt, 0.1, d + 0.4)); space(ctx, t, '#0a0618', '#201050'); swarm(ctx, t, 540, 800, Math.max(0, k), '#ffb46a');
    if (k <= 0.02) { burst(ctx, 540, 800, 0.05 + 0.04 * Math.sin(t * 8), t); } C.poly(ctx, [[150, 520], [90, 560], [150, 600]], '#fff'); C.poly(ctx, [[220, 520], [160, 560], [220, 600]], '#fff');
    tagS(ctx, lt, [[0, 'RUN IT|BACKWARD'], [d, 'ONE TINY|POINT']], { size: 84, y: 250 }); sparks(ctx, 540, 800, lt, d + 0.5, 24, 520, '#ffd23f');
  }, 'flash');
  sh(tSaid, [540, 800, 1.0, 1.12], function (ctx, t, lt, u, px) {
    study(ctx); var d = tPhys - tSaid; who2(ctx, t, 'einstein', { x: 780, y: GY + 60, s: 0.95, face: lt > d ? 'yuck' : 'smug', flip: -1 }, 'talk'); who2(ctx, t, 'lemaitre', { x: 260, y: GY + 60, s: 0.92, face: lt > d ? 'worry' : 'smile' }, 'hips', 2);
    C.paper(ctx, 520, 760, 0.9, -0.06, 5); C.check(ctx, 520, 600, 1.3, ck(lt, 1.2, 0.2)); if (lt > d) C.x(ctx, 520, 600, 1.5, ck(lt, d + 0.9, 0.15));
    tagS(ctx, lt, [[0, 'YOUR MATH|IS CORRECT'], [d, 'YOUR PHYSICS|IS TERRIBLE']], { size: 78, y: 250 });
  }, 'whip', 1, 'room');
  sh(tTwo, [540, 800, 1.0, 1.1], function (ctx, t, lt, u, px) {
    glowBg(ctx, '#0a0a26', '#1a3a6a', 540, 780, 620, 0.35); var yr = lt < 0.45 ? String(1927 + Math.floor(2 * ck(lt, 0, 0.45))) : '1929'; calendar(ctx, 540, 790, 1.5 * (lt >= 0.45 ? 1 + 0.12 * Math.exp(-(lt - 0.45) * 10) : 1), yr, 1); tag(ctx, lt, 'TWO YEARS LATER', { size: 84, y: 250 });
  }, 'flash');
  sh(tHub, [540, 800, 1.0, 1.14, 60], function (ctx, t, lt, u, px) {
    night2(ctx, t, px); telescope(ctx, 700, GY + 40, 1.25, -0.6); who2(ctx, t, 'hubble', { x: 330, y: GY + 60, s: 0.95, face: 'shock', lean: 0.04 }, 'point');
    for (var i = 0; i < 4; i++) { var k = ck(lt, 0.2 + i * 0.15, 1.8), x = 780 + (i % 2 ? 1 : -1) * (50 + i * 28) * (1 + k * 0.9), y = 640 - i * 36 - 70 * k; ctx.save(); ctx.globalAlpha = 0.6; C.ln(ctx, 780, 620, x, y, 8, '#ff7a6a'); ctx.restore(); galaxy(ctx, x, y, 0.3 - 0.1 * k, i, t * 6, 4 + i); }
    tag(ctx, lt, 'HUBBLE SAW GALAXIES|RACING AWAY', { size: 72, y: 250 });
  }, 'slide', 1, 'night');
  sh(tRight, [540, 800, 1.0, 1.16], function (ctx, t, lt, u, px) {
    var d = tBang - tRight, k = ck(lt, d, 0.9); glowBg(ctx, '#2a1840', '#7a4a1a', 540, 760, 700, 0.5); if (k > 0) { burst(ctx, 540, 640, k, t); swarm(ctx, t, 540, 640, 0.9 * k, null); }
    who2(ctx, t, 'lemaitre', { x: 540, y: GY + 60, s: 1.0, face: 'smile' }, lt > d ? 'cheer' : 'hips'); C.check(ctx, 850, 640, 1.5, ck(lt, 0.45, 0.2)); flashO(ctx, lt, d, 0.3); if (lt > d) C.confetti(ctx, t, t - lt + d, 60);
    tagS(ctx, lt, [[0, 'THE PRIEST|WAS RIGHT'], [d - 0.75, 'WE CALL IT...']], { size: 80, y: 250 }); if (lt > d) C.stamp(ctx, 540, 1150, 'THE BIG BANG', 1.2 * (0.8 + 0.2 * E.outBack(ck(lt, d, 0.25))), -0.05, '#ffd83a');
  }, 'whip', 1, '');

  for (var q = 0; q < S.length; q++) { S[q].b = q + 1 < S.length ? S[q + 1].a : END; if (S[q].b <= S[q].a) throw new Error('shot order bad at ' + q); }
  imp(tAbo, 1.1); imp(at('in 1927') + 0.62, 0.8); imp(tPoint + 0.5, 0.9); imp(tPhys + 0.9, 0.8); imp(tBang, 1.3);
