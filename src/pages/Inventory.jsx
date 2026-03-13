import { useState, useEffect } from 'react';
import PageHeader from '../components/layout/PageHeader';
import FormInput from '../components/FormInput';
import { HiClipboardDocumentCheck, HiCheckCircle } from 'react-icons/hi2';
import { apiService } from '../services/api';

export default function Inventory() {
  const [inventoryData, setInventoryData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const prods = await apiService.getProducts();
        setInventoryData(prods.map(p => ({ ...p, counted: '' })));
      } catch (error) {
        console.error("Failed to fetch products", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const filteredData = inventoryData.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase().trim())
  );

  const updateCount = (id, value) => {
    setInventoryData((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          // Allow empty string or 0
          if (value === '') return { ...p, counted: '' };
          const numValue = parseInt(value, 10);
          
          // Must not exceed the system stock to prevent negative diffs when we don't want them
          // If the typed value is greater than the system stock, we cap it at the stock value
          const cappedValue = Math.min(Math.max(0, numValue || 0), p.stock);
          
          return { ...p, counted: cappedValue.toString() };
        }
        return p;
      })
    );
  };

  const handleSave = async () => {
    // For now, we just simulate saving since bulk update isn't implemented in backend yet
    console.log("Saving inventory session...");
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="pb-64 lg:pb-48">
      <PageHeader
        title="الجرد"
        subtitle="تحقق واش السلعة هي هاديك فالمحل"
      />

      {saved && (
        <div className="mb-8 p-5 bg-primary-50 border-2 border-primary-100 rounded-[2rem] flex items-center gap-4 animate-in fade-in slide-in-from-top-4 duration-300">
           <div className="w-12 h-12 bg-primary-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-primary-500/20">
            <HiCheckCircle className="w-7 h-7" />
          </div>
          <p className="font-black text-primary-700 text-lg">تم حفظ الجرد بنجاح! ✅</p>
        </div>
      )}

      {/* SEARCH */}
      <div className="mb-10">
        <FormInput 
          placeholder="قلب على السلعة باش تعبرها..."
          icon="🔍"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="shadow-sm border-gray-50"
        />
      </div>

      <div className="space-y-4 mb-10">
        {filteredData.map((product) => {
          const supplier = product.supplier;
          const diff = parseInt(product.counted || 0) - product.stock;
          const hasDiff = diff !== 0;

          return (
            <div
              key={product.id}
              className="bg-white rounded-[2rem] shadow-sm border-2 border-gray-100 p-5 flex items-center gap-4 hover:border-primary-100 transition-all group relative"
            >
              {/* Product Image */}
              <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center text-3xl shrink-0 border border-gray-100 group-hover:scale-105 transition-transform">
                 {product.image && product.image.startsWith('http') ? (
                    <img src={product.image} className="w-full h-full object-cover rounded-2xl" />
                 ) : product.image && product.image.startsWith('data:') ? (
                    <img src={product.image} className="w-full h-full object-cover rounded-2xl" />
                 ) : (
                    product.image || '📦'
                 )}
              </div>

              {/* Product Info */}
              <div className="flex-1 min-w-0">
                <h3 className="font-black text-gray-800 text-lg truncate mb-0.5">
                  {product.name}
                </h3>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black text-gray-400 bg-gray-50 px-2.5 py-1 rounded-lg">
                    فالسيستام: {product.stock}
                  </span>
                  {supplier && (
                    <span className="text-[10px] font-bold text-gray-300">
                      {supplier.name}
                    </span>
                  )}
                </div>
              </div>

              {/* Count Input */}
              <div className="shrink-0 flex items-center gap-3">
                <div className="flex flex-col items-center">
                  <span className="text-[10px] font-bold text-gray-400 mb-1">فالسيستام</span>
                  <div className="w-16 h-12 bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl flex items-center justify-center font-black text-gray-500 text-lg">
                    {product.stock}
                  </div>
                </div>
                
                <div className="flex flex-col items-center relative">
                  <span className="text-[10px] font-bold text-primary-500 mb-1">شحال كاين</span>
                  <input
                    type="number"
                    value={product.counted}
                    onChange={(e) => updateCount(product.id, e.target.value)}
                    placeholder="0"
                    min="0"
                    onKeyDown={(e) => {
                      if (['e', 'E', '+', '-', '.', ','].includes(e.key)) {
                        e.preventDefault();
                      }
                    }}
                    className="w-20 h-12 text-center text-xl font-black bg-primary-50 border-2 border-primary-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-primary-100 focus:border-primary-500 transition-all text-primary-900 placeholder:text-primary-300"
                  />
                  {hasDiff && product.counted !== '' && (
                    <p
                      className={`text-[11px] font-black absolute -bottom-5 right-0 left-0 text-center ${
                        diff > 0 ? 'text-emerald-500' : 'text-rose-500'
                      }`}
                    >
                      {diff > 0 ? `+${diff}` : diff}
                    </p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Save Button - Fixed at bottom */}
      <div className="fixed bottom-24 lg:bottom-6 right-0 left-0 lg:right-64 px-4 z-40">
        <button
          onClick={handleSave}
          className="w-full py-5 bg-primary-600 text-white rounded-2xl font-black text-lg shadow-2xl shadow-primary-600/30 hover:bg-primary-700 active:scale-[0.98] transition-all flex items-center justify-center gap-3 group"
        >
          <HiClipboardDocumentCheck className="w-7 h-7 group-hover:scale-110 transition-transform" />
          حفظ الحساب دابا
        </button>
      </div>
    </div>
  );
}
