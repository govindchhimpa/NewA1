#!/usr/bin/env python3
"""usage: make_detail.py lon0,lat0,lon1,lat1  -> data/world.js (10m countries in bbox) + data/detail.js (rivers, lakes, cities, admin1)
Natural Earth 10m vectors from /home/claude/ne (public domain)."""
import sys, json, os
x0, y0, x1, y1 = map(float, sys.argv[1].split(','))
NE = '/home/claude/ne'; OUT = os.path.join(os.path.dirname(__file__), '..', 'data')
def load(n): return json.load(open(f'{NE}/{n}.geojson'))['features']
def inb(pts): 
    lo = [p[0] for p in pts]; la = [p[1] for p in pts]
    return not (max(lo) < x0 or min(lo) > x1 or max(la) < y0 or min(la) > y1)
def dec(pts, e=0.004):
    o = [pts[0]]
    for p in pts[1:-1]:
        if abs(p[0]-o[-1][0]) + abs(p[1]-o[-1][1]) >= e: o.append(p)
    o.append(pts[-1]); return [[round(p[0], 4), round(p[1], 4)] for p in o]
def rings(g):
    if g['type'] == 'Polygon': return [g['coordinates'][0]]
    if g['type'] == 'MultiPolygon': return [p[0] for p in g['coordinates']]
    return []
def lines(g):
    if g['type'] == 'LineString': return [g['coordinates']]
    if g['type'] == 'MultiLineString': return g['coordinates']
    return []
world = []
for f in load('ne_10m_admin_0_countries'):
    r = [dec(x) for x in rings(f['geometry']) if inb(x) and len(x) > 3]
    if r: world.append({'n': f['properties']['NAME'], 'r': r})
open(f'{OUT}/world.js', 'w').write('window.WORLD=' + json.dumps(world, separators=(',', ':')) + ';')
riv = []
for f in load('ne_10m_rivers_lake_centerlines'):
    for l in lines(f['geometry']):
        if len(l) > 1 and inb(l): riv.append([f['properties'].get('scalerank') or 8, dec(l), f['properties'].get('name') or ''])
lak = []
for f in load('ne_10m_lakes'):
    for x in rings(f['geometry']):
        if inb(x): lak.append(dec(x))
cit = []
for f in load('ne_10m_populated_places_simple'):
    p = f['properties']; lo, la = f['geometry']['coordinates']
    if x0 <= lo <= x1 and y0 <= la <= y1: cit.append([round(lo, 3), round(la, 3), p['name'], p.get('pop_max') or 0])
adm = []
for f in load('ne_10m_admin_1_states_provinces'):
    for x in rings(f['geometry']):
        if inb(x) and len(x) > 3: adm.append(dec(x, 0.01))
open(f'{OUT}/detail.js', 'w').write('window.DETAIL=' + json.dumps({'rivers': riv, 'lakes': lak, 'cities': cit, 'admin1': adm}, separators=(',', ':'), ensure_ascii=False) + ';')
print('countries', len(world), 'rivers', len(riv), 'lakes', len(lak), 'cities', len(cit), 'admin1', len(adm))
