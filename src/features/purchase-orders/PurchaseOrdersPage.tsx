import { useState, useEffect, useMemo, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import type { AppDispatch, RootState } from '@/app/store';
import { fetchPurchaseOrders, addPurchaseOrder } from '@/app/store/slices/purchaseOrderSlice';
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
import type { PurchaseOrder, PurchaseOrderItem, PurchaseOrderStatus } from '@/types';
import styles from './PurchaseOrdersPage.module.scss';

const emptyForm = {
  supplierName: '',
  items: [{ productName: '', quantity: 1, unitCost: 0 }] as PurchaseOrderItem[],
  expectedDate: '',
  notes: '',
};

export default function PurchaseOrdersPage() {
  usePageTitle('Purchase Orders');
  const dispatch = useDispatch<AppDispatch>();
  const { purchases, loading } = useSelector((s: RootState) => s.purchases);

  const [search, setSearch] = useState('');
  const [showNewPO, setShowNewPO] = useState(false);
  const [selectedPO, setSelectedPO] = useState<PurchaseOrder | null>(null);
  const location = useLocation();
  const handledNavState = useRef(false);
  const [form, setForm] = useState<typeof emptyForm>({ ...emptyForm, items: [{ ...emptyForm.items[0] }] });

  useEffect(() => {
    dispatch(fetchPurchaseOrders());
  }, [dispatch]);

  const filtered = useMemo(() => {
    if (!search) return purchases;
    const q = search.toLowerCase();
    return purchases.filter(
      (po) =>
        po.poNumber.toLowerCase().includes(q) ||
        po.supplierName.toLowerCase().includes(q) ||
        po.status.toLowerCase().includes(q)
    );
  }, [purchases, search]);

  // Auto-open PO from notification navigation
  useEffect(() => {
    const poId = (location.state as any)?.selectedPOId;
    const poNumber = (location.state as any)?.selectedPONumber;
    if ((poId || poNumber) && purchases.length > 0 && !handledNavState.current) {
      const po = poId
        ? purchases.find((p) => p.id === poId)
        : purchases.find((p) => p.poNumber === poNumber);
      if (po) {
        setSelectedPO(po);
      }
      handledNavState.current = true;
      window.history.replaceState({}, '');
    }
  }, [location.state, purchases]);

  const columns: Column<PurchaseOrder>[] = [
    { key: 'poNumber', header: 'PO #', sortable: true, width: '120px' },
    { key: 'supplierName', header: 'Supplier', sortable: true },
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
      key: 'expectedDate',
      header: 'Expected',
      sortable: true,
      width: '120px',
      render: (row) => (row.expectedDate ? formatDate(row.expectedDate) : '—'),
    },
  ];

  const handleCsv = (rows: Record<string, any>[]) => {
    const valid: PurchaseOrder[] = [];
    for (const row of rows) {
      if (!row.poNumber || !row.supplierName) continue;
      const total = parseFloat(row.total) || 0;
      valid.push({
        id: generateId(),
        poNumber: row.poNumber,
        supplierId: row.supplierId || generateId(),
        supplierName: row.supplierName,
        items: row.items ? (typeof row.items === 'string' ? JSON.parse(row.items) : row.items) : [],
        subtotal: parseFloat(row.subtotal) || total,
        tax: parseFloat(row.tax) || 0,
        total,
        status: (row.status as PurchaseOrderStatus) || 'Pending',
        expectedDate: row.expectedDate || undefined,
        notes: row.notes,
        createdAt: row.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }
    if (valid.length > 0) {
      valid.forEach((po) => dispatch(addPurchaseOrder(po)));
    }
  };

  const handleCreatePO = () => {
    const subtotal = form.items.reduce((s, i) => s + i.unitCost * i.quantity, 0);
    const tax = Math.round(subtotal * 0.08);
    const total = subtotal + tax;
    const newPO: PurchaseOrder = {
      id: generateId(),
      poNumber: `PO-${String(purchases.length + 2001).padStart(4, '0')}`,
      supplierId: generateId(),
      supplierName: form.supplierName,
      items: form.items,
      subtotal,
      tax,
      total,
      status: 'Draft',
      expectedDate: form.expectedDate || undefined,
      notes: form.notes || undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    dispatch(addPurchaseOrder(newPO));
    setShowNewPO(false);
    setForm({ ...emptyForm, items: [{ ...emptyForm.items[0] }] });
  };

  const addItem = () => {
    setForm((f) => ({
      ...f,
      items: [...f.items, { productId: '', productName: '', productType: 'part' as const, quantity: 1, unitCost: 0, total: 0, received: 0 } as PurchaseOrderItem],
    }));
  };

  const updateItem = (index: number, field: keyof PurchaseOrderItem, value: string | number) => {
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

  const formValid = form.supplierName.trim() && form.items.some((i) => i.productName.trim() && i.unitCost > 0);

  return (
    <div className={styles.page}>

      <Card padding="lg">
        <div className={styles.toolbar}>
          <SearchInput value={search} onChange={setSearch} placeholder="Search purchase orders..." />
          <CsvImportButton onData={handleCsv} label="Import POs" />
          <Button onClick={() => setShowNewPO(true)}>
            New PO
          </Button>
        </div>

        {loading ? (
          <div className={styles.loaderWrap}>
            <LoadingSpinner size="lg" />
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState title={search ? 'No matches' : 'No purchase orders yet'} description={search ? 'No purchase orders match your search' : 'Create a new PO to get started'} />
        ) : (
          <Table
            columns={columns}
            data={filtered}
            keyExtractor={(r) => r.id}
            onRowClick={(r) => setSelectedPO(r)}
            loading={false}
            emptyMessage="No purchase orders found"
          />
        )}
      </Card>

      <Modal
        open={showNewPO}
        onClose={() => setShowNewPO(false)}
        title="New Purchase Order"
        size="lg"
      >
        <div className={styles.form}>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Supplier Name</label>
            <input
              className={styles.formInput}
              value={form.supplierName}
              onChange={(e) => setForm((f) => ({ ...f, supplierName: e.target.value }))}
              placeholder="Enter supplier name"
            />
          </div>

          <div className={styles.formGroup}>
            <div className={styles.formLabelRow}>
              <label className={styles.formLabel}>Items</label>
              <Button variant="ghost" size="sm" onClick={addItem}>
                + Add Item
              </Button>
            </div>
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
                  value={item.unitCost}
                  onChange={(e) => updateItem(i, 'unitCost', parseFloat(e.target.value) || 0)}
                  placeholder="Cost"
                />
                <span className={styles.rowTotal}>
                  {formatCurrency(item.unitCost * item.quantity)}
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
            <label className={styles.formLabel}>Expected Date</label>
            <input
              className={styles.formInput}
              type="date"
              value={form.expectedDate}
              onChange={(e) => setForm((f) => ({ ...f, expectedDate: e.target.value }))}
            />
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
                form.items.reduce((s, i) => s + i.unitCost * i.quantity, 0) * 1.08
              )}
            </div>
            <div className={styles.formActions}>
              <Button variant="outline" onClick={() => setShowNewPO(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreatePO} disabled={!formValid}>
                Create PO
              </Button>
            </div>
          </div>
        </div>
      </Modal>

      {/* PO Detail Modal */}
      <Modal
        open={!!selectedPO}
        onClose={() => setSelectedPO(null)}
        title={selectedPO ? `PO ${selectedPO.poNumber}` : ''}
        size="lg"
      >
        {selectedPO && (
          <>
            <DetailGrid items={[
              { label: 'PO #', value: selectedPO.poNumber },
              { label: 'Supplier', value: selectedPO.supplierName },
              { label: 'Status', value: <StatusBadge status={selectedPO.status} /> },
              { label: 'Expected', value: selectedPO.expectedDate ? formatDate(selectedPO.expectedDate) : '—' },
              { label: 'Created', value: formatDateTime(selectedPO.createdAt) },
              { label: 'Notes', value: selectedPO.notes || '—' },
            ]} />
            <h4 style={{ marginTop: 'var(--space-2xl)', marginBottom: 'var(--space-sm)', fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-text)', paddingBottom: 'var(--space-xs)', borderBottom: '1px solid var(--color-border)' }}>
              Line Items
            </h4>
            <DetailTable
              columns={[
                { key: 'productName', header: 'Item' },
                { key: 'productType', header: 'Type', align: 'right' },
                { key: 'quantity', header: 'Ordered', align: 'right' },
                { key: 'received', header: 'Received', align: 'right' },
                { key: 'unitCost', header: 'Unit Cost', align: 'right', render: (r) => formatCurrency(r.unitCost) },
                { key: 'total', header: 'Total', align: 'right', render: (r) => formatCurrency(r.total) },
              ]}
              rows={selectedPO.items}
              footer={
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                  <div style={{ display: 'flex', gap: 'var(--space-lg)', justifyContent: 'space-between', minWidth: '200px', fontSize: 'var(--font-size-sm)' }}>
                    <span>Subtotal</span>
                    <span>{formatCurrency(selectedPO.subtotal)}</span>
                  </div>
                  <div style={{ display: 'flex', gap: 'var(--space-lg)', justifyContent: 'space-between', minWidth: '200px', fontSize: 'var(--font-size-sm)' }}>
                    <span>Tax</span>
                    <span>{formatCurrency(selectedPO.tax)}</span>
                  </div>
                  <div style={{ display: 'flex', gap: 'var(--space-lg)', justifyContent: 'space-between', minWidth: '200px', fontSize: 'var(--font-size-lg)', fontWeight: 'var(--font-weight-bold)' }}>
                    <span>Total</span>
                    <span>{formatCurrency(selectedPO.total)}</span>
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