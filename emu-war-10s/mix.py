"""mix.py — synthesised foley + radio-announcer voice + ducked score + 1930s optical-soundtrack ageing → out/mix.wav
Run from the library root after events.mjs and music/score.py:  .venv/bin/python <project>/mix.py"""
import os, sys, json, numpy as np, soundfile as sf
from scipy.signal import resample_poly
from scipy.ndimage import uniform_filter1d
LIB = os.environ.get('LIB') or os.getcwd()
sys.path.insert(0, os.path.join(LIB, 'core/audio'))
import sfx as X
from sfx import SR, t_, env_exp, bp, lp, hp, norm, add
HERE = os.path.dirname(os.path.abspath(__file__))
R = np.random.default_rng(1932)
def nz(d): return R.standard_normal(len(t_(d)))
ev = json.load(open(os.path.join(HERE, 'events.json'))); DUR = ev['dur']; E = ev['ev']
N = int(round(DUR * SR))
FX = np.zeros((N, 2)); VOX = np.zeros((N, 2)); BED = np.zeros((N, 2))

# —— foley recipes (all synthesised) ——
def sine_sweep(f0, f1, d, curve=1.0):
    tt = t_(d); f = f0 + (f1 - f0) * (tt / d) ** curve; return np.sin(2 * np.pi * np.cumsum(f) / SR)
def partials(fs, d, taus, amps=None):
    tt = t_(d); amps = amps or [1] * len(fs)
    return sum(a * np.sin(2 * np.pi * f * tt) * np.exp(-tt / tau) for f, tau, a in zip(fs, taus, amps))
def woodblock(f=2400, d=.09):
    tt = t_(d); x = np.sin(2 * np.pi * f * tt) * np.exp(-tt / .018) + .5 * np.sin(2 * np.pi * f * 1.52 * tt) * np.exp(-tt / .01)
    return norm(x + hp(nz(d), 2000) * env_exp(d, .0015) * .4)
def slide_whistle(f0, f1, d, vib=0):
    tt = t_(d); f = f0 * (f1 / f0) ** (tt / d) * (1 + vib * np.sin(2 * np.pi * 6 * tt)); x = np.sin(2 * np.pi * np.cumsum(f) / SR)
    x = x + .15 * np.sin(2 * np.pi * np.cumsum(2 * f) / SR); e = np.minimum(1, tt / .03) * np.minimum(1, (d - tt) / .06)
    return norm(x * e + bp(nz(d), 1500, 5000) * .03 * e)
def boing(f=210, d=.6, depth=.35):
    tt = t_(d); f_ = f * (1 + depth * np.sin(2 * np.pi * 13 * tt) * np.exp(-tt * 4)); ph = 2 * np.pi * np.cumsum(f_) / SR
    return norm((np.sin(ph) + .4 * np.sin(2 * ph) + .2 * np.sin(3 * ph)) * np.exp(-tt * 4.5))
def rubber_creak(d, f0=90, f1=260):
    tt = t_(d); f = f0 * (f1 / f0) ** (tt / d); saw = 2 * ((np.cumsum(f) / SR) % 1) - 1
    return norm(bp(saw, 300, 2500) * (.6 + .4 * np.abs(np.sin(2 * np.pi * 17 * tt))) * np.sin(np.pi * tt / d) ** .5)
def ratchet(d):
    out = np.zeros(int(d * SR) + 2000); n = 12
    for k in range(n): s = int((1 - (1 - k / n) ** 1.6) * d * SR); c = woodblock(3200, .03) * .6; out[s:s + len(c)] += c
    return norm(out)
def seq(clips, total):
    out = np.zeros(int(total * SR))
    for t0, c in clips:
        s0 = int(t0 * SR); n = max(0, min(len(c), len(out) - s0)); out[s0:s0 + n] += c[:n]
    return norm(out)
def gunshot():
    d = .14; crack = bp(nz(d), 400, 5000) * env_exp(d, .02)
    return norm(seq([(0, norm(crack)), (0, X.thump(1, 75) * .8)], d + .05))
def honk(d=.45):   # emu honk: a wobbling reedy saw through a nasal band-pass
    tt = t_(d); f = 230 * (1 + .12 * np.sin(2 * np.pi * 9 * tt)) * (1 - .25 * tt / d); ph = np.cumsum(f) / SR
    saw = 2 * (ph % 1) - 1; x = bp(saw, 350, 2600) + .6 * bp(saw, 900, 1400)
    return norm(np.tanh(norm(x) * 2.5) * np.minimum(1, tt / .02) * np.minimum(1, (d - tt) / .08))
def puff(d=.45): return norm(lp(nz(d), 1300) * np.sin(np.pi * t_(d) / d) ** .7)
RECIPES = {
    'irisOpen': lambda e: (slide_whistle(520, 1500, e['d']), .32),
    'tick': lambda e: (woodblock(2300 + e.get('i', 0) * 180, .08), .22),
    'shot': lambda e: (gunshot(), .55),
    'spring': lambda e: (boing(190, .9, .5), .6),
    'puff': lambda e: (puff(), .25),
    'peek': lambda e: (woodblock(900, .12), .32),
    'stretch': lambda e: (seq([(0, slide_whistle(380, 1700, e['d'])), (0, rubber_creak(e['d'], 90, 300) * .5)], e['d'] + .05), .42),
    'honk': lambda e: (honk(), .6),
    'hatPop': lambda e: (X.pop(), .45),
    'irisPull': lambda e: (seq([(0, rubber_creak(e['d'], 260, 110)), (e['d'], X.thump(1, 90))], e['d'] + .3), .45),
    'shade': lambda e: (ratchet(e['d']), .4),
    'wink': lambda e: (norm(partials([3150, 4720], .25, [.06, .04])), .22),
}
for e in E:
    if e['type'] in RECIPES:
        x, g = RECIPES[e['type']](e); add(FX, np.asarray(x, dtype=np.float64), e['t'], g, 0)

# —— voice: radio-announcer chain ——
def room_ir(d=.25):
    tt = t_(d); ir = R.standard_normal(len(tt)) * np.exp(-tt / .05); ir[0] = 1; return ir / np.abs(ir).sum() * 6
IR = room_ir(); vo_mask = np.zeros(N)
for e in E:
    if e['type'] != 'vo': continue
    y, sr = sf.read(os.path.join(HERE, 'voices', e['id'] + '.wav'))
    if y.ndim > 1: y = y.mean(1)
    y = resample_poly(y, SR, sr); y = hp(y, 260, 3); y = lp(y, 4600, 3)
    y = np.tanh(y / (np.abs(y).max() + 1e-9) * 2.2) / np.tanh(2.2)
    y = y + np.convolve(y, IR)[:len(y)] * .12
    y = X.compress(norm(y), .3, 3.0)
    add(VOX, norm(y), e['t'], 1.1)
    s = int(e['t'] * SR); vo_mask[max(0, s - 2400): s + len(y) + 4800] = 1

# —— score, ducked ~8 dB under the voice ——
mus, msr = sf.read(os.path.join(HERE, 'music', 'score.wav'))
if mus.ndim == 1: mus = np.stack([mus, mus], 1)
mus = mus[:N]; mus = np.pad(mus, ((0, N - len(mus)), (0, 0)))
duck = uniform_filter1d(vo_mask[:N], int(.12 * SR)); mus = mus * (1 - .72 * duck)[:, None]

# —— optical soundtrack: band limit, wow and flutter, saturation; hiss, crackle, projector clatter ——
def optical(x):
    y = np.stack([hp(lp(x[:, c], 6200, 2), 110, 2) for c in range(2)], 1)
    tt = np.arange(N) / SR; dl = (.00035 * np.sin(2 * np.pi * .6 * tt) + .00008 * np.sin(2 * np.pi * 7 * tt)) * SR
    idx = np.clip(np.arange(N) - 40 + dl, 0, N - 1); i0 = idx.astype(int); fr = idx - i0; i1 = np.minimum(i0 + 1, N - 1)
    y = y[i0] * (1 - fr)[:, None] + y[i1] * fr[:, None]
    return np.tanh(y * 1.4) / np.tanh(1.4)
bus = optical(mus + FX * .9)
hiss = bp(R.standard_normal(N), 800, 6000) * .0035
crk = np.zeros(N)
for p in (R.random(int(DUR * 9)) * (N - 200)).astype(int): L_ = R.integers(8, 60); crk[p:p + L_] += R.standard_normal(L_) * np.exp(-np.arange(L_) / 10) * (.02 + R.random() * .05)
crk = hp(crk, 900)
proj = np.zeros(N); per = SR / 24
for k in range(int(DUR * 24)):
    s = int(k * per); c = hp(R.standard_normal(200), 1500) * np.exp(-np.arange(200) / 30); proj[s:s + 200] += c[:max(0, min(200, N - s))] * .012
proj += lp(R.standard_normal(N), 180) * .006
BED[:, 0] = hiss + crk + proj; BED[:, 1] = hiss * .9 + crk + proj * .95
mix = bus + VOX + BED
for c in range(2): mix[:, c] = X.limit(mix[:, c], .95)
mix = mix / np.abs(mix).max() * .89
os.makedirs(os.path.join(HERE, 'out'), exist_ok=True)
sf.write(os.path.join(HERE, 'out', 'mix.wav'), mix.astype(np.float32), SR)
def db(x): return 20 * np.log10(np.sqrt(np.mean(x ** 2)) + 1e-12)
m = vo_mask[:N] > 0
print('mix.wav', DUR, 's | VO', round(db(VOX[m]), 1), 'dB  music under VO', round(db(bus[m]), 1), 'dB  music alone', round(db(bus[~m]), 1), 'dB')
