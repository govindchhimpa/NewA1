"""Shared parametric score. render(DUR, chords, hits, final, mood) -> (2,N) float. chords: list of midi-note lists, one per 4 s."""
import numpy as np, importlib.util
sp = importlib.util.spec_from_file_location('m4', '/home/claude/geo-darvaza/audio/music4.py'); m4 = importlib.util.module_from_spec(sp); sp.loader.exec_module(m4)
SR = 44100
def render(DUR, chords, hits=(), final=None, mood='dark', bpm=96, seed=5):
    m4.DUR = DUR; m4.N = int(SR * DUR); N = m4.N; out = np.zeros((2, N)); add = m4.add; rng = np.random.default_rng(seed)
    clen = 4.0; t = 0.0; i = 0
    while t < DUR - 0.5:
        ch = chords[i % len(chords)]; L = min(clen, DUR - t)
        for n in ch: add(out, max(0, t - .03), m4.pad_note(n, L, 0.7, 1.2), (0.20 if mood == 'dark' else 0.24) / len(ch), pan=(rng.random() - .5) * .5)
        add(out, t, m4.pad_note(ch[0] - 12, L, 0.4, 1.0), 0.10)
        t += clen; i += 1
    beat = 60.0 / bpm; t = 2 * beat; k = 0
    while t < DUR - 1.2:
        ch = chords[int(t // clen) % len(chords)]
        if t > 3.0: add(out, t, m4.kick(0.5 if k % 4 else 0.8), 0.20 if mood == 'dark' else 0.14)
        if k % 2 == 1 and t > 5: add(out, t, m4.tick(0.6), 0.10, pan=0.3 if k % 4 == 1 else -0.3)
        if mood != 'dark' or k % 2 == 0:
            n = ch[1 + (k * 2) % (len(ch) - 1)] + 12
            add(out, t, m4.pluck(n, 0.5, 7.0, 0.3), 0.07 if mood == 'dark' else 0.10, pan=(0.4 if k % 2 else -0.4))
        t += beat / (1 if mood == 'dark' else 1); k += 1
    for h in hits:
        ch = chords[int(h // clen) % len(chords)]; add(out, h, m4.bell(ch[-1] + 12, 2.6), 0.10); add(out, h, m4.boom(1.6, 0.6), 0.10)
    if final:
        add(out, max(0, final - 2.2), m4.riser(max(0, final - 2.2), final), 0.5); add(out, final, m4.boom(2.8, 1.0), 0.30); add(out, final, m4.bell(chords[-1][-1] + 12, 3.0), 0.16)
    add(out, 0, m4.drone(0, DUR - 0.1, [chords[0][0] - 12, chords[0][0] - 5], 0.16, trem=.3))
    out *= np.clip((DUR - np.arange(N) / SR) / .5, 0, 1); out *= np.clip(np.arange(N) / SR / .05, 0, 1)
    return out / (np.max(np.abs(out)) + 1e-9) * 0.9
