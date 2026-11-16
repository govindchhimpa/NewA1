import sys, glob
from PIL import Image
d=sys.argv[1]; out=sys.argv[2]; cols=int(sys.argv[3]) if len(sys.argv)>3 else 4
fs=sorted(glob.glob(d+'/s1_t*.png'),key=lambda f:float(f.split('_t')[1][:-4]))
ims=[Image.open(f).convert('RGB').resize((405,720)) for f in fs]
rows=(len(ims)+cols-1)//cols
sh=Image.new('RGB',(405*cols,720*rows))
for i,im in enumerate(ims): sh.paste(im,((i%cols)*405,(i//cols)*720))
sh.save(out,quality=85); print(len(ims),[f.split('_t')[1][:-4] for f in fs])
