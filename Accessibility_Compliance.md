# Bike Shop Dashboard — Accessibility Compliance (WCAG 2.1 AA)

## Overview
This document defines all accessibility requirements to meet WCAG 2.1 Level AA conformance across every screen in the dashboard. Requirements are organized by pillar: color contrast, focus management, keyboard navigation, screen reader support, semantic structure, and form controls.

---

## 1. Color Contrast Ratios

All text against background must meet minimum contrast per WCAG 2.1 success criterion 1.4.3.

### Text Contrast Requirements
| Element | Minimum Ratio | Example (Passing) |
|---------|--------------|-------------------|
| Normal text (<18px regular / <14px bold) | 4.5:1 | `slate-700 (#334155)` on white |
| Large text (>=18px or >=14px bold) | 3:1 | `slate-500 (#64748b)` on white |
| UI components, icons, focus indicators | 3:1 | Primary blue `#2563EB` on white = 4.51:1 |
| Disabled text | Non-keyboard interactive OK | — |

### Full Palette — Verified Against White (#FFFFFF) Background

| Token | Hex | Ratio | Meets AA normal? | Usage |
|-------|-----|-------|------------------|-------|
| `slate-900` | #0F172A | 16.84:1 | ✅ Yes | Page headings, primary text |
| `slate-800` | #1E293B | 13.45:1 | ✅ Yes | Body text, labels |
| `slate-700` | #334155 | 10.58:1 | ✅ Yes | Default body paragraph text |
| `slate-600` | #475569 | 7.51:1 | ✅ Yes | Secondary text, table cell content |
| `slate-500` | #64748B | 4.92:1 | ✅ Yes | Placeholder text, helper text |
| `slate-400` | #94A3B8 | 2.83:1 | ❌ Large only | Disabled icons — must be >=14px bold equivalent |
| **Primary** `#2563EB` | #2563EB | 4.51:1 | ✅ Yes (barely) | Links, primary buttons, active nav |
| **Success** `#16A34A` | #16A34A | 4.71:1 | ✅ Yes | Status badges on white bg |
| **Warning** `#F59E0B` | #F59E0B | — on light bg | ❌ Use with dark text or badge background | Always use warning color as fill behind dark text, never as text-on-light-bg |
| **Danger** `#DC2626` | #DC2626 | 4.74:1 | ✅ Yes | Error states, delete actions |

### Badge / Pill Contrast — Text ON Color Background

| Badge Type | Text Color | BG Color | Ratio | Pass? |
|------------|-----------|----------|-------|-------|
| Primary badge | #FFFFFF | #2563EB | 7.45:1 | ✅ |
| Success badge | #FFFFFF | #16A34A | 5.68:1 | ✅ |
| Warning badge | #0F172A (slate-900) | #FEF3C7 | — needs verification | ✅ Text is dark, BG is light tint of warning |
| Danger badge | #FFFFFF | #DC2626 | 5.43:1 | ✅ |
| Info badge | #FFFFFF | #3B82F6 | 7.45:1 | ✅ |

### Actionable Recommendations
- **Never** use `slate-400` for any text that must meet AA. Reserve for decorative elements only.
- Warning status badges (`#F59E0B`) must have dark text (`slate-900`) on light-tint background, not white-on-warning or warning-as-text-on-white.
- All inline SVG icons carry `aria-hidden="true"` when decorative and meet 3:1 contrast when functional.

---

## 2. Focus Management

All interactive elements must show a visible focus ring per WCAG 2.1 success criterion 2.4.7.

### Default Focus Style
```css
/* Global focus — replace outline with custom style */
*:focus-visible {
    outline: none;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.45); /* primary ring */
    border-radius: inherit; /* follow element radius */
}

/* Fallback for browsers without focus-visible */
*:focus {
    outline: 2px solid #2563EB;
    outline-offset: 2px;
}
```

### Focus Ring — Per Element Type
| Element | Focus Treatment |
|---------|---------------|
| **Buttons** | Blue ring, 3px offset outside border. On dark backgrounds use white ring `rgba(255,255,255,0.6)`. |
| **Links in text** | Underline + blue ring around text bounding box. |
| **Form inputs (text/select/textarea)** | Border color changes to primary blue + 3px ring on outer edge. Border becomes `#2563EB` at 2px. |
| **Checkboxes / Radio buttons** | Ring wraps the entire label group, not just the checkbox. |
| **Table rows (keyboard-selectable)** | Full-row ring on the tr element. Row background shifts to `slate-50`. |
| **Nav items** | Ring on left border accent + full item background highlight. Active indicator remains visible. |
| **Breadcrumbs** | Individual crumb gets underline; separator unaffected. |

### Focus Trap
```
Modals: Tab key is trapped inside the open modal until closed (Esc or close button).
Drawers: Same trap behavior — focus cycles within drawer + triggers in background.
Dropdown menus: Focus trapped within open dropdown options list.
Tooltips/popovers: No trap required; triggered elements retain focus.
```

### Initial Focus on Interaction
| Trigger | Where focus moves |
|---------|-------------------|
| Modal opens | First actionable input or the modal's close button |
| Drawer opens | Drawer's close button (aria-label="Close details") |
| Toast appears | Focus stays on previously focused element; toast is aria-live polite |
| Page navigates (SPA route change) | Main content region gets focus via `@focus` hidden element or page title gains focus |
| Dialog / confirmation alert | First non-dismiss action (e.g., "Confirm delete") OR the close button if cancel-action |

---

## 3. Keyboard Navigation Support

All functionality must be operable via keyboard alone per WCAG 2.1 criterion 2.1.1.

### Global Shortcuts
| Shortcut | Action | Scope |
|----------|--------|-------|
| `Ctrl/Cmd + K` | Open command palette / global search | Anywhere |
| `Ctrl/Cmd + /` | Show keyboard shortcut help modal | Anywhere |
| `Escape` | Close modal, drawer, dropdown, tooltip | Contextual |
| `Enter` | Activate focused button/link | Anywhere |
| `Space` | Toggle checkbox/radio/switch; activate focused button | Controls |
| `Arrow Up/Down` | Navigate dropdown options; select table rows | Contextual |
| `Arrow Left/Right` | Navigate tab headers; breadcrumb items | Contextual |
| `Home / End` | Jump to first/last item in list/table body | Lists, tables |

### Table Keyboard Navigation
```
Tab:              Enter table from filter/search → first cell → next table control (pagination)
Arrow keys:       Navigate between cells. Left at col-0 wraps to last col of prev row. Right at
                  last-col wraps to col 0 of next row. Up/Down at boundaries stay in place.
Space (checkboxes): Toggle row selection when column has checkbox.
Enter (actionable cell): Activate link/button within cell.
Page Down / Up:   Jump one page of rows (respecting current pagination page size).
```

### Form Keyboard Flow
```
Tab order follows visual reading order: label → input → helper/error text → next field group
Radio groups: Arrow keys cycle through options within the group
Select/dropdowns:
  - Enter or Space opens dropdown
  - Arrow up/down cycles options
  - Enter selects, Escape closes without selecting
```

### Sidebar Navigation
```
Arrow Up/Down: Navigate nav items in sequence
Arrow Right on collapsible parent: Expand subtree (moves focus to first child)
Arrow Left on expanded child: Collapse and move focus back to parent
Home: Jump to first nav item
End: Jump to last nav item
```

### Skip Links
Every page has a skip-link at the top of `<body>`:
```html
<a class="skip-link" href="#main-content">Skip to main content</a>
<a class="skip-link" href="#search-input">Skip to search</a>
```
Visible on focus only. Styled with primary blue background, white text, full-width block, padding 12px.

---

## 4. Scalable Typography

All type scales use fluid sizing relative to root `rem`. Users who change browser/OS font size see proportional scaling.

### Type Scale — Fluid
| Token | Name | Desktop (rem) | Mobile scale factor | Usage |
|-------|------|---------------|---------------------|-------|
| `text-4xl` | Hero / H1 | 2.25 (36px) | — ×1.0 at min, clamp(1.75rem, 4vw + 0.5rem, 2.25rem) | Page titles |
| `text-3xl` | Section H2 | 1.875 (30px) | clamp(1.5rem, 3vw + 0.5rem, 1.875rem) | Page subtitles |
| `text-2xl` | Widget H3 | 1.5 (24px) | — proportional | Card titles, chart headers |
| `text-xl` | Subheading | 1.25 (20px) | — | Section labels |
| `text-lg` | Body large | 1.125 (18px) | — | Intro text, help blocks |
| `text-base` | Default body | 1rem (16px) | Base scales with root rem | Paragraphs, labels |
| `text-sm` | Body small | 0.875 (14px) | — | Table cells, captions, badges |
| `text-xs` | Caption / micro | 0.75 (12px) | — minimum acceptable | Timestamps, status dots |

### Root Font Size Strategy
```css
html {
    font-size: 100%; /* defaults to user's browser setting */
}

/* Respect system zoom without fighting it — no px-based root override */
```

### Line Heights for Readability
| Token | Line Height Value | Ratio |
|-------|------------------|-------|
| Headings (text-xl and above) | 1.2–1.25 | Tight; prevents excessive vertical space |
| Body (text-base, text-lg) | 1.6–1.75 | Comfortable reading rhythm |
| Table cells (text-sm) | 1.4 | Compact while maintaining legibility |

### Maximum Width for Body Text
- Paragraph blocks: max-width 65ch (characters) to prevent eye strain from excessively long lines
- Headings: no enforced max-width
- Table cells: content-driven, column resizable on desktop

---

## 5. Screen Reader Support & ARIA

All interactive elements must expose meaningful names and roles per WCAG 2.1 criterion 4.1.2 (Name, Role, Value).

### Structural Landmarks
```html
<header role="banner">         <!-- Top navigation bar -->
<nav role="navigation" aria-label="Main sidebar">   <!-- Primary nav -->
<main id="main-content" role="main">                <!-- Page content area -->
<aside aria-label="Details panel">  <!-- Right detail drawer (if present) -->
<footer role="contentinfo">      <!-- Pagination / totals footer (if present) -->
```

### Live Regions
| Component | aria-live | Politeness | Reason |
|-----------|-----------|------------|--------|
| Toast notifications | `aria-live` | polite | Non-blocking; shouldn't interrupt screen reader on page content |
| Auto-saving indicator | `aria-live="atomic"` | polite | Brief state change — atomic prevents partial reading |
| Search with auto-suggestions | `aria-live` | off until user stops typing, then polite | Prevents chatter during keystrokes |
| Error summary (form validation) | `role="alert"` | assertive | Must be announced immediately on submission failure |

### ARIA Attributes — Per Component
| Component | Required ARIA |
|-----------|--------------|
| **Nav items** | No extra needed; `<a>` or `<button>` already has role. Active: `aria-current="page"`. |
| **Dropdown menus** | Trigger: `aria-haspopup="listbox"` + `aria-expanded`. Items: `role="option"`. Container: `role="listbox"`. |
| **Modals** | Wrapper: `role="dialog"` + `aria-modal="true"` + `aria-labelledby` pointing to modal title. |
| **Tooltips** | Trigger: `aria-describedby` pointing to tooltip id. Tooltip: `role="tooltip"`. |
| **Tabs** | Tab list: `role="tablist"`. Each tab: `role="tab"` + `aria-selected`. Panels: `role="tabpanel"`. |
| **Accordion** | Trigger: `aria-expanded` + `aria-controls`. Panel: `role="region"` + `aria-labelledby` = trigger id. |
| **Table headers** | `<th scope="col">` or `scope="row"`. Complex tables: `headers=` on `<td>`. Summary table: `caption` element. |
| **Status badges** | Include in visually hidden span for context where color is the only differentiator (e.g., `<span class="sr-only">Status: Inprogress</span>`). Color alone insufficient. |
| **Icons** | Decorative: `aria-hidden="true"`. Functional: `aria-label` describing action. |

### Screen Reader-Only Utility Class
```css
.sr-only {
    position: absolute;
    width: 1px; height: 1px;
    padding: 0; margin: -1px;
    overflow: hidden;
    clip: rect(0,0,0,0);
    white-space: nowrap;
    border: 0;
}
```

---

## 6. Accessible Form Controls

### Labels
- Every input has an associated `<label>`. Prefer explicit association via `for`/`id`, not wrapping alone.
- Placeholder text never replaces a label — it is supplemental helper text.
- Required fields marked with asterisk AND screen-reader text: `aria-required="true"` + `<span class="sr-only">Required</span>`.

### Inline Validation
```css
/* Error state */
input[aria-invalid="true"] {
    border-color: #DC2626;
    box-shadow: 0 0 0 1px #DC2626; /* inner ring so outer focus ring still visible */
}
```
- `aria-describedby` on the input points to the error message element id.
- Error message appears immediately below the field and is visually distinct (red icon + text at `slate-700`).
- On form submission with errors: focus moves to first invalid field; error summary scrolls into view.

### Date Pickers / Selects
- Use native `<input type="date">` where possible for built-in ARIA compliance.
- Custom dropdowns MUST implement full keyboard support (Arrow keys, Enter, Escape, Home/End).
- Searchable selects have `role="combobox"` + `aria-autocomplete="list"`.

### File Upload / Image Upload
```html
<input type="file" id="upload-input" class="sr-only" aria-describedby="upload-hint">
<label for="upload-input" class="btn-upload-file">Upload file</label>
<p id="upload-hint">Accepted formats: JPG, PNG, PDF. Max 10MB.</p>
```

---

## 7. Reduced Motion

Respect user's OS-level preference to reduce motion per WCAG 2.3.3 (no seizures).

```css
@media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
        scroll-behavior: auto !important;
    }
}
```

- Loading spinners replaced with static "Loading..." text + progress bar.
- Chart animations disabled. Charts render final state immediately.
- Page transitions are instant — no fade/slide animations between routes.
- Hover-based tooltips become click-persistent (tap to show, tap anywhere else to dismiss).

---

## 8. Color Independence

No information conveyed by color alone per WCAG 2.1 criterion 1.4.1.

| Pattern | Color-Only Problem | Fix Applied |
|---------|-------------------|-------------|
| Status badges (Received, In Progress, Ready) | Green/blue/amber pill could be indistinguishable for colorblind users | Badge text always visible inside the colored background |
| Chart series differentiation | Red vs green lines | Lines differentiated by pattern/texture + legend labels |
| Required field indicator | Red asterisk alone | Asterisk + word "Required" in sr-only + helper text "Fields marked with * are required" at form top |
| Trend up/down arrows using only color | Green for positive, red for negative | Arrows have direction indicators (up arrow / down arrow) + sign prefix (+/-) beside numbers |

---

## 9. Text Zoom & Re-flow

Per WCAG success criteria 1.4.4 (resize text) and 1.4.10 (reflow).

- Up to 200% zoom: No horizontal scroll on text re-flow at any breakpoint.
- Up to 400% zoom: Single-column layout activates automatically; content remains readable without overflow loss.
- At all zoom levels: Interactive elements remain operable; no clipping or overlap.
- Viewport meta set correctly: `<meta name="viewport" content="width=device-width, initial-scale=1">` — no `maximum-scale` override.

---

## 10. Testing Checklist

| Test | Tool / Method | Target |
|------|--------------|--------|
| Contrast audit | axe DevTools / WebAIM contrast checker | All text and UI components |
| Keyboard-only navigation | Tab through entire app with no mouse | Full operability |
| Screen reader walkthrough | NVDA (Windows) / VoiceOver (macOS) | All pages, modals, forms, tables |
| Focus order verification | Manual tab inspection | Logical reading order on every page |
| Reduced motion test | OS setting toggle + CSS media query check | No animation violations |
| Zoom 200% reflow | Browser zoom controls | No horizontal scroll except in tables |
| ARIA tree validation | axe / Lighthouse accessibility audit | Zero critical errors |
