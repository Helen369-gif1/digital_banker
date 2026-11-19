# Design Brief — Glonari AI Money Transfer Landing (read before building or changing any page)

> Structure: Part 1 is the universal core. Part 2 is this project's style, taken from the supplied Global Reserve design system, media and references. Part 3 lists project files. Part 4 is the money and trust module.
> All project files stay in English. Never add Cyrillic characters to HTML, CSS, JavaScript, JSON, Markdown, comments, attributes, filenames or commit messages.

---

# PART 1 — CORE

## Precedence

1. The current user prompt controls the scope of the current task.
2. `GLOBAL-RESERVE-DESIGN-SYSTEM.md` controls colors, typography, spacing, grids, component appearance, section rhythm, responsive behaviour and motion character.
3. The already built pages and the screenshots in `references/` come next.
4. `GLOBAL-RESERVE-BUILD-SPEC.md` controls semantics, media contracts, accessibility and functionality only. Its visual tone paragraph and its light "paper" color tokens are outdated; if they conflict with the design system, the design system wins.
5. This brief comes last. If a rule below conflicts with 1–4, follow 1–4.

Use the owner's provided copy as-is. Do not rewrite or invent text. If a string is needed and missing, insert `<!-- TODO: copy needed -->` and list it in the summary.

## Objective

Create web layouts and code that feel handcrafted and intentional, as if made by a thoughtful human designer. Avoid predictable AI patterns, generic SaaS landing page structures and overused web clichés. The result must have character but stay clear, usable and easy to read at first glance. When choosing between bold and clear, choose clear.

## Layout

- Avoid formulaic alternating blocks (image left / text right, then the reverse).
- Prefer asymmetrical grids, varied column widths, slight offsets and generous space as a deliberate design element, inside the design system's 1200px container.
- Overlaps and grid breaks are allowed as accents only. The underlying structure must stay clear and readable.

## Typography (principles)

- Typography is the foundation: large-scale, confident headings.
- Use the typefaces from the design system. If a new pairing is needed, propose options rather than choosing something exotic on your own.

## Motion (principles)

- Subtle and purposeful. Maximum 1–2 signature effects per screen; everything else calm.
- Animation supports reading and orientation, never gets in the way. Respect `prefers-reduced-motion`: show a complete, readable static composition.

## Code

- Clean semantic markup, tidy CSS components, no redundant code. Reuse existing classes, tokens and functions.
- Vanilla HTML, CSS and JavaScript only. No frameworks, npm, bundlers, TypeScript, Tailwind or React. No new libraries without explicit permission.
- Fully responsive (mobile included), no horizontal scrolling, comfortable text contrast and legibility.
- Missing media must not break the page.

## New screens and sections

- If the document or the design needs a screen that does not exist yet, build it as a **new, full screen** with its own composition, designed to the level of the hero and the signature moments. Say so in the plan; do not hide it as an add-on.
- Never attach extra content to an existing screen just because it is convenient. If it would look cramped, small or ugly, it becomes its own screen.
- Never fall back to a generic block (image on one side, text on the other, a plain card, small print over a photo). Mandatory notes and disclaimers are part of the design: readable (at least 16px, contrast 4.5:1), on a calm background, never over a busy photo.
- If there is no suitable image or video yet, use a placeholder clearly named `placeholder-…` so the owner can see the real composition and replace the media later. Do not wait for assets and do not fill the gap with a plain template.
- Before showing a new screen, run the self-check below. The owner should not have to say that something looks bad.

## Self-check before delivering

1. Does it look like a typical template or AI-generated page?
2. Is everything easy to read and understand at first glance?
3. Does it match the references and the design system?

If the answer to 1 is yes, or to 2 or 3 is no, revise before showing it.

## Deliverable

A polished, studio-quality result with its own personality that does not look templated, and does not look strange for the sake of being different.

---

# PART 2 — PROJECT STYLE

## Mood

Dark, precise, calm. Premium without decorative luxury. Digital and intelligent rather than editorial. Spacious but never empty. Structure comes from alignment, contrast and rhythm. The warmth comes from bronze metal and the vault imagery, not from decoration.

## Colors (tokens from the design system, use the tokens, not raw values)

| Role | Token | Value |
|---|---|---|
| Page background | `--gr-void` | `#050508` |
| Alternate background | `--gr-void-deep` | `#08090d` |
| Surface / card | `--gr-surface` | `#0c0d12` |
| Elevated surface | `--gr-surface-elevated` | `#12141a` |
| Accent | `--gr-bronze` | `#cd7f32` |
| Accent glow / subtle | `--gr-bronze-glow` / `--gr-bronze-subtle` | `rgba(205,127,50,.4)` / `rgba(205,127,50,.15)` |
| Text | `--gr-text-primary` / `-secondary` / `-tertiary` / `-muted` | white / 70% / 45% / 25% |
| Rules | `--gr-line-dark` | `rgba(255,255,255,.08)` |

- Bronze is an accent: markers, key data phrases, thin lines, and the small solid fill of the primary button. Never a large background and never a card's full fill.
- The product-panel exception colors (`#82C0FA` border, `#F7C37B` gold, `#8DA3B9` secondary text) live only inside a hologram-style product panel, as in the Screen 5.5 exception.

## Typography

- Headings and body: IBM Plex Sans. Eyebrows, labels, metadata, technical captions: IBM Plex Mono.
- Numbers (amounts, rates, fees, times): IBM Plex Mono or Plex Sans with tabular figures, large, high contrast.
- Playfair Display appears only on the first hero screen and in the header wordmark, as in Global Reserve. Never below the hero.
- Type scale, line heights, letter spacing, text widths and vertical distances: exactly as in design system sections 4.1–4.4.

## Surfaces and detail

- Flat dark surfaces with 1px hairlines in `--gr-line-dark`, 8px radius, no shadows by default, no glassmorphism, no gradients as large fills.
- Detail comes from thin crisp lines, precise alignment and bronze micro-accents. Instead of a glow, use a 1px bronze line or a small bronze marker.
- The header, menu, dialogs and footer follow design system section 15.

## Imagery and media (files in `media/`)

| File | Role |
|---|---|
| `hero-vault.mp4` + `hero-vault-poster.jpg` | Hero: scroll-scrubbed vault corridor (existing scrub technique, Screen 1 stays locked as built) |
| `reveal-vault.mp4` | Cinematic reveal: aerial night home, window expands to full-bleed |
| `reserve-hologram-bg.webp` + `reserve-hologram/*.svg` | Product demonstration scene: projected panel in the vault |
| `gia.mp4` + `gia-poster.jpg` | The one human presence: the AI agent, plays once when visible |
| `cta-vault.mp4` + `cta-vault-poster.jpg` | Closing screen background |
| `logo/gr-emblem.png`, `logo/gr-full-lockup.png` | Logo marks, never upscaled |
| `home.png` | Still of a home |

- Transfer-specific screens that do not exist yet (a phone showing a transfer, a map, sender and receiver photos) use `placeholder-…` media until the real ones arrive.
- Photography and video: dark, warm, bronze-lit, real places and real people. No stock-looking smiling groups, no 3D coins, no abstract orbs.

## References and what to take from each

- **Global Reserve design system and media (the supplied archive).** The whole visual base: tokens, type, rhythm, vault imagery, bronze accent, calm motion.
- **Framer "Design with an agent" stage** (framer.com/solutions/engineers, screenshots supplied). Take: a large dark stage with a 1px border holding several screens layered with slight offsets and depth, and a narrow side panel beside it showing the agent's steps ("Thinking…", "Created a design plan", "Placing…"). Adapt it: the layered screens become the transfer product screens, the side panel becomes the AI agent working through a transfer step by step. Keep the design system's 8px radius and flat surfaces, do not copy Framer's heavier rounding.
- **The moment where the screen opens** (Framer's layered screens spreading out, and the Global Reserve Screen 4.5 mask reveal). Take: a small window that expands to full width as the visitor scrolls, then holds. One such moment on the page.
- **EventBeds "Event exclusives" screenshot.** Take: a phone mockup overlapping a rounded photo, a floating summary card attached to the phone's lower edge with the amount, the saving and one action button, a big bold heading with one short grey line beside it, the composition offset to one side. Adapt it: dark surfaces and bronze instead of light and lime, the floating card shows sender amount, receiver amount, fee and rate together.
- **Mercury.** Take: a calm first screen with one input and one button; concrete numbers in benefit blocks; a key-figures row; a security section with specific facts; the regulatory disclaimer near the first screen and again at the end.
- **Dialedweb.** Take: cinematic motion and video previews, a key-figures screen with big numbers and one-line captions. Use sparingly so the page does not become an agency showreel.
- **EventBeds site.** Take: a simple three-step flow shown as product screens, and a dedicated "safe payments" screen.

## Screen compositions (proposal, order and count change when the copy arrives)

| # | Screen | Composition |
|---|---|---|
| 1 | Hero | Vault video scrub with centered text, as built in Global Reserve. Alternative for a calmer start: one input and one button over the poster. |
| 2 | The problem | Standard split from the design system, text left, one media right. |
| 3 | How a transfer works | Framer-style stage: layered product screens plus a side panel of the agent's steps. This is the signature screen. |
| 4 | The window opens | Mask reveal over `reveal-vault.mp4`, one line of copy over it. |
| 5 | The numbers | Key-figures screen: big tabular numbers with one-line captions, only figures from the owner's copy. |
| 6 | Product demonstration | Projected panel in the vault (hologram scene), example figures with a visible "example, not your account" disclaimer. |
| 7 | The AI agent | Video left, text right, two quote bubbles over the video as in Global Reserve Screen 7. |
| 8 | Trust and security | Own full screen, facts with their own places, regulatory notes readable (Part 4). |
| 9 | Closing | `cta-vault.mp4` background, centered, two buttons. |

## Signature effects

- Maximum 1–2 per screen. Pinned or scroll-scrubbed sections are exceptional: use at most the three kinds Global Reserve already has (hero scrub, window reveal, product demonstration) unless the current prompt approves more.
- Text reveal: 600ms, translateY 24px → 0, opacity 0 → 1, ease `cubic-bezier(.22,.61,.36,1)`, once. Hover feedback 200–300ms.
- No parallax or scroll hijacking beyond the approved pinned sections. Pause expensive animation outside the viewport.

## Avoid in this project, and what to do instead

- Light editorial pages after the hero → keep every screen on the dark tokens.
- Oversized serif headlines below the hero → IBM Plex Sans at the design system scale.
- Glowing orbs, sparkles, purple-pink gradients, empty chat bubbles for the AI → real interface fragments and real wording from the copy.
- Large gradient fills, glassmorphism, heavy shadows, excessive rounding → flat surfaces, 1px lines, 8px radius.
- Isolated lines or decorative objects that mean nothing when animation stops → every animation phase shows several meaningful elements.
- Big empty areas → a deliberate composition, or a smaller section.

---

# PART 3 — PROJECT FILES

- Design system: `GLOBAL-RESERVE-DESIGN-SYSTEM.md`
- Build spec (semantics, media contract, accessibility, functionality only): `GLOBAL-RESERVE-BUILD-SPEC.md`
- Project rules: `CLAUDE.md` (scope protection, git workflow, verification). Read it. Git: inspect `git status` and `git diff` before editing, never add, commit, push, reset or discard unless the prompt authorizes that exact action.
- Copy: not written yet. Use only copy the owner provides; otherwise `<!-- TODO: copy needed -->`.
- References: `references/` (`digital-banker-reference.png`, `Screen_5_5_Reference.png`, `screen-2-current.png`, `screen-2-transition-problem.png`, `reveal-scroll-reference.mp4`, `reserve-hologram-panel-source/`), plus the Framer and EventBeds screenshots supplied by the owner.
- Reusable code: `css/tokens.css`, `css/base.css`, `css/screens.css`, `css/site-shell.css`, `css/reserve-hologram.css`, `js/reveal.js`, `js/video-reveal.js`, `js/lazy-video.js`, `js/reserve-hologram.js`, `js/gia.js`, `js/site-shell.js`. `js/scrub.js` is locked to the hero.
- Documentation sync: update the build spec in the same task when approved copy, screen order, terminology, media or timing change; update the design system only when the owner approves a permanent visual change.

---

# PART 4 — MONEY AND TRUST MODULE

## Facts and numbers

- Never invent or round figures: exchange rates, fees, limits, transfer times, savings, user counts, licenses, insurance, partner names. Use only what the owner's copy states. If a number is needed and missing, show a clearly marked placeholder (`[RATE]`, `[FEE]`) and list it in the plan.
- Never invent legal wording. Use the owner's disclaimers verbatim.
- Example figures in any interface demonstration always carry a visible disclaimer next to them (the pattern from Global Reserve Screen 5.5: "Example interface — not your account."), whenever the figures are visible.

## Numbers in the interface

- Amounts and rates use tabular figures, large and high contrast, with the currency always visible next to the amount.
- Show the sender amount, the receiver amount, the fee and the rate together, never one without the others.

## One action per screen

- One primary call to action per screen, clear at first glance. The primary button is the only place bronze may be a solid fill. Secondary actions look clearly secondary.

## Showing the AI

- Show what the AI actually does in a real scenario: a transfer step by step, a question and its answer, a watched position. Not abstract decoration.
- The AI never moves money without the person's permission, and the design shows that control (a visible confirm step), but only with wording from the owner's copy.

## Trust

- Security, licensing, who holds the money and the fee breakdown are visible parts of the design, each with its own place, not small print in the footer.
- Regulatory notes sit close to the claim they refer to, at least 16px, contrast 4.5:1, on a calm background, never over a video or a busy photo.
