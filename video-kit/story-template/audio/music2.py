"""Payne v2 score: sectioned, 81 s, stereo. Sections follow the story (times are absolute, voice starts at 0.2)."""
import numpy as np
from scipy.signal import butter, sosfilt
SR = 44100; DUR = 81.0; BEAT = 0.5
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
    S1, S2, S3, S4, S5, S6, S7, S8, S9 = 2.2, 11.4, 30.75, 35.9, 42.2, 52.4, 62.55, 74.6, 79.7

    # 0 - 2.2 hook: dark drone swell
    add(out, 0.0, drone(0, S1 + 0.3, [33, 40, 45], .55, trem=1.2))
    # 1 wonder (Am add9 | F | C | G)
    chord_run(out, S1, S2, ['Am', 'F', 'C', 'G'], 2.25, .50, arp=1, arp_step=.5, arp_g=.07)
    # 2 build: pulse + clap + hat + arp
    chord_run(out, S2, S3, ['Am', 'F', 'C', 'G'], 2.0, .55, arp=1, arp_step=.25, arp_g=.075)
    t = S2
    while t < S3 - 0.1:
        add(out, t, kick(.62)); b = int(round((t - S2) / BEAT))
        if b % 2 == 1: add(out, t, clap(), .55)
        add(out, t + .25, hat(), .5)
        if b % 4 == 3: add(out, t + .25, hat(True), .5)
        t += BEAT
    # riser into the reveal
    k = np.arange(int(1.9 * SR)) / SR; p = k / 1.9
    add(out, S3 - 1.9, _hp(_rng.standard_normal(len(k)), 1500) * p**2 * .32 + np.sin(2*np.pi*np.cumsum(220 * 2**(p*2.6)) / SR) * .12 * p)
    # 3 revelation (C | G | Am | F), bright
    chord_run(out, S3, S4, ['C', 'G', 'Am', 'F'], 1.3, .65, arp=1, arp_step=.25, arp_g=.09, octave=12)
    t = S3
    while t < S4 - 0.1:
        add(out, t, kick(.7)); add(out, t + .25, hat(), .5)
        if int(round((t - S3) / BEAT)) % 2 == 1: add(out, t, clap(), .5)
        t += BEAT
    add(out, S3, kick(1.2)); add(out, S3, pad_note(36, 2.0, .01, 1.2), .5)
    # 4 tense drone (Russell)
    add(out, S4 - .05, drone(S4 - .05, S5, [33, 34, 40, 46], .75, trem=.6))
    # 5 quiet, sparse piano over a barely-there pad
    for n in CH['Am'][:3]: add(out, S5, pad_note(n, S6 - S5, 1.2, 1.2), .12)
    mel = [69, 72, 76, 72, 67, 71, 74, 69, 64, 67]
    for i, m in enumerate(mel): add(out, S5 + .4 + i * 1.0, piano(m), .11, pan=.2 * (-1) ** i)
    # 6 melancholy (Dm | Bb | F | C), slow arp, no drums
    chord_run(out, S6, S7, ['Dm', 'Bb', 'F', 'C'], 2.55, .55, arp=1, arp_step=.6, arp_g=.07)
    for i in range(6): add(out, S6 + 1.2 + i * 1.6, piano([74, 70, 69, 67, 65, 62][i], 2.8), .09)
    # 7 triumph (C | G | Am | F) with drums and a lead
    chord_run(out, S7, S8, ['C', 'G', 'Am', 'F'], 2.0, .75, arp=1, arp_step=.25, arp_g=.09)
    add(out, S7, kick(1.15)); add(out, S7, clap(), .8); add(out, S7, pad_note(36, 2.5, .01, 1.5), .5)
    t = S7 + BEAT; lead = [76, 79, 84, 79, 76, 81, 84, 88, 74, 79, 83, 79, 72, 77, 81, 84]
    while t < S8 - 0.1:
        b = int(round((t - S7) / BEAT)); add(out, t, kick(.7))
        if b % 2 == 1: add(out, t, clap(), .65)
        add(out, t + .25, hat(), .55)
        add(out, t, pluck(lead[b % 16], .5, 6.0, .5), .09, pan=.25 * np.sin(b))
        t += BEAT
    # 8 stripped, a little sad, rising tension to the final reveal
    for n in CH['Am'][:4]: add(out, S8, pad_note(n, S9 - S8 + .6, 1.0, 1.0), .22 / 4)
    for i, m in enumerate([72, 69, 67, 64, 69, 71]): add(out, S8 + .5 + i * .85, piano(m, 2.2), .1)
    # 9 final reveal: big Cmaj9 + ring-out
    for m in (36, 48, 55, 60, 64, 67, 71, 74, 79):
        add(out, S9, pad_note(m, DUR - S9 - .2, .02, 1.0) * np.exp(-np.arange(int((DUR - S9 - .2 + 1.0) * SR)) / SR * .9), .85 / 9)
    add(out, S9, kick(1.3)); add(out, S9, clap(), .7)
    for i, m in enumerate([84, 88, 91, 95]): add(out, S9 + .05 + i * .07, pluck(m, 1.4, 3.2, .4), .16)
    # overall: gentle low-cut and slight fade at the very end
    out[0] = _hp(out[0], 28); out[1] = _hp(out[1], 28)
    out *= np.clip((DUR - np.arange(N) / SR) / .25, 0, 1)
    pk = np.max(np.abs(out)) + 1e-9
    return out / pk * 0.62
