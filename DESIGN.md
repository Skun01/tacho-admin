# Design System: Tacho Admin (Admin Frontend) — v2 Monochromatic Crimson

## 1. Creative North Star

**"The Digital Kanso"** — Lấy cảm hứng từ _Kanso_ (simplicity) và _Ma_ (negative space) của thẩm mỹ Nhật Bản. Đây là một digital dojo.

Phong cách: **high-end editorial**. Asymmetric layout, tonal depth, typography được đối xử như thư pháp. Tránh xa "cluttered dashboard" trope.

**v2 Direction:** Toàn bộ palette thống nhất về nhiệt độ màu **warm crimson**. Sidebar deep burgundy tạo chiều sâu, surfaces có warm tint nhẹ — loại bỏ hoàn toàn sự va chạm cool/warm của v1.

---

## 2. Color Tokens

> Dark mode apply qua class `dark` trên `<html>` — không dùng `prefers-color-scheme`.

| Token                         | Light     | Dark      | Dùng cho                                             |
| ----------------------------- | --------- | --------- | ---------------------------------------------------- |
| `--primary`                   | `#8f0020` | `#ffb3bc` | Primary CTA, progress fill, active state             |
| `--primary-container`         | `#bc002d` | `#690016` | Gradient end của primary button                      |
| `--primary-fixed-dim`         | `#f5c0c8` | `#930020` | Progress bar track                                   |
| `--secondary`                 | `#1a0008` | `#f2c4cc` | Sidebar background (dark) / sidebar text (dark mode) |
| `--secondary-container`       | `#f5dde0` | `#4a1520` | Selection chip background                            |
| `--on-secondary-container`    | `#3d0011` | `#ffdde2` | Selection chip text                                  |
| `--tertiary`                  | `#7a2535` | `#f5b8c4` | Tertiary button text                                 |
| `--surface`                   | `#fdf7f6` | `#1c1210` | Base background — warm tint                          |
| `--surface-container-low`     | `#f8f0ef` | `#221615` | Secondary sections, zebra row                        |
| `--surface-container-lowest`  | `#ffffff` | `#150d0c` | Interactive cards ("lift" effect)                    |
| `--surface-container-high`    | `#efe4e3` | `#2a1b1a` | Background behind cards                              |
| `--surface-container-highest` | `#e8d8d7` | `#321f1e` | Card body                                            |
| `--on-surface`                | `#1c0f0e` | `#f0e0de` | Body text — warm near-black                          |
| `--on-surface-variant`        | `#6b3a38` | `#d4a8a5` | Section titles, secondary text                       |
| `--outline-variant`           | `#e8c4c2` | `#5a2e2c` | Ghost border base (20% opacity)                      |

### Contrast ratios (WCAG)

Tất cả token pairs đã được kiểm tra và pass AA (≥4.5:1):

| Pair                                 | Light      | Dark       |
| ------------------------------------ | ---------- | ---------- |
| `--on-surface` / `--surface`         | 17.6:1 AAA | 14.4:1 AAA |
| `--on-surface` / card                | 18.7:1 AAA | 15.0:1 AAA |
| `--on-surface-variant` / `--surface` | 8.7:1 AAA  | 8.7:1 AAA  |
| `--on-secondary-container` / chip bg | 13.5:1 AAA | 11.8:1 AAA |
| `--tertiary` / `--surface`           | 9.2:1 AAA  | 11.0:1 AAA |

### Sidebar text rule

Sidebar background là `#1a0008` (light) / vẫn dùng deep dark trong dark mode.

- Mọi text trên sidebar dùng `#ffffff` hoặc `--primary` (`#ffb3bc` dark) — **không** dùng `--on-surface`
- Nav labels: `rgba(255,255,255,0.6)`
- Active item text: `#ffffff`

`--primary` reserved cho "Moments of Progression" — submit, bắt đầu bài học, primary CTA. Không dùng cho decorative elements.

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

Floating elements (modal, popover): `box-shadow: 0 12px 40px rgba(28, 15, 14, 0.08)`

### Sidebar

- Background: `#1a0008` (solid cả light lẫn dark mode)
- Tablet+: `backdrop-filter: blur(12px)` (glassmorphism overlay)
- Mobile: solid, không glassmorphism
- Active item: vertical stripe `--primary` 4px left edge + `background: rgba(255,255,255,0.08)`
- **Text color:** `#ffffff` cho nav items, `rgba(255,255,255,0.55)` cho nav labels — không dùng `--on-surface`
- Logo / brand text: `--primary` (`#ffb3bc` dark / `#ffffff` light)

### Buttons

- **Primary:** gradient `--primary` → `--primary-container`, `border-radius: var(--radius)`
- **Secondary:** transparent + ghost border (20% `--outline-variant`)
- **Tertiary:** text only, màu `--tertiary` (`#7a2535` light / `#f5b8c4` dark), underline on hover only — **bắt buộc `font-size ≥ 1rem`** để đảm bảo AA

### Input Fields

- Default: `--surface-container-low`
- Focus: shift sang `--surface-container-lowest` + 2px `--primary` underline animate từ center
- Không dùng heavy border on focus

### Border Radius

| Element             | Value                      |
| ------------------- | -------------------------- |
| Button, card, input | `var(--radius)` = `0.5rem` |
| Chip, badge, avatar | `rounded-full`             |
| Modal               | `0.75rem`                  |

### Progress Bars

- Track: `--primary-fixed-dim` (`#f5c0c8` / `#930020`) / Fill: `--primary`

### Mastery Chips

- Background `--secondary-container`, text `--on-secondary-container`, `rounded-full`

### Tables

- Không border line — zebra striping: row chẵn dùng `--surface-container-low`

---

## 5. Do's & Don'ts

**Do:**

- Embrace "Ma" — section trông trống thì giữ nguyên, đừng nhồi thêm
- Dùng tonal shift để phân tách — không dùng border
- Giữ toàn bộ màu trong vùng warm (đỏ / nâu / hồng) — không mix cool blue/green

**Don't:**

- Không pure black — luôn dùng `--on-surface` (`#1c0f0e`)
- Không crowd sidebar — `p-12` top padding bắt buộc
- Không dùng `--on-surface` làm text trên sidebar `#1a0008` — contrast chỉ 1.07:1
