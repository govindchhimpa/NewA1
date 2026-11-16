#!/usr/bin/env python3
"""QA a rendered video. usage: python3 tools/qa.py [video] ; writes out/qa/sheet.png and out/qa/report.txt"""
import sys, os, cv2, numpy as np
from PIL import Image
v = sys.argv[1] if len(sys.argv) > 1 else 'out/video_silent.mp4'
os.makedirs('out/qa', exist_ok=True)
cap = cv2.VideoCapture(v)
fps = cap.get(cv2.CAP_PROP_FPS) or 30
n = int(cap.get(cv2.CAP_PROP_FRAME_COUNT)); w = int(cap.get(3)); h = int(cap.get(4))
small, means, diffs = [], [], [0.0]
prev = None
while True:
    ok, f = cap.read()
    if not ok: break
    s = cv2.resize(f, (108, 192), interpolation=cv2.INTER_AREA)
    small.append(f if False else s); g = s.astype(np.float32)
    means.append(g.mean())
    if prev is not None: diffs.append(float(np.abs(g - prev).mean()))
    prev = g
n = len(small); diffs = np.array(diffs); means = np.array(means)
R = [f'file: {v}', f'resolution: {w}x{h}  fps: {fps:.3f}  frames: {n}  duration: {n/fps:.3f}s']
R.append('OK resolution' if (w, h) == (1080, 1920) else 'WARN resolution not 1080x1920')
blk = [i for i in range(n) if means[i] < 6]; wht = [i for i in range(n) if means[i] > 249]
def spans(idx):
    out = []
    for i in idx:
        if out and i == out[-1][1] + 1: out[-1][1] = i
        else: out.append([i, i])
    return out
R.append('black frames: ' + (', '.join(f'{a}-{b}' for a, b in spans(blk)) or 'none'))
R.append('white frames: ' + (', '.join(f'{a}-{b}' for a, b in spans(wht)) or 'none (a brief flash at ~25.0s is expected)'))
frz = spans([i for i in range(1, n) if diffs[i] < 0.02]); lim = int(0.5 * fps)
R.append('frozen spans >0.5s: ' + (', '.join(f'{a/fps:.2f}-{(b+1)/fps:.2f}s{" (end card, ok)" if a/fps >= 28 else ""}' for a, b in frz if b - a + 1 > lim) or 'none'))
tw = [(b - 0.2, b + 0.2) for b in (3, 7, 12, 16, 21, 25)]
med = np.median(diffs[1:]) if n > 1 else 0; thr = max(6.0, 4 * med)
pops = [i for i in range(1, n) if diffs[i] > thr and not any(a - 1/fps <= i/fps <= b + 1/fps for a, b in tw)]
R.append(f'pops (diff>{thr:.1f}, outside transitions): ' + (', '.join(f'f{i}({i/fps:.2f}s, {diffs[i]:.1f})' for i in pops) or 'none'))
R.append(f'diff mean {diffs.mean():.2f} max {diffs.max():.2f} at f{int(diffs.argmax())}')
open('out/qa/report.txt', 'w').write('\n'.join(R) + '\n'); print('\n'.join(R))
cap.release()
# sheet of 24 evenly spaced frames from the file (full-res read)
cap = cv2.VideoCapture(v); idx = np.linspace(0, max(n - 1, 0), 24).astype(int); th = []
for i in idx:
    cap.set(cv2.CAP_PROP_POS_FRAMES, int(i)); ok, f = cap.read()
    if not ok: f = np.zeros((h, w, 3), np.uint8)
    t = cv2.resize(f, (180, 320), interpolation=cv2.INTER_AREA)
    cv2.putText(t, f'{i/fps:.2f}s', (6, 20), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 255, 255), 2); th.append(t)
rows = [np.hstack(th[r*8:(r+1)*8]) for r in range(3)]
Image.fromarray(cv2.cvtColor(np.vstack(rows), cv2.COLOR_BGR2RGB)).save('out/qa/sheet.png'); print('wrote out/qa/sheet.png')
