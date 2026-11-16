import subprocess,re,sys,os
S='/tmp/claude-0/-home-claude/14c750a2-aab2-5e18-93b2-1808669e00ec/scratchpad/stt'
def sil(f):
    o=subprocess.run(['ffmpeg','-v','info','-i',f,'-af','silencedetect=noise=-35dB:d=0.25','-f','null','-'],capture_output=True,text=True).stderr
    return [float(x) for x in re.findall(r'silence_end: ([\d.]+)',o)]
def dur(f): return float(subprocess.check_output(['ffprobe','-v','error','-show_entries','format=duration','-of','csv=p=0',f]))
f=sys.argv[1]; D=dur(f); ends=sil(f); cuts=[0]
while D-cuts[-1]>27:
    c=[e for e in ends if cuts[-1]+12<e<cuts[-1]+26]
    cuts.append(c[-1] if c else cuts[-1]+25)
cuts.append(D); out=[]
for i in range(len(cuts)-1):
    p=f'/tmp/w_{i}.mp3'
    subprocess.run(['ffmpeg','-v','error','-y','-ss',str(cuts[i]),'-to',str(cuts[i+1]),'-i',f,'-c:a','libmp3lame','-q:a','2',p])
    r=subprocess.run(['python3','-I',f'{S}/run_whisper.py',f'{S}/model-small/sherpa-onnx-whisper-small','small',p,'--int8','--lang','en'],capture_output=True,text=True).stdout.strip().splitlines()
    out.append(r[-1])
print(' '.join(out))
