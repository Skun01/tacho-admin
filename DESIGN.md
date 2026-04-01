# Design System: Tacho Admin (Admin Frontend)

## 1. Creative North Star

**"The Digital Kanso"** — Lấy cảm hứng từ *Kanso* (simplicity) và *Ma* (negative space) của thẩm mỹ Nhật Bản. Đây là một digital dojo.

Phong cách: **high-end editorial**. Asymmetric layout, tonal depth, typography được đối xử như thư pháp. Tránh xa "cluttered dashboard" trope.

---

## 2. Color Tokens

> Dark mode apply qua class `dark` trên `<html>` — không dùng `prefers-color-scheme`.

| Token | Light | Dark | Dùng cho |
|---|---|---|---|
| `--primary` | `#8f0020` | `#ffb3b3` | Primary CTA, progress fill, active state |
| `--primary-container` | `#bc002d` | `#690016` | Gradient end của primary button |
| `--primary-fixed-dim` | `#ffb3b3` | `#930020` | Progress bar track |
| `--secondary` | `#4e6073` | `#b2c8e0` | Sidebar background |
| `--secondary-container` | `#cfe2f9` | `#354a5e` | Selection chip background |
| `--on-secondary-container` | `#0d1e2d` | `#daeeff` | Selection chip text |
| `--tertiary` | `#693541` | `#f0b8c0` | Tertiary button text |
| `--surface` | `#f8f9fa` | `#191c1d` | Base background |
| `--surface-container-low` | `#f3f4f5` | `#1e2122` | Secondary sections, zebra row |
| `--surface-container-lowest` | `#ffffff` | `#161919` | Interactive cards ("lift" effect) |
| `--surface-container-high` | `#e8e9ea` | `#272b2c` | Background behind cards |
| `--surface-container-highest` | `#e2e3e4` | `#313536` | Card body |
| `--on-surface` | `#191c1d` | `#e1e3e4` | Body text — không dùng pure black |
| `--on-surface-variant` | `#5c403f` | `#c8aaaa` | Section titles, secondary text |
| `--outline-variant` | `#e4bdbc` | `#4a3333` | Ghost border base (20% opacity) |

`--primary` reserved cho "Moments of Progression" — submit, bắt đầu bài học, primary CTA. Không dùng cho decorative elements.

---

## 3. Typography

```css
font-family: "Nunito", "Kiwi Maru", system-ui, sans-serif;
```

| Token | Size | Weight | Dùng cho |
|---|---|---|---|
| `display-lg` | 3.5rem | 700 | Hero headline |
| `display-md` | 2.5rem | 700 | Page title |
| `headline-md` | 1.5rem | 600 | Section header |
| `headline-sm` | 1.25rem | 600 | Card title, sub-section |
| `body-lg` | 1rem | 400 | Body text mặc định |
| `body-md` | 0.875rem | 400 | Secondary text, caption |
| `label-md` | 0.875rem | 500 | Button, chip, tab label |

- Display headers: `letter-spacing: 0.02em`
- Section titles: màu `--on-surface-variant`, không dùng `--on-surface`

---

## 4. Component Visual Decisions

### Elevation & Depth

Không dùng shadow cho card — dùng tonal layering:
```
--surface-container-high (background)
  └── --surface-container-lowest (card) → "pop" tự nhiên
```
Floating elements (modal, popover): `box-shadow: 0 12px 40px rgba(25, 28, 29, 0.06)`

### Sidebar

- Tablet+: `--secondary` + `backdrop-filter: blur(12px)` (glassmorphism)
- Mobile: solid `--secondary`, không glassmorphism
- Active item: vertical stripe `--primary` 4px left edge + background `--on-secondary-container`

### Buttons

- **Primary:** gradient `--primary` → `--primary-container`, `border-radius: var(--radius)`
- **Secondary:** transparent + ghost border (20% `--outline-variant`)
- **Tertiary:** text only, màu `--tertiary`, underline on hover only

### Input Fields

- Default: `--surface-container-low`
- Focus: shift sang `--surface-container-lowest` + 2px `--primary` underline animate từ center
- Không dùng heavy border on focus

### Border Radius

| Element | Value |
|---|---|
| Button, card, input | `var(--radius)` = `0.5rem` |
| Chip, badge, avatar | `rounded-full` |
| Modal | `0.75rem` |

### Progress Bars

- Track: `--primary-fixed-dim` / Fill: `--primary`

### Mastery Chips

- Background `--secondary-container`, text `--on-secondary-container`, `rounded-full`

### Tables

- Không border line — zebra striping: row chẵn dùng `--surface-container-low`

---

## 5. Do's & Don'ts

**Do:**
- Embrace "Ma" — section trông trống thì giữ nguyên, đừng nhồi thêm
- Dùng tonal shift để phân tách — không dùng border

**Don't:**
- Không pure black — luôn dùng `--on-surface`
- Không shadow mặc định shadcn cho card thông thường
- Không crowd sidebar — `p-12` top padding bắt buộc