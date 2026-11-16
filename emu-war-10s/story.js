// story.js — the single source of truth: tempo grid, shots, voice, subtitle cards, key moments, sound events
export const BPM = 120, BEAT = 60 / BPM;          // 0.5 s = 12 frames at 24 fps
export const DUR = 10.0;

export const T = {
  irisOpen: [0.0, 0.4],
  title: [0.25, 4.5],
  cut2: 4.5,
  flashes: [4.5, 4.75, 5.0],
  jam: 5.5,
  stop: [5.6, 6.5],          // band stop: projector clatter only (voice L2 is the first sound after it)
  eyesPop: 5.75,
  emuIn: [6.5, 6.6],
  stretch: [6.6, 7.25],
  honk: 7.25,
  irisClose: [7.5, 7.75],
  card: [7.75, 7.9],         // end card rolls down like a window shade
  button: 9.0,
};

export const SHOTS = [
  [0.0, 4.5, 'stage'],
  [4.5, 7.75, 'close'],
  [7.75, DUR, 'end'],
];
export const shotAt = t => SHOTS.find(s => t >= s[0] && t < s[1]) || SHOTS[SHOTS.length - 1];

export const VO = [
  { id: 'L1', t: 0.4 },
  { id: 'L2', t: 5.9 },
];
// subtitle cards: [t0, t1, text]; hold >= max(1.8 s, speech + 0.6 s)
export const SUBS = [
  [0.4, 4.5, '1932! The army goes to war... with emus!'],
  [5.9, 7.75, 'Guess who won?'],
];

export function events() {
  const E = [];
  E.push({ t: 0.0, type: 'irisOpen', d: 0.4 });
  for (let i = 0; i < 4; i++) E.push({ t: 0.25 + i * 0.25, type: 'tick', i });
  for (const v of VO) E.push({ t: v.t, type: 'vo', id: v.id });
  T.flashes.forEach((t, i) => E.push({ t, type: 'shot', i }));
  E.push({ t: T.jam, type: 'spring' });
  E.push({ t: T.jam + 0.04, type: 'puff' });
  E.push({ t: T.eyesPop, type: 'eyesPop' });
  E.push({ t: T.emuIn[0], type: 'peek' });
  E.push({ t: T.stretch[0], type: 'stretch', d: T.stretch[1] - T.stretch[0] });
  E.push({ t: T.honk, type: 'honk' });
  E.push({ t: T.honk + 0.03, type: 'hatPop' });
  E.push({ t: T.irisClose[0], type: 'irisPull', d: T.irisClose[1] - T.irisClose[0] });
  E.push({ t: T.card[0], type: 'shade', d: T.card[1] - T.card[0] + 0.1 });
  E.push({ t: T.button, type: 'wink' });
  E.push({ t: 0, type: 'projector', d: DUR });
  return E;
}
