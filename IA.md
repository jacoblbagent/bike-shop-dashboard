# Bike Shop Dashboard — Information Architecture

## Overview
Internal business dashboard for managing inventory, sales, customers, services, and operations of a bicycle shop. Designed as a single-page application with persistent sidebar navigation.

---

## Site Map / Navigation Hierarchy

```
Dashboard (Home)
├── Inventory
│   ├── Bike Stock
│   ├── Parts & Accessories
│   └── Low Stock Alerts
│
├── Sales
│   ├── Orders
│   │   ├── New Order
│   │   └── Order History
│   └── Quotes / Estimates
│
├── Customers
│   ├── Customer List
│   ├── Warranties & Service Plans
│   └── Loyalty Program
│
├── Calendar
│   ├── Appointments Calendar
│   ├── Work Orders
│   └── Service History
│
├── Suppliers
│   ├── Supplier Directory
│   ├── Purchase Orders
│   └── Invoices Received
│
├── Reports
│   ├── Sales Summary
│   ├── Inventory Valuation
│   ├── Service Revenue
│   └── Top Products
│
└── Settings
    ├── Profile & Account
    ├── Store Configuration
    └── User Roles & Permissions
```

---

## Page-Level IA

### 1. Dashboard Home (Default Landing)
- Quick stats cards: Today's Sales, Open Orders, Low Stock Items, Upcoming Appointments
- Recent activity feed (last 10 transactions/events)
- Charts: Monthly revenue trend, category sales breakdown
- Quick actions bar: New Sale, New Appointment, Add Product

### 2. Inventory
- **Bike Stock**: Table view of all bikes with filters (brand, condition, price range, status)
- **Parts & Accessories**: Categorized table with SKU search, stock count, reorder point
- **Low Stock Alerts**: Auto-generated list filtered by items below reorder threshold

### 3. Sales
- **Orders**: Chronological list with status badges (Pending/Processing/Complete/Refunded)
- **New Order**: Multi-step form — customer select → line items → payment → receipt
- **Quotes**: Draft orders not yet converted to invoices

### 4. Customers
- **Customer List**: Searchable table with contact info, purchase count, lifetime value
- **Warranties**: Active warranty tracking per bike sold
- **Loyalty**: Points balance, tier levels, redemption history

### 5. Calendar
- **Appointments Calendar**: Weekly/monthly view with drag-drop rescheduling
- **Work Orders**: Status pipeline (Intaked → In Progress → Quality Check → Ready)
- **Service History**: Per-customer timeline of past repairs

### 6. Suppliers
- **Supplier Directory**: Contact details, lead times, active products per supplier
- **Purchase Orders**: Draft/confirmed/shipped/received states
- **Invoices Received**: Matched against POs, payment status tracking

### 7. Reports
- All reports are filterable by date range, exportable to CSV/PDF
- Pre-built dashboards with configurable time periods

### 8. Settings
- Store branding, tax rates, user management, notification preferences

---

## Navigation Pattern
- **Persistent sidebar** (collapsible) — full nav on left, icon-only when collapsed
- **Breadcrumbs** below top bar for sub-pages
- **Search bar** in header with global product/customer/order search
- **Notification bell** with count badge
- **User avatar menu** top-right with profile/settings/logout
