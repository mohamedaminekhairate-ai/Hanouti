import { NavLink } from 'react-router-dom';
import { 
  HiOutlineHome, 
  HiOutlineCube, 
  HiOutlineUserGroup, 
  HiOutlineClipboardDocumentList, 
  HiOutlineTruck, 
  HiOutlineExclamationTriangle 
} from 'react-icons/hi2';

const navItems = [
  { path: '/', label: 'الرئيسية', icon: HiOutlineHome },
  { path: '/products', label: 'السلع', icon: HiOutlineCube },
  { path: '/inventory', label: 'الجرد', icon: HiOutlineClipboardDocumentList },
  { path: '/delivery', label: 'الكاميو', icon: HiOutlineTruck },
  { path: '/customers', label: 'الكريدي', icon: HiOutlineUserGroup },
  { path: '/loss', label: 'الخسائر', icon: HiOutlineExclamationTriangle },
];

export default function BottomNavigation() {
  return (
    <nav className="fixed bottom-0 right-0 left-0 bg-white/90 backdrop-blur-md border-t border-gray-100 lg:hidden z-50">
      <div className="flex justify-around items-center h-20 px-4">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center gap-1 p-2 transition-all duration-300 ${
                isActive
                  ? 'text-primary-600'
                  : 'text-gray-400 hover:text-gray-500'
              }`
            }
          >
            <div className={`p-2.5 rounded-2xl transition-all duration-300 ${
              window.location.pathname === item.path 
                ? 'bg-primary-50 border-2 border-primary-100 shadow-sm' 
                : 'border-2 border-transparent'
            }`}>
              <item.icon className="w-6 h-6 stroke-2" />
            </div>
            <span className="text-[10px] font-black">{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}