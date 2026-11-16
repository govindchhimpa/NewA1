# Video kit handoff (saved 16 Nov 2026)

Everything a new Claude session needs to keep making and posting Govind's Shorts after a memory reset.
No keys, emails, Drive file ids or Zapier connection ids are stored here: this repo is public. Look those up with the connectors.

## Channels
- **Geo Labs (GL)**: satellite-map story Shorts. YouTube `UCwTI_k5jHHxq9fX2rc0dvoQ` (@geojilab). Facebook pages "Geo Labs" `1392638267273489` and "Geoji Labs" `1361327130407162`.
- **Wrong Until Right (WUR)**: 2D story Shorts about scientists who were laughed at and then proved right. YouTube `UCFcRtqg_CovnSGdQe4H_Kiw`. Facebook page `1394655320401319`.
- **Althea Reyes1** Facebook page `1380226821846191`: gets short video clips (not photos) from the shared Drive folder "Althea" > "Video", oldest first, generic caption plus hashtags.

## Standing rules (the owner said these)
1. Never build a video until he says so. A Brian S. mp3, or "bnao", is the go signal. "create" with no audio means: give scripts only.
2. Never post or upload unless he says: "upload" = YouTube only, "upload fb" = Facebook only, "upload fb yt" = both.
3. One video per channel per round. Check the channel first so nothing is uploaded twice.
4. Only videos that are in his Drive folders (GL folder, WUR folder) can be posted. He saves finished videos there himself. Uploads to Drive from a cloud session are capped at 10 MB.
5. Hashtags in every Facebook post. Different captions on the two Geo Labs pages.
6. Never repeat a topic. Never re-render a finished video. Every new video should be better than the last.
7. Maps must be sharp: real Sentinel-2 cloudless tiles from EOX. Geo Labs videos are told as a story.
8. New videos are now **10 to 20 seconds** (about 25 to 48 words at ~0.4 s per word for the Brian S. voice).
9. Reply in simple Hinglish. Keep token use low. Quality is not to be traded for speed.
10. Titles under about 45 characters with the payoff first (audit finding).

## Connectors and how uploads work
- **Zapier**: main path. YouTube `upload_video` (pass the right connection: Geo Labs or "YouTube #2" = WUR; list them with `list_zapier_connections`), Facebook `page_video`, Drive `file_or_folder_by_id` (gives the `file` hydrate URL to pass as the video source; look it up right before each post).
- Zapier often throttles YouTube ("throttled without retry"). Check the channel, do not retry blindly.
- **Composio**: backup for YouTube, both channels. Accounts: `youtube_khet-endure` = Geo Labs, `youtube_incide-murut` = WUR. In the workbench: download the Drive hydrate URL with `requests`, `upload_local_file`, then `YOUTUBE_MULTIPART_UPLOAD_VIDEO` with `videoFile {name, mimetype, s3key}` and `account`. Also gives analytics (`YOUTUBE_QUERY_ANALYTICS`).
- **Metricool**: second backup for WUR YouTube only (schedules, so it posts a little later).
- Facebook has no backup: only Zapier.
- **ElevenLabs**: voice "Brian S. - Viral Social Media Narration" (find it with `creative_list_voices`), model `eleven_v4`, one take. A 45-word script cost 249 credits. Fetch the mp3 with `creative_get_generations` (full_res_url) and curl. If it says "free generations are busy", he makes the mp3 himself and attaches it.
- youtube-agent skills (yt-audit, yt-script, yt-package, yt-seo, yt-retention and more) are installed in his Claude account.

## What analytics and the audit said
- WUR Shorts mostly get 900 to 1,500 views. Geo Labs Shorts mostly get 1 to 7, except "vanished / hidden / biggest" topics (Aral 2,357, Russia, Vatican, Singapore about 1,100 each).
- Geo Labs has duplicate copies of the same videos (his old "Did you know ?" uploads plus re-uploads). Suggested: no more re-uploads on Geo Labs, one new video a day.
- Long videos (3 to 5 minutes) got almost no views. Stay with Shorts.
- Retention: viewers leave between 4 and 9 seconds if the first fact is slow, and at the end if there is an outro. So: hook in the first line, best fact right after it, end on the punchline, no call to action.

## How to build a video (code only, no AI images)
Tools needed in the session: Node with Playwright and Chromium, ffmpeg, Python with numpy, scipy, soundfile, Pillow, onnxruntime.
Word timing uses `stt/run_whisper.py` with the sherpa-onnx "whisper small" int8 model (encoder, decoder, tokens). The scripts point at absolute paths under `/home/claude` and a scratchpad folder: fix those paths first (`tools/align_audio.py` variable `S`, `engine/score.py`, `engine/*.sh`).

Geo Labs video:
1. Copy `geo-template/` to `geo-<name>/`. Put the voice at `audio_src/voice.mp3` and the script, on one line, at `audio_src/script.txt`.
2. `python3 tools/align_audio.py audio_src` then `python3 tools/mk_words.py audio_src` (writes `data/words.js`, `data/caps.js`).
3. Fetch map tiles: `python3 engine/gl_tiles.py geo-<name> '<levels json>'` (EOX WMS, each piece under about 4096 px tall). Look at the tiles before using them.
4. Write `scenes/body.js` (camera keys, chips, events, cues). `bodies/geo_*.js` are four worked examples: Nemo, Richat, Diomede, and the template's own Manicouagan.
5. `engine/gl_asm.sh <dir> body.js s1_x.js "<title>" "<bg colour>" "<credit>" <duration>` joins head + body + tail and writes index.html.
6. `engine/gl_audio.sh <dir> <duration> "<chords>, hits=(..), final=.., mood='dark'"` sets up the music. Then `./build.sh` (edit the frame count = duration x 30 and the output name).
7. Check stills with `tools/run.sh still.js scene s1 <times> out/stills` and `tools/sheet.py` before the full render. Target loudness is -14 LUFS.

WUR video: same idea with `story-template/`. Write `scenes/body.js` (shots) and `scenes/cues.js`, add character looks to `scenes/people.js`, then `engine/wur_asm.sh <dir> <title> "<yellow caption words>" "<red caption words>" <duration> <frames> <outname>`. Examples: `bodies/story_meitner*.js`, `bodies/story_zwicky*.js`, and the template's Lemaitre.

## Topics already used (do not repeat)
Geo Labs: Malacca, Lesotho, Thar, Australia, Baikal, Canada, Panama, Singapore, Vatican, Iceland, Greenland, Hormuz, Netherlands, Bolivia, Istanbul, Nauru, Russia, Dead Sea, Gibraltar, Kaliningrad, Africa, Chile (longest country), Top 5 heritage, Poland, Aral Sea, Tuvalu, Allah Bund (Kutch), Darvaza, Bir Tawil, Egypt, Point Nemo, Richat, Diomede, Manicouagan.
WUR: Marshall, Semmelweis, Wegener, Kariko, Margulis, Mendel, Snow, Lind, Goddard, Shechtman, Tharp, McClintock, Rous, Chandra, Forssmann, Goldberger, Folkman, Avery, Payne, Leavitt, Jenner, Kelsey, Prusiner, Meitner, Zwicky, Lemaitre. Scripts written but not built: Bretz (Missoula floods), Castle.

## Where things stand (16 Nov 2026, 15:55 IST)
Live on YouTube today: WUR Goldberger `ja0TFOcVo7g`, Avery `qs0CGbhldos`, Payne `STT7NkfhHDU`; GL Lesotho re-upload `UOyuiV181zg`, Allah Bund `Up4nnXtU7Is`, Darvaza `_MDIeV7ioVk`.
Posted on Facebook today: GL pages Singapore (restart), Allah Bund, Darvaza; WUR page Wegener (restart), Payne, Leavitt; Althea clips up to file name starting 932560545.

Next in the queues:
- YouTube WUR: Leavitt, Meitner, Zwicky, Lemaitre (all in Drive).
- YouTube GL: Nemo, Richat, Diomede, Manicouagan (all in Drive). Tuvalu was never saved to Drive.
- Facebook GL pages: Nemo, Richat, Diomede, Manicouagan. Facebook WUR: Meitner, Zwicky, Lemaitre.
- Althea: next clip file name starts 799824668, then 117772418 (Drive folder "Althea" > "Video").
- Drive has empty 0-byte copies of darvaza, allah_bund and leavitt: ignore them.

Older uploads (before 16 Nov) are all live already; check the channel list before uploading anything with a name from the topic lists above.
