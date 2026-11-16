// main.js — entry point for "The Great Emu War" (10 s)
import * as TT from './toon.js';
import { makeFilm, post } from './film.js';
import { paintDesert } from './bg.js';
import * as SC from './scenes.js';
import * as ST from './story.js';
const cv = document.getElementById('c');
TT.init(cv);
await document.fonts.ready;
for (const f of ['68px Limelight', '34px "IM Fell English SC"', '104px Shrikhand']) await document.fonts.load(f);
const F = makeFilm(cv); TT.init(F.scene);
const bg = paintDesert(); TT.init(F.scene); SC.initScenes(bg, F.sg);
const FN = { stage: SC.shotStage, close: SC.shotClose, end: SC.shotEnd };
const cuts = ST.SHOTS.map(s => s[0]).filter(c => c > 0);
window.DUR = ST.DUR;
window.render = t => {
  t = Math.min(t, ST.DUR - 1e-4);
  const sg = F.sg; sg.setTransform(1, 0, 0, 1, 0, 0); sg.fillStyle = '#000'; sg.fillRect(0, 0, 1920, 1080);
  FN[ST.shotAt(t)[2]](t);
  SC.subtitles(t);
  const f = Math.round(t * 24), jump = cuts.some(c => Math.round(c * 24) === f) ? 3 : (Math.round(ST.T.honk * 24) === f ? 4 : 0);
  post(F, t, { jump });
};
window.EV = ST.events();
window.TEXTS = t => SC.texts(t);
window.READY = true;
