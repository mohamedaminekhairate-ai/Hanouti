import { useState, useEffect } from 'react';
import PageHeader from '../components/layout/PageHeader';
import ProductCard from '../components/ProductCard';
import FormInput from '../components/FormInput';
import { HiPlus, HiXMark } from 'react-icons/hi2';
import { apiService } from '../services/api';

export default function Products() {
  const [productList, setProductList] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSupplier, setSelectedSupplier] = useState('all');
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    id: null,
    name: '',
    supplier_id: '',
    buy_price: '',
    sell_price: '',
    stock: '',
    category_id: '',
    image: '', 
    imagePreview: null 
  });

  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prods, sups, cats] = await Promise.all([
          apiService.getProducts(),
          apiService.getSuppliers(),
          apiService.getCategories(),
        ]);
        setProductList(prods);
        setSuppliers(sups);
        setCategories(cats);
      } catch (error) {
        console.error("Failed to fetch data", error);
        setFeedback('خطأ في تحميل البيانات');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredProducts = productList.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchSupplier = selectedSupplier === 'all' || p.supplier_id.toString() === selectedSupplier;
    return matchSearch && matchSupplier;
  });

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm({ ...form, image: reader.result, imagePreview: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const openAdd = () => {
    setForm({ id: null, name: '', image: '', imagePreview: null, supplier_id: '', buy_price: '', sell_price: '', stock: '', category_id: '' });
    setShowAddModal(true);
  };

  const openEdit = (product) => {
    setForm({ 
      ...product, 
      supplier_id: product.supplier_id,
      category_id: product.category_id,
      buy_price: product.buy_price,
      sell_price: product.sell_price,
      imagePreview: product.image 
    });
    setShowAddModal(true);
  };

  const handleDelete = (product) => {
    if (confirm(`بغيتي تحذف ${product.name}?`)) {
      setProductList((prev) => prev.filter((p) => p.id !== product.id));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const productData = {
      name: form.name,
      category_id: form.category_id,
      supplier_id: form.supplier_id,
      buy_price: parseFloat(form.buy_price),
      sell_price: parseFloat(form.sell_price),
      stock: parseInt(form.stock),
      image: form.image,
    };

    try {
      if (form.id) {
        // Update logic (to be added to apiService)
        alert('تعديل متاح قريبا');
      } else {
        const result = await apiService.createProduct(productData);
        setProductList((prev) => [result, ...prev]);
        setShowAddModal(false);
      }
    } catch (error) {
      console.error("Failed to save product", error);
      alert('خطأ في حفظ السلعة');
    }
  };

  return (
    <div className="pb-10">
      <PageHeader
        title="السلع"
        subtitle={`${productList.length} سلعة واجدة`}
      />

      {/* SEARCH AND ACTIONS */}
      <div className="mb-10 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search Bar (Ra9m 1) */}
          <div className="relative group flex-1">
            <span className="absolute right-5 top-1/2 -translate-y-1/2 text-2xl z-10 opacity-50 text-gray-400 transition-opacity group-focus-within:opacity-100 group-focus-within:text-primary-500">
              🔍
            </span>
            <input
              type="text"
              placeholder="قلب على السلعة..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-full bg-white border-2 border-gray-100 rounded-3xl pr-14 pl-6 py-4 text-gray-800 text-lg font-bold focus:outline-none focus:ring-4 focus:ring-primary-50 focus:border-primary-400 transition-all placeholder:text-gray-300 shadow-sm hover:border-gray-200"
            />
          </div>

          {/* Supplier Filter (New) */}
          <div className="relative shrink-0 md:w-72">
            <select
              value={selectedSupplier}
              onChange={(e) => setSelectedSupplier(e.target.value)}
              className="w-full h-full bg-white border-2 border-primary-100 rounded-[2rem] px-6 py-5 text-gray-800 text-xl font-black focus:outline-none focus:ring-4 focus:ring-primary-50 focus:border-primary-400 transition-all shadow-md hover:border-primary-200 appearance-none cursor-pointer pr-16
              bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%236366F1%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-[length:16px_16px] bg-[position:right_1.5rem_center] bg-no-repeat"
            >
              <option value="all">🏢 فرز بالشركات...</option>
              {suppliers.map((s) => (
                <option key={s.id} value={s.id} className="font-bold py-2">
                  {s.logo || '🏢'} {s.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Add Product Button (Ra9m 2) */}
        <button
          onClick={openAdd}
          className="w-full py-4 bg-primary-500 hover:bg-primary-600 text-white font-black rounded-3xl shadow-lg shadow-primary-500/30 hover:shadow-xl hover:-translate-y-1 active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-3 text-xl border border-primary-400/50"
        >
          <HiPlus className="w-7 h-7" />
          زيد سلعة جديدة
        </button>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        {filteredProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onEdit={openEdit}
            onDelete={handleDelete}
          />
        ))}
      </div>

      {/* FAB */}
      <button
        onClick={openAdd}
        className="fixed bottom-20 lg:bottom-6 left-4 lg:left-8 w-14 h-14 bg-gradient-to-br from-primary-500 to-primary-700 text-white rounded-2xl shadow-lg shadow-primary-500/30 flex items-center justify-center text-2xl hover:scale-110 active:scale-95 transition-transform z-40"
      >
        <HiPlus />
      </button>

      {/* Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 z-[100] flex items-end lg:items-center justify-center p-0 lg:p-6 backdrop-blur-sm transition-all duration-300">
          <div className="bg-white w-full lg:w-[700px] lg:rounded-[2rem] rounded-t-[2.5rem] max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-white/95 backdrop-blur-md border-b-2 border-gray-100 p-6 flex items-center justify-between rounded-t-[2.5rem] lg:rounded-t-[2rem] z-10">
              <h2 className="font-black text-2xl text-gray-800">
                {form.id ? '✍️ تعديل سلعة' : '📦 زيد سلعة جديدة'}
              </h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 hover:text-rose-500 transition-colors"
              >
                <HiXMark className="w-7 h-7" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
              <div className="space-y-3">
              <label className="block text-base font-black text-gray-700 ml-1">صورة السلعة</label>
              <div className="flex items-center gap-6">
                {form.imagePreview ? (
                  <div className="w-24 h-24 rounded-2xl bg-gray-100 flex items-center justify-center overflow-hidden border-2 border-gray-200 shrink-0 shadow-sm">
                    <img src={form.imagePreview} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                ) : form.image && form.image.startsWith('http') ? (
                   <div className="w-24 h-24 rounded-2xl bg-gray-100 flex items-center justify-center overflow-hidden border-2 border-gray-200 shrink-0 shadow-sm">
                    <img src={form.image} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="w-24 h-24 rounded-2xl bg-gray-50 flex items-center justify-center text-4xl border-2 border-dashed border-gray-300 shrink-0">
                    {'📦'}
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="block w-full text-base text-gray-500
                    file:mr-4 file:py-3.5 file:px-6
                    file:rounded-2xl file:border-0
                    file:text-base file:font-bold
                    file:bg-primary-50 file:text-primary-700
                    hover:file:bg-primary-100 transition-colors cursor-pointer"
                />
              </div>
            </div>
              <FormInput
                label="اسم السلعة"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="مثلا: حليب سنطرال"
                required
              />

              <div className="space-y-4">
                <FormInput
                  label="الشركة"
                  type="select"
                  value={form.supplier_id}
                  onChange={(e) => setForm({ ...form, supplier_id: e.target.value })}
                  options={[
                    { value: '', label: 'اختر الشركة...' },
                     ...suppliers.map((s) => ({ value: s.id, label: s.name })),
                  ]}
                  required
                />
              </div>

              <div className="space-y-4">
                <FormInput
                  label="التصنيف"
                  type="select"
                  value={form.category_id}
                  onChange={(e) => setForm({ ...form, category_id: e.target.value })}
                  options={[
                    { value: '', label: 'اختر التصنيف...' },
                     ...categories.map((c) => ({ value: c.id, label: `${c.icon || '📦'} ${c.name}` })),
                  ]}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <FormInput
                  label="ثمن الشرا"
                  type="number"
                  value={form.buy_price}
                  onChange={(e) => setForm({ ...form, buy_price: e.target.value })}
                  placeholder="0.00"
                  required
                />
                <FormInput
                  label="ثمن البيع"
                  type="number"
                  value={form.sell_price}
                  onChange={(e) => setForm({ ...form, sell_price: e.target.value })}
                  placeholder="0.00"
                  required
                />
              </div>

              <div className="space-y-6">
                <FormInput
                  label="الكمية"
                  type="number"
                  value={form.stock}
                  onChange={(e) => setForm({ ...form, stock: e.target.value })}
                  placeholder="0"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-6 bg-gradient-to-l from-primary-500 to-primary-700 text-white rounded-[2rem] font-black text-2xl shadow-xl shadow-primary-500/30 hover:shadow-2xl hover:-translate-y-1 active:scale-[0.98] transition-all mt-4"
              >
                {form.id ? '💾 حفظ التعديلات' : '✅ زيد السلعة'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
