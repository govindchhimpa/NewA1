#!/usr/bin/env python3
"""Whisper (sherpa-onnx export) greedy transcriber using only numpy + onnxruntime.
usage: run_whisper.py MODEL_DIR PREFIX AUDIO_OR_VIDEO [--lang xx] [--int8]
"""
import base64, subprocess, sys
import numpy as np
import onnxruntime as ort

model_dir, prefix, media = sys.argv[1:4]
force_lang = sys.argv[sys.argv.index("--lang") + 1] if "--lang" in sys.argv else None
suffix = ".int8.onnx" if "--int8" in sys.argv else ".onnx"

SR, N_FFT, HOP, N_MELS = 16000, 400, 160, 80

def load_audio(path):
    raw = subprocess.run(
        ["ffmpeg", "-v", "error", "-i", path, "-vn", "-ac", "1", "-ar", str(SR), "-f", "f32le", "-"],
        check=True, capture_output=True).stdout
    return np.frombuffer(raw, dtype=np.float32)

def hz_to_mel(f):  # slaney
    f = np.asarray(f, dtype=np.float64)
    lin = f / (200.0 / 3)
    logstep = np.log(6.4) / 27.0
    return np.where(f >= 1000.0, 15.0 + np.log(np.maximum(f, 1e-9) / 1000.0) / logstep, lin)

def mel_to_hz(m):
    m = np.asarray(m, dtype=np.float64)
    logstep = np.log(6.4) / 27.0
    return np.where(m >= 15.0, 1000.0 * np.exp(logstep * (m - 15.0)), m * (200.0 / 3))

def mel_filters():
    fft_freqs = np.linspace(0, SR / 2, N_FFT // 2 + 1)
    mel_pts = np.linspace(hz_to_mel(0.0), hz_to_mel(SR / 2), N_MELS + 2)
    hz = mel_to_hz(mel_pts)
    fb = np.zeros((N_MELS, N_FFT // 2 + 1))
    for i in range(N_MELS):
        lo, ce, hi = hz[i], hz[i + 1], hz[i + 2]
        up = (fft_freqs - lo) / (ce - lo)
        dn = (hi - fft_freqs) / (hi - ce)
        fb[i] = np.maximum(0, np.minimum(up, dn)) * (2.0 / (hi - lo))  # slaney norm
    return fb.astype(np.float32)

def log_mel(audio):
    audio = np.pad(audio[: 30 * SR], (0, max(0, 30 * SR - len(audio))))
    x = np.pad(audio, (N_FFT // 2, N_FFT // 2), mode="reflect")
    win = np.hanning(N_FFT + 1)[:-1].astype(np.float32)
    n = 1 + (len(x) - N_FFT) // HOP
    idx = np.arange(N_FFT)[None, :] + HOP * np.arange(n)[:, None]
    spec = np.abs(np.fft.rfft(x[idx] * win, axis=1)) ** 2
    spec = spec[:-1].T  # drop last frame -> 3000
    mel = mel_filters() @ spec.astype(np.float32)
    lm = np.log10(np.maximum(mel, 1e-10))
    lm = np.maximum(lm, lm.max() - 8.0)
    return ((lm + 4.0) / 4.0).astype(np.float32)

def load_tokens(path):
    t = {}
    for line in open(path, encoding="utf-8"):
        parts = line.rstrip("\n").split(" ")
        if len(parts) >= 2:
            t[int(parts[-1])] = base64.b64decode(parts[0])
    return t

opts = ort.SessionOptions()
opts.intra_op_num_threads = 2
enc = ort.InferenceSession(f"{model_dir}/{prefix}-encoder{suffix}", opts, providers=["CPUExecutionProvider"])
dec = ort.InferenceSession(f"{model_dir}/{prefix}-decoder{suffix}", opts, providers=["CPUExecutionProvider"])
meta = enc.get_modelmeta().custom_metadata_map
sot, eot = int(meta["sot"]), int(meta["eot"])
transcribe, no_ts = int(meta["transcribe"]), int(meta["no_timestamps"])
langs = meta["all_language_codes"].split(",")
lang_ids = [int(v) for v in meta["all_language_tokens"].split(",")]
n_layer, n_state, n_ctx = int(meta["n_text_layer"]), int(meta["n_text_state"]), int(meta["n_text_ctx"])
tokens_txt = load_tokens(f"{model_dir}/{prefix}-tokens.txt")
nonspeech = [int(v) for v in meta["non_speech_tokens"].split(",")]

audio = load_audio(media)
print(f"audio: {len(audio)/SR:.2f}s, peak {np.abs(audio).max():.3f}", file=sys.stderr)
mel = log_mel(audio)[None]
ck, cv = enc.run(None, {"mel": mel})

def new_cache():
    return np.zeros((n_layer, 1, n_ctx, n_state), np.float32)

def step(tok, kc, vc, offset):
    return dec.run(None, {
        "tokens": np.array([tok], np.int64), "in_n_layer_self_k_cache": kc, "in_n_layer_self_v_cache": vc,
        "n_layer_cross_k": ck, "n_layer_cross_v": cv, "offset": np.array([offset], np.int64)})

# language detection
logits, _, _ = step([sot], new_cache(), new_cache(), 0)
ll = logits[0, -1, lang_ids]
p = np.exp(ll - ll.max()); p /= p.sum()
order = np.argsort(-p)[:4]
print("language guess:", [(langs[i], round(float(p[i]), 3)) for i in order], file=sys.stderr)
lang_tok = lang_ids[langs.index(force_lang)] if force_lang else lang_ids[int(order[0])]
print("using language:", langs[lang_ids.index(lang_tok)], file=sys.stderr)

prompt = [sot, lang_tok, transcribe, no_ts]
kc, vc = new_cache(), new_cache()
logits, kc, vc = step(prompt, kc, vc, 0)
offset = len(prompt)
out = []
for _ in range(200):
    l = logits[0, -1].copy()
    l[nonspeech] = -1e9
    l[sot:eot] = -1e9      # block special/control tokens below eot
    l[eot + 1:] = -1e9     # block language/task/timestamp tokens
    nxt = int(np.argmax(l))
    if nxt == eot:
        break
    out.append(nxt)
    logits, kc, vc = step([nxt], kc, vc, offset)
    offset += 1
text = b"".join(tokens_txt.get(t, b"") for t in out).decode("utf-8", errors="replace").strip()
print(text)
