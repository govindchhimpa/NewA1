// scenes.js — the soldier, his gun, the emu, the stage props, and the three shots of "The Great Emu War"
import * as TT from './toon.js';
import { P, pieEye, brow, mouth, glove, shoe, hose, ribbon } from './chars.js';
import { drawBG, camBase, GROUND } from './bg.js';
import { fatTitle, subPlate } from './ui.js';
import { clamp, lerp, TAU } from '/core/lib.js';
import { BEAT, T, SUBS, DUR } from './story.js';
const { shape, stroke, ell, arc, spline, quad, rr, rect, push, pop, translate, rotate, scale, dot } = TT;

// —— time helpers ——
const seg = (t, a, b) => clamp((t - a) / (b - a), 0, 1);
const ss = x => x * x * (3 - 2 * x);
const eo = x => 1 - Math.pow(1 - x, 3);
const ei = x => x * x * x;
const back = x => { const s = 1.7; x -= 1; return x * x * ((s + 1) * x + s) + 1; };
const twos = t => Math.floor(t * 12 + 1e-6) / 12;                        // characters on twos
const frozen = t => t >= T.stop[0] && t < T.stop[1];
// breathing: an extreme on every beat, sampled on twos, frozen during the band stop
export function breath(t) { const tq = frozen(t) ? T.stop[0] : twos(t); return Math.cos(TAU * tq / BEAT); }

// —— the soldier (local origin: ground between the feet; about 410 tall at k = 1) ——
export function soldier(p) {
  const b = p.b || 0, amp = p.amp ?? 1;
  push(); translate(p.x + (p.shx || 0), p.y + (p.shy || 0)); scale(p.k || 1);
  if (p.lean) rotate(p.lean);
  scale((p.sx || 1) * (1 - .03 * b * amp), (p.sy || 1) * (1 + .055 * b * amp));
  const shL = [-50, -258], shR = [50, -258];
  const aL = p.armL || { x: -74, y: -160, hand: 'fist', rot: Math.PI * .55, bend: -26 };
  const aR = p.armR || { x: 104, y: -300, hand: 'thumb', rot: -Math.PI * .5, bend: 22 };
  // legs and shoes
  hose([-20, -128], [-32, -16], 8, 22); hose([20, -128], [32, -16], -8, 22);
  shoe(-30, -2, -1, 1.2); shoe(30, -2, 1, 1.2);
  // back arm
  hose(shL, [aL.x, aL.y], aL.bend ?? 0, 18); glove(aL.x, aL.y, aL.rot ?? 0, aL.hand || 'open', 1.05, { flip: aL.flip });
  // tunic: light grey, one hard shadow band away from the upper-left light, dark belt
  shape(spline([[-58, -272], [-20, -282], [20, -282], [58, -272], [68, -205], [58, -128], [0, -122], [-58, -128], [-68, -205]], true, 6), {
    fill: P.light, shade: () => {
      shape(rect(30, -300, 60, 200), { fill: P.mid, stroke: false, boil: 0 });
      shape(rect(-80, -162, 160, 20), { fill: P.dark, stroke: false, boil: 0 });
    }
  });
  stroke([[0, -276], [0, -164]], TT.S.lw * .6);
  dot(-12, -244, 4.5); dot(-12, -206, 4.5);
  shape(rr(-12, -160, 24, 16, 4), { fill: P.pale, lw: TT.S.lw * .6 });          // belt buckle
  // head: white, pie eyes, button nose
  shape(ell(-64, -345, 13, 18), { fill: P.white });
  shape(ell(0, -345, 64, 64), {
    fill: P.white, shade: () => shape(ell(58, -330, 40, 74), { fill: P.pale, stroke: false, boil: 0 })
  });
  const E = p.eyes || {};
  pieEye(-8, -364, 13, 19, { ...E, side: -1 }); pieEye(30, -364, 13, 19, { ...E, side: 1 });
  if (p.brows) { brow(-8, -394, 24, p.brows, -1); brow(30, -394, 24, p.brows, 1); }
  shape(ell(16, -340, 12, 9), { fill: P.ink });
  const M = p.mouth || { type: 'smile' };
  mouth(14, -312, M.w || 38, M.type, M);
  if (p.sweat) for (const [sx, sy] of p.sweat) shape(spline([[sx, sy - 14], [sx + 7, sy + 2], [sx, sy + 9], [sx - 7, sy + 2]], true, 5), { fill: P.white, lw: TT.S.lw * .6 });
  // slouch hat (one side of the brim pinned up), can lift and spin away
  push(); translate(p.hatX || 0, -398 + (p.hatLift || 0)); rotate(p.hatRot || 0);
  shape(spline([[-104, 2], [-114, -48], [-82, -52], [-52, -8]], true, 6), { fill: P.dmid });
  shape(ell(8, 0, 108, 17), { fill: P.dmid });
  shape(spline([[-58, 2], [-54, -46], [-22, -68], [24, -68], [56, -46], [60, 2]], true, 6), {
    fill: P.dmid, shade: () => { shape(rect(30, -80, 50, 90), { fill: P.dark, stroke: false, boil: 0 }); shape(rect(-70, -16, 140, 14), { fill: P.ink, stroke: false, boil: 0 }); }
  });
  pop();
  // front arm
  hose(shR, [aR.x, aR.y], aR.bend ?? 0, 18); glove(aR.x, aR.y, aR.rot ?? 0, aR.hand || 'open', 1.05, { flip: aR.flip });
  pop();
}

// —— the machine gun on its bipod (local origin: the receiver; barrel points +x) ——
export function gun(p) {
  const b = p.b || 0;
  push(); translate(p.x + (p.shx || 0), p.y + (p.shy || 0)); scale(p.k || 1); if (p.rot) rotate(p.rot);
  scale(1 - .03 * b, 1 + .05 * b);
  hose([186, 10], [150, 150], -6, 11, P.dark); hose([200, 10], [252, 150], 6, 11, P.dark);
  shape(spline([[-40, -14], [-150, -6], [-176, 24], [-150, 40], [-40, 16]], true, 5), { fill: P.dmid });
  shape(rr(-34, 8, 24, 48, 8), { fill: P.dmid });
  shape(rr(-44, -24, 96, 46, 10), { fill: P.dark });
  shape(rr(46, -27, 192, 50, 20), {
    fill: P.dark, shade: () => { for (let i = 0; i < 6; i++) shape(rect(64 + i * 28, -30, 7, 60), { fill: P.ink, stroke: false, boil: 0 }); shape(rect(46, -27, 192, 12), { fill: P.dmid, stroke: false, boil: 0 }); }
  });
  shape(rr(234, -10, 40, 20, 6), { fill: P.ink });
  shape(ell(0, -36, 72, 16), { fill: P.mid, shade: () => shape(rect(-80, -32, 160, 20), { fill: P.dmid, stroke: false, boil: 0 }) });
  shape(ell(0, -38, 18, 6), { fill: P.dark });
  if (p.flash) {   // muzzle flash: a white star
    const n = 10, pts = []; for (let i = 0; i < n; i++) { const a = i / n * TAU + p.flash * .7, r = i % 2 ? 34 : 86; pts.push([330 + Math.cos(a) * r * 1.15, Math.sin(a) * r]); }
    shape(pts, { fill: P.white, lw: TT.S.lw }); shape(ell(330, 0, 22, 18), { fill: P.pale, lw: TT.S.lw * .7 });
  }
  if (p.spring != null) {   // the jam: a spring pops out of the receiver and wobbles
    const L = p.spring, pts = [];
    for (let i = 0; i <= 14; i++) pts.push([4 + (i % 2 ? 14 : -14) * (i > 0 && i < 14 ? 1 : 0), -30 - i / 14 * L]);
    stroke(pts, TT.S.lw * .9);
    shape(ell(4, -36 - L, 15, 9), { fill: P.light });
  }
  pop();
}
// smoke puffs: scattered, growing (never in a row, or they read as thought bubbles)
export function smoke(x, y, u, k = 1) {
  if (u <= 0 || u >= 1) return;
  const puffs = [[0, 0, 26], [40, -30, 20], [-22, -46, 18], [70, -6, 15], [18, -74, 14]];
  for (const [dx, dy, r] of puffs) { const g = eo(u) * (1 + dx * .004); shape(ell(x + dx * g * k, y + dy * g * k - u * 30 * k, r * (.5 + g) * k, r * (.45 + g * .9) * k), { fill: P.pale, alpha: 1 - ei(u) }); }
}

// —— the emu: head + rubber-hose neck from a body that stays off-screen ——
export function emuHead(p) {
  const k = p.k || 1, dir = p.dir ?? -1, op = p.open || 0;
  push(); translate(p.x, p.y); scale(dir * k, k); if (p.rot) rotate(p.rot);
  for (const [a, l] of [[-2.2, 34], [-1.85, 40], [-1.5, 30]]) shape(ribbon(quad([-6, -26], [-6 + Math.cos(a) * l * .5 - 6, -26 + Math.sin(a) * l * .5], [-6 + Math.cos(a) * l, -26 + Math.sin(a) * l], 6), 11, 3), { fill: P.ink });
  shape(ell(0, 0, 42, 35), { fill: P.dark, shade: () => shape(ell(-30, 18, 28, 30), { fill: P.ink, stroke: false, boil: 0 }) });
  shape(spline([[26, 6], [82, 10 + op * 34], [30, 20 + op * 16]], true, 4), { fill: P.light });
  shape(spline([[24, -12], [92, -2 - op * 8], [28, 10]], true, 4), { fill: P.white });
  dot(56, -6 - op * 3, 3);
  const E = p.eyes || {};
  pieEye(2, -12, 15, 20, { ...E, side: -1 }); pieEye(30, -14, 14, 19, { ...E, side: 1, type: p.wink ? 'happy' : E.type });
  pop();
}
export function emuNeck(a, h, bend, k = 1) {
  hose(a, h, bend, 30 * k, P.mid);
  // a few feather tufts along the neck
  for (const u of [.2, .4, .6, .8]) {
    const x = lerp(a[0], h[0], u), y = lerp(a[1], h[1], u) + Math.sin(u * Math.PI) * bend * .9;
    stroke([[x - 6 * k, y + 8 * k], [x + 2 * k, y + 15 * k], [x + 9 * k, y + 8 * k]], TT.S.lw * .55, { boil: .6 });
  }
}

// —— living stage props ——
function bush(x, y, k, b) {
  push(); translate(x, y); scale(k * (1 - .03 * b), k * (1 + .06 * b));
  for (const [dx, dy, rx, ry, c] of [[-40, -40, 50, 40, P.dark], [36, -46, 54, 44, P.dmid], [0, -78, 52, 46, P.dmid]]) shape(ell(dx, dy, rx, ry), { fill: c });
  pop();
}
function crate(x, y, k, b) {
  push(); translate(x, y); scale(k * (1 - .03 * b), k * (1 + .06 * b));
  shape(rect(-70, -90, 140, 90), { fill: P.dmid, shade: () => { shape(rect(30, -95, 50, 100), { fill: P.dark, stroke: false, boil: 0 }); } });
  stroke([[-70, -45], [70, -45]], TT.S.lw * .6); stroke([[-70, -90], [70, 0]], TT.S.lw * .6);
  pop();
}

// —— shared ——
let BG = null, SG = null;
export function initScenes(bg, sg) { BG = bg; SG = sg; }
const camAt = cam => TT.setM(camBase(cam));
const toScreen = (cam, x, y) => [960 + (x - cam.x) * cam.z, 540 + (y - cam.y) * cam.z];
const SOLDIER = { x: 720, y: GROUND }, GUN = { x: 890, y: 780, k: .9 };
const FACE = [SOLDIER.x + 14, SOLDIER.y - 345];
const NECK_A = [1640, 860];

function iris(cx, cy, r) {
  const g = SG; g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.fillStyle = '#000';
  g.beginPath(); g.rect(0, 0, 1920, 1080); g.arc(cx, cy, Math.max(0, r), 0, TAU, true); g.fill('evenodd');
  g.strokeStyle = '#000'; g.restore();
}
function propsBack(t, b) { crate(470, GROUND + 6, 1, b); bush(1360, GROUND + 8, 1.15, b); }

// —— shot 1: stage-wide, locked; the proud soldier; title ——
export function shotStage(t) {
  const cam = { x: 960, y: 560, z: 1 }, b = breath(t), tc = twos(t);
  TT.frame(t); drawBG(SG, BG, cam); camAt(cam);
  propsBack(t, b);
  const proud = 1 + .6 * Math.max(0, Math.cos(TAU * tc / (BEAT * 2)));    // chest puffs every other beat
  soldier({ ...SOLDIER, b, amp: proud, eyes: { lid: .38, lx: .25 }, brows: 'flat', mouth: { type: 'smile', w: 40 } });
  gun({ ...GUN, b });
  // title: letters hop in on 16ths, then ride a travelling wave on the beat
  const title = 'The Great Emu War';
  const bounce = i => {
    const t0 = T.title[0] + i * .06; if (t < t0) return -3000;
    const u = (t - t0) / .22; if (u < 1) return -70 * (1 - back(u));
    return -12 * Math.max(0, Math.sin(TAU * (tc / BEAT) - i * .5));
  };
  if (t >= T.title[0]) fatTitle(SG, title, 960, 150, 104, { bounce });
  if (t >= 1.35) {
    const s = 1 + .25 * (1 - eo(seg(t, 1.35, 1.6)));
    SG.save(); SG.setTransform(s, 0, 0, s, 960 * (1 - s), 262 * (1 - s)); SG.font = '68px Limelight'; SG.textAlign = 'center'; SG.textBaseline = 'middle';
    SG.lineJoin = 'round'; SG.lineWidth = 12; SG.strokeStyle = P.ink; SG.strokeText('1932', 960, 262); SG.fillStyle = P.white; SG.fillText('1932', 960, 262); SG.restore();
  }
  if (t < T.irisOpen[1]) { const c = toScreen(cam, FACE[0], FACE[1]); iris(c[0], c[1], eo(seg(t, 0, T.irisOpen[1])) * 1100); }
}

// —— shot 2: medium close; fire, jam, band stop, the emu's neck, the honk, the iris pulled shut ——
export function shotClose(t) {
  const tc = twos(t), b = breath(t);
  const push_ = eo(seg(t, T.cut2, T.stop[0])), slide = ss(seg(t, 6.35, 6.75));
  const cam = { x: lerp(905, 975, slide), y: 640, z: lerp(1.5, 1.58, push_) };
  TT.frame(t); drawBG(SG, BG, cam); camAt(cam);
  propsBack(t, b);
  // firing: recoil jitter on each flash
  let fl = 0, shx = 0, flashN = 0;
  T.flashes.forEach((f, i) => { if (tc >= f && tc < f + .17) { fl = 1; flashN = i + 1; shx = (Math.floor(tc * 24) % 2 ? -7 : 7); } });
  const jam = tc >= T.jam, pop_ = tc >= T.eyesPop, peek = tc >= T.emuIn[0], honked = tc >= T.honk;
  // emu head path
  const st = seg(tc, T.stretch[0], T.stretch[1]);
  let hx = lerp(1520, 1405, eo(seg(tc, T.emuIn[0], T.emuIn[1]))), hy = 612;
  if (tc >= T.stretch[0]) { hx = lerp(1405, 900, back(st)); hy = lerp(612, 560, ss(st)); }
  // soldier acting
  let eyes = { lx: .1 }, mouthS = { type: 'grin', w: 42 }, brows = 'angry', hatLift = 0, hatRot = 0, lean = 0, sy = 1, sweat = null;
  if (fl) eyes = { type: 'squeeze' };
  if (tc >= 4.5 && !fl && tc < T.jam) eyes = { lx: .8, ly: .2 };
  if (jam) { eyes = { lx: .9, ly: .55 }; mouthS = { type: 'flat', w: 30 }; brows = 'up'; }
  if (pop_) { eyes = { type: 'wide', lx: .2 }; mouthS = { type: 'o', w: 46, open: 1.1 }; brows = 'up'; hatLift = -26; }
  if (peek) { eyes = { type: 'wide', lx: 1, ly: -.1 }; mouthS = { type: 'wavy', w: 40 }; brows = 'sad'; hatLift = -26; sweat = [[-52, -392], [74, -380]]; }
  if (tc >= T.stretch[0]) { const gaze = clamp((hx - FACE[0]) / 300, 0, 1); eyes = { type: 'wide', lx: .4 + .6 * gaze, ly: -.2 }; }
  if (honked) {
    const u = seg(tc, T.honk, T.honk + .25);
    eyes = { type: 'squeeze' }; mouthS = { type: 'wavy', w: 44 }; lean = -.16 * eo(u); sy = 1 - .1 * Math.sin(Math.PI * Math.min(1, u * 1.5));
    hatLift = -26 - 210 * eo(seg(tc, T.honk, T.honk + .3)); hatRot = -.8 * eo(seg(tc, T.honk, T.honk + .3));
  }
  const firing = tc >= T.cut2 && tc < T.jam + .2;
  const armL = firing ? { x: 66, y: -128, hand: 'grab', rot: .2, bend: -10 } : undefined;
  const armR = firing ? { x: 140, y: -92, hand: 'grab', rot: .5, bend: 18 } : (peek ? { x: 92, y: -330, hand: 'open', rot: -Math.PI * .6, bend: -20 } : { x: 130, y: -110, hand: 'open', rot: .4, bend: 16 });
  soldier({ ...SOLDIER, b, shx: fl ? shx : 0, eyes, brows, mouth: mouthS, hatLift, hatRot, lean, sy, sweat, armL, armR });
  const spring = jam ? 70 + 34 * Math.sin(TAU * 5 * (tc - T.jam)) * Math.exp(-(tc - T.jam) * 3) : null;
  gun({ ...GUN, b, shx: fl ? shx * .6 : 0, flash: fl ? flashN : 0, spring });
  smoke(GUN.x + 285 * GUN.k, GUN.y - 10, seg(t, T.jam, T.jam + 1.1), 1.2);
  // the emu: neck + head (beak opens for the honk)
  const irisU = seg(t, T.irisClose[0], T.irisClose[1]);
  if (peek && irisU <= 0) {
    const op = honked ? Math.sin(Math.PI * seg(tc, T.honk, T.honk + .45)) : 0;
    emuNeck(NECK_A, [hx + 40, hy + 26], 60 * (1 - st) + 20, 1.3);
    emuHead({ x: hx, y: hy, k: 1.5, dir: -1, open: op, eyes: { lid: honked ? 0 : .3, lx: -.6 } });
  }
  // the emu bites the iris edge and pulls it shut on the soldier
  if (irisU > 0) {
    const c = toScreen(cam, FACE[0], FACE[1]), r = (1 - ei(irisU)) * 760, th = -.35;
    iris(c[0], c[1], r);
    const sx = c[0] + Math.cos(th) * (r + 50), sy2 = c[1] + Math.sin(th) * (r + 50);
    const w = [cam.x + (sx - 960) / cam.z, cam.y + (sy2 - 540) / cam.z];
    if (irisU < .98) { emuNeck(NECK_A, [w[0] + 40, w[1] + 26], 30, 1.3); emuHead({ x: w[0], y: w[1], k: 1.5, dir: -1, open: .35, rot: -.2, eyes: { type: 'happy' } }); }
  }
}

// —— shot 3: the end card rolls down like a window shade; the emu peeks in and winks ——
export function shotEnd(t) {
  const g = SG; TT.frame(t); g.setTransform(1, 0, 0, 1, 0, 0); g.fillStyle = '#000'; g.fillRect(0, 0, 1920, 1080);
  const u = seg(t, T.card[0], T.card[1]), bounceY = t > T.card[1] ? 18 * Math.sin(TAU * 3 * (t - T.card[1])) * Math.exp(-(t - T.card[1]) * 7) : 0;
  const y1 = lerp(0, 1080, eo(u)) + bounceY;
  g.save(); g.beginPath(); g.rect(240, 0, 1440, y1); g.clip();
  g.fillStyle = P.light; g.fillRect(240, y1 - 1080, 1440, 1080);
  // double-rule border and corner rings
  g.translate(0, y1 - 1080);
  g.strokeStyle = P.ink; g.lineWidth = 7; g.beginPath(); g.roundRect(300, 60, 1320, 960, 30); g.stroke();
  g.lineWidth = 2.5; g.beginPath(); g.roundRect(322, 82, 1276, 916, 22); g.stroke();
  for (const [cx, cy] of [[322, 82], [1598, 82], [322, 998], [1598, 998]]) { g.fillStyle = P.ink; g.beginPath(); g.arc(cx, cy, 9, 0, TAU); g.fill(); g.lineWidth = 3; g.beginPath(); g.arc(cx, cy, 20, 0, TAU); g.stroke(); }
  // the shade's roller at the bottom edge
  g.fillStyle = P.dark; g.fillRect(240, 1050, 1440, 30); g.restore();
  if (t >= T.card[0]) { g.save(); g.translate(0, y1 - 1080); fatTitle(g, 'The End', 960, 470, 190, { bounce: i => -10 * Math.max(0, Math.sin(TAU * twos(t) / BEAT - i * .6)) * (t > T.card[1] ? 1 : 0) }); g.restore(); }
  // the emu pops up from the bottom-right corner on the beat before the button and winks on it
  const pu = seg(twos(t), 8.5, 8.75);
  if (pu > 0) {
    TT.setM([1, 0, 0, 1, 0, 0]);
    const hy = lerp(1250, 790, back(pu));
    emuNeck([1430, 1180], [1430, hy + 40], -12, 1.6);
    emuHead({ x: 1430, y: hy, k: 2.0, dir: -1, open: t >= T.button && t < T.button + .3 ? .5 : 0, eyes: { lx: -.8, ly: -.3, lid: .2 }, wink: t >= T.button && t < T.button + .5 });
  }
}

export function subtitles(t) {
  for (const [a, b, text] of SUBS) if (t >= a && t < b) subPlate(SG, text, 960, 1000, { size: 34 });
}
// every on-screen text, for readcheck
export function texts(t) {
  const out = [];
  if (t >= T.title[0] && t < T.title[1]) out.push({ id: 'title', text: 'The Great Emu War', x0: 470, y0: 70, x1: 1450, y1: 230 });
  if (t >= 1.35 && t < T.title[1]) out.push({ id: 'year', text: '1932', x0: 860, y0: 225, x1: 1060, y1: 300 });
  if (t >= T.card[1] && t <= DUR) out.push({ id: 'end', text: 'The End', x0: 640, y0: 380, x1: 1280, y1: 560 });
  return out;
}
