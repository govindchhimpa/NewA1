/* GL story scene: Mercator Sentinel-2 base (tiered) + drawn overlays. Voice times (vt) drive everything. */
(function () {
  'use strict';
  var W = V.W, H = V.H, E = V.ease, R = Math.PI / 180, OFF = 0.2, CY = 770;
  var WAT = '#2a8fd6', RED = '#ff5a5f', ORG = '#ff9f43', GRN = '#35d07f', GLD = '#ffd23f', WHT = '#ffffff', CYA = '#7fd8ff', SND = '#e8c48a';
  var WS = window.WORDS;
  function T(x) { return x + OFF; }
  function mer(lat) { return Math.log(Math.tan(Math.PI / 4 + lat * R / 2)); }
  function unmer(m) { return Math.atan(Math.sinh(m)) / R; }
  function lerp(a, b, u) { return a + (b - a) * u; }
  function sm(u) { u = V.clamp(u); return u * u * u * (u * (u * 6 - 15) + 10); }
  function norm(w) { return w.toLowerCase().replace(/[^a-z0-9]/g, ''); }
  var NW = WS.map(function (w) { return norm(w[0]); });
  function find(phrase, nth) {
    var tk = phrase.toLowerCase().replace(/[^a-z0-9 ]/g, '').split(' ').filter(Boolean), c = 0;
    for (var i = 0; i + tk.length <= NW.length; i++) { var ok = true; for (var j = 0; j < tk.length; j++) if (NW[i + j] !== tk[j]) { ok = false; break; } if (ok && c++ === (nth || 0)) return [i, i + tk.length - 1]; }
    throw new Error('anchor not found: ' + phrase + ' #' + (nth || 0));
  }
  function at(phrase, nth) { return WS[find(phrase, nth)[0]][1]; }
  function endOf(phrase, nth) { return WS[find(phrase, nth)[1]][2]; }

  /* ---------------- camera ---------------- */
  var KEYS = [], CAM = { lon: 69, lat: 24.1, S: 1000, cm: 0 }, SX = 0, SY = 0;
  function key(t, lon, lat, span, g) { KEYS.push({ t: t, lon: lon, lat: lat, S: W / (span * R), g: g === undefined ? 2.2 : g }); }
  function cam(vt) {
    var k = 0; for (var i = 0; i < KEYS.length; i++) if (vt >= KEYS[i].t) k = i;
    var a = KEYS[k], b = KEYS[k + 1], gs = b ? b.t - b.g : 1e9, c = V.clamp((Math.min(vt, gs) - a.t) / 9), aS = a.S * (1 + 0.03 * c), lon = a.lon, lat = a.lat, S = aS;
    if (b && vt > gs) { var u = sm((vt - gs) / b.g); lon = lerp(a.lon, b.lon, u); lat = lerp(a.lat, b.lat, u); S = Math.exp(lerp(Math.log(aS), Math.log(b.S), u)); }
    return { lon: lon, lat: lat, S: S, cm: mer(lat) };
  }
  function P(lon, lat) { return [W / 2 + (lon - CAM.lon) * R * CAM.S + SX, CY - (mer(lat) - CAM.cm) * CAM.S + SY]; }
  var SHK = []; function shk(a, b, amp) { SHK.push([a, b, amp]); }
  function shakeAt(vt) { var m = 0; for (var i = 0; i < SHK.length; i++) { var k = SHK[i]; if (vt > k[0] && vt < k[1]) { var u = (vt - k[0]) / (k[1] - k[0]); m = Math.max(m, k[2] * Math.min(1, u * 8) * (1 - 0.6 * u)); } } return m; }

  /* ---------------- base map (tiers made of pieces) ---------------- */
  function drawTier(ctx, t, alpha) {
    ctx.globalAlpha = alpha; ctx.filter = window.__TF || 'none';
    t.pieces.forEach(function (p) {
      var tl = P(p.bb[0], p.bb[3]), br = P(p.bb[2], p.bb[1]);
      if (br[0] < 0 || tl[0] > W || br[1] < 0 || tl[1] > H) return;
      ctx.drawImage(p.img, tl[0] - 0.5, tl[1] - 0.5, br[0] - tl[0] + 1, br[1] - tl[1] + 1);
    });
    ctx.filter = 'none';
  }
  function cover(t) {
    var tl = P(t.bb[0], t.bb[3]), br = P(t.bb[2], t.bb[1]);
    var ox = Math.max(0, Math.min(W, br[0]) - Math.max(0, tl[0])), oy = Math.max(0, Math.min(H, br[1]) - Math.max(0, tl[1])); return ox * oy / (W * H);
  }
  var DIMK = [];
  function dim(t, v) { DIMK.push([t, v]); }
  function dimAt(vt) {
    var k = -1; for (var i = 0; i < DIMK.length; i++) if (vt >= DIMK[i][0]) k = i; if (k < 0) return DIMK.length ? DIMK[0][1] : 0.1;
    var a = DIMK[k], b = DIMK[k + 1]; if (!b) return a[1]; return lerp(a[1], b[1], sm((vt - a[0]) / Math.min(1.2, b[0] - a[0])));
  }
  function base(ctx, vt) {
    ctx.fillStyle = window.__BG || '#17120d'; ctx.fillRect(-60, -60, W + 120, H + 120); ctx.save(); ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality = 'high';
    var al = V.tiers.map(function (t, i) { return i === 0 ? 1 : sm((cover(t) - 0.78) / 0.2); }), top = 0;
    for (var i = 0; i < al.length; i++) if (al[i] >= 0.999) top = i;
    for (i = Math.max(0, top - 1); i < al.length; i++) if (al[i] > 0.01) drawTier(ctx, V.tiers[i], al[i]);
    ctx.restore(); ctx.fillStyle = 'rgba(4,12,30,' + dimAt(vt) + ')'; ctx.fillRect(0, 0, W, H);
  }

  /* ---------------- geometry drawing ---------------- */
  function pline(ctx, pts, from, to) { ctx.beginPath(); for (var i = from; i < to; i++) { var q = P(pts[i][0], pts[i][1]); if (i === from) ctx.moveTo(q[0], q[1]); else ctx.lineTo(q[0], q[1]); } }
  function polyLen(pts) { var L = [0]; for (var i = 1; i < pts.length; i++) { var a = P(pts[i - 1][0], pts[i - 1][1]), b = P(pts[i][0], pts[i][1]); L.push(L[i - 1] + Math.hypot(b[0] - a[0], b[1] - a[1])); } return L; }
  function growLine(ctx, pts, prog, col, w, glow, dash) {
    if (prog <= 0.001) return null; var L = polyLen(pts), want = L[L.length - 1] * Math.min(1, prog), tip = null, i;
    ctx.save(); ctx.strokeStyle = col; ctx.lineWidth = w; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; if (glow) { ctx.shadowColor = glow; ctx.shadowBlur = 16; } if (dash) ctx.setLineDash(dash);
    ctx.beginPath(); var a = P(pts[0][0], pts[0][1]); ctx.moveTo(a[0], a[1]);
    for (i = 1; i < pts.length; i++) { var b = P(pts[i][0], pts[i][1]); if (L[i] >= want) { var f = (want - L[i - 1]) / ((L[i] - L[i - 1]) || 1); tip = [lerp(a[0], b[0], f), lerp(a[1], b[1], f)]; ctx.lineTo(tip[0], tip[1]); break; } ctx.lineTo(b[0], b[1]); a = b; tip = b; }
    ctx.stroke(); ctx.restore(); return tip;
  }

  /* ---------------- small drawing kit ---------------- */
  function label(ctx, str, lon, lat, o) {
    o = o || {}; var p = P(lon, lat), a = o.a === undefined ? 1 : o.a; if (a <= 0.004) return;
    V.text(ctx, str, p[0] + (o.dx || 0), p[1] + (o.dy || 0), { size: o.size || 54, weight: 900, tracking: o.tr === undefined ? 6 : o.tr, color: o.col || WHT, alpha: a, shadow: ['rgba(0,0,0,0.85)', 16, 0, 4], stroke: 'rgba(0,0,0,0.55)', strokeW: 6 });
  }
  function chip(ctx, x, y, str, o) {
    o = o || {}; var size = o.size || 46, a = o.a === undefined ? 1 : o.a; if (a <= 0.004) return; var s = o.s === undefined ? 1 : o.s;
    var tw = V.textWidth(ctx, str, { size: size, weight: 900, tracking: 1 }), w = tw + size * 1.2, h = size * 1.72, fit = Math.min(1, 960 / w);
    ctx.save(); ctx.translate(x, y); ctx.scale(s * fit, s * fit); ctx.globalAlpha *= a;
    ctx.shadowColor = 'rgba(0,0,0,0.5)'; ctx.shadowBlur = 16; ctx.shadowOffsetY = 5; V.rr(ctx, -w / 2, -h / 2, w, h, h / 2); ctx.fillStyle = o.fill || '#f9d136'; ctx.fill(); ctx.shadowColor = 'transparent';
    if (o.stroke) { ctx.lineWidth = 4; ctx.strokeStyle = o.stroke; ctx.stroke(); }
    V.text(ctx, str, 0, size * 0.36, { size: size, weight: 900, tracking: 1, color: o.col || '#14213a' }); ctx.restore();
  }
  function pop(vt, a) { return V.spring(vt - a, 13, 7.5); }
  function fadeIO(vt, a, b, fi, fo) { return V.clamp((vt - a) / (fi || 0.3)) * (1 - V.clamp((vt - b) / (fo || 0.35))); }
  function pin(ctx, lon, lat, a, col, r, name, o) {
    var p = P(lon, lat); if (a <= 0.004) return; ctx.save(); ctx.globalAlpha = a; V.circle(ctx, p[0], p[1], r || 13); ctx.fillStyle = col || '#ff3b30'; ctx.fill(); ctx.lineWidth = 4; ctx.strokeStyle = '#fff'; ctx.stroke(); ctx.restore();
    if (name) label(ctx, name, lon, lat, { dy: (o && o.dy !== undefined) ? o.dy : -28, dx: (o && o.dx) || 0, size: (o && o.size) || 34, tr: 3, a: a });
  }
  function ring(ctx, lon, lat, vt, a0, col, maxr, a) { var p = P(lon, lat), u = V.clamp((vt - a0) / 1.4); if (u <= 0 || u >= 1) return; ctx.save(); ctx.globalAlpha = (1 - u) * (a === undefined ? 1 : a); ctx.strokeStyle = col; ctx.lineWidth = 8 * (1 - u) + 2; ctx.beginPath(); ctx.arc(p[0], p[1], 14 + u * maxr, 0, 7); ctx.stroke(); ctx.restore(); }
  function arrowTo(ctx, a, b, col, w, pr) { var x = lerp(a[0], b[0], pr), y = lerp(a[1], b[1], pr); ctx.save(); ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineWidth = w; ctx.lineCap = 'round'; ctx.shadowColor = 'rgba(0,0,0,0.6)'; ctx.shadowBlur = 10; ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(x, y); ctx.stroke(); var an = Math.atan2(b[1] - a[1], b[0] - a[0]); if (pr > 0.92) { ctx.beginPath(); ctx.moveTo(x + 8 * Math.cos(an), y + 8 * Math.sin(an)); ctx.lineTo(x - 34 * Math.cos(an - 0.5), y - 34 * Math.sin(an - 0.5)); ctx.lineTo(x - 34 * Math.cos(an + 0.5), y - 34 * Math.sin(an + 0.5)); ctx.closePath(); ctx.fill(); } ctx.restore(); }
  function arrowLL(ctx, a, b, col, w, pr) { arrowTo(ctx, P(a[0], a[1]), P(b[0], b[1]), col, w, pr); }
  function bez(c, u) { var a = c[0], m = c[1], b = c[2], x = (1 - u) * (1 - u) * a[0] + 2 * (1 - u) * u * m[0] + u * u * b[0], y = (1 - u) * (1 - u) * a[1] + 2 * (1 - u) * u * m[1] + u * u * b[1]; return [x, y]; }
  function arc(a, b, bow, n) { var m = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2 + bow], pts = []; for (var i = 0; i <= (n || 28); i++) pts.push(bez([a, m, b], i / (n || 28))); return pts; }

  var EV = [], CUES = [{ t: OFF, name: 'voice', file: 'voice' }];
  function ev(a, b, fn) { var o = { a: a, b: b, fn: fn }; EV.push(o); return o; }
  function cue(t, name, vol, dur) { var c = { t: T(t), name: name, vol: vol === undefined ? 0.45 : vol }; if (dur) c.dur = dur; CUES.push(c); }
  var HUDK = [];
  function hudk(t, v, kind) { HUDK.push([t, v, kind || 'cy']); }
  function hudAt(vt) { var k = -1; for (var i = 0; i < HUDK.length; i++) if (vt >= HUDK[i][0]) k = i; return k < 0 ? null : HUDK[k]; }
  function card(ctx, x, y, w, h, a, fill, line) { ctx.save(); ctx.globalAlpha *= a; ctx.shadowColor = 'rgba(0,0,0,0.5)'; ctx.shadowBlur = 24; ctx.shadowOffsetY = 8; V.rr(ctx, x, y, w, h, 34); ctx.fillStyle = fill || 'rgba(10,20,40,0.88)'; ctx.fill(); ctx.shadowColor = 'transparent'; ctx.lineWidth = 4; ctx.strokeStyle = line || 'rgba(255,255,255,0.55)'; ctx.stroke(); ctx.restore(); }
  function stamp(ctx, x, y, str, s, a, col, rot) {
    if (a <= 0.004) return; ctx.save(); ctx.translate(x, y); ctx.rotate(rot || 0); ctx.scale(s, s); ctx.globalAlpha *= a; var tw = V.textWidth(ctx, str, { size: 150, weight: 900, tracking: 6 });
    V.rr(ctx, -tw / 2 - 40, -108, tw + 80, 190, 26); ctx.fillStyle = 'rgba(10,20,40,0.92)'; ctx.fill(); ctx.strokeStyle = col; ctx.lineWidth = 14; ctx.stroke(); V.text(ctx, str, 0, 40, { size: 150, weight: 900, tracking: 6, color: col, shadow: ['rgba(0,0,0,0.5)', 12, 0, 4] }); ctx.restore();
  }
  function C(a, b, str, o) { o = o || {}; var e0 = ev(a, b, function (ctx, vt) { chip(ctx, W / 2 + (o.dx || 0), o.y || 335, str, { size: o.size || 52, fill: o.fill, col: o.col, stroke: o.stroke, a: fadeIO(vt, a, b - 0.05, 0.15, 0.18), s: 0.7 + 0.3 * pop(vt, a) }); }); e0.z = 2; if (o.cue) cue(a, o.cue, 0.4); }
  function L(a, b, str, lon, lat, o) { o = o || {}; ev(a, b, function (ctx, vt) { label(ctx, str, lon, lat, { size: o.size, col: o.col, dx: o.dx, dy: o.dy, tr: o.tr, a: fadeIO(vt, a, b, 0.35, 0.4) * (o.a === undefined ? 1 : o.a) }); }); }
  function sm01(a, b, vt) { return sm((vt - a) / (b - a)); }
