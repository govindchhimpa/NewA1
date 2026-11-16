  /* ---- render ---- */
  function shotAt(t) { var vt = t - OFF, k = 0; for (var i = 0; i < S.length; i++) if (vt >= S[i].a) k = i; return S[k]; }
  function drawShot(ctx, s, t) {
    var vt = t - OFF, lt = Math.max(0, vt - s.a), u = V.clamp(lt / (s.b - s.a)), z = lerp(s.cam[2], s.cam[3], u * u * (3 - 2 * u)), sk = shake(vt), cx = s.cam[0] + (s.cam[4] || 0) * (u - 0.5);
    ctx.save(); ctx.beginPath(); ctx.rect(0, 0, W, H); ctx.clip(); ctx.translate(W / 2 + sk[0] + 4 * Math.sin(t * 1.3), 800 + sk[1] + 3 * Math.sin(t * 1.9)); ctx.rotate(0.004 * Math.sin(t * 0.9)); ctx.scale(z, z); ctx.translate(-cx, -s.cam[1]);
    s.fn(ctx, t, lt, u, u - 0.5); ctx.restore();
    var q = TQ; TQ = []; q.forEach(function (a) { tagDraw(ctx, a[0], a[1], a[2]); });
  }
  function post(ctx, t) {
    var g = ctx.createRadialGradient(540, 900, 520, 540, 900, 1250); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(0,0,0,0.42)'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    var r = V.rand(5); ctx.save(); for (var i = 0; i < 26; i++) { var x0 = r() * W, y0 = r() * H, sp = 6 + r() * 14, x = (x0 + Math.sin(t * 0.4 + i) * 40 + t * sp * 0.4) % W, y = ((y0 - t * sp * 1.6) % H + H) % H; V.circle(ctx, x, y, 2 + r() * 3.5); ctx.fillStyle = 'rgba(255,255,255,' + (0.1 + 0.14 * (0.5 + 0.5 * Math.sin(t * 1.3 + i))) + ')'; ctx.fill(); } ctx.restore();
  }
  function draw(ctx, t) {
    var s = shotAt(t), i = S.indexOf(s), vt = t - OFF, lt = vt - s.a;
    ctx.fillStyle = '#000'; ctx.fillRect(0, 0, W, H);
    if (i > 0 && lt < TD && s.tr !== 'cut') {
      var k = V.clamp(lt / TD), e = E.inOut2(k), p = S[i - 1], tr = s.tr, dir = s.dir;
      if (tr === 'whip') {
        ctx.save(); ctx.translate(-dir * W * e, 0); drawShot(ctx, p, t); ctx.restore(); ctx.save(); ctx.translate(dir * W * (1 - e), 0); drawShot(ctx, s, t); ctx.restore();
        ctx.save(); ctx.globalAlpha = Math.sin(k * Math.PI) * 0.4; ctx.fillStyle = '#fff'; for (var q = 0; q < 9; q++) ctx.fillRect(0, 120 + q * 190 + (q % 3) * 30, W, 6 + (q % 2) * 8); ctx.restore();
      } else if (tr === 'zoom') {
        drawShot(ctx, s, t); ctx.save(); ctx.globalAlpha = 1 - e; ctx.translate(W / 2, H / 2); ctx.scale(1 + 0.8 * e, 1 + 0.8 * e); ctx.translate(-W / 2, -H / 2); drawShot(ctx, p, t); ctx.restore();
      } else if (tr === 'iris') {
        drawShot(ctx, p, t); ctx.save(); ctx.beginPath(); ctx.arc(540, 800, e * 1500, 0, 7); ctx.clip(); drawShot(ctx, s, t); ctx.restore(); ctx.save(); ctx.beginPath(); ctx.arc(540, 800, e * 1500, 0, 7); ctx.lineWidth = 14; ctx.strokeStyle = '#fff'; ctx.globalAlpha = 1 - k; ctx.stroke(); ctx.restore();
      } else if (tr === 'slide') {
        ctx.save(); ctx.translate(0, -dir * H * e); drawShot(ctx, p, t); ctx.restore(); ctx.save(); ctx.translate(0, dir * H * (1 - e)); drawShot(ctx, s, t); ctx.restore();
      } else { drawShot(ctx, s, t); ctx.fillStyle = 'rgba(255,255,255,' + (1 - k) * (1 - k) * 0.95 + ')'; ctx.fillRect(0, 0, W, H); }
    } else drawShot(ctx, s, t);
    post(ctx, t);
    var g = ctx.createLinearGradient(0, 1250, 0, 1650); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(0.5, 'rgba(0,0,0,0.38)'); g.addColorStop(1, 'rgba(0,0,0,0)'); ctx.fillStyle = g; ctx.fillRect(0, 1250, W, 400);
    drawCaption(ctx, t);
  }


  /* ======================= SOUND CUES ======================= */
