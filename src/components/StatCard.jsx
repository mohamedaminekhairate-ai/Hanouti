export default function StatCard({ icon, label, value, unit, color = 'primary' }) {
  const colorMap = {
    primary: 'bg-sky-50 text-sky-500',
    success: 'bg-emerald-50 text-emerald-500',
    warning: 'bg-orange-50 text-orange-400',
    danger:  'bg-rose-50 text-rose-500',
    teal:    'bg-teal-50 text-teal-600',
  };

  return (
    <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300">
      {/* Top row: label + icon */}
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm font-bold text-gray-400 leading-snug flex-1 ml-2">{label}</p>
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl shrink-0 ${colorMap[color] || colorMap.primary}`}>
          {icon}
        </div>
      </div>

      {/* Value + unit */}
      <div className="flex items-baseline gap-2">
        <span className="text-3xl font-black text-gray-800 tracking-tight leading-none">{value}</span>
        {unit && <span className="text-sm font-bold text-gray-400">{unit}</span>}
      </div>
    </div>
  );
}
