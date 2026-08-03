const { pool } = require('./db.cjs');
const data = require('./seedData.cjs');

async function seed() {
  const client = await pool.connect();
  try {
    const { rows } = await client.query('SELECT COUNT(*)::int AS cnt FROM bikes');
    if (rows[0].cnt > 0) {
      console.log(`Already seeded (${rows[0].cnt} bikes). Re-run after TRUNCATE to re-seed.`);
      return;
    }

    const bs = data.bikes();
    const ps = data.parts();
    const cs = data.customers();
    const sups = data.suppliers();
    const ords = data.orders(bs, ps, cs);
    const pos = data.purchaseOrders(sups, bs, ps);

    for (const b of bs) {
      await client.query(
        `INSERT INTO bikes (id,brand,model,year,category,frame_size,color,sku,price,cost,quantity,reorder_point,created_at,updated_at)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)`,
        [b.id, b.brand, b.model, b.year, b.category, b.frameSize, b.color, b.sku, b.price, b.cost, b.quantity, b.reorderPoint, b.createdAt, b.updatedAt]
      );
    }
    console.log(`  ${bs.length} bikes`);

    for (const p of ps) {
      await client.query(
        `INSERT INTO parts (id,model,category,brand,sku,price,cost,quantity,reorder_point,created_at,updated_at)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)`,
        [p.id, p.model, p.category, p.brand, p.sku, p.price, p.cost, p.quantity, p.reorderPoint, p.createdAt, p.updatedAt]
      );
    }
    console.log(`  ${ps.length} parts`);

    for (const c of cs) {
      await client.query(
        `INSERT INTO customers (id,name,email,phone,tier,total_spent,order_count,last_visit,created_at)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
        [c.id, c.name, c.email, c.phone, c.tier, c.totalSpent, c.orderCount, c.lastVisit, c.createdAt]
      );
    }
    console.log(`  ${cs.length} customers`);

    for (const s of sups) {
      await client.query(
        `INSERT INTO suppliers (id,name,contact_name,email,phone,address,categories,lead_time_days,payment_terms,created_at)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`,
        [s.id, s.name, s.contactName, s.email, s.phone, s.address, s.categories, s.leadTimeDays, s.paymentTerms, s.createdAt]
      );
    }
    console.log(`  ${sups.length} suppliers`);

    for (const o of ords) {
      await client.query(
        `INSERT INTO orders (id,order_number,customer_id,customer_name,subtotal,tax,total,status,payment_method,created_at,updated_at)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)`,
        [o.id, o.orderNumber, o.customerId, o.customerName, o.subtotal, o.tax, o.total, o.status, o.paymentMethod, o.createdAt, o.updatedAt]
      );
      for (const item of o.items) {
        await client.query(
          `INSERT INTO order_items (order_id,product_id,product_name,product_type,quantity,unit_price,total)
           VALUES ($1,$2,$3,$4,$5,$6,$7)`,
          [o.id, item.productId, item.productName, item.productType, item.quantity, item.unitPrice, item.total]
        );
      }
    }
    console.log(`  ${ords.length} orders`);

    for (const po of pos) {
      await client.query(
        `INSERT INTO purchase_orders (id,po_number,supplier_id,supplier_name,subtotal,tax,total,status,expected_date,created_at,updated_at)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)`,
        [po.id, po.poNumber, po.supplierId, po.supplierName, po.subtotal, po.tax, po.total, po.status, po.expectedDate, po.createdAt, po.updatedAt]
      );
      for (const item of po.items) {
        await client.query(
          `INSERT INTO purchase_order_items (po_id,product_id,product_name,product_type,quantity,unit_cost,total,received)
           VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
          [po.id, item.productId, item.productName, item.productType, item.quantity, item.unitCost, item.total, item.received]
        );
      }
    }
    console.log(`  ${pos.length} purchase orders`);

    console.log('Database seeded successfully');
  } catch (err) {
    console.error('Seed error:', err);
    throw err;
  } finally {
    client.release();
  }
}

module.exports = { seed };

if (require.main === module) {
  seed().then(() => process.exit(0)).catch(() => process.exit(1));
}