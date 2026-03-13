import { NavLink } from 'react-router-dom';
import {
  HiHome,
  HiShoppingBag,
  HiTruck,
  HiClipboardDocumentList,
  HiUsers,
  HiExclamationTriangle,
} from 'react-icons/hi2';

const navItems = [
  { path: '/', label: 'الداشبورد', icon: HiHome },
  { path: '/products', label: 'السلع', icon: HiShoppingBag },
  { path: '/delivery', label: 'الكاميو', icon: HiTruck },
  { path: '/inventory', label: 'الجرد', icon: HiClipboardDocumentList },
  { path: '/customers', label: 'الكريدي', icon: HiUsers },
  { path: '/loss', label: 'الخسائر', icon: HiExclamationTriangle },
];

export default function SidebarNavigation() {
  return (
    <aside className="hidden lg:flex flex-col w-64 bg-gradient-to-b from-surface-dark to-slate-800 text-white h-screen fixed right-0 top-0 shadow-xl z-50">
      {/* Logo / Brand */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-primary-500 flex items-center justify-center text-xl shadow-lg">
            🏪
          </div>
          <div>
            <h1 className="text-lg font-bold">الحانوت</h1>
            <p className="text-xs text-gray-400">نظام التسيير</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 group ${
                isActive
                  ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/30'
                  : 'text-gray-300 hover:bg-white/10 hover:text-white'
              }`
            }
          >
            <item.icon className="w-5 h-5 flex-shrink-0" />
            <span className="font-medium text-sm">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-white/10">
        <div className="rounded-xl bg-white/5 p-3 text-center">
          <p className="text-xs text-gray-400">الإصدار 1.0</p>
        </div>
      </div>
    </aside>
  );
}
