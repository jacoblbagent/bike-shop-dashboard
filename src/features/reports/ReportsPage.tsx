import { useState, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from 'recharts';
import type { RootState } from '@/app/store';
import Card from '@/components/common/Card';
import MetricCard from '@/components/common/MetricCard';
import Button from '@/components/common/Button';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { formatCurrency, exportToCsv } from '@/utils';
import { usePageTitle } from '@/hooks';
import styles from './ReportsPage.module.scss';

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const CATEGORY_COLORS: Record<string, string> = {
  Mountain: '#4f46e5',
  Road: '#10b981',
  Hybrid: '#f59e0b',
  Electric: '#3b82f6',
  Kids: '#ef4444',
  Gravel: '#8b5cf6',
  Cyclocross: '#ec4899',
  Cruiser: '#14b8a6',
};

const PIE_COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#3b82f6', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6'];

interface ReportData {
  totalInventoryValue: number;
  totalRevenue: number;
  lowStockCount: number;
  avgOrderValue: number;
  monthlySales: { month: string; revenue: number; orders: number }[];
  categoryBreakdown: { category: string; count: number; value: number }[];
}

function buildReportData(state: RootState): ReportData {
  const { bikes, parts } = state.inventory;
  const { orders } = state.sales;

  const allBikes: typeof bikes = bikes || [];
  const allParts: typeof parts = parts || [];
  const allOrders: typeof orders = orders || [];

  const bikeValue = allBikes.reduce((s: number, b: any) => s + b.price * b.quantity, 0);
  const partValue = allParts.reduce((s: number, p: any) => s + p.price * p.quantity, 0);
  const totalInventoryValue = bikeValue + partValue;

  const completedOrders = allOrders.filter(
    (o: any) => o.status === 'Completed' || o.status === 'Delivered'
  );
  const totalRevenue = completedOrders.reduce((s: number, o: any) => s + o.total, 0);
  const avgOrderValue = completedOrders.length > 0
    ? Math.round(totalRevenue / completedOrders.length)
    : 0;

  const lowStockCount =
    allBikes.filter((b) => b.quantity <= b.reorderPoint).length +
    allParts.filter((p) => p.quantity <= p.reorderPoint).length;

  // Monthly sales (last 12 months)
  const monthlySales = Array.from({ length: 12 }, (_, i) => {
    const d = new Date();
    d.setMonth(d.getMonth() - (11 - i));
    const monthKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    const monthOrders = allOrders.filter((o: any) => o.createdAt.startsWith(monthKey));
    return {
      month: MONTH_NAMES[d.getMonth()],
      revenue: monthOrders.reduce((s: number, o: any) => s + o.total, 0),
      orders: monthOrders.length,
    };
  });

  // Category breakdown from bikes
  const catMap = new Map<string, { count: number; value: number }>();
  for (const bike of allBikes) {
    const curr = catMap.get(bike.category) || { count: 0, value: 0 };
    curr.count += bike.quantity;
    curr.value += bike.price * bike.quantity;
    catMap.set(bike.category, curr);
  }
  const categoryBreakdown = Array.from(catMap.entries()).map(([category, data]) => ({
    category,
    ...data,
  }));

  return {
    totalInventoryValue,
    totalRevenue,
    lowStockCount,
    avgOrderValue,
    monthlySales,
    categoryBreakdown,
  };
}

export default function ReportsPage() {
  usePageTitle('Reports');
  const state = useSelector((s: RootState) => s);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate async data load
    const timer = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(timer);
  }, []);

  const data = useMemo(() => buildReportData(state), [state]);

  if (loading) {
    return (
      <div className={styles.page}>
        <div className={styles.metricsGrid}>
          {Array.from({ length: 4 }, (_, i) => (
            <Card key={i} padding="lg" className={styles.metricSkeleton}>
              <div className={styles.skelLine} style={{ width: '50%' }} />
              <div className={styles.skelLineBig} />
            </Card>
          ))}
        </div>
        <div className={styles.chartsRow}>
          <Card padding="lg" className={styles.chartSkeleton}>
            <div className={styles.skelLine} style={{ width: '40%' }} />
            <div className={styles.skelBlock} />
          </Card>
          <Card padding="lg" className={styles.chartSkeleton}>
            <div className={styles.skelLine} style={{ width: '40%' }} />
            <div className={styles.skelBlock} />
          </Card>
        </div>
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const handleExportSales = () => {
    exportToCsv(
      data.monthlySales.map((m) => ({ Month: m.month, Revenue: m.revenue, Orders: m.orders })),
      'monthly-sales-report'
    );
  };

  const handleExportCategory = () => {
    exportToCsv(
      data.categoryBreakdown.map((c) => ({ Category: c.category, 'Item Count': c.count, Value: c.value })),
      'inventory-by-category'
    );
  };

  const handleExportInventory = () => {
    exportToCsv(
      [
        {
          Metric: 'Total Inventory Value',
          Value: formatCurrency(data.totalInventoryValue),
        },
        {
          Metric: 'Total Revenue',
          Value: formatCurrency(data.totalRevenue),
        },
        { Metric: 'Low Stock Count', Value: String(data.lowStockCount) },
        {
          Metric: 'Avg Order Value',
          Value: formatCurrency(data.avgOrderValue),
        },
      ],
      'inventory-summary'
    );
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className={styles.tooltip}>
          <div className={styles.tooltipLabel}>{label}</div>
          {payload.map((entry: any, i: number) => (
            <div key={i} className={styles.tooltipRow} style={{ color: entry.color }}>
              {entry.name}: {entry.name === 'Revenue' ? formatCurrency(entry.value) : entry.value}
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  const PieTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const row = payload[0].payload;
      return (
        <div className={styles.tooltip}>
          <div className={styles.tooltipLabel}>{row.category}</div>
          <div className={styles.tooltipRow}>{row.count} items — {formatCurrency(row.value)}</div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className={styles.page}>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 'var(--space-lg)' }}>
        <Button variant="outline" onClick={handleExportInventory}>
          Export Summary
        </Button>
      </div>
      <div className={styles.metricsGrid}>
        <MetricCard
          label="Total Inventory Value"
          value={formatCurrency(data.totalInventoryValue)}
        />
        <MetricCard
          label="Total Revenue"
          value={formatCurrency(data.totalRevenue)}
        />
        <MetricCard
          label="Low Stock Count"
          value={String(data.lowStockCount)}
          trend={data.lowStockCount > 5 ? 10 : -5}
        />
        <MetricCard
          label="Avg Order Value"
          value={formatCurrency(data.avgOrderValue)}
        />
      </div>

      <div className={styles.chartsRow}>
        <Card padding="lg" className={styles.chartCard}>
          <div className={styles.chartHeader}>
            <div>
              <h3 className={styles.chartTitle}>Sales by Month</h3>
              <p className={styles.chartSubtitle}>Revenue and order volume (12 months)</p>
            </div>
            <Button variant="ghost" size="sm" onClick={handleExportSales}>
              Export
            </Button>
          </div>
          <div className={styles.chartContainer}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.monthlySales}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border-light)" />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 12, fill: 'var(--color-text-muted)' }}
                  axisLine={{ stroke: 'var(--color-border)' }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 12, fill: 'var(--color-text-muted)' }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar
                  dataKey="revenue"
                  name="Revenue"
                  fill="var(--color-accent)"
                  radius={[4, 4, 0, 0]}
                  isAnimationActive={false}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card padding="lg" className={styles.chartCard}>
          <div className={styles.chartHeader}>
            <div>
              <h3 className={styles.chartTitle}>Inventory by Category</h3>
              <p className={styles.chartSubtitle}>Distribution of stock value</p>
            </div>
            <Button variant="ghost" size="sm" onClick={handleExportCategory}>
              Export
            </Button>
          </div>
          <div className={styles.chartContainer}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.categoryBreakdown}
                  dataKey="value"
                  nameKey="category"
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={90}
                  paddingAngle={2}
                  isAnimationActive={false}
                >
                  {data.categoryBreakdown.map((entry, i) => (
                    <Cell
                      key={entry.category}
                      fill={CATEGORY_COLORS[entry.category] || PIE_COLORS[i % PIE_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip content={<PieTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className={styles.legend}>
            {data.categoryBreakdown.map((entry, i) => (
              <div key={entry.category} className={styles.legendItem}>
                <span
                  className={styles.legendDot}
                  style={{
                    background: CATEGORY_COLORS[entry.category] || PIE_COLORS[i % PIE_COLORS.length],
                  }}
                />
                <span className={styles.legendLabel}>{entry.category}</span>
                <span className={styles.legendValue}>{formatCurrency(entry.value)}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}