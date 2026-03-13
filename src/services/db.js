import Dexie from 'dexie';
import { products as mockProducts, categories as mockCategories, suppliers as mockSuppliers } from '../data/mockData';

export const db = new Dexie('HanotiDB');

db.version(1).stores({
  categories: '++id, name',
  suppliers: '++id, name',
  products: '++id, name, categoryId, supplierId, stock',
  customers: '++id, name, debt',
  deliveries: '++id, product_id, supplier_id, date',
  losses: '++id, product_id, date'
});

// Initial seed
db.on('populate', () => {
  db.categories.bulkAdd(mockCategories);
  db.suppliers.bulkAdd(mockSuppliers);
  db.products.bulkAdd(mockProducts.map(p => ({
    ...p,
    categoryId: p.category, // map if needed
    buy_price: p.buyPrice,
    sell_price: p.sellPrice
  })));
});

export const initDb = async () => {
  if (await db.products.count() === 0) {
    console.log('Seeding local database...');
    
    // Categories
    await db.categories.bulkAdd(mockCategories.map(c => ({ name: c })));
    
    // Suppliers
    await db.suppliers.bulkAdd(mockSuppliers.map(s => ({ 
      id: s.id, 
      name: s.name, 
      image: s.logo || '📦' 
    })));
    
    // Products
    await db.products.bulkAdd(mockProducts.map(p => ({
      name: p.name,
      image: p.image,
      stock: p.stock,
      buy_price: p.buyPrice,
      sell_price: p.sellPrice,
      category: p.category,
      unit: p.unit || 'pcs'
    })));

    // Customers
    if (await db.customers.count() === 0) {
      await db.customers.bulkAdd([
        { name: 'سي محمد', debt: 150 },
        { name: 'لالة فاطمة', debt: 75.5 },
        { name: 'با أحمد', debt: 0 }
      ]);
    }
  }
};
