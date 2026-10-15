# HIU Hospital — Design System

**Bệnh viện Đại học Quốc tế Hồng Bàng** · *Hong Bang International University Hospital* — an **AI-first smart hospital**. This design system powers the hospital's full digital surface area: a public website, a patient mobile app, a lobby self-service check-in kiosk, an in-clinic doctor dashboard, and an admin/management console.

The system is reconstructed **strictly from the official brand identity guidelines** — *"Hệ thống nhận diện thương hiệu — Bệnh viện Đại học Quốc tế Hồng Bàng" (08.06.2026)*. Colors, the logo, fonts, casing and lockups all come from that document; nothing brand-level was invented.

---

## Source materials

| Source | What it provided |
|---|---|
| `sources/08.06.2026 - HongBang Project _Deliverable_Creative Proposal_2.pdf` (51 pp.) | The brand bible: logo versions & lockups (VN/EN), clear-space & min-size rules, **§3.3 brand colors** (primary + 3 secondary + uniform/role accents), and the **Montserrat + Lato** type pairing. |

Extracted assets live in `assets/` (logo mark, reversed mark, app icon, favicon — pulled directly from the PDF's embedded artwork). Working extractions are in `scraps/`.

> ⚠️ **No web codebase or Figma file was provided.** The token foundation, lockups and color codes are faithful to the guideline. The UI kits (website / mobile / kiosk / doctor / admin) are **net-new product surfaces designed on top of the verified brand foundation** — they are the system's interpretation of how the brand applies to product, not recreations of existing screens. If real product designs exist, share them and the kits will be aligned.

---

## Brand at a glance

- **Name:** Bệnh viện Đại học Quốc tế Hồng Bàng (VN) / Hong Bang International University Hospital (EN).
- **Symbol:** a custom **"H" monogram** — a serif-influenced H whose right strokes carry rounded bumps (reads H + B for Hồng Bàng). Solid brand blue.
- **Positioning:** AI-first, technology-forward, but warm and trustworthy — a teaching hospital that feels modern and humane, not cold.

---

## CONTENT FUNDAMENTALS

How copy is written across HIU surfaces:

- **Bilingual, Vietnamese-first.** Primary language is Vietnamese; English is the secondary lockup/label set. Product UI ships VN with EN parity. Diacritics are always correct and complete (`Bệnh viện`, `Hồng Bàng`, `xét nghiệm`).
- **Voice:** calm, clear, reassuring, competent. We guide the patient step by step. Think "a trusted doctor who explains things simply," never bureaucratic.
- **Person:** address the patient as **"bạn"** (you); the institution refers to itself as **"chúng tôi"** or simply by service ("Bệnh viện"). Warm but respectful — never overly familiar.
- **Casing:** **sentence case** for all prose, headings, buttons and labels (`Đặt lịch khám`, `Xem kết quả xét nghiệm`). **ALL-CAPS is reserved** for: the logo lockup, short overlines/eyebrows, and department tags (`KHOA SẢN`, `CẤP CỨU`). Never shout in body copy.
- **Tone by surface:** Website = welcoming & credible. Mobile app = friendly, concise, action-led. Kiosk = very short, large, imperative ("Quét mã QR để bắt đầu"). Doctor dashboard = dense, precise, clinical shorthand. Admin = neutral, systematic.
- **Numbers & time:** Vietnamese formats — `16/06/2026`, `09:24`, `1.250.000đ`. Use real units.
- **Emoji:** **not used** in the brand or product UI. Status and meaning are carried by icons + color, never emoji.
- **Examples (verbatim brand register):**
  - *"Chăm sóc sức khỏe thông minh, tận tâm như con người."*
  - *"Đặt lịch khám chỉ trong 3 bước."*
  - *"Kết quả xét nghiệm của bạn đã sẵn sàng."*

---

## VISUAL FOUNDATIONS

**Color.** A **9-step semantic-ramp palette — v2 "Clinical Sky"**. **HIU Blue `#0052d7`** (the locked logo color) is *the* brand color — confident royal blue for the logo, primary actions, links and brand moments — and anchors a full **Primary ramp** (`--blue-100…900`, `#EEF0FF → #002663`). Every semantic role ships a full 100→900 ramp so you can build matching surface / border / text trios: **Success** (green `#22C55E` mid), **Warning** (amber `#F59E0B` mid), **Error** (red `#EF4444` mid), and **Information** (**Sky** `#0EA5E9` mid — deliberately distinct from the brand royal blue so "info" never reads as "primary"). For accessible status text use the `-700` step (`--success-text`, `--warning-text`, `--error-text`, `--info-text`) on the `-100` background. **Neutrals are cool-blue-tinted, never flat gray** (`--neutral-50…900`, `#F5F8FF → #141A28`): page background `#F5F8FF`, borders `#E1E7F4`, body text `#374056`, headings deep brand navy `#002663`. Large blue fields appear as full-bleed brand panels (hero, kiosk welcome), always with white type. *(Ramp values supplied by the client; brand blue unchanged. The earlier Palette B secondaries — coral/sage/lilac/sun — are retired; their legacy `--hiu-*` aliases now resolve into the new ramps for backward compatibility.)*

**Type.** Two families, both full Vietnamese-support. **Plus Jakarta Sans** (400–800) is the **display/heading** face — geometric, modern, friendly, used for the logotype area, headings, big numerics, overlines. **Lexend** (300–700) is the **body/UI** face — engineered for reading speed and clarity, highly legible for long-form, labels and dense tables. Style is **light & airy** — favour lighter weights and a larger base size (`17px`). Headings: tight tracking (`-0.02em`), navy. Overlines: Jakarta 600, uppercase, `0.09em` tracking, brand blue. Body: Lexend 400, `1.65` line height. *(Original guideline named Montserrat/Lato; replaced with Jakarta+Lexend per client direction for a more health-tech, modern feel.)*

**Spacing & layout.** 4px base grid. Generous whitespace; content maxes around `1200px` (marketing) / fluid app shells. Fixed `72px` header, `264px` sidebar in dashboards. Comfortable density on patient surfaces, higher density on doctor/admin.

**Corner radii.** **Soft Clinical · Calm Care** — gently rounded, never sharp, never pill-shaped buttons. Controls and inputs `10px` (radius-sm); buttons & avatars `14px` (radius-md); cards, stat tiles & segmented controls `16px` (radius-lg); feature panels/modals `20–24px`; badges, toggles, step dots stay fully round (`radius-pill`). Rounding reads calm and reassuring for patients of every age.

**Cards.** White surface, `16px` (radius-lg) corners, hairline `1px` border **and** a very soft low-contrast shadow (`shadow-sm`; `shadow-md` when `elevated`). Flat, no colored left-border accent strips. Elevation stays gentle and calm.

**Components style.** **Soft Clinical · Calm Care** — rounded, calm, high-clarity. Buttons are solid brand fills with a soft lift (no glow), rounded `radius-md`; destructive actions use a calm tinted surface rather than a loud solid red. Surfaces are white with hairline borders and gentle shadows, on calm blue-tinted fields. The whole system speaks **one rounded language**; three audience tunings only adjust density & rounding via **theme-scope classes** (`tokens/themes.css`):
- **`.hiu-web`** — welcoming marketing surface: a little rounder & airier (cards ~20px).
- **`.hiu-app`** — patient mobile & kiosk: the calm default, large friendly targets, soft rounding.
- **`.hiu-portal`** — doctor/admin: the same soft language, a touch tighter & flatter so dense data stays calm.
Across all, chrome is kept **thin** (hairline borders, light weights, thin icons) while **content is large and clear**.

**Borders.** Hairline `1px` in the gray ramp (`--border-subtle/-default`). Focus is a `3px` brand-blue ring at ~28% opacity (`--focus-ring`).

**Backgrounds & imagery.** Clean white/light-gray fields; occasional full-bleed brand-blue panels. Photography is **bright, warm, optimistic** — real clinicians and patients, natural light, plenty of the brand blue in scrubs/signage; never cold or stocky-sterile. Soft secondary tints (sky/peach/lilac) back illustration and empty states. Use `<image-slot>`/placeholders for photos rather than inventing imagery.

**Motion.** Calm and purposeful. Standard easing `cubic-bezier(0.2,0,0,1)`; reveals use a gentle ease-out. Durations `120/200/320ms`. **No bounce, no springy overshoot.** Fades + small translate/scale only. Honors `prefers-reduced-motion`.

**Hover / press states.** Hover: primary buttons darken (`#0052d7 → #0044b3`) and may lift slightly; ghost/secondary fill with `--surface-brand-soft`; links underline. Press: color deepens and the element settles (subtle `scale(0.98)` on large tappable targets, especially kiosk). No opacity-only hovers on primary actions.

**Transparency & blur.** Used sparingly — sticky headers may use a translucent white with backdrop blur; modal scrims are `rgba(14,19,32,0.5)`. Not a decorative glassmorphism system.

---

## ICONOGRAPHY

- The brand guideline does **not** ship a proprietary icon font; it defines the logo system, departmental pictographs (for wayfinding/uniforms) and the H symbol. For product UI we therefore standardize on **[Lucide](https://lucide.dev)** — clean, consistent **thin stroke icons (default `1.5`, active states `1.8`)** with rounded caps/joins for a refined, premium feel that pairs with Plus Jakarta Sans. Loaded from CDN in kits via `<Icon>`.
  - **Substitution flag:** Lucide is a chosen, brand-compatible substitute for product UI icons (no icon set was provided). If the hospital adopts a specific medical icon library, swap the CDN link and keep usage identical.
- **Stroke icons** are default; reserve **filled** glyphs for active nav states and status dots.
- **Color:** icons inherit text color; brand blue for interactive/active, `gray-500` for muted, semantic colors for status. Keep them thin — avoid heavy fills.
- **Emoji / unicode glyphs as icons:** **never.**
- **The H monogram** (`assets/logo-mark.png`) is the only brand pictogram — used as favicon, app icon, avatar fallback and watermark. Department identity is carried by Lucide icon + role-accent color, not bespoke art.

---

## VISUAL MOTIFS — quick rules

- ✅ Single hero blue with full semantic ramps (Primary/Success/Warning/Error/Info-Sky), cool-blue-tinted neutrals, lots of white space, **soft-clinical rounded** components (rounded corners, soft low-contrast shadows, pill badges, calm tinted surfaces), thin chrome + large clear content, sentence case, Plus Jakarta Sans + Lexend type, the H monogram.
- 🚫 Purple/indigo gradients, emoji, colored left-border accent cards, pure black or flat gray, heavy glows, hard-squared corners, ALL-CAPS body copy, cold/sterile imagery.

---

## INDEX — what's in this system

**Foundations & tokens**
- `styles.css` — the single entry point consumers link (imports only).
- `tokens/colors.css` · `typography.css` · `spacing.css` · `fonts.css` · `base.css`
- `guidelines/*.card.html` — foundation specimen cards (Colors, Type, Spacing, Brand).

**Assets** — `assets/`
- `logo-mark.png` (H monogram) · `logo-mark-white.png` (reversed) · `app-icon.png` · `favicon.png`

**Components** — `components/` *(see each `*.prompt.md`)*
- `core/` — Button, IconButton, Icon, Badge, Avatar, Card + CardHeader, StatCard
- `forms/` — Input, Select, Checkbox, Radio, Switch
- `navigation/` — Tabs (underline + pill), Stepper
- `feedback/` — Dialog, Toast, Tooltip
- All exported under `window.HIUHospitalDesignSystem_0d4df4`; one `*.card.html` per group renders in the Design System tab.

**UI kits** — `ui_kits/<product>/`
- `website/` — public smart-hospital website
- `mobile/` — patient mobile app
- `kiosk/` — lobby self-service check-in
- `doctor/` — in-clinic doctor dashboard
- `admin/` — management & module-settings console

**Templates** — `templates/<slug>/` *(consumer starting points)*
- `website-page/` — public web page shell (header + brand hero + footer)
- `dashboard/` — internal app shell (sidebar + top bar + KPI row) for doctor/admin tools
- The five UI kits above can each be promoted into a full per-surface template on request.

**Meta**
- `SKILL.md` — Agent-Skill manifest for use in Claude Code.
- `readme.md` — this file.
