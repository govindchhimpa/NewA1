/* Stick-figure character + prop library (2.5D look: shaded white sphere heads, black stick limbs, costume = identity). */
(function () {
  'use strict';
  var C = window.C = {};
  var INK = '#16161a';
  function ln(ctx, x0, y0, x1, y1, w, col) { ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.lineWidth = w; ctx.strokeStyle = col || INK; ctx.lineCap = 'round'; ctx.stroke(); }
  function poly(ctx, pts, fill, stroke, lw) { ctx.beginPath(); pts.forEach(function (p, i) { if (i) ctx.lineTo(p[0], p[1]); else ctx.moveTo(p[0], p[1]); }); ctx.closePath(); if (fill) { ctx.fillStyle = fill; ctx.fill(); } if (stroke) { ctx.lineWidth = lw || 5; ctx.strokeStyle = stroke; ctx.lineJoin = 'round'; ctx.stroke(); } }
  C.ln = ln; C.poly = poly;

  /* ---------- scenery ---------- */
  C.room = function (ctx, o) {
    var W = V.W, H = V.H, hz = o.hz || 800;
    ctx.fillStyle = V.lin(ctx, 0, 0, 0, hz, [[0, o.wall[0]], [1, o.wall[1]]]); ctx.fillRect(-400, -600, W + 800, hz + 600);
    ctx.fillStyle = V.lin(ctx, 0, hz, 0, H + 600, [[0, o.floor[0]], [1, o.floor[1]]]); ctx.fillRect(-400, hz, W + 800, H + 1200);
    ctx.fillStyle = 'rgba(0,0,0,0.16)'; ctx.fillRect(-400, hz - 16, W + 800, 16);
    if (o.lines !== false) { ctx.strokeStyle = 'rgba(0,0,0,0.10)'; ctx.lineWidth = 3; for (var i = -8; i <= 8; i++) { ctx.beginPath(); ctx.moveTo(W / 2 + i * 70, hz); ctx.lineTo(W / 2 + i * 380, H + 600); ctx.stroke(); } }
  };
  C.window = function (ctx, x, y, w, h, sky) {
    V.rr(ctx, x - 12, y - 12, w + 24, h + 24, 10); ctx.fillStyle = '#2b2f3a'; ctx.fill();
    ctx.fillStyle = sky || V.lin(ctx, 0, y, 0, y + h, [[0, '#0d1033'], [1, '#3a3a8a']]); ctx.fillRect(x, y, w, h);
    ln(ctx, x + w / 2, y, x + w / 2, y + h, 8, '#2b2f3a'); ln(ctx, x, y + h / 2, x + w, y + h / 2, 8, '#2b2f3a');
  };
  C.shadow = function (ctx, x, y, w) { ctx.save(); ctx.translate(x, y); ctx.scale(1, 0.22); V.circle(ctx, 0, 0, w); ctx.fillStyle = 'rgba(0,0,0,0.28)'; ctx.fill(); ctx.restore(); };
  C.sign = function (ctx, x, y, w, h, str, o) {
    o = o || {}; ctx.save(); ctx.translate(x, y); ctx.rotate(o.rot || 0); ctx.shadowColor = 'rgba(0,0,0,0.35)'; ctx.shadowBlur = 16; ctx.shadowOffsetY = 8;
    V.rr(ctx, -w / 2, -h / 2, w, h, 18); ctx.fillStyle = o.fill || '#f7f2e4'; ctx.fill(); ctx.shadowColor = 'transparent'; ctx.lineWidth = 7; ctx.strokeStyle = o.edge || INK; ctx.stroke();
    var lines = String(str).split('|'), fs = o.size || Math.min(h * 0.55, w / (Math.max.apply(0, lines.map(function (l) { return l.length; })) * 0.62));
    lines.forEach(function (l, i) { V.text(ctx, l, 0, (i - (lines.length - 1) / 2) * fs * 1.12 + fs * 0.34, { size: fs, weight: 900, color: o.color || '#1a1a22' }); }); ctx.restore();
  };

  /* ---------- character ---------- */
  var SK = { shirt: '#6aa7e8' };
  function arm(ctx, sx, sy, a1, a2, s, col) {
    var l1 = 78 * s, l2 = 74 * s, ex = sx + Math.sin(a1) * l1, ey = sy + Math.cos(a1) * l1, b = a1 + a2, hx = ex + Math.sin(b) * l2, hy = ey + Math.cos(b) * l2;
    ln(ctx, sx, sy, ex, ey, 11 * s, col || INK); ln(ctx, ex, ey, hx, hy, 11 * s, col || INK); V.circle(ctx, hx, hy, 8 * s); ctx.fillStyle = col || INK; ctx.fill();
    return [hx, hy];
  }
  /* o: x,y(feet),s,cos,face,lA,rA,walk,lean,tint,belly,flip,t(bob time),hair */
  C.person = function (ctx, o) {
    var s = (o.s || 1) * 1.35, t = o.t || 0, bob = Math.sin(t * 3 + (o.ph || 0)) * 3 * s, w = o.walk || 0, lean = o.lean || 0;
    ctx.save(); ctx.translate(o.x, o.y); ctx.scale((o.flip || 1) * s, s); ctx.rotate(lean);
    C.shadow(ctx, 0, 4, 80);
    var sw = Math.sin(w) * 38;
    /* legs */
    var pants = { doc: '#33405a', expert: '#2a2a30', wife: INK, warren: '#4a4a55', patient: '#5a7fb0', suit: '#17181c', plain: '#2a2a30' }[o.cos] || INK;
    ln(ctx, -16, -135, -26 - sw, 0, 14, pants); ln(ctx, 16, -135, 26 + sw, 0, 14, pants);
    ctx.fillStyle = INK; V.rr(ctx, -52 - sw, -8, 40, 14, 7); ctx.fill(); V.rr(ctx, 12 + sw, -8, 40, 14, 7); ctx.fill();
    ctx.translate(0, bob);
    /* body / costume */
    var cs = o.cos || 'plain', bel = o.belly || 0;
    ln(ctx, 0, -285, 0, -135, 12, INK);
    if (cs === 'doc') { poly(ctx, [[-44, -292], [44, -292], [62 + bel * 22, -60], [-62 - bel * 22, -60]], '#f6f8fc', INK, 5); poly(ctx, [[-16, -292], [0, -230], [16, -292]], '#4c78c9', INK, 3); ln(ctx, 0, -230, 0, -60, 3, '#b9c2d3'); }
    else if (cs === 'expert') { V.rr(ctx, -44, -292, 88, 160 + bel * 20, 14); ctx.fillStyle = '#e8b730'; ctx.fill(); ctx.lineWidth = 5; ctx.strokeStyle = INK; ctx.stroke(); [-250, -215, -180].forEach(function (y) { V.circle(ctx, 0, y, 6); ctx.fillStyle = INK; ctx.fill(); }); poly(ctx, [[-22, -292], [0, -276], [22, -292], [22, -262], [0, -276], [-22, -262]], '#d6343c', INK, 3); }
    else if (cs === 'wife') { poly(ctx, [[-36, -292], [36, -292], [78, -58], [-78, -58]], '#d6343c', INK, 5); ln(ctx, -36, -200, 36, -200, 5, '#8c1f27'); }
    else if (cs === 'warren') { V.rr(ctx, -44, -292, 88, 170, 14); ctx.fillStyle = '#4f8f5a'; ctx.fill(); ctx.lineWidth = 5; ctx.strokeStyle = INK; ctx.stroke(); ln(ctx, 0, -292, 0, -122, 4, '#c9e6c9'); }
    else if (cs === 'patient') { V.rr(ctx, -44 - bel * 18, -292, 88 + bel * 36, 170 + bel * 16, 14 + bel * 14); ctx.fillStyle = '#7db6ee'; ctx.fill(); ctx.lineWidth = 5; ctx.strokeStyle = INK; ctx.stroke(); }
    else if (cs === 'suit') { V.rr(ctx, -46, -292, 92, 176, 12); ctx.fillStyle = '#1c1d24'; ctx.fill(); ctx.lineWidth = 5; ctx.strokeStyle = INK; ctx.stroke(); poly(ctx, [[-18, -292], [0, -220], [18, -292]], '#ffffff'); poly(ctx, [[-16, -280], [0, -268], [16, -280], [16, -256], [0, -268], [-16, -256]], '#d6343c', INK, 3); }
    else { V.rr(ctx, -44, -292, 88, 170, 14); ctx.fillStyle = o.shirt || SK.shirt; ctx.fill(); ctx.lineWidth = 5; ctx.strokeStyle = INK; ctx.stroke(); }
    /* arms (hands returned for props) */
    var la = o.lA || [0.25, 0.1], ra = o.rA || [-0.25, -0.1];
    var armCol = (cs === 'doc' || cs === 'expert' || cs === 'warren' || cs === 'suit' || cs === 'patient') ? INK : INK;
    var hl = o.lAbs ? arm(ctx, -40, -280, o.lAbs[0], o.lAbs[1] - o.lAbs[0], 1, armCol) : arm(ctx, -40, -280, -la[0], -la[1], 1, armCol);
    var hr = o.rAbs ? arm(ctx, 40, -280, o.rAbs[0], o.rAbs[1] - o.rAbs[0], 1, armCol) : arm(ctx, 40, -280, -ra[0], -ra[1], 1, armCol);
    var fl = o.flip || 1; o.wL = [o.x + fl * s * hl[0], o.y + s * (hl[1] + bob)]; o.wR = [o.x + fl * s * hr[0], o.y + s * (hr[1] + bob)];
    if (o.hold) { ctx.save(); o.hold(ctx, hr, hl); ctx.restore(); }
    /* head */
    var hy = -362, tint = o.tint || 0;
    ln(ctx, 0, -292, 0, -300, 12, INK);
    ctx.save(); ctx.translate(0, hy); ctx.rotate(o.tilt || 0);
    V.circle(ctx, 0, 0, 70); ctx.fillStyle = V.rad(ctx, -22, -26, 8, 0, 0, 78, [[0, '#ffffff'], [0.6, tint ? mix('#f2f2f2', '#b4dc86', tint) : '#f1f3f6'], [1, tint ? mix('#c6cbd3', '#7cae52', tint) : '#c3c9d4']]); ctx.fill(); ctx.lineWidth = 5; ctx.strokeStyle = INK; ctx.stroke();
    face(ctx, o.face || 'neutral', t, o.look || 0);
    if (cs === 'doc') { ctx.fillStyle = '#2b1d14'; ctx.beginPath(); ctx.arc(0, -4, 72, Math.PI * 1.12, Math.PI * 1.88); ctx.lineTo(40, -52); ctx.quadraticCurveTo(0, -36, -40, -52); ctx.closePath(); ctx.fill(); ctx.lineWidth = 3; ctx.strokeStyle = INK; ctx.stroke(); V.circle(ctx, -26, -2, 22); ctx.lineWidth = 5; ctx.strokeStyle = INK; ctx.stroke(); V.circle(ctx, 26, -2, 22); ctx.stroke(); ln(ctx, -4, -4, 4, -4, 4, INK); }
    if (cs === 'suit') { ctx.fillStyle = '#2b1d14'; ctx.beginPath(); ctx.arc(0, -4, 72, Math.PI * 1.12, Math.PI * 1.88); ctx.lineTo(40, -52); ctx.quadraticCurveTo(0, -36, -40, -52); ctx.closePath(); ctx.fill(); V.circle(ctx, -26, -2, 22); ctx.lineWidth = 5; ctx.strokeStyle = INK; ctx.stroke(); V.circle(ctx, 26, -2, 22); ctx.stroke(); ln(ctx, -4, -4, 4, -4, 4, INK); }
    if (cs === 'expert') { ctx.fillStyle = INK; ctx.beginPath(); ctx.ellipse(0, -62, 82, 14, 0, 0, 7); ctx.fill(); ctx.beginPath(); ctx.moveTo(-52, -62); ctx.quadraticCurveTo(-52, -140, 0, -140); ctx.quadraticCurveTo(52, -140, 52, -62); ctx.closePath(); ctx.fill(); ln(ctx, -48, -76, 48, -76, 8, '#d6343c'); ctx.fillStyle = INK; ctx.beginPath(); ctx.moveTo(-34, 26); ctx.quadraticCurveTo(0, 14, 34, 26); ctx.quadraticCurveTo(0, 36, -34, 26); ctx.fill(); }
    if (cs === 'wife') { V.circle(ctx, 0, -92, 26); ctx.fillStyle = INK; ctx.fill(); ctx.beginPath(); ctx.arc(0, -4, 72, Math.PI * 1.08, Math.PI * 1.92); ctx.lineTo(40, -50); ctx.quadraticCurveTo(0, -34, -40, -50); ctx.closePath(); ctx.fill(); }
    if (cs === 'warren') { ctx.fillStyle = '#9aa0aa'; ctx.beginPath(); ctx.arc(0, -8, 72, Math.PI * 1.15, Math.PI * 1.85); ctx.lineTo(44, -44); ctx.quadraticCurveTo(0, -30, -44, -44); ctx.closePath(); ctx.fill(); ctx.fillStyle = '#9aa0aa'; ctx.beginPath(); ctx.moveTo(-30, 26); ctx.quadraticCurveTo(0, 18, 30, 26); ctx.quadraticCurveTo(0, 44, -30, 26); ctx.fill(); }
    ctx.restore(); ctx.restore();
    return o;
  };
  function mix(a, b, k) { function p(h) { return [parseInt(h.substr(1, 2), 16), parseInt(h.substr(3, 2), 16), parseInt(h.substr(5, 2), 16)]; } var x = p(a), y = p(b); return 'rgb(' + x.map(function (v, i) { return Math.round(v + (y[i] - v) * k); }).join(',') + ')'; }
  function face(ctx, f, t, look) {
    var blink = (Math.sin(t * 1.7) > 0.985), ex = 24, ey = -6, lk = look * 5;
    ctx.fillStyle = INK; ctx.strokeStyle = INK; ctx.lineWidth = 6; ctx.lineCap = 'round';
    function eyes(r) { if (blink) { ln(ctx, -ex - 8 + lk, ey, -ex + 8 + lk, ey, 5); ln(ctx, ex - 8 + lk, ey, ex + 8 + lk, ey, 5); } else { V.circle(ctx, -ex + lk, ey, r); ctx.fill(); V.circle(ctx, ex + lk, ey, r); ctx.fill(); } }
    if (f === 'laugh') { ctx.beginPath(); ctx.arc(-ex, ey + 4, 11, Math.PI * 1.1, Math.PI * 1.9); ctx.stroke(); ctx.beginPath(); ctx.arc(ex, ey + 4, 11, Math.PI * 1.1, Math.PI * 1.9); ctx.stroke(); ctx.beginPath(); ctx.moveTo(-26, 22); ctx.quadraticCurveTo(0, 62 + Math.sin(t * 22) * 5, 26, 22); ctx.closePath(); ctx.fillStyle = '#3a1020'; ctx.fill(); ctx.stroke(); }
    else if (f === 'sick') { ln(ctx, -ex - 9, ey - 9, -ex + 9, ey + 9, 5); ln(ctx, -ex + 9, ey - 9, -ex - 9, ey + 9, 5); ln(ctx, ex - 9, ey - 9, ex + 9, ey + 9, 5); ln(ctx, ex + 9, ey - 9, ex - 9, ey + 9, 5); ctx.beginPath(); ctx.moveTo(-24, 34); for (var i = 1; i <= 6; i++) ctx.lineTo(-24 + i * 8, 34 + (i % 2 ? -8 : 8)); ctx.stroke(); }
    else if (f === 'shock') { eyes(8); ctx.beginPath(); ctx.ellipse(0, 32, 13, 18, 0, 0, 7); ctx.fillStyle = '#3a1020'; ctx.fill(); ctx.stroke(); ln(ctx, -ex - 10, ey - 24, -ex + 8, ey - 30, 5); ln(ctx, ex + 10, ey - 24, ex - 8, ey - 30, 5); }
    else if (f === 'smile') { eyes(7); ctx.beginPath(); ctx.arc(0, 14, 28, 0.2 * Math.PI, 0.8 * Math.PI); ctx.stroke(); }
    else if (f === 'smug') { eyes(6); ln(ctx, -ex - 9, ey - 17, -ex + 8, ey - 13, 5); ln(ctx, ex - 8, ey - 13, ex + 9, ey - 17, 5); ctx.beginPath(); ctx.moveTo(-18, 34); ctx.quadraticCurveTo(6, 40, 24, 26); ctx.stroke(); }
    else if (f === 'determined') { eyes(7); ln(ctx, -ex - 10, ey - 20, -ex + 9, ey - 11, 6); ln(ctx, ex + 10, ey - 20, ex - 9, ey - 11, 6); ln(ctx, -16, 34, 16, 34, 6); }
    else if (f === 'worry') { eyes(7); ln(ctx, -ex - 9, ey - 11, -ex + 9, ey - 19, 5); ln(ctx, ex + 9, ey - 11, ex - 9, ey - 19, 5); ctx.beginPath(); ctx.arc(0, 44, 16, Math.PI * 1.1, Math.PI * 1.9); ctx.stroke(); }
    else if (f === 'yuck') { ln(ctx, -ex - 9, ey, -ex + 9, ey, 6); ln(ctx, ex - 9, ey, ex + 9, ey, 6); ctx.beginPath(); ctx.moveTo(-22, 34); ctx.quadraticCurveTo(0, 20, 22, 34); ctx.stroke(); }
    else { eyes(7); ln(ctx, -14, 32, 14, 32, 5); }
  }

  /* ---------- props ---------- */
  C.glass = function (ctx, x, y, s, lvl, col) {
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s); poly(ctx, [[-34, -90], [34, -90], [26, 0], [-26, 0]], 'rgba(220,240,255,0.55)', INK, 5);
    if (lvl > 0) { var h = 84 * lvl; poly(ctx, [[-31 + (1 - lvl) * 6, -h - 4], [31 - (1 - lvl) * 6, -h - 4], [24, -4], [-24, -4]], col || '#7fd13b'); } ctx.restore();
  };
  C.dish = function (ctx, x, y, r, bac, t) {
    ctx.save(); ctx.translate(x, y); V.circle(ctx, 0, 0, r); ctx.fillStyle = 'rgba(225,240,250,0.8)'; ctx.fill(); ctx.lineWidth = 7; ctx.strokeStyle = INK; ctx.stroke();
    V.circle(ctx, 0, 0, r * 0.82); ctx.fillStyle = '#f2d98a'; ctx.fill();
    var rn = V.rand(5); for (var i = 0; i < (bac || 0); i++) { var a = rn() * 6.28, d = Math.sqrt(rn()) * r * 0.7; C.spiral(ctx, Math.cos(a) * d, Math.sin(a) * d, r * 0.09, '#2caf1e', a + (t || 0) * 0.5); } ctx.restore();
  };
  C.spiral = function (ctx, x, y, r, col, rot) {
    ctx.save(); ctx.translate(x, y); ctx.rotate(rot || 0); ctx.lineWidth = Math.max(2, r * 0.5); ctx.strokeStyle = col; ctx.lineCap = 'round'; ctx.beginPath();
    for (var i = 0; i <= 24; i++) { var u = i / 24, px = (u - 0.5) * r * 5, py = Math.sin(u * 12.56) * r * 0.9; if (i) ctx.lineTo(px, py); else ctx.moveTo(px, py); } ctx.stroke(); ctx.restore();
  };
  C.stomach = function (ctx, x, y, s, infl, bac, t) {
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
    ctx.beginPath(); ctx.moveTo(-70, -150); ctx.bezierCurveTo(10, -170, 40, -80, 120, -50); ctx.bezierCurveTo(210, -20, 190, 140, 70, 150); ctx.bezierCurveTo(-60, 160, -140, 70, -90, -30); ctx.bezierCurveTo(-80, -70, -100, -110, -70, -150); ctx.closePath();
    ctx.fillStyle = V.rad(ctx, 20, 20, 10, 20, 20, 190, [[0, mix('#f4a3a8', '#e0291c', infl)], [1, mix('#d9777f', '#8f0f10', infl)]]); ctx.fill(); ctx.lineWidth = 8; ctx.strokeStyle = INK; ctx.stroke();
    var rn = V.rand(9); for (var i = 0; i < (bac || 0); i++) C.spiral(ctx, -40 + rn() * 190, -60 + rn() * 170, 9, '#7dff4a', rn() * 6 + (t || 0)); ctx.restore();
  };
  C.pill = function (ctx, x, y, s, rot, a, b) { ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s); V.rr(ctx, -30, -14, 60, 28, 14); ctx.fillStyle = a || '#f6f6f6'; ctx.fill(); ctx.save(); ctx.clip(); ctx.fillStyle = b || '#e0752f'; ctx.fillRect(0, -20, 40, 40); ctx.restore(); V.rr(ctx, -30, -14, 60, 28, 14); ctx.lineWidth = 4; ctx.strokeStyle = INK; ctx.stroke(); ctx.restore(); };
  C.bottle = function (ctx, x, y, s, str, col) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); V.rr(ctx, -44, -120, 88, 120, 14); ctx.fillStyle = col || '#e0752f'; ctx.fill(); ctx.lineWidth = 6; ctx.strokeStyle = INK; ctx.stroke(); V.rr(ctx, -36, -150, 72, 34, 10); ctx.fillStyle = '#f6f6f6'; ctx.fill(); ctx.stroke(); V.rr(ctx, -36, -92, 72, 56, 6); ctx.fillStyle = '#fff'; ctx.fill(); V.text(ctx, str, 0, -54, { size: 17, weight: 900, color: INK }); ctx.restore(); };
  C.pig = function (ctx, x, y, s, t) {
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s); C.shadow(ctx, 0, 6, 110);
    ln(ctx, -50, -20, -52, 6, 14, '#e68a98'); ln(ctx, 50, -20, 52, 6, 14, '#e68a98'); ln(ctx, -20, -20, -20, 6, 14, '#c9707e'); ln(ctx, 20, -20, 20, 6, 14, '#c9707e');
    ctx.beginPath(); ctx.ellipse(0, -60, 90, 60, 0, 0, 7); ctx.fillStyle = '#f6a3b1'; ctx.fill(); ctx.lineWidth = 6; ctx.strokeStyle = INK; ctx.stroke();
    ctx.beginPath(); ctx.ellipse(86, -68, 40, 38, 0, 0, 7); ctx.fillStyle = '#f6a3b1'; ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.ellipse(118, -60, 16, 14, 0, 0, 7); ctx.fillStyle = '#e07a8c'; ctx.fill(); ctx.stroke(); V.circle(ctx, 112, -60, 3); ctx.fillStyle = INK; ctx.fill(); V.circle(ctx, 124, -60, 3); ctx.fill();
    V.circle(ctx, 84, -82, 6); ctx.fill(); poly(ctx, [[70, -104], [84, -134], [98, -102]], '#e68a98', INK, 5);
    ctx.beginPath(); ctx.arc(-94, -64, 14, 0, 5); ctx.lineWidth = 6; ctx.stroke(); ctx.restore();
  };
  C.x = function (ctx, x, y, s, a) { ctx.save(); ctx.globalAlpha *= a === undefined ? 1 : a; ctx.translate(x, y); ctx.scale(s, s); ln(ctx, -60, -60, 60, 60, 26, INK); ln(ctx, 60, -60, -60, 60, 26, INK); ln(ctx, -60, -60, 60, 60, 16, '#e0290c'); ln(ctx, 60, -60, -60, 60, 16, '#e0290c'); ctx.restore(); };
  C.check = function (ctx, x, y, s, a) { ctx.save(); ctx.globalAlpha *= a === undefined ? 1 : a; ctx.translate(x, y); ctx.scale(s, s); ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.beginPath(); ctx.moveTo(-60, 0); ctx.lineTo(-18, 46); ctx.lineTo(64, -50); ctx.lineWidth = 34; ctx.strokeStyle = INK; ctx.stroke(); ctx.lineWidth = 22; ctx.strokeStyle = '#2caf1e'; ctx.stroke(); ctx.restore(); };
  C.stamp = function (ctx, x, y, str, s, rot, col) { ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s); var w = V.textWidth(ctx, str, { size: 96, weight: 900, tracking: 4 }) + 60; ctx.lineWidth = 12; ctx.strokeStyle = col; V.rr(ctx, -w / 2, -76, w, 130, 16); ctx.stroke(); V.text(ctx, str, 0, 28, { size: 96, weight: 900, tracking: 4, color: col }); ctx.restore(); };
  C.paper = function (ctx, x, y, s, rot, lines) { ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s); ctx.shadowColor = 'rgba(0,0,0,0.3)'; ctx.shadowBlur = 14; ctx.shadowOffsetY = 6; ctx.fillStyle = '#fbfaf4'; ctx.fillRect(-90, -120, 180, 240); ctx.shadowColor = 'transparent'; ctx.lineWidth = 5; ctx.strokeStyle = INK; ctx.strokeRect(-90, -120, 180, 240); for (var i = 0; i < (lines || 7); i++) ln(ctx, -66, -84 + i * 26, 66 - (i % 3) * 18, -84 + i * 26, 6, '#9aa0aa'); ctx.restore(); };
  C.stink = function (ctx, x, y, t, col) { ctx.save(); ctx.strokeStyle = col || '#6fbf3a'; ctx.lineWidth = 9; ctx.lineCap = 'round'; for (var i = 0; i < 3; i++) { ctx.beginPath(); for (var k = 0; k <= 12; k++) { var yy = y - k * 12 - ((t * 60 + i * 30) % 40), xx = x + i * 34 - 34 + Math.sin(k * 0.9 + t * 4 + i) * 11; if (k) ctx.lineTo(xx, yy); else ctx.moveTo(xx, yy); } ctx.stroke(); } ctx.restore(); };
  C.bucket = function (ctx, x, y, s) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); poly(ctx, [[-50, -90], [50, -90], [38, 0], [-38, 0]], '#9aa4b4', INK, 6); ctx.beginPath(); ctx.ellipse(0, -90, 50, 12, 0, 0, 7); ctx.fillStyle = '#6b7280'; ctx.fill(); ctx.stroke(); ctx.restore(); };
  C.clock = function (ctx, x, y, r, tm, label) { ctx.save(); ctx.translate(x, y); V.circle(ctx, 0, 0, r); ctx.fillStyle = '#fff'; ctx.fill(); ctx.lineWidth = 8; ctx.strokeStyle = INK; ctx.stroke(); for (var i = 0; i < 12; i++) { var a = i / 12 * 6.283; ln(ctx, Math.sin(a) * r * 0.82, -Math.cos(a) * r * 0.82, Math.sin(a) * r * 0.92, -Math.cos(a) * r * 0.92, 5, INK); } var a1 = tm * 6.283, a2 = tm * 6.283 * 12; ln(ctx, 0, 0, Math.sin(a1) * r * 0.5, -Math.cos(a1) * r * 0.5, 9, INK); ln(ctx, 0, 0, Math.sin(a2) * r * 0.75, -Math.cos(a2) * r * 0.75, 6, '#d6343c'); ctx.restore(); };
  C.medal = function (ctx, x, y, s) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ln(ctx, -22, -70, 0, 0, 10, '#2357ba'); ln(ctx, 22, -70, 0, 0, 10, '#2357ba'); V.circle(ctx, 0, 24, 34); ctx.fillStyle = V.rad(ctx, -8, 14, 4, 0, 24, 36, [[0, '#fff2a8'], [1, '#d9a620']]); ctx.fill(); ctx.lineWidth = 5; ctx.strokeStyle = INK; ctx.stroke(); ctx.restore(); };
  C.confetti = function (ctx, t, t0, n) { var r = V.rand(77), cols = ['#f9d136', '#e0290c', '#22b9e4', '#2caf1e', '#ff7a2f', '#ffffff']; for (var i = 0; i < n; i++) { var x = r() * 1080, sp = 260 + r() * 320, y = -60 + (((t - t0) * sp + r() * 2000) % 2200) - 200, rot = (t * (2 + r() * 5)) + i; if (t < t0) continue; ctx.save(); ctx.translate(x + Math.sin(t * 2 + i) * 30, y); ctx.rotate(rot); ctx.fillStyle = cols[i % 6]; ctx.fillRect(-9, -5, 18, 10); ctx.restore(); } };
  C.cloud = function (ctx, x, y, s, col) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.fillStyle = col || '#fff'; [[0, 0, 40], [38, -10, 34], [-38, -6, 30], [68, 6, 26], [-66, 8, 24]].forEach(function (c) { V.circle(ctx, c[0], c[1], c[2]); ctx.fill(); }); ctx.restore(); };
})();
