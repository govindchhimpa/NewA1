"""VESSA SFX synthesis. Every function: f(vol=1.0, dur=None) -> mono float32 array @44.1k."""
import numpy as np
from scipy.signal import butter, sosfilt
SR = 44100
_rng = np.random.default_rng(7)

def _t(d): return np.arange(int(d * SR)) / SR
def _noise(n): return _rng.standard_normal(n)
def _bp(x, lo, hi, o=2):
    return sosfilt(butter(o, [lo, hi], 'band', fs=SR, output='sos'), x)
def _lp(x, f, o=2): return sosfilt(butter(o, f, 'low', fs=SR, output='sos'), x)
def _hp(x, f, o=2): return sosfilt(butter(o, f, 'high', fs=SR, output='sos'), x)
def _fade(x, a=0.003, r=0.01):
    n = len(x); na = max(1, int(a * SR)); nr = max(1, int(r * SR))
    x = x.copy(); x[:na] *= np.linspace(0, 1, na); x[-nr:] *= np.linspace(1, 0, nr); return x
def _norm(x, vol, peak=0.9):
    m = np.max(np.abs(x)) + 1e-9
    return (_fade(x) * (peak * vol / m)).astype(np.float32)
def _tone(f, t): return np.sin(2 * np.pi * np.cumsum(f) / SR) if np.ndim(f) else np.sin(2 * np.pi * f * t)
def _hz(n): return 440 * 2 ** ((n - 69) / 12)

def whoosh(vol=1.0, dur=0.55):
    dur = dur or 0.55; t = _t(dur); n = len(t); x = _noise(n)
    # swept band-pass via blocks
    out = np.zeros(n); blocks = 24; bl = n // blocks
    for i in range(blocks):
        p = (i + .5) / blocks
        fc = 300 * (9000 / 300) ** (np.sin(p * np.pi / 2) ** 1.5)
        seg = x[i * bl:(i + 1) * bl if i < blocks - 1 else n]
        out[i * bl:i * bl + len(seg)] = _bp(seg, fc * .6, min(fc * 1.6, 20000), 2) if False else seg
    # simpler: crossfaded 3 filtered copies
    a = _bp(x, 250, 1200); b = _bp(x, 1200, 4000); c = _bp(x, 4000, 12000)
    p = t / dur
    y = a * np.exp(-((p - .25) / .2) ** 2) + b * np.exp(-((p - .5) / .2) ** 2) + c * np.exp(-((p - .75) / .2) ** 2) * .7
    env = np.sin(np.pi * np.clip(p, 0, 1)) ** 1.6
    return _norm(y * env, vol, .8)

def pop(vol=1.0, dur=0.18):
    t = _t(0.18); f = 180 + 520 * np.exp(-t * 38)
    y = _tone(f, t) * np.exp(-t * 24) + .25 * _bp(_noise(len(t)), 1500, 5000) * np.exp(-t * 80)
    return _norm(y, vol, .85)

def tick(vol=1.0, dur=0.06):
    t = _t(0.07); y = _hp(_noise(len(t)), 3000) * np.exp(-t * 130) * .6 + _tone(2400, t) * np.exp(-t * 110)
    return _norm(y, vol, .6)

def thud(vol=1.0, dur=0.45):
    t = _t(0.5); f = 40 + 90 * np.exp(-t * 28)
    y = _tone(f, t) * np.exp(-t * 9) + .3 * _lp(_noise(len(t)), 600) * np.exp(-t * 40)
    return _norm(np.tanh(y * 1.6), vol, .95)

def sparkle(vol=1.0, dur=0.9):
    dur = dur or .9; t = _t(dur); y = np.zeros(len(t))
    notes = [88, 91, 95, 100, 103, 107, 112]
    for i, n in enumerate(notes):
        s = int(i * .055 * SR); tt = t[:len(t) - s]
        y[s:] += (np.sin(2 * np.pi * _hz(n) * tt) + .3 * np.sin(2 * np.pi * _hz(n) * 2 * tt)) * np.exp(-tt * 9) * (.6 + .4 * i / 6)
    return _norm(y, vol, .6)

def riser(vol=1.0, dur=1.5):
    dur = dur or 1.5; t = _t(dur); p = t / dur
    nz = _hp(_noise(len(t)), 1200) * p ** 2
    f = 200 * 2 ** (p * 2.5); tn = _tone(f, t) * .3 * p
    y = nz * .6 + tn
    y *= np.minimum(1, t / .08)
    return _norm(y, vol, .7)

def click(vol=1.0, dur=0.1):
    t = _t(0.12)
    y = _tone(1800, t) * np.exp(-t * 200) + _hp(_noise(len(t)), 2000) * np.exp(-t * 300) * .7
    t2 = t[:int(.05 * SR)]; l = np.zeros(len(t)); l[int(.035 * SR):int(.035 * SR) + len(t2)] = _tone(900, t2) * np.exp(-t2 * 150) * .5
    return _norm(y + l, vol, .75)

def splash(vol=1.0, dur=0.5):
    dur = dur or .5; t = _t(dur); n = _noise(len(t))
    y = _bp(n, 600, 5000) * np.exp(-t * 7)
    # bubbly chirps
    for s in (0, .06, .13, .21):
        i = int(s * SR); tt = t[:len(t) - i]
        y[i:] += .5 * _tone(500 + 1800 * (1 - np.exp(-tt * 40)), tt) * np.exp(-tt * 45) * np.exp(-s * 5)
    y *= np.minimum(1, t / .01)
    return _norm(y, vol, .7)

def clink(vol=1.0, dur=0.5):
    t = _t(0.55); y = np.zeros(len(t))
    for s, fs, g in ((0, (2100, 3300, 4700), 1), (.07, (2600, 3900, 5400), .7), (.15, (1900, 3000, 4400), .5)):
        i = int(s * SR); tt = t[:len(t) - i]
        for k, f in enumerate(fs): y[i:] += g * np.sin(2 * np.pi * f * tt) * np.exp(-tt * (14 + 6 * k)) / (k + 1)
    return _norm(y, vol, .65)

def ding(vol=1.0, dur=0.9):
    t = _t(1.0); f = _hz(84)
    y = (np.sin(2 * np.pi * f * t) + .35 * np.sin(2 * np.pi * f * 2.76 * t) * np.exp(-t * 6) + .2 * np.sin(2 * np.pi * f * 5.4 * t) * np.exp(-t * 12)) * np.exp(-t * 4.5)
    return _norm(y, vol, .65)

def swell(vol=1.0, dur=2.5):
    dur = dur or 2.5; t = _t(dur); p = t / dur
    y = np.zeros(len(t))
    for n in (48, 55, 60, 64, 67, 72):
        for d in (-.12, .12): y += np.sin(2 * np.pi * _hz(n) * (1 + d / 100) * t)
    nz = _lp(_noise(len(t)), 5000) * .15
    env = np.sin(np.pi / 2 * np.minimum(1, p / .8)) ** 2 * np.where(p > .8, np.cos((p - .8) / .2 * np.pi / 2), 1) ** 1 if False else (p ** 1.5) * (1 - p) ** .5 / .45
    return _norm((y * .08 + nz * p) * env, vol, .55)

def type(vol=1.0, dur=0.05):
    t = _t(0.05); y = _bp(_noise(len(t)), 1800, 6000) * np.exp(-t * 130) + .5 * _tone(1200, t) * np.exp(-t * 150)
    return _norm(y, vol, .45)

CUES_V1 = dict(whoosh=whoosh, pop=pop, tick=tick, thud=thud, sparkle=sparkle, riser=riser, click=click,
            splash=splash, clink=clink, ding=ding, swell=swell, type=type)


# ---------------- v2 additions ----------------
def _env_chunks(n, rng, lo=0.06, hi=0.22, gap=(0.01, 0.07)):
    """amplitude envelope made of random stroke bursts (pen / chalk)."""
    e = np.zeros(n); i = 0
    while i < n:
        L = int(rng.uniform(lo, hi) * SR); G = int(rng.uniform(*gap) * SR)
        seg = np.hanning(max(8, L)) * rng.uniform(.5, 1.0)
        e[i:i + len(seg)] = seg[:max(0, n - i)]
        i += L + G
    return e

def swish(vol=1.0, dur=0.3):
    dur = 0.3; t = _t(dur); p = t / dur
    n = _noise(len(t)); y = np.zeros(len(t))
    for lo, hi, g in ((900, 2500, .7), (2500, 7000, 1.0)):
        y += _bp(n, lo, hi) * g
    env = np.sin(np.pi * np.clip(p, 0, 1)) ** 1.5
    return _norm(y * env, vol, .6)

def stamp(vol=1.0, dur=0.5):
    t = _t(0.55); f = 62 + 90 * np.exp(-t * 40)
    body = _tone(f, t) * np.exp(-t * 10)
    slap = _bp(_noise(len(t)), 700, 3500) * np.exp(-t * 55) * .9
    low = _lp(_noise(len(t)), 250) * np.exp(-t * 18) * .8
    return _norm(np.tanh((body + slap + low) * 1.5), vol, .95)

def boom(vol=1.0, dur=1.2):
    dur = dur or 1.2; t = _t(dur)
    f = 28 + 50 * np.exp(-t * 6); y = _tone(f, t) * np.exp(-t * 2.6)
    y += _lp(_noise(len(t)), 180) * np.exp(-t * 3.2) * .9
    y += _bp(_noise(len(t)), 300, 2200) * np.exp(-t * 22) * .5
    return _norm(np.tanh(y * 1.4), vol, .95)

def flip(vol=1.0, dur=0.55):
    dur = dur or .55; t = _t(dur); y = np.zeros(len(t)); n = 11
    for i in range(n):
        s = (i / n) ** 0.85 * (dur - 0.08); i0 = int(s * SR)
        L = int(.035 * SR); seg = _bp(_noise(L), 800, 6500) * np.exp(-np.arange(L) / SR * 90) * (.5 + .5 * ((i * 7) % 3) / 2)
        y[i0:i0 + L] += seg[:max(0, len(y) - i0)]
    return _norm(y, vol, .6)

def shutter(vol=1.0, dur=0.2):
    t = _t(0.2); y = np.zeros(len(t))
    for s, g in ((0, 1.0), (.055, .75)):
        i = int(s * SR); L = len(t) - i; tt = t[:L]
        y[i:] += (_bp(_noise(L), 2000, 8000) * np.exp(-tt * 140) + _tone(1500, tt) * np.exp(-tt * 160) * .5) * g
    return _norm(y, vol, .6)

def chime(vol=1.0, dur=0.9):
    t = _t(1.4); y = np.zeros(len(t))
    for s, m in ((0, 88), (.09, 95)):
        i = int(s * SR); tt = t[:len(t) - i]; f = _hz(m)
        y[i:] += (np.sin(2*np.pi*f*tt) + .4*np.sin(2*np.pi*f*2.4*tt)*np.exp(-tt*5) + .2*np.sin(2*np.pi*f*4.1*tt)*np.exp(-tt*9)) * np.exp(-tt * 3.3)
    return _norm(y, vol, .6)

def sting(vol=1.0, dur=1.6):
    dur = dur or 1.6; t = _t(dur); y = np.zeros(len(t))
    for m, g in ((45, 1.0), (46, .8), (52, .7), (58, .5)):
        f = _hz(m); y += g * (np.sin(2*np.pi*f*t) + .5*np.sin(4*np.pi*f*t) + .3*np.sin(6*np.pi*f*t))
    y = _lp(y, 1800) * np.exp(-t * 2.2) * np.minimum(1, t / .01)
    y += _bp(_noise(len(t)), 400, 2500) * np.exp(-t * 30) * .5
    return _norm(y, vol, .75)

def heartbeat(vol=1.0, dur=0.6):
    t = _t(0.6); y = np.zeros(len(t))
    for s, g in ((0, 1.0), (.23, .7)):
        i = int(s * SR); tt = t[:len(t) - i]
        y[i:] += _tone(52 + 40 * np.exp(-tt * 40), tt) * np.exp(-tt * 20) * g
    return _norm(np.tanh(y * 1.6), vol, .9)

def _stroke(vol, dur, lo, hi, seed, rate):
    rng = np.random.default_rng(seed); dur = dur or 1.5; n = int(dur * SR)
    e = _env_chunks(n, rng, *rate)
    y = _bp(_noise(n), lo, hi) * e
    y += _tone(rng.uniform(2200, 3000), _t(dur)) * e * .06
    return _norm(y * np.minimum(1, _t(dur) / .05), vol, .5)

def pen(vol=1.0, dur=1.5): return _stroke(vol, dur, 3000, 9500, 3, (0.05, 0.16, (0.015, 0.08)))
def chalk(vol=1.0, dur=1.5): return _stroke(vol, dur, 1500, 6500, 5, (0.07, 0.25, (0.03, 0.12)))

def room(vol=1.0, dur=2.0):
    dur = dur or 2.0; t = _t(dur)
    y = _lp(_noise(len(t)), 420) * .5 + np.sin(2*np.pi*60*t) * .08 + np.sin(2*np.pi*120*t) * .04
    y *= np.minimum(1, t / .3) * np.minimum(1, (dur - t) / .4)
    return _norm(y, vol, .35)

def crickets(vol=1.0, dur=2.0):
    dur = dur or 2.0; rng = np.random.default_rng(9); t = _t(dur); y = np.zeros(len(t))
    for ch in range(3):
        base = 4300 + ch * 330; i = int(rng.uniform(0, .4) * SR)
        while i < len(t) - int(.3 * SR):
            for k in range(3):
                i0 = i + int(k * .045 * SR); L = int(.03 * SR); tt = np.arange(L) / SR
                seg = np.sin(2*np.pi*base*tt) * np.hanning(L)
                y[i0:i0 + L] += seg[:max(0, len(y) - i0)] * (.7 + .3 * rng.random())
            i += int(rng.uniform(.38, .6) * SR)
    y += _lp(_noise(len(t)), 500) * .05
    y *= np.minimum(1, t / .4) * np.minimum(1, (dur - t) / .4)
    return _norm(y, vol, .35)

def birds(vol=1.0, dur=2.0):
    dur = dur or 2.0; rng = np.random.default_rng(13); t = _t(dur); y = np.zeros(len(t))
    for _ in range(int(dur * 2.5)):
        i = int(rng.uniform(0, dur - .3) * SR); L = int(rng.uniform(.06, .16) * SR); tt = np.arange(L) / SR
        f0 = rng.uniform(2400, 4200); f = f0 * (1 + .25 * np.sin(2*np.pi*rng.uniform(12, 30)*tt))
        seg = np.sin(2*np.pi*np.cumsum(f) / SR) * np.hanning(L) * rng.uniform(.4, 1.0)
        y[i:i + L] += seg[:max(0, len(y) - i)]
    y += _lp(_noise(len(t)), 700) * .04
    y *= np.minimum(1, t / .3) * np.minimum(1, (dur - t) / .4)
    return _norm(y, vol, .35)

def crowd(vol=1.0, dur=2.0):
    dur = dur or 2.0; t = _t(dur); n = _noise(len(t)); rng = np.random.default_rng(21); y = np.zeros(len(t))
    for lo, hi in ((250, 600), (600, 1300), (1300, 2600)):
        slow = _lp(rng.standard_normal(len(t)), 4); slow = slow / (np.max(np.abs(slow)) + 1e-9)
        y += _bp(n, lo, hi) * (.55 + .45 * slow)
    y *= np.minimum(1, t / .4) * np.minimum(1, (dur - t) / .4)
    return _norm(y, vol, .45)

def applause(vol=1.0, dur=3.0):
    dur = dur or 3.0; rng = np.random.default_rng(31); t = _t(dur); y = np.zeros(len(t))
    n_claps = int(dur * 420)
    for _ in range(n_claps):
        s = rng.uniform(0, dur - .05); i = int(s * SR); L = int(.03 * SR)
        ramp = min(1, s / .5); seg = _bp(_noise(L), 900, 6000) * np.exp(-np.arange(L) / SR * 110) * rng.uniform(.2, 1.0) * ramp
        y[i:i + L] += seg[:max(0, len(y) - i)]
    y *= np.minimum(1, t / .25) * np.minimum(1, (dur - t) / .6)
    return _norm(y, vol, .6)

CUES = dict(CUES_V1, swish=swish, stamp=stamp, boom=boom, flip=flip, shutter=shutter, chime=chime, sting=sting,
            heartbeat=heartbeat, pen=pen, chalk=chalk, room=room, crickets=crickets, birds=birds, crowd=crowd, applause=applause)
