/* Crisp vector layer over the soft satellite texture: coastlines/borders, lakes, rivers, regions, city labels (Natural Earth 10m).
 * V.drawDetail(ctx, px, CAM, o)  o = {borders:0.8, rivers:1, cities:1, admin:0.5, maxY:1150} */
(function () {
  V.drawDetail = function (ctx, px, CAM, o) {
    o = o || {}; var D = window.DETAIL, W = V.W, H = V.H; if (!D) return;
    var span = H / CAM.S * 0.0; /* approx vertical span in degrees */
    span = H / CAM.S / (Math.PI / 180) / (1 / Math.cos(0.8 * CAM.lat * Math.PI / 180));
    function inView(pts) { for (var i = 0; i < pts.length; i += Math.max(1, pts.length >> 4)) { var p = px(pts[i][0], pts[i][1]); if (p[0] > -300 && p[0] < W + 300 && p[1] > -300 && p[1] < H + 300) return true; } return false; }
    function path(pts, close) { for (var i = 0; i < pts.length; i++) { var p = px(pts[i][0], pts[i][1]); if (i) ctx.lineTo(p[0], p[1]); else ctx.moveTo(p[0], p[1]); } if (close) ctx.closePath(); }
    ctx.save(); ctx.lineJoin = 'round'; ctx.lineCap = 'round';
    /* regions (thin dashed) */
    if (o.admin !== 0 && span < 20) {
      ctx.setLineDash([7, 6]); ctx.strokeStyle = 'rgba(255,255,255,0.28)'; ctx.lineWidth = 1.3; ctx.beginPath();
      D.admin1.forEach(function (r) { if (inView(r)) path(r, true); }); ctx.stroke(); ctx.setLineDash([]);
    }
    /* lakes */
    ctx.fillStyle = 'rgba(22,78,128,0.92)'; ctx.strokeStyle = 'rgba(190,230,255,0.55)'; ctx.lineWidth = 1.5;
    D.lakes.forEach(function (r) { if (inView(r)) { ctx.beginPath(); path(r, true); ctx.fill(); ctx.stroke(); } });
    /* rivers */
    var rk = o.rivers === undefined ? 1 : o.rivers;
    D.rivers.forEach(function (r) {
      if (!rk || !inView(r[1])) return; var w = Math.max(1.4, (10 - r[0]) * 0.55 * (span < 12 ? 1.5 : 1));
      ctx.strokeStyle = 'rgba(8,40,70,0.55)'; ctx.lineWidth = w + 2.4; ctx.beginPath(); path(r[1]); ctx.stroke();
      ctx.strokeStyle = 'rgba(120,210,255,0.95)'; ctx.lineWidth = w; ctx.beginPath(); path(r[1]); ctx.stroke();
    });
    /* coastlines + country borders: dark under-stroke + light line */
    var A = o.borders === undefined ? 0.85 : o.borders;
    window.WORLD.forEach(function (c) {
      c.r.forEach(function (ring) { if (!inView(ring)) return;
        ctx.beginPath(); path(ring, true); ctx.strokeStyle = 'rgba(0,14,30,' + 0.45 * A + ')'; ctx.lineWidth = 5.5; ctx.stroke();
        ctx.strokeStyle = 'rgba(255,255,255,' + A * 0.8 + ')'; ctx.lineWidth = 2; ctx.stroke(); });
    });
    /* cities */
    if (o.cities !== 0) {
      var minPop = span > 30 ? 2500000 : span > 16 ? 800000 : span > 8 ? 250000 : 60000, maxY = o.maxY || 1150, placed = [];
      var list = D.cities.filter(function (c) { return c[3] >= minPop; }).sort(function (a, b) { return b[3] - a[3]; });
      ctx.font = '800 30px Inter, Arial, sans-serif'; ctx.textAlign = 'left'; ctx.lineWidth = 6; ctx.strokeStyle = 'rgba(0,10,25,0.85)';
      list.forEach(function (c) {
        if (placed.length > 14) return; var p = px(c[0], c[1]); if (p[0] < 60 || p[0] > W - 160 || p[1] < 80 || p[1] > maxY) return;
        for (var i = 0; i < placed.length; i++) if (Math.abs(placed[i][0] - p[0]) < 210 && Math.abs(placed[i][1] - p[1]) < 46) return;
        placed.push(p); ctx.beginPath(); ctx.arc(p[0], p[1], 7, 0, 6.2832); ctx.fillStyle = '#fff'; ctx.fill(); ctx.lineWidth = 3; ctx.strokeStyle = '#0a1a30'; ctx.stroke();
        ctx.lineWidth = 6; ctx.strokeText(c[2], p[0] + 14, p[1] + 10); ctx.fillStyle = 'rgba(255,255,255,0.95)'; ctx.fillText(c[2], p[0] + 14, p[1] + 10);
      });
    }
    ctx.restore();
  };
})();
