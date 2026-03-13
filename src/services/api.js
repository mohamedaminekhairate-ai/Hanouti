import { db, initDb } from './db';

// Database initialized in App.jsx

export const apiService = {
  // Products
  getProducts: async () => {
    return db.products.toArray();
  },
  createProduct: async (productData) => {
    const id = await db.products.add(productData);
    return { ...productData, id };
  },

  // Categories
  getCategories: async () => {
    return db.categories.toArray();
  },

  // Suppliers
  getSuppliers: async () => {
    return db.suppliers.toArray();
  },

  // Customers
  getCustomers: async () => {
    return db.customers.toArray();
  },
  createCustomer: async (customerData) => {
    const id = await db.customers.add(customerData);
    return { ...customerData, id };
  },

  // Deliveries
  getDeliveries: async () => {
    return db.deliveries.toArray();
  },
  createDelivery: async (deliveryData) => {
    const id = await db.deliveries.add(deliveryData);
    // Update stock
    const product = await db.products.get(deliveryData.product_id);
    if (product) {
      await db.products.update(product.id, {
        stock: (parseFloat(product.stock) || 0) + parseFloat(deliveryData.quantity)
      });
    }
    return { ...deliveryData, id };
  },

  // Losses
  getLosses: async () => {
    // In local mode, we join with product manually if needed, 
    // but the UI expects nested product prop in some places.
    const losses = await db.losses.toArray();
    const records = await Promise.all(losses.map(async (l) => {
      const product = await db.products.get(l.product_id);
      return { ...l, product };
    }));
    return records;
  },
  createLoss: async (lossData) => {
    const id = await db.losses.add(lossData);
    // Update stock
    const product = await db.products.get(lossData.product_id);
    if (product) {
      await db.products.update(product.id, {
        stock: (parseFloat(product.stock) || 0) - parseFloat(lossData.quantity)
      });
    }
    const result = { ...lossData, id, product };
    return result;
  },
};
