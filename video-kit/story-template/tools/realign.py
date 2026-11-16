#!/usr/bin/env python3
"""usage: realign.py AUDIO_DIR  -- redo the script<->chunk assignment from the saved whisper text, spelling digits out first (years!)."""
import sys, json, re, difflib
D = sys.argv[1]
ch = json.load(open(f'{D}/chunks2.json')); wh = [c['wh'] for c in ch]; ts = [(c['t0'], c['t1']) for c in ch]
ONES = 'zero one two three four five six seven eight nine ten eleven twelve thirteen fourteen fifteen sixteen seventeen eighteen nineteen'.split()
TENS = '_ _ twenty thirty forty fifty sixty seventy eighty ninety'.split()
def n2w(n):
    if n < 20: return ONES[n]
    if n < 100: return TENS[n//10] + ('' if n % 10 == 0 else ' ' + ONES[n % 10])
    if n < 1000: return ONES[n//100] + ' hundred' + ('' if n % 100 == 0 else ' ' + n2w(n % 100))
    return n2w(n//1000) + ' thousand' + ('' if n % 1000 == 0 else ' ' + n2w(n % 1000))
def year(y):
    a, b = divmod(y, 100)
    if b == 0: return n2w(a) + ' hundred'
    return n2w(a) + ' ' + (('oh ' + ONES[b]) if b < 10 else n2w(b))
def expand(tok):
    m = re.fullmatch(r'(\d+)(s?)(\W*)', tok)
    if not m: return tok
    n = int(m.group(1)); s = m.group(2)
    if len(m.group(1)) == 4 and 1000 <= n < 2100: return (year(n) + ('s' if s else '')) if n % 100 else year(n) + ('s' if s else '')
    if s and n % 100 == 0: return n2w(n//100) + ' hundreds'
    return n2w(n)
wh2 = [' '.join(expand(t) for t in w.split()) for w in wh]
script = open(f'{D}/script.txt').read().split()
norm = lambda t: re.sub(r'[^a-z0-9]', '', t.lower().replace('ö', 'o').replace('í', 'i'))
Sn = [norm(t) for t in script]
flat = []; own = []
for i, t in enumerate(wh2):
    for t2 in t.split(): flat.append(norm(t2)); own.append(i)
idx = [None] * len(flat)
for a, b, k in difflib.SequenceMatcher(None, Sn, flat, autojunk=False).get_matching_blocks():
    for j in range(k): idx[b + j] = a + j
last = [-1] * len(wh2)
for j, i in enumerate(own):
    if idx[j] is not None: last[i] = max(last[i], idx[j])
bounds = [0]; prev = 0
for i in range(len(wh2) - 1):
    b = max(last[i] + 1 if last[i] >= 0 else prev, prev); bounds.append(b); prev = b
bounds.append(len(script))
out = [{'t0': ts[i][0], 't1': ts[i][1], 'words': script[bounds[i]:bounds[i + 1]], 'wh': wh[i]} for i in range(len(ch))]
json.dump(out, open(f'{D}/chunks2.json', 'w'))
for i in [0, 1, 9, 10, 38, 39, 48, 49, 60, 61, 62, 97, 98, 113, 114]:
    if i < len(out): print(i, round(out[i]['t0'], 2), round(out[i]['t1'], 2), ' '.join(out[i]['words']), '||', out[i]['wh'])
print('assigned', sum(len(o['words']) for o in out), 'of', len(script))
