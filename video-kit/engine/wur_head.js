/* WUR story: Cecilia Payne (1925 thesis). Shots are anchored to the aligned voice words (window.WORDS). */
(function () {
  'use strict';
  var W = V.W, H = V.H, E = V.ease, OFF = 0.2;
  var INK = '#16161a', GY = 1090;
  function T(x) { return x + OFF; }
  function lerp(a, b, u) { return a + (b - a) * u; }
  function ck(lt, a, d) { return V.clamp((lt - a) / (d || 0.2)); }
  function P(ctx, t, o) { o.t = t; return C.person(ctx, o); }
  var WS = window.WORDS;
  function norm(w) { return w.toLowerCase().replace(/[^a-z0-9]/g, ''); }
  var NW = WS.map(function (w) { return norm(w[0]); });
  function find(phrase, nth) {
    var tk = phrase.toLowerCase().replace(/[^a-z0-9 ]/g, '').split(' ').filter(Boolean), c = 0;
    for (var i = 0; i + tk.length <= NW.length; i++) { var ok = true; for (var j = 0; j < tk.length; j++) if (NW[i + j] !== tk[j]) { ok = false; break; } if (ok && c++ === (nth || 0)) return i; }
    throw new Error('anchor not found: ' + phrase);
  }
  function at(phrase, nth) { return WS[find(phrase, nth)][1]; }
  var END = WS[WS.length - 1][2] + 0.6;
  var S = [];

  /* ---------- backgrounds ---------- */
  function plain(ctx, c1, c2) { ctx.fillStyle = V.lin(ctx, 0, -200, 0, 1500, [[0, c1], [1, c2]]); ctx.fillRect(-400, -600, W + 800, 3000); }
  function campus(ctx) {
    ctx.fillStyle = V.lin(ctx, 0, -300, 0, 800, [[0, '#4aa3ff'], [1, '#cdeaff']]); ctx.fillRect(-400, -600, W + 800, 1500);
    C.cloud(ctx, 200, 330, 1.3); C.cloud(ctx, 800, 450, 1);
    ctx.fillStyle = '#5fb256'; ctx.fillRect(-400, 880, W + 800, 1400);
    ctx.fillStyle = '#e8d8b0'; ctx.beginPath(); ctx.moveTo(430, 1700); ctx.lineTo(650, 1700); ctx.lineTo(600, 880); ctx.lineTo(480, 880); ctx.closePath(); ctx.fill();
  }
  function night(ctx, t) {
    plain(ctx, '#080c2a', '#2a2f6b'); var r = V.rand(11);
    for (var i = 0; i < 70; i++) { var x = r() * W, y = r() * 860, s = 1.5 + r() * 3.5, tw = 0.5 + 0.5 * Math.sin(t * (1 + r() * 2) + i); V.circle(ctx, x, y, s * (0.7 + 0.5 * tw)); ctx.fillStyle = 'rgba(255,255,240,' + (0.5 + 0.5 * tw) + ')'; ctx.fill(); }
    ctx.fillStyle = '#0c1330'; ctx.beginPath(); ctx.moveTo(-200, 1090); ctx.quadraticCurveTo(300, 960, 700, 1030); ctx.quadraticCurveTo(900, 1060, 1300, 980); ctx.lineTo(1300, 1800); ctx.lineTo(-200, 1800); ctx.closePath(); ctx.fill();
  }
  function hall(ctx) { C.room(ctx, { wall: ['#8a3040', '#5c202c'], floor: ['#3a2a2a', '#1e1414'], hz: 820 }); ctx.fillStyle = '#c9a23a'; for (var i = 0; i < 5; i++) ctx.fillRect(60 + i * 240, 200, 18, 620); }
  function study(ctx) { C.room(ctx, { wall: ['#2a3350', '#1b2238'], floor: ['#4a3426', '#2a1d14'], hz: 860 }); C.window(ctx, 780, 240, 220, 320); }
  function office(ctx) { C.room(ctx, { wall: ['#f1dba6', '#e2c283'], floor: ['#b77d4c', '#8a5a33'], hz: 840 }); C.window(ctx, 60, 200, 210, 300, V.lin(ctx, 0, 200, 0, 500, [[0, '#8fd0ff'], [1, '#d8f1ff']])); C.window(ctx, 810, 200, 210, 300, V.lin(ctx, 0, 200, 0, 500, [[0, '#8fd0ff'], [1, '#d8f1ff']])); }

  /* ---------- props ---------- */
  var TQ = [];
  function tag(ctx, lt, str, o) { TQ.push([lt, str, o]); }
  function tagDraw(ctx, lt, str, o) {
    o = o || {}; var k = V.clamp(lt / 0.18), sc = 0.72 + 0.28 * E.outBack(k), lines = String(str).split('|'), n = Math.max.apply(0, lines.map(function (l) { return l.length; }));
    var size = o.size || Math.min(84, Math.floor(1120 / n)), h = o.h || Math.max(130, lines.length * size * 1.14 + 54), w = o.w || Math.min(1040, Math.max(480, n * size * 0.68 + 100));
    ctx.save(); ctx.translate(540, o.y || 290); ctx.scale(sc, sc); ctx.globalAlpha *= Math.min(1, k * 2.2); C.sign(ctx, 0, 0, w, h, str, { fill: o.fill || '#fff', color: o.color, size: size }); ctx.restore();
  }
  /* swap tag text over time: list = [[t0,str],...] */
  function tagS(ctx, lt, list, o) { var k = 0; for (var i = 0; i < list.length; i++) if (lt >= list[i][0]) k = i; tag(ctx, lt - list[k][0], list[k][1], o); }
  function star(ctx, x, y, r, t, col) {
    ctx.save(); ctx.translate(x, y); V.circle(ctx, 0, 0, r * 2.2); ctx.fillStyle = V.rad(ctx, 0, 0, r * 0.4, 0, 0, r * 2.2, [[0, 'rgba(255,240,150,0.7)'], [1, 'rgba(255,240,150,0)']]); ctx.fill();
    ctx.rotate(t * 0.15); for (var i = 0; i < 12; i++) { var a = i * Math.PI / 6, l = r * (1.35 + 0.15 * Math.sin(t * 3 + i)); C.ln(ctx, Math.cos(a) * r * 1.05, Math.sin(a) * r * 1.05, Math.cos(a) * l, Math.sin(a) * l, r * 0.12, '#f9c52c'); }
    V.circle(ctx, 0, 0, r); ctx.fillStyle = V.rad(ctx, -r * 0.3, -r * 0.3, r * 0.1, 0, 0, r, [[0, '#fff6b0'], [1, col || '#f9c52c']]); ctx.fill(); ctx.lineWidth = r * 0.07; ctx.strokeStyle = INK; ctx.stroke(); ctx.restore();
  }
  function earth(ctx, x, y, r) {
    ctx.save(); ctx.translate(x, y); V.circle(ctx, 0, 0, r); ctx.fillStyle = V.rad(ctx, -r * 0.3, -r * 0.3, r * 0.1, 0, 0, r, [[0, '#7fc7ff'], [1, '#2a74c9']]); ctx.fill(); ctx.save(); V.circle(ctx, 0, 0, r - 3); ctx.clip();
    ctx.fillStyle = '#4fae4f'; [[-0.35, -0.2, 0.42, 0.3], [0.4, 0.25, 0.36, 0.28], [0.1, -0.6, 0.3, 0.16]].forEach(function (c) { ctx.beginPath(); ctx.ellipse(c[0] * r, c[1] * r, c[2] * r, c[3] * r, 0.4, 0, 7); ctx.fill(); }); ctx.restore();
    V.circle(ctx, 0, 0, r); ctx.lineWidth = r * 0.07; ctx.strokeStyle = INK; ctx.stroke(); ctx.restore();
  }
  function spectrum(ctx, x, y, w, h, lines, hi) {
    ctx.save(); ctx.translate(x, y); V.rr(ctx, -w / 2, -h / 2, w, h, 16); ctx.save(); ctx.clip();
    ctx.fillStyle = V.lin(ctx, -w / 2, 0, w / 2, 0, [[0, '#7a1fd6'], [0.2, '#2f5ee8'], [0.4, '#2cc0a8'], [0.6, '#7dd13b'], [0.8, '#f5c32c'], [1, '#e8352c']]); ctx.fillRect(-w / 2, -h / 2, w, h);
    lines.forEach(function (l, i) { ctx.fillStyle = (hi === i) ? '#ffffff' : 'rgba(10,10,24,0.88)'; ctx.fillRect(-w / 2 + l * w - 6, -h / 2, 12, h); }); ctx.restore();
    V.rr(ctx, -w / 2, -h / 2, w, h, 16); ctx.lineWidth = 8; ctx.strokeStyle = INK; ctx.stroke(); ctx.restore();
  }
  function thermo(ctx, x, y, h, lvl, col) {
    ctx.save(); ctx.translate(x, y); V.rr(ctx, -22, -h, 44, h, 22); ctx.fillStyle = '#fff'; ctx.fill(); ctx.lineWidth = 7; ctx.strokeStyle = INK; ctx.stroke();
    V.circle(ctx, 0, 14, 46); ctx.fillStyle = col; ctx.fill(); ctx.stroke(); V.rr(ctx, -12, -h * lvl - 4, 24, h * lvl + 12, 12); ctx.fillStyle = col; ctx.fill();
    for (var i = 1; i < 6; i++) C.ln(ctx, 22, -h * i / 6, 40, -h * i / 6, 5, INK); ctx.restore();
  }
  function flame(ctx, x, y, s, t) {
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s * (1 + 0.06 * Math.sin(t * 9))); ctx.beginPath(); ctx.moveTo(0, -150); ctx.bezierCurveTo(70, -80, 90, -20, 50, 20); ctx.bezierCurveTo(30, 40, -30, 40, -50, 20); ctx.bezierCurveTo(-90, -30, -40, -90, 0, -150); ctx.closePath();
    ctx.fillStyle = '#ff7a2f'; ctx.fill(); ctx.lineWidth = 8; ctx.strokeStyle = INK; ctx.stroke(); ctx.beginPath(); ctx.moveTo(0, -80); ctx.bezierCurveTo(34, -40, 36, -4, 12, 10); ctx.bezierCurveTo(-8, 18, -28, 8, -30, -8); ctx.bezierCurveTo(-34, -40, -10, -56, 0, -80); ctx.fillStyle = '#ffd23f'; ctx.fill(); ctx.restore();
  }
  function atom(ctx, x, y, s, t, col) {
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
    for (var i = 0; i < 3; i++) { ctx.save(); ctx.rotate(i * Math.PI / 3 + t * 0.3); ctx.beginPath(); ctx.ellipse(0, 0, 130, 46, 0, 0, 7); ctx.lineWidth = 7; ctx.strokeStyle = INK; ctx.stroke(); ctx.lineWidth = 3; ctx.strokeStyle = col || '#4aa3ff'; ctx.stroke(); var a = t * 2.4 + i * 2; V.circle(ctx, Math.cos(a) * 130, Math.sin(a) * 46, 15); ctx.fillStyle = '#f9d136'; ctx.fill(); ctx.lineWidth = 5; ctx.strokeStyle = INK; ctx.stroke(); ctx.restore(); }
    V.circle(ctx, 0, 0, 34); ctx.fillStyle = '#e0290c'; ctx.fill(); ctx.lineWidth = 6; ctx.strokeStyle = INK; ctx.stroke(); ctx.restore();
  }
  function telescope(ctx, x, y, s, rot) {
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s); C.ln(ctx, 0, 0, -70, 230, 18, INK); C.ln(ctx, 0, 0, 70, 230, 18, INK); C.ln(ctx, 0, 0, 0, 230, 18, INK);
    ctx.rotate(rot); V.rr(ctx, -40, -250, 80, 300, 18); ctx.fillStyle = '#cfd5de'; ctx.fill(); ctx.lineWidth = 8; ctx.strokeStyle = INK; ctx.stroke(); V.rr(ctx, -52, -290, 104, 56, 12); ctx.fillStyle = '#5a6a86'; ctx.fill(); ctx.stroke(); ctx.restore();
  }
  function board(ctx, x, y, w, h, prog) {
    ctx.save(); ctx.translate(x, y); V.rr(ctx, -w / 2, -h / 2, w, h, 14); ctx.fillStyle = '#2f4a3c'; ctx.fill(); ctx.lineWidth = 12; ctx.strokeStyle = '#7a5a3a'; ctx.stroke();
    ctx.strokeStyle = 'rgba(255,255,255,0.88)'; ctx.lineWidth = 6; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    var r = V.rand(21), rows = 4; for (var k = 0; k < rows; k++) { var pr = V.clamp(prog * rows - k); if (pr <= 0) continue; ctx.beginPath(); var yy = -h / 2 + 80 + k * (h - 130) / rows, x0 = -w / 2 + 50, n = 14; for (var i = 0; i <= n * pr; i++) { var xx = x0 + i * (w - 110) / n, yv = yy + (r() - 0.5) * 34; if (i) ctx.lineTo(xx, yv); else ctx.moveTo(xx, yv); } ctx.stroke(); }
    ctx.restore();
  }
  function pie(ctx, x, y, r, u) {
    var fr = [[0.74, '#4aa3ff', 'H'], [0.24, '#f9c52c', 'He'], [0.02, '#b7bcc8', '']], a0 = -Math.PI / 2; ctx.save(); ctx.translate(x, y);
    fr.forEach(function (f, i) { var a1 = a0 + f[0] * Math.PI * 2 * V.clamp(u * 1.4 - i * 0.2); ctx.beginPath(); ctx.moveTo(0, 0); ctx.arc(0, 0, r, a0, a1); ctx.closePath(); ctx.fillStyle = f[1]; ctx.fill(); ctx.lineWidth = 8; ctx.strokeStyle = INK; ctx.stroke(); if (f[2] && u > 0.6) { var am = (a0 + a1) / 2; V.text(ctx, f[2], Math.cos(am) * r * 0.55, Math.sin(am) * r * 0.55 + 30, { size: 96, weight: 900, color: '#fff', stroke: INK, strokeW: 14 }); } a0 += f[0] * Math.PI * 2; });
    ctx.restore();
  }
  function thesis(ctx, x, y, s, rot, glow) {
    ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
    if (glow) { V.circle(ctx, 0, 0, 230); ctx.fillStyle = V.rad(ctx, 0, 0, 40, 0, 0, 230, [[0, 'rgba(255,240,150,' + glow + ')'], [1, 'rgba(255,240,150,0)']]); ctx.fill(); }
    ctx.shadowColor = 'rgba(0,0,0,0.35)'; ctx.shadowBlur = 16; ctx.shadowOffsetY = 8; V.rr(ctx, -110, -150, 220, 300, 12); ctx.fillStyle = '#7a1f2c'; ctx.fill(); ctx.shadowColor = 'transparent'; ctx.lineWidth = 7; ctx.strokeStyle = INK; ctx.stroke();
    V.rr(ctx, -84, -120, 168, 90, 8); ctx.fillStyle = '#f3e3b0'; ctx.fill(); ctx.lineWidth = 4; ctx.stroke();
    V.text(ctx, 'THESIS', 0, -62, { size: 40, weight: 900, color: INK }); V.text(ctx, 'PhD', 0, -26, { size: 36, weight: 900, color: '#7a1f2c' });
    C.ln(ctx, -60, 20, 60, 20, 6, '#f3e3b0'); C.ln(ctx, -60, 50, 40, 50, 6, '#f3e3b0'); ctx.restore();
  }
  /* big paper page; lines drawn up to prog; txt = [[str, y, size, color]] handwritten lines */
  function pageW(ctx, x, y, s, rot, nlines, prog, txt) {
    ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s); ctx.shadowColor = 'rgba(0,0,0,0.35)'; ctx.shadowBlur = 24; ctx.shadowOffsetY = 12; ctx.fillStyle = '#fbfaf4'; ctx.fillRect(-300, -400, 600, 800); ctx.shadowColor = 'transparent'; ctx.lineWidth = 7; ctx.strokeStyle = INK; ctx.strokeRect(-300, -400, 600, 800);
    for (var i = 0; i < nlines; i++) { var pr = V.clamp(prog * nlines - i); if (pr > 0) C.ln(ctx, -250, -340 + i * 56, -250 + (500 - (i % 3) * 80) * pr, -340 + i * 56, 6, '#b9b6a8'); }
    (txt || []).forEach(function (q) { V.text(ctx, q[0], 0, q[1], { size: q[2] || 58, weight: 900, color: q[3] || '#1f2d52' }); }); ctx.restore();
  }
  function calendar(ctx, x, y, s, yr, k) {
    ctx.save(); ctx.translate(x, y); var sc = (0.7 + 0.3 * E.outBack(V.clamp(k === undefined ? 1 : k))) * s; ctx.scale(sc, sc); ctx.shadowColor = 'rgba(0,0,0,0.4)'; ctx.shadowBlur = 24; ctx.shadowOffsetY = 12;
    V.rr(ctx, -270, -230, 540, 460, 30); ctx.fillStyle = '#fff'; ctx.fill(); ctx.shadowColor = 'transparent'; ctx.lineWidth = 8; ctx.strokeStyle = INK; ctx.stroke();
    V.rr(ctx, -270, -230, 540, 110, 30); ctx.fillStyle = '#d6343c'; ctx.fill(); ctx.stroke(); ctx.fillRect(-268, -170, 536, 50); V.circle(ctx, -150, -230, 16); V.circle(ctx, 150, -230, 16); ctx.fillStyle = '#9aa4b4'; ctx.fill(); ctx.stroke();
    V.text(ctx, yr, 0, 90, { size: 190, weight: 900, color: INK }); ctx.restore();
  }
  function building(ctx, x, y, s, name, col) {
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.fillStyle = col || '#b5523a'; ctx.fillRect(-420, -420, 840, 420); ctx.lineWidth = 8; ctx.strokeStyle = INK; ctx.strokeRect(-420, -420, 840, 420);
    ctx.beginPath(); ctx.moveTo(-460, -420); ctx.lineTo(0, -560); ctx.lineTo(460, -420); ctx.closePath(); ctx.fillStyle = '#e8e2d2'; ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#f3ecd6'; for (var i = 0; i < 5; i++) { ctx.fillRect(-330 + i * 165, -400, 40, 400); ctx.strokeRect(-330 + i * 165, -400, 40, 400); }
    ctx.fillStyle = '#6b4a2e'; ctx.fillRect(-60, -170, 120, 170); ctx.strokeRect(-60, -170, 120, 170);
    [[-250, -330], [160, -330], [-250, -190], [160, -190]].forEach(function (w) { ctx.fillStyle = '#bfe3f2'; ctx.fillRect(w[0], w[1], 90, 90); ctx.strokeRect(w[0], w[1], 90, 90); });
    C.sign(ctx, 0, -488, 640, 76, name, { fill: '#f9d136', size: 42 }); ctx.restore();
  }
  function burst(ctx, x, y, r, col, rot) {
    ctx.save(); ctx.translate(x, y); ctx.rotate(rot || 0); ctx.beginPath();
    for (var i = 0; i < 24; i++) { var a = i / 24 * Math.PI * 2, rr = i % 2 ? r * 0.62 : r; if (i) ctx.lineTo(Math.cos(a) * rr, Math.sin(a) * rr); else ctx.moveTo(rr, 0); }
    ctx.closePath(); ctx.fillStyle = col; ctx.fill(); ctx.lineWidth = 8; ctx.strokeStyle = INK; ctx.stroke(); ctx.restore();
  }
  function desk(ctx, x, y, w) { ctx.fillStyle = '#8a5a33'; ctx.fillRect(x - w / 2, y, w, 40); ctx.lineWidth = 6; ctx.strokeStyle = INK; ctx.strokeRect(x - w / 2, y, w, 40); ctx.fillStyle = '#5a3a20'; ctx.fillRect(x - w / 2 + 20, y + 40, 24, 190); ctx.fillRect(x + w / 2 - 44, y + 40, 24, 190); }
  function cap(ctx, x, y, s) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.fillStyle = INK; ctx.beginPath(); ctx.moveTo(-90, 0); ctx.lineTo(0, -30); ctx.lineTo(90, 0); ctx.lineTo(0, 30); ctx.closePath(); ctx.fill(); V.rr(ctx, -44, 20, 88, 36, 10); ctx.fill(); C.ln(ctx, 70, 4, 76, 60, 6, '#f9d136'); ctx.restore(); }
  function bubble(ctx, x, y, w, h, a) { ctx.save(); ctx.globalAlpha *= a === undefined ? 1 : a; ctx.translate(x, y); V.rr(ctx, -w / 2, -h / 2, w, h, 60); ctx.fillStyle = '#fff'; ctx.fill(); ctx.lineWidth = 7; ctx.strokeStyle = INK; ctx.stroke(); V.circle(ctx, -30, h / 2 + 34, 20); ctx.fillStyle = '#fff'; ctx.fill(); ctx.stroke(); V.circle(ctx, -50, h / 2 + 80, 11); ctx.fill(); ctx.stroke(); ctx.restore(); }
  function pn(ctx, t, o) { o.cos = o.cos || 'payne'; return P(ctx, t, o); }
  function who(ctx, t, cos, o) { o.cos = cos; return P(ctx, t, o); }
  /* ======================= v2 ENGINE + SHOTS ======================= */
  var TD = 0.24, IMP = [];
  function imp(t, a) { IMP.push([t, a || 1]); }
  function shake(vt) { var dx = 0, dy = 0; for (var i = 0; i < IMP.length; i++) { var d = vt - IMP[i][0]; if (d >= 0 && d < 0.5) { var e = Math.exp(-d * 9) * IMP[i][1]; dx += Math.sin(d * 70) * 15 * e; dy += Math.cos(d * 83) * 12 * e; } } return [dx, dy]; }
  function rel(p, base) { return at(p) - at(base); }
  function tagAt(ctx, lt, d, str, o) { if (lt >= d) tag(ctx, lt - d, str, o); }
  function G(kind, t, ph) {
    ph = ph || 0; var s1 = Math.sin(t * 3 + ph), s2 = Math.sin(t * 2.3 + ph * 1.7), up = Math.max(0, Math.sin(t * 2.1 + ph));
    switch (kind) {
      case 'talk': return { lAbs: [-0.45 - 0.1 * s1, -0.8 - 0.15 * s2], rAbs: [0.5 + 0.35 * up, 0.9 + 0.55 * up] };
      case 'point': return { lAbs: [-0.3, -0.5], rAbs: [1.5 + 0.05 * s1, 1.6] };
      case 'pointL': return { lAbs: [-1.5 - 0.05 * s1, -1.6], rAbs: [0.3, 0.5] };
      case 'cheer': return { lAbs: [-2.5 - 0.25 * s1, -2.8 - 0.3 * s2], rAbs: [2.5 + 0.25 * s2, 2.8 + 0.3 * s1] };
      case 'hips': return { lAbs: [-0.9 - 0.04 * s1, 0.3], rAbs: [0.9 + 0.04 * s2, -0.3] };
      case 'write': return { lAbs: [-0.4, -0.7], rAbs: [0.9 + 0.12 * Math.sin(t * 13), 1.4 + 0.1 * Math.sin(t * 11)] };
      case 'shrug': return { lAbs: [-0.9 - 0.15 * s1, -1.3], rAbs: [0.9 + 0.15 * s1, 1.3] };
      case 'wave': return { lAbs: [-0.3, -0.5], rAbs: [2.5 + 0.35 * Math.sin(t * 8), 2.8 + 0.4 * Math.sin(t * 8 + 1)] };
      case 'raise': return { lAbs: [-2.5, -2.8], rAbs: [2.5, 2.8] };
      case 'down': return { lAbs: [-0.12, -0.2], rAbs: [0.12, 0.2] };
      default: return {};
    }
  }
  function Q(ctx, t, o, g, ph) { var a = G(g, t, ph); o.lAbs = a.lAbs; o.rAbs = a.rAbs; return P(ctx, t, o); }
  function pq(ctx, t, o, g, ph) { o.cos = o.cos || 'payne'; return Q(ctx, t, o, g, ph); }
  function wq(ctx, t, cos, o, g, ph) { o.cos = cos; return Q(ctx, t, o, g, ph); }
  function enter(lt, x0, x1, d0, dur) { var k = ck(lt, d0, dur); return { x: lerp(x0, x1, E.out2(k)), walk: (k > 0 && k < 1) ? lt * 9 : 0 }; }

  /* ---- emotes / fx ---- */
  function bang(ctx, x, y, s, k) { if (k <= 0) return; ctx.save(); ctx.translate(x, y); var sc = s * E.outBack(V.clamp(k)); ctx.scale(sc, sc); for (var i = 0; i < 7; i++) { var a = -Math.PI / 2 + (i - 3) * 0.3; C.ln(ctx, Math.cos(a) * 80, Math.sin(a) * 80, Math.cos(a) * 118, Math.sin(a) * 118, 9, INK); } V.text(ctx, '!', 0, 52, { size: 160, weight: 900, color: '#ffd23f', stroke: INK, strokeW: 18 }); ctx.restore(); }
  function sweat(ctx, x, y, t, k) { for (var i = 0; i < 3; i++) { var yy = y + ((t * 70 + i * 22) % 66), xx = x + (i - 1) * 26; ctx.beginPath(); ctx.moveTo(xx, yy - 16); ctx.quadraticCurveTo(xx + 10, yy, xx, yy + 8); ctx.quadraticCurveTo(xx - 10, yy, xx, yy - 16); ctx.fillStyle = 'rgba(111,208,255,' + (0.9 * k) + ')'; ctx.fill(); } }
  function bulbE(ctx, x, y, s, k) { if (k <= 0) return; ctx.save(); ctx.translate(x, y); ctx.scale(s * E.outBack(V.clamp(k)), s * E.outBack(V.clamp(k))); for (var i = 0; i < 8; i++) { var an = i * Math.PI / 4; C.ln(ctx, Math.cos(an) * 74, Math.sin(an) * 74, Math.cos(an) * 106, Math.sin(an) * 106, 8, '#f9d136'); } V.circle(ctx, 0, 0, 54); ctx.fillStyle = '#ffe66b'; ctx.fill(); ctx.lineWidth = 6; ctx.strokeStyle = INK; ctx.stroke(); V.rr(ctx, -24, 48, 48, 34, 8); ctx.fillStyle = '#9aa4b4'; ctx.fill(); ctx.stroke(); ctx.restore(); }
  function qm(ctx, x, y, s, t, col) { ctx.save(); ctx.translate(x, y + Math.sin(t * 3) * 7); ctx.scale(s, s); V.text(ctx, '?', 0, 0, { size: 260, weight: 900, color: col || '#f9d136', stroke: INK, strokeW: 22 }); ctx.restore(); }
  function sparks(ctx, x, y, lt, r0, n, rad, col) { var k = lt - r0; if (k < 0 || k > 1.3) return; var r = V.rand(31 + n); for (var i = 0; i < n; i++) { var a = r() * 6.283, sp = (0.5 + r() * 0.7) * rad, d = sp * (1 - Math.exp(-k * 3.2)), sz = (7 + r() * 9) * (1 - k / 1.3); ctx.save(); ctx.globalAlpha *= Math.max(0, 1 - k / 1.3); V.circle(ctx, x + Math.cos(a) * d, y + Math.sin(a) * d + 60 * k * k, sz); ctx.fillStyle = (i % 3 === 0) ? '#fff' : (col || '#ffd23f'); ctx.fill(); ctx.restore(); } }
  function flashO(ctx, lt, at0, dur) { var k = (lt - at0) / (dur || 0.3); if (k < 0 || k > 1) return; ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.fillStyle = 'rgba(255,255,255,' + (1 - k) * 0.9 + ')'; ctx.fillRect(-2000, -2000, 6000, 6000); ctx.restore(); }

  /* ---- props ---- */
  function prism(ctx, x, y, s) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.beginPath(); ctx.moveTo(0, -90); ctx.lineTo(80, 60); ctx.lineTo(-80, 60); ctx.closePath(); ctx.fillStyle = 'rgba(200,235,255,0.8)'; ctx.fill(); ctx.lineWidth = 7; ctx.strokeStyle = INK; ctx.stroke(); ctx.restore(); }
  function flask2(ctx, x, y, s, col, label) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.beginPath(); ctx.moveTo(-26, -130); ctx.lineTo(26, -130); ctx.lineTo(26, -60); ctx.lineTo(74, 0); ctx.lineTo(-74, 0); ctx.lineTo(-26, -60); ctx.closePath(); ctx.fillStyle = 'rgba(235,247,255,0.85)'; ctx.fill(); ctx.lineWidth = 7; ctx.strokeStyle = INK; ctx.stroke(); ctx.beginPath(); ctx.moveTo(-52, -24); ctx.lineTo(52, -24); ctx.lineTo(70, -3); ctx.lineTo(-70, -3); ctx.closePath(); ctx.fillStyle = col; ctx.fill(); if (label) V.text(ctx, label, 0, 46, { size: 34, weight: 900, color: INK }); ctx.restore(); }
  function padlock(ctx, x, y, s, k) { ctx.save(); ctx.translate(x, y); var sc = s * (0.8 + 0.2 * E.outBack(V.clamp(k))); ctx.scale(sc, sc); var lift = (1 - V.clamp(k * 2)) * 34; ctx.beginPath(); ctx.arc(0, -64 - lift, 44, Math.PI, 0); ctx.lineTo(44, -64 - lift + 40); ctx.lineWidth = 20; ctx.strokeStyle = INK; ctx.stroke(); ctx.lineWidth = 11; ctx.strokeStyle = '#c9ced8'; ctx.stroke(); V.rr(ctx, -74, -60, 148, 118, 18); ctx.fillStyle = '#f3b92a'; ctx.fill(); ctx.lineWidth = 8; ctx.strokeStyle = INK; ctx.stroke(); V.circle(ctx, 0, -8, 14); ctx.fillStyle = INK; ctx.fill(); ctx.fillRect(-5, -4, 10, 34); ctx.restore(); }
  function eraser(ctx, x, y, s, rot) { ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s); V.rr(ctx, -80, -36, 160, 72, 14); ctx.fillStyle = '#f08aa0'; ctx.fill(); ctx.lineWidth = 7; ctx.strokeStyle = INK; ctx.stroke(); ctx.fillStyle = '#3f6ec9'; ctx.fillRect(-80, -36, 56, 72); ctx.strokeRect(-80, -36, 56, 72); ctx.restore(); }
  function penP(ctx, x, y, s, rot) { ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s); V.rr(ctx, -12, -190, 24, 160, 10); ctx.fillStyle = '#2f4fa0'; ctx.fill(); ctx.lineWidth = 6; ctx.strokeStyle = INK; ctx.stroke(); C.poly(ctx, [[-12, -30], [12, -30], [0, 14]], '#f3e3b0', INK, 5); ctx.restore(); }
  function podium(ctx, x, y, s) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); C.poly(ctx, [[-120, -260], [120, -260], [150, 0], [-150, 0]], '#7a4a28', INK, 7); ctx.fillStyle = '#9a6234'; ctx.fillRect(-120, -260, 240, 26); ctx.strokeRect(-120, -260, 240, 26); ctx.restore(); }
  function camIcon(ctx, x, y, s, fl) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); V.rr(ctx, -50, -34, 100, 68, 12); ctx.fillStyle = '#30343e'; ctx.fill(); ctx.lineWidth = 6; ctx.strokeStyle = INK; ctx.stroke(); V.circle(ctx, 0, 0, 24); ctx.fillStyle = '#9ad6ff'; ctx.fill(); ctx.stroke(); if (fl > 0) { burst(ctx, 0, -10, 80 * fl, '#fffbe0', 0); } ctx.restore(); }
  function crowdSil(ctx, t, y, n, col, amp) { for (var i = 0; i < n; i++) { var x = 40 + i * (1000 / (n - 1)), bob = Math.sin(t * 3.2 + i * 1.7) * (amp || 6), sc = 0.9 + 0.2 * ((i * 7) % 3) / 2; ctx.fillStyle = col || '#150a10'; V.circle(ctx, x, y - 112 * sc + bob, 34 * sc); ctx.fill(); ctx.beginPath(); ctx.ellipse(x, y - 36 * sc + bob, 52 * sc, 62 * sc, 0, Math.PI, 0); ctx.lineTo(x + 52 * sc, y + 40); ctx.lineTo(x - 52 * sc, y + 40); ctx.closePath(); ctx.fill(); } }
  function rays(ctx, x, y, a, col) { ctx.save(); ctx.globalAlpha *= a; for (var i = -2; i <= 2; i++) { ctx.beginPath(); ctx.moveTo(x - 20 + i * 8, y); ctx.lineTo(x + i * 260 - 80, y + 1100); ctx.lineTo(x + i * 260 + 80, y + 1100); ctx.lineTo(x + 20 + i * 8, y); ctx.closePath(); ctx.fillStyle = col || 'rgba(255,240,170,0.5)'; ctx.fill(); } ctx.restore(); }
  function spot(ctx, x, y, r, a) { var g = ctx.createRadialGradient(x, y, r * 0.35, x, y, r); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(4,2,14,' + a + ')'); ctx.fillStyle = g; ctx.fillRect(-400, -600, W + 800, 3000); }
  function cert(ctx, x, y, s, rot) { ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s); ctx.shadowColor = 'rgba(0,0,0,0.4)'; ctx.shadowBlur = 22; ctx.shadowOffsetY = 10; ctx.fillStyle = '#f6ecc8'; ctx.fillRect(-300, -210, 600, 420); ctx.shadowColor = 'transparent'; ctx.lineWidth = 8; ctx.strokeStyle = '#8a6a2a'; ctx.strokeRect(-300, -210, 600, 420); ctx.lineWidth = 3; ctx.strokeRect(-280, -190, 560, 380); V.text(ctx, 'HARVARD', 0, -110, { size: 62, weight: 900, color: '#7a1f2c' }); C.ln(ctx, -200, -70, 200, -70, 5, '#8a6a2a'); for (var i = 0; i < 3; i++) C.ln(ctx, -200, -20 + i * 38, 200 - i * 40, -20 + i * 38, 6, '#c9b98a'); ctx.restore(); }
  function inkText(ctx, str, x, y, size, prog, col) { var w = V.textWidth(ctx, str, { size: size, weight: 900 }); ctx.save(); ctx.beginPath(); ctx.rect(x - w / 2 - 6, y - size, (w + 12) * V.clamp(prog), size * 1.5); ctx.clip(); V.text(ctx, str, x, y, { size: size, weight: 900, color: col || '#1f2d52' }); ctx.restore(); }

  /* ---- backgrounds with parallax (px in -0.5..0.5) ---- */
  function campus2(ctx, t, px) {
    ctx.fillStyle = V.lin(ctx, 0, -300, 0, 800, [[0, '#3d8fff'], [1, '#d6eeff']]); ctx.fillRect(-400, -600, W + 800, 1500);
    V.circle(ctx, 860 + px * 20, 260, 90); ctx.fillStyle = V.rad(ctx, 860 + px * 20, 260, 20, 860 + px * 20, 260, 190, [[0, '#fffbe0'], [0.4, 'rgba(255,240,170,0.8)'], [1, 'rgba(255,240,170,0)']]); ctx.fill();
    C.cloud(ctx, ((200 + t * 14) % 1500) - 200 + px * 40, 330, 1.3); C.cloud(ctx, ((800 + t * 9) % 1500) - 200 + px * 40, 460, 1);
    ctx.fillStyle = '#7fc27a'; ctx.beginPath(); ctx.moveTo(-200, 880); ctx.quadraticCurveTo(300 + px * 60, 800, 700, 860); ctx.quadraticCurveTo(900, 890, 1300, 820); ctx.lineTo(1300, 1000); ctx.lineTo(-200, 1000); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#5fb256'; ctx.fillRect(-400, 900, W + 800, 1400); ctx.fillStyle = '#e8d8b0'; ctx.beginPath(); ctx.moveTo(430, 1700); ctx.lineTo(650, 1700); ctx.lineTo(600, 900); ctx.lineTo(480, 900); ctx.closePath(); ctx.fill();
    for (var i = 0; i < 3; i++) { var bx = ((i * 420 + t * (60 + i * 20)) % 1500) - 200, by = 380 + i * 70 + Math.sin(t * 2 + i) * 10; ctx.beginPath(); ctx.moveTo(bx - 20, by); ctx.quadraticCurveTo(bx - 8, by - 14 - Math.sin(t * 9 + i) * 8, bx, by); ctx.quadraticCurveTo(bx + 8, by - 14 - Math.sin(t * 9 + i) * 8, bx + 20, by); ctx.lineWidth = 5; ctx.strokeStyle = '#2a2a38'; ctx.stroke(); }
  }
  function night2(ctx, t, px) {
    plain(ctx, '#050822', '#2a2f6b'); var r = V.rand(11);
    for (var i = 0; i < 80; i++) { var x = r() * W + px * 30 * (0.4 + r()), y = r() * 880, s = 1.5 + r() * 3.5, tw = 0.5 + 0.5 * Math.sin(t * (1 + r() * 2) + i); V.circle(ctx, x, y, s * (0.7 + 0.5 * tw)); ctx.fillStyle = 'rgba(255,255,240,' + (0.45 + 0.55 * tw) + ')'; ctx.fill(); }
    var sk = (t * 0.28) % 1; if (sk < 0.22) { var q = sk / 0.22, sx = 900 - q * 700, sy = 120 + q * 260; ctx.save(); ctx.globalAlpha = Math.sin(q * Math.PI); C.ln(ctx, sx, sy, sx + 120, sy - 52, 5, '#fff'); V.circle(ctx, sx, sy, 7); ctx.fillStyle = '#fff'; ctx.fill(); ctx.restore(); }
    ctx.fillStyle = '#0c1330'; ctx.beginPath(); ctx.moveTo(-200, 1090); ctx.quadraticCurveTo(300 + px * 50, 960, 700, 1030); ctx.quadraticCurveTo(900, 1060, 1300, 980); ctx.lineTo(1300, 1800); ctx.lineTo(-200, 1800); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#10183a'; var dx = 900 + px * 70; ctx.beginPath(); ctx.arc(dx, 990, 90, Math.PI, 0); ctx.lineTo(dx + 90, 1040); ctx.lineTo(dx - 90, 1040); ctx.closePath(); ctx.fill(); ctx.fillStyle = '#050822'; ctx.fillRect(dx - 12, 905, 24, 70);
  }
  function glowBg(ctx, c1, c2, x, y, r, a) { plain(ctx, c1, c2); V.circle(ctx, x, y, r); ctx.fillStyle = V.rad(ctx, x, y, 0, x, y, r, [[0, 'rgba(255,230,150,' + a + ')'], [1, 'rgba(255,230,150,0)']]); ctx.fill(); }

  /* ---- captions (keyword colours) ---- */
  var KWY = window.__KWY || /^$/, KWR = window.__KWR || /^$/;
  function drawCaption(ctx, t) {
    var caps = window.CAPS, cur = null; for (var q2 = 0; q2 < caps.length; q2++) if (t >= caps[q2][0] && t < caps[q2][1]) { cur = caps[q2]; break; } if (!cur) return;
    var words = cur[2].toUpperCase().replace(/[,.?!]$/, '').split(' '), o = { size: 128, weight: 900, tracking: 1 }, sp = 34, ws = words.map(function (w) { return V.textWidth(ctx, w, o); }), tot = ws.reduce(function (a, b) { return a + b; }, 0) + sp * (words.length - 1), fit = Math.min(1, 980 / tot), lu = V.clamp((t - cur[0]) / 0.11), sc = (0.7 + 0.3 * E.outBack(lu)) * fit;
    ctx.save(); ctx.translate(W / 2, 1470 + (1 - lu) * 20); ctx.scale(sc, sc); var x = -tot / 2;
    words.forEach(function (w, i) { var col = KWR.test(w.replace(/[^A-Z-]/g, '')) ? '#ff6a5a' : (KWY.test(w.replace(/[^A-Z-]/g, '')) ? '#ffd83a' : '#ffffff'); V.text(ctx, w, x, 0, { size: 128, weight: 900, tracking: 1, align: 'left', color: col, stroke: '#000000', strokeW: 26, shadow: ['rgba(0,0,0,0.5)', 14, 0, 8] }); x += ws[i] + sp; });
    ctx.restore();
  }

  /* ---- shot machinery ---- */
  function sh(a, cam, fn, tr, dir, amb) { S.push({ a: a, b: 0, cam: cam, fn: fn, tr: tr || 'cut', dir: dir || 1, amb: amb || '' }); }

  function galaxy(ctx, x, y, s, rot, t, seed) {
    ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s * 0.5); V.circle(ctx, 0, 0, 260); ctx.fillStyle = V.rad(ctx, 0, 0, 10, 0, 0, 260, [[0, 'rgba(255,240,190,0.9)'], [0.25, 'rgba(180,150,255,0.5)'], [1, 'rgba(80,60,200,0)']]); ctx.fill();
    var r = V.rand(seed || 7); for (var a = 0; a < 2; a++) for (var i = 0; i < 150; i++) { var th = i * 0.11 + a * Math.PI + t * 0.08, rr = 12 + i * 1.6, jx = (r() - 0.5) * 34, jy = (r() - 0.5) * 34; V.circle(ctx, Math.cos(th) * rr + jx, Math.sin(th) * rr + jy, 1.8 + r() * 3.2); ctx.fillStyle = 'rgba(' + (200 + 55 * r() | 0) + ',' + (200 + 55 * r() | 0) + ',255,' + (0.35 + 0.5 * r()) + ')'; ctx.fill(); }
    V.circle(ctx, 0, 0, 34); ctx.fillStyle = '#fff6c0'; ctx.fill(); ctx.restore();
  }
  function frameO(ctx, x, y, s, fn) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.beginPath(); ctx.ellipse(0, 0, 250, 330, 0, 0, 7); ctx.fillStyle = V.lin(ctx, 0, -330, 0, 330, [[0, '#7fb6ff'], [1, '#d8ecff']]); ctx.fill(); ctx.save(); ctx.beginPath(); ctx.ellipse(0, 0, 250, 330, 0, 0, 7); ctx.clip(); fn(ctx); ctx.restore(); ctx.beginPath(); ctx.ellipse(0, 0, 250, 330, 0, 0, 7); ctx.lineWidth = 30; ctx.strokeStyle = '#d6a21e'; ctx.stroke(); ctx.lineWidth = 8; ctx.strokeStyle = INK; ctx.stroke(); ctx.beginPath(); ctx.ellipse(0, 0, 268, 348, 0, 0, 7); ctx.stroke(); ctx.restore(); }
