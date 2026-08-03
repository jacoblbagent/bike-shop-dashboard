# Bike Shop Dashboard — Responsive Breakpoints & Layout Adaptation

## Overview
This document defines the responsive behavior for all dashboard screens across three breakpoints: desktop, tablet, and mobile. All layouts adapt content density, navigation patterns, and component structures to maintain usability at every size.

---

## Breakpoint System

| Token | Min Width | Max Width | Device Target |
|-------|-----------|-----------|---------------|
| `sm` | 0 | <640px | Mobile portrait |
| `md` | 640px | <1024px | Tablet / large phone landscape |
| `lg` | 1024px | <1280px | Small laptop |
| `xl` | 1280px | ∞ | Desktop primary |

**Base-first strategy:** Mobile styles are the default. Breakpoints add complexity as viewport grows.

---

## Navigation Adaptation

### Desktop (>=1280px) — Persistent Sidebar
```
+--- Top Bar (64px fixed) --------------------------------------------------+
|  Global Search       Notifications  [New Sale]  Location  Avatar          |
+-- Sidebar (260px) --+----------------------------------------------------+
|  Logo               |  Main Content Area                                  |
|                     |                                                    |
| > Dashboard         |  Page title / breadcrumbs                           |
|    Inventory        |  Content grid (4-5 columns depending on page)      |
|    Repairs          |                                                    |
|    Work Orders      |                                                    |
|    Customers        |                                                    |
|    Sales            |                                                    |
|    Parts            |                                                    |
|    Suppliers        |                                                    |
|    Calendar         |                                                    |
|    Reports          |                                                    |
|    Employees        |                                                    |
|                     |                                                    |
+---------------------+----------------------------------------------------+
```

- Full sidebar with icons + labels (260px wide)
- Sidebar collapses to icon-only (72px) when toggled
- Content area: calc(100vw - 260px - padding)
- Right details panel available where specified

### Tablet (640px – 1023px) — Collapsible Sidebar
```
+--- Top Bar (56px fixed) -----------------------------------------------+
|  [Hamburger]   Search               Notifications  Avatar              |
+-- Mini Sidebar ---+---------------------------------------------------+
|  (auto-hide)      |  Main Content Area                                 |
|  [icon only]      |                                                    |
|                   |  Page title                                        |
|  > [●]           |  Content grid (2-3 columns)                         |
|    [●]           |  Tables become horizontally scrollable              |
|    [●]           |  Cards adapt to 2-col grid                          |
+--------------------+--------------------------------------------------+
```

- Sidebar auto-hides after user inactivity or initial open
- Mini sidebar overlay (72px) slides in from left as fixed overlay
- Overlay dismissed by tapping content area or close button
- Content area: full viewport width; sidebar overlays when open
- Top bar height reduced to 56px

### Mobile (<640px) — Drawer Navigation
```
+-- Top Bar (52px fixed) ------------------------------------------+
|  [Hamburger]          Title              Notifications Avatar    |
+-----------------------------------------------------------------+
|                                                                  |
|  Main Content Area - Full width                                  |
|                                                                  |
|  Page title                                                      |
|                                                                  |
|  All cards stack vertically (1 column)                            |
|  Tables become card-based detail views                            |
|  Forms go full-width single column                                |
|                                                                  |
+-----------------------------------------------------------------+
```

- Full-screen drawer slides from left with backdrop overlay
- Drawer width: min(85vw, 320px)
- Active state shown via left border accent on active item
- Top bar shows only hamburger + page title + essential actions

---

## Layout Grid — Per Screen Width

| Component | Desktop (xl) | Tablet (md) | Mobile (sm) |
|-----------|-------------|-------------|-------------|
| KPI Cards Row | 4-col grid | 2-col grid | 1-col stack |
| Data Tables | Full table | Horizontally scrollable | Card-based list |
| Charts | Full width, side-by-side | Stacked vertically | Stacked, reduced detail |
| Forms | 2-col with label left | 2-col compact | Single column full-width |
| Modals | Centered, max-w 600px | Centered, 90vw | Bottom sheet, full-width |
| Activity Feed | Side panel (300px) | Below main content | Accordion sections |

---

## Responsive Components

### Stat / KPI Cards
- **Desktop:** Fixed height 120px, icon top-left, trend bottom-right
- **Tablet:** Compact to 96px height, icon + value inline
- **Mobile:** Full-width, padding horizontal 16px, stacked layout

### Data Tables
- **Desktop:** Sticky header, resizable columns, all columns visible
- **Tablet:** Horizontally scrollable container with visible shadow cue; primary columns always visible
- **Mobile:** Each row becomes a card with key-value pairs; expandable detail on tap

### Charts
- **Desktop:** Full chart with legend, tooltips, dual axis where applicable
- **Tablet:** Legend moves below chart, simplified labels
- **Mobile:** Single metric + sparkline/trend strip; tap to expand full chart in modal

### Modals and Drawers
```css
/* Desktop */
.modal { max-width: 600px; border-radius: 14px; }
.drawer { width: 380px; position: fixed; right: 0; }

/* Tablet */
.modal { max-width: 540px; border-radius: 12px; }
.drawer { width: 340px; }

/* Mobile */
.modal { max-width: 100vw; height: 100vh; border-radius: 0; }
.drawer { width: 100vw; bottom-sheet; border-radius: 14px 14px 0 0; }
```

---

## Responsive Behavior — Page by Page

### Dashboard Home
| Breakpoint | Adaptation |
|------------|-----------|
| xl (>=1280px) | 4-col KPI grid, charts side-by-side, activity feed right panel |
| lg (1024-1279px) | 3-col KPI grid, second chart column stacks below first |
| md (640-1023px) | 2-col KPI grid, all charts stacked vertically, activity feed moves below |
| sm (<640px) | Single KPI cards stacked, summary bar at top with horizontal scroll, charts collapsible |

### Inventory Page
| Breakpoint | Adaptation |
|------------|-----------|
| xl | Filter sidebar (280px) + table (flex-grow). Up to 12 columns visible. |
| lg | Sidebar width 240px. Table hides less-important columns (supplier, margin). |
| md | Filters become slide-down panel. Core table columns only, scrollable horizontally. |
| sm | Filters as bottom sheet. Table rows become product cards with image, name, price, stock badge. |

### Repair Orders Page
| Breakpoint | Adaptation |
|------------|-----------|
| xl | Kanban board: 5-7 status columns visible side by side |
| lg | 4-column kanban, rest accessible via tab or dropdown |
| md | Kanban switches to list view with status column + expand to edit |
| sm | Card-based list grouped by status. Swipe gestures for status change. |

### Customer Page
| Breakpoint | Adaptation |
|------------|-----------|
| xl | Search/table left (70%), customer detail panel right (30%) |
| md | Split view with reduced proportions (60/40) |
| sm | Full-width list. Tap row opens full-screen detail below. |

### Calendar View
| Breakpoint | Adaptation |
|------------|-----------|
| xl | Month/week/day toggle visible. 3-col week layout |
| md | Week view primary, month grid compacted. Day header shrinks |
| sm | Single-day scroll. Event list with time slots. Compact month grid as secondary view. |

### Reports
| Breakpoint | Adaptation |
|------------|-----------|
| xl | Report type nav left sidebar + chart area + export toolbar top right |
| md | Filters in drop-down. Chart fills width, stacked vertically if multiple |
| sm | Single metric focus with drill-in tap action. Export as top bar button. |

---

## Touch-Friendly Adaptations (Mobile/Tablet)

- Minimum touch target size: 44x44px on all interactive elements
- Table row tap targets increased to min-height 52px
- Checkbox/radio buttons sized 24x24px visually (hittable area 44x44px via padding)
- Button vertical padding increased to 12px on touch devices
- Hover states replaced with active/press states on touch
- Swipe gestures: Right-to-left opens sidebar, left-to-right closes it
- Long press on table rows triggers context menu (Edit/Duplicate/Delete)
