import { useEffect, useState, useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Link, useNavigate } from 'react-router-dom';
import MetricCard from '@/components/common/MetricCard';
import Skeleton from '@/components/common/Skeleton';
import Card from '@/components/common/Card';
import Table, { type Column } from '@/components/common/Table';
import type { DashboardMetrics, Order } from '@/types';
import { formatCurrency, formatDate, formatRelativeDate } from '@/utils';
import api from '@/services/api';
import styles from './DashboardPage.module.scss';

// ── Chart helpers ──────────────────────────────────────────────

interface RevenueMonth {
  key: string;
  label: string;
  revenue: number;
}

interface ChartTooltipProps {
  active?: boolean;
  payload?: { value: number }[];
  label?: string;
  formatter?: (v: number) => string;
}

function ChartTooltip({ active, payload, label, formatter = v => formatCurrency(v) }: ChartTooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className={styles.chartTooltip}>
      <div className={styles.tooltipLabel}>{label}</div>
      <div className={styles.tooltipValue}>{formatter(payload[0].value)}</div>
    </div>
  );
}

function getCutoff(timeFrame: TimeFrame, customStart?: string): Date {
  if (timeFrame === 'custom' && customStart) return new Date(`${customStart}T00:00:00`);
  const now = new Date();
  switch (timeFrame) {
    case '7d':  return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    case '30d': return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    case '90d': return new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
    case '12m': return new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
    case 'custom': return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  }
}

/** Generate month buckets from the cutoff month through the current month (or the custom range). */
function getMonthBuckets(timeFrame: TimeFrame, range?: { start: Date; end: Date }): { key: string; label: string }[] {
  const now = range?.end ?? new Date();
  const cutoff = range?.start ?? getCutoff(timeFrame);
  const start = new Date(cutoff.getFullYear(), cutoff.getMonth(), 1);
  const end = new Date(now.getFullYear(), now.getMonth(), 1);
  const buckets: { key: string; label: string }[] = [];
  const d = new Date(end);
  while (d >= start) {
    buckets.push({
      key: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`,
      label: d.toLocaleDateString('en-US', { month: 'short' }),
    });
    d.setMonth(d.getMonth() - 1);
  }
  return buckets;
}

function computeMonthlyRevenue(orders: Order[], timeFrame: TimeFrame, range?: { start: Date; end: Date }): RevenueMonth[] {
  const buckets = getMonthBuckets(timeFrame, range);
  return buckets.map(b => {
    const revenue = orders
      .filter(o => {
        const oDate = new Date(o.createdAt);
        return `${oDate.getFullYear()}-${String(oDate.getMonth() + 1).padStart(2, '0')}` === b.key && o.status !== 'Cancelled' && o.status !== 'Refunded';
      })
      .reduce((sum, o) => sum + o.total, 0);
    return { key: b.key, label: b.label, revenue };
  });
}

// ── Constants ──────────────────────────────────────────────────

type TimeFrame = '7d' | '30d' | '90d' | '12m' | 'custom';
type ChartTab = 'revenue' | 'orders' | 'customers' | 'aov';

const TIME_FRAMES: { key: TimeFrame; label: string }[] = [
  { key: '7d', label: '7 Days' },
  { key: '30d', label: '30 Days' },
  { key: '90d', label: '90 Days' },
  { key: '12m', label: '12 Months' },
  { key: 'custom', label: 'Custom' },
];

const CHART_TABS: { key: ChartTab; label: string }[] = [
  { key: 'revenue', label: 'Revenue' },
  { key: 'orders', label: 'Orders' },
  { key: 'customers', label: 'Customers' },
  { key: 'aov', label: 'Avg Order' },
];

// ── Page component ─────────────────────────────────────────────

export default function DashboardPage() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeFrame, setTimeFrame] = useState<TimeFrame>('12m');
  const navigate = useNavigate();
  const [customStart, setCustomStart] = useState(() => {
    const d = new Date(); d.setDate(d.getDate() - 30);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  });
  const [customEnd, setCustomEnd] = useState(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  });

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const [m, o] = await Promise.all([
          (api.getMetrics as () => Promise<DashboardMetrics>)(),
          (api.getOrders as () => Promise<Order[]>)(),
        ]);
        if (!cancelled) {
          setMetrics(m);
          setOrders(o);
          setLoading(false);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load dashboard data');
          setLoading(false);
        }
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const cutoff = useMemo(() => {
    if (timeFrame === 'custom') return new Date(`${customStart}T00:00:00`);
    return getCutoff(timeFrame);
  }, [timeFrame, customStart]);
  const customRange = useMemo(() => timeFrame === 'custom'
    ? { start: new Date(`${customStart}T00:00:00`), end: new Date(`${customEnd}T23:59:59.999`) }
    : null,
    [timeFrame, customStart, customEnd],
  );
  const filteredOrders = useMemo(
    () => orders.filter(o => {
      const d = new Date(o.createdAt);
      if (d < cutoff) return false;
      if (customRange && d > customRange.end) return false;
      return true;
    }),
    [orders, cutoff, customRange],
  );

  const filteredMetrics = useMemo(() => {
    const active = filteredOrders.filter(o => o.status !== 'Cancelled' && o.status !== 'Refunded');
    const revenue = active.reduce((s, o) => s + o.total, 0);
    const totalOrders = filteredOrders.length;
    const avgOrder = totalOrders > 0 ? revenue / totalOrders : 0;
    const customerSet = new Set(filteredOrders.map(o => o.customerName));
    return {
      totalRevenue: formatCurrency(revenue),
      totalOrders: String(totalOrders),
      activeCustomers: String(customerSet.size),
      avgOrderValue: formatCurrency(avgOrder),
      lowStockItems: String(metrics?.lowStockItems ?? 0),
      pendingPOs: String(metrics?.pendingPOs ?? 0),
      revenueTrend: metrics?.revenueTrend,
      ordersTrend: metrics?.ordersTrend,
      customersTrend: metrics?.customersTrend,
      stockTrend: metrics?.stockTrend,
      aovTrend: metrics?.aovTrend,
    };
  }, [filteredOrders, metrics]);

  const totalRevenue = filteredMetrics.totalRevenue;
  const avgOrderValue = filteredMetrics.avgOrderValue;

  const revenueData = useMemo(() => computeMonthlyRevenue(filteredOrders, timeFrame, customRange ?? undefined), [filteredOrders, timeFrame, customRange]);
  const [chartTab, setChartTab] = useState<ChartTab>('revenue');

  const monthBuckets = useMemo(() => getMonthBuckets(timeFrame, customRange ?? undefined), [timeFrame, customRange]);

  const ordersData = useMemo(() => {
    return monthBuckets.map(b => {
      const monthOrders = filteredOrders.filter(o => {
        const oDate = new Date(o.createdAt);
        return `${oDate.getFullYear()}-${String(oDate.getMonth() + 1).padStart(2, '0')}` === b.key;
      });
      return { ...b, count: monthOrders.length };
    });
  }, [filteredOrders, monthBuckets]);

  const customersData = useMemo(() => {
    const seen = new Set<string>();
    return monthBuckets.map(b => {
      const monthOrders = filteredOrders.filter(o => {
        const oDate = new Date(o.createdAt);
        return `${oDate.getFullYear()}-${String(oDate.getMonth() + 1).padStart(2, '0')}` === b.key;
      });
      let newCustomers = 0;
      for (const o of monthOrders) {
        if (!seen.has(o.customerName)) {
          seen.add(o.customerName);
          newCustomers++;
        }
      }
      return { ...b, count: newCustomers };
    });
  }, [filteredOrders, monthBuckets]);

  const aovData = useMemo(() => {
    return monthBuckets.map(b => {
      const monthOrders = filteredOrders.filter(o => {
        const oDate = new Date(o.createdAt);
        return `${oDate.getFullYear()}-${String(oDate.getMonth() + 1).padStart(2, '0')}` === b.key && o.status !== 'Cancelled' && o.status !== 'Refunded';
      });
      const revenue = monthOrders.reduce((s, o) => s + o.total, 0);
      return { ...b, revenue: monthOrders.length > 0 ? revenue / monthOrders.length : 0 };
    });
  }, [filteredOrders, monthBuckets]);

  const fmtRange = (s: string) => {
    const d = new Date(`${s}T12:00:00`);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };
  const timeFrameLabel = timeFrame === 'custom'
    ? `${fmtRange(customStart)} – ${fmtRange(customEnd)}`
    : TIME_FRAMES.find(t => t.key === timeFrame)!.label;
  const chartData = chartTab === 'revenue' ? revenueData : chartTab === 'orders' ? ordersData : chartTab === 'customers' ? customersData : aovData;
  const chartDataKey = chartTab === 'revenue' || chartTab === 'aov' ? 'revenue' : 'count';
  const chartLabel = CHART_TABS.find(t => t.key === chartTab)!.label;
  const chartValue =
    chartTab === 'revenue' ? totalRevenue
    : chartTab === 'orders' ? filteredMetrics.totalOrders
    : chartTab === 'customers' ? filteredMetrics.activeCustomers
    : avgOrderValue;
  const chartPeriod =
    chartTab === 'revenue' ? timeFrameLabel
    : chartTab === 'orders' ? `${ordersData.reduce((s, m) => s + m.count, 0)} total`
    : chartTab === 'customers' ? `${customersData.reduce((s, m) => s + m.count, 0)} new`
    : timeFrameLabel;
  const chartGradientId = chartTab === 'revenue' ? 'revenueGradient' : 'ordersGradient';
  const yFormatter = (v: number) =>
    chartTab === 'revenue' || chartTab === 'aov' ? `$${(v / 1000).toFixed(0)}k` : String(v);

  const recentOrders = useMemo(
    () =>
      [...filteredOrders]
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        )
        .slice(0, 5),
    [filteredOrders],
  );

  const recentOrderColumns: Column<Order>[] = [
    {
      key: 'customer',
      header: 'Customer',
      sortable: true,
      sortKey: 'customerName',
      render: (row) => (
        <>
          <span>{row.customerName}</span>
          <br />
          <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
            {formatRelativeDate(row.createdAt)}
          </span>
        </>
      ),
    },
    { key: 'status', header: 'Status', sortable: true, sortKey: 'status' },
    {
      key: 'total',
      header: 'Amount',
      sortable: true,
      sortKey: 'total',
      render: (row) => <span>{formatCurrency(row.total)}</span>,
    },
  ];

  // ── Time frame selector (shared by all states) ─────────────
  const timeFrameSelector = (
    <div className={styles.timeFrameRow}>
      <div className={styles.timeFrameBar}>
        {TIME_FRAMES.map(tf => (
          <button
            key={tf.key}
            className={`${styles.timeFrameBtn} ${timeFrame === tf.key ? styles.timeFrameActive : ''}`}
            onClick={() => setTimeFrame(tf.key)}
          >
            {tf.label}
          </button>
        ))}
      </div>
      {timeFrame === 'custom' && (
        <div className={styles.customRange}>
          <label className={styles.customField}>
            <span className={styles.customLabel}>From</span>
            <input type="date" value={customStart} max={customEnd} onChange={e => setCustomStart(e.target.value)} />
          </label>
          <span className={styles.customSep}>to</span>
          <label className={styles.customField}>
            <span className={styles.customLabel}>To</span>
            <input type="date" value={customEnd} min={customStart} onChange={e => setCustomEnd(e.target.value)} />
          </label>
        </div>
      )}
    </div>
  );

  // ── Error state ────────────────────────────────────────────
  if (error) {
    return (
      <div className={styles.page}>
        {/* Time frame selector */}
        {timeFrameSelector}

        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <h1 className={styles.title}>Dashboard</h1>
            <p className={styles.subtitle}>
              Error loading dashboard data
            </p>
          </div>
        </div>
        <Card padding="lg">
          <p style={{ color: 'var(--color-danger)' }}>{error}</p>
          <button
            onClick={() => window.location.reload()}
            style={{
              marginTop: 'var(--space-md)',
              padding: 'var(--space-sm) var(--space-lg)',
              background: 'var(--color-accent)',
              color: '#fff',
              border: 'none',
              borderRadius: 'var(--radius-md)',
              cursor: 'pointer',
            }}
          >
            Retry
          </button>
        </Card>
      </div>
    );
  }

  // ── Loading state ──────────────────────────────────────────
  if (loading) {
    return (
      <div className={styles.page}>
        {/* Time frame selector */}
        {timeFrameSelector}

        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <Skeleton width="240px" height="32px" />
            <Skeleton
              width="140px"
              height="16px"
              count={1}
              className={styles.subtitleSkeleton}
            />
          </div>
        </div>

        <div className={styles.metricsGrid}>
          {Array.from({ length: 6 }, (_, i) => (
            <div key={i} className={styles.metricCardSkeleton}>
              <Skeleton width="50%" height="14px" />
              <Skeleton width="75%" height="28px" className={styles.valueSkeleton} />
              <Skeleton width="30%" height="14px" />
            </div>
          ))}
        </div>

        <div className={styles.chartCard}>
          <div className={styles.chartBody}>
            <div className={styles.chartTabs}>
              <Skeleton width="80px" height="32px" className={styles.tabSkeleton} />
              <Skeleton width="80px" height="32px" className={styles.tabSkeleton} />
            </div>
            <div className={styles.chartArea}>
              <div className={styles.sectionHeader}>
                <div>
                  <Skeleton width="90px" height="18px" />
                  <Skeleton width="120px" height="22px" className={styles.valueSkeleton} />
                </div>
                <Skeleton width="110px" height="20px" className={styles.periodSkeleton} />
              </div>
              <Skeleton width="100%" height="240px" />
            </div>
          </div>
        </div>

        <Card padding="lg" className={styles.ordersCard}>
          <div className={styles.sectionHeader}>
            <Skeleton width="140px" height="18px" />
          </div>
          {Array.from({ length: 5 }, (_, i) => (
            <Skeleton key={i} width="100%" height="40px" className={styles.rowSkeleton} />
          ))}
          <Skeleton width="120px" height="16px" className={styles.viewAllSkeleton} />
        </Card>
      </div>
    );
  }

  // ── Loaded state ───────────────────────────────────────────
  return (
    <div className={styles.page}>
      {/* Time frame selector */}
      {timeFrameSelector}

      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h1 className={styles.title}>Dashboard</h1>
          <p className={styles.subtitle}>
            Welcome back. Here&apos;s what&apos;s happening at your shop today.
          </p>
        </div>
      </div>

      {/* Metric Cards */}
      <div className={styles.metricsGrid}>
        <MetricCard
          label="Total Revenue"
          value={filteredMetrics.totalRevenue}
          trend={filteredMetrics.revenueTrend}
        />
        <MetricCard
          label="Total Orders"
          value={filteredMetrics.totalOrders}
          trend={filteredMetrics.ordersTrend}
        />
        <MetricCard
          label="Unique Customers"
          value={filteredMetrics.activeCustomers}
          trend={filteredMetrics.customersTrend}
        />
        <MetricCard
          label="Low Stock Items"
          value={filteredMetrics.lowStockItems}
          trend={filteredMetrics.stockTrend}
        />
        <MetricCard
          label="Avg Order Value"
          value={filteredMetrics.avgOrderValue}
          trend={filteredMetrics.aovTrend}
        />
        <MetricCard
          label="Pending POs"
          value={filteredMetrics.pendingPOs}
        />
      </div>

      {/* Chart Card — full width */}
      <Card className={styles.chartCard}>
        <div className={styles.chartBody}>
          <div className={styles.chartTabs}>
            {CHART_TABS.map(t => (
              <button
                key={t.key}
                className={`${styles.chartTab} ${chartTab === t.key ? styles.chartTabActive : ''}`}
                onClick={() => setChartTab(t.key)}
              >
                {t.label}
              </button>
            ))}
          </div>
          <div className={styles.chartArea}>
            <div className={styles.sectionHeader}>
              <div>
                <h2 className={styles.sectionTitle}>{chartLabel}</h2>
                <p className={styles.sectionValue}>{chartValue}</p>
              </div>
              <span className={styles.chartPeriod}>{chartPeriod}</span>
            </div>
            <div className={styles.chartContainer}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={chartData}
                  margin={{ top: 5, right: 5, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient
                      id={chartGradientId}
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor="var(--color-accent)"
                        stopOpacity={0.25}
                      />
                      <stop
                        offset="95%"
                        stopColor="var(--color-accent)"
                        stopOpacity={0.02}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="var(--color-border-light)"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="label"
                    tick={{ fontSize: 11, fill: 'var(--color-text-muted)' }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: 'var(--color-text-muted)' }}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(v: number) => yFormatter(v)}
                  />
                  <Tooltip
                    content={<ChartTooltip formatter={chartTab === 'aov' ? v => `$${v.toFixed(0)}` : chartTab === 'revenue' ? v => formatCurrency(v) : v => String(v)} />}
                    cursor={{ stroke: 'var(--color-border)', strokeDasharray: '3 3' }}
                  />
                  <Area
                    type="monotone"
                    dataKey={chartDataKey}
                    stroke="var(--color-accent)"
                    strokeWidth={2}
                    fill={`url(#${chartGradientId})`}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </Card>

      {/* Recent Orders — full width */}
      <Card padding="lg" className={styles.ordersCard}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Recent Orders</h2>
        </div>
        <Table
          columns={recentOrderColumns}
          data={recentOrders}
          keyExtractor={(r) => r.id}
          onRowClick={(r) => navigate('/sales', { state: { selectedOrderId: r.id } })}
          emptyMessage="No orders found"
        />
        <Link to="/sales" className={styles.viewAll}>
          View All Orders →
        </Link>
      </Card>
    </div>
  );
}