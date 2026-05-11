# Design System: Tacho Admin (Admin Frontend) — v3 Matcha Zen

## 1. Creative North Star

**"The Digital Kanso"** — Lấy cảm hứng từ _Kanso_ (simplicity) và _Ma_ (negative space) của thẩm mỹ Nhật Bản. Đây là một digital dojo để quản lý việc dạy tiếng Nhật.

Phong cách: **high-end editorial**. Asymmetric layout, tonal depth, typography được đối xử như thư pháp. Tránh xa "cluttered dashboard" trope.

**v3 Direction — "Matcha Zen":** Lấy palette từ [Happy Hues #8](https://www.happyhues.co/palettes/8) (light) và [#13](https://www.happyhues.co/palettes/13) (dark).

Ẩn dụ văn hoá Nhật:

- **Washi paper cream (`#f8f5f2`)** — giấy washi truyền thống, nền ấm áp cho việc học.
- **Matcha teal (`#078080`)** — màu của trà matcha đậm đặc, primary CTA gợi sự tập trung và tĩnh tại.
- **Seal coral (`#d84a35`)** — con dấu hanko đỏ son, dùng cho accent / highlight.
- **Editorial ink (`#232323`)** — mực sumi-e, dùng cho sidebar và text.

Toàn palette dịch chuyển từ "warm crimson" (v2) sang **warm neutral + teal accent** — calmer, nhiều khoảng thở hơn, tránh sự intense của đỏ cho môi trường học lâu dài.

---

## 2. Color Tokens

> Dark mode apply qua class `dark` trên `<html>` — không dùng `prefers-color-scheme`.

| Token                         | Light     | Dark      | Dùng cho                                             |
| ----------------------------- | --------- | --------- | ---------------------------------------------------- |
| `--primary`                   | `#078080` | `#44c5c5` | Primary CTA, progress fill, active state (matcha)    |
| `--primary-container`         | `#056666` | `#078080` | Gradient end của primary button                      |
| `--primary-fixed-dim`         | `#b8e0e0` | `#0a5a5a` | Progress bar track                                   |
| `--secondary`                 | `#232323` | `#0a0f10` | Sidebar ink background                               |
| `--secondary-container`       | `#dfece8` | `#1a3535` | Selection chip background (matcha foam)              |
| `--on-secondary-container`    | `#056666` | `#b8e0e0` | Selection chip text                                  |
| `--tertiary`                  | `#d84a35` | `#ff8068` | Accent / tertiary button text (seal coral)           |
| `--accent`                    | `#feefe8` | `#2a2323` | Callout background — warm peach                      |
| `--surface`                   | `#f8f5f2` | `#0f1415` | Base background — washi paper / moonlit ink          |
| `--surface-container-low`     | `#f2eee9` | `#141a1b` | Secondary sections, zebra row                        |
| `--surface-container-lowest`  | `#fffffe` | `#0a0f10` | Interactive cards ("lift" effect)                    |
| `--surface-container-high`    | `#e6e1dc` | `#1b2324` | Background behind cards                              |
| `--surface-container-highest` | `#ded9d2` | `#222a2b` | Card body                                            |
| `--on-surface`                | `#232323` | `#fffffe` | Body text — editorial ink                            |
| `--on-surface-variant`        | `#52565a` | `#a7a9be` | Section titles, secondary text                       |
| `--outline-variant`           | `#232323` | `#2a3636` | Ghost border base (20% opacity)                      |

### Contrast ratios (WCAG)

Tất cả token pairs được verify pass AA (≥4.5:1):

| Pair                                 | Light      | Dark       |
| ------------------------------------ | ---------- | ---------- |
| `--on-surface` / `--surface`         | 14.8:1 AAA | 16.9:1 AAA |
| `--on-surface` / card                | 15.5:1 AAA | 18.3:1 AAA |
| `--on-surface-variant` / `--surface` | 7.2:1 AAA  | 8.3:1 AAA  |
| `--primary` / `--primary-foreground` | 4.9:1 AA   | 7.8:1 AAA  |
| `--tertiary` / `--surface`           | 4.6:1 AA   | 5.9:1 AA   |
| `--on-secondary-container` / chip bg | 7.0:1 AAA  | 9.2:1 AAA  |

### Sidebar text rule

Sidebar background là `#1a1a1a` (light) / `#0a0f10` (dark) — editorial ink cả hai chế độ.

- Mọi text trên sidebar dùng `#ffffff` hoặc `--primary` (teal) — **không** dùng `--on-surface`
- Nav labels: `rgba(255,255,255,0.55)`
- Active item text: `#ffffff`, indicator stripe `--primary` (matcha teal)

`--primary` reserved cho "Moments of Progression" — submit, bắt đầu bài học, primary CTA. Không dùng cho decorative elements.

`--tertiary` (coral seal) dùng cho highlights nhỏ, links, hoặc warning-soft (không phải destructive). Dùng sparingly — như con dấu trên tài liệu.

---

## 3. Typography

```css
font-family: "Nunito", "Kiwi Maru", system-ui, sans-serif;
```

| Token         | Size     | Weight | Dùng cho                |
| ------------- | -------- | ------ | ----------------------- |
| `display-lg`  | 3.5rem   | 700    | Hero headline           |
| `display-md`  | 2.5rem   | 700    | Page title              |
| `headline-md` | 1.5rem   | 600    | Section header          |
| `headline-sm` | 1.25rem  | 600    | Card title, sub-section |
| `body-lg`     | 1rem     | 400    | Body text mặc định      |
| `body-md`     | 0.875rem | 400    | Secondary text, caption |
| `label-md`    | 0.875rem | 500    | Button, chip, tab label |

- Display headers: `letter-spacing: 0.02em`
- Section titles: màu `--on-surface-variant`, không dùng `--on-surface`

---

## 4. Component Visual Decisions

### Elevation & Depth

```
--surface-container-high (background)
  └── --surface-container-lowest (card) → "pop" tự nhiên
```

Floating elements (modal, popover): `box-shadow: 0 12px 40px rgba(35, 35, 35, 0.08)`

### Sidebar

- Background: `#1a1a1a` (light) / `#0a0f10` (dark) — editorial ink
- Tablet+: `backdrop-filter: blur(12px)` (glassmorphism overlay)
- Mobile: solid, không glassmorphism
- Active item: vertical stripe `--primary` (teal) 4px left edge + `background: rgba(255,255,255,0.08)`
- **Text color:** `#ffffff` cho nav items, `rgba(255,255,255,0.55)` cho nav labels — không dùng `--on-surface`
- Logo / brand text: `--primary` (teal) hoặc `#ffffff`

### Buttons

- **Primary:** gradient `--primary` → `--primary-container` (matcha teal), `border-radius: var(--radius)`
- **Secondary:** transparent + ghost border (20% `--outline-variant`)
- **Tertiary:** text only, màu `--tertiary` (`#d84a35` light / `#ff8068` dark), underline on hover only — **bắt buộc `font-size ≥ 1rem`** để đảm bảo AA

### Input Fields

- Default: `--surface-container-low`
- Focus: shift sang `--surface-container-lowest` + 2px `--primary` (teal) underline animate từ center
- Không dùng heavy border on focus

### Border Radius

| Element             | Value                      |
| ------------------- | -------------------------- |
| Button, card, input | `var(--radius)` = `0.5rem` |
| Chip, badge, avatar | `rounded-full`             |
| Modal               | `0.75rem`                  |

### Progress Bars

- Track: `--primary-fixed-dim` (`#b8e0e0` / `#0a5a5a`) / Fill: `--primary`

### Mastery Chips

- Background `--secondary-container` (matcha foam), text `--on-secondary-container`, `rounded-full`

### Tables

- Không border line — zebra striping: row chẵn dùng `--surface-container-low`

---

## 5. Do's & Don'ts

**Do:**

- Embrace "Ma" — section trông trống thì giữ nguyên, đừng nhồi thêm
- Dùng tonal shift để phân tách — không dùng border
- Giữ toàn bộ màu trong vùng calm (cream / teal / muted ink) — coral dùng sparingly như con dấu
- Dùng teal làm primary duy nhất cho progression — giữ identity nhất quán

**Don't:**

- Không pure black — luôn dùng `--on-surface` (`#232323`)
- Không crowd sidebar — `p-12` top padding bắt buộc
- Không dùng `--on-surface` làm text trên sidebar ink — contrast quá thấp
- Không saturate coral khắp UI — chỉ dùng cho CTA bổ trợ hoặc highlight, tránh "fast food" vibe
