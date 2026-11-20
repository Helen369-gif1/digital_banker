# Move Money

Static landing site, vanilla HTML/CSS/JS, no build step. Open through a local server (the hero video
is loaded with fetch; over file:// it falls back to a direct link).

Rules: `DESIGN-BRIEF.md` (supplied by the owner), visual system from `../global_reserve/GLOBAL-RESERVE-DESIGN-SYSTEM.md`.
Copy: `Move_Money_Landing_EN.txt`, used verbatim. All project files stay in English.

## Built screens

| Id | Screen | Notes |
|---|---|---|
| `screen-1` | Hero | Light screen. 520svh runway, sticky stage. Scroll drives the video, copy fade-out, the interface on the laptop screen and the dark veil. Phases are constants at the top of `js/hero-scene.js`. On the laptop interface four callouts (1px bronze line from a label to a real receipt row: Reference ID, Transaction fee, Amount, Status) draw one after another during the hold, then the interface sinks. Hidden when the frame is under 820px wide. |
| `screen-2` | All the ways you move money | Dark. Three full compositions (`.way-block--1..3`), one per way, no pin and no accordion: 01 text left / tall interface right; 02 interface low left / text bottom right; 03 title and text across the top, the form rises from below and is cut by a hard edge. Intro has the title and an index linking to the three. The three screenshots are now live fragments (see "Live interface fragments"): 01 types the amount, flips Immediately / Schedule for later and presses Continue; 02 draws the QR and moves a request from Requested to Pending to Paid; 03 switches the Add / Convert / Withdraw tabs, fills the form and opens the Details block (hard-cut composition kept). |

| `screen-3` | Less work for the things you do often | Dark. Asymmetric: text high left, two layered product screens right, floating card of the four repeat actions on their lower edge. The two screens are live fragments inside the same `.repeat__layer` wrappers, so `js/repeat-depth.js` (parallax, wide screens) is unchanged. The four items are buttons (chips): they light up in turn and change the left screen (recent recipients, schedule, recurring, split); then a transactions row opens a receipt on the right screen. A click on a chip stops the autoplay at its end state and shows that item. Layers sit in a 12-column grid; under 900px they stack with the chips on top. |
| `screen-4` | Gia helps with the details | Dark. Stage with layered screens and a side panel; `js/gia-steps.js` plays Gia's steps once when the stage is 40% visible. The transfer card is HTML and uses the demonstration values listed below. `js/fragments.js` listens to the classes `js/gia-steps.js` sets (the steps' `is-done`, the bubble's `is-in`): the bubble text types in, the card rows arrive one by one as each step is done (On screen 5 the same rows build in the approval card while it travels in), and the back screen is a live funds-check fragment whose two ticks arrive after it appears. Cards are dark (flat surface, 1px line). The back screen is hidden under 900px, as before. |

| `screen-5` | Prepared by Gia. Approved by you. | Dark. Example approval card (HTML) with Approve and Decline; the click only changes the example status line (`js/approve.js`). It uses the demonstration values listed below. The line "Clear steps. Visible activity. Your decision." is split into three columns below and lights up one by one in step with the card (rows highlighted, activity ticks, buttons ready). The back screen is a live fragment rebuilt from the Review and confirm screenshot. Approve adds a short completion state (the line grows beside "Approved by you.", a check on the button); Decline and Approve can still be switched. The autoplay stops before the decision, it never presses Approve by itself. |
| `screen-6` | Your money, moving your way. | Final CTA over `media/cta-hall.mp4`: the camera pulls back from banknotes to the bank hall and holds on the last frame (plays once per visit at 50% visibility, rewinds after the visitor leaves, `js/cta-video.js`). Made from the generated shot reversed (`ffmpeg -vf reverse`); its last frame matches `media/cta-hall-end.webp`, which is the still used under 768px and with reduced motion; `media/cta-hall-start.jpg` is the poster before it plays. The Open Move Money button has no destination yet. |

All six screens of the copy file are built.

## Live interface fragments

New files: `css/fragments.css`, `js/fragments.js` (linked in `index.html` after `screens.css` and before the shared arrow script). No library.

- A fragment is plain HTML in `index.html` (`.fx`, written in its FINAL frame) with the old picture next to it as `img.fx-fallback`. The fragment starts `hidden`; `js/fragments.js` shows it and hides the picture. If the script does not run (or a scene throws), the old webp stays.
- Animated scenes (`data-scene` = `send`, `recv`, `add`, `repeat`): wide screens with motion allowed only. The script arms the scene (`.is-armed`, beats `data-b` hidden), then plays it once when 40% visible on its own clock that pauses while off screen. Reveal: 600ms, translateY 24px to 0, `--mm-ease`. Nothing changes layout while it plays (typed text is reserved by a hidden ghost, panels are stacked in one grid cell, the details block fades its values in).
- Reduced motion, no JS, or under 768px: the final frame, no animation (tabs and chips still work). Screens 4 and 5 keep the old `gia-steps.js`, `approve.js` and `card-morph.js` untouched; `fragments.js` only listens to the classes they set.
- Style: dark tokens only, 1px lines, 8px radius, no shadows, bronze for tiny accents and the one solid primary button per fragment (Continue; Approve on screen 5). Status is text plus a thin line.
- The Enter amount fragment follows `ui-source/enter-amount/` (field names and structure; its demo amounts, balance and memo are not used).

### Example values in the fragments (owner decision)

The bracket placeholders in the fragments are replaced with example values. This is an intentional, owner-approved exception to "no invented figures", limited to the example fragments. They are example values, not Glonari terms, and the caption "Example interface — not your account." stays next to every fragment. The same value is used on every screen where the same object appears.

Taken from the owner's screenshots:
- Wallet address `i878cPyUt...4HqroDv` (`panel-receive-request.webp`).
- Receipt: Reference ID `DBTX-2026-05-24-8F7G2K`, Date & time `May 24, 2026 at 10:42 AM ET` (the source images print "AMET", an obvious typo; fixed on purpose by the owner), From `Personal USD Balance ••••4292`.
- Funds check: Available funds `$4,520.00 USD`, Funds reserved for another goal `$3,267.50 USD` (Enter amount screenshot).
- Schedule date `05.06.2026 20:12` and the first recurring date `05.06.2026` (Enter amount screenshot).
- Convert names `Personal USD Balance` and `USDC - Polygon` (Review and confirm screenshot, exactly as shown, hyphen included, so the account is named the same as in the receipt).

Invented (approved by the owner):
- The names Alex and Maya (split of a shared expense: Total `$150.00 USD`, `$50.00 USD` each, with Curt).
- The dates `05.07.2026` and `05.08.2026` (recurring transfers).
- The status words Requested, Pending, Paid.

Unchanged: Curt, $150 USD, rate 1 USD = 1 USD, fee $0.00, Within minutes. No rate or fee is shown for Convert.

### Placeholders still open (search for `placeholder-`)

| Class / comment | Where | What is still a guess |
|---|---|---|
| `placeholder-qr` | screen 2, way 02 | QR is a generated pattern, not a real code |
| `placeholder-convert` | screen 2, way 03 | the Add tab ("Linked account" is a grey bar); Withdraw follows the Bank account details screenshot, its fields are bars; the Details rows reuse the demo values |
| `placeholder-repeat-actions` | screen 3, left screen | recent recipients (only Curt is a name, other rows are bars) |
| `placeholder-transactions` | screen 3, right screen | the transactions list (one row "Curt", "Completed", $150 USD, others are bars) |

Also still bars (no class): the two ghost request rows on screen 2, way 02.

Not a placeholder but a guess: on screen 5 the approval card gets a four-line activity list that repeats Gia's steps from screen 4 (copy file wording) and the back screen reuses "Review and confirm" from the screenshot; the "after approval" state is only the status line and a check, no separate frame.

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
- `css/fragments.css`, `js/fragments.js` live interface fragments (screens 2 to 5), see above.
- `js/hero-scene.js`, `js/gia-steps.js`, `js/reveal.js`, `js/shell.js`, `js/repeat-depth.js` (screen 3: the two screens drift at different speeds on scroll; off with reduced motion).
- `js/card-morph.js` (screens 4 to 5, wide screens only): the approval card on screen 5 is the same object as the Gia card on screen 4. It starts at the Gia card's position and width, stays in view while scrolling, lands in the approval layout and opens the Funding source / Timing rows and the buttons. The Gia card stays in the layout, hidden, to give the start position (`.morph` class on `<html>`). Under 901px or with reduced motion each screen keeps its own static card. Row order of both cards: Recipient/To, You send, They receive, Rate, Fee, then (screen 5) Funding source, Timing.
- Screenshot framing (bronze, 1px, flat): the hero interface gets a contour that draws clockwise (`.contour`, `--c` set by `js/hero-scene.js`); the three ways on screen 3 use corner brackets (`.shot`, `.shot--alt`, `.shot--open`); the two layers on screen 4 get an offset half-frame (`.repeat__layer::before`); the blurred back screens on screens 5 and 6 get small corner brackets. Arms/lines draw once; with reduced motion they show at once.
- Screens 2, 3 and 5 use a 1440px container (rule at the top of the screen 2 block in `css/screens.css`) so the interfaces get more room.
- `media/gia-cutout.webp` Gia on a transparent background (1086x1448), the large portrait on the stage of screen 4.
- `media/hero-scene.mp4` all-intra, no audio, made with
  `ffmpeg -i in.mp4 -an -c:v libx264 -preset slow -crf 24 -g 1 -pix_fmt yuv420p -movflags +faststart out.mp4`.
  Every frame must stay a keyframe, or scrubbing becomes jerky.
- Hero demo (`../demos/send-funds/embed.html`, shown in the hero iframe): its `bg`, `logo` and `avatar` PNGs have webp copies (`assets/*.webp`, PNGs kept); only `embed.html` and `embed.css` point at the webp, the standalone demo (`index.html`, `styles.css`) still uses the PNGs. Its Roboto comes from `media/fonts/roboto-variable.woff2` through an `@font-face` in `embed.css` (the Google Fonts request keeps only Inter 400, used by the search field).
- Hero demo text fixed by the owner (text only, in `embed.html` and the standalone `index.html`): receipt "10:42 AMET" is now "10:42 AM ET" and Send date "May 24, 2027" is now "May 24, 2026", to match the receipt on the page. The Status line time "May 24, 2027 at 10:45 AM ET" is now "May 24, 2026 at 10:45 AM ET" (year only).
- `media/ui/` example interface images from the app. They always show the caption "Example interface — not your account."

## Reduced motion

No pin and no scroll animation: the hero shows the poster with the copy visible. Screens 2 to 5 show the final frame of every live fragment.

## Open items

- Regulatory note under the first screen and again near the end: copy needed (`TODO` comments in `index.html`).
- Footer copy: heading and line above the email field, regulatory note, Terms, Privacy, copyright line.
- Header navigation labels and actions: copy needed.
- Ask Gia has no destination of its own yet; it opens the registration form like the other buttons.
- Product source documents describe some features as planned; verify what is live before publishing.
