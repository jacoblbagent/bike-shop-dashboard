#!/usr/bin/env python3
"""Generate the Bike Shop Inventory Management SPA."""
import json, pathlib

OUT = pathlib.Path(__file__).parent / "index.html"

DEMO_PRODUCTS = [
    {"id":1,"sku":"FRM-001","name":"Carbon Road Frame 54cm","category":"Frames","price":1299.99,"stock":8,"status":"in_stock"},
    {"id":2,"sku":"FRM-002","name":"Aluminum MTB Frame L","category":"Frames","price":449.0,"stock":15,"status":"in_stock"},
    {"id":3,"sku":"WHL-001","name":"DT Swiss EX517 Wheelset","category":"Wheels","price":849.0,"stock":6,"status":"in_stock"},
    {"id":4,"sku":"WHL-002","name":"Alex Rigid Front 35mm","category":"Wheels","price":79.99,"stock":0,"status":"out_of_stock"},
    {"id":5,"sku":"DRV-001","name":"Shimano Ultegra Di2 RD-R8020","category":"Drivetrain","price":469.99,"stock":12,"status":"in_stock"},
    {"id":6,"sku":"DRV-002","name":"SRAM GX Eagle Cassette 10-52","category":"Drivetrain","price":339.0,"stock":4,"status":"low_stock"},
    {"id":7,"sku":"BRK-001","name":"Magura MT5 Hydro Disc Caliper","category":"Brakes","price":199.99,"stock":20,"status":"in_stock"},
    {"id":8,"sku":"BRK-002","name":"Shimano Saint RT66 Rotor","category":"Brakes","price":34.99,"stock":0,"status":"out_of_stock"},
    {"id":9,"sku":"CCK-001","name":"FSA Orbit K-Press I/T G2 BB","category":"Bottom Brackets","price":45.0,"stock":30,"status":"in_stock"},
    {"id":10,"sku":"HDL-001","name":"Bontrager Flight Bar 760mm","category":"Handlebars","price":89.99,"stock":3,"status":"low_stock"},
    {"id":11,"sku":"TIR-001","name":"Schwalbe Pro-one Performance Line","category":"Tires","price":54.99,"stock":45,"status":"in_stock"},
    {"id":12,"sku":"CBL-001","name":"Paul Component Link+ Chain Tool","category":"Tools","price":42.99,"stock":1,"status":"low_stock"},
    {"id":13,"sku":"FRM-003","name":"Titanius Ti-64 Gravel Frame 58cm","category":"Frames","price":2895.0,"stock":2,"status":"low_stock"},
    {"id":14,"sku":"PED-001","name":"Crankbrothers Stamp Comp Platform","category":"Pedals","price":79.99,"stock":18,"status":"in_stock"},
    {"id":15,"sku":"SEAT-001","name":"Brooks B17 C17 Standard Saddle","category":"Seats","price":149.95,"stock":0,"status":"out_of_stock"},
    {"id":16,"sku":"STP-001","name":"Fox Factory 38 Float Fork 160mm","category":"Suspension","price":879.0,"stock":5,"status":"in_stock"},
    {"id":17,"sku":"DRV-003","name":"KMC X11 SL Chain","category":"Drivetrain","price":32.99,"stock":25,"status":"in_stock"},
    {"id":18,"sku":"CBL-002","name":"Park Tool CM-5.3 Chain Magic","category":"Tools","price":25.0,"stock":0,"status":"out_of_stock"},
]

ALL_CATS = sorted(set(p["category"] for p in DEMO_PRODUCTS))

# ---- Build the file piece by piece ----
f = OUT.open("w", encoding="utf-8")

def w(text):
    f.write(text)
    if "\n" not in text:
        pass  # no-op, just tracking calls silently

# ===== HTML HEAD =====
f.write('''<!DOCTYPE html>
<html lang="en" data-theme="light">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Bike Shop - Inventory Management</title>
<script src="https://unpkg.com/vue@3/dist/vue.global.prod.js"></script>
<style>
/* ---------- Reset + CSS Variables ---------- */
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root[data-theme="light"]{
  --bg:#f5f7fa;--card:#fff;--side:#fff;
  --tx1:#1a202c;--tx2:#718096;--tx3:#a0aec0;
  --brd:#e2e8f0;--acc:#3182ce;--acc-h:#2b6cb0;
  --red:#e53e3e;--red-h:#c53030;--ok:#38a169;--warn:#d69e2e;
  --bi:#c6f6d5;--bit:#276749;--bl:#fefcbf;--blt:#975a16;
  --bo:#fed7d7;--bot:#c53030;
  --shs:0 1px 2px rgba(0,0,0,.05);--shm:0 4px 12px rgba(0,0,0,.1);
}
:root[data-theme="dark"]{
  --bg:#1a202c;--card:#2d3748;--side:#2d3748;
  --tx1:#f7fafc;--tx2:#a0aec0;--tx3:#718096;
  --brd:#4a5568;--acc:#63b3ed;--acc-h:#4299e1;
  --red:#fc8181;--red-h:#feb2b2;--ok:#68d391;--warn:#f6e05e;
  --bi:#276749;--bit:#c6f6d5;--bl:#975a16;--blt:#fefcbf;
  --bo:#9b2c2c;--bot:#fed7d7;
  --shs:0 1px 2px rgba(0,0,0,.3);--shm:0 4px 12px rgba(0,0,0,.4);
}
body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;background:var(--bg);color:var(--tx1);font-size:14px;line-height:1.5;min-height:100vh;transition:background .15s,color .15s}
.app{display:flex;min-height:100vh}

/* Sidebar */
.sidebar{width:280px;min-width:280px;background:var(--side);border-right:1px solid var(--brd);padding:24px 20px;overflow-y:auto}
.main{flex:1;display:flex;flex-direction:column;min-width:0}

/* Header */
.header{display:flex;align-items:center;justify-content:space-between;padding:16px 24px;background:var(--card);border-bottom:1px solid var(--brd)}
.header h1{font-size:1.25rem;font-weight:700}
.ha{display:flex;gap:8px;align-items:center}

/* Buttons */
.btn{display:inline-flex;align-items:center;gap:6px;padding:8px 14px;border:none;border-radius:6px;cursor:pointer;font-size:.875rem;font-weight:500;transition:all .15s}
.btn-p{background:var(--acc);color:#fff}
.btn-p:hover{background:var(--acc-h)}
.btn-o{background:transparent;border:1px solid var(--brd);color:var(--tx1)}
.btn-o:hover{border-color:var(--acc);color:var(--acc)}
.btn-d{background:var(--red);color:#fff}
.btn-d:hover{background:var(--red-h)}
.btn-sm{padding:4px 10px;font-size:.8rem}

/* Theme toggle */
.ttog{width:36px;height:36px;border-radius:50%;border:1px solid var(--brd);background:var(--card);cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:1.1rem;transition:all .15s}

/* Sidebar filters */
.sidebar h2{font-size:.75rem;text-transform:uppercase;letter-spacing:.08em;color:var(--tx3);margin-bottom:12px}
.fg{margin-bottom:24px}
.flabel{font-weight:600;display:block;margin-bottom:6px;font-size:.875rem}
.fchips{display:flex;flex-wrap:wrap;gap:6px}
.chip{padding:4px 12px;border-radius:20px;font-size:.8rem;cursor:pointer;border:1px solid var(--brd);background:transparent;color:var(--tx1);transition:all .15s}
.chip.active{background:var(--acc);color:#fff;border-color:var(--acc)}
input[type=range]{width:100%;accent-color:var(--acc)}
.rl{display:flex;justify-content:space-between;font-size:.8rem;color:var(--tx2);margin-top:4px}
.sinp{width:100%;padding:8px 12px;border:1px solid var(--brd);border-radius:6px;background:var(--bg);color:var(--tx1);font-size:.875rem;outline:none}
.sinp:focus{border-color:var(--acc);box-shadow:0 0 0 2px rgba(49,130,206,.2)}
.cbtn{background:none;border:none;color:var(--tx2);cursor:pointer;font-size:.8rem;text-decoration:underline}

/* Bulk bar */
.bbar{padding:10px 24px;background:var(--acc);color:#fff;display:flex;align-items:center;gap:16px;font-size:.875rem}
.bbar button{background:rgba(255,255,255,.2);color:#fff;border:none;padding:6px 12px;border-radius:6px;cursor:pointer;font-size:.8rem}
.bbar button:hover{background:rgba(255,255,255,.35)}

/* Table */
.tw{flex:1;padding:0 24px 24px;overflow-x:auto}
table{width:100%;border-collapse:collapse;background:var(--card);border-radius:6px;overflow:hidden;box-shadow:var(--shs)}
th,td{padding:10px 14px;text-align:left;border-bottom:1px solid var(--brd)}
th{font-weight:600;font-size:.75rem;text-transform:uppercase;letter-spacing:.06em;color:var(--tx2);cursor:pointer;user-select:none;background:var(--card);position:sticky;top:0}
th:hover{color:var(--acc)}
th.sa::after{content:' \\2191'}
th.sd::after{content:' \\2193'}
td input[type=checkbox]{width:16px;height:16px;accent-color:var(--acc);cursor:pointer}
.th:hover td{background:rgba(49,130,206,.04)}
.sb{display:inline-block;padding:2px 10px;border-radius:20px;font-size:.75rem;font-weight:600}
.si{background:var(--bi);color:var(--bit)}
.sl{background:var(--bl);color:var(--blt)}
.so{background:var(--bo);color:var(--bot)}
.pc{font-variant-numeric:tabular-nums}
.sc{font-variant-numeric:tabular-nums;text-align:center}

/* Pagination */
.pgtn{display:flex;align-items:center;justify-content:space-between;padding:12px 24px;font-size:.875rem;color:var(--tx2)}
.pbtns{display:flex;gap:4px}
.pb{width:32px;height:32px;border-radius:6px;border:1px solid var(--brd);background:var(--card);color:var(--tx1);cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:.8rem}
.pb:hover:not(:disabled){border-color:var(--acc);color:var(--acc)}
.pb:disabled{opacity:.4;cursor:default}
.pb.active{background:var(--acc);color:#fff;border-color:var(--acc)}

/* Empty states */
.es{text-align:center;padding:60px 20px;color:var(--tx3)}.es .ic{font-size:3rem;margin-bottom:12px}.es h3{font-size:1.1rem;color:var(--tx2);margin-bottom:6px}

/* Modal */
.mo{position:fixed;inset:0;background:rgba(0,0,0,.5);z-index:100;display:flex;align-items:center;justify-content:center}
.md{background:var(--card);border-radius:10px;width:480px;max-width:95vw;box-shadow:var(--shm);overflow:hidden;animation:mi .2s ease}
@keyframes mi{from{transform:scale(.95);opacity:0}to{transform:scale(1);opacity:1}}
.mh{display:flex;align-items:center;justify-content:space-between;padding:16px 24px;border-bottom:1px solid var(--brd)}
.mh h3{font-size:1rem;font-weight:700}
.mb{padding:24px;max-height:75vh;overflow-y:auto}
.mf{display:flex;gap:8px;justify-content:flex-end;padding:16px 24px;border-top:1px solid var(--brd)}

/* Form */
.frmg{margin-bottom:16px}
.frml{font-weight:600;display:block;margin-bottom:4px;font-size:.875rem}
.fmii{width:100%;padding:8px 12px;border:1px solid var(--brd);border-radius:6px;font-size:.875rem;background:var(--bg);color:var(--tx1);outline:none;transition:border .15s}
.fmii:focus{border-color:var(--acc);box-shadow:0 0 0 2px rgba(49,130,206,.2)}
.he{border-color:var(--red)!important;box-shadow:0 0 0 2px rgba(229,62,62,.2)!important}
select.fmii{cursor:pointer}
.emsg{color:var(--red);font-size:.75rem;margin-top:4px;min-height:1.1em}

/* Stats */
.statsb{display:flex;gap:20px;padding:0 24px 8px}
.statm{font-size:.8rem;color:var(--tx2)}
.statm strong{color:var(--tx1)}

@media(max-width:800px){.sidebar{display:none}}
</style>
</head>
<body>
<div id="app">''')

# ===== TEMPLATE =====
f.write('''
<!-- Sidebar -->
<aside class="sidebar">
  <h2>Filters</h2>
  <div class="fg">
    <label class="flabel">Search</label>
    <input type="text" v-model.trim="searchQ" class="sinp" placeholder="SKU, name, category...">
  </div>
  <div class="fg">
    <label class="flabel">Category</label>
    <div class="fchips">
      <button class="chip" :class="{active:selectedCats.length===0}" @click="clearCats">All</button>
      <button v-for="c in cats" :key="c" class="chip" :class="{active:hasC(c)}" @click="togC(c)">{{ c }}</button>
    </div>
  </div>
  <div class="fg">
    <label class="flabel">Price Range</label>
    <input type="range" v-model.number="maxP" min="0" max="3000" step="10">
    <div class="rl"><span>$0</span><span>${{ maxP }}</span></div>
  </div>
  <div class="fg">
    <label class="flabel">Stock Level</label>
    <div class="fchips">
      <button class="chip" :class="{active:selectedSt.length===0}" @click="clearSt">All</button>
      <button v-for="s in stOpts" :key="s.v" class="chip" :class="{active:hasS(s.v)}" @click="togS(s.v)">{{ s.l }}</button>
    </div>
  </div>
  <p style="margin-top:24px;font-size:.8rem;color:var(--tx3)">
    {{ filtered.length }} of {{ items.length }} parts
  </p>
</aside>

<!-- Main -->
<div class="main">
  <div class="header">
    <h1>&#128666; Inventory</h1>
    <div class="ha">
      <span style="font-size:.8rem;color:var(--tx2)">Total: {{ items.length }}</span>
      <button class="btn btn-p" @click="openAdd">+ Add Part</button>
      <button class="ttog" @click="flipTheme">{{ theme==='dark' ? '&#9728;' : '&#9790;' }}</button>
    </div>
  </div>

  <!-- Stats -->
  <div class="statsb">
    <span class="statm"><strong>{{ cntIn }}</strong> In Stock</span>
    <span class="statm"><strong style="color:var(--warn)">{{ cntLow }}</strong> Low Stock</span>
    <span class="statm"><strong style="color:var(--red)">{{ cntOut }}</strong> Out of Stock</span>
  </div>

  <!-- Bulk bar -->
  <div class="bbar" v-show="selIds.length>0">
    <span><strong>{{ selIds.length }}</strong> selected</span>
    <button @click="bulkDelAsk">&#128465; Delete</button>
    <button @click="restockSel">&#9989; Restock</button>
    <button @click="selIds=[]">Done</button>
  </div>

  <!-- Table -->
  <div class="tw" v-show="filtered.length>0">
    <table>
      <thead><tr>
        <th style="width:36px"><input type="checkbox" :checked="allSel" @change="togAll"></th>
        <th @click="sortOn('sku')" :class="scCls('sku')">SKU</th>
        <th @click="sortOn('name')" :class="scCls('name')">Product Name</th>
        <th @click="sortOn('category')" :class="scCls('category')">Category</th>
        <th @click="sortOn('price')" :class="scCls('price')">Price</th>
        <th @click="sortOn('stock')" :class="scCls('stock')" style="text-align:center">Stock</th>
        <th @click="sortOn('status')" :class="scCls('status')">Status</th>
        <th style="width:84px;text-align:right">Actions</th>
      </tr></thead>
      <tbody>
        <tr class="th" v-for="it in pageItms" :key="it.id">
          <td><input type="checkbox" :value="it.id" v-model="selIds"></td>
          <td>{{ it.sku }}</td>
          <td>{{ it.name }}</td>
          <td>{{ it.category }}</td>
          <td class="pc">${{ fmtP(it.price) }}</td>
          <td class="sc" :style="{color:it.stock===0?'var(--red)':it.stock<=4?'var(--warn)':''}">{{ it.stock }}</td>
          <td><span class="sb status-{{ it.status }}">{{ lblSt(it.status) }}</span></td>
          <td style="text-align:right;white-space:nowrap">
            <button class="btn btn-o btn-sm" @click="openEdit(it)">&#9998;</button>
            <button class="btn btn-d btn-sm" @click="delAsk(it.id)">&#128465;</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <!-- Empty: nothing -->
  <div class="es" v-show="items.length===0">
    <p class="ic">&#128230;</p><h3>No Parts Yet</h3>
    <p>Add your first bike part to get started.</p>
    <button class="btn btn-p" style="margin-top:16px" @click="openAdd">+ Add Part</button>
  </div>

  <!-- Empty: no match -->
  <div class="es" v-show="items.length>0 && filtered.length===0">
    <p class="ic">&#128270;</p><h3>No Matching Parts</h3>
    <p>Try adjusting your filters or search query.</p>
    <button class="cbtn" style="margin-top:12px" @click="clearAll">Clear All Filters</button>
  </div>

  <!-- Pagination -->
  <div class="pgtn" v-show="filtered.length>0">
    <span>{{ pgSt() }}&ndash;{{ pgEn() }} of {{ sorted.length }}</span>
    <div class="pbtns" v-show="tpg>1">
      <button class="pb" :disabled="pg===1" @click="pg--">&#9664;</button>
      <template v-for="n in pgBtns">
        <button v-if="typeof n==='number'" :key="'p'+n" class="pb" :class="{active:n===pg}" @click="pg=n">{{ n }}</button>
        <span v-else :key="'e'+n" style="padding:0 4px;color:var(--tx2)">...</span>
      </template>
      <button class="pb" :disabled="pg===tpg" @click="pg++">&#9654;</button>
    </div>
  </div>
</div><!-- /main -->

<!-- Add/Edit Modal -->
<div class="mo" v-show="showAddEdit" @click.self="closeAE">
  <div class="md">
    <div class="mh">
      <h3>{{ isEd ? "Edit Part" : "Add New Part" }}</h3>
      <button style="background:none;border:none;font-size:1.2rem;cursor:pointer;color:var(--tx2)" @click="closeAE">&#215;</button>
    </div>
    <div class="mb">
      <div class="frmg">
        <label class="frml" for="sku">SKU</label>
        <input id="sku" type="text" v-model.trim="f.sku" class="fmii" :class="{he:err.sku}" placeholder="e.g. FRM-004">
        <div class="emsg">{{ err.sku }}</div>
      </div>
      <div class="frmg">
        <label class="frml" for="nm">Product Name</label>
        <input id="nm" type="text" v-model.trim="f.name" class="fmii" :class="{he:err.name}" placeholder="e.g. Titanium Frame">
        <div class="emsg">{{ err.name }}</div>
      </div>
      <div class="frmg">
        <label class="frml" for="ct">Category</label>
        <select id="ct" v-model.trim="f.category" class="fmii" :class="{he:err.category}">
          <option value="">Select category...</option>
          <option v-for="c in cats" :key="c" :value="c">{{ c }}</option>
        </select>
        <div class="emsg">{{ err.category }}</div>
      </div>
      <div class="frmg">
        <label class="frml" for="pr">Price ($)</label>
        <input id="pr" type="number" v-model.number="f.price" class="fmii" :class="{he:err.price}" step="0.01" min="0" placeholder="0.00">
        <div class="emsg">{{ err.price }}</div>
      </div>
      <div class="frmg">
        <label class="frml" for="sk">Stock Quantity</label>
        <input id="sk" type="number" v-model.number="f.stock" class="fmii" :class="{he:err.stock}" min="0" placeholder="0">
        <div class="emsg">{{ err.stock }}</div>
      </div>
    </div>
    <div class="mf">
      <button class="btn btn-o" @click="closeAE">Cancel</button>
      <button class="btn btn-p" @click="doSubmit">{{ isEd ? "Save Changes" : "Add Part" }}</button>
    </div>
  </div>
</div>

<!-- Delete Confirm -->
<div class="mo" v-show="showDel" @click.self="showDel=false">
  <div class="md" style="width:400px">
    <div class="mh"><h3>&#128992; Confirm Delete</h3>
      <button style="background:none;border:none;font-size:1.2rem;cursor:pointer;color:var(--tx2)" @click="showDel=false">&#215;</button>
    </div>
    <div class="mb">
      <p>Permanently delete this part?</p>
      <div style="background:var(--bg);padding:12px;border-radius:6px;margin-top:12px;font-size:.875rem">
        <strong>{{ delT ? delT.name : "Unknown" }}</strong><br>
        <span style="color:var(--tx2)">{{ delT ? delT.sku : "" }}</span>
      </div>
    </div>
    <div class="mf">
      <button class="btn btn-o" @click="showDel=false">Cancel</button>
      <button class="btn btn-d" @click="doDelOne">Delete</button>
    </div>
  </div>
</div>

<!-- Bulk Delete Confirm -->
<div class="mo" v-show="showBulkDel" @click.self="showBulkDel=false">
  <div class="md" style="width:400px">
    <div class="mh"><h3>&#128992; Delete {{ selIds.length }} item(s)?</h3>
      <button style="background:none;border:none;font-size:1.2rem;cursor:pointer;color:var(--tx2)" @click="showBulkDel=false">&#215;</button>
    </div>
    <div class="mb"><p>This action cannot be undone.</p></div>
    <div class="mf">
      <button class="btn btn-o" @click="showBulkDel=false">Cancel</button>
      <button class="btn btn-d" @click="doBulkDel">Delete All Selected</button>
    </div>
  </div>
</div>
''')

f.write('</div><!-- /app -->\n')

# ===== JAVASCRIPT =====
demo_json = json.dumps(DEMO_PRODUCTS)
cats_json = json.dumps(ALL_CATS)

# Build JS carefully using f-strings and avoiding <\/script> issue by not embedding raw script close tags in the Python string
js_header = f"""<script>
(function() {{
var KP = 'inv_items';
var KT = 'inv_theme';
var ST = [{{v:'in_stock',l:'In Stock'}},{{v:'low_stock',l:'Low Stock'}},{{v:'out_of_stock',l:'Out of Stock'}}];

Vue.createApp({{
  data: function() {{ return {{
    items: [],
    _demo: {demo_json},
    _cats: {cats_json},
    searchQ: '',
    selectedCats: [],
    selectedSt: [],
    maxP: 3000,
    sField: 'id',
    sDir: 'asc',
    pg: 1,
    pSz: 10,
    showAddEdit: false,
    showDel: false,
    showBulkDel: false,
    delId: null,
    isEd: false,
    theme: 'light',
    selIds: [],
    f: {{sku:'',name:'',category:'',price:0,stock:0}},
    err: {{}}
  }}; }},

  computed: {{
    cats: function() {{ return this._cats.slice(); }},
    stOpts: function() {{ return ST; }},
"""

# Computed: filtered
js_computed = r"""    filtered: function() {
      var self = this, q = this.searchQ.toLowerCase();
      return this.items.filter(function(it) {
        if (q && !(self.ms(it, q))) return false;
        if (self.selectedCats.length > 0 && self.selectedCats.indexOf(it.category) === -1) return false;
        if (self.selectedSt.length > 0 && self.selectedSt.indexOf(it.status) === -1) return false;
        if (it.price > self.maxP) return false;
        return true;
      });
    },
    sorted: function() {
      var a = this.filtered.slice(), f = this.sField, d = this.sDir;
      return a.sort(function(x, y) {
        var vx = x[f], vy = y[f];
        if (typeof vx === 'string') { vx = vx.toLowerCase(); vy = vy.toLowerCase(); }
        if (vx < vy) return d === 'asc' ? -1 : 1;
        if (vx > vy) return d === 'asc' ? 1 : -1;
        return 0;
      });
    },
    pageItms: function() {
      var s = this.sorted, n = (this.pg - 1) * this.pSz;
      return s.slice(n, n + this.pSz);
    },
    tpg: function() { return Math.ceil(this.sorted.length / this.pSz); },
    pgBtns: function() {
      var tp = this.tpg, p = this.pg, r = [];
      if (tp <= 7) { for (var i = 1; i <= tp; i++) r.push(i); return r; }
      r.push(1);
      if (p > 3) r.push('e');
      var s = Math.max(2, p - 1), e = Math.min(tp - 1, p + 1);
      for (var j = s; j <= e; j++) r.push(j);
      if (p < tp - 2) r.push('e');
      r.push(tp);
      return r;
    },
    allSel: function() {
      return this.pageItms.length > 0 && this.pageItms.every(function(p) {
        return self.selIds.indexOf(p.id) !== -1;
      });
    },
    cntIn: function() { return this.filtered.filter(function(i){return i.stock>4}).length; },
    cntLow: function() { return this.filtered.filter(function(i){return 0<i.stock&&i.stock<=4}).length; },
    cntOut: function() { return this.filtered.filter(function(i){return i.stock===0}).length; },
    delT: function() {
      if (!this.delId) return null;
      for (var i = 0; i < this.items.length; i++)
        if (this.items[i].id === this.delId) return this.items[i];
      return null;
    }
  }},

"""

# Watch
js_watch = r"""  watch: {
    filtered: function() { this.pg = 1; },
    items: { handler: function(nv) { localStorage.setItem(KP, JSON.stringify(nv)); }, deep: true }
  },

"""

# Methods
js_methods = """  methods: {
    fmtP: function(v) { return Number(v).toFixed(2); },
    lblSt: function(v) {
      if (v === 'in_stock') return 'In Stock';
      if (v === 'low_stock') return 'Low Stock';
      return 'Out of Stock';
    },
    ms: function(it, q) {
      var n = (it.name||'').toLowerCase(), s = (it.sku||'').toLowerCase(), c = (it.category||'').toLowerCase();
      return n.indexOf(q) !== -1 || s.indexOf(q) !== -1 || c.indexOf(q) !== -1;
    },
    hasC: function(c) { return this.selectedCats.indexOf(c) !== -1; },
    hasS: function(v) { return this.selectedSt.indexOf(v) !== -1; },
    togC: function(c) { var i=this.selectedCats.indexOf(c); if(i===-1)this.selectedCats.push(c); else this.selectedCats.splice(i,1); },
    clearCats: function() { this.selectedCats = []; },
    togS: function(v) { var i=this.selectedSt.indexOf(v); if(i===-1)this.selectedSt.push(v); else this.selectedSt.splice(i,1); },
    clearSt: function() { this.selectedSt = []; },
    clearAll: function() { this.searchQ=''; this.selectedCats=[]; this.selectedSt=[]; this.maxP=3000; },
    sortOn: function(f) { if(this.sField===f) this.sDir=this.sDir==='asc'?'desc':'asc'; else { this.sField=f; this.sDir='asc'; } },
    scCls: function(f) { return f!==this.sField ? '' : 's'+(this.sDir==='asc'?'a':'d'); },
    allSel: function() { return this.pageItms.length>0&&this.pageItms.every(function(p){return self.selIds.indexOf(p.id)!==-1}); },
    togAll: function() { if(self.allSel()) self.selIds=[]; else self.selIds=self.pageItms.map(function(p){return p.id}); },
    pgSt: function() { return (this.pg - 1) * this.pSz + 1; },
    pgEn: function() { return Math.min(this.pg * this.pSz, this.sorted.length); },
    navPage: function(n) { this.pg = n; },

    /* Modal */
    openAdd: function() {
      this.isEd=false; this.showAddEdit=true;
      this.f={sku:'',name:'',category:'',price:0,stock:0}; this.err={};
    },
    openEdit: function(it) {
      this.isEd=true; this.showAddEdit=true;
      this.f=JSON.parse(JSON.stringify(it)); this.err={};
    },
    closeAE: function() { this.showAddEdit=false; this.err={}; },

    /* Validation */
    validate: function() {
      this.err={}; var ok=true;
      if (!this.f.sku || this.f.sku.length<2) {{ this.err.sku='SKU required (min 2 chars)'; ok=false; }}
      else if (!this.isEd && this.findSku(this.f.sku)) {{ this.err.sku='This SKU already exists'; ok=false; }}
      if (!this.f.name || this.f.name.length<2) {{ this.err.name='Name required (min 2 chars)'; ok=false; }}
      if (!this.f.category) {{ this.err.category='Pick a category'; ok=false; }}
      if (this.f.price===null||this.f.price===undefined||this.f.price<=0) {{ this.err.price='Enter a valid price > 0'; ok=false; }}
      if (this.f.stock===null||this.f.stock===undefined||this.f.stock<0) {{ this.err.stock='Stock cannot be negative'; ok=false; }}
      return ok;
    },

    /* Submit */
    doSubmit: function() {
      if (!this.validate()) return;
      var st = this.f.stock===0 ? 'out_of_stock' : (this.f.stock<=4 ? 'low_stock' : 'in_stock');
      this.f.status = st;
      if (this.isEd) {{
        for (var i=0;i<this.items.length;i++) {{
          if (this.items[i].id === this.f.id) {{ Object.assign(this.items[i], JSON.parse(JSON.stringify(this.f))); break; }}
        }}
      }} else {{
        this.f.id = Date.now();
        this.items.push(JSON.parse(JSON.stringify(this.f)));
      }}
      this.closeAE();
    },

    findSku: function(s) {{ var u=s.toUpperCase(); for(var i=0;i<this.items.length;i++) if(this.items[i].sku.toUpperCase()===u) return true; return false; }},

    /* Delete */
    delAsk: function(id) { this.delId=id; this.showDel=true; },
    doDelOne: function() {{
      for(var i=0;i<this.items.length;i++) if(this.items[i].id===this.delId) {{ this.items.splice(i,1); break; }}
      this.showDel=false; this.delId=null;
    }},

    /* Bulk */
    bulkDelAsk: function() { this.showBulkDel=true; },
    doBulkDel: function() {{
      var ids=JSON.parse(JSON.stringify(this.selIds));
      for(var i=this.items.length-1;i>=0;i--) if(ids.indexOf(this.items[i].id)!==-1) this.items.splice(i,1);
      this.selIds=[]; this.showBulkDel=false;
    }},
    restockSel: function() {{
      for(var i=0;i<this.items.length;i++) {{
        if(this.selIds.indexOf(this.items[i].id)!==-1) {{
          this.items[i].stock+=25; this.items[i].status='in_stock';
        }}
      }}
      this.selIds=[];
    }},

    /* Theme */
    flipTheme: function() {{
      this.theme = this.theme==='dark' ? 'light' : 'dark';
      localStorage.setItem(KT, this.theme);
      document.documentElement.setAttribute('data-theme', this.theme);
    }},

    pgBtns: function() {{
      var tp=this.tpg, p=this.pg, r=[];
      if(tp<=7){{for(var i=1;i<=tp;i++)r.push(i);return r;}}
      r.push(1); if(p>3)r.push('e');
      var s=Math.max(2,p-1), e=Math.min(tp-1,p+1);
      for(var j=s;j<=e;j++)r.push(j);
      if(p<tp-2)r.push('e');
      r.push(tp); return r;
    }},

    /* Load data */
    loadData: function() {{
      try {{ var d=localStorage.getItem(KP); if(d) return JSON.parse(d); }} catch(e){{}}
      return JSON.parse(JSON.stringify(this._demo));
    }}
  },

  mounted: function() {{
    var self = this;
    this.items = this.loadData();
    try {{ var t=localStorage.getItem(KT); if(t) {{ this.theme=t; document.documentElement.setAttribute('data-theme',t); }} }} catch(e){{}}
  }}
}}).mount('#app');
})();
"""

# Write the JS - need to be super careful about escaping
f.write(js_header + js_computed + js_watch + js_methods)

# Close script tag - critical to not use backslash escape
f.write("\n</script>\n")
f.write("</body>\n")
f.write("</html>\n")

f.close()

# Post-write validation
content = OUT.read_text(encoding="utf-8")
print("Written {:,} chars to {}".format(len(content), OUT))
lp = content.count('('); rp = content.count(')')
print(f"Paren balance: {lp} == {rp}")
ob = content.count('{'); cb = content.count('}')
print(f"Brace balance: {ob} == {cb}")
lb = content.count('['); rb2 = content.count(']')
print(f"Bracket balance: {lb} == {rb2}")
