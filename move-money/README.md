# Move Money

Static landing site, vanilla HTML/CSS/JS, no build step. Open through a local server (the hero video
is loaded with fetch; over file:// it falls back to a direct link).

Rules: `DESIGN-BRIEF.md` (supplied by the owner), visual system from `../global_reserve/GLOBAL-RESERVE-DESIGN-SYSTEM.md`.
Copy: `Move_Money_Landing_EN.txt`, used verbatim. All project files stay in English.

## Built screens

| Id | Screen | Notes |
|---|---|---|
| `screen-1` | Hero | Light screen. 520svh runway, sticky stage. Scroll drives the video, copy fade-out, the interface on the laptop screen and the dark veil. Phases are constants at the top of `js/hero-scene.js`. |
| `screen-2` | All the ways you move money | Dark. Accordion with three items; the panel on the right follows the open item. |

| `screen-3` | Less work for the things you do often | Dark. Asymmetric: text high left, two layered product screens right, floating card of the four repeat actions on their lower edge. |
| `screen-4` | Gia helps with the details | Dark. Stage with layered screens and a side panel; `js/gia-steps.js` plays Gia's steps once when the stage is 40% visible. The transfer card is HTML: only David and $150 come from the copy, the rest are `[RECEIVER AMOUNT]`, `[FEE]`, `[RATE]` placeholders. |

| `screen-5` | Prepared by Gia. Approved by you. | Dark. Example approval card (HTML) with Approve and Decline; the click only changes the example status line (`js/approve.js`). Placeholders: `[RECEIVER AMOUNT]`, `[RATE]`, `[FUNDING SOURCE]`, `[FEE]`, `[TIMING]`. The line "Clear steps. Visible activity. Your decision." is split into three columns below. |
| `screen-6` | Your money, moving your way. | Final CTA over `media/cta-vault.mp4` (autoplay loop, loads near the viewport, pauses off screen; poster only under 768px and with reduced motion, `js/cta-video.js`). The Open Move Money button has no destination yet. |

All six screens of the copy file are built.

## Files

- `css/tokens.css` design tokens, `css/base.css` reset, buttons, reveal, `css/shell.css` header, `css/screens.css` screens.
- `js/hero-scene.js`, `js/ways.js`, `js/gia-steps.js`, `js/reveal.js`, `js/shell.js`.
- `media/gia-cutout.webp` Gia on a transparent background (1086x1448), the large portrait on the stage of screen 4.
- `media/hero-scene.mp4` all-intra, no audio, made with
  `ffmpeg -i in.mp4 -an -c:v libx264 -preset slow -crf 24 -g 1 -pix_fmt yuv420p -movflags +faststart out.mp4`.
  Every frame must stay a keyframe, or scrubbing becomes jerky.
- `media/ui/` example interface images from the app. They always show the caption "Example interface — not your account."

## Reduced motion

No pin and no scroll animation: the hero shows the poster with the copy visible.

## Open items

- Regulatory note under the first screen and again near the end: copy needed (`TODO` comments in `index.html`).
- Destination for the Open Move Money button: needed.
- Values for the placeholders in the transfer cards of screens 4 and 5.
- Header navigation labels and actions: copy needed.
- Destination for the Ask Gia button: needed (`data-placeholder` link does nothing for now).
- Product source documents describe some features as planned; verify what is live before publishing.
