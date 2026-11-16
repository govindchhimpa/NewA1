import json,sys,re
D=sys.argv[1]; ch=json.load(open(f'{D}/chunks2.json')); W=[]
for c in ch:
    ws=c['words']; 
    if not ws: continue
    L=[len(w)+1 for w in ws]; tot=sum(L); t=c['t0']; span=c['t1']-c['t0']
    for w,l in zip(ws,L):
        d=span*l/tot; W.append([w,round(t,3),round(t+d,3)]); t+=d
open(f'{D}/../data/words.js','w').write('window.WORDS='+json.dumps(W)+';')
print(len(W),'words')
