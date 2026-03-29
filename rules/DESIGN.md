# Design System Document

## 1. Overview & Creative North Star: "Tacho"

This design system is a high-end editorial framework designed to transform Japanese language education into a serene, meditative experience. Eschewing the frantic, gamified layouts of modern apps, our Creative North Star is **Tacho**.

The interface mimics the tactile elegance of traditional Japanese block prints and fine Vietnamese calligraphy. We achieve a premium feel through **intentional asymmetry**, where content is balanced rather than centered, and a **non-linear layout** that guides the eye like a brushstroke across a canvas. This system breaks the "bootstrap template" aesthetic by using deep indigo depth against weathered cream surfaces, ensuring every pixel feels like a deliberate piece of art.

---

## 2. Colors: Tonal Serenity

The palette is derived from *The Great Wave off Kanagawa*, prioritizing the interplay between deep indigos and aged paper tones.

-   **Primary (`#002453`) & Primary Container (`#1a3a6d`):** Used for authoritative elements and deep-sea accents. These represent the "Ink" of our scholar's kit.
-   **Surface & Background (`#fff9eb`):** This is the "Fine Paper." It provides the scholarly warmth that keeps the experience gentle on the eyes.
-   **Secondary (`#4a6267`):** Soft grey-blues that act as the mist or the secondary wave, providing a bridge between the dark ink and the paper.

### The "No-Line" Rule
To maintain a "traditional" and "gentle" vibe, **1px solid borders are strictly prohibited** for sectioning. Boundaries must be defined through:    
1.  **Color Shifts:** A section on `surface` transitioning into a `surface-container-low` (`#f9f3e5`) section.
2.  **Negative Space:** Using the `16` (5.5rem) or `20` (7rem) spacing tokens to create breathing room between conceptual blocks.

### Surface Hierarchy & Nesting
Treat the UI as stacked sheets of fine paper. Use `surface-container` tiers to create depth:
*   **Base:** `surface` (`#fff9eb`)
*   **Low Contrast:** `surface-container-low` (`#f9f3e5`) for secondary content blocks.
*   **High Contrast:** `surface-container-highest` (`#e8e2d4`) for focal points like call-to-action cards.

### Signature Textures & Gradients
Avoid flat digital voids. For main CTAs or Hero sections, use subtle linear gradients from `primary` to `primary_container`. This mimics the natural "fade" of woodblock ink, providing a professional polish.

---

## 3. Typography: The Harmony of Scripts

The system employs a bilingual typographic hierarchy to ensure both Vietnamese and Japanese text feel scholarly and balanced.

*   **Japanese & Decorative Headings ('Kiwi Maru' / `notoSerif` equivalent):** Use for `display-lg` through `headline-sm`. This font represents the "Art." It is used for kanji, decorative pull-quotes, and section titles. Its organic, hand-drawn serif qualities evoke traditional brushwork.
*   **Vietnamese Body & Labels ('Nunito' / `beVietnamPro` equivalent):** Use for `title-lg` through `body-sm`. This is the "Knowledge." A clean, rounded sans-serif that ensures high legibility for educational content without feeling cold or industrial.

**Editorial Rule:** Large `display-lg` headings should often be placed with intentional offset or vertical orientation (for Japanese characters) to disrupt the rigid horizontal grid.

---

## 4. Elevation & Depth: Tonal Layering

Traditional design doesn't use artificial drop shadows; it uses physical overlap.

-   **The Layering Principle:** Depth is achieved by placing a `surface-container-lowest` card on a `surface-container-low` section. This creates a soft, natural lift reminiscent of layered rice paper.
-   **Ambient Shadows:** If a floating element (like a modal) is required, use a shadow with a massive blur (32px+) and low opacity (4%-6%). The shadow color must be a tinted version of `on-surface` (`#1d1c13`), never a pure grey.
-   **The "Ghost Border" Fallback:** If accessibility requires a container edge, use the `outline_variant` token at **15% opacity**. This creates a hint of an edge—a "ghost border"—rather than a harsh line.
-   **Glassmorphism:** For top navigation or floating action buttons, use a semi-transparent `surface_bright` with a `backdrop-blur` of 12px. This allows the indigo "waves" of the background to bleed through, softening the interface.

---

## 5. Components: Scholarly Primitives

### Buttons
*   **Primary:** Indigo-to-Blue gradient (`primary` to `primary_container`) with `on_primary` text. Use `xl` (0.75rem) roundedness to keep the vibe "gentle."
*   **Tertiary:** No background, no border. Use `primary` text and a subtle `surface-variant` background on hover.

### Cards & Lists
*   **The Divider Ban:** Strictly forbid 1px horizontal lines between list items. Use vertical white space (`spacing.4`) or alternating backgrounds (`surface` and `surface-container-low`) to separate items.
*   **Selection Chips:** Use `secondary_container` for the active state. The roundedness should be `full` to mimic smooth river stones.

### Text Inputs
*   **Style:** No 4-sided borders. Use a "bottom-only" border using `outline` token at 40% opacity, or a fully filled `surface-container-highest` block. This keeps the scholarly, "notebook" feel.

### Specialized Components
*   **Vertical Kanji Strips:** For decorative headers, use Japanese characters oriented vertically to emphasize the traditional aesthetic.
*   **Calligraphy Stamps:** Use the `tertiary` color (`#3d1d00`) for small, square-framed labels that mimic traditional red signature stamps.

---

## 6. Do's and Don'ts

### Do:
*   **Embrace Asymmetry:** Offset your text blocks. Let the "Great Wave" of the layout flow naturally.
*   **Prioritize Legibility:** Ensure Vietnamese text in 'Nunito' has ample line height (`1.6` or higher) to accommodate diacritics.
*   **Use Intentional Voids:** Treat empty space as a design element, not "missing" content.

### Don't:
*   **Don't Use Pure Black:** Use `on_surface` or `primary` for text. Pure black is too harsh for this "gentle" palette.
*   **Don't Use Sharp Corners:** Avoid the `none` or `sm` roundedness scale. This system lives in the `md` to `xl` range to maintain its softness.
*   **Don't Over-Animate:** Animations should be "slow-in/slow-out" transitions that mimic the sliding of a shoji screen. Avoid bouncy or "snappy" modern transitions.