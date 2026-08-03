import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Provider } from 'react-redux';
import { store } from '@/app/store';
import { AuthProvider } from '@/features/auth/AuthContext';
import { useAuth } from '@/features/auth/useAuth';
import AppLayout from '@/components/layout/AppLayout';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import LoginPage from '@/features/auth/LoginPage';
import LogoutPage from '@/features/auth/LogoutPage';
import '@/styles/main.scss';

// Lazy load feature pages
const DashboardPage = lazy(() => import('@/features/dashboard/DashboardPage'));
const InventoryPage = lazy(() => import('@/features/inventory/InventoryPage'));
const CustomersPage = lazy(() => import('@/features/customers/CustomersPage'));
const SalesPage = lazy(() => import('@/features/sales/SalesPage'));
const PurchaseOrdersPage = lazy(() => import('@/features/purchase-orders/PurchaseOrdersPage'));
const ReportsPage = lazy(() => import('@/features/reports/ReportsPage'));
const SettingsPage = lazy(() => import('@/features/settings/SettingsPage'));

function PageLoader() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '120px 0' }}>
      <LoadingSpinner size="lg" />
    </div>
  );
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/logout" element={<LogoutPage />} />
      <Route element={<AppLayout />}>
        <Route index element={<Suspense fallback={<PageLoader />}><ProtectedRoute><DashboardPage /></ProtectedRoute></Suspense>} />
        <Route path="inventory/*" element={<Suspense fallback={<PageLoader />}><ProtectedRoute><InventoryPage /></ProtectedRoute></Suspense>} />
        <Route path="customers" element={<Suspense fallback={<PageLoader />}><ProtectedRoute><CustomersPage /></ProtectedRoute></Suspense>} />
        <Route path="sales" element={<Suspense fallback={<PageLoader />}><ProtectedRoute><SalesPage /></ProtectedRoute></Suspense>} />
        <Route path="purchase-orders" element={<Suspense fallback={<PageLoader />}><ProtectedRoute><PurchaseOrdersPage /></ProtectedRoute></Suspense>} />
        <Route path="reports" element={<Suspense fallback={<PageLoader />}><ProtectedRoute><ReportsPage /></ProtectedRoute></Suspense>} />
        <Route path="settings" element={<Suspense fallback={<PageLoader />}><ProtectedRoute><SettingsPage /></ProtectedRoute></Suspense>} />
      </Route>
    </Routes>
  );
}

export default function AppRouter() {
  // Set initial theme from localStorage
  const savedTheme = localStorage.getItem('theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);

  return (
    <Provider store={store}>
      <BrowserRouter>
        <AuthProvider>
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: 'var(--color-surface)',
                color: 'var(--color-text)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-lg)',
                fontSize: 'var(--font-size-sm)',
              },
            }}
          />
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </Provider>
  );
}