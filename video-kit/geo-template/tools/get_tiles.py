import math, subprocess, json, time, sys, os
R=6378137.0
mx=lambda lon:R*math.radians(lon); my=lambda lat:R*math.log(math.tan(math.pi/4+math.radians(lat)/2))
U='https://tiles.maps.eox.at/wms?service=WMS&request=GetMap&version=1.1.1&layers=s2cloudless-2020_3857&styles=&format=image/jpeg&srs=EPSG:3857'
# Darvaza gas crater 40.2527N 58.4396E
LEVELS=[
 {'name':'L0','always':True,'pieces':[('d0',25,18,90,62,4000,0)]},
 {'name':'L1','pieces':[('d1',49,34,68,44.5,3600,0)]},
 {'name':'L2','pieces':[('d2',56.2,38.6,60.7,41.9,3400,0)]},
 {'name':'L3','pieces':[('d3',57.9,39.8,58.98,40.7,3400,0)]},
 {'name':'L4','pieces':[('d4',58.39,40.215,58.49,40.29,2600,0)]},
]
only=sys.argv[1:]; out=[]
for L in LEVELS:
    pcs=[]
    for f,lo0,la0,lo1,la1,pw,off in L['pieces']:
        x0,x1,y0,y1=mx(lo0),mx(lo1),my(la0),my(la1); ph=int(round(pw*(y1-y0)/(x1-x0)))
        have=os.path.exists(f'tiles_raw/{f}.jpg') and os.path.getsize(f'tiles_raw/{f}.jpg')>30000
        if (f in only) or (not only and not have):
            for a in range(3):
                r=subprocess.run(['curl','-sS','-m','280','-o',f'tiles_raw/{f}.jpg','-w','%{http_code} %{size_download}',f'{U}&bbox={x0:.1f},{y0:.1f},{x1:.1f},{y1:.1f}&width={pw}&height={ph}'],capture_output=True,text=True)
                print(f,pw,ph,r.stdout,r.stderr[:100],flush=True)
                if r.stdout.startswith('200') and int(r.stdout.split()[1])>30000: break
                time.sleep(3)
        pcs.append({'file':f,'bb':[lo0+off,la0,lo1+off,la1],'w':pw,'h':ph})
    out.append({'name':L['name'],'always':bool(L.get('always')),'pieces':pcs,'bb':[min(p['bb'][0] for p in pcs),min(p['bb'][1] for p in pcs),max(p['bb'][2] for p in pcs),max(p['bb'][3] for p in pcs)]})
json.dump(out,open('data/tiers.json','w'))
open('data/tiers.js','w').write('window.TIERS='+json.dumps(out)+';')
print('done')
