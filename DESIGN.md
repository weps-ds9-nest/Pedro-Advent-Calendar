---
name: Pedro Pascal Advent Calendar
description: A pixel-art advent calendar course for web development.
colors:
  primary: "#e0b020"
  accent: "#f5c842"
  background: "#0a0d1a"
  background-deep: "#060914"
  surface: "#111527"
  border: "#1a1f38"
  crimson: "#c0392b"
  crimson-light: "#e74c3c"
  jade: "#27ae60"
  jade-light: "#2ecc71"
typography:
  display:
    fontFamily: "Press Start 2P, Courier New, monospace"
    fontSize: "clamp(1.5rem, 4vw, 2.5rem)"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "-0.02em"
  body:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.5
rounded:
  sm: "2px"
  md: "4px"
spacing:
  sm: "8px"
  md: "16px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.background-deep}"
    rounded: "{rounded.sm}"
    padding: "8px 16px"
  button-primary-hover:
    backgroundColor: "{colors.accent}"
---

# Design System: Pedro Pascal Advent Calendar

## 1. Overview

**Creative North Star: "Pixelized Holiday Workshop"**

A cozy pixel-art workspace focusing on build-and-learn, retro typography, and festive ornaments. The design layout is high-contrast, playful, and responsive, mimicking the aesthetics of a classic 8-bit holiday game. Rather than modern SaaS minimalism, this interface embraces sharp corner radii, dark-themed space backgrounds with star/snow overlays, and bold solid borders that structure content clearly.

This system rejects flat gray SaaS borders, blurred glassmorphism, and soft shadows, replacing them with crisp tonal layering, retro font highlights, and high-energy springy transitions for a tactile hardware-like response.

**Key Characteristics:**
- Monospace retro heading styles paired with highly readable sans-serif content text.
- Solid color-tinted borders to denote container boundaries and interactive states.
- High-energy micro-animations (springy scale-ups, bouncy door unlocks) that respect user reduced-motion preferences.

## 2. Colors

A midnight space palette accented by bright, festive pixel lights in gold, jade, and crimson.

### Primary
- **Gold-500** (#e0b020): The primary action and theme color. Used for progress tracks, primary buttons, and key interactive highlights.

### Secondary
- **Gold-400** (#f5c842): The glowing accent state. Used for hovering interactive elements and shimmer effects.

### Neutral
- **Navy-950** (#060914): Deep background fill, establishing the dark sky canvas.
- **Navy-900** (#0a0d1a): Primary layout backgrounds and structural pages.
- **Navy-800** (#111527): Surface panels, container cards, and door backdrops.
- **Navy-700** (#1a1f38): Default borders and inactive division lines.

### Named Rules
**The Contrast Spark Rule.** Bright accents (gold, jade, crimson) are used exclusively to guide the user's attention (such as unlock status, complete badges, errors, or call-to-actions). Surfacing and structure must rely strictly on Navy tones to maintain visual comfort.

## 3. Typography

**Display Font:** Press Start 2P (with fallback Courier New, monospace)
**Body Font:** Inter (with fallback ui-sans-serif, system-ui, sans-serif)

**Character:** Retro monospace for display and status titles, paired with a modern sans-serif body for clean, legible reading of educational content.

### Hierarchy
- **Display** (700, clamp(1.5rem, 4vw, 2.5rem), 1.2): Main titles, hero sections, and large numbers.
- **Headline** (700, 1.5rem, 1.3): Section headers and major card titles.
- **Title** (600, 1.125rem, 1.4): Small sub-headers, door labels, and item titles.
- **Body** (400, 1rem, 1.5): Reading content and lesson step instructions. Max line length capped at 70ch for readability.
- **Label** (700, 0.75rem, uppercase): Badges, buttons, state indicators, and tooltips.

### Named Rules
**The Monospace Accent Rule.** Monospace text is strictly reserved for short headers, status badges, buttons, and numeric counters. All paragraphs, descriptions, and long-form lesson content must use the sans-serif body stack.

## 4. Elevation

The system is flat by design, utilizing tonal layering (differing Navy values) and solid borders to create layers. Soft CSS blurs, floating shadows, and 3D effects are forbidden.

### Named Rules
**The Flat Layering Rule.** Surfaces are flat at rest. Depth is established through distinct background fills and solid, color-tinted border lines. Do not use box-shadows or backdrop-filters.

## 5. Components

### Buttons
- **Shape:** Sharp sharp corners (2px radius / sm)
- **Primary:** Gold background (#e0b020), deep navy text (#060914), solid border (#1a1f38).
- **Hover / Focus:** Scale up to 1.05 with springy transition, bright gold background (#f5c842).
- **Secondary / Ghost:** Dark background, gold border, gold text.

### Cards / Containers
- **Corner Style:** Sharp (4px / md)
- **Background:** Navy-800 (#111527)
- **Border:** Navy-700 (#1a1f38) or accent borders (#e0b020) for active focus.

### Door (Signature Component)
- **Style:** A square card representing an advent calendar door. Uses flat Navy-800 background, crisp borders, and a centered pixel icon.
- **States:**
  - *Locked*: Lock icon, lower opacity, flat border.
  - *Active*: Bright gold border (#e0b020), springy scale-up on hover.
  - *Completed*: Jade border (#27ae60) with a mini completed check badge.

## 6. Do's and Don'ts

### Do:
- **Do** pair retro monospace headers with clean sans-serif body copy.
- **Do** use flat, solid, color-tinted borders to group and layer elements.
- **Do** add springy scale transitions to interactive buttons and doors, wrapping them in prefers-reduced-motion media query checks.

### Don't:
- **Don't** use a basic corporate SaaS admin template look with thin gray borders.
- **Don't** use soft drop-shadows or glassmorphism/blurs.
- **Don't** use gradient text backgrounds.
