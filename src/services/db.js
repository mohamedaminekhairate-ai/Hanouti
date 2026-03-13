import Dexie from 'dexie';
import { products as mockProducts, categories as mockCategories, suppliers as mockSuppliers } from '../data/mockData';

export const db = new Dexie('HanotiDB');

db.version(1).stores({
  categories: '++id, name',
  suppliers: '++id, name',
  products: '++id, name, category_id, supplier_id, stock',
  customers: '++id, name, debt',
  deliveries: '++id, product_id, supplier_id, date',
  losses: '++id, product_id, date'
});

export const initDb = async () => {
  await db.open();
  
  if (await db.products.count() === 0) {
    console.log('Seeding local database...');
    
    // 1. Categories
    const categoryNames = mockCategories; // ['ألبان', ...]
    const categoryIds = {};
    for (const name of categoryNames) {
      const id = await db.categories.add({ name });
      categoryIds[name] = id;
    }
    
    // 2. Suppliers
    const supplierIds = {};
    for (const s of mockSuppliers) {
      const id = await db.suppliers.add({ 
        name: s.name, 
        image: s.logo || '📦' 
      });
      supplierIds[s.id] = id; // mapping original mock ID to new ID
    }
    
    // 3. Products
    await db.products.bulkAdd(mockProducts.map(p => ({
      name: p.name,
      image: p.image,
      stock: p.stock,
      buy_price: p.buyPrice,
      sell_price: p.sellPrice,
      category_id: categoryIds[p.category] || null,
      supplier_id: supplierIds[p.supplierId] || null,
      unit: p.unit || 'pcs'
    })));

    // 4. Customers
    await db.customers.bulkAdd([
      { name: 'سي محمد', debt: 150 },
      { name: 'لالة فاطمة', debt: 75.5 },
      { name: 'با أحمد', debt: 0 }
    ]);
  }
};
