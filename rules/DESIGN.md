# Design System Specification: Cinematic Learning Interface

## 1. Overview & Creative North Star
**Creative North Star: "The Celestial Archive"**

This design system moves away from the sterile, utilitarian nature of typical administration panels. Instead, it treats the management of Japanese language data as an act of cosmic curation. Inspired by the sprawling night skies and vibrant comet trails of Shinkai-esque landscapes, the system utilizes high-contrast typography, deep tonal layering, and "light-bleed" aesthetics to create a premium, cinematic experience.

To break the "template" look, layouts should lean into **Intentional Asymmetry**. Key metrics or callouts should be offset from the main grid, and background elements (like subtle comet-trail gradients) should bleed across container boundaries to create a sense of vast, uncontained space.

---

## 2. Colors
The palette is a transition from the deep, obsidian depths of the night sky to the electric energy of a falling comet.

### The Palette (Core Tokens)
- **Background (`#080e1d`):** The midnight base. Never use pure black; this deep navy maintains atmospheric depth.
- **Primary (`#7de9ff`):** The "Comet Core." Used for active states and critical information.
- **Secondary (`#bdc2ff`):** The "Evening Mist." A softened violet-blue for supportive UI elements.
- **Tertiary (`#ffd16f`):** The "City Glow." Warm, high-contrast accents used for highlights and celebratory feedback (e.g., student achievements).

### The "No-Line" Rule
**Strict Prohibition:** 1px solid borders are forbidden for sectioning. 
Boundaries must be defined by:
1. **Background Color Shifts:** Use `surface_container_low` against `surface` to define a sidebar.
2. **Tonal Transitions:** Use a soft gradient transition from `surface` to `surface_container_high` to indicate a header.

### The "Glass & Gradient" Rule
Floating elements (modals, dropdowns, hovered cards) must use **Glassmorphism**.
- **Surface:** `surface_variant` with 60% opacity.
- **Effect:** `backdrop-blur: 12px`.
- **Accent:** A subtle 1px "Ghost Border" using `outline_variant` at 15% opacity to catch light, mimicking the edge of a glass lens.

---

## 3. Typography
We use a high-contrast pairing to balance "Modern Cinematic" with "Educational Clarity."

- **Display & Headlines (Plus Jakarta Sans):** Chosen for its wide, geometric stance. Use `display-lg` and `headline-md` with generous letter-spacing (-0.02em) to evoke a premium, editorial feel.
- **Body & Labels (Inter):** The workhorse for educational content. Inter’s tall x-height ensures kanji and kana remain legible even at `body-sm`.
- **Hierarchy Logic:** Use `tertiary` (`#ffd16f`) for small `label-md` tags to make them pop against the dark background, acting like distant city lights.

---

## 4. Elevation & Depth
In this system, depth is not "shadow"; depth is "atmosphere."

### Tonal Layering
Instead of shadows, we stack the surface tiers:
- **Base Level:** `surface` (The sky).
- **Secondary Level:** `surface_container_low` (Distanced clouds/panels).
- **Interactive Level:** `surface_container_highest` (Foreground focus/active cards).

### Ambient Shadows
Where a floating effect is mandatory (e.g., a "New Lesson" modal), use an **Ambient Light Shadow**:
- **Color:** `on_surface` (at 6% opacity).
- **Blur:** 40px to 60px spread. 
- **Offset:** No Y-offset; the light source is omnipresent, not directional.

---

## 5. Components

### Buttons
- **Primary:** `primary` background with `on_primary` text. Apply a subtle outer glow (box-shadow) using the `primary` color at 20% opacity to mimic a glowing comet.
- **Secondary:** Transparent background with a `ghost-border` (outline-variant at 20%). On hover, fill with `secondary_container`.
- **Corner Radius:** Use `md` (0.75rem) for a modern, approachable feel.

### Input Fields
- **Architecture:** Forgo the "box" look. Use a `surface_container_lowest` background with a bottom-only `outline_variant` (30% opacity). 
- **Focus State:** The bottom border transitions to `primary` with a soft `primary_dim` glow bleed.

### Progress Bars (Lesson Tracking)
- **Style:** Use a linear gradient from `secondary` to `primary`. 
- **Detail:** Add a small "spark" (a pure white circle with a 4px blur) at the leading edge of the progress bar to represent the comet head.

### Cards & Lists
- **Rule:** Forbid divider lines.
- **Spacing:** Use `spacing-6` (1.5rem) to separate list items. 
- **Separation:** Use a subtle background shift to `surface_container_low` on hover to provide feedback without cluttering the UI with lines.

---

## 6. Do's and Don'ts

### Do
- **DO** use the `spacing-20` scale for generous top-margins on headlines to create an "Editorial" feel.
- **DO** use semi-transparent `tertiary` glows for "Correct Answer" or "Pass" states to mimic city warmth.
- **DO** overlap elements (e.g., a character illustration slightly overlapping a lesson card) to break the grid.

### Don't
- **DON'T** use 100% opaque borders. It kills the "ethereal" cinematic quality.
- **DON'T** use pure white (`#FFFFFF`) for body text. Use `on_surface_variant` (`#9faace`) to reduce eye strain in dark mode.
- **DON'T** use traditional Material Design shadows. They look "muddy" against a deep blue background; stick to tonal layering and wide ambient glows.