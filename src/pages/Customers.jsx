import { useState, useEffect } from 'react';
import PageHeader from '../components/layout/PageHeader';
import CustomerCard from '../components/CustomerCard';
import FormInput from '../components/FormInput';
import { HiPlus, HiXMark, HiCheckCircle } from 'react-icons/hi2';
import { apiService } from '../services/api';

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showCreditModal, setShowCreditModal] = useState(false);
  const [showPayModal, setShowPayModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [newName, setNewName] = useState('');
  const [amount, setAmount] = useState('');
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const data = await apiService.getCustomers();
        setCustomers(data);
      } catch (error) {
        console.error("Failed to fetch customers", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCustomers();
  }, []);

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalDebt = customers.reduce((sum, c) => sum + c.debt, 0);

  const handleAddCustomer = async (e) => {
    e.preventDefault();
    try {
      const result = await apiService.createCustomer({ name: newName, debt: 0 });
      setCustomers([result, ...customers]);
      setNewName('');
      setShowAddModal(false);
      showFeedback('تم زيادة الزبون بنجاح! ✅');
    } catch (error) {
      console.error("Failed to add customer", error);
    }
  };

  const handleAddCredit = async (e) => {
    e.preventDefault();
    const parsedAmount = parseFloat(amount);
    if (!parsedAmount) return;
    
    // For now, we update local state and alert (full transaction logic needs separate API table)
    alert('تسجيل الكريدي متاح قريبا فالسيستام');
    setAmount('');
    setShowCreditModal(false);
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    const parsedAmount = parseFloat(amount);
    if (!parsedAmount) return;

    alert('تسجيل الخلاص متاح قريبا فالسيستام');
    setAmount('');
    setShowPayModal(false);
  };

  const showFeedback = (msg) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(''), 2000);
  };

  const openCredit = (customer) => {
    setSelectedCustomer(customer);
    setAmount('');
    setShowCreditModal(true);
  };

  const openPayment = (customer) => {
    setSelectedCustomer(customer);
    setAmount('');
    setShowPayModal(true);
  };

  const openHistory = (customer) => {
    setSelectedCustomer(customer);
    setShowHistoryModal(true);
  };

  return (
    <div className="pb-10">
      <PageHeader
        title="الكريدي"
        subtitle={`${customers.length} زبون معلق · المجموع: ${totalDebt.toLocaleString()} د.م`}
      />

      {feedback && (
        <div className="mb-8 p-5 bg-emerald-50 border-2 border-emerald-100 rounded-[2rem] flex items-center gap-4 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
            <HiCheckCircle className="w-7 h-7" />
          </div>
          <p className="font-black text-emerald-700 text-lg">{feedback}</p>
        </div>
      )}

      {/* SEARCH AND ACTIONS */}
      <div className="mb-10 space-y-6">
        <FormInput 
          placeholder="قلب على شي زبون..."
          icon="🔍"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="shadow-sm border-gray-50"
        />

        <button
          onClick={() => setShowAddModal(true)}
          className="w-full py-5 bg-primary-500 hover:bg-primary-600 text-white font-black rounded-2xl shadow-xl shadow-primary-500/25 active:scale-[0.98] transition-all flex items-center justify-center gap-3 text-lg group"
        >
          <HiPlus className="w-6 h-6 group-hover:rotate-90 transition-transform" />
          زيد زبون جديد
        </button>
      </div>

      {/* Customers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        {filteredCustomers.map((customer) => (
          <CustomerCard
            key={customer.id}
            customer={{...customer, onViewHistory: openHistory}}
            onAddCredit={openCredit}
            onPayment={openPayment}
          />
        ))}
      </div>

      {/* Modals */}
      {showAddModal && (
        <ModalWrapper onClose={() => setShowAddModal(false)} title="زيد زبون جديد">
          <form onSubmit={handleAddCustomer} className="space-y-6 p-2">
            <FormInput
              label="اسم الزبون"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="مثلا: سي محمد"
              icon="👤"
              required
            />
            <button
              type="submit"
              className="w-full py-4.5 bg-primary-600 text-white rounded-2xl font-black shadow-lg shadow-primary-600/25 active:scale-[0.98] transition-all"
            >
              ✅ زيد الزبون دابا
            </button>
          </form>
        </ModalWrapper>
      )}

      {showCreditModal && (
        <ModalWrapper onClose={() => setShowCreditModal(false)} title={`زيد كريدي ل ${selectedCustomer?.name}`}>
          <form onSubmit={handleAddCredit} className="space-y-6 p-2">
            <FormInput
              label="شحال خدى (د.م)"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              icon="💰"
              required
            />
            <button
              type="submit"
              className="w-full py-4.5 bg-orange-500 text-white rounded-2xl font-black shadow-lg shadow-orange-500/25 active:scale-[0.98] transition-all"
            >
              📝 سجل الكريدي
            </button>
          </form>
        </ModalWrapper>
      )}

      {showPayModal && (
        <ModalWrapper onClose={() => setShowPayModal(false)} title={`خلاص ديال ${selectedCustomer?.name}`}>
          <form onSubmit={handlePayment} className="space-y-6 p-2">
            <div className="bg-rose-50 rounded-[1.5rem] p-5 text-center border-2 border-rose-100/50">
              <p className="text-xs font-black text-rose-400 uppercase tracking-widest mb-1">باقي عليه</p>
              <p className="text-3xl font-black text-rose-600">{selectedCustomer?.debt.toLocaleString()} د.م</p>
            </div>
            <FormInput
              label="شحال خلص (د.م)"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              icon="💵"
              required
            />
            <button
              type="submit"
              className="w-full py-4.5 bg-primary-600 text-white rounded-2xl font-black shadow-lg shadow-primary-600/25 active:scale-[0.98] transition-all"
            >
              ✅ سجل الخلاص
            </button>
          </form>
        </ModalWrapper>
      )}

      {showHistoryModal && selectedCustomer && (
        <ModalWrapper onClose={() => setShowHistoryModal(false)} title={`التاريخ ديال ${selectedCustomer.name}`}>
          <div className="p-2 space-y-4 max-h-[60vh] overflow-y-auto">
            {!selectedCustomer.history || selectedCustomer.history.length === 0 ? (
              <div className="text-center p-8 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                <span className="text-4xl mb-3 block">📭</span>
                <p className="text-gray-500 font-bold">باقي ماكاين حتى عملية مسجلة لهاد الزبون</p>
              </div>
            ) : (
              selectedCustomer.history.map((h) => (
                <div key={h.id} className={`p-4 rounded-2xl border-2 flex items-center justify-between ${h.type === 'credit' ? 'bg-orange-50/50 border-orange-100' : 'bg-emerald-50/50 border-emerald-100'}`}>
                  <div>
                    <p className={`font-black text-lg ${h.type === 'credit' ? 'text-orange-600' : 'text-emerald-600'}`}>
                      {h.type === 'credit' ? 'سجلتي كريدي' : 'دار لك خلاص'}
                    </p>
                    <p className="text-xs font-bold text-gray-500 mt-1">{h.date} مع {h.time}</p>
                  </div>
                  <div className={`px-4 py-2 rounded-xl font-black ${h.type === 'credit' ? 'bg-orange-100 text-orange-700' : 'bg-emerald-100 text-emerald-700'}`}>
                    {h.type === 'credit' ? '+' : '-'}{h.amount} د.م
                  </div>
                </div>
              ))
            )}
          </div>
        </ModalWrapper>
      )}
    </div>
  );
}

function ModalWrapper({ children, onClose, title }) {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-end lg:items-center justify-center p-0 lg:p-4 animate-in fade-in duration-300">
      <div className="bg-white w-full lg:w-[460px] lg:rounded-[2.5rem] rounded-t-[2.5rem] shadow-2xl animate-in slide-in-from-bottom-10 h-auto">
        <div className="sticky top-0 bg-white border-b border-gray-50 p-6 flex items-center justify-between rounded-t-[2.5rem]">
          <h2 className="font-black text-xl text-gray-800">{title}</h2>
          <button
            onClick={onClose}
            className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-all active:rotate-90"
          >
            <HiXMark className="w-6 h-6" />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
