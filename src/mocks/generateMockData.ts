import type { Bike, Part, Customer, Order, PurchaseOrder, PurchaseOrderItem, Supplier, DashboardMetrics } from '@/types';
import { generateId } from '@/utils';

// ============================================================
// Bike inventory (20 bikes)
// ============================================================
const bikeBrands = ['Trek', 'Specialized', 'Giant', 'Canyon', 'Scott', 'Cannondale', 'Santa Cruz', 'Yeti'];
const bikeModels: Record<string, string[]> = {
  Trek: ['Marlin 7', 'Domane SL5', 'Emonda SL6', 'Fuel EX 8', 'Procaliber 9.6', 'Checkpoint SL5', 'Roscoe 7', 'Verve 3'],
  Specialized: ['Stumpjumper', 'Tarmac SL7', 'Rockhopper', 'Sirrus X 3.0', 'Levo Comp', 'Diverge Sport', 'Epic Evo', 'Allez Sprint'],
  Giant: ['Talon 2', 'Defy Advanced 2', 'Escape 3', 'Trance X 29', 'Contend AR 1', 'Revolt 0', 'Fathom 1', 'FastRoad SL 1'],
  Canyon: ['Torque CF 7', 'Aeroad CF SLX 8', 'Spetral 125 AL 5', 'Endurace CF 7', 'Grail CF SL 7', 'Lux Trail CF 7', 'Roadlite 6'],
  Scott: ['Scale 970', 'Addict RC 30', 'Spark 940', 'Contessa', 'Genius 940', 'Solace Gravel 30', 'Sub Cross 50'],
  Cannondale: ['Trail 6', 'Synapse Carbon 105', 'Topstone 3', 'Scalpel 2', 'SuperSix Evo', 'Quick 4', 'Bad Boy 3'],
  'Santa Cruz': ['Hightower', '5010', 'Bronson', 'Tallboy', 'Megatower', 'Nomad', 'Blur', 'Chameleon'],
  Yeti: ['SB140', 'SB120', 'SB160', 'ARC T1', 'ARC', 'SB130'],
};

const categories = ['Mountain', 'Road', 'Hybrid', 'Electric', 'Kids', 'Gravel', 'Cyclocross', 'Cruiser'] as const;
const frameSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

function generateBikes(): Bike[] {
  const bikes: Bike[] = [];
  let idx = 0;
  for (const brand of bikeBrands) {
    const models = bikeModels[brand] || ['Standard'];
    for (const model of models) {
      if (idx >= 20) break;
      const cat = categories[idx % categories.length];
      const price = Math.floor(Math.random() * 5000 + 500);
      bikes.push({
        id: generateId(),
        brand,
        model,
        year: 2026,
        category: cat as any,
        frameSize: frameSizes[Math.floor(Math.random() * frameSizes.length)],
        color: ['Matte Black', 'Gloss White', 'Navy Blue', 'Racing Red', 'Forest Green', 'Coral', 'Steel Grey'][Math.floor(Math.random() * 7)],
        sku: `BIKE-${brand.substring(0, 3).toUpperCase()}-${Math.floor(Math.random() * 1000)}`,
        price,
        cost: Math.round(price * 0.6),
        quantity: Math.floor(Math.random() * 15) + 1,
        reorderPoint: 3,
        createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date().toISOString(),
      });
      idx++;
    }
    if (idx >= 20) break;
  }
  return bikes;
}

// ============================================================
// Parts (30 parts)
// ============================================================
const partCategories = ['Brakes', 'Drivetrain', 'Handlebars', 'Wheels', 'Tires', 'Suspension', 'Accessories', 'Tooling', 'Cleaning', 'Oils', 'Cables', 'Seats', 'Pedals', 'Frames'];
const partBrands = ['Shimano', 'SRAM', 'Campagnolo', 'Fox', 'RockShox', 'Hope', 'DT Swiss', 'Continental', 'Maxxis', 'Brooks', 'Crank Brothers', 'Park Tool'];

const partNames = [
  'Hydraulic Disc Brake Set', 'Cable Disc Brake Set', 'Rim Brake Calipers',
  '11-Speed Cassette', '12-Speed Chain', 'Crankset 170mm',
  'Carbon Drop Bars', 'Alloy Riser Bars', 'Aero Base Bars',
  '700c Wheelset', '650b Wheelset', 'Carbon Disc Wheels',
  'Road Tire 700x28c', 'MTB Tire 29x2.3', 'Gravel Tire 700x40c',
  'Air Fork 100mm', 'Rear Shock', 'Suspension Dropper Post',
  'Bottle Cage', 'Mudguard Set', 'Pannier Rack',
  'Torque Wrench Set', 'Chain Wear Indicator', 'Tire Levers Set',
  'Degreaser 500ml', 'Bike Wash Concentrate', 'Chain Lube',
  'Shift Cable Set', 'Brake Cable Set', 'Gel Saddle',
];

function generateParts(): Part[] {
  return partNames.map((name, i) => {
    const cat = partCategories[i % partCategories.length];
    const price = Math.floor(Math.random() * 400 + 5);
    return {
      id: generateId(),
      name,
      category: cat as any,
      brand: partBrands[Math.floor(Math.random() * partBrands.length)],
      sku: `PRT-${cat.substring(0, 4).toUpperCase()}-${String(i + 1).padStart(3, '0')}`,
      price,
      cost: Math.round(price * 0.55),
      quantity: Math.floor(Math.random() * 50) + 1,
      reorderPoint: 5,
      createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString(),
    };
  });
}

// ============================================================
// Customers (25)
// ============================================================
const firstNames = ['James', 'Sarah', 'Michael', 'Emily', 'David', 'Jessica', 'Daniel', 'Ashley', 'Robert', 'Megan', 'William', 'Olivia', 'Joseph', 'Sophia', 'Thomas', 'Isabella', 'Charles', 'Ava', 'Christopher', 'Mia', 'Andrew', 'Emma', 'Ryan', 'Grace', 'Nicholas'];
const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Anderson', 'Wilson', 'Taylor', 'Thomas', 'Moore', 'Jackson', 'Martin', 'Lee', 'Thompson', 'White', 'Harris', 'Clark', 'Lewis', 'Walker', 'Hall'];

function generateCustomers(): Customer[] {
  return firstNames.slice(0, 25).map((first, i) => {
    const last = lastNames[i];
    const orderCount = Math.floor(Math.random() * 12) + 1;
    const avgOrder = Math.floor(Math.random() * 1500 + 100);
    const totalSpent = orderCount * avgOrder;
    const tier = totalSpent > 5000 ? 'Platinum' : totalSpent > 2500 ? 'Gold' : totalSpent > 1000 ? 'Silver' : 'Bronze';
    return {
      id: generateId(),
      name: `${first} ${last}`,
      email: `${first.toLowerCase()}.${last.toLowerCase()}@email.com`,
      phone: `(${Math.floor(Math.random() * 900) + 100}) ${Math.floor(Math.random() * 900) + 100}-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`,
      tier: tier as any,
      totalSpent,
      orderCount,
      lastVisit: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
    };
  });
}

// ============================================================
// Orders (40)
// ============================================================
const statuses = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Completed', 'Cancelled', 'Refunded'] as const;
const paymentMethods = ['Credit Card', 'Cash', 'Debit Card', 'Bank Transfer', 'Store Credit'] as const;

function generateOrders(bikes: Bike[], parts: Part[], customers: Customer[]): Order[] {
  return Array.from({ length: 120 }, (_, i) => {
    const customer = customers[Math.floor(Math.random() * customers.length)];
    const numItems = Math.floor(Math.random() * 4) + 1;
    const items: Order['items'] = [];
    let subtotal = 0;

    for (let j = 0; j < numItems; j++) {
      const isBike = Math.random() > 0.5;
      const product = isBike
        ? bikes[Math.floor(Math.random() * bikes.length)]
        : parts[Math.floor(Math.random() * parts.length)];
      const qty = Math.floor(Math.random() * 2) + 1;
      items.push({
        productId: product.id,
        productName: isBike ? `${(product as Bike).brand} ${(product as Bike).model}` : (product as Part).name,
        productType: isBike ? 'bike' : 'part',
        quantity: qty,
        unitPrice: (product as Bike | Part).price,
        total: (product as Bike | Part).price * qty,
      });
      subtotal += product.price * qty;
    }

    const tax = Math.round(subtotal * 0.08);
    // Spread orders across 365 days, weighted more toward recent months
    const daysAgo = Math.floor(Math.random() * Math.random() * 365);

    return {
      id: generateId(),
      orderNumber: `ORD-${String(1000 + i).padStart(4, '0')}`,
      customerId: customer.id,
      customerName: customer.name,
      items,
      subtotal,
      tax,
      total: subtotal + tax,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      paymentMethod: paymentMethods[Math.floor(Math.random() * paymentMethods.length)],
      createdAt: new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString(),
    };
  });
}

// ============================================================
// Suppliers (8)
// ============================================================
function generateSuppliers(): Supplier[] {
  return [
    { name: 'CycleWorld Distributors', contact: 'Mark Stevens', cats: ['Mountain', 'Road', 'Parts'], email: 'mark@cycleworld.com', phone: '(800) 555-0101' },
    { name: 'ProBike Supply Co', contact: 'Lisa Chen', cats: ['Electric', 'Hybrid', 'Accessories'], email: 'lisa@probike.com', phone: '(800) 555-0102' },
    { name: 'RideReady International', contact: 'Tom Bradley', cats: ['Parts', 'Tooling', 'Oils'], email: 'tom@rideread.com', phone: '(800) 555-0103' },
    { name: 'Velomax Corp', contact: 'Anna Kowalski', cats: ['Wheels', 'Tires', 'Frames'], email: 'anna@velomax.com', phone: '(800) 555-0104' },
    { name: 'TrailBlazer Imports', contact: 'Carlos Ruiz', cats: ['Suspension', 'Seats', 'Pedals'], email: 'carlos@trailblazer.com', phone: '(800) 555-0105' },
    { name: 'EcoCycle Parts', contact: 'Sarah Mitchell', cats: ['Cleaning', 'Cables', 'Brakes'], email: 'sarah@ecocycle.com', phone: '(800) 555-0106' },
    { name: 'Precision Components Ltd', contact: 'James Wong', cats: ['Drivetrain', 'Handlebars'], email: 'james@precisioncomp.com', phone: '(800) 555-0107' },
    { name: 'Global Bike Source', contact: 'Emma Davis', cats: ['Gravel', 'Cyclocross', 'Kids'], email: 'emma@globalbike.com', phone: '(800) 555-0108' },
  ].map((s, i) => ({
    id: generateId(),
    name: s.name,
    contactName: s.contact,
    email: s.email,
    phone: s.phone,
    address: `${100 + i * 50} Industrial Blvd, Suite ${i + 100}, Portland, OR 9720${i}`,
    categories: s.cats,
    leadTimeDays: Math.floor(Math.random() * 20) + 5,
    paymentTerms: ['Net 15', 'Net 30', 'Net 60'][Math.floor(Math.random() * 3)],
    createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
  }));
}

// ============================================================
// Purchase Orders (15)
// ============================================================
const poStatuses = ['Draft', 'Pending', 'Approved', 'Shipped', 'Partial', 'Received'] as const;

function generatePurchaseOrders(suppliers: Supplier[], bikes: Bike[], parts: Part[]): PurchaseOrder[] {
  return Array.from({ length: 15 }, (_, i) => {
    const supplier = suppliers[Math.floor(Math.random() * suppliers.length)];
    const numItems = Math.floor(Math.random() * 3) + 1;
    const items: PurchaseOrderItem[] = [];
    let subtotal = 0;

    for (let j = 0; j < numItems; j++) {
      const isBike = Math.random() > 0.5;
      const product = isBike
        ? bikes[Math.floor(Math.random() * bikes.length)]
        : parts[Math.floor(Math.random() * parts.length)];
      const qty = Math.floor(Math.random() * 10) + 2;
      const cost = Math.round((product as Bike | Part).price * 0.55);
      items.push({
        productId: product.id,
        productName: isBike ? `${(product as Bike).brand} ${(product as Bike).model}` : (product as Part).name,
        productType: isBike ? 'bike' : 'part',
        quantity: qty,
        unitCost: cost,
        total: cost * qty,
        received: 0,
      });
      subtotal += cost * qty;
    }

    const tax = Math.round(subtotal * 0.08);
    return {
      id: generateId(),
      poNumber: `PO-${String(2001 + i).padStart(4, '0')}`,
      supplierId: supplier.id,
      supplierName: supplier.name,
      items,
      subtotal,
      tax,
      total: subtotal + tax,
      status: poStatuses[Math.floor(Math.random() * poStatuses.length)],
      expectedDate: new Date(Date.now() + (20 + Math.random() * 40) * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date(Date.now() - Math.random() * Math.random() * 180 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString(),
    };
  });
}

// ============================================================
// Master generator — call once to get all data
// ============================================================
let cached: ReturnType<typeof generateAll> | null = null;

export function generateMockData() {
  if (cached) return cached;
  cached = generateAll();
  return cached;
}

function generateAll() {
  const bikes = generateBikes();
  const parts = generateParts();
  const customers = generateCustomers();
  const suppliers = generateSuppliers();
  const orders = generateOrders(bikes, parts, customers);
  const purchaseOrders = generatePurchaseOrders(suppliers, bikes, parts);
  return { bikes, parts, customers, orders, suppliers, purchaseOrders };
}

export type MockData = ReturnType<typeof mockApi>;

function delay(ms = 200): Promise<void> {
  return new Promise(r => setTimeout(r, ms));
}

export function mockApi() {
  const data = generateMockData();

  return {
    // Bikes
    getBikes: async () => { await delay(250); return data.bikes; },
    getBike: async (id: string) => { await delay(100); return data.bikes.find(b => b.id === id) || null; },
    updateBike: async (id: string, updates: Partial<Bike>) => { await delay(150); const idx = data.bikes.findIndex(b => b.id === id); if (idx >= 0) data.bikes[idx] = { ...data.bikes[idx], ...updates }; return data.bikes[idx]; },
    deleteBike: async (id: string) => { await delay(100); data.bikes = data.bikes.filter(b => b.id !== id); },
    addBike: async (bike: Bike) => { await delay(150); data.bikes.push(bike); return bike; },

    // Parts
    getParts: async () => { await delay(250); return data.parts; },
    getPart: async (id: string) => { await delay(100); return data.parts.find(p => p.id === id) || null; },
    addPart: async (part: Part) => { await delay(150); data.parts.push(part); return part; },

    // Customers
    getCustomers: async () => { await delay(300); return data.customers; },
    getCustomer: async (id: string) => { await delay(100); return data.customers.find(c => c.id === id) || null; },
    addCustomers: async (customers: Customer[]) => { await delay(200); data.customers.push(...customers); return customers; },

    // Orders
    getOrders: async () => { await delay(300); return data.orders; },
    getOrder: async (id: string) => { await delay(100); return data.orders.find(o => o.id === id) || null; },
    updateOrderStatus: async (id: string, status: Order['status']) => { await delay(150); const o = data.orders.find(o => o.id === id); if (o) { o.status = status; o.updatedAt = new Date().toISOString(); } return o; },

    // Suppliers
    getSuppliers: async () => { await delay(250); return data.suppliers; },

    // Purchase Orders
    getPurchaseOrders: async () => { await delay(250); return data.purchaseOrders; },
    updatePOStatus: async (id: string, status: PurchaseOrder['status']) => { await delay(150); const po = data.purchaseOrders.find(p => p.id === id); if (po) { po.status = status; po.updatedAt = new Date().toISOString(); } return po; },

    // Metrics
    getMetrics: async (): Promise<DashboardMetrics> => {
      await delay(200);
      const totalRevenue = data.orders.filter(o => o.status !== 'Cancelled' && o.status !== 'Refunded').reduce((s, o) => s + o.total, 0);
      const completedOrders = data.orders.filter(o => o.status === 'Completed' || o.status === 'Delivered');
      const avgOrder = completedOrders.length > 0 ? Math.round(totalRevenue / completedOrders.length) : 0;
      const lowStockBikes = data.bikes.filter(b => b.quantity <= b.reorderPoint).length;
      const lowStockParts = data.parts.filter(p => p.quantity <= p.reorderPoint).length;
      const pendingPOs = data.purchaseOrders.filter(p => p.status === 'Pending' || p.status === 'Approved');
      return {
        totalRevenue,
        revenueTrend: 12,
        totalOrders: completedOrders.length,
        ordersTrend: 8,
        activeCustomers: data.customers.filter(c => new Date(c.lastVisit).getTime() > Date.now() - 90 * 24 * 60 * 60 * 1000).length,
        customersTrend: 5,
        lowStockItems: lowStockBikes + lowStockParts,
        stockTrend: -3,
        averageOrderValue: avgOrder,
        aovTrend: 4,
        pendingPOs: pendingPOs.length,
        pendingValue: pendingPOs.reduce((s, p) => s + p.total, 0),
      };
    },
  };
}