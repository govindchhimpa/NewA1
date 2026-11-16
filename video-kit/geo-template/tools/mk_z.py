# land mask + flood rank from the L3 Sentinel-2 tiles -> data/Z.png  (R=land 0/255, G=flood rank 0..255 (low floods first), B=interior depth)
import numpy as np
from PIL import Image, ImageFilter
from scipy import ndimage as ndi
Image.MAX_IMAGE_PIXELS=None
a=Image.open('tiles_raw/t3a.jpg').convert('RGB'); b=Image.open('tiles_raw/t3b.jpg').convert('RGB')
im=Image.new('RGB',(4000,7416)); im.paste(a,(0,0)); im.paste(b,(0,3707))
im=im.resize((2000,3708),Image.LANCZOS)
x=np.asarray(im,np.float32); R,G,B=x[...,0],x[...,1],x[...,2]
m=x.max(2)
# land: sand/roofs (R high), vegetation (green dominates blue, not cyan), not the cyan reef flat
sand=(R>85)&(R>B*0.8)
veg=(G>B+4)&(G>34)&(R<110)&(G>R+3)
cyan=(B>G*0.95)&(G>110)&(R<90)
land=(sand|veg)&~cyan
land=ndi.binary_opening(land,iterations=1)
land=ndi.binary_closing(land,iterations=1)
lab,n=ndi.label(land); sz=ndi.sum(land,lab,range(1,n+1)); keep=np.zeros(n+1,bool); keep[1:]=sz>=12; land=keep[lab]
d=ndi.distance_transform_edt(land)
rng=np.random.RandomState(7)
def fnoise(s,sig):
    z=rng.rand(*land.shape).astype(np.float32); z=ndi.gaussian_filter(z,sig); z=(z-z.min())/(z.max()-z.min()); return z
nz=0.65*fnoise(0,6)+0.35*fnoise(1,2.2)
nz=(nz-nz.min())/(nz.max()-nz.min())
dn=np.clip(d/7.0,0,1)
rank=0.62*nz+0.38*(1-dn)
rank=(rank-rank[land].min())/(rank[land].max()-rank[land].min()); rank=np.clip(rank,0,1)
out=np.zeros((3708,2000,4),np.uint8)
out[...,0]=land*255; out[...,1]=(rank*255).astype(np.uint8); out[...,2]=(dn*255).astype(np.uint8); out[...,3]=255
Image.fromarray(out).save('data/Z.png',optimize=True)
print('land px',int(land.sum()),'of',land.size)
# preview crop (same region as the earlier crop, at half res)
pv=np.zeros((600,350,3),np.uint8); c=(slice(1175,1775),slice(1125,1475))
pv[...,0]=np.where(land[c],255,0); pv[...,1]=(rank[c]*255*land[c]).astype(np.uint8); pv[...,2]=np.where(land[c],0,60)
Image.fromarray(pv).resize((700,1200),Image.NEAREST).save('out/z_prev.png')
