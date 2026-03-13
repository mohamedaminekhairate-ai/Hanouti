export default function PageHeader({ title, subtitle, action }) {
  return (
    <div className="bg-primary-600 text-white pt-10 pb-14 px-6 rounded-b-[2.5rem] -mx-4 -mt-6 mb-10 text-center shadow-lg relative overflow-hidden">
      {/* Premium subtle background effects */}
      <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-12 -left-12 w-40 h-40 bg-black/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-lg mx-auto">
        <h1 className="text-3xl font-black mb-1 drop-shadow-sm tracking-tight">{title}</h1>
        {subtitle && (
          <p className="text-primary-50 font-bold opacity-90 text-sm">{subtitle}</p>
        )}
        {action && <div className="mt-6 animate-in fade-in slide-in-from-bottom-2 duration-500">{action}</div>}
      </div>
    </div>
  );
}
