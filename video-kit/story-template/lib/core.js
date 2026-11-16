/* VESSA promo engine. Classic script (no ES modules) so it loads from file://.
 * Everything hangs off window.V. Scenes draw into a 1080x1920 canvas 2D context. */
(function () {
  'use strict';
  var V = window.V = { W: 1080, H: 1920, FPS: 30, DUR: 30.6, scenes: [], byId: {}, ready: false };

  /* scene id -> [start seconds, duration seconds]. Fixed: do not change. */
  V.TIMELINE = { s1: [0, 30.6] };
  /* keep text and key objects inside this box (phone UI covers the edges) */
  V.SAFE = { x0: 110, x1: 970, y0: 200, y1: 1700 };

  V.pal = {
    ink: '#0f1b2d', navy: '#16294a', ice: '#dff3f7', mist: '#b9cfd6', teal: '#0fb5ae',
    coral: '#ff6b4a', sand: '#f5efe6', white: '#ffffff', moss: '#5b7f5a', sky: '#6fb3e0', sun: '#ffc857'
  };
  V.colorways = {
    teal:  { body: '#0fb5ae', dark: '#087a76', light: '#7ee8e1' },
    coral: { body: '#ff6b4a', dark: '#c93f22', light: '#ffa58f' },
    ink:   { body: '#16294a', dark: '#0a1528', light: '#4a6492' },
    sand:  { body: '#e9dcc6', dark: '#b9a784', light: '#fbf5ea' },
    moss:  { body: '#5b7f5a', dark: '#3b583a', light: '#9bc09a' },
    sky:   { body: '#6fb3e0', dark: '#3f84b3', light: '#b4dcf5' }
  };
  V.font = "Inter, 'Inter Display', 'DejaVu Sans', sans-serif";

  /* ---------- maths ---------- */
  var clamp = V.clamp = function (x, a, b) { a = a === undefined ? 0 : a; b = b === undefined ? 1 : b; return Math.max(a, Math.min(b, x)); };
  V.lerp = function (a, b, t) { return a + (b - a) * t; };
  /* map x from [a,b] to [c,d], clamped, optional easing on the 0..1 progress */
  V.map = function (x, a, b, c, d, ease) { var u = clamp((x - a) / (b - a)); if (ease) u = ease(u); return c + (d - c) * u; };
  /* progress 0..1 of a window that starts at `start` and lasts `dur` seconds */
  V.prog = function (t, start, dur, ease) { var u = clamp((t - start) / dur); return ease ? ease(u) : u; };

  var E = V.ease = {
    linear: function (x) { return x; },
    in2: function (x) { return x * x; },
    in3: function (x) { return x * x * x; },
    out2: function (x) { return 1 - (1 - x) * (1 - x); },
    out3: function (x) { return 1 - Math.pow(1 - x, 3); },
    out4: function (x) { return 1 - Math.pow(1 - x, 4); },
    inOut2: function (x) { return x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2; },
    inOut3: function (x) { return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; },
    expoOut: function (x) { return x >= 1 ? 1 : 1 - Math.pow(2, -10 * x); },
    outBack: function (x) { var c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2); },
    inBack: function (x) { var c1 = 1.70158, c3 = c1 + 1; return c3 * x * x * x - c1 * x * x; },
    outElastic: function (x) { return x <= 0 ? 0 : x >= 1 ? 1 : Math.pow(2, -10 * x) * Math.sin((x * 10 - 0.75) * (2 * Math.PI / 3)) + 1; },
    outBounce: function (x) {
      var n = 7.5625, d = 2.75;
      if (x < 1 / d) return n * x * x;
      if (x < 2 / d) { x -= 1.5 / d; return n * x * x + 0.75; }
      if (x < 2.5 / d) { x -= 2.25 / d; return n * x * x + 0.9375; }
      x -= 2.625 / d; return n * x * x + 0.984375;
    }
  };
  /* damped spring, 0 -> 1 with overshoot. t in seconds since the spring started. */
  V.spring = function (t, freq, damp) { if (t <= 0) return 0; freq = freq || 10; damp = damp === undefined ? 6 : damp; return 1 - Math.exp(-damp * t) * Math.cos(freq * t); };
  /* seeded random: V.rand(7)() -> 0..1 */
  V.rand = function (seed) { var a = seed >>> 0; return function () { a = (a + 0x6D2B79F5) >>> 0; var t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; };
  /* smooth 1D value noise, 0..1 */
  V.noise1 = function (x, seed) {
    seed = seed || 0;
    function h(i) { var s = Math.sin((i + seed * 57.13) * 127.1) * 43758.5453; return s - Math.floor(s); }
    var i = Math.floor(x), f = x - i, u = f * f * (3 - 2 * f); return h(i) * (1 - u) + h(i + 1) * u;
  };

  /* ---------- drawing helpers ---------- */
  /* rounded-rect path (does not fill) */
  V.rr = function (ctx, x, y, w, h, r) {
    r = Math.max(0, Math.min(r, w / 2, h / 2));
    ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
  };
  V.circle = function (ctx, x, y, r) { ctx.beginPath(); ctx.arc(x, y, Math.max(0, r), 0, Math.PI * 2); };
  V.lin = function (ctx, x0, y0, x1, y1, stops) { var g = ctx.createLinearGradient(x0, y0, x1, y1); stops.forEach(function (s) { g.addColorStop(s[0], s[1]); }); return g; };
  V.rad = function (ctx, x0, y0, r0, x1, y1, r1, stops) { var g = ctx.createRadialGradient(x0, y0, r0, x1, y1, r1); stops.forEach(function (s) { g.addColorStop(s[0], s[1]); }); return g; };
  /* fill the whole frame with a colour or gradient */
  V.bg = function (ctx, fill) { ctx.save(); ctx.fillStyle = fill; ctx.fillRect(0, 0, V.W, V.H); ctx.restore(); };
  /* text. o: {size, weight, color, align, baseline, tracking(px), alpha, font, stroke, strokeW, shadow:[color,blur,ox,oy]} */
  V.text = function (ctx, str, x, y, o) {
    o = o || {}; ctx.save();
    ctx.font = (o.weight || 800) + ' ' + (o.size || 64) + 'px ' + (o.font || V.font);
    ctx.textAlign = o.align || 'center'; ctx.textBaseline = o.baseline || 'alphabetic';
    if ('letterSpacing' in ctx) ctx.letterSpacing = (o.tracking || 0) + 'px';
    if (o.alpha !== undefined) ctx.globalAlpha *= o.alpha;
    if (o.shadow) { ctx.shadowColor = o.shadow[0]; ctx.shadowBlur = o.shadow[1]; ctx.shadowOffsetX = o.shadow[2] || 0; ctx.shadowOffsetY = o.shadow[3] || 0; }
    if (o.stroke) { ctx.lineWidth = o.strokeW || 4; ctx.strokeStyle = o.stroke; ctx.lineJoin = 'round'; ctx.strokeText(str, x, y); }
    ctx.fillStyle = o.color || V.pal.white; ctx.fillText(str, x, y); ctx.restore();
  };
  V.textWidth = function (ctx, str, o) {
    o = o || {}; ctx.save();
    ctx.font = (o.weight || 800) + ' ' + (o.size || 64) + 'px ' + (o.font || V.font);
    if ('letterSpacing' in ctx) ctx.letterSpacing = (o.tracking || 0) + 'px';
    var w = ctx.measureText(str).width; ctx.restore(); return w;
  };
  /* offscreen canvas for compositing; reuse by key to avoid allocating every frame */
  var tmps = {};
  V.tmp = function (key, w, h) {
    var c = tmps[key]; w = w || V.W; h = h || V.H;
    if (!c || c.width !== w || c.height !== h) { c = tmps[key] = document.createElement('canvas'); c.width = w; c.height = h; }
    var x = c.getContext('2d'); x.setTransform(1, 0, 0, 1, 0, 0); x.globalAlpha = 1; x.globalCompositeOperation = 'source-over'; x.clearRect(0, 0, w, h);
    return c;
  };

  /* ---------- scenes ---------- */
  /* V.defineScene('s3', { cues: [{t:0.5, name:'pop', vol:0.8}], draw: function (ctx, t, V) {...} })
   * t = seconds since the scene started, always inside 0..dur (V.drawScene clamps it). */
  V.defineScene = function (id, spec) {
    var tl = V.TIMELINE[id]; if (!tl) throw new Error('unknown scene ' + id);
    var s = { id: id, start: tl[0], dur: tl[1], cues: spec.cues || [], draw: spec.draw };
    V.scenes = V.scenes.filter(function (q) { return q.id !== id; }); V.scenes.push(s);
    V.scenes.sort(function (a, b) { return a.start - b.start; }); V.byId[id] = s;
  };
  V.drawScene = function (ctx, id, t) {
    var s = V.byId[id]; if (!s) throw new Error('scene not loaded: ' + id);
    ctx.save(); ctx.beginPath(); ctx.rect(0, 0, V.W, V.H); ctx.clip();
    s.draw(ctx, clamp(t, 0, s.dur), V); ctx.restore();
  };
  /* default compositor: hard cuts. lib/compositor.js replaces this with transitions. */
  V.renderFrame = function (ctx, T) {
    var s = V.scenes[V.scenes.length - 1];
    for (var i = 0; i < V.scenes.length; i++) if (T >= V.scenes[i].start && T < V.scenes[i].start + V.scenes[i].dur) { s = V.scenes[i]; break; }
    V.drawScene(ctx, s.id, T - s.start);
  };
})();
