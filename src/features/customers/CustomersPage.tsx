import { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '@/app/store';
import { fetchCustomers, addCustomers } from '@/app/store/slices/customerSlice';
import Table, { type Column } from '@/components/common/Table';
import Card from '@/components/common/Card';
import SearchInput from '@/components/common/SearchInput';
import CsvImportButton from '@/components/common/CsvImportButton';
import Modal from '@/components/common/Modal';
import { DetailGrid } from '@/components/common/DetailGrid';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import EmptyState from '@/components/common/EmptyState';
import StatusBadge from '@/components/common/StatusBadge';
import { formatCurrency, formatDate, generateId } from '@/utils';
import { usePageTitle } from '@/hooks';
import type { Customer } from '@/types';
import styles from './CustomersPage.module.scss';

export default function CustomersPage() {
  usePageTitle('Customers');
  const dispatch = useDispatch<AppDispatch>();
  const { customers, loading } = useSelector((s: RootState) => s.customers);

  const [search, setSearch] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  useEffect(() => {
    dispatch(fetchCustomers());
  }, [dispatch]);

  const filtered = useMemo(() => {
    if (!search) return customers;
    const q = search.toLowerCase();
    return customers.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.phone.includes(q) ||
        c.tier.toLowerCase().includes(q)
    );
  }, [customers, search]);

  const columns: Column<Customer>[] = [
    { key: 'name', header: 'Name', sortable: true },
    { key: 'email', header: 'Email', sortable: true },
    { key: 'phone', header: 'Phone' },
    {
      key: 'tier',
      header: 'Tier',
      sortable: true,
      width: '90px',
      render: (row) => <StatusBadge status={row.tier} />,
    },
    { key: 'orderCount', header: 'Orders', sortable: true, width: '80px' },
    {
      key: 'totalSpent',
      header: 'Total Spent',
      sortable: true,
      width: '120px',
      render: (row) => <span className={styles.currency}>{formatCurrency(row.totalSpent)}</span>,
    },
    {
      key: 'lastVisit',
      header: 'Last Visit',
      sortable: true,
      width: '120px',
      render: (row) => formatDate(row.lastVisit),
    },
  ];

  const handleCsv = (rows: Record<string, any>[]) => {
    const valid: Customer[] = [];
    for (const row of rows) {
      if (!row.name || !row.email) continue;
      valid.push({
        id: generateId(),
        name: row.name,
        email: row.email,
        phone: row.phone || '',
        tier: row.tier || 'Bronze',
        totalSpent: parseFloat(row.totalSpent) || 0,
        orderCount: parseInt(row.orderCount) || 0,
        lastVisit: row.lastVisit || new Date().toISOString(),
        createdAt: new Date().toISOString(),
      });
    }
    if (valid.length > 0) {
      dispatch(addCustomers(valid));
    }
  };

  const validateCsv = (row: Record<string, any>): string | null => {
    if (!row.name) return 'name is required';
    if (!row.email) return 'email is required';
    return null;
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Customers</h1>
          <p className={styles.subtitle}>{customers.length} total customers</p>
        </div>
      </div>

      <Card padding="lg">
        <div className={styles.toolbar}>
          <SearchInput value={search} onChange={setSearch} placeholder="Search customers..." />
          <CsvImportButton
            onData={handleCsv}
            label="Import Customers"
            validate={validateCsv}
          />
        </div>

        {loading ? (
          <div className={styles.loaderWrap}>
            <LoadingSpinner size="lg" />
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState title={search ? 'No matches' : 'No customers yet'} description={search ? 'No customers match your search' : 'Import customers via CSV'} />
        ) : (
          <Table
            columns={columns}
            data={filtered}
            keyExtractor={(r) => r.id}
            onRowClick={(r) => setSelectedCustomer(r)}
            loading={false}
            emptyMessage="No customers found"
          />
        )}
      </Card>

      <Modal
        open={!!selectedCustomer}
        onClose={() => setSelectedCustomer(null)}
        title={selectedCustomer?.name ?? 'Customer Details'}
        size="md"
      >
        {selectedCustomer && (
          <DetailGrid items={[
            { label: 'Email', value: selectedCustomer.email },
            { label: 'Phone', value: selectedCustomer.phone || '—' },
            { label: 'Tier', value: <StatusBadge status={selectedCustomer.tier} /> },
            { label: 'Orders', value: selectedCustomer.orderCount },
            { label: 'Total Spent', value: formatCurrency(selectedCustomer.totalSpent) },
            { label: 'Last Visit', value: formatDate(selectedCustomer.lastVisit) },
          ]} />
        )}
      </Modal>
    </div>
  );
}