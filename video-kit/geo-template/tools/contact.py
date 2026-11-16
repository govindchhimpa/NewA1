#!/usr/bin/env python3
"""Contact sheet of several stills so you can check a scene in one look.
usage: python3 tools/contact.py out/sheet.png still1.png still2.png ... [--cols 4]
Each frame is shrunk to 270x480 and labelled with its file name."""
import sys
from PIL import Image, ImageDraw

args = sys.argv[1:]
cols = 4
if '--cols' in args:
    i = args.index('--cols'); cols = int(args[i + 1]); del args[i:i + 2]
out, files = args[0], args[1:]
tw, th, pad = 270, 480, 8
rows = (len(files) + cols - 1) // cols
sheet = Image.new('RGB', (cols * (tw + pad) + pad, rows * (th + pad + 18) + pad), (30, 30, 34))
d = ImageDraw.Draw(sheet)
for n, f in enumerate(files):
    im = Image.open(f).convert('RGB').resize((tw, th), Image.LANCZOS)
    x = pad + (n % cols) * (tw + pad); y = pad + (n // cols) * (th + pad + 18)
    sheet.paste(im, (x, y + 16)); d.text((x, y), f.split('/')[-1], fill=(220, 220, 220))
sheet.save(out); print(out)
