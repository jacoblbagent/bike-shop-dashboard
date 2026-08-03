import { useState, useEffect, useMemo, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { FiDollarSign, FiPackage } from 'react-icons/fi';
import type { AppDispatch, RootState } from '@/app/store';
import { fetchBikes, fetchParts, addBike, addParts } from '@/app/store/slices/inventorySlice';
import Table, { type Column } from '@/components/common/Table';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import SearchInput from '@/components/common/SearchInput';
import CsvImportButton from '@/components/common/CsvImportButton';
import Modal from '@/components/common/Modal';
import { DetailGrid } from '@/components/common/DetailGrid';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import EmptyState from '@/components/common/EmptyState';
import { formatCurrency, formatDate, generateId } from '@/utils';
import { usePageTitle } from '@/hooks';
import type { Bike, Part } from '@/types';
import styles from './InventoryPage.module.scss';

type Tab = 'bikes' | 'parts';

export default function InventoryPage() {
  usePageTitle('Inventory');
  const dispatch = useDispatch<AppDispatch>();
  const { bikes, parts, loading } = useSelector((s: RootState) => s.inventory);
  const location = useLocation();

  const [activeTab, setActiveTab] = useState<Tab>(() => {
    return location.pathname.includes('/parts') ? 'parts' : 'bikes';
  });
  const [search, setSearch] = useState('');
  const [selectedBike, setSelectedBike] = useState<Bike | null>(null);
  const [selectedPart, setSelectedPart] = useState<Part | null>(null);
  const handledNavState = useRef(false);

  useEffect(() => {
    dispatch(fetchBikes());
    dispatch(fetchParts());
  }, [dispatch]);

  const filteredBikes = useMemo(() => {
    if (!search) return bikes;
    const q = search.toLowerCase();
    return bikes.filter(
      (b) =>
        b.brand.toLowerCase().includes(q) ||
        b.model.toLowerCase().includes(q) ||
        b.category.toLowerCase().includes(q)
    );
  }, [bikes, search]);

  const filteredParts = useMemo(() => {
    if (!search) return parts;
    const q = search.toLowerCase();
    return parts.filter(
      (p) =>
        p.model.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q)
    );
  }, [parts, search]);

  // Auto-open bike/part from notification navigation
  useEffect(() => {
    const bikeId = (location.state as any)?.selectedBikeId;
    const bikeModel = (location.state as any)?.selectedBikeModel;
    const partId = (location.state as any)?.selectedPartId;
    if (handledNavState.current) return;
    if ((bikeId || bikeModel) && bikes.length > 0) {
      const bike = bikeId
        ? bikes.find((b) => b.id === bikeId)
        : bikes.find((b) => b.model === bikeModel);
      if (bike) {
        setSelectedBike(bike);
      }
      handledNavState.current = true;
      window.history.replaceState({}, '');
    } else if (partId && parts.length > 0) {
      const part = parts.find((p) => p.id === partId);
      if (part) {
        setSelectedPart(part);
      }
      handledNavState.current = true;
      window.history.replaceState({}, '');
    }
  }, [location.state, bikes, parts]);

  const bikeColumns: Column<Bike>[] = [
    { key: 'name', header: 'Name', sortable: true, sortKey: 'model', render: (row) => `${row.brand} ${row.model}` },
    {
      key: 'price',
      header: 'Price',
      sortable: true,
      width: '100px',
      render: (row) => <span className={styles.price}>{formatCurrency(row.price)}</span>,
    },
    { key: 'quantity', header: 'Qty', sortable: true, width: '70px' },
  ];

  const partColumns: Column<Part>[] = [
    { key: 'name', header: 'Name', sortable: true, render: (row) => `${row.brand} ${row.model}` },
    {
      key: 'price',
      header: 'Price',
      sortable: true,
      width: '100px',
      render: (row) => <span className={styles.price}>{formatCurrency(row.price)}</span>,
    },
    { key: 'quantity', header: 'Qty', sortable: true, width: '70px' },
  ];

  const handleBikeCsv = (rows: Record<string, any>[]) => {
    const valid: Bike[] = [];
    for (const row of rows) {
      if (!row.brand || !row.model) continue;
      const price = parseFloat(row.price);
      if (isNaN(price)) continue;
      valid.push({
        id: generateId(),
        brand: row.brand,
        model: row.model,
        year: parseInt(row.year) || 2026,
        category: row.category || 'Hybrid',
        frameSize: row.frameSize || 'M',
        color: row.color || 'Black',
        sku: row.sku || `BIKE-IMPORT-${valid.length}`,
        price,
        cost: row.cost ? parseFloat(row.cost) : Math.round(price * 0.6),
        quantity: parseInt(row.quantity) || 1,
        reorderPoint: parseInt(row.reorderPoint) || 3,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }
    if (valid.length > 0) {
      valid.forEach((b) => dispatch(addBike(b)));
    }
  };

  const handlePartCsv = (rows: Record<string, any>[]) => {
    const valid: Part[] = [];
    for (const row of rows) {
      if (!row.model) continue;
      const price = parseFloat(row.price);
      if (isNaN(price)) continue;
      valid.push({
        id: generateId(),
        model: row.model,
        category: row.category || 'Accessories',
        brand: row.brand || 'Generic',
        sku: row.sku || `PRT-IMPORT-${valid.length}`,
        price,
        cost: row.cost ? parseFloat(row.cost) : Math.round(price * 0.55),
        quantity: parseInt(row.quantity) || 1,
        reorderPoint: parseInt(row.reorderPoint) || 5,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }
    if (valid.length > 0) {
      dispatch(addParts(valid));
    }
  };

  const validateBikeCsv = (row: Record<string, any>): string | null => {
    if (!row.brand) return 'brand is required';
    if (!row.model) return 'model is required';
    if (row.price && isNaN(parseFloat(row.price))) return 'price must be numeric';
    return null;
  };

  const validatePartCsv = (row: Record<string, any>): string | null => {
    if (!row.model) return 'model is required';
    if (row.price && isNaN(parseFloat(row.price))) return 'price must be numeric';
    return null;
  };

  return (
    <div className={styles.page}>

      <Card padding="sm" className={styles.tabBar}>
        <button
          className={`${styles.tab} ${activeTab === 'bikes' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('bikes')}
        >
          <FiDollarSign size={15} />
          Bikes
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'parts' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('parts')}
        >
          <FiPackage size={15} />
          Parts
        </button>
      </Card>

      <Card padding="lg">
        <div className={styles.toolbar}>
          <SearchInput value={search} onChange={setSearch} placeholder={`Search ${activeTab}...`} />
          <div className={styles.actions}>
            {activeTab === 'bikes' ? (
              <CsvImportButton
                onData={handleBikeCsv}
                label="Import Bikes"
                validate={validateBikeCsv}
              />
            ) : (
              <CsvImportButton
                onData={handlePartCsv}
                label="Import Parts"
                validate={validatePartCsv}
              />
            )}
          </div>
        </div>

        {loading ? (
          <div className={styles.loaderWrap}>
            <LoadingSpinner size="lg" />
          </div>
        ) : activeTab === 'bikes' ? (
          filteredBikes.length === 0 ? (
            <EmptyState title={search ? 'No matches' : 'No bikes in inventory'} description={search ? 'No bikes match your search' : 'Add bikes via CSV import'} />
          ) : (
            <Table
              columns={bikeColumns}
              data={filteredBikes}
              keyExtractor={(r) => r.id}
              onRowClick={(r) => setSelectedBike(r)}
              loading={false}
              emptyMessage="No bikes found"
            />
          )
        ) : filteredParts.length === 0 ? (
          <EmptyState title={search ? 'No matches' : 'No parts in inventory'} description={search ? 'No parts match your search' : 'Add parts via CSV import'} />
        ) : (
          <Table
            columns={partColumns}
            data={filteredParts}
            keyExtractor={(r) => r.id}
            onRowClick={(r) => setSelectedPart(r)}
            loading={false}
            emptyMessage="No parts found"
          />
        )}
      </Card>

      {/* Bike Detail Modal */}
      <Modal
        open={!!selectedBike}
        onClose={() => setSelectedBike(null)}
        title={selectedBike ? `${selectedBike.brand} ${selectedBike.model}` : ''}
        size="md"
      >
        {selectedBike && (
          <DetailGrid items={[
            { label: '', value: 'Product Details' },
            { label: 'Brand', value: selectedBike.brand },
            { label: 'Model', value: selectedBike.model },
            { label: 'Year', value: selectedBike.year },
            { label: 'Category', value: selectedBike.category },
            { label: 'Frame Size', value: selectedBike.frameSize },
            { label: 'Color', value: selectedBike.color },
            { label: 'SKU', value: selectedBike.sku },
            { label: '', value: 'Pricing & Stock' },
            { label: 'Price', value: formatCurrency(selectedBike.price) },
            { label: 'Cost', value: formatCurrency(selectedBike.cost) },
            { label: 'Margin', value: `${Math.round(((selectedBike.price - selectedBike.cost) / selectedBike.price) * 100)}%` },
            { label: 'Quantity', value: selectedBike.quantity },
            { label: 'Reorder Point', value: selectedBike.reorderPoint },
            { label: '', value: 'Additional Info' },
            { label: 'Description', value: selectedBike.description || '—' },
            { label: 'Added', value: formatDate(selectedBike.createdAt) },
          ]} />
        )}
      </Modal>

      {/* Part Detail Modal */}
      <Modal
        open={!!selectedPart}
        onClose={() => setSelectedPart(null)}
        title={selectedPart?.model ?? ''}
        size="md"
      >
        {selectedPart && (
          <DetailGrid items={[
            { label: '', value: 'Product Details' },
            { label: 'Model', value: selectedPart.model },
            { label: 'Category', value: selectedPart.category },
            { label: 'Brand', value: selectedPart.brand },
            { label: 'SKU', value: selectedPart.sku },
            { label: '', value: 'Pricing & Stock' },
            { label: 'Price', value: formatCurrency(selectedPart.price) },
            { label: 'Cost', value: formatCurrency(selectedPart.cost) },
            { label: 'Margin', value: `${Math.round(((selectedPart.price - selectedPart.cost) / selectedPart.price) * 100)}%` },
            { label: 'Quantity', value: selectedPart.quantity },
            { label: 'Reorder Point', value: selectedPart.reorderPoint },
            { label: '', value: 'Additional Info' },
            { label: 'Compatible Brands', value: selectedPart.compatibleBrands?.join(', ') || 'All' },
            { label: 'Description', value: selectedPart.description || '—' },
            { label: 'Added', value: formatDate(selectedPart.createdAt) },
          ]} />
        )}
      </Modal>
    </div>
  );
}