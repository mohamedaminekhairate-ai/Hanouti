const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export const apiService = {
  // Products
  getProducts: async () => {
    const response = await fetch(`${API_URL}/products`);
    return response.json();
  },
  createProduct: async (productData) => {
    const response = await fetch(`${API_URL}/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(productData),
    });
    return response.json();
  },

  // Categories
  getCategories: async () => {
    const response = await fetch(`${API_URL}/categories`);
    return response.json();
  },

  // Suppliers
  getSuppliers: async () => {
    const response = await fetch(`${API_URL}/suppliers`);
    return response.json();
  },

  // Customers
  getCustomers: async () => {
    const response = await fetch(`${API_URL}/customers`);
    return response.json();
  },
  createCustomer: async (customerData) => {
    const response = await fetch(`${API_URL}/customers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(customerData),
    });
    return response.json();
  },

  // Deliveries
  getDeliveries: async () => {
    const response = await fetch(`${API_URL}/deliveries`);
    return response.json();
  },
  createDelivery: async (deliveryData) => {
    const response = await fetch(`${API_URL}/deliveries`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(deliveryData),
    });
    return response.json();
  },

  // Losses
  getLosses: async () => {
    const response = await fetch(`${API_URL}/losses`);
    return response.json();
  },
  createLoss: async (lossData) => {
    const response = await fetch(`${API_URL}/losses`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(lossData),
    });
    return response.json();
  },
};
