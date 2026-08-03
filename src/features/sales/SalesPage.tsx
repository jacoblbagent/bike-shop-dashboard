import { useLocation } from 'react-router-dom';
import { useState, useEffect, useMemo, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '@/app/store';
import { fetchOrders, addOrder } from '@/app/store/slices/salesSlice';
import Table, { type Column } from '@/components/common/Table';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import SearchInput from '@/components/common/SearchInput';
import CsvImportButton from '@/components/common/CsvImportButton';
import Modal from '@/components/common/Modal';
import { DetailGrid, DetailTable } from '@/components/common/DetailGrid';
import StatusBadge from '@/components/common/StatusBadge';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import EmptyState from '@/components/common/EmptyState';
import { formatCurrency, formatDate, formatDateTime, generateId } from '@/utils';
import { usePageTitle } from '@/hooks';
import type { Order, OrderItem, OrderStatus, PaymentMethod } from '@/types';
import styles from './SalesPage.module.scss';

const emptyForm = {
  customerName: '',
  items: [{ productId: '', productName: '', productType: 'bike' as const, quantity: 1, unitPrice: 0, total: 0 }] as OrderItem[],
  paymentMethod: 'Credit Card' as PaymentMethod,
  notes: '',
};

interface FormItem {
  productName: string;
  quantity: number;
  unitPrice: number;
}

export default function SalesPage() {
  usePageTitle('Sales');
  const dispatch = useDispatch<AppDispatch>();
  const { orders, loading } = useSelector((s: RootState) => s.sales);

  const [search, setSearch] = useState('');
  const [showNewOrder, setShowNewOrder] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const location = useLocation();
  const handledNavState = useRef(false);
  const [form, setForm] = useState<{
    customerName: string;
    items: { productName: string; quantity: number; unitPrice: number }[];
    paymentMethod: PaymentMethod;
    notes: string;
  }>({ ...emptyForm, items: [{ ...emptyForm.items[0] }] });

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  const filtered = useMemo(() => {
    if (!search) return orders;
    const q = search.toLowerCase();
    return orders.filter(
      (o) =>
        o.orderNumber.toLowerCase().includes(q) ||
        o.customerName.toLowerCase().includes(q) ||
        o.status.toLowerCase().includes(q)
    );
  }, [orders, search]);

  // Auto-open order from customer page navigation
  useEffect(() => {
    const orderId = (location.state as any)?.selectedOrderId;
    const orderNumber = (location.state as any)?.selectedOrderNumber;
    if ((orderId || orderNumber) && orders.length > 0 && !handledNavState.current) {
      const order = orderId
        ? orders.find((o) => o.id === orderId)
        : orders.find((o) => o.orderNumber === orderNumber);
      if (order) {
        setSelectedOrder(order);
      }
      handledNavState.current = true;
      window.history.replaceState({}, '');
    }
  }, [location.state, orders]);

  const columns: Column<Order>[] = [
    { key: 'orderNumber', header: 'Order #', sortable: true, width: '120px' },
    { key: 'customerName', header: 'Customer', sortable: true },
    {
      key: 'items',
      header: 'Items',
      width: '80px',
      render: (row) => `${row.items.length} item${row.items.length !== 1 ? 's' : ''}`,
    },
    {
      key: 'total',
      header: 'Total',
      sortable: true,
      width: '110px',
      render: (row) => <span className={styles.currency}>{formatCurrency(row.total)}</span>,
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      width: '120px',
      render: (row) => row.status,
    },
    {
      key: 'createdAt',
      header: 'Date',
      sortable: true,
      width: '120px',
      render: (row) => formatDate(row.createdAt),
    },
  ];

  const handleCsv = (rows: Record<string, any>[]) => {
    const valid: Order[] = [];
    for (const row of rows) {
      if (!row.orderNumber || !row.customerName) continue;
      const total = parseFloat(row.total) || 0;
      valid.push({
        id: generateId(),
        orderNumber: row.orderNumber,
        customerId: row.customerId || generateId(),
        customerName: row.customerName,
        items: row.items ? (typeof row.items === 'string' ? JSON.parse(row.items) : row.items) : [],
        subtotal: parseFloat(row.subtotal) || total,
        tax: parseFloat(row.tax) || 0,
        total,
        status: (row.status as OrderStatus) || 'Pending',
        paymentMethod: (row.paymentMethod as PaymentMethod) || 'Credit Card',
        notes: row.notes,
        createdAt: row.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }
    if (valid.length > 0) {
      valid.forEach((o) => dispatch(addOrder(o)));
    }
  };

  const handleCreateOrder = () => {
    const subtotal = form.items.reduce((s, i) => s + i.unitPrice * i.quantity, 0);
    const tax = Math.round(subtotal * 0.08);
    const total = subtotal + tax;
    const newOrder: Order = {
      id: generateId(),
      orderNumber: `ORD-${String(orders.length + 1001).padStart(4, '0')}`,
      customerId: generateId(),
      customerName: form.customerName,
      items: form.items.map(i => ({
        productId: generateId(),
        productName: i.productName,
        productType: 'bike' as const,
        quantity: i.quantity,
        unitPrice: i.unitPrice,
        total: i.unitPrice * i.quantity,
      })),
      subtotal,
      tax,
      total,
      status: 'Pending',
      paymentMethod: form.paymentMethod,
      notes: form.notes || undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    dispatch(addOrder(newOrder));
    setShowNewOrder(false);
    setForm({ ...emptyForm, items: [{ ...emptyForm.items[0] }] });
  };

  const addItem = () => {
    setForm((f) => ({
      ...f,
      items: [...f.items, { productId: '', productName: '', productType: 'bike' as const, quantity: 1, unitPrice: 0, total: 0 } as OrderItem],
    }));
  };

  const updateItem = (index: number, field: keyof OrderItem, value: string | number) => {
    setForm((f) => ({
      ...f,
      items: f.items.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      ),
    }));
  };

  const removeItem = (index: number) => {
    setForm((f) => ({
      ...f,
      items: f.items.filter((_, i) => i !== index),
    }));
  };

  const formValid = form.customerName.trim() && form.items.some((i) => i.productName.trim() && i.unitPrice > 0);

  return (
    <div className={styles.page}>

      <Card padding="lg">
        <div className={styles.toolbar}>
          <SearchInput value={search} onChange={setSearch} placeholder="Search orders..." />
          <CsvImportButton onData={handleCsv} label="Import Orders" />
          <Button onClick={() => setShowNewOrder(true)}>
            New Order
          </Button>
        </div>

        {loading ? (
          <div className={styles.loaderWrap}>
            <LoadingSpinner size="lg" />
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState title={search ? 'No matches' : 'No orders yet'} description={search ? 'No orders match your search' : 'Create a new order to get started'} />
        ) : (
          <Table
            columns={columns}
            data={filtered}
            keyExtractor={(r) => r.id}
            onRowClick={(r) => setSelectedOrder(r)}
            loading={false}
            emptyMessage="No orders found"
          />
        )}
      </Card>

      <Modal
        open={showNewOrder}
        onClose={() => setShowNewOrder(false)}
        title="New Order"
        size="lg"
      >
        <div className={styles.form}>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Customer Name</label>
            <input
              className={styles.formInput}
              value={form.customerName}
              onChange={(e) => setForm((f) => ({ ...f, customerName: e.target.value }))}
              placeholder="Enter customer name"
            />
          </div>

          <div className={styles.formGroup}>
            <div className={styles.formLabelRow}>
              <label className={styles.formLabel}>Items</label>
              <Button variant="ghost" size="sm" onClick={addItem}>
                + Add Item
              </Button>
            </div>
            {form.items.length > 0 && (
              <div className={styles.formRowHeader}>
                <span className={styles.hdrProduct}>Product</span>
                <span className={styles.hdrQty}>Qty</span>
                <span className={styles.hdrPrice}>Price</span>
                <span className={styles.hdrTotal}>Total</span>
                {form.items.length > 1 && <span style={{ width: '32px' }} />}
              </div>
            )}
            {form.items.map((item, i) => (
              <div key={i} className={styles.formRow}>
                <input
                  className={styles.formInput}
                  value={item.productName}
                  onChange={(e) => updateItem(i, 'productName', e.target.value)}
                  placeholder="Product name"
                />
                <input
                  className={styles.formInputQty}
                  type="number"
                  min={1}
                  value={item.quantity}
                  onChange={(e) => updateItem(i, 'quantity', Math.max(1, parseInt(e.target.value) || 1))}
                />
                <input
                  className={styles.formInputPrice}
                  type="number"
                  min={0}
                  step="0.01"
                  value={item.unitPrice}
                  onChange={(e) => updateItem(i, 'unitPrice', parseFloat(e.target.value) || 0)}
                  placeholder="Price"
                />
                <span className={styles.rowTotal}>
                  {formatCurrency(item.unitPrice * item.quantity)}
                </span>
                {form.items.length > 1 && (
                  <button className={styles.removeBtn} onClick={() => removeItem(i)}>
                    ✕
                  </button>
                )}
              </div>
            ))}
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Payment Method</label>
            <select
              className={styles.formInput}
              value={form.paymentMethod}
              onChange={(e) => setForm((f) => ({ ...f, paymentMethod: e.target.value as PaymentMethod }))}
            >
              <option value="Credit Card">Credit Card</option>
              <option value="Cash">Cash</option>
              <option value="Debit Card">Debit Card</option>
              <option value="Bank Transfer">Bank Transfer</option>
              <option value="Store Credit">Store Credit</option>
              <option value="Financing">Financing</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Notes</label>
            <textarea
              className={styles.formTextarea}
              value={form.notes}
              onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
              placeholder="Optional notes..."
              rows={3}
            />
          </div>

          <div className={styles.formFooter}>
            <div className={styles.totalDisplay}>
              Total: {formatCurrency(
                form.items.reduce((s, i) => s + i.unitPrice * i.quantity, 0) * 1.08
              )}
            </div>
            <div className={styles.formActions}>
              <Button variant="outline" onClick={() => setShowNewOrder(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateOrder} disabled={!formValid}>
                Create Order
              </Button>
            </div>
          </div>
        </div>
      </Modal>

      {/* Order Detail Modal */}
      <Modal
        open={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
        title={selectedOrder ? `Order ${selectedOrder.orderNumber}` : ''}
        size="lg"
      >
        {selectedOrder && (
          <>
            <DetailGrid items={[
              { label: 'Order #', value: selectedOrder.orderNumber },
              { label: 'Customer', value: selectedOrder.customerName },
              { label: 'Status', value: <StatusBadge status={selectedOrder.status} /> },
              { label: 'Payment', value: selectedOrder.paymentMethod },
              { label: 'Date', value: formatDateTime(selectedOrder.createdAt) },
              { label: 'Notes', value: selectedOrder.notes || '—' },
            ]} />
            <h4 style={{ marginTop: 'var(--space-2xl)', marginBottom: 'var(--space-sm)', fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-text)', paddingBottom: 'var(--space-xs)', borderBottom: '1px solid var(--color-border)' }}>
              Line Items
            </h4>
            <DetailTable
              columns={[
                { key: 'productName', header: 'Item' },
                { key: 'productType', header: 'Type', align: 'right' },
                { key: 'quantity', header: 'Qty', align: 'right' },
                { key: 'unitPrice', header: 'Price', align: 'right', render: (r) => formatCurrency(r.unitPrice) },
                { key: 'total', header: 'Total', align: 'right', render: (r) => formatCurrency(r.total) },
              ]}
              rows={selectedOrder.items}
              footer={
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                  <div style={{ display: 'flex', gap: 'var(--space-lg)', justifyContent: 'space-between', minWidth: '200px', fontSize: 'var(--font-size-sm)' }}>
                    <span>Subtotal</span>
                    <span>{formatCurrency(selectedOrder.subtotal)}</span>
                  </div>
                  <div style={{ display: 'flex', gap: 'var(--space-lg)', justifyContent: 'space-between', minWidth: '200px', fontSize: 'var(--font-size-sm)' }}>
                    <span>Tax (8%)</span>
                    <span>{formatCurrency(selectedOrder.tax)}</span>
                  </div>
                  <div style={{ display: 'flex', gap: 'var(--space-lg)', justifyContent: 'space-between', minWidth: '200px', fontSize: 'var(--font-size-lg)', fontWeight: 'var(--font-weight-bold)' }}>
                    <span>Total</span>
                    <span>{formatCurrency(selectedOrder.total)}</span>
                  </div>
                </div>
              }
            />
          </>
        )}
      </Modal>
    </div>
  );
}