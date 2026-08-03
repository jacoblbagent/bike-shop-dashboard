# Design Tokens — Bike Shop Dashboard

## Color Palette

### Primary (Trust Blue)
| Token | Hex | Use |
|---|---|---|
| primary-50 | `#eff6ff` | Hover backgrounds, subtle highlights |
| primary-100 | `#dbeafe` | Active nav bg |
| primary-200 | `#bfdbfe` | — |
| primary-300 | `#93c5fd` | Focused inputs border |
| primary-400 | `#60a5fa` | Secondary button hover |
| primary-500 | `#3b82f6` | Link text, active icons |
| primary-600 | `#2563eb` | Primary buttons, links |
| primary-700 | `#1d4ed8` | Button hover/active |
| primary-800 | `#1e40af` | — |
| primary-900 | `#1e3a8a` | Dark accents |

### Neutral (Cool Gray)
| Token | Hex | Use |
|---|---|---|
| neutral-50 | `#f9fafb` | Card backgrounds, modals |
| neutral-100 | `#f3f4f6` | Page background |
| neutral-200 | `#e5e7eb` | Borders, dividers |
| neutral-300 | `#d1d5db` | Disabled borders |
| neutral-400 | `#9ca3af` | Placeholder text |
| neutral-500 | `#6b7280` | Secondary labels, captions |
| neutral-600 | `#4b5563` | Body text, table content |
| neutral-700 | `#374151` | Section headings |
| neutral-800 | `#1f2937` | Page titles, sidebar text |
| neutral-900 | `#111827` | Sidebar bg, dark headers |

### Semantic — Status Colors
| Token | Hex | Use |
|---|---|---|
| success / `#16a34a` | bg `#dcfce7` | Completed orders, in-stock items |
| warning / `#f59e0b` | bg `#fef3c7` | Pending, low stock alerts |
| danger / `#dc2626` | bg `#fee2e2` | Out of stock, failed, errors |

### Sidebar Colors (Fixed)
- Background: `neutral-900` (`#111827`)
- Default text: `neutral-300` (`#d1d5db`)
- Active item bg: `primary-600` (`#2563eb`)
- Hover state: `rgba(255,255,255,0.08)`

---

## Spacing Tokens (4px base grid)

| Token | Pixels | Use |
|---|---|---|
| space-1 | 4px | Inside badges, tight icon gaps |
| space-2 | 8px | Label-field gaps, button padding vertical |
| space-3 | 12px | Small section gaps |
| space-4 | 16px | Default gutter, card content padding |
| space-5 | 20px | — |
| space-6 | 24px | Card-to-card gap, page margins |
| space-8 | 32px | Between major sections |
| space-10 | 40px | Hero areas |
| space-12 | 48px | Full section spacing |
| space-16 | 64px | Page transitions |

---

## Typography Scale (Base: 16px / 1rem)

| Token | Size/Line-height | Weight | Use |
|---|---|---|---|
| text-xs | 0.75rem / 1 (12px) | 500 | Badge labels, table headers |
| text-sm | 0.875rem / 1.25 (14px) | 400 | Helper text, secondary captions |
| text-base | 1rem / 1.5 (16px) | 400 | Body copy, form labels |
| text-lg | 1.125rem / 1.75 (18px) | 600 | Section headings, card titles |
| text-xl | 1.25rem / 1.75 (20px) | 600 | Dialog titles |
| text-2xl | 1.5rem / 2 (24px) | 700 | Page titles |
| text-3xl | 1.875rem / 2.25 (30px) | 700 | Dashboard hero stats |

**Font stack**: `'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`

---

## Border Radius

| Token | Value | Use |
|---|---|---|
| radius-sm | 4px | Badges, small buttons, chips |
| radius-md | 6px | Buttons, inputs, dropdowns |
| radius-lg | 8px | Cards, modals, panels |
| radius-xl | 12px | Hero stat cards, featured components |

---

## Shadows

| Token | Value | Use |
|---|---|---|
| shadow-sm | `0 1px 2px rgba(0,0,0,0.05)` | Default cards, rows |
| shadow-md | `0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -2px rgba(0,0,0,0.1)` | Hovered cards, dropdowns |
| shadow-lg | `0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1)` | Modals, popovers |

---

## Layout Constants

| Token | Value | Use |
|---|---|---|
| sidebar-width | 260px | Expanded sidebar |
| sidebar-collapsed | 64px | Icon-only mode |
| header-height | 56px | Fixed top bar |
| max-content-width | 1400px | Content container cap |

**Grid**: 12-column with 16px gutters. Container padding: 24px left/right. Breakpoints at 768px (tablet), 1024px (laptop), 1280px (desktop).
