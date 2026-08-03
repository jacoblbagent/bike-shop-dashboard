const express = require('express');
const cors = require('cors');
const path = require('path');
const { pool, initDb } = require('./db.cjs');
const { seed } = require('./seed.cjs');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Serve built frontend in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '..', 'dist')));
}

// ── Helper: snake_case → camelCase row mapper ─────────
function mapRow(row, colMap) {
  if (!row) return row;
  const out = {};
  for (const [key, val] of Object.entries(row)) {
    const camel = colMap[key] || key.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
    out[camel] = val;
  }
  return out;
}

// ── Bikes ──────────────────────────────────────────────
app.get('/api/bikes', async (req, res) => {
  const { rows } = await pool.query('SELECT * FROM bikes ORDER BY brand, model');
  res.json(rows.map(r => mapRow(r, {})));
});

app.get('/api/bikes/:id', async (req, res) => {
  const { rows } = await pool.query('SELECT * FROM bikes WHERE id = $1', [req.params.id]);
  res.json(rows[0] ? mapRow(rows[0], {}) : null);
});

app.put('/api/bikes/:id', async (req, res) => {
  const { brand, model, year, category, frame_size, color, sku, price, cost, quantity, reorder_point } = req.body;
  const { rows } = await pool.query(
    `UPDATE bikes SET brand=$1,model=$2,year=$3,category=$4,frame_size=$5,color=$6,sku=$7,price=$8,cost=$9,quantity=$10,reorder_point=$11,updated_at=NOW() WHERE id=$12 RETURNING *`,
    [brand, model, year, category, frame_size || req.body.frameSize, color, sku, price, cost, quantity, reorder_point || req.body.reorderPoint, req.params.id]
  );
  res.json(rows[0] ? mapRow(rows[0], {}) : null);
});

app.post('/api/bikes', async (req, res) => {
  const { id, brand, model, year, category, frameSize, color, sku, price, cost, quantity, reorderPoint } = req.body;
  const { rows } = await pool.query(
    `INSERT INTO bikes (id,brand,model,year,category,frame_size,color,sku,price,cost,quantity,reorder_point) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12) RETURNING *`,
    [id, brand, model, year || 2026, category, frameSize, color, sku, price, cost, quantity, reorderPoint || 3]
  );
  res.json(mapRow(rows[0], {}));
});

app.delete('/api/bikes/:id', async (req, res) => {
  await pool.query('DELETE FROM bikes WHERE id = $1', [req.params.id]);
  res.json({ ok: true });
});

// ── Parts ──────────────────────────────────────────────
app.get('/api/parts', async (req, res) => {
  const { rows } = await pool.query('SELECT * FROM parts ORDER BY brand, model');
  res.json(rows.map(r => mapRow(r, {})));
});

app.get('/api/parts/:id', async (req, res) => {
  const { rows } = await pool.query('SELECT * FROM parts WHERE id = $1', [req.params.id]);
  res.json(rows[0] ? mapRow(rows[0], {}) : null);
});

app.post('/api/parts', async (req, res) => {
  const { id, model, category, brand, sku, price, cost, quantity, reorderPoint } = req.body;
  const { rows } = await pool.query(
    `INSERT INTO parts (id,model,category,brand,sku,price,cost,quantity,reorder_point) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
    [id, model, category, brand, sku, price, cost, quantity, reorderPoint || 5]
  );
  res.json(mapRow(rows[0], {}));
});

// ── Customers ──────────────────────────────────────────
app.get('/api/customers', async (req, res) => {
  const { rows } = await pool.query('SELECT * FROM customers ORDER BY name');
  res.json(rows.map(r => mapRow(r, {})));
});

app.get('/api/customers/:id', async (req, res) => {
  const { rows } = await pool.query('SELECT * FROM customers WHERE id = $1', [req.params.id]);
  res.json(rows[0] ? mapRow(rows[0], {}) : null);
});

app.post('/api/customers', async (req, res) => {
  const { id, name, email, phone, tier } = req.body;
  const { rows } = await pool.query(
    `INSERT INTO customers (id,name,email,phone,tier) VALUES ($1,$2,$3,$4,$5) RETURNING *`,
    [id, name, email, phone || '', tier || 'Bronze']
  );
  res.json(mapRow(rows[0], {}));
});

// ── Orders ─────────────────────────────────────────────
app.get('/api/orders', async (req, res) => {
  const { rows } = await pool.query('SELECT * FROM orders ORDER BY created_at DESC');
  const orders = rows.map(r => mapRow(r, {}));
  for (const o of orders) {
    const { rows: items } = await pool.query('SELECT * FROM order_items WHERE order_id = $1', [o.id]);
    o.items = items.map(r => mapRow(r, {}));
  }
  res.json(orders);
});

app.get('/api/orders/:id', async (req, res) => {
  const { rows } = await pool.query('SELECT * FROM orders WHERE id = $1', [req.params.id]);
  if (!rows[0]) return res.json(null);
  const o = mapRow(rows[0], {});
  const { rows: items } = await pool.query('SELECT * FROM order_items WHERE order_id = $1', [o.id]);
  o.items = items.map(r => mapRow(r, {}));
  res.json(o);
});

app.put('/api/orders/:id/status', async (req, res) => {
  const { status } = req.body;
  const { rows } = await pool.query(
    `UPDATE orders SET status=$1,updated_at=NOW() WHERE id=$2 RETURNING *`,
    [status, req.params.id]
  );
  res.json(rows[0] ? mapRow(rows[0], {}) : null);
});

// ── Suppliers ──────────────────────────────────────────
app.get('/api/suppliers', async (req, res) => {
  const { rows } = await pool.query('SELECT * FROM suppliers ORDER BY name');
  res.json(rows.map(r => mapRow(r, {})));
});

app.post('/api/suppliers', async (req, res) => {
  const { id, name, contactName, email, phone, categories, leadTimeDays, paymentTerms, address } = req.body;
  const { rows } = await pool.query(
    `INSERT INTO suppliers (id,name,contact_name,email,phone,categories,lead_time_days,payment_terms,address)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
    [id, name, contactName || '', email || '', phone || '',
     categories || [], leadTimeDays || 14, paymentTerms || 'Net 30', address || '']
  );
  res.json(mapRow(rows[0], {}));
});

// ── Purchase Orders ────────────────────────────────────
app.get('/api/purchase-orders', async (req, res) => {
  const { rows } = await pool.query('SELECT * FROM purchase_orders ORDER BY created_at DESC');
  const pos = rows.map(r => mapRow(r, {}));
  for (const po of pos) {
    const { rows: items } = await pool.query('SELECT * FROM purchase_order_items WHERE po_id = $1', [po.id]);
    po.items = items.map(r => mapRow(r, {}));
  }
  res.json(pos);
});

app.put('/api/purchase-orders/:id/status', async (req, res) => {
  const { status } = req.body;
  const { rows } = await pool.query(
    `UPDATE purchase_orders SET status=$1,updated_at=NOW() WHERE id=$2 RETURNING *`,
    [status, req.params.id]
  );
  res.json(rows[0] ? mapRow(rows[0], {}) : null);
});

app.post('/api/purchase-orders', async (req, res) => {
  const { id, poNumber, supplierId, supplierName, items, subtotal, tax, total, status, expectedDate, notes } = req.body;
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query(
      `INSERT INTO purchase_orders (id,po_number,supplier_id,supplier_name,subtotal,tax,total,status,expected_date,notes)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`,
      [id, poNumber, supplierId, supplierName, subtotal || 0, tax || 0, total || 0,
       status || 'Draft', expectedDate || null, notes || null]
    );
    if (items && items.length > 0) {
      for (const item of items) {
        await client.query(
          `INSERT INTO purchase_order_items (po_id,product_id,product_name,product_type,quantity,unit_cost,total,received)
           VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
          [id, item.productId || '', item.productName, item.productType || 'part',
           item.quantity || 1, item.unitCost || 0, item.total || 0, item.received || 0]
        );
      }
    }
    await client.query('COMMIT');
    // Return the full PO
    const { rows: poRows } = await pool.query('SELECT * FROM purchase_orders WHERE id = $1', [id]);
    const po = mapRow(poRows[0], {});
    const { rows: itemRows } = await pool.query('SELECT * FROM purchase_order_items WHERE po_id = $1', [id]);
    po.items = itemRows.map(r => mapRow(r, {}));
    res.json(po);
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
});

// ── Metrics ────────────────────────────────────────────
app.get('/api/metrics', async (req, res) => {
  const rev = await pool.query(
    `SELECT COALESCE(SUM(total),0) AS total FROM orders WHERE status NOT IN ('Cancelled','Refunded')`
  );
  const completed = await pool.query(
    `SELECT COUNT(*)::int AS cnt FROM orders WHERE status IN ('Completed','Delivered')`
  );
  const activeCust = await pool.query(
    `SELECT COUNT(*)::int AS cnt FROM customers WHERE last_visit > NOW() - INTERVAL '90 days'`
  );
  const lowStock = await pool.query(
    `SELECT (SELECT COUNT(*) FROM bikes WHERE quantity <= reorder_point) + (SELECT COUNT(*) FROM parts WHERE quantity <= reorder_point) AS cnt`
  );
  const pendingPOs = await pool.query(
    `SELECT COUNT(*)::int AS cnt, COALESCE(SUM(total),0) AS val FROM purchase_orders WHERE status IN ('Pending','Approved')`
  );

  const totalRevenue = parseInt(rev.rows[0].total, 10);
  const completedOrders = completed.rows[0].cnt;
  const avgOrder = completedOrders > 0 ? Math.round(totalRevenue / completedOrders) : 0;

  res.json({
    totalRevenue,
    revenueTrend: 12,
    totalOrders: completedOrders,
    ordersTrend: 8,
    activeCustomers: activeCust.rows[0].cnt,
    customersTrend: 5,
    lowStockItems: lowStock.rows[0].cnt,
    stockTrend: -3,
    averageOrderValue: avgOrder,
    aovTrend: 4,
    pendingPOs: pendingPOs.rows[0].cnt,
    pendingValue: parseInt(pendingPOs.rows[0].val, 10),
  });
});

// ── Seed endpoint (admin) ──────────────────────────────
app.post('/api/seed', async (req, res) => {
  try {
    await seed();
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── Start ──────────────────────────────────────────────
async function start() {
  await initDb();
  await seed();

  app.listen(PORT, () => {
    console.log(`ChainLink API running on http://localhost:${PORT}`);
  });
}

start().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});