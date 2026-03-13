import { HiPencilSquare, HiTrash } from 'react-icons/hi2';

export default function ProductCard({ product, onEdit, onDelete }) {
  const isLowStock = product.stock <= (product.min_stock || 0);
  const supplier = product.supplier;

  return (
    <div className="bg-white rounded-[2.5rem] border-2 border-gray-100 p-6 flex flex-col items-center text-center hover:border-primary-200 transition-all duration-300 group shadow-sm hover:shadow-xl hover:shadow-primary-500/5">
      {/* Product Image - Top Vertical */}
      <div className="w-40 h-40 mb-6 flex items-center justify-center text-6xl group-hover:scale-110 transition-transform duration-500 relative">
        {product.image && product.image.startsWith('data:') ? (
           <img src={product.image} alt={product.name} className="w-full h-full object-contain" />
        ) : product.image && product.image.startsWith('http') ? (
           <img src={product.image} alt={product.name} className="w-full h-full object-contain" />
        ) : (
           <span className="drop-shadow-sm">{product.image || '📦'}</span>
        )}
      </div>

      {/* Name and Supplier */}
      <div className="mb-6 w-full">
        <h3 className="font-black text-gray-800 text-xl mb-2 truncate px-2">
          {product.name}
        </h3>
        {supplier && (
          <span className="text-xs font-bold text-gray-400 bg-gray-50 px-3 py-1.5 rounded-lg">
            {supplier.name}
          </span>
        )}
      </div>

      {/* Price Badges - Green & Blue & Purple (Ra9m 3 & 4 + Profit) */}
      <div className="flex gap-2 w-full mb-6">
        <div className="flex-1 bg-emerald-50 border-2 border-emerald-100 rounded-2xl py-2 shadow-sm group-hover:bg-emerald-100/50 transition-colors">
          <p className="text-[10px] font-extrabold text-emerald-500 mb-0.5">بيع</p>
          <p className="font-black text-emerald-700 text-sm sm:text-base">{product.sell_price} د.م</p>
        </div>
        <div className="flex-1 bg-blue-50 border-2 border-blue-100 rounded-2xl py-2 shadow-sm group-hover:bg-blue-100/50 transition-colors">
          <p className="text-[10px] font-extrabold text-blue-500 mb-0.5">شراء</p>
          <p className="font-black text-blue-700 text-sm sm:text-base">{product.buy_price} د.م</p>
        </div>
        <div className="flex-1 bg-purple-50 border-2 border-purple-100 rounded-2xl py-2 shadow-sm group-hover:bg-purple-100/50 transition-colors">
          <p className="text-[10px] font-extrabold text-purple-500 mb-0.5">ربح</p>
          <p className="font-black text-purple-700 text-sm sm:text-base">{(product.sell_price - product.buy_price).toFixed(2)} د.م</p>
        </div>
      </div>

      {/* Stock - Simple Blue Badge */}
      <div className="w-full bg-primary-50 border border-primary-100 rounded-2xl py-3 mb-6 flex items-center justify-center gap-2">
        <span className="text-primary-600 font-black">الكمية: {product.stock}</span>
      </div>

      {/* Action Buttons - Smaller and cleaner */}
      <div className="flex gap-3 w-full mt-auto">
        <button
          onClick={() => onEdit?.(product)}
          className="flex-1 h-12 bg-primary-50 text-primary-600 rounded-2xl flex items-center justify-center hover:bg-primary-600 hover:text-white transition-all group/btn border border-primary-100"
        >
          <HiPencilSquare className="w-5 h-5" />
          <span className="mr-1.5 font-bold text-sm">تعديل</span>
        </button>
        <button
          onClick={() => onDelete?.(product)}
          className="w-12 h-12 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all border border-rose-100"
        >
          <HiTrash className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
