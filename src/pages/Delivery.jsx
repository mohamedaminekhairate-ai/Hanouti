import { useState, useEffect } from "react";
import PageHeader from "../components/layout/PageHeader";
import { HiTruck, HiPlus, HiArrowRight, HiCheckCircle } from "react-icons/hi2";
import { apiService } from "../services/api";

export default function Delivery() {
  const [productList, setProductList] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState("");
  const [buyPrice, setBuyPrice] = useState("");
  const [entries, setEntries] = useState([]);
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prods, sups] = await Promise.all([
          apiService.getProducts(),
          apiService.getSuppliers(),
        ]);
        setProductList(prods);
        setSuppliers(sups);
      } catch (error) {
        console.error("Failed to fetch data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const supplierProducts = selectedSupplier
    ? productList.filter(p => p.supplier_id === selectedSupplier)
    : [];

  const product = productList.find(p => p.id === selectedProduct);

  const total = quantity && buyPrice ? Number(quantity) * Number(buyPrice) : 0;

  const handleAdd = async () => {
    if (!selectedProduct || !quantity || !buyPrice) return;

    try {
      const deliveryData = {
        supplier_id: selectedSupplier,
        product_id: selectedProduct,
        quantity: parseFloat(quantity),
        buy_price: parseFloat(buyPrice),
        date: new Date().toISOString().split('T')[0],
        status: 'received'
      };

      await apiService.createDelivery(deliveryData);

      const entry = {
        id: Date.now(),
        product: product.name,
        image: product.image,
        qty: quantity,
        total: total.toLocaleString(),
        date: new Date().toLocaleDateString('ar-MA'),
        time: new Date().toLocaleTimeString('ar-MA', { hour: '2-digit', minute: '2-digit' })
      };

      setEntries([entry, ...entries]);
      setFeedback(`تمت إضافة ${product.name} بنجاح ✅`);
      
      // Reset selection logic
      setSelectedSupplier(null);
      setSelectedProduct(null);
      setQuantity("");
      setBuyPrice("");
      
      setTimeout(() => setFeedback(""), 3000);
    } catch (error) {
      console.error("Failed to record delivery", error);
      alert('خطأ في تسجيل السلعة');
    }
  };

  return (
    <div className="pb-10">
      <PageHeader
        title="الكاميو (السلعة)"
        subtitle="سجل دخول السلع الجديدة من عند الشركات"
      />

      {feedback && (
        <div className="mb-8 p-5 bg-success-50 border-2 border-success-100 rounded-[2rem] flex items-center gap-4 animate-in fade-in slide-in-from-top-4 duration-300">
           <div className="w-12 h-12 bg-success-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-success-500/20">
            <HiCheckCircle className="w-7 h-7" />
          </div>
          <p className="font-black text-success-700 text-lg">{feedback}</p>
        </div>
      )}

      {/* STEP NAVIGATION / BACK BUTTON */}
      {(selectedSupplier || selectedProduct) && (
        <button
          onClick={() => {
            if (selectedProduct) setSelectedProduct(null);
            else setSelectedSupplier(null);
          }}
          className="mb-6 flex items-center gap-2 px-5 py-3 bg-white border-2 border-gray-100 text-gray-600 rounded-2xl font-black text-sm hover:border-primary-200 hover:text-primary-600 transition-all active:scale-95 shadow-sm"
        >
          <HiArrowRight className="w-5 h-5" />
          رجوع للخطوة اللي قبل
        </button>
      )}

      <div className="bg-white border-2 border-gray-100 shadow-sm rounded-[2.5rem] p-8 mb-10 overflow-hidden relative">
        {/* Background Decoration */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary-50 rounded-full blur-3xl -mr-16 -mt-16 opacity-50"></div>

        <div className="relative z-10">
          {!selectedSupplier ? (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="text-center">
                <div className="w-20 h-20 bg-primary-50 text-primary-600 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-inner">
                  <HiTruck className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-black text-gray-800 mb-2">اختار الشركة</h3>
                <p className="text-gray-400 font-bold">أما شركة جابت ليك السلعة اليوم؟</p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {suppliers.map(s => (
                  <button
                    key={s.id}
                    onClick={() => setSelectedSupplier(s.id)}
                    className="flex flex-col items-center p-6 bg-gray-50 border-2 border-transparent rounded-[2rem] hover:border-primary-400 hover:bg-white transition-all group hover:shadow-xl hover:shadow-primary-500/5"
                  >
                    <span className="text-5xl mb-3 group-hover:scale-110 transition-transform duration-300">{s.logo}</span>
                    <span className="text-lg font-black text-gray-700 text-center">{s.name}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : !selectedProduct ? (
            <div className="space-y-8 animate-in fade-in slide-in-from-left-4 duration-500">
              <div className="text-center">
                <div className="w-20 h-20 bg-primary-50 text-primary-600 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-inner">
                  <span className="text-4xl">{suppliers.find(s => s.id === selectedSupplier)?.logo}</span>
                </div>
                <h3 className="text-2xl font-black text-gray-800 mb-2">اختار السلعة</h3>
                <p className="text-gray-400 font-bold">شنو هي السلعة اللي نزلات من الكاميو؟</p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {supplierProducts.map(p => (
                  <button
                    key={p.id}
                    onClick={() => {
                      setSelectedProduct(p.id);
                      setBuyPrice(p.buyPrice?.toString() || "");
                    }}
                    className="flex flex-col items-center p-6 bg-gray-50 border-2 border-transparent rounded-[2rem] hover:border-primary-400 hover:bg-white transition-all group hover:shadow-xl hover:shadow-primary-500/5 overflow-hidden"
                  >
                    <div className="w-16 h-16 mb-3 group-hover:scale-110 transition-transform duration-300 flex items-center justify-center text-4xl">
                       {p.image && p.image.startsWith('http') ? (
                         <img src={p.image} className="w-full h-full object-cover rounded-xl" />
                       ) : p.image && p.image.startsWith('data:') ? (
                         <img src={p.image} className="w-full h-full object-cover rounded-xl" />
                       ) : (
                         p.image || '📦'
                       )}
                    </div>
                    <span className="text-base font-black text-gray-700 text-center leading-tight">{p.name}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500 text-center">
              <div className="max-w-xs mx-auto">
                <div className="w-32 h-32 bg-primary-50 text-primary-600 rounded-[2.5rem] flex items-center justify-center mx-auto mb-6 shadow-inner border-2 border-primary-100 overflow-hidden">
                  {product.image && product.image.startsWith('http') ? (
                    <img src={product.image} className="w-full h-full object-cover" />
                  ) : product.image && product.image.startsWith('data:') ? (
                    <img src={product.image} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-6xl">{product.image || '📦'}</span>
                  )}
                </div>
                <h3 className="text-3xl font-black text-gray-800 mb-6">{product.name}</h3>

                <div className="space-y-6">
                  <div className="text-right">
                    <label className="block text-sm font-black text-gray-400 mb-2">ثمن الشراء بشحال جابو ليك (د.م)</label>
                    <input
                      type="number"
                      value={buyPrice}
                      onChange={(e) => setBuyPrice(e.target.value)}
                      min="0"
                      step="any"
                      onKeyDown={(e) => {
                        if (['e', 'E', '+', '-'].includes(e.key)) e.preventDefault();
                      }}
                      className="w-full bg-primary-50 border-2 border-primary-100 rounded-3xl px-6 py-4 text-2xl font-black focus:outline-none focus:ring-4 focus:ring-primary-100 focus:border-primary-500 transition-all text-primary-900"
                    />
                  </div>

                  <div className="text-right">
                    <label className="block text-sm font-black text-gray-400 mb-2">أدخل الكمية</label>
                    <input
                      type="number"
                      placeholder="0"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      autoFocus
                      min="0"
                      onKeyDown={(e) => {
                        if (['e', 'E', '+', '-'].includes(e.key)) e.preventDefault();
                      }}
                      className="w-full bg-gray-50 border-2 border-gray-100 rounded-3xl px-6 py-5 text-3xl text-center font-black focus:outline-none focus:ring-4 focus:ring-primary-100 focus:border-primary-500 transition-all text-gray-800"
                    />
                  </div>

                  {quantity > 0 && (
                    <div className="p-5 bg-success-50 rounded-3xl border-2 border-success-100 animate-in bounce-in duration-500">
                      <p className="text-gray-500 font-bold mb-1">المجموع الصافي:</p>
                      <p className="text-4xl font-black text-success-600">{total.toLocaleString()} <span className="text-lg">د.م</span></p>
                    </div>
                  )}

                  <button
                    onClick={handleAdd}
                    disabled={!quantity}
                    className="w-full py-5 bg-primary-500 hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black rounded-[1.5rem] shadow-xl shadow-primary-500/25 active:scale-[0.98] transition-all flex items-center justify-center gap-3 text-lg group"
                  >
                    <HiPlus className="w-7 h-7 group-hover:rotate-90 transition-transform" />
                    سجل السلعة دابا
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* RECENT ENTRIES */}
      {entries.length > 0 && (
        <div className="space-y-6">
          <h3 className="text-xl font-black text-gray-800 flex items-center gap-3 px-2">
            <span className="w-2 h-8 bg-primary-500 rounded-full"></span>
            آخر السلع لي دخلنا ف هاد الجلسة
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {entries.map((e) => (
              <div key={e.id} className="bg-white border-2 border-gray-50 p-5 rounded-[2rem] flex items-center gap-4 hover:border-primary-100 transition-colors group">
                <div className="w-16 h-16 rounded-2xl bg-primary-50 flex items-center justify-center text-3xl shrink-0 group-hover:scale-110 transition-transform overflow-hidden">
                  {e.image && e.image.startsWith('http') ? (
                    <img src={e.image} className="w-full h-full object-cover" />
                  ) : e.image && e.image.startsWith('data:') ? (
                    <img src={e.image} className="w-full h-full object-cover" />
                  ) : (
                    e.image || '📦'
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-black text-gray-800 truncate text-lg">{e.product}</p>
                  <p className="text-sm font-bold text-gray-400">{e.date} · {e.time}</p>
                </div>
                <div className="text-left bg-success-50/50 px-5 py-3 rounded-2xl border border-success-100/30">
                  <p className="text-success-600 font-black text-xl leading-none mb-1">+{e.qty}</p>
                  <p className="text-[10px] font-bold text-success-400">{e.total} د.م</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}