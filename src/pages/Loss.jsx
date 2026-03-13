import { useState, useEffect } from "react";
import PageHeader from "../components/layout/PageHeader";
import FormInput from "../components/FormInput";
import { lossReasons } from "../data/mockData";
import { HiExclamationTriangle, HiCheckCircle } from "react-icons/hi2";
import { apiService } from "../services/api";

export default function Loss() {
  const [productList, setProductList] = useState([]);
  const [form, setForm] = useState({
    productId: "",
    quantity: "",
    reason: "",
  });

  const [losses, setLosses] = useState([]);
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prods, lossData] = await Promise.all([
          apiService.getProducts(),
          apiService.getLosses(),
        ]);
        setProductList(prods);
        setLosses(lossData);
      } catch (error) {
        console.error("Failed to fetch data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const selectedProduct = productList.find(
    (p) => p.id === parseInt(form.productId)
  );

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.productId || !form.quantity || !form.reason) return;

    const quantity = parseInt(form.quantity);
    const product = productList.find((p) => p.id === parseInt(form.productId));

    if (!product) return;

    if (quantity > product.stock) {
      setFeedback("الكمية أكبر من المخزون!");
      setTimeout(() => setFeedback(""), 3000);
      return;
    }

    try {
      const lossData = {
        product_id: product.id,
        quantity: quantity,
        reason: form.reason,
        date: new Date().toISOString().split('T')[0],
      };

      const result = await apiService.createLoss(lossData);

      setLosses([result, ...losses]);
      setForm({ productId: "", quantity: "", reason: "" });
      setFeedback("تم تسجيل الخسارة بنجاح ✅");
      setTimeout(() => setFeedback(""), 3000);
    } catch (error) {
      console.error("Failed to record loss", error);
      alert('خطأ في تسجيل الخسارة');
    }
  };

  return (
    <div className="pb-48 lg:pb-32">
      <PageHeader
        title="الخسائر"
        subtitle="سجل السلع اللي ضاعو ولا تخسرو"
      />

      {feedback && (
        <div className={`mb-8 p-5 rounded-[2rem] border-2 flex items-center gap-4 animate-in fade-in slide-in-from-top-4 duration-300 ${
          feedback.includes('!') ? 'bg-red-50 border-red-100 text-red-700' : 'bg-primary-50 border-primary-100 text-primary-700'
        }`}>
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg ${
            feedback.includes('!') ? 'bg-red-500 shadow-red-500/20' : 'bg-primary-500 shadow-primary-500/20'
          }`}>
            {feedback.includes('!') ? <HiExclamationTriangle className="w-7 h-7" /> : <HiCheckCircle className="w-7 h-7" />}
          </div>
          <p className="font-black text-lg">{feedback}</p>
        </div>
      )}

      {/* FORM */}
      <form onSubmit={handleSubmit} className="mb-24 space-y-6">
        <div className="bg-white border-2 border-gray-100 shadow-sm rounded-[2.5rem] p-8">
          <div className="flex items-center gap-3 mb-8 border-b border-gray-50 pb-5">
            <div className="w-12 h-12 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center shadow-inner">
              <HiExclamationTriangle className="w-6 h-6" />
            </div>
            <h2 className="font-black text-gray-800 text-xl">
              سجل خسارة جديدة
            </h2>
          </div>

          <div className="space-y-8 bg-gray-50/50 p-6 md:p-8 rounded-[2rem] border-2 border-gray-100">
            <FormInput
              label="شنو هي السلعة اللي ضاعت؟"
              type="select"
              value={form.productId}
              onChange={(e) => setForm({ ...form, productId: e.target.value })}
              options={productList.map((p) => ({ value: p.id, label: p.name }))}
              required
              className="py-5 text-xl"
            />

            {selectedProduct && (
              <div className="flex items-center gap-5 p-6 border-2 border-primary-100 rounded-[2rem] bg-white animate-in zoom-in-95 duration-300 shadow-sm">
                <div className="w-24 h-24 rounded-2xl bg-gray-50 flex items-center justify-center text-5xl shadow-inner border border-gray-100 overflow-hidden shrink-0">
                  {selectedProduct.image && selectedProduct.image.startsWith('http') ? (
                    <img src={selectedProduct.image} className="w-full h-full object-cover" />
                  ) : selectedProduct.image && selectedProduct.image.startsWith('data:') ? (
                    <img src={selectedProduct.image} className="w-full h-full object-cover" />
                  ) : (
                    <span>{selectedProduct.image || '📦'}</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-black text-gray-800 text-2xl mb-3 truncate">
                    {selectedProduct.name}
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <span className="text-base font-black text-primary-600 bg-primary-50 px-4 py-2 rounded-xl border border-primary-100">
                      المخزون الحالي: {selectedProduct.stock}
                    </span>
                    <span className="text-base font-black text-gray-500 bg-gray-100 px-4 py-2 rounded-xl border border-gray-200">
                      ثمن الشراء: {selectedProduct.buy_price} د.م
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-4">
              <div>
                <label className="block text-sm font-black text-gray-500 mb-3 px-1">شحال من حبة ضاعت؟</label>
                <div className="relative group">
                  <input
                    type="number"
                    value={form.quantity}
                    onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                    placeholder="0"
                    min="1"
                    required
                    onKeyDown={(e) => {
                      if (['e', 'E', '+', '-', '.', ','].includes(e.key)) e.preventDefault();
                    }}
                    className="w-full bg-white border-2 border-gray-200 rounded-3xl px-6 py-5 text-2xl font-black text-gray-800 focus:outline-none focus:ring-4 focus:ring-red-50 focus:border-red-400 transition-all placeholder:text-gray-300 hover:border-gray-300"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-black text-gray-500 mb-3 px-1">السبب ديال الخسارة</label>
                <div className="relative group">
                  <select
                    value={form.reason}
                    onChange={(e) => setForm({ ...form, reason: e.target.value })}
                    required
                    className="w-full bg-white border-2 border-gray-200 rounded-3xl px-6 py-5 text-xl font-bold text-gray-800 focus:outline-none focus:ring-4 focus:ring-red-50 focus:border-red-400 transition-all hover:border-gray-300 appearance-none cursor-pointer bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%239CA3AF%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-[length:14px_14px] bg-[position:left_1.5rem_center] bg-no-repeat"
                  >
                    <option value="" disabled>اختار السبب...</option>
                    {lossReasons.map((r) => (
                      <option key={r} value={r} className="py-2">{r}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Submit Button */}
        <div className="fixed bottom-24 left-0 right-0 px-4 z-[100] pointer-events-none flex justify-center">
          <button
            type="submit"
            className="w-full max-w-lg py-5 bg-red-500 hover:bg-red-600 text-white font-black rounded-full shadow-2xl shadow-red-500/40 active:scale-[0.98] transition-all flex items-center justify-center gap-3 text-xl group pointer-events-auto border-4 border-white"
          >
            <HiExclamationTriangle className="w-7 h-7 group-hover:rotate-12 transition-transform drop-shadow" />
            سجل الخسارة دابا
          </button>
        </div>
      </form>

      {/* HISTORY */}
      {losses.length > 0 && (
        <div className="space-y-6">
          <h3 className="text-xl font-black text-gray-800 flex items-center gap-3 px-2">
            <span className="w-2 h-8 bg-red-500 rounded-full"></span>
            آخر الخسائر المسجلة
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {losses.map((loss) => (
              <div key={loss.id} className="bg-white border-2 border-gray-50 p-5 rounded-[2rem] flex items-center gap-4 hover:border-red-100 transition-colors group">
                <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center text-3xl shrink-0 group-hover:scale-110 transition-transform overflow-hidden">
                  {loss.product?.image && loss.product.image.startsWith('http') ? (
                    <img src={loss.product.image} className="w-full h-full object-cover rounded-2xl" />
                  ) : loss.product?.image && loss.product.image.startsWith('data:') ? (
                    <img src={loss.product.image} className="w-full h-full object-cover rounded-2xl" />
                  ) : (
                    loss.product?.image || '📦'
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-black text-gray-800 truncate">{loss.product?.name}</p>
                  <p className="text-sm font-bold text-gray-400">{loss.reason} · {loss.date}</p>
                </div>
                <div className="text-left bg-red-50/50 px-4 py-2 rounded-2xl border border-red-100/30">
                  <p className="text-red-600 font-black text-lg leading-none mb-1">×{loss.quantity}</p>
                  <p className="text-[10px] font-bold text-red-400">-{ (loss.quantity * (loss.product?.buy_price || 0)).toLocaleString() } د.م</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
