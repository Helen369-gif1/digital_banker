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
| `screen-4` | Gia helps with the details | Dark. Stage with layered screens and a side panel; `js/gia-steps.js` plays Gia's steps once when the stage is 40% visible. The transfer card is HTML and uses the demonstration values listed below. |

| `screen-5` | Prepared by Gia. Approved by you. | Dark. Example approval card (HTML) with Approve and Decline; the click only changes the example status line (`js/approve.js`). Placeholders: `[RECEIVER AMOUNT]`, `[RATE]`, `[FUNDING SOURCE]`, `[FEE]`, `[TIMING]`. The line "Clear steps. Visible activity. Your decision." is split into three columns below. |
| `screen-6` | Your money, moving your way. | Final CTA over `media/cta-hall.mp4`: the camera pulls back from banknotes to the bank hall and holds on the last frame (plays once per visit at 50% visibility, rewinds after the visitor leaves, `js/cta-video.js`). Made from the generated shot reversed (`ffmpeg -vf reverse`); its last frame matches `media/cta-hall-end.webp`, which is the still used under 768px and with reduced motion; `media/cta-hall-start.jpg` is the poster before it plays. The Open Move Money button has no destination yet. |

All six screens of the copy file are built.

## Header and footer

Modelled on the Global Reserve shell (design system section 15). Header: solid dark, logo (`media/logo/logo.webp`, alt text "Move Money", transparent, 499x176, never upscaled), four links
(All the ways, Repeat payments, Gia, You approve: short forms of the screen titles in the copy file), one button
Open Move Money. At 1100px and below the links and button move into a hamburger menu (no animation; closes on link,
Escape and outside click). Footer: the same logo, four social placeholders, the email form, the same four links plus
Terms and Privacy, and the copyright line. Terms, Privacy and the social links are `data-placeholder` links with no
destination yet.

## Language

The page is English only. `<html lang="en" translate="no">` and `<meta name="google" content="notranslate">`
stop the browser from offering or applying automatic translation (a visitor with a Russian browser would otherwise
see the menu and buttons translated).

## Registration

Every call-to-action button (Explore Move Money, Ask Gia, Open Move Money) links to `#register`, the footer form
with one email field (`js/shell.js`). It is client-only: no request is sent, nothing is stored; the messages
"Enter a valid email address." and "Demo only. Nothing has been sent." are functional text, not approved copy.
Wire the real endpoint where the `TODO` is in `js/shell.js`.

## Demonstration values (screens 4 and 5, must stay identical)

Recipient Curt (the recipient name in the Gia quote on screen 4 is the same); You send $150 USD; They receive $150 USD; Rate 1 USD = 1 USD; Funding source Global Dollars
(screen 5 only); Fee $0.00; Timing Estimated arrival: Within minutes (screen 5 only). An internal transfer with no
currency conversion. Demonstration only: the $0.00 fee and the arrival time are not confirmed Glonari terms.

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
- Footer copy: heading and line above the email field, regulatory note, Terms, Privacy, copyright line.
- Header navigation labels and actions: copy needed.
- Ask Gia has no destination of its own yet; it opens the registration form like the other buttons.
- Product source documents describe some features as planned; verify what is live before publishing.
