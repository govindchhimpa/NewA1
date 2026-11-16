"""Payne v2 score: sectioned, 81 s, stereo. Sections follow the story (times are absolute, voice starts at 0.2)."""
import numpy as np
from scipy.signal import butter, sosfilt
SR = 44100; DUR = 33.0; BEAT = 0.5
N = int(SR * DUR)
_rng = np.random.default_rng(11)

def hz(m): return 440 * 2 ** ((m - 69) / 12)
def _lp(x, f, o=2): return sosfilt(butter(o, f, 'low', fs=SR, output='sos'), x)
def _hp(x, f, o=2): return sosfilt(butter(o, f, 'high', fs=SR, output='sos'), x)
def _bp(x, lo, hi, o=2): return sosfilt(butter(o, [lo, hi], 'band', fs=SR, output='sos'), x)

def add(out, t0, sig, g=1.0, pan=0.0):
    i = int(round(t0 * SR))
    if i >= N or i < 0: return
    s = sig[:N - i] * g
    out[0, i:i + len(s)] += s * (1 - pan) * 0.5 * 1.41
    out[1, i:i + len(s)] += s * (1 + pan) * 0.5 * 1.41

def pad_note(m, dur, a=0.55, r=0.7):
    t = np.arange(int((dur + r) * SR)) / SR; f = hz(m)
    y = np.sin(2*np.pi*f*t) + .55*np.sin(2*np.pi*f*1.004*t) + .5*np.sin(2*np.pi*f*.996*t) + .22*np.sin(4*np.pi*f*t) + .1*np.sin(6*np.pi*f*t)
    env = np.clip(t / a, 0, 1) * np.clip((dur + r - t) / r, 0, 1)
    return y * env * (1 + .06 * np.sin(2*np.pi*.35*t))

def pluck(m, dur=0.4, dec=9.0, bright=0.35):
    t = np.arange(int(dur * SR)) / SR; f = hz(m)
    y = (np.sin(2*np.pi*f*t) + bright*np.sin(4*np.pi*f*t)*np.exp(-t*14) + .15*np.sin(6*np.pi*f*t)*np.exp(-t*22)) * np.exp(-t*dec)
    return y * np.clip(t / .004, 0, 1)

def piano(m, dur=2.6):
    t = np.arange(int(dur * SR)) / SR; f = hz(m)
    y = (np.sin(2*np.pi*f*t) + .45*np.sin(4*np.pi*f*t)*np.exp(-t*3) + .2*np.sin(6*np.pi*f*t)*np.exp(-t*6) + .08*np.sin(8*np.pi*f*t)*np.exp(-t*9)) * np.exp(-t*1.6)
    return y * np.clip(t / .003, 0, 1) * np.clip((dur - t) / .3, 0, 1)

def kick(g=1.0):
    k = np.arange(int(.32 * SR)) / SR
    return np.sin(2*np.pi*np.cumsum(46 + 82*np.exp(-k*30)) / SR) * np.exp(-k*11) * g

def clap():
    k = np.arange(int(.22 * SR)) / SR; n = _bp(_rng.standard_normal(len(k)), 900, 4500)
    e = np.exp(-k*28)
    for d in (0.011, 0.022): e = e + np.where(k > d, np.exp(-(k - d)*28), 0) * .8
    return n * e * .5

def hat(open_=False):
    k = np.arange(int((.16 if open_ else .05) * SR)) / SR
    return _hp(_rng.standard_normal(len(k)), 6500) * np.exp(-k * (22 if open_ else 95)) * .5

def drone(t0, t1, notes, g, trem=.4):
    t = np.arange(int((t1 - t0) * SR)) / SR; y = np.zeros(len(t))
    for m in notes:
        f = hz(m); y += np.sin(2*np.pi*f*t) + .3*np.sin(4*np.pi*f*t)
    p = t / (t1 - t0)
    return y / len(notes) * (0.35 + 0.65*p) * (1 + .25*np.sin(2*np.pi*trem*t)) * np.clip((t1 - t0 - t) / .5, 0, 1) * g

CH = dict(
    Am=[45, 57, 60, 64, 71], F=[41, 53, 57, 60, 64], C=[48, 55, 60, 64, 67], G=[43, 55, 59, 62, 67],
    Dm=[38, 50, 57, 62, 65], Bb=[46, 53, 58, 62, 65], Em=[40, 52, 59, 64, 67], Cm9=[48, 55, 60, 64, 71],
)

def chord_run(out, t0, t1, names, clen, g, arp=0.0, arp_step=.25, arp_g=.06, octave=12):
    t = t0; i = 0
    while t < t1 - 1e-6:
        notes = CH[names[i % len(names)]]; L = min(clen, t1 - t)
        for n in notes: add(out, t - .03, pad_note(n, L), g / len(notes))
        if arp:
            steps = int(L / arp_step); pat = [1, 3, 2, 4, 3, 4, 2, 3]
            for s in range(steps):
                m = notes[pat[s % 8] % len(notes)] + octave
                add(out, t + s * arp_step, pluck(m, .35, 9), arp_g * (1 if s % 2 == 0 else .7), pan=.35 * np.sin((i * 8 + s) * 1.7))
        t += clen; i += 1

def render():
    out = np.zeros((2, N))
    A, B, C2, D, E2, F, G2, H = 0.0, 1.8, 7.0, 14.55, 16.9, 19.85, 26.5, 31.17
    # A hook: dark drone swell + riser
    add(out, 0.0, drone(0, B + 0.2, [33, 40, 45], .55, trem=1.2))
    k = np.arange(int(1.0 * SR)) / SR; p = k / 1.0
    add(out, B - 1.0, _hp(_rng.standard_normal(len(k)), 1500) * p**2 * .25 + np.sin(2*np.pi*np.cumsum(260 * 2**(p*2.2)) / SR) * .1 * p)
    # B curious (Am | F | C | G)
    chord_run(out, B, C2, ['Am', 'F', 'C', 'G'], 1.75, .5, arp=1, arp_step=.5, arp_g=.07)
    # C discovery: pulse from the pattern (8.85)
    chord_run(out, C2, D, ['Am', 'F', 'C', 'G'], 1.9, .55, arp=1, arp_step=.25, arp_g=.075)
    t = 8.85
    while t < D - 0.1:
        add(out, t, kick(.6)); b = int(round((t - 8.85) / BEAT))
        if b % 2 == 1: add(out, t, clap(), .5)
        add(out, t + .25, hat(), .5)
        t += BEAT
    k = np.arange(int(2.0 * SR)) / SR; p = k / 2.0
    add(out, D - 2.0, _hp(_rng.standard_normal(len(k)), 1500) * p**2 * .3 + np.sin(2*np.pi*np.cumsum(220 * 2**(p*2.5)) / SR) * .12 * p)
    # D ruler: bright
    chord_run(out, D, E2, ['C', 'G'], 1.2, .65, arp=1, arp_step=.25, arp_g=.09)
    t = D
    while t < E2 - 0.1:
        add(out, t, kick(.7)); add(out, t + .25, hat(), .5)
        if int(round((t - D) / BEAT)) % 2 == 1: add(out, t, clap(), .5)
        t += BEAT
    add(out, D, kick(1.1)); add(out, D, pad_note(36, 1.6, .01, 1.0), .5)
    # E injustice: tense drone + low piano
    add(out, E2 - .05, drone(E2 - .05, F, [33, 34, 40, 46], .7, trem=.6))
    for i, m in enumerate([57, 60, 56]): add(out, E2 + .3 + i * 0.9, piano(m, 2.2), .1)
    # F triumph (C | G | Am | F), drums, lead
    chord_run(out, F, G2, ['C', 'G', 'Am', 'F'], 1.65, .75, arp=1, arp_step=.25, arp_g=.09)
    add(out, F, kick(1.15)); add(out, F, clap(), .8); add(out, F, pad_note(36, 2.0, .01, 1.2), .5)
    t = F + BEAT; lead = [76, 79, 84, 79, 76, 81, 84, 88, 74, 79, 83, 79, 72, 77, 81, 84]
    while t < G2 - 0.1:
        b = int(round((t - F) / BEAT)); add(out, t, kick(.7))
        if b % 2 == 1: add(out, t, clap(), .65)
        add(out, t + .25, hat(), .55); add(out, t, pluck(lead[b % 16], .5, 6.0, .5), .09, pan=.25 * np.sin(b))
        t += BEAT
    # G melancholy: Dm pad, sparse piano
    for n in CH['Dm'][:4]: add(out, G2, pad_note(n, H - G2 - 1.0, 1.0, 1.0), .22 / 4)
    for i, m in enumerate([74, 72, 69, 65, 69, 67, 64]): add(out, G2 + .2 + i * 0.62, piano(m, 2.4), .11, pan=.2 * (-1) ** i)
    # H build-up to the final reveal
    k = np.arange(int(1.2 * SR)) / SR; p = k / 1.2
    add(out, H - 1.2, _hp(_rng.standard_normal(len(k)), 2000) * p**2 * .22 + np.sin(2*np.pi*np.cumsum(330 * 2**(p*2.0)) / SR) * .09 * p)
    # final reveal: Cmaj9 hit + ring-out
    for m in (36, 48, 55, 60, 64, 67, 71, 74, 79):
        L = DUR - H - .1; tt = np.arange(int((L + 1.0) * SR)) / SR
        add(out, H, pad_note(m, L, .02, 1.0) * np.exp(-tt * .9), .85 / 9)
    add(out, H, kick(1.3)); add(out, H, clap(), .7)
    for i, m in enumerate([84, 88, 91, 95]): add(out, H + .05 + i * .07, pluck(m, 1.4, 3.2, .4), .16)
    out[0] = _hp(out[0], 28); out[1] = _hp(out[1], 28)
    out *= np.clip((DUR - np.arange(N) / SR) / .25, 0, 1)
    return out / (np.max(np.abs(out)) + 1e-9) * 0.62
