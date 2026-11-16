/* Flat-vector 2D people (real proportions, skin, hair, clothes, hands, shoes). Overrides C.person; same pose API (lAbs/rAbs absolute angles from straight down). */
(function () {
  'use strict';
  var C = window.C, INK = '#1b1b24';
  function rgb(h) { if (h.charAt(0) === 'r') return h.match(/\d+/g).slice(0, 3).map(Number); return [parseInt(h.substr(1, 2), 16), parseInt(h.substr(3, 2), 16), parseInt(h.substr(5, 2), 16)]; }
  function sh(h, k) { var c = rgb(h).map(function (v) { return Math.max(0, Math.min(255, Math.round(k < 1 ? v * k : v + (255 - v) * (k - 1)))); }); return 'rgb(' + c.join(',') + ')'; }
  function mixc(a, b, k) { var x = rgb(a), y = rgb(b); return 'rgb(' + x.map(function (v, i) { return Math.round(v + (y[i] - v) * k); }).join(',') + ')'; }
  var SKINS = ['#f1c7a2', '#d99a72', '#a86a45', '#f6d6bd'];
  function limb(ctx, x0, y0, x1, y1, w0, w1, col, edge) {
    var dx = x1 - x0, dy = y1 - y0, L = Math.hypot(dx, dy) || 1, nx = -dy / L, ny = dx / L;
    ctx.beginPath(); ctx.moveTo(x0 + nx * w0 / 2, y0 + ny * w0 / 2); ctx.lineTo(x1 + nx * w1 / 2, y1 + ny * w1 / 2); ctx.arc(x1, y1, w1 / 2, Math.atan2(ny, nx), Math.atan2(ny, nx) + Math.PI, true);
    ctx.lineTo(x0 - nx * w0 / 2, y0 - ny * w0 / 2); ctx.arc(x0, y0, w0 / 2, Math.atan2(-ny, -nx), Math.atan2(-ny, -nx) + Math.PI, true); ctx.closePath();
    ctx.fillStyle = col; ctx.fill(); if (edge) { ctx.lineWidth = 3; ctx.strokeStyle = edge; ctx.stroke(); }
  }
  function hand(ctx, x, y, ang, skin) { ctx.save(); ctx.translate(x, y); ctx.rotate(-ang); ctx.beginPath(); ctx.ellipse(0, 12, 14, 19, 0, 0, 7); ctx.fillStyle = skin; ctx.fill(); ctx.lineWidth = 3; ctx.strokeStyle = sh(skin, 0.7); ctx.stroke(); ctx.beginPath(); ctx.ellipse(-12, 6, 6, 11, 0.4, 0, 7); ctx.fillStyle = skin; ctx.fill(); ctx.stroke(); ctx.restore(); }

  var LOOK = {
    doc: { skin: 0, hair: '#3a2616', style: 'short', glasses: true, top: '#f6f8fc', inner: '#9cc4ee', tie: '#2b4a9a', pants: '#2b3550', coat: true, shoe: '#2a2020' },
    patient: { skin: 3, hair: '#5a3a22', style: 'short', top: '#5b8fd1', inner: '#5b8fd1', pants: '#3b4f73', shoe: '#e8e8e8' },
    wife: { skin: 3, hair: '#3a2418', style: 'bun', top: '#d6343c', dress: true, shoe: '#8c1f27' },
    warren: { skin: 0, hair: '#e6e8ec', style: 'bald', beard: '#eceef2', glasses: true, top: '#4f8f5a', inner: '#f2f2f2', pants: '#585866', shoe: '#2a2020', cardigan: true },
    weg: { skin: 0, hair: '#3a2a1e', style: 'short', mus: '#3a2a1e', top: '#5a4a3c', inner: '#f2f2f2', tie: '#2a2a32', pants: '#2b2b32', shoe: '#1a1a1a', coat: false },
    wegp: { skin: 0, hair: '#3a2a1e', style: 'short', mus: '#3a2a1e', top: '#c0392b', pants: '#2b2b32', shoe: '#1a1a1a' },
    kar: { skin: 0, hair: '#6b4a2e', style: 'bun', top: '#eef3f7', inner: '#6a8fd0', tie: '#6a8fd0', pants: '#3a3a48', shoe: '#2a2020', coat: true },
    weis: { skin: 0, hair: '#8d9097', style: 'short', glasses: true, top: '#4a7ab0', inner: '#ffffff', pants: '#2b2b32', shoe: '#1a1a1a' },
    sem: { skin: 0, hair: '#2a1e16', style: 'short', mus: '#2a1e16', top: '#3d4a3a', inner: '#ffffff', tie: '#8a2a2a', pants: '#2b2b32', shoe: '#1a1a1a' },
    midwife: { skin: 1, hair: '#4a2e1a', style: 'bun', top: '#e8eef4', dress: true, shoe: '#e0e0e0' },
    marg: { skin: 0, hair: '#4a3020', style: 'bun', glasses: true, top: '#f6f8fc', inner: '#c06a8a', tie: '#c06a8a', pants: '#3a3a48', shoe: '#2a2020', coat: true },
    rous: { skin: 0, hair: '#3a2616', style: 'short', glasses: true, top: '#f6f8fc', inner: '#2f6f9f', tie: '#2f6f9f', pants: '#2b2b32', shoe: '#1a1a1a', coat: true },
    rousold: { skin: 0, hair: '#c9ccd2', style: 'short', glasses: true, top: '#1c1d24', inner: '#ffffff', tie: '#d6343c', bow: true, pants: '#1c1d24', shoe: '#101014' },
    folk: { skin: 0, hair: '#3a2616', style: 'short', top: '#f6f8fc', inner: '#9cc4ee', tie: '#2b4a9a', pants: '#2b3550', shoe: '#2a2020', coat: true },
    folkn: { skin: 0, hair: '#3a2616', style: 'short', top: '#1f2d52', inner: '#ffffff', tie: '#15151c', pants: '#1f2d52', shoe: '#101014' },
    folko: { skin: 0, hair: '#b9bcc4', style: 'short', glasses: true, top: '#f6f8fc', inner: '#8fb4d8', tie: '#9a2a3a', pants: '#2b2b32', shoe: '#1a1a1a', coat: true },
    oldw: { skin: 3, hair: '#d9d9de', style: 'bun', glasses: true, top: '#8a5aa0', dress: true, shoe: '#5a3a6a' },
    oldm: { skin: 3, hair: '#e3e4e8', style: 'bald', beard: '#e3e4e8', glasses: true, top: '#6b8f5a', inner: '#f2f2f2', pants: '#4a4a56', shoe: '#2a2020', cardigan: true },
    avery: { skin: 0, hair: '#cfd0d6', style: 'short', glasses: true, top: '#f6f8fc', inner: '#ffffff', tie: '#2b4a9a', bow: true, pants: '#3a3a44', shoe: '#1a1a1a', coat: true },
    grif: { skin: 0, hair: '#5a3a22', style: 'short', mus: '#5a3a22', top: '#7a5a3c', inner: '#f2f2f2', tie: '#2a2a32', pants: '#2b2b32', shoe: '#1a1a1a' },
    mac: { skin: 0, hair: '#2a1c14', style: 'short', top: '#f6f8fc', inner: '#9cc4ee', tie: '#9a2a3a', pants: '#2b3550', shoe: '#2a2020', coat: true },
    mcc: { skin: 3, hair: '#6a4a2a', style: 'short', glasses: true, top: '#f6f8fc', inner: '#ffffff', tie: '#2b6a4a', pants: '#2b2b32', shoe: '#2a2020', coat: true },
    hers: { skin: 0, hair: '#8a8d95', style: 'short', top: '#4a5a7a', inner: '#f2f2f2', tie: '#2a2a32', pants: '#2b2b32', shoe: '#1a1a1a' },
    chase: { skin: 3, hair: '#3a2418', style: 'bun', top: '#7aa6d8', dress: true, shoe: '#2a2a3a' },
    wat: { skin: 0, hair: '#d9c9a0', style: 'short', top: '#7a6a5a', inner: '#f2f2f2', tie: '#9a2a3a', pants: '#2b2b32', shoe: '#1a1a1a' },
    cri: { skin: 0, hair: '#3a2616', style: 'short', top: '#3a4a6a', inner: '#f2f2f2', tie: '#d6a21e', pants: '#2b2b32', shoe: '#1a1a1a' },
    meitner: { skin: 0, hair: '#4a3a30', style: 'bun', top: '#6a4a7a', dress: true, shoe: '#2a2a3a' },
    hahn: { skin: 0, hair: '#b9bcc4', style: 'short', mus: '#b9bcc4', top: '#f6f8fc', inner: '#ffffff', tie: '#2a2a32', pants: '#2b2b32', shoe: '#1a1a1a', coat: true },
    frisch: { skin: 0, hair: '#3a2616', style: 'short', glasses: true, top: '#5a6a4a', inner: '#f2f2f2', tie: '#7a2a2a', pants: '#2b2b32', shoe: '#1a1a1a' },
    zwicky: { skin: 0, hair: '#2a1c14', style: 'short', top: '#3a4a6a', inner: '#ffffff', tie: '#9a2a3a', bow: true, pants: '#2b3550', shoe: '#1a1a1a' },
    rubin: { skin: 0, hair: '#5a4030', style: 'short', glasses: true, top: '#b0503a', dress: true, shoe: '#2a2a3a' },
    lemaitre: { skin: 0, hair: '#2a2018', style: 'short', glasses: true, top: '#17171c', inner: '#ffffff', pants: '#17171c', shoe: '#101010' },
    einstein: { skin: 0, hair: '#ececf0', style: 'short', mus: '#d8d8de', top: '#7a6a52', inner: '#f2f2f2', pants: '#3a3a44', shoe: '#1a1a1a' },
    hubble: { skin: 0, hair: '#5a4632', style: 'short', top: '#4a5a3a', inner: '#ffffff', tie: '#7a2a2a', pants: '#2b2b32', shoe: '#1a1a1a' },
    leavitt: { skin: 0, hair: '#5a3a26', style: 'bun', top: '#6f8f78', dress: true, shoe: '#2a2a3a' },
    pickering: { skin: 0, hair: '#d9d9de', style: 'short', beard: '#d9d9de', glasses: true, top: '#2e3446', inner: '#ffffff', tie: '#1c1d24', pants: '#252a38', shoe: '#1a1a1a' },
    hubble: { skin: 0, hair: '#4a3626', style: 'short', top: '#8a6a44', inner: '#f2f2f2', tie: '#2a2a32', pants: '#2b2b32', shoe: '#1a1a1a' },
    payne: { skin: 0, hair: '#6b4630', style: 'bun', top: '#3f6e9a', dress: true, shoe: '#2a2a3a' },
    payneold: { skin: 0, hair: '#c9ccd2', style: 'bun', glasses: true, top: '#2b3a5a', dress: true, shoe: '#2a2a3a' },
    russell: { skin: 0, hair: '#8d9097', style: 'short', mus: '#8d9097', glasses: true, top: '#1c1d24', inner: '#ffffff', tie: '#d6343c', pants: '#1c1d24', shoe: '#101014' },
    struve: { skin: 0, hair: '#b9bcc4', style: 'short', mus: '#b9bcc4', glasses: true, top: '#3b2f2a', inner: '#ffffff', tie: '#2b4a9a', pants: '#2b2b32', shoe: '#1a1a1a' },
    suit: { skin: 0, hair: '#3a2616', style: 'short', glasses: true, top: '#1c1d24', inner: '#ffffff', tie: '#d6343c', bow: true, pants: '#1c1d24', shoe: '#101014' }
  };
  var EXP = [
    { skin: 0, hair: '#8d9097', style: 'bald', mus: '#8d9097', top: '#3b3f4a', inner: '#ffffff', tie: '#d6343c', pants: '#2c2f38', shoe: '#1a1a1a' },
    { skin: 2, hair: '#1f1b18', style: 'short', top: '#6b4a36', inner: '#f4efe4', tie: '#e8b730', pants: '#4a3426', shoe: '#1a1a1a', glasses: true },
    { skin: 1, hair: '#d9d9de', style: 'short', beard: '#d9d9de', top: '#2c3e66', inner: '#ffffff', tie: '#2caf1e', pants: '#222a44', shoe: '#1a1a1a' }
  ];

  C.person = function (ctx, o) {
    var L = (o.cos === 'expert') ? EXP[(o.v || 0) % 3] : (LOOK[o.cos] || LOOK.patient);
    var s = (o.s || 1) * 1.07 * 1.15, t = o.t || 0, ph = (o.ph || 0) + (o.x || 0) * 0.013, breath = Math.sin(t * 1.9 + ph), sway = Math.sin(t * 0.8 + ph * 1.3), w = o.walk || 0, bob = w ? -Math.abs(Math.sin(w)) * 11 : breath * 2.2, bel = o.belly || 0, tint = o.tint || 0;
    var skin = SKINS[L.skin]; if (tint) skin = mixc(skin, '#b4dc86', tint);
    var skinD = sh(skin, 0.78), fl = o.flip || 1;
    ctx.save(); ctx.translate(o.x, o.y); ctx.scale(fl * s, s); ctx.rotate((o.lean || 0) + sway * 0.012); C.shadow(ctx, 0, 6, 100);
    var sw = Math.sin(w) * 30;
    /* legs: thigh + shin with knee bend, foot lifts while stepping */
    var pc = L.dress ? skin : L.pants, shoe = L.shoe, pe = L.dress ? skinD : sh(pc, 0.7);
    function leg(hx, fx, lift) { var fy = -22 - lift, kx = (hx + fx) / 2 + 9 + lift * 0.8, ky = (-236 + fy) / 2 + 4; limb(ctx, hx, -236, kx, ky, 38, 34, pc, pe); limb(ctx, kx, ky, fx, fy, 34, 30, pc, pe); return fy; }
    var lf = Math.max(0, Math.cos(w)) * (w ? 18 : 0), rf = Math.max(0, -Math.cos(w)) * (w ? 18 : 0);
    var fyl = leg(-22, -26 - sw, lf), fyr = leg(22, 26 + sw, rf);
    [[-26 - sw, -1, fyl], [26 + sw, 1, fyr]].forEach(function (f) { ctx.save(); ctx.translate(f[0] + f[1] * 12, f[2] + 14); ctx.rotate(f[2] < -24 ? -0.25 : 0); ctx.beginPath(); ctx.ellipse(0, 0, 34, 15, 0, 0, 7); ctx.fillStyle = shoe; ctx.fill(); ctx.restore(); });
    ctx.translate(0, bob); ctx.translate(0, -230); ctx.scale(1 + 0.005 * breath, 1 + 0.011 * breath); ctx.translate(0, 230);
    /* torso */
    var tw = 56 + bel * 24, hw = 48 + bel * 30;
    function torsoPath(bot) { ctx.beginPath(); ctx.moveTo(-tw, -372); ctx.quadraticCurveTo(0, -396, tw, -372); ctx.lineTo(hw, bot); ctx.lineTo(-hw, bot); ctx.closePath(); }
    ctx.beginPath(); ctx.rect(-14, -412, 28, 40); ctx.fillStyle = skinD; ctx.fill();
    if (L.dress) { ctx.beginPath(); ctx.moveTo(-tw + 6, -372); ctx.quadraticCurveTo(0, -394, tw - 6, -372); ctx.lineTo(hw + 6, -232); ctx.lineTo(hw + 44, -96); ctx.lineTo(-hw - 44, -96); ctx.lineTo(-hw - 6, -232); ctx.closePath(); ctx.fillStyle = L.top; ctx.fill(); ctx.lineWidth = 3; ctx.strokeStyle = sh(L.top, 0.7); ctx.stroke(); ctx.beginPath(); ctx.ellipse(0, -374, 24, 12, 0, 0, 3.14); ctx.fillStyle = skin; ctx.fill(); }
    else {
      var botY = L.coat ? -92 : -222; torsoPath(L.coat ? -92 : -222); ctx.fillStyle = L.top; ctx.fill(); ctx.lineWidth = 3; ctx.strokeStyle = sh(L.top, 0.7); ctx.stroke();
      if (L.coat) { ctx.beginPath(); ctx.moveTo(-26, -384); ctx.lineTo(26, -384); ctx.lineTo(18, -230); ctx.lineTo(-18, -230); ctx.closePath(); ctx.fillStyle = L.inner; ctx.fill(); ctx.beginPath(); ctx.moveTo(-8, -386); ctx.lineTo(8, -386); ctx.lineTo(6, -300); ctx.lineTo(-6, -300); ctx.closePath(); ctx.fillStyle = L.tie; ctx.fill(); ctx.beginPath(); ctx.moveTo(0, -380); ctx.lineTo(0, -92); ctx.lineWidth = 3; ctx.strokeStyle = '#c5ccd9'; ctx.stroke(); }
      else if (L.inner && !L.cardigan && o.cos !== 'patient') { ctx.beginPath(); ctx.moveTo(-24, -388); ctx.lineTo(24, -388); ctx.lineTo(0, -300); ctx.closePath(); ctx.fillStyle = L.inner; ctx.fill(); if (L.bow) { ctx.beginPath(); ctx.moveTo(0, -382); ctx.lineTo(-20, -394); ctx.lineTo(-20, -370); ctx.closePath(); ctx.moveTo(0, -382); ctx.lineTo(20, -394); ctx.lineTo(20, -370); ctx.closePath(); ctx.fillStyle = L.tie; ctx.fill(); } else if (L.tie) { ctx.beginPath(); ctx.moveTo(-6, -388); ctx.lineTo(6, -388); ctx.lineTo(8, -300); ctx.lineTo(0, -280); ctx.lineTo(-8, -300); ctx.closePath(); ctx.fillStyle = L.tie; ctx.fill(); } }
      else if (L.cardigan) { ctx.beginPath(); ctx.moveTo(-22, -388); ctx.lineTo(22, -388); ctx.lineTo(14, -230); ctx.lineTo(-14, -230); ctx.closePath(); ctx.fillStyle = L.inner; ctx.fill(); }
      else { ctx.beginPath(); ctx.ellipse(0, -386, 18, 9, 0, 0, 3.14); ctx.fillStyle = skin; ctx.fill(); }
      if (!L.coat) { ctx.fillStyle = sh(L.pants, 1); ctx.fillRect(-hw, -226, hw * 2, 14); }
    }
    /* arms: shoulder at (+-54,-372) */
    var la = o.lAbs || [-(o.lA ? o.lA[0] : 0.2), -(o.lA ? o.lA[0] : 0.2) - 0.15], ra = o.rAbs || [(o.rA ? -o.rA[0] : 0.2), (o.rA ? -o.rA[0] : 0.2) + 0.15];
    var wsg = (w && !o.lAbs) ? Math.sin(w) * 0.4 : 0, idl = 0.03 * Math.sin(t * 1.4 + ph);
    la = [la[0] + idl + wsg, la[1] + idl * 1.6 + wsg * 1.3]; ra = [ra[0] - idl - wsg, ra[1] - idl * 1.6 - wsg * 1.3];
    var sleeve = L.dress ? skin : (L.coat ? L.top : L.top), sedge = L.dress ? skinD : sh(sleeve, 0.7);
    function arm2(sx, sy, ang) { var x1 = sx + Math.sin(ang[0]) * 104, y1 = sy + Math.cos(ang[0]) * 104, x2 = x1 + Math.sin(ang[1]) * 98, y2 = y1 + Math.cos(ang[1]) * 98; limb(ctx, sx, sy, x1, y1, 30, 26, sleeve, sedge); if (!L.dress) { limb(ctx, x1, y1, x2, y2, 26, 22, sleeve, sedge); } else limb(ctx, x1, y1, x2, y2, 24, 20, skin, skinD); hand(ctx, x2, y2, ang[1], skin); return [x2, y2]; }
    var hl = arm2(-54, -372, la), hr = arm2(54, -372, ra);
    o.wL = [o.x + fl * s * hl[0], o.y + s * (hl[1] + bob)]; o.wR = [o.x + fl * s * hr[0], o.y + s * (hr[1] + bob)];
    /* head */
    ctx.save(); ctx.translate(0, -458); ctx.translate(0, -breath * 1.4); ctx.rotate((o.tilt || 0) + 0.03 * Math.sin(t * 1.1 + ph) + (w ? Math.sin(w * 2) * 0.012 : 0));
    if (L.style === 'bun') { ctx.beginPath(); ctx.ellipse(0, 10, 62, 74, 0, 0, 7); ctx.fillStyle = L.hair; ctx.fill(); V.circle(ctx, 0, -76, 24); ctx.fill(); }
    ctx.beginPath(); ctx.ellipse(-52, 8, 9, 15, 0, 0, 7); ctx.fillStyle = skinD; ctx.fill(); ctx.beginPath(); ctx.ellipse(52, 8, 9, 15, 0, 0, 7); ctx.fill();
    ctx.beginPath(); ctx.moveTo(-50, -4); ctx.bezierCurveTo(-50, -66, 50, -66, 50, -4); ctx.bezierCurveTo(50, 40, 28, 66, 0, 66); ctx.bezierCurveTo(-28, 66, -50, 40, -50, -4); ctx.closePath();
    ctx.fillStyle = V.lin(ctx, -50, 0, 50, 0, [[0, sh(skin, 1.06)], [0.7, skin], [1, skinD]]); ctx.fill(); ctx.lineWidth = 3; ctx.strokeStyle = sh(skin, 0.62); ctx.stroke();
    if (L.beard) { ctx.beginPath(); ctx.moveTo(-48, 6); ctx.bezierCurveTo(-52, 66, -20, 78, 0, 78); ctx.bezierCurveTo(20, 78, 52, 66, 48, 6); ctx.bezierCurveTo(40, 34, 22, 36, 0, 38); ctx.bezierCurveTo(-22, 36, -40, 34, -48, 6); ctx.fillStyle = L.beard; ctx.fill(); }
    face(ctx, o.face || 'neutral', t, (o.look || 0) + 0.35 * Math.sin(t * 0.6 + ph), skin, L);
    /* hair */
    if (L.style === 'short' || L.style === 'bun') { ctx.beginPath(); ctx.moveTo(-54, -2); ctx.bezierCurveTo(-60, -78, 58, -86, 54, -2); ctx.bezierCurveTo(46, -26, 36, -44, 6, -48); ctx.bezierCurveTo(-18, -46, -42, -36, -54, -2); ctx.fillStyle = L.hair; ctx.fill(); }
    if (L.style === 'bald') { ctx.beginPath(); ctx.ellipse(-50, -6, 11, 22, 0.2, 0, 7); ctx.fillStyle = L.hair; ctx.fill(); ctx.beginPath(); ctx.ellipse(50, -6, 11, 22, -0.2, 0, 7); ctx.fill(); }
    if (L.glasses) { ctx.lineWidth = 5; ctx.strokeStyle = '#2a2a33'; ctx.beginPath(); ctx.ellipse(-22, -4, 19, 16, 0, 0, 7); ctx.stroke(); ctx.beginPath(); ctx.ellipse(22, -4, 19, 16, 0, 0, 7); ctx.stroke(); ctx.beginPath(); ctx.moveTo(-3, -6); ctx.lineTo(3, -6); ctx.stroke(); ctx.fillStyle = 'rgba(200,230,255,0.18)'; ctx.beginPath(); ctx.ellipse(-22, -4, 18, 15, 0, 0, 7); ctx.fill(); ctx.beginPath(); ctx.ellipse(22, -4, 18, 15, 0, 0, 7); ctx.fill(); }
    ctx.restore(); ctx.restore();
    return o;
  };

  function face(ctx, f, t, look, skin, L) {
    var blink = Math.sin(t * 1.7 + 1) > 0.985, ex = 22, ey = -4, lk = look * 4, brow = L.hair === '#e6e8ec' || L.hair === '#8d9097' || L.hair === '#d9d9de' ? '#9a9da6' : L.hair;
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    function eye(x, open, sq) { if (blink || open <= 0.05) { C.ln(ctx, x - 10, ey + 2, x + 10, ey + 2, 4, INK); return; } ctx.beginPath(); ctx.ellipse(x, ey, 10.5, 8.5 * open, 0, 0, 7); ctx.fillStyle = '#fff'; ctx.fill(); ctx.lineWidth = 2.5; ctx.strokeStyle = sh(skin, 0.5); ctx.stroke(); V.circle(ctx, x + lk, ey + 1, 5.2 * Math.min(1, open + 0.3)); ctx.fillStyle = '#2a1c12'; ctx.fill(); V.circle(ctx, x + lk + 1.6, ey - 1.2, 1.6); ctx.fillStyle = '#fff'; ctx.fill(); }
    function brows(l, r) { C.ln(ctx, -ex - 12, ey - 17 + l[0], -ex + 11, ey - 17 + l[1], 5, brow); C.ln(ctx, ex - 11, ey - 17 + r[0], ex + 12, ey - 17 + r[1], 5, brow); }
    function nose() { ctx.beginPath(); ctx.moveTo(0, 2); ctx.quadraticCurveTo(7, 16, -1, 20); ctx.lineWidth = 3; ctx.strokeStyle = sh(skin, 0.6); ctx.stroke(); }
    function cheeks() { ctx.fillStyle = 'rgba(230,100,100,0.22)'; ctx.beginPath(); ctx.ellipse(-32, 24, 11, 7, 0, 0, 7); ctx.fill(); ctx.beginPath(); ctx.ellipse(32, 24, 11, 7, 0, 0, 7); ctx.fill(); }
    ctx.strokeStyle = '#3a1a1a';
    if (f === 'laugh') { eye(-ex, 0, 0); eye(ex, 0, 0); ctx.lineWidth = 5; ctx.strokeStyle = INK; ctx.beginPath(); ctx.arc(-ex, ey + 6, 9, Math.PI * 1.1, Math.PI * 1.9); ctx.stroke(); ctx.beginPath(); ctx.arc(ex, ey + 6, 9, Math.PI * 1.1, Math.PI * 1.9); ctx.stroke(); brows([-2, -5], [-5, -2]); nose(); ctx.beginPath(); ctx.moveTo(-26, 30); ctx.quadraticCurveTo(0, 30, 26, 30); ctx.quadraticCurveTo(20, 62 + Math.sin(t * 22) * 4, 0, 62); ctx.quadraticCurveTo(-20, 62, -26, 30); ctx.fillStyle = '#5a1420'; ctx.fill(); ctx.fillStyle = '#fff'; ctx.fillRect(-20, 30, 40, 9); ctx.beginPath(); ctx.ellipse(0, 54, 12, 7, 0, 0, 7); ctx.fillStyle = '#e8606a'; ctx.fill(); cheeks(); }
    else if (f === 'sick') { eye(-ex, 0.35); eye(ex, 0.35); brows([2, -4], [-4, 2]); nose(); ctx.lineWidth = 5; ctx.strokeStyle = '#2f4a1a'; ctx.beginPath(); ctx.moveTo(-18, 42); for (var i = 1; i <= 5; i++) ctx.lineTo(-18 + i * 7.2, 42 + (i % 2 ? -6 : 6)); ctx.stroke(); }
    else if (f === 'shock') { eye(-ex, 1.5); eye(ex, 1.5); brows([-10, -14], [-14, -10]); nose(); ctx.beginPath(); ctx.ellipse(0, 44, 11, 16, 0, 0, 7); ctx.fillStyle = '#5a1420'; ctx.fill(); }
    else if (f === 'smile') { eye(-ex, 1); eye(ex, 1); brows([0, -2], [-2, 0]); nose(); ctx.lineWidth = 5; ctx.strokeStyle = '#7a2a30'; ctx.beginPath(); ctx.arc(0, 28, 22, 0.22 * Math.PI, 0.78 * Math.PI); ctx.stroke(); cheeks(); }
    else if (f === 'smug') { eye(-ex, 0.6); eye(ex, 0.6); brows([-4, -8], [-8, -4]); nose(); ctx.lineWidth = 5; ctx.strokeStyle = '#7a2a30'; ctx.beginPath(); ctx.moveTo(-16, 42); ctx.quadraticCurveTo(6, 48, 22, 34); ctx.stroke(); }
    else if (f === 'determined') { eye(-ex, 0.85); eye(ex, 0.85); brows([-10, -2], [-2, -10]); nose(); C.ln(ctx, -15, 42, 15, 42, 5, '#7a2a30'); }
    else if (f === 'worry') { eye(-ex, 1.1); eye(ex, 1.1); brows([-4, -12], [-12, -4]); nose(); ctx.lineWidth = 5; ctx.strokeStyle = '#7a2a30'; ctx.beginPath(); ctx.arc(0, 52, 14, Math.PI * 1.15, Math.PI * 1.85); ctx.stroke(); }
    else if (f === 'yuck') { eye(-ex, 0.2); eye(ex, 0.2); brows([0, -6], [-6, 0]); nose(); ctx.lineWidth = 5; ctx.strokeStyle = '#7a2a30'; ctx.beginPath(); ctx.moveTo(-18, 46); ctx.quadraticCurveTo(0, 32, 18, 46); ctx.stroke(); }
    else { eye(-ex, 1); eye(ex, 1); brows([0, 0], [0, 0]); nose(); C.ln(ctx, -13, 42, 13, 42, 5, '#7a2a30'); }
    if (L.mus) { ctx.beginPath(); ctx.moveTo(-30, 33); ctx.quadraticCurveTo(0, 22, 30, 33); ctx.quadraticCurveTo(0, 44, -30, 33); ctx.fillStyle = L.mus; ctx.fill(); }
  }
})();
