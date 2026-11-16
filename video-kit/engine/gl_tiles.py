import math, subprocess, json, time, sys, os
# usage: gl_tiles.py <project_dir> '<levels json: [{"name":"L0","always":true,"pieces":[["d0",lo0,la0,lo1,la1,pw],...]},...]>'
R=6378137.0
mx=lambda lon:R*math.radians(lon); my=lambda lat:R*math.log(math.tan(math.pi/4+math.radians(lat)/2))
U='https://tiles.maps.eox.at/wms?service=WMS&request=GetMap&version=1.1.1&layers=s2cloudless-2020_3857&styles=&format=image/jpeg&srs=EPSG:3857'
D=sys.argv[1]; LEVELS=json.loads(sys.argv[2]); os.makedirs(f'{D}/tiles_raw',exist_ok=True); out=[]
for L in LEVELS:
    pcs=[]
    for f,lo0,la0,lo1,la1,pw in L['pieces']:
        x0,x1,y0,y1=mx(lo0),mx(lo1),my(la0),my(la1); ph=int(round(pw*(y1-y0)/(x1-x0))); fn=f'{D}/tiles_raw/{f}.jpg'
        for a in range(4):
            if os.path.exists(fn) and os.path.getsize(fn)>30000: break
            r=subprocess.run(['curl','-sS','-m','280','-o',fn,'-w','%{http_code} %{size_download}',f'{U}&bbox={x0:.1f},{y0:.1f},{x1:.1f},{y1:.1f}&width={pw}&height={ph}'],capture_output=True,text=True)
            print(f,pw,ph,r.stdout,r.stderr[:100],flush=True); time.sleep(2)
        pcs.append({'file':f,'bb':[lo0,la0,lo1,la1],'w':pw,'h':ph})
    out.append({'name':L['name'],'always':bool(L.get('always')),'pieces':pcs,'bb':[min(p['bb'][0] for p in pcs),min(p['bb'][1] for p in pcs),max(p['bb'][2] for p in pcs),max(p['bb'][3] for p in pcs)]})
json.dump(out,open(f'{D}/data/tiers.json','w')); open(f'{D}/data/tiers.js','w').write('window.TIERS='+json.dumps(out)+';'); print('done',D)
