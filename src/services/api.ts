import type { Bike, Part, Customer, Order, Supplier, PurchaseOrder, DashboardMetrics } from '@/types';

const BASE = '/api';

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${url}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) throw new Error(`API error: ${res.status} ${res.statusText}`);
  // Handle 204 No Content
  if (res.status === 204) return undefined as T;
  return res.json();
}

export const api = {
  // Bikes
  getBikes: () => request<Bike[]>('/bikes'),
  getBike: (id: string) => request<Bike | null>(`/bikes/${id}`),
  updateBike: (id: string, updates: Partial<Bike>) =>
    request<Bike>(`/bikes/${id}`, { method: 'PUT', body: JSON.stringify(updates) }),
  deleteBike: (id: string) =>
    request<void>(`/bikes/${id}`, { method: 'DELETE' }),
  addBike: (bike: Bike) =>
    request<Bike>('/bikes', { method: 'POST', body: JSON.stringify(bike) }),

  // Parts
  getParts: () => request<Part[]>('/parts'),
  getPart: (id: string) => request<Part | null>(`/parts/${id}`),
  addPart: (part: Part) =>
    request<Part>('/parts', { method: 'POST', body: JSON.stringify(part) }),

  // Customers
  getCustomers: () => request<Customer[]>('/customers'),
  getCustomer: (id: string) => request<Customer | null>(`/customers/${id}`),
  addCustomers: (customers: Customer[]) =>
    request<Customer[]>('/customers', { method: 'POST', body: JSON.stringify(customers) }),

  // Orders
  getOrders: () => request<Order[]>('/orders'),
  getOrder: (id: string) => request<Order | null>(`/orders/${id}`),
  updateOrderStatus: (id: string, status: Order['status']) =>
    request<Order>(`/orders/${id}/status`, { method: 'PUT', body: JSON.stringify({ status }) }),

  // Suppliers
  getSuppliers: () => request<Supplier[]>('/suppliers'),
  createSupplier: (supplier: Supplier) =>
    request<Supplier>('/suppliers', { method: 'POST', body: JSON.stringify(supplier) }),

  // Purchase Orders
  getPurchaseOrders: () => request<PurchaseOrder[]>('/purchase-orders'),
  updatePOStatus: (id: string, status: PurchaseOrder['status']) =>
    request<PurchaseOrder>(`/purchase-orders/${id}/status`, { method: 'PUT', body: JSON.stringify({ status }) }),
  createPurchaseOrder: (po: PurchaseOrder) =>
    request<PurchaseOrder>('/purchase-orders', { method: 'POST', body: JSON.stringify(po) }),

  // Metrics
  getMetrics: () => request<DashboardMetrics>('/metrics'),
};

// For backward compatibility — resetApi is a no-op with a real backend
export function resetApi() {}

export default api;