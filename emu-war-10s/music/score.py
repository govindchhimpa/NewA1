"""score.py — original 10 s hot-band score for "The Great Emu War" (120 BPM, beat = 0.5 s).
Upright piano, tuba, muted trumpet, clarinet, trombone, snare, cymbal (VSCO 2 CE / VCSL samples via core/audio/sampler.py),
banjo via core/audio/pluck.py. Writes music/score.wav (48 kHz stereo).
Run from the library root:  .venv/bin/python <project>/music/score.py"""
import os, sys
import numpy as np, soundfile as sf
LIB = os.environ.get('LIB') or os.getcwd()
sys.path.insert(0, LIB)
from core.audio import sampler as S, pluck as PL
from core.audio.sfx import SR, add
HERE = os.path.dirname(os.path.abspath(__file__))
DUR = 10.0
S.seed(1932)
B = 0.5
ev = []
def n(t, inst, p, d, v, pan=0.0, g=1.0): ev.append((t, inst, p, d, v, pan, g))

# —— harmony: bar 1 F6, bar 2 D7, bar 3a G7 (band stops at 5.6), 6.5–7.75 C7, 9.0 button F6 ——
BARS = [(0.0, ('F2', 'C3'), ['A3', 'D4', 'F4']), (2.0, ('D2', 'A2'), ['F#3', 'C4', 'D4']), (4.0, ('G2', 'D3'), ['F3', 'B3', 'D4'])]
STOP = 5.6
for t0, bass, chord in BARS:
    for k in range(4):
        t = t0 + k * B
        if t >= STOP: break
        if k % 2 == 0:       # stride: bass on 1 and 3 (piano + tuba oom)
            n(t, 'upright', bass[(k // 2) % 2], .32, .62, -.25)
            n(t, 'tuba_stac', bass[(k // 2) % 2], .3, .7, -.1)
        else:                # chord on 2 and 4 (piano pah + banjo + brushed snare)
            for p in chord: n(t, 'upright', p, .22, .5, .15)
            n(t, 'snare', 'off', None, .32, .2)

# —— muted trumpet: an original syncopated two-bar figure, then it answers the gun ——
MEL = [(0.0, 'F4', .25), (0.25, 'A4', .25), (0.5, 'C5', .375), (0.875, 'D5', .125), (1.0, 'C5', .5), (1.5, 'A4', .45),
       (2.0, 'F#4', .25), (2.25, 'A4', .25), (2.5, 'C5', .375), (2.875, 'D5', .125), (3.0, 'D#5', .5), (3.5, 'D5', .45),
       (4.0, 'B4', .25), (4.25, 'D5', .22), (5.25, 'G5', .18), (5.4, 'F5', .15)]
for t, p, d in MEL: n(t, 'trumpet_mute', p, d, .72, .3)

# —— the three shots: tutti stabs with the snare ——
for t in (4.5, 4.75, 5.0):
    n(t, 'snare', 'on', None, .95, 0)
    for p in ['F3', 'B3', 'D4']: n(t, 'trombone_stac', p, .16, .7, -.3)
    n(t, 'tuba_stac', 'G2', .16, .8, -.1)
n(5.5, 'sus_cymbal', 'stick', None, .5, .3)

# —— the emu: sneaky clarinet chromatic line over a C7 ——
for i, p in enumerate(['G4', 'F#4', 'F4', 'E4', 'D#4', 'E4']): n(6.5 + i * .125, 'clarinet', p, .12, .6, .25)
for p in ['E3', 'A#3', 'C4']: n(6.5, 'upright', p, .9, .32, .1)
n(6.5, 'tuba', 'C2', .9, .42, -.1)
n(T_HONK := 7.25, 'trombone', 'A#1', .42, 1.0, -.2)   # the raspberry under the honk

# —— the end card: a piano run up, a hush, then the button ——
for i, p in enumerate(['F3', 'A3', 'C4', 'F4', 'A4', 'C5', 'F5', 'A5']): n(7.75 + i * .0625, 'upright', p, .2, .55 + i * .03, .1)
n(8.5, 'xylophone', 'C6', .2, .6, .3)
n(8.625, 'xylophone', 'F6', .3, .6, .3)
BT = 9.0
for p in ['F2', 'C3']: n(BT, 'upright', p, .9, .75, -.2)
for p in ['A3', 'D4', 'F4', 'A4']: n(BT, 'upright', p, .9, .7, .15)
n(BT, 'tuba', 'F2', .8, .9, -.1)
n(BT, 'trumpet_mute', 'F5', .7, .85, .3)
n(BT, 'clarinet', 'A5', .7, .55, .25)
n(BT, 'crash', None, None, .55, 0)

events = [e[:7] for e in ev]
mix = S.render(events, dur=DUR + .5)
# banjo on 2 & 4 (plucked model)
for t0, bass, chord in BARS:
    for k in (1, 3):
        t = t0 + k * B
        if t >= STOP: continue
        x = PL.strum('banjo', [S.name(S.midi(p) + 12) for p in chord], .3, vel=.55, spread=.012)
        add(mix, x, t, .5, -.35)
x = PL.strum('banjo', ['F4', 'A4', 'C5', 'F5'], .6, vel=.7, spread=.01); add(mix, x, BT, .55, -.35)
mix = S.room(mix, size=.25, mix=.12)
# hard band stop (reverb tails too) and nothing before the clarinet
a, b = int(STOP * SR), int(6.5 * SR)
fade = int(.01 * SR); mix[a:a + fade] *= np.linspace(1, 0, fade)[:, None]; mix[a + fade:b] = 0
mix = mix[:int(DUR * SR)]
mix = mix / max(1e-9, np.abs(mix).max()) * .9
os.makedirs(HERE, exist_ok=True)
sf.write(os.path.join(HERE, 'score.wav'), mix.astype(np.float32), SR)
used = sorted({e[1] for e in ev})
open(os.path.join(HERE, 'instruments.txt'), 'w').write('\n'.join(used + ['banjo (pluck.py)']) + '\n')
print('score.wav', round(len(mix) / SR, 2), 's; instruments:', used)
