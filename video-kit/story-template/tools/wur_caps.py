#!/usr/bin/env python3
"""usage: wur_caps.py PROJECT  -> data/caps.js with 1-2 word captions (pair if combined <=11 chars and no punctuation break), times proportional to characters, +0.2 offset."""
import sys, json, re
P = sys.argv[1]; OFF = 0.2
ch = json.load(open(f'{P}/audio_src/chunks2.json'))
caps = []
for c in ch:
    ws = c['words']; t0, t1 = c['t0'], c['t1']
    tot = sum(len(w) + 1 for w in ws); acc = 0; tm = []
    for w in ws: tm.append((t0 + (t1 - t0) * acc / tot, t0 + (t1 - t0) * (acc + len(w) + 1) / tot)); acc += len(w) + 1
    i = 0
    while i < len(ws):
        if i + 1 < len(ws) and not re.search(r'[.,:;?!]$', ws[i]) and len(ws[i]) + len(ws[i + 1]) + 1 <= 11:
            caps.append([tm[i][0], tm[i + 1][1], ws[i] + ' ' + ws[i + 1]]); i += 2
        else: caps.append([tm[i][0], tm[i][1], ws[i]]); i += 1
for k in range(len(caps) - 1):
    if caps[k][1] < caps[k + 1][0] and caps[k + 1][0] - caps[k][1] < 0.3: caps[k][1] = caps[k + 1][0]
out = [[round(a + OFF, 3), round(b + OFF, 3), t] for a, b, t in caps]
open(f'{P}/data/caps.js', 'w').write('window.CAPS=' + json.dumps(out, ensure_ascii=False) + ';')
print(len(out), 'caps')
