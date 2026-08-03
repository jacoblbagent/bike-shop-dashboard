# Bike Shop Dashboard

A full-featured bike shop management dashboard built with React 19, TypeScript, and Redux Toolkit. Features inventory management, sales tracking, customer management, purchase orders, reporting, and CSV import/export.

**Live:** [luxury-fox-8618dc.netlify.app](https://luxury-fox-8618dc.netlify.app)

---

## Tech Stack

| Layer | Stack |
|-------|-------|
| Framework | React 19, TypeScript 5.8 |
| State | Redux Toolkit, RTK Query, React-Redux 9 |
| Routing | React Router 7 |
| UI | IBM Carbon Design System (dark theme), SCSS modules |
| Charts | Recharts 2 |
| Forms | React Hook Form 7, Zod validation |
| Notifications | react-hot-toast |
| Icons | react-icons |
| Build | Vite 6, ESLint 9 flat config |
| Deploy | Netlify |

## Features

- **Dashboard** — revenue, sales, inventory summary with interactive charts
- **Inventory** — manage bike inventory with search, filter, and CSV import
- **Customers** — customer directory with detail views
- **Sales Orders** — order management and tracking
- **Purchase Orders** — supplier order management
- **Reports** — sales performance, inventory status, and exportable reports
- **Settings** — application configuration
- **Auth** — login/logout with protected routes
- **CSV Import** — bulk import data via PapaParse

## Getting Started

```bash
# Install dependencies
npm install

# Start dev server (host: 0.0.0.0)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint
npm run lint
```

## Project Structure

```
src/
├── app/
│   ├── router/          # React Router config + lazy-loaded routes
│   └── store/           # Redux store, slices (customer, inventory, PO, sales, UI)
├── components/
│   ├── common/          # Button, Card, Modal, Table, SearchInput, etc.
│   └── layout/          # AppLayout, Sidebar, Header, MobileNav, navConfig
├── features/
│   ├── auth/            # AuthContext, LoginPage, LogoutPage
│   ├── customers/       # Customers page
│   ├── dashboard/       # Dashboard page with charts
│   ├── inventory/       # Inventory management
│   ├── purchase-orders/ # Purchase order management
│   ├── reports/         # Reporting page
│   ├── sales/           # Sales order management
│   └── settings/        # Settings page
├── hooks/               # Shared custom hooks
├── mocks/               # Mock data generation
├── services/            # API service layer
├── styles/
│   ├── abstracts/       # Variables, mixins, breakpoints
│   └── base/            # Reset, typography
├── types/               # TypeScript type definitions
└── utils/               # Utility functions
```

## Deployment

The dashboard is deployed on Netlify. Manual deploy:

```bash
npm run build
npx netlify deploy --dir=dist --prod
```

## Sample Data

Sample CSV files for import are in `sample-imports/`:
- `bikes.csv`
- `customers.csv`
- `orders.csv`
- `parts.csv`
- `purchase-orders.csv`

## Auth

Default login credentials are configured in the auth context. Routes are protected behind authentication — unauthenticated users are redirected to `/login`.