# Studio Scholar — Design System

> **Creative North Star:** "The Studio Scholar"
> Cân bằng giữa sự nhẹ nhàng của một buổi chiều nắng vàng và tính kỷ luật của một tạp chí học thuật. Giao diện sạch, thông thoáng và đầy cá tính — không phải SaaS template thông thường.

---

## 1. Triết lý thiết kế

Ba nguyên tắc cốt lõi:

**Intentional Asymmetry** — Phá vỡ grid 12 cột bằng các khoảng trắng không đều, để nội dung "nổi" tự nhiên như mây trên bầu trời, không bị giam cầm trong ô lưới cứng nhắc.

**Tonal Depth** — Không dùng đường kẻ để phân vùng. Ranh giới được tạo ra bởi sự chuyển đổi màu nền giữa các lớp surface. Mọi `border: 1px solid` đều bị cấm trong layout chính.

**Breathing Room** — Khoảng trắng là ngôn ngữ thiết kế. Khi layout cảm thấy chật, thêm space — không thêm container.

---

## 2. Màu sắc

### Quy tắc "No-Line"

> Nghiêm cấm dùng `border` có màu để phân vùng layout. Ranh giới chỉ được tạo bởi sự thay đổi màu nền.
> Nếu cần border vì lý do accessibility (form phức tạp), dùng `outline-variant` ở **15% opacity** — không bao giờ 100%.

### Surface Hierarchy

Xem UI như một chồng giấy fine art được xếp chồng lên nhau:

| Token | Hex | Vai trò |
|---|---|---|
| `surface` | `#f9f9f9` | Nền trang chính |
| `surface-container-low` | `#f3f4f4` | Sidebar, panel phụ |
| `surface-container-lowest` | `#ffffff` | Card tương tác, input |
| `surface-container-high` | `#e6e8e9` | Inset sâu, khu vực recessed |
| `surface-dim` | `#d7dbdb` | Background đặt dưới card trắng để tạo lift |

### Màu chính (Accent Colors)

Không dùng gradient cho accent. Tất cả đều là màu solid:

| Token | Hex | Tên gợi nhớ | Dùng cho |
|---|---|---|---|
| `primary` | `#466906` | Meadow Green | CTA chính, active state, link |
| `primary-container` | `#ddf2b0` | Light Meadow | Badge, chip, tile active |
| `on-primary-container` | `#466906` | — | Text trên primary-container |
| `secondary` | `#005971` | Deep Sky | Button phụ, thông tin trung tính |
| `secondary-container` | `#baeaff` | Morning Sky | Meadow Float, badge phụ |
| `on-secondary-container` | `#005971` | — | Text trên secondary-container |
| `tertiary` | `#af3035` | Wildflower Red | Chỉ dùng cho alert, lỗi, warning — **không dùng cho thành tích tốt** |
| `tertiary-container` | `#fddcdd` | Petal Pink | Background badge lỗi |
| `warning` | `#8a6000` | Amber Field | Trạng thái cần chú ý (không phải lỗi) |
| `warning-container` | `#fef3cd` | Pale Amber | Background badge warning |

### Màu text

| Token | Hex | Dùng cho |
|---|---|---|
| `on-surface` | `#1c2020` | Headline, text chính |
| `on-surface-variant` | `#2f3334` | Body text thông thường |
| `outline` | `#6b7071` | Text phụ, nav item không active |
| `outline-variant` | `#c0c3c4` | Label nhỏ, metadata, date |

> **Không bao giờ dùng `#000000` cho text.** Luôn dùng `on-surface` để giữ độ tương phản mềm, học thuật.

### Semantic Color Rules

Màu sắc phải phản ánh đúng ý nghĩa — không được dùng màu cảm xúc sai:

- ✅ Pass rate 91% → `primary` (xanh lá) — đây là thành tích tốt
- ✅ Lesson "Live" → `secondary` (xanh trời) — trạng thái trung tính
- ✅ Cảnh báo, lỗi → `tertiary` (đỏ wildflower)
- ✅ Cần chú ý nhưng không phải lỗi → `warning` (amber)
- ❌ Không dùng đỏ cho số liệu tích cực

---

## 3. Typography

### Font pairing

| Vai trò | Font | Lý do |
|---|---|---|
| Display & Headline | **Plus Jakarta Sans** | Hình học, rõ ràng, warm — đặt tông chủ đạo |
| Body & Label | **Be Vietnam Pro** | Legibility cao cho data-dense UI, giữ cảm giác scholarly |

### Type Scale

| Token | Size | Weight | Letter-spacing | Dùng cho |
|---|---|---|---|---|
| `display-lg` | 3.5rem | 700 | −0.02em | Hero title, landing screen |
| `headline-lg` | 2rem | 700 | −0.02em | Page title chính |
| `headline-md` | 1.5rem | 600 | −0.02em | Section title |
| `title-md` | 1rem | 500 | 0 | Card header |
| `body-lg` | 1rem | 400 | 0 | Body text chính |
| `body-sm` | 0.875rem | 400 | 0 | Body text phụ, description |
| `label-md` | 0.8125rem | 500 | +0.05em | Nav item, button |
| `label-sm` | 0.75rem | 400 | +0.08em | Metadata, date, uppercase tag |

### Quy tắc hierarchy

Luôn kết hợp `display-sm` headline với `body-lg` subtext. Sự chênh lệch scale lớn tạo ra character đặc trưng của Studio Scholar — bold nhưng gần gũi.

---

## 4. Elevation & Depth

### Nguyên tắc Tonal Layering

Depth không phải là shadow — depth là sự chồng lớp của surface. Đặt card `surface-container-lowest` (trắng) lên nền `surface-dim` (`#d7dbdb`) để tạo lift tự nhiên, không cần một pixel shadow nào.

### Ambient Shadow

Chỉ dùng cho floating element bắt buộc (FAB, modal đang active):

```css
box-shadow: 0 10px 40px rgba(47, 51, 52, 0.06);
```

- Màu shadow phải là tinted version của `on-surface` — không bao giờ dùng `rgba(0,0,0,...)` thuần
- Blur tối thiểu 40px, Y-offset 10px
- Không dùng shadow trong danh sách, card thông thường, hay sidebar

### Ghost Border (fallback accessibility)

```css
border: 1px solid rgba(175, 178, 179, 0.15); /* outline-variant at 15% */
```

---

## 5. Spacing

Dùng thang spacing bội số của 4px:

| Token | Value | Dùng cho |
|---|---|---|
| `spacing-1` | 0.25rem (4px) | Gap nội bộ component nhỏ |
| `spacing-2` | 0.5rem (8px) | Padding icon, gap inline |
| `spacing-3` | 0.75rem (12px) | Gap giữa element trong card |
| `spacing-4` | 1rem (16px) | Padding card, gap giữa card |
| `spacing-6` | 1.5rem (24px) | Section padding |
| `spacing-8` | 2rem (32px) | Khoảng cách giữa section |
| `spacing-12` | 3rem (48px) | Hero margin |
| `spacing-16` | 4rem (64px) | Asymmetric margin cho layout đặc biệt |

**Asymmetric layout:** Cho hero section, dùng `spacing-16` bên trái và `spacing-8` bên phải để tạo cảm giác nội dung "dịch chuyển" khỏi trung tâm — không phải canh giữa đối xứng.

---

## 6. Border Radius

| Token | Value | Dùng cho |
|---|---|---|
| `radius-sm` | 0.5rem (8px) | Nav item, badge nhỏ |
| `radius-md` | 0.75rem (12px) | Button, input, tile nhỏ |
| `radius-lg` | 1rem (16px) | Card thông thường |
| `radius-xl` | 2rem (32px) | Large container, modal |
| `radius-full` | 9999px | Chip/pill, avatar |

---

## 7. Components

### Buttons

**Primary**
```
background: primary (#466906)
color: #ffffff
border-radius: radius-md (0.75rem)
padding: 9px 16px
font: label-md, Be Vietnam Pro
```
Không dùng gradient. Solid color, hover darkens 10%.

**Secondary**
```
background: secondary-container (#baeaff)
color: on-secondary-container (#005971)
border-radius: radius-md
padding: 9px 16px
```
Không có border.

**Tertiary / Ghost**
```
background: transparent
color: primary (#466906)
hover background: surface-container-low
```

---

### Input Fields

```
background: surface-container-lowest (#ffffff)
border: none (mặc định)
border-bottom: 1px solid outline-variant (30% opacity, resting state)
border-radius: radius-sm radius-sm 0 0 (chỉ bo góc trên)
focus: border-bottom đổi sang primary (#466906), 2px
```

Không dùng box-style input truyền thống. Bottom border focus line tạo cảm giác "underline editorial".

---

### Cards

```
background: surface-container-lowest (#ffffff)
border-radius: radius-lg (1rem)
padding: spacing-4 (1rem) spacing-4 (1rem)
```

- Không có divider line giữa các list item
- Dùng `spacing-4` (1rem) vertical gap để phân tách
- Active state: background đổi sang `primary-container` (#ddf2b0)
- Hover state: background đổi sang `surface-container-low` (#f3f4f4)

---

### Chips & Pills

```
border-radius: radius-full (9999px)
padding: 3px 10px
font: label-sm
```

| Loại | Background | Text color |
|---|---|---|
| Green (success, active) | `primary-container` #ddf2b0 | `primary` #466906 |
| Blue (info, new) | `secondary-container` #baeaff | `secondary` #005971 |
| Amber (warning) | `warning-container` #fef3cd | `warning` #8a6000 |
| Red (error, alert) | `tertiary-container` #fddcdd | `tertiary` #af3035 |

---

### Kanji Tile (Japanese content component)

```
width: 38–48px
height: 38–48px
border-radius: radius-md (0.75rem)
font: Plus Jakarta Sans, display-sm
```

| Màu tile | Background | Text |
|---|---|---|
| Green | `primary-container` #ddf2b0 | `primary` #466906 |
| Blue | `secondary-container` #baeaff | `secondary` #005971 |
| Amber | `warning-container` #fef3cd | `warning` #8a6000 |

---

### Progress Bar

```
height: 3px
background (track): rgba(70, 105, 6, 0.09)
background (fill): primary (#466906) — solid, không gradient
border-radius: 9999px
```

**Spark** (đầu thanh tiến trình):
```
width: 6px, height: 6px
border-radius: 50%
background: #ffffff
box-shadow: 0 0 0 2px primary (#466906)
```

---

### Meadow Float (Signature Component)

Component đặc trưng cho insight phụ, "did you know", thông báo không khẩn cấp:

```
background: rgba(186, 234, 255, 0.45)   /* secondary-container tinted */
backdrop-filter: blur(14px)
-webkit-backdrop-filter: blur(14px)
border-radius: radius-lg (1rem)
padding: 11px 14px
```

Không có border. Glassmorphism tạo ranh giới bằng transparency, đúng tinh thần no-line rule.

Icon wrapper bên trong:
```
width: 24px, height: 24px
border-radius: radius-sm (0.5rem)
background: rgba(0, 89, 113, 0.10)
```

---

### Navigation Sidebar

```
background: surface (#f9f9f9)
width: 200–208px
padding: 24px 14px
```

Nav item:
```
padding: 9px 12px
border-radius: radius-sm (0.5rem)
font: label-md, Be Vietnam Pro
color (resting): outline (#6b7071)
color (active): primary (#466906)
background (active): primary-container (#ddf2b0) at 50% opacity → #e8f7d0
```

Nav dot (optional visual anchor):
```
width: 6px, height: 6px
border-radius: 50%
color: currentColor
opacity: 0.4 (resting), 1.0 (active)
```

---

### Stat Cards (Metric Display)

```
background: surface-container-lowest (#ffffff)
border-radius: radius-lg (1rem)
padding: 14px 16px
```

Cấu trúc nội dung:
1. **Label** — `label-sm`, `outline-variant` (#c0c3c4), uppercase, +0.06em letter-spacing
2. **Value** — `display-sm`, Plus Jakarta Sans, −0.02em letter-spacing, màu theo semantic
3. **Delta** — `label-sm`, màu theo chiều hướng (xanh lá nếu tốt, neutral nếu trung tính)

Màu value theo đúng semantic:
- Số học sinh, tăng trưởng → `primary` (#466906)
- Thông tin trung tính → `secondary` (#005971)
- Thành tích, pass rate → `#2d7a00` (dark meadow green)
- Không bao giờ dùng đỏ cho số liệu tích cực

---

## 8. Ambient Background Effects

Để tạo cảm giác "sun-drenched meadow" mà không dùng texture hay gradient nặng, dùng radial ambient blob ở corners:

```css
/* Top-right: Meadow glow */
background: radial-gradient(ellipse, rgba(197, 241, 131, 0.20) 0%, transparent 60%);
position: absolute; top: -100px; right: -60px;
width: 380px; height: 380px;

/* Bottom-left: Sky glow */
background: radial-gradient(ellipse, rgba(151, 222, 252, 0.18) 0%, transparent 60%);
position: absolute; bottom: -20px; left: 50px;
width: 300px; height: 220px;
```

Đây là **background decoration only** — không bao giờ dùng gradient làm màu nền trực tiếp cho component hay button.

---

## 9. Do's and Don'ts

### Do

- Dùng khoảng trắng `spacing-12`+ cho headline section để nội dung "thở"
- Dùng màu tile và chip phù hợp với semantic (xanh lá = tốt, đỏ = lỗi)
- Dùng `radius-xl` (2rem) cho container lớn để giữ cảm giác organic, friendly
- Thêm delta/context nhỏ dưới mỗi stat card — con số đứng một mình thiếu ngữ cảnh
- Dùng asymmetric layout cho hero section (left-heavy, right breathes)

### Don't

- ❌ Dùng `#000000` cho text — luôn dùng `on-surface` (#1c2020)
- ❌ Dùng `border: 1px solid` để phân vùng layout
- ❌ Dùng gradient trực tiếp làm màu nền component (chỉ dùng cho ambient background decoration)
- ❌ Dùng đỏ cho số liệu tích cực
- ❌ Dùng drop shadow từ UI kit thông thường — nếu không trông như ambient light thì quá nặng
- ❌ Thêm container mới khi layout cảm thấy chật — thêm whitespace trước

---

## 10. Accessibility

| Cặp màu | Contrast ratio | Đạt WCAG |
|---|---|---|
| `on-surface` #1c2020 trên `surface` #f9f9f9 | ~15.5:1 | ✅ AAA |
| `primary` #466906 trên `surface` #f9f9f9 | ~7.2:1 | ✅ AAA |
| `secondary` #005971 trên `surface` #f9f9f9 | ~8.4:1 | ✅ AAA |
| `tertiary` #af3035 trên `surface` #f9f9f9 | ~5.8:1 | ✅ AA |
| `outline-variant` #c0c3c4 trên `surface` #f9f9f9 | ~1.9:1 | ⚠️ Decorative only |

> `outline-variant` chỉ được dùng cho decorative text (date, metadata) — không bao giờ cho nội dung cần đọc được.