# tiles_raw/*.jpg -> tiles/*.jpg : flatten the deep-ocean tone (hides Sentinel-2 granule seams), keep land/reef as is.
import sys, numpy as np, os, glob
from PIL import Image, ImageFilter
Image.MAX_IMAGE_PIXELS=None
OC=np.array([13,40,84],np.float32)
def sstep(x,a,b):
    u=np.clip((x-a)/(b-a),0,1); return u*u*(3-2*u)
def proc(src,dst,sig):
    im=Image.open(src).convert('RGB'); a=np.asarray(im,np.float32)
    h,w=a.shape[:2]
    sm=im.resize((max(8,w//8),max(8,h//8)),Image.BILINEAR).filter(ImageFilter.GaussianBlur(max(1.0,sig/8)))
    bl=np.asarray(sm.resize((w,h),Image.BILINEAR),np.float32)
    m=a.max(2); mb=np.asarray(Image.fromarray(m.astype(np.uint8)).filter(ImageFilter.GaussianBlur(1.5)),np.float32)
    wl=sstep(mb,52,105)[...,None]
    det=a-bl
    ocean=OC+0.55*det
    lift=255*np.power(a/255,0.88)
    out=wl*lift+(1-wl)*ocean
    Image.fromarray(np.clip(out,0,255).astype(np.uint8)).save(dst,quality=93)
SIG={'t0':6,'t1w':30,'t1e':30,'t1mw':40,'t1me':40,'t2w':40,'t2e':40,'t2b':40,'t3a':40,'t3b':40}
only=sys.argv[1:]
for p in sorted(glob.glob('tiles_raw/*.jpg')):
    n=os.path.basename(p)[:-4]
    if n not in SIG or (only and n not in only) or os.path.getsize(p)<30000: continue
    proc(p,'tiles/%s.jpg'%n,SIG[n]); print(n,flush=True)
