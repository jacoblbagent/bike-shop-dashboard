# Component Wireframes — Bike Shop Dashboard Layout System

## Grid System

12-column grid, 16px gutters, max-width container: 1400px

```
Desktop (≥1280px):   |← 260px sidebar →|← 1400px 12-col content →|
    [██████████]    [░▒▓█░▒▓▓▒▓█▒▓░▓▒█░▓▒]

Tablet (≥768px):     sidebar collapses to icons
    [██64px█]    [░▒▓█░▒▓▓▒▓█▒▓░▓▒█░▓▒]

Mobile (<768px):     sidebar off-canvas, single column content
```

## Responsive Breakpoints

| Breakpoint | Width | Behavior |
|---|---|---|
| sm | 0-767px | Sidebar hidden (hamburger toggle). Single column content. 8px gutters. |
| md | 768-1023px | Sidebar icon-only (64px). 2-column grid collapses to full width. 12px gutters. |
| lg | 1024-1279px | Full sidebar. Card rows collapse from 4 to 2 columns. |
| xl | ≥1280px | Full layout. All columns visible. |

## Layout Templates

### A — Full Width Dashboard (Home, Reports)
```
┌─ Sidebar ─┬────────────────── Header ────────────────────┐
│           ├──────────────────────────────────────────────┤
│  ········ │                                              │
│           │  Page Title + Breadcrumb                      │
│           │                                              │
│           │  ┌─ Stat Card ─┬─ Stat ─┬─ Stat ─┬─ Stat ─┐  │
│           │  │    (3)      │   (3)  │   (3)  │   (3)  │  │
│           │  └─────────────┴────────┴────────┴────────┘  │
│           │                                              │
│           │  ┌────── Chart Area (col-span-8) ──────┐     │
│           │  │                                     │     │
│           │  └─────────────────────────────────────┘     │
│           │                                              │
│           │  ┌ Table / List (col-span-12) ───────────┐   │
│           │  │                                       │   │
│           │  └───────────────────────────────────────┘   │
└───────────┴──────────────────────────────────────────────┘
```

### B — Table with Filter Bar (Inventory, Sales, Customers)
```
┌─ Sidebar ─┬───── Header ─────────────────────────────────┐
│           ├──────────────────────────────────────────────┤
│  ········ │                                              │
│           │  Page Title                     [+ Action]   │
│           │                                              │
│           │  ┌──── Search ──┬ Droplists ──┐             │
│           │  └──────────────┴─────────────┘             │
│           │                                              │
│  ········ │  ┌──────── Table / List ──────────────┐      │
│           │  │ ┌───┬───┬───┬───┬───┬───┬───┬───┐ │     │
│           │  │ │ H │       Header Row          │ │     │
│           │  ├─┼───┼───┼───┼───┼───┼───┼───┼───┤ │     │
│           │  │ │   │                               │ │     │
│           │  │ │   │       Data Rows               │ │     │
│           │  │ │   │                               │ │     │
│           │  ├─┴──────────── Row Footer ───────────┤ │     │
│           │  └─────────────────────────────────────┘ │     │
└───────────┴──────────────────────────────────────────────┘
```

### C — Pipeline / Board View (Service Work Orders, Kanban)
```
┌─ Sidebar ─┬───── Header ─────────────────────────────────┐
│           ├──────────────────────────────────────────────┤
│  ········ │                                              │
│           │  Calendar / Timeline Top Bar                  │
│           │                                              │
│           │  ┌ Col A ─┬ Col B ─┬ Col C ─┬ Col D      │   │
│           │  │Card    │Card    │Card    │Card        │   │
│  ········ │  │        │        │        │            │   │
│           │  │Card    │Card    │        │Card        │   │
│           │  └────────┴────────┴────────┴────────────┘    │
└───────────┴──────────────────────────────────────────────┘
```

## Key Component Wireframe Specs

### Sidebar Navigation (260px)
```
┌─────────────────────────────────────┐
│ 🔵 Bike Shop                        │ ← 56px brand area, fixed
├─────────────────────────────────────┤
│ MAIN                                 │ Section label
│ ▣ Dashboard                          │ └─ default active
│ 📦 Inventory                         │    has expandable sub-items
│ 🛒 Sales                             │
│ 👥 Customers                         │
│ 🔧 Calendar                    │
│ 🏢 Suppliers                         │
│ ─────────────────────────────────── │ Section divider
│ REPORTS                              │
│ 📊 Reports                           │
│ SETTINGS                             │
│ ⚙️ Settings                          │
├─────────────────────────────────────┤
│ ● User Name   ▾                     │ ← user profile footer
└─────────────────────────────────────┘
```

### Header / Top Bar (56px, sticky)
```
├───────────────────────────────────────────────────────────┐
│ 🔍 Search products, customers, orders...         🔔(2)  ● │
└────────────────────────────────────────────────────────────┘
   ← search input (center, max-width 480)        ← notification bell badge → user avatar dropdown


## Component Anatomy Reference

### Stat Card (dashboard home)
```
┌─ Card ───────────────────────────────────────┐
│ Icon Circle        Label (sm/500)             │
│                                                 │
│ $2,840                  (2xl/bold)            │
│ +12% from yesterday        green badge         │
└─────────────────────────────────────────────────┘
   ← 3-col span, white bg, shadow-sm, radius-lg
```

### Data Table Row
```
┌──────────────────────┬────────────┬──────────┐
| Checkbox   Image     Name       SKU      Action│
├──────────────────────┼────────────┼──────────┤
| □    [▓▓]      Bike Pro X3    BS-1001  More⋮ │
└──────────────────────┴────────────┴──────────┘
   ← hover state: neutral-50 bg, shadow-md on row
```

### Status Badge
```
[✓ Complete]   — green text on #dcfce7 bg
[⏱ Pending]    — amber text on #fef3c7 bg
[✕ Refunded]   — red text on #fee2e2 bg
[!] Low Stock  — red outline + danger text
```

## Interaction States

| State | Visual Treatment |
|---|---|
| Default sidebar item | neutral-300 text, transparent bg |
| Hover sidebar item       | rgba(255,255,255,0.08) bg |
| Active sidebar item      | primary-600 bg, white text, font-weight 600 |
| Default button           | primary-600 bg, white text, radius-md |
| Hover button            | primary-700 bg |
| Card hover               | shadow-md elevation change |
| Table row hover          | neutral-50 bg |
| Input focus              | primary-500 border, 2px ring in primary-100 |

## Icon System (inline SVG)

Each sidebar nav item uses a 20x20px icon before the label. Icons are stroke-based (2px weight) to keep visual consistency:
- Dashboard: grid/home icon
- Inventory: box/package icon  
- Sales: shopping cart / tag icon
- Customers: people/users icon
- Calendar: wrench/tools icon
- Suppliers: building icon
- Reports: bar chart icon
- Settings: gear/cog icon

Bell notification icon in header uses filled variant with red badge dot.
