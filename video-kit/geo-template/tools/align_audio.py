#!/usr/bin/env python3
"""usage: align_audio.py AUDIO_DIR   (needs AUDIO_DIR/voice.mp3 + AUDIO_DIR/script.txt)
Makes: chunks2.json (speech chunks with script words), ../data/caps.js (3-word karaoke lines, voice offset OFF), voice.wav (44.1k mono).
Steps: pause detection -> Whisper per chunk -> difflib alignment of Whisper words to script words."""
import sys, os, json, re, subprocess, difflib, math
import numpy as np
D = sys.argv[1]; OFF = 0.2
S = '/tmp/claude-0/-home-claude/14c750a2-aab2-5e18-93b2-1808669e00ec/scratchpad/stt'
sh = lambda *a: subprocess.run(a, capture_output=True, text=True)
subprocess.run(['ffmpeg','-y','-v','error','-i',f'{D}/voice.mp3','-ar','16000','-ac','1',f'{D}/v16.wav'])
subprocess.run(['ffmpeg','-y','-v','error','-i',f'{D}/voice.mp3','-ar','44100','-ac','1','-c:a','pcm_s16le',f'{D}/voice.wav'])
raw = subprocess.run(['ffmpeg','-v','error','-i',f'{D}/v16.wav','-f','s16le','-'],capture_output=True).stdout
x = np.frombuffer(raw, dtype=np.int16).astype(float)/32768
w = 80; n = len(x)//w
db = 20*np.log10(np.sqrt((x[:n*w].reshape(n,w)**2).mean(1))+1e-9)
q = db < -50; pauses = []; s = None
for i, v in enumerate(q):
    if v and s is None: s = i
    if not v and s is not None:
        if i-s >= 24: pauses.append((s*.005, i*.005))
        s = None
tot = n*.005
edges = [0]+[p for pa in pauses for p in pa]+[tot]
chunks = [(edges[i], edges[i+1]) for i in range(0, len(edges), 2) if edges[i+1]-edges[i] > 0.15]
print(len(chunks), 'chunks, audio', round(tot, 2), 's')
wh = []
for i, (a, b) in enumerate(chunks):
    subprocess.run(['ffmpeg','-y','-v','error','-ss',str(a),'-to',str(b),'-i',f'{D}/v16.wav',f'{D}/c.wav'])
    r = sh('python3','-I',f'{S}/run_whisper.py',f'{S}/model-small/sherpa-onnx-whisper-small','small',f'{D}/c.wav','--int8','--lang','en')
    wh.append(r.stdout.strip().splitlines()[-1] if r.stdout.strip() else '')
script = open(f'{D}/script.txt').read().split()
norm = lambda t: re.sub(r'[^a-z0-9]', '', t.lower().replace('ö','o').replace('í','i'))
Sn = [norm(t) for t in script]
flat = []; own = []
for i, t in enumerate(wh):
    for t2 in t.split(): flat.append(norm(t2)); own.append(i)
idx = [None]*len(flat)
for a, b, k in difflib.SequenceMatcher(None, Sn, flat, autojunk=False).get_matching_blocks():
    for j in range(k): idx[b+j] = a+j
last = [-1]*len(wh)
for j, i in enumerate(own):
    if idx[j] is not None: last[i] = max(last[i], idx[j])
bounds = [0]; prev = 0
for i in range(len(wh)-1):
    b = max(last[i]+1 if last[i] >= 0 else prev, prev); bounds.append(b); prev = b
bounds.append(len(script))
out = [{'t0': round(a,3), 't1': round(b,3), 'words': script[bounds[i]:bounds[i+1]], 'wh': wh[i]} for i, (a, b) in enumerate(chunks)]
json.dump(out, open(f'{D}/chunks2.json', 'w'))
for i, o in enumerate(out): print(i, o['t0'], o['t1'], ' '.join(o['words']), '||', o['wh'])
groups = []
for c in out:
    nw = len(c['words'])
    if groups and (nw < 3 or len(groups[-1]['w']) < 3) and c['t0']-groups[-1]['t1'] < 0.7:
        groups[-1]['w'] += c['words']; groups[-1]['t1'] = c['t1']
    else: groups.append({'t0': c['t0'], 't1': c['t1'], 'w': list(c['words'])})
caps = []
for g in groups:
    lines = []; cur = []
    for t2 in g['w']:
        if cur and (len(cur) >= 3 or len(' '.join(cur+[t2])) > 17): lines.append(cur); cur = []
        cur.append(t2)
    if cur: lines.append(cur)
    ch = [sum(len(z)+1 for z in l) for l in lines]; tt = sum(ch); t = g['t0']
    for l, cc in zip(lines, ch):
        d = (g['t1']-g['t0'])*cc/tt; caps.append([t+OFF, t+d+OFF, ' '.join(l)]); t += d
for i in range(len(caps)-1):
    gap = caps[i+1][0]-caps[i][1]
    caps[i][1] = caps[i+1][0] if gap < 0.8 else caps[i][1]+0.12
caps[-1][1] += 0.3
open(os.path.join(D, '..', 'data', 'caps.js'), 'w').write('window.CAPS='+json.dumps([[round(a,3), round(b,3), t] for a, b, t in caps])+';')
print('words', len(script), 'assigned', sum(len(o['words']) for o in out), 'caps', len(caps))
