export interface Bike {
  id: string;
  brand: string;
  model: string;
  year: number;
  category: BikeCategory;
  frameSize: string;
  color: string;
  sku: string;
  price: number;
  cost: number;
  quantity: number;
  reorderPoint: number;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export type BikeCategory = 'Mountain' | 'Road' | 'Hybrid' | 'Electric' | 'Kids' | 'Gravel' | 'Cyclocross' | 'Cruiser';

export interface Part {
  id: string;
  name: string;
  category: PartCategory;
  brand: string;
  sku: string;
  price: number;
  cost: number;
  quantity: number;
  reorderPoint: number;
  compatibleBrands?: string[];
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export type PartCategory = 'Brakes' | 'Drivetrain' | 'Handlebars' | 'Wheels' | 'Tires' | 'Suspension' | 'Accessories' | 'Tooling' | 'Cleaning' | 'Oils' | 'Cables' | 'Seats' | 'Pedals' | 'Frames';

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address?: string;
  tier: CustomerTier;
  totalSpent: number;
  orderCount: number;
  lastVisit: string;
  notes?: string;
  createdAt: string;
}

export type CustomerTier = 'Bronze' | 'Silver' | 'Gold' | 'Platinum';

export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  total: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  productType: 'bike' | 'part';
  quantity: number;
  unitPrice: number;
  total: number;
}

export type OrderStatus = 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Completed' | 'Cancelled' | 'Refunded';
export type PaymentMethod = 'Cash' | 'Credit Card' | 'Debit Card' | 'Bank Transfer' | 'Store Credit' | 'Financing';

export interface PurchaseOrder {
  id: string;
  poNumber: string;
  supplierId: string;
  supplierName: string;
  items: PurchaseOrderItem[];
  subtotal: number;
  tax: number;
  total: number;
  status: PurchaseOrderStatus;
  expectedDate?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PurchaseOrderItem {
  productId: string;
  productName: string;
  productType: 'bike' | 'part';
  quantity: number;
  unitCost: number;
  total: number;
  received: number;
}

export type PurchaseOrderStatus = 'Draft' | 'Pending' | 'Approved' | 'Shipped' | 'Partial' | 'Received' | 'Cancelled';

export interface Supplier {
  id: string;
  name: string;
  contactName: string;
  email: string;
  phone: string;
  address: string;
  categories: string[];
  leadTimeDays: number;
  paymentTerms: string;
  notes?: string;
  createdAt: string;
}

export interface DashboardMetrics {
  totalRevenue: number;
  revenueTrend: number;
  totalOrders: number;
  ordersTrend: number;
  activeCustomers: number;
  customersTrend: number;
  lowStockItems: number;
  stockTrend: number;
  averageOrderValue: number;
  aovTrend: number;
  pendingPOs: number;
  pendingValue: number;
}

export interface SalesSummary {
  period: string;
  revenue: number;
  orders: number;
  averageOrder: number;
}

export interface TopProduct {
  id: string;
  name: string;
  category: string;
  quantity: number;
  revenue: number;
}

export interface InventoryReport {
  totalItems: number;
  totalValue: number;
  lowStockCount: number;
  categoryBreakdown: { category: string; count: number; value: number }[];
}

export interface PaginationState {
  page: number;
  limit: number;
  total: number;
}

export interface FilterState {
  search: string;
  status?: string;
  category?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}