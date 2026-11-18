# Project memory: govindchhimpa/NewA1

Read this first in every session. It records what has been built here, how to resume it, and the owner's preferences.

## Owner and preferences
- Owner: Govind (govindchhimpa). Works **only from an Android phone**: no PC, no server. Replies should be in simple **Hinglish**, short numbered steps, and one step at a time, with screenshots checked before moving on.
- Goals: run free LLM gateways from the phone, and run a YouTube channel (Shorts, history/geography explainers).
- Ask before anything outward-facing (YouTube upload, Facebook post, PR merge). Merge to `main` only when asked ("main me merge kar do"); do it through a PR, never push to `main` directly.
- Never write API keys, passwords or setup codes into this repo. Two keys leaked in chat screenshots earlier (a Google AI Studio key ending `WSqQ`); they should be rotated.

## What exists in this repo
- `.devcontainer/` + README section: GitHub Codespaces setup that clones, builds and starts **FreeLLMAPI** (port 3001). Created, merged to `main`; the Codespace itself hung on "Setting up your codespace" on the phone browser, so the owner switched to Termux.
- `.claude/skills/`: 53 skills, mapped in `SKILLS.md`.
- `LICENSE`, `README.md`: pre-existing. (`TError404.py`, an obfuscated script inherited from the fork, was removed on 16 Nov 2026 at the owner's request.)

## Phone setup that works (Termux, from F-Droid)
- **FreeLLMAPI** (`github.com/tashfeenahmed/freellmapi`): `pkg install nodejs-lts git termux-api`, clone, `npm install --no-audit --no-fund`, then `termux-wake-lock` and `npm run dev`. Dashboard `http://localhost:5173`, API `http://localhost:3001/v1`. Provider keys go on its Keys page; the unified key (`freellmapi-...`) is what apps use. Groq sign-up failed; Google AI Studio key worked.
- **OmniRoute** (`npm install -g omniroute`, `mkdir -p ~/.cache`, run `omniroute`): dashboard and API at `http://localhost:20128`. Free no-key providers were broken (Cloudflare needs a browser, UncloseAI closed), so it needs a real provider key (Gemini added, "Import only free models" on). Slow when testing `auto`.
- **ChatBox** (Android app): custom provider "OpenAI API Compatible", host `http://localhost:3001` (or `:20128`), path `/v1/chat/completions`, models `auto` or `auto/best-chat`, "Improve Network Compatibility" ON. ChatBox's built-in Gemini provider also works with the owner's own key. Copilot "Youtube Manager" holds the Shorts-writer prompt.
- ChatBox cannot make videos. Videos are made in a Claude session.

## Skills (53, all in `.claude/skills/`)
The map is **`SKILLS.md`** at the repo root: purpose, needs, mode and upstream source for every skill. Read it before choosing or adding a skill, and update it when one is added.
- Skills are never removed to save space (owner's rule); organise instead. Folder size does not slow Claude; only descriptions do, so keep descriptions short.
- 14 skills are **manual-only** (`disable-model-invocation: true`, run with `/name`) because they need a paid key or an app that is not set up: the 12 OpenSEO skills, `voicestudio`, `vox-director`. Delete that line from a skill's `SKILL.md` to make it automatic again.
- `claude-drawing-skill` has a short description; its original 31,000-character one is kept in its body under "Full style list".
- `ppt-master` (about 79 MB) and `huashu-art-motion` (about 34 MB) are the heavy ones.
- Not installed on purpose: claude-mem (needs a background worker and hooks). Plugin hooks from any repo are never installed, only SKILL.md folders and their LICENSE files.
- Full app clones lived in `/home/user/` (Open-Generative-AI, VoiceStudio, open-seo, claude-video, freellmapi, awesome-freellm-apis). They vanish with the container.

## Video and image notes
- The `lemo-opuscar` skill makes films from code; it sets itself up on first use (`sh .claude/skills/lemo-opuscar/scripts/setup.sh`).
- Machine quirks: `media.canva.com` is blocked, so Canva images cannot be downloaded; give links instead. `SendUserFile` refuses images over 8000 px (zip them).
- Format lesson from the owner's research file (Segment Zero): one true, surprising fact told as a mystery, a paradox hook in the first sentence, 60 s, facts checked. Copy the format, never the channel's name, mascot or stories. Owner's mascot: small round-headed character in a blue cap.

## YouTube and connectors
- Channel (via Zapier, read 15 Nov 2026): **Geo Labs** (@geojilab, ID `UCwTI_k5jHHxq9fX2rc0dvoQ`), 17 subscribers, 32 videos, satellite-map geography/history Shorts. Facebook Page "Geo Labs" ID `1392638267273489`.
- **Zapier MCP** is connected (YouTube, Google Drive, Facebook Pages). Saved Zapier skill **"geo labs rundown"** (read-only). Upload/post actions exist but only run when the owner asks.
- Other connectors seen: Canva (generate-image works), Adobe (no text-to-image), ElevenLabs, vidIQ (no channel linked), Google Drive, Picsart (video only), Metricool. Connectors load only when a session starts; connect at claude.ai/customize/connectors.

## Video kit (added 16 Nov 2026)
- `video-kit/HANDOFF.md`: read it before any video, upload or Facebook post. It has the channel list, the owner's standing rules, the upload queues, topics already used, and how to build a video with the code in `video-kit/`.
- Two channels now: **Geo Labs** and **Wrong Until Right** (YouTube `UCFcRtqg_CovnSGdQe4H_Kiw`), plus the Althea Reyes1 Facebook page.
- Upload words: "upload" = YouTube, "upload fb" = Facebook, "upload fb yt" = both. Videos are now 10 to 20 seconds.

## MCP servers and tools
- `.mcp.json` (project scope, on `main`): `perplexity-docs` (https://docs.perplexity.ai/mcp, Perplexity API documentation, read-only) and `playwright` (`npx @playwright/mcp@latest`, drives a real browser). New sessions ask for approval the first time.
- Glif connector (images, audio, video from a prompt): works, but the account had only 50 free credits (image 5-27, audio 8-41, video 98-449). Never start a Glif generation without asking first.
- Microsoft markitdown (files to Markdown) was cloned once to `/home/user/markitdown` and is not installed here; `pip install markitdown` when needed.
