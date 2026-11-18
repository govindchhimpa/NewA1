# Skills catalog

All 53 skills live in `.claude/skills/<name>/` (the only place Claude Code loads them from). This page is the map: what each one is for, what it needs, and where it came from. Update it whenever a skill is added.

**Mode.** *auto* means Claude picks the skill by itself when a request fits. *manual* means the skill is switched to `/name` only (`disable-model-invocation: true` in its `SKILL.md`), because it needs a paid key or an app that is not set up here; this keeps it out of every session's context and stops it firing by accident. To turn one back to auto, delete that one line from its `SKILL.md`.

## Making videos and pictures
| Skill | What it does | Needs | Mode | Upstream (licence) |
|---|---|---|---|---|
| lemo-opuscar | films made entirely in code, 66 styles | sets itself up on first use | auto | lemomo-ai/lemo-opuscar (MIT) |
| claude-drawing-skill | draws pictures in code, 83 styles | Python packages | auto | cloveric/claude-drawing-skill (MIT) |
| bang-motion | browser motion graphics rendered to MP4 | Node | auto | bangtutorial/bang-motion (MIT) |
| huashu-art-motion | animation styles and explainer films (Chinese) | ffmpeg, Node | auto | alchaincyf/huashu-art-motion (MIT) |
| vox-director | paper-collage explainer videos | **paid Atlas Cloud key** | manual | Alisa0808/vox-director (MIT) |
| remotion-best-practices | videos in React (Remotion) | Node | auto | via OpenMontage (AGPL-3.0 repo) |
| manim-composer, manimce-best-practices | plan and build explainer animations (Manim) | Python | auto | via OpenMontage (AGPL-3.0 repo) |
| ffmpeg, video-edit | convert, trim, join, resize video and audio | ffmpeg | auto | via OpenMontage (AGPL-3.0 repo) |
| watch | "watch" a video: frames plus transcript | yt-dlp, ffmpeg | auto | bradautomates/claude-video (MIT) |
| voicestudio | local speech and dubbing through the VoiceStudio app | the app running | manual | debpalash/VoiceStudio (AGPL-3.0) |

## Design, slides and diagrams
| Skill | What it does | Mode | Upstream (licence) |
|---|---|---|---|
| ui-ux-pro-max | UI/UX rules, styles, palettes, fonts for web and apps | auto | nextlevelbuilder/ui-ux-pro-max-skill (MIT) |
| design | logos, brand identity, icons, social images | auto | same |
| banner-design | YouTube/social banners and thumbnails | auto | same |
| brand, design-system, ui-styling, slides | brand voice, design tokens, shadcn/Tailwind UI, HTML slides | auto | same |
| impeccable | design, critique and polish a frontend | auto | pbakaus/impeccable (Apache-2.0) |
| diagram-design | branded diagrams and charts as HTML/SVG/PNG | auto | cathrynlavery/diagram-design (MIT) |
| ppt-master | editable PowerPoint (PPTX) from documents; about 79 MB, mostly templates | auto | hugohe3/ppt-master (MIT) |

## Working method
| Skill | What it does | Mode | Upstream (licence) |
|---|---|---|---|
| unlazy | finish big tasks properly, with checks | auto | local copy |
| task-observer | notes friction and suggests skill improvements | auto | rebelytics/one-skill-to-rule-them-all (CC-BY-4.0) |
| superpowers (15): using-superpowers, brainstorming, writing-plans, executing-plans, subagent-driven-development, dispatching-parallel-agents, systematic-debugging, test-driven-development, verification-before-completion, requesting-code-review, receiving-code-review, using-git-worktrees, finishing-a-development-branch, writing-skills, diagnosing-superpowers | a full coding workflow; `using-superpowers` is strict and makes Claude check skills before every reply | auto | obra/superpowers (MIT) |
| find-skills | find and install more skills | auto | vercel-labs/skills (MIT) |
| humanizer | rewrite AI-sounding text so it reads human | auto | blader/humanizer (MIT) |

## SEO (12, all need the paid OpenSEO connector; mode: manual)
ai-prompt-research, ai-visibility-audit, competitive-landscape, competitor-analysis, keyword-clustering, keyword-research, link-prospecting, local-seo, seo-audit, seo-coach, seo-project-setup, seo-report. Upstream: every-app/open-seo (MIT).

## Notes
- Folder size does not slow Claude down. Only each skill's short `description` is read every session, so descriptions are kept short. The original, very long description of `claude-drawing-skill` is kept inside its `SKILL.md` under "Full style list".
- Left out on purpose when copying: demo videos, showcase media and `examples/` folders (to keep the repo smaller), and every plugin hook.
- Overlap: `design`, `banner-design` and `ui-ux-pro-max` share a source; for a YouTube thumbnail or channel banner start with `banner-design`. For a deck use `ppt-master` (a real PPTX) or `slides` (HTML).
