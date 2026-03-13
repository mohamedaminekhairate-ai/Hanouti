import { HiPlus, HiCurrencyDollar } from 'react-icons/hi2';

export default function CustomerCard({ customer, onAddCredit, onPayment }) {
  const hasDebt = customer.debt > 0;

  return (
    <div className="bg-white rounded-[2.5rem] shadow-sm border-2 border-gray-100 p-6 flex flex-col hover:border-primary-200 hover:shadow-xl hover:shadow-primary-600/5 transition-all duration-300 group">
      
      {/* Header Info */}
      <div className="flex items-center gap-4 mb-6">
        <div className="w-16 h-16 rounded-2xl bg-primary-50 text-primary-600 flex items-center justify-center text-3xl font-black shadow-inner group-hover:scale-105 transition-transform duration-300 shrink-0 border border-primary-100">
          {customer.name.charAt(0)}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-black text-gray-800 text-xl truncate mb-1 leading-none">{customer.name}</h3>
          <span className="text-[10px] font-black text-primary-500 bg-primary-50 px-3 py-1 rounded-lg uppercase tracking-wider">زبون وفـي</span>
        </div>
      </div>

      {/* Debt Amount - Matching the Price Badge style from ProductCard */}
      <div
        className={`rounded-[1.75rem] p-6 mb-6 text-center border-2 transition-colors duration-300 ${
          hasDebt 
            ? 'bg-rose-50/50 border-rose-100' 
            : 'bg-emerald-50/50 border-emerald-100'
        }`}
      >
        <p className={`text-[11px] font-black uppercase tracking-widest mb-2 ${hasDebt ? 'text-rose-400' : 'text-emerald-400'}`}>
          {hasDebt ? 'شحال كيتسالو' : 'الرصيد خالص'}
        </p>
        <p
          className={`text-4xl font-black ${
            hasDebt ? 'text-rose-600' : 'text-emerald-600'
          }`}
        >
          {customer.debt.toLocaleString()} <span className="text-lg opacity-60">د.م</span>
        </p>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <button
          onClick={() => onAddCredit?.(customer)}
          className="flex-1 h-12 bg-orange-50 text-orange-600 rounded-2xl font-black text-xs hover:bg-orange-500 hover:text-white transition-all border border-orange-100 flex items-center justify-center gap-1 group/btn"
        >
          <HiPlus className="w-4 h-4 group-hover/btn:rotate-90 transition-transform" />
          زيد كريدي
        </button>
        <button
          onClick={() => onPayment?.(customer)}
          disabled={!hasDebt}
          className={`flex-1 h-12 rounded-2xl font-black text-xs transition-all border flex items-center justify-center gap-1 ${
            hasDebt 
              ? 'bg-primary-50 text-primary-600 hover:bg-primary-600 hover:text-white border-primary-100'
              : 'bg-gray-50 text-gray-300 border-gray-100 cursor-not-allowed opacity-50'
          }`}
        >
          <HiCurrencyDollar className="w-4 h-4" />
          خلاص
        </button>
      </div>
      
      {/* History Button */}
      <button
        onClick={() => customer.onViewHistory?.(customer)}
        className="mt-3 w-full h-10 bg-gray-50 text-gray-500 rounded-xl font-bold text-xs hover:bg-gray-100 hover:text-gray-700 transition-all border border-gray-100 flex items-center justify-center gap-2"
      >
        <span>📖 شوف الكناش ديالو</span>
      </button>
    </div>
  );
}
