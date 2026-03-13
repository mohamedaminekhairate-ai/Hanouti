import { useState, useEffect } from 'react';
import PageHeader from '../components/layout/PageHeader';
import StatCard from '../components/StatCard';
import { apiService } from '../services/api';
import {
  HiOutlineBanknotes,
  HiOutlineCube,
  HiOutlineShoppingBag,
  HiOutlineArrowTrendingUp,
  HiOutlineStar,
  HiOutlineExclamationTriangle,
} from 'react-icons/hi2';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function Dashboard() {
  const [productList, setProductList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const prods = await apiService.getProducts();
        setProductList(prods);
      } catch (error) {
        console.error("Failed to fetch products", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const lowStockProducts = productList.filter((p) => p.stock <= (p.min_stock || 0));

  // Placeholder for top selling until transactions api is ready
  const topSelling = [];

  const chartData = [
    { name: 'الإثنين', 'الأرباح': 400, 'المبيعات': 1200 },
    { name: 'الثلاثاء', 'الأرباح': 300, 'المبيعات': 900 },
    { name: 'الأربعاء', 'الأرباح': 550, 'المبيعات': 1600 },
    { name: 'الخميس', 'الأرباح': 450, 'المبيعات': 1300 },
    { name: 'الجمعة', 'الأرباح': 700, 'المبيعات': 2100 },
    { name: 'السبت', 'الأرباح': 850, 'المبيعات': 2500 },
    { name: 'الأحد', 'الأرباح': 600, 'المبيعات': 1800 },
  ];

  return (
    <div className="pb-20 lg:pb-6">
      <PageHeader
        title="Dyel L7anot"
        subtitle="مرحباً بيك المعلم فالحانوت اليوم"
      />

      {/* STAT CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        <StatCard icon={<HiOutlineBanknotes />} label="ربح السيمانة" value="0" unit="د.م" color="teal" />
        <StatCard icon={<HiOutlineArrowTrendingUp />} label="ربح اليوم" value="0" unit="د.م" color="success" />
        <StatCard 
          icon={<HiOutlineCube />} 
          label="قيمة السلع" 
          value={productList.reduce((acc, p) => acc + (p.buy_price * p.stock), 0).toLocaleString()} 
          unit="د.م" 
          color="primary" 
        />
        <StatCard icon={<HiOutlineShoppingBag />} label="ربح الشهر" value="0" unit="د.m" color="warning" />
      </div>

      {/* CHART - BEFORE PRODUCTS */}
      <div className="w-fit mx-auto flex justify-center items-center mt-8 mb-8 py-5 px-8 border-2 border-primary-100 rounded-[2rem] bg-primary-50 shadow-sm">
        <h3 className="text-xl font-bold text-primary-800 flex items-center gap-3">
          <span className="w-2 h-7 bg-primary-500 rounded-full inline-block"></span>
          أرباح ومبيعات هاد السيمانة
        </h3>
      </div>
      <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-6 mb-10">
        <div className="w-full h-72">
          <ResponsiveContainer width="94%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                  <stop offset="70%" stopColor="#22c55e" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.1} />
                  <stop offset="70%" stopColor="#0ea5e9" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12, fontFamily: 'Tajawal' }} dy={10} />
              <YAxis orientation="right" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11 }} width={30} />
              <Tooltip
                contentStyle={{ borderRadius: '24px', border: '1px solid #e2e8f0', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)', fontFamily: 'Tajawal', direction: 'rtl', padding: '12px 20px' }}
                itemStyle={{ fontWeight: 'bold' }}
              />
              <Area type="monotone" dataKey="المبيعات" stroke="#0ea5e9" strokeWidth={3} fillOpacity={1} fill="url(#colorSales)" />
              <Area type="monotone" dataKey="الأرباح" stroke="#22c55e" strokeWidth={3} fillOpacity={1} fill="url(#colorProfit)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* PRODUCTS GRID */}
      <div className="w-fit mx-auto flex justify-center items-center mt-8 mb-8 py-5 px-8 border-2 border-primary-100 rounded-[2rem] bg-primary-50 shadow-sm">
        <h3 className="text-2xl font-black text-primary-800 flex items-center gap-2">
          السلع فالحانوت
          <HiOutlineCube className="w-6 h-6 text-primary-500" />
        </h3>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-5 mb-10">
        {productList.slice(0, 6).map((product) => {
          const isLow = product.stock <= (product.min_stock || 0);
          const isOut = product.stock === 0;
          return (
            <div key={product.id} className="bg-white rounded-[2rem] border border-gray-100 p-6 flex flex-col items-center text-center shadow-sm hover:shadow-md transition-shadow">
              <div className="w-20 h-20 mb-3 flex items-center justify-center text-4xl">
                {product.image && product.image.startsWith('http') ? (
                  <img src={product.image} className="w-full h-full object-contain" alt="" />
                ) : (
                  product.image || '📦'
                )}
              </div>
              <h4 className="font-bold text-gray-700 mb-4 truncate w-full px-2">{product.name}</h4>
              <div className={`w-12 h-12 rounded-full flex items-center justify-center font-black text-lg ${
                isOut ? 'bg-danger-50 text-danger-600' :
                isLow ? 'bg-orange-50 text-orange-600' :
                'bg-primary-50 text-primary-600'
              }`}>
                {product.stock}
              </div>
            </div>
          );
        })}
      </div>

      {/* LOW STOCK ALERT */}
      {lowStockProducts.length > 0 && (
        <div className="bg-orange-50 border-2 border-orange-100 rounded-[2rem] p-7 mb-10 flex items-center justify-between group cursor-pointer hover:bg-orange-100/50 transition-colors">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-orange-200 text-orange-500">
              <HiOutlineExclamationTriangle className="w-6 h-6" />
            </div>
            <div className="text-right">
              <p className="font-black text-orange-800 text-lg">{lowStockProducts.length} سلع قربو يسالو!</p>
              <p className="text-sm font-bold text-orange-600 opacity-80">خاصك تعاود تشري</p>
            </div>
          </div>
          <div className="w-10 h-10 rounded-full bg-white/50 flex items-center justify-center text-orange-400 group-hover:translate-x-[-4px] transition-transform">
            <HiOutlineArrowTrendingUp className="w-5 h-5 rotate-180" />
          </div>
        </div>
      )}

      {/* TOP SELLING */}
      <div className="w-fit mx-auto flex justify-center items-center mt-8 mb-8 py-5 px-8 border-2 border-orange-100 rounded-[2rem] bg-orange-50 shadow-sm">
        <h3 className="text-2xl font-black text-orange-800 flex items-center gap-3">
          أكثر السلع مبيعاً
          <HiOutlineStar className="w-6 h-6 text-orange-400" />
        </h3>
      </div>
      <div className="bg-white rounded-[2rem] shadow-sm border-2 border-gray-100 p-6 mb-10">
        <div className="space-y-0">
          {topSelling.map((product, index) => (
            <div
              key={product.id}
              className={`flex items-center justify-between py-5 ${index !== topSelling.length - 1 ? 'border-b border-gray-100' : ''}`}
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-primary-50 text-primary-600 flex items-center justify-center font-black text-base border border-primary-100">
                  {index + 1}
                </div>
                <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-2xl overflow-hidden border border-gray-100">
                  {product.image && product.image.startsWith('data:') ? (
                    <img src={product.image} className="w-full h-full object-cover" alt="" />
                  ) : (
                    <span>{product.image || '📦'}</span>
                  )}
                </div>
                <span className="text-lg font-bold text-gray-700">{product.name}</span>
              </div>
              <div className="font-black text-xl text-gray-400">
                {product.soldQty} <span className="text-base font-bold">وحدة</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
