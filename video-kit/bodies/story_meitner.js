
  /* ======================= MEITNER ======================= */
  function who2(ctx, t, cos, o, g, ph) { o.cos = cos; return Q(ctx, t, o, g, ph); }
  function nucleus(ctx, x, y, r, seed, n) { var rd = V.rand(seed); for (var i = 0; i < n; i++) { var a = rd() * 6.283, d = Math.sqrt(rd()) * r * 0.72; V.circle(ctx, x + Math.cos(a) * d, y + Math.sin(a) * d, r * 0.3); ctx.fillStyle = i % 2 ? '#ff5a4a' : '#4a8cff'; ctx.fill(); ctx.lineWidth = 5; ctx.strokeStyle = INK; ctx.stroke(); } }
  function splitAtom(ctx, x, y, s, k, t) { /* k 0..1: wobble -> stretch -> two halves fly apart */
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s); var w = k < 0.35 ? Math.sin(t * 22) * 8 * (k / 0.35) : 0, d = k < 0.35 ? 0 : E.out3((k - 0.35) / 0.65) * 250;
    if (d > 0) { ctx.save(); ctx.globalAlpha = Math.max(0, 1 - d / 250) * 0.9 + 0.1; for (var i = 0; i < 12; i++) { var a = i / 12 * 6.283; C.ln(ctx, Math.cos(a) * 60, Math.sin(a) * 60, Math.cos(a) * (120 + d * 1.5), Math.sin(a) * (120 + d * 1.5), 12, '#ffd23f'); } ctx.restore(); }
    if (d <= 0) { ctx.save(); ctx.scale(1 + 0.25 * (k / 0.35), 1 - 0.1 * (k / 0.35)); nucleus(ctx, w, 0, 130, 4, 26); ctx.restore(); } else { nucleus(ctx, -d, -d * 0.12, 96, 5, 14); nucleus(ctx, d, d * 0.12, 96, 6, 14); for (var j = 0; j < 3; j++) { var an = -0.5 + j * 1.9, rr = 60 + d * 1.6; V.circle(ctx, Math.cos(an) * rr, Math.sin(an) * rr - 40, 20); ctx.fillStyle = '#e8e8f0'; ctx.fill(); ctx.lineWidth = 5; ctx.strokeStyle = INK; ctx.stroke(); } }
    ctx.restore();
  }
  function tile(ctx, x, y, s, k, glow) { ctx.save(); ctx.translate(x, y); var sc = s * (0.6 + 0.4 * E.outBack(V.clamp(k))); ctx.scale(sc, sc); ctx.shadowColor = 'rgba(255,220,120,' + (glow || 0) + ')'; ctx.shadowBlur = 80; V.rr(ctx, -230, -270, 460, 540, 36); ctx.fillStyle = V.lin(ctx, 0, -270, 0, 270, [[0, '#3a6ad8'], [1, '#1c3a8a']]); ctx.fill(); ctx.shadowColor = 'transparent'; ctx.lineWidth = 12; ctx.strokeStyle = '#fff'; ctx.stroke();
    V.text(ctx, '109', -190, -180, { size: 86, weight: 900, align: 'left', color: '#ffd83a' }); V.text(ctx, 'Mt', 0, 70, { size: 270, weight: 900, color: '#fff' }); V.text(ctx, 'MEITNERIUM', 0, 205, { size: 58, weight: 900, tracking: 3, color: '#cfe0ff' }); ctx.restore(); }
  function envelope(ctx, x, y, s, rot) { ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s); V.rr(ctx, -90, -58, 180, 116, 10); ctx.fillStyle = '#fff8e6'; ctx.fill(); ctx.lineWidth = 7; ctx.strokeStyle = INK; ctx.stroke(); ctx.beginPath(); ctx.moveTo(-90, -58); ctx.lineTo(0, 16); ctx.lineTo(90, -58); ctx.stroke(); V.circle(ctx, 0, 14, 16); ctx.fillStyle = '#d6343c'; ctx.fill(); ctx.restore(); }
  function suitcase(ctx, x, y, s) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); V.rr(ctx, -70, -100, 140, 100, 14); ctx.fillStyle = '#8a5a33'; ctx.fill(); ctx.lineWidth = 7; ctx.strokeStyle = INK; ctx.stroke(); ctx.beginPath(); ctx.arc(0, -100, 28, Math.PI, 0); ctx.stroke(); C.ln(ctx, -34, -100, -34, 0, 6); C.ln(ctx, 34, -100, 34, 0, 6); ctx.restore(); }
  function snow(ctx, t) { var r = V.rand(12); ctx.fillStyle = '#fff'; for (var i = 0; i < 60; i++) { var x = (r() * 1300 - 100 + 30 * Math.sin(t + i)), y = ((r() * 1700 + t * (60 + r() * 60)) % 1700) - 100; V.circle(ctx, x, y, 4 + r() * 5); ctx.fill(); } }
  var tMei = at('lise meitner fled'), tFis = at('they called it fission'), tTab = at('the periodic table');

  sh(0, [540, 800, 1.0, 1.14], function (ctx, t, lt, u, px) {
    glowBg(ctx, '#0e1030', '#3a1a5a', 660, 700, 560, 0.4); var k = ck(lt, 0.55, 0.9);
    splitAtom(ctx, 680, 690, 1.0, k, t); sparks(ctx, 680, 690, lt, 0.9, 24, 560, '#ffd23f'); flashO(ctx, lt, 0.88, 0.3);
    who2(ctx, t, 'meitner', { x: 230, y: GY + 60, s: 0.9, face: 'determined', lean: 0.04 }, 'point'); tag(ctx, lt, 'SHE EXPLAINED|THE SPLIT ATOM', { size: 80, y: 250 });
  });
  sh(at('and someone else'), [540, 800, 1.0, 1.14], function (ctx, t, lt, u, px) {
    hall(ctx); spot(ctx, 620, 700, 760, 0.55); var o = who2(ctx, t, 'hahn', { x: 640, y: GY + 60, s: 0.98, face: 'smug' }, 'cheer'); C.medal(ctx, 640, 420 + 10 * Math.sin(t * 3), 2.2); sparks(ctx, 640, 440, lt, 0.5, 20, 420, '#ffd23f');
    ctx.save(); ctx.globalAlpha = 0.55; who2(ctx, t, 'meitner', { x: 170, y: GY + 80, s: 0.62, face: 'worry' }, 'down'); ctx.restore(); C.confetti(ctx, t, t - lt + 0.5, 40); tag(ctx, lt, 'SOMEONE ELSE|GOT THE NOBEL', { size: 80, y: 250, fill: '#ffd83a' });
  }, 'whip', 1, 'applause');
  sh(at('in 1938'), [540, 800, 1.0, 1.12], function (ctx, t, lt, u, px) {
    glowBg(ctx, '#1a0a14', '#5a1a26', 540, 780, 620, 0.35); var k = ck(lt, 0, 0.6), yr = lt < 0.62 ? String(1930 + Math.floor(8 * E.out2(k))) : '1938', pop = lt >= 0.62 ? 1 + 0.12 * Math.exp(-(lt - 0.62) * 10) : 1;
    calendar(ctx, 540, 790, 1.5 * pop, yr, ck(lt, 0, 0.2)); sparks(ctx, 540, 790, lt, 0.62, 20, 500, '#ff6a5a');
  }, 'flash');
  sh(tMei, [540, 800, 1.02, 1.14, 80], function (ctx, t, lt, u, px) {
    night2(ctx, t, px); var e = enter(lt, -160, 620, 0, 2.3); ctx.fillStyle = '#2a2a3a'; ctx.fillRect(880, 640, 26, 460); ctx.fillStyle = '#d6343c'; ctx.fillRect(700, 690, 360, 34); ctx.fillStyle = '#fff'; for (var i = 0; i < 4; i++) ctx.fillRect(730 + i * 90, 690, 44, 34);
    var o = who2(ctx, t, 'meitner', { x: e.x, y: GY + 60, s: 0.9, face: 'worry', walk: e.walk || t * 9, lean: 0.07 }, 'down'); suitcase(ctx, e.x + 96, GY + 40 - Math.abs(Math.sin(t * 9)) * 8, 0.8); tag(ctx, lt, 'LISE MEITNER|FLEES GERMANY', { size: 80, y: 250 });
  }, 'slide', 1, 'night');
  sh(at('her old partner'), [540, 800, 1.0, 1.12], function (ctx, t, lt, u, px) {
    office(ctx); desk(ctx, 300, 900, 420); who2(ctx, t, 'hahn', { x: 300, y: GY + 60, s: 0.9, face: lt > 1.6 ? 'worry' : 'determined' }, 'write');
    var k = ck(lt, 1.5, 1.2); if (k > 0) envelope(ctx, lerp(380, 820, E.inOut2(k)), 820 - Math.sin(k * Math.PI) * 330, 1.1, k * 6.283 * 1.0 + 0.1); if (k >= 1) qm(ctx, 900, 560, 0.8, t, '#ff6a5a');
    tagS(ctx, lt, [[0, 'OTTO HAHN|HER OLD PARTNER'], [1.7, 'STRANGE|RESULTS']], { size: 80, y: 250 });
  }, 'whip', -1, 'pen');
  sh(at('uranium had'), [540, 800, 1.0, 1.14], function (ctx, t, lt, u, px) {
    glowBg(ctx, '#10202a', '#1a4a4a', 540, 760, 640, 0.3); var k = ck(lt, 0.75, 0.4); flask2(ctx, 250, 1000, 2.7, '#7ad84a', 'U'); 
    C.ln(ctx, 440, 780, 440 + 160 * ck(lt, 0.3, 0.4), 780, 26, '#fff'); if (ck(lt, 0.3, 0.4) >= 1) C.poly(ctx, [[600, 740], [660, 780], [600, 820]], '#fff');
    if (k > 0) { ctx.save(); ctx.translate(830, 1000); ctx.scale(E.outBack(k), E.outBack(k)); flask2(ctx, 0, 0, 2.7, '#4aa3ff', 'Ba'); ctx.restore(); qm(ctx, 810, 470, 0.9, t, '#ffd83a'); } sparks(ctx, 810, 800, lt, 0.75, 16, 380, '#9ad6ff');
    tag(ctx, lt, 'URANIUM|BECAME BARIUM?', { size: 80, y: 250 });
  }, 'zoom');
  sh(at('she and her nephew'), [540, 800, 1.0, 1.12], function (ctx, t, lt, u, px) {
    plain(ctx, '#bfe0f4', '#eef6fb'); ctx.fillStyle = '#fff'; ctx.fillRect(-400, GY - 20, 1900, 900); [100, 950].forEach(function (x, i) { C.poly(ctx, [[x - 90, GY], [x, GY - 380 - i * 60], [x + 90, GY]], '#2f6a4a', INK, 7); }); snow(ctx, t);
    who2(ctx, t, 'meitner', { x: 380, y: GY + 60, s: 0.9, face: lt > 1.0 ? 'smile' : 'determined' }, 'write'); who2(ctx, t, 'frisch', { x: 720, y: GY + 60, s: 0.9, face: lt > 1.0 ? 'shock' : 'neutral', flip: -1 }, 'talk', 2);
    C.paper(ctx, 550, 830, 1.0, -0.08, 5); bulbE(ctx, 550, 440, 1.3, ck(lt, 1.0, 0.3)); tag(ctx, lt, 'THEY WORKED|OUT WHY', { size: 80, y: 250 });
  }, 'whip', 1, 'birds');
  sh(at('the atom had split'), [540, 800, 1.0, 1.18], function (ctx, t, lt, u, px) {
    glowBg(ctx, '#140a26', '#5a2a1a', 540, 760, 700, 0.5); var d = tFis - at('the atom had split'); splitAtom(ctx, 540, 760, 1.25, ck(lt, 0.05, 1.1), t); flashO(ctx, lt, 0.42, 0.3); sparks(ctx, 540, 760, lt, 0.45, 30, 640, '#ffd23f');
    tagS(ctx, lt, [[0, 'THE ATOM|HAD SPLIT'], [d, 'THEY CALLED IT']], { size: 80, y: 250 }); if (lt > d + 0.45) C.stamp(ctx, 540, 1120, 'FISSION', 1.5 * (0.8 + 0.2 * E.outBack(ck(lt, d + 0.45, 0.25))), -0.06, '#ffd83a');
  }, 'flash');
  sh(at('but the nobel prize'), [540, 800, 1.0, 1.12], function (ctx, t, lt, u, px) {
    hall(ctx); crowdSil(ctx, t, 1290, 8, '#1a0e16', 8); spot(ctx, 700, 700, 700, 0.5); podium(ctx, 700, GY + 60, 1.0); who2(ctx, t, 'hahn', { x: 700, y: GY - 150, s: 0.86, face: 'smug' }, 'raise'); C.medal(ctx, 880, 560, 1.6);
    ctx.save(); ctx.setLineDash([22, 16]); ctx.lineWidth = 9; ctx.strokeStyle = 'rgba(255,255,255,0.75)'; ctx.beginPath(); ctx.ellipse(240, 760, 74, 86, 0, 0, 7); ctx.stroke(); V.rr(ctx, 160, 850, 160, 250, 40); ctx.stroke(); ctx.restore(); V.text(ctx, '?', 240, 800, { size: 120, weight: 900, color: '#fff' });
    tag(ctx, lt, 'THE NOBEL WENT|TO HAHN ALONE', { size: 78, y: 250, fill: '#ff6a5a', color: '#fff' });
  }, 'whip', -1, 'applause');
  sh(at('today element'), [540, 800, 1.0, 1.14], function (ctx, t, lt, u, px) {
    glowBg(ctx, '#0a1436', '#1a3a7a', 540, 780, 700, 0.5); var d = at('meitnerium') - at('today element'); for (var i = 0; i < 6; i++) { var a = t * 0.8 + i * 1.047; star(ctx, 540 + Math.cos(a) * 440, 790 + Math.sin(a) * 420, 24, t + i); }
    tile(ctx, 540, 800, 1.0, ck(lt, 0.25, 0.35), lt > d ? 0.9 : 0.2); sparks(ctx, 540, 800, lt, d, 30, 640, '#ffd23f'); tagS(ctx, lt, [[0, 'TODAY'], [0.7, 'ELEMENT 109']], { size: 96, y: 250 });
  }, 'zoom');
  sh(at('the nobel missed'), [540, 800, 1.0, 1.12], function (ctx, t, lt, u, px) {
    glowBg(ctx, '#2a1840', '#7a4a1a', 540, 760, 700, 0.5); var d = tTab - at('the nobel missed'), k2 = ck(lt, d, 0.3);
    C.medal(ctx, 230, 560, 2.6); C.x(ctx, 230, 600, 1.5, ck(lt, 0.5, 0.15)); if (k2 > 0) { tile(ctx, 830, 620, 0.52, k2, 0.7); C.check(ctx, 830, 930, 1.3, ck(lt, d + 0.75, 0.2)); }
    who2(ctx, t, 'meitner', { x: 540, y: GY + 60, s: 0.95, face: lt > d ? 'smile' : 'determined' }, lt > d + 0.7 ? 'cheer' : 'hips'); if (lt > d + 0.7) C.confetti(ctx, t, t - lt + d + 0.7, 60);
    tagS(ctx, lt, [[0, 'THE NOBEL|MISSED HER'], [d, 'THE PERIODIC|TABLE DID NOT']], { size: 80, y: 250 });
  }, 'whip', 1, '');

  for (var q = 0; q < S.length; q++) { S[q].b = q + 1 < S.length ? S[q + 1].a : END; if (S[q].b <= S[q].a) throw new Error('shot order bad at ' + q); }
  imp(0.9, 1.0); imp(at('and someone else') + 0.5, 0.6); imp(at('in 1938') + 0.62, 0.9); imp(at('the atom had split') + 0.45, 1.2); imp(tFis + 0.45, 1.0); imp(at('meitnerium'), 0.8); imp(tTab + 0.75, 0.8);
