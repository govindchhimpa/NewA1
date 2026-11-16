"""Darvaza score: sectioned, 32 s, stereo. Times are absolute (voice starts at 0.2)."""
import numpy as np
from scipy.signal import butter, sosfilt
SR = 44100; DUR = 32.0; BEAT = 0.5
N = int(SR * DUR)
_rng = np.random.default_rng(23)
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
def bell(m, dur=3.0):
    t = np.arange(int(dur * SR)) / SR; f = hz(m)
    y = (np.sin(2*np.pi*f*t) + .5*np.sin(2*np.pi*f*2.76*t)*np.exp(-t*3) + .3*np.sin(2*np.pi*f*5.4*t)*np.exp(-t*6)) * np.exp(-t*1.3)
    return y * np.clip(t / .003, 0, 1) * np.clip((dur - t) / .4, 0, 1)
def kick(g=1.0):
    k = np.arange(int(.32 * SR)) / SR
    return np.sin(2*np.pi*np.cumsum(46 + 82*np.exp(-k*30)) / SR) * np.exp(-k*11) * g
def boom(dur=2.6, g=1.0):
    k = np.arange(int(dur * SR)) / SR
    sub = np.sin(2*np.pi*np.cumsum(30 + 70*np.exp(-k*6)) / SR) * np.exp(-k*1.7)
    nz = _lp(_rng.standard_normal(len(k)), 900) * np.exp(-k*3.2) * .7
    return (sub + nz) * g
def tick(g=1.0):
    k = np.arange(int(.05 * SR)) / SR
    return (_bp(_rng.standard_normal(len(k)), 1800, 5200) * np.exp(-k*110) * .8 + np.sin(2*np.pi*1500*k) * np.exp(-k*90) * .3) * g
def drone(t0, t1, notes, g, trem=.4):
    t = np.arange(int((t1 - t0) * SR)) / SR; y = np.zeros(len(t))
    for m in notes:
        f = hz(m); y += np.sin(2*np.pi*f*t) + .3*np.sin(4*np.pi*f*t)
    p = t / (t1 - t0)
    return y / len(notes) * (0.35 + 0.65*p) * (1 + .25*np.sin(2*np.pi*trem*t)) * np.clip((t1 - t0 - t) / .5, 0, 1) * g
def riser(t0, t1, g=1.0):
    k = np.arange(int((t1 - t0) * SR)) / SR; p = k / (t1 - t0)
    return (_hp(_rng.standard_normal(len(k)), 1200) * p**2 * .32 + np.sin(2*np.pi*np.cumsum(180 * 2**(p*2.8)) / SR) * .12 * p) * g
def wind(t0, t1, g=1.0):
    k = np.arange(int((t1 - t0) * SR)) / SR
    n = _bp(_rng.standard_normal(len(k)), 260, 900) * (0.55 + 0.45*np.sin(2*np.pi*.23*k + 1) * np.sin(2*np.pi*.11*k + 2))
    return n * np.clip(k / 1.0, 0, 1) * np.clip((t1 - t0 - k) / 1.0, 0, 1) * g
CH = dict(Dm=[38, 50, 57, 62, 65], Bb=[34, 46, 53, 58, 62], Gm=[43, 55, 58, 62, 67], A=[45, 57, 61, 64, 69], Dm9=[38, 50, 57, 62, 69], Eb=[39, 51, 58, 63, 67])
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
def fire_bed(out, t0, t1, kfun, g=1.0):
    n = int((t1 - t0) * SR); k = np.arange(n) / SR + t0
    kk = np.array([kfun(x) for x in k[::441]]); kk = np.interp(k, k[::441], kk)
    roar = _lp(_rng.standard_normal(n), 520) * (0.7 + 0.3*np.sin(2*np.pi*.9*k)) * kk * .9
    hiss = _bp(_rng.standard_normal(n), 1800, 6500) * kk * .18
    pops = np.zeros(n)
    rate = 26; cnt = int((t1 - t0) * rate)
    for _ in range(cnt):
        i = int(_rng.random() * n)
        if _rng.random() > kk[i]: continue
        L = int(_rng.uniform(.004, .02) * SR); e = np.exp(-np.arange(L) / SR * _rng.uniform(220, 600))
        c = _bp(_rng.standard_normal(L), 900, 5200) * e * _rng.uniform(.3, 1.0)
        pops[i:i + L] += c[:max(0, n - i)][:L] if i + L <= n else c[:n - i]
    y = (roar + hiss + pops * 1.3) * g
    add(out, t0, y, 1.0)
def render():
    out = np.zeros((2, N))
    A, B, Cc, D, E, F, G, H, I, J, K = 3.47, 7.41, 8.55, 11.14, 14.77, 17.68, 18.55, 22.77, 24.15, 26.06, 28.54
    # 0 hook: low drone, wind, clock ticks
    add(out, 0.0, drone(0, A + 0.3, [26, 33, 38], .7, trem=.8)); add(out, 0.0, wind(0, B, .22))
    t = 0.6
    while t < A: add(out, t, tick(.5)); t += 1.0
    # 1 engineers drill: Dm | Bb | Gm | A pulse with arp
    chord_run(out, A, B - 0.3, ['Dm', 'Bb', 'Gm', 'A'], 1.0, .5, arp=1, arp_step=.25, arp_g=.07)
    t = A
    while t < B - 0.5:
        add(out, t, kick(.5)); add(out, t + .25, tick(.45)); t += BEAT
    add(out, B - 1.2, riser(B - 1.2, B, .9))
    # 2 collapse: boom, then hollow
    add(out, B, boom(2.8, 1.1)); add(out, B + .02, _lp(_rng.standard_normal(int(.9*SR)), 1400) * np.exp(-np.arange(int(.9*SR))/SR*4) * .6)
    # 3 cavern: eerie cluster + shimmer
    for m in (38, 39, 45, 50): add(out, Cc, pad_note(m, D - Cc, 1.0, 0.8), .13)
    for i, m in enumerate([81, 86, 84, 89]): add(out, Cc + .4 + i * .65, bell(m, 2.2), .06, pan=(-1) ** i * .4)
    add(out, Cc, wind(Cc, D, .15))
    # 4 crater opens: rising pulse
    chord_run(out, D, E, ['Dm9', 'Bb', 'Gm', 'A'], 0.9, .6, arp=1, arp_step=.25, arp_g=.085)
    t = D
    while t < E - 0.1:
        add(out, t, kick(.62)); add(out, t + .25, tick(.5)); t += BEAT
    add(out, D, boom(1.2, .5))
    # 5 poisonous gas: low unease, riser to ignition
    add(out, E, drone(E, F - 0.12, [26, 33, 38, 39], .8, trem=1.4))
    add(out, F - 3.0, riser(F - 3.0, F - 0.12, 1.0))
    # 6 ignition: huge hit, fire starts
    add(out, F, boom(3.4, 1.35)); add(out, F, kick(1.3))
    def kf(x):
        if x < F: return 0.0
        if x < K: return 1.0
        return max(0.22, 1.0 - 0.78 * (x - K) / 3.0)
    fire_bed(out, F, DUR, kf, 0.55)
    # 7 the plan: dry staccato plucks, clock ticks speeding up
    for i, m in enumerate([62, 65, 69, 65]): add(out, G + .1 + i * .22, pluck(m, .25, 14), .1, pan=.3)
    add(out, G, drone(G, H, [38, 45, 50], .5, trem=.6))
    t = G + 1.2
    while t < H - 0.1:
        add(out, t, tick(.55)); t += 0.5 if t < G + 2.4 else 0.25
    # 8 wrong: sting then silence
    for m in (50, 53, 56, 62): add(out, H, pad_note(m, .7, .01, .5), .22)
    add(out, H, kick(1.1)); add(out, H, boom(1.6, .8))
    add(out, H + .9, drone(H + .9, I, [26, 33], .8, trem=1.0))
    # 9 years: heavy ostinato + counting sweep
    t = I
    while t < J - 0.1:
        add(out, t, kick(.7)); add(out, t + .25, tick(.5)); t += BEAT
    add(out, I, riser(I, J, .9))
    chord_run(out, I, J, ['Dm', 'Bb'], 1.0, .45)
    # 10 gates of hell: big minor chord + low brass-ish drone
    for m in (26, 38, 45, 50, 53, 57, 62, 69): add(out, J, pad_note(m, K - J, .02, 1.0) * np.exp(-np.arange(int((K - J + 1.0) * SR)) / SR * .35), .85 / 8)
    add(out, J, boom(2.8, 1.2)); add(out, J, kick(1.2))
    t = J + BEAT
    while t < K - 0.1:
        add(out, t, kick(.55)); t += 1.0
    # 11 fading: lone bells descending, pad thins out
    for n in CH['Dm'][:4]: add(out, K, pad_note(n, DUR - K, 1.0, 1.6), .2 / 4)
    for i, m in enumerate([81, 79, 77, 74, 69]): add(out, K + .5 + i * .62, bell(m, 2.6), .1)
    add(out, DUR - 1.8, drone(DUR - 1.8, DUR - 0.1, [26, 33], .35, trem=.5))
    out[0] = _hp(out[0], 28); out[1] = _hp(out[1], 28)
    out *= np.clip((DUR - np.arange(N) / SR) / .3, 0, 1)
    pk = np.max(np.abs(out)) + 1e-9
    return out / pk * 0.62
