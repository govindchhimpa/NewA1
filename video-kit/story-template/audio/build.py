#!/usr/bin/env python3
"""Render out/audio.wav (44.1k stereo, 10.000 s) from out/cues.json. Run from anywhere."""
import json, os, sys, wave
import numpy as np
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import sfx, music_new as music
SR = 44100; DUR = 30.6; N = int(SR * DUR)
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MUSIC_GAIN = 0.3; SFX_GAIN = 0.4; DUCK = 0.35; VOICE_GAIN = 1.35; VDUCK = 0.5
VLIB='/home/claude/story-lemaitre/audio_src'

def load_cues():
    p = sys.argv[1] if len(sys.argv) > 1 else os.path.join(ROOT, 'out', 'cues.json')
    try:
        c = json.load(open(p))
        return c if isinstance(c, list) else []
    except Exception as e:
        print('WARN: no usable cues.json (%s); music only' % e); return []

def main():
    cues = load_cues()
    bed = music.render().astype(np.float64) * MUSIC_GAIN
    bus = np.zeros((2, N)); duck = np.zeros(N)
    pan_i = 0; used = 0
    voice = np.zeros(N)
    for c in [c for c in cues if c.get('name') == 'voice']:
        with wave.open(os.path.join(VLIB, c['file'] + '.wav')) as w:
            v = np.frombuffer(w.readframes(w.getnframes()), '<i2').astype(np.float64) / 32768
        i = int(round(float(c['t']) * SR)); v = v[:N - i]; voice[i:i + len(v)] += v * VOICE_GAIN
    cues = [c for c in cues if c.get('name') != 'voice']
    for c in cues:
        name = c.get('name'); fn = sfx.CUES.get(name)
        if fn is None: print('WARN: unknown cue %r at %s, skipped' % (name, c.get('t'))); continue
        t = float(c.get('t', 0)); vol = float(c.get('vol', 1)); d = c.get('dur') or None
        if t < 0 or t >= DUR: print('WARN: cue %s at %.2f outside timeline' % (name, t)); continue
        s = fn(vol, d).astype(np.float64)
        i = int(round(t * SR)); s = s[:N - i]
        pan = {'whoosh': 0, 'tick': .15, 'type': -.1, 'sparkle': .1}.get(name, 0) + (0.12 if pan_i % 2 else -0.12)
        pan_i += 1
        bus[0, i:i + len(s)] += s * np.cos((pan + 1) * np.pi / 4) * 1.41
        bus[1, i:i + len(s)] += s * np.sin((pan + 1) * np.pi / 4) * 1.41
        if name not in ('tick', 'type', 'crickets', 'birds', 'room', 'crowd', 'applause', 'pen', 'chalk', 'flip', 'shutter', 'swish', 'heartbeat'):
            # duck: fast attack, ~250 ms release
            L = int(.4 * SR); k = np.arange(L) / SR
            shape = np.minimum(1, k / .008) * np.exp(-k / .12)
            amt = DUCK * min(1, vol) * (1.3 if name in ('thud', 'swell', 'riser') else 1)
            seg = shape[:max(0, N - i)]
            duck[i:i + len(seg)] = np.maximum(duck[i:i + len(seg)], amt * seg)
        used += 1
    # sidechain: music + sfx duck under the voice (smoothed envelope)
    from scipy.ndimage import uniform_filter1d as _uf
    env = _uf(np.abs(voice), int(.06 * SR))
    env = np.minimum(1, env * 6); env = _uf(env, int(.15 * SR))
    vd = 1 - VDUCK * np.minimum(1, env)
    mix = (bed * (1 - duck) + bus * SFX_GAIN) * vd
    mix[0] += voice; mix[1] += voice
    # limiter: soft knee then hard ceiling at -1.5 dBFS
    mix = np.tanh(mix * 1.1) / np.tanh(1.1) * .98
    ceil = 10 ** (-1.5 / 20)
    pk = np.max(np.abs(mix))
    if pk > ceil: mix *= ceil / pk
    # end fades
    fi = int(.01 * SR); fo = int(.15 * SR)
    mix[:, :fi] *= np.linspace(0, 1, fi); mix[:, -fo:] *= np.linspace(1, 0, fo)
    out = sys.argv[2] if len(sys.argv) > 2 else os.path.join(ROOT, 'out', 'audio.wav'); os.makedirs(os.path.dirname(out), exist_ok=True)
    pcm = (np.clip(mix, -1, 1).T * 32767).astype('<i2')
    with wave.open(out, 'wb') as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(pcm.tobytes())
    pk = np.max(np.abs(mix)); rms = np.sqrt(np.mean(mix ** 2))
    print('cues rendered: %d/%d' % (used, len(cues)))
    print('wrote %s  %.3f s  peak %.2f dBFS  RMS %.2f dBFS' % (out, pcm.shape[0] / SR, 20 * np.log10(pk), 20 * np.log10(rms)))

if __name__ == '__main__': main()
