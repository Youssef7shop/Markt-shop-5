import { Outlet, Link, useLocation, Navigate } from 'react-router-dom';
import { 
  BarChart, 
  Users, 
  List, 
  ShoppingCart, 
  CreditCard,
  MessageSquare,
  LogOut, 
  Menu, 
  X,
  Settings
} from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import Logo from '@/components/Logo';
import { getAdminAuthUser, logout, useStoreState } from '@/lib/store';

const ADMIN_NAV_ITEMS = [
  { name: 'Dashboard', path: '/admin/dashboard', icon: BarChart },
  { name: 'Users', path: '/admin/users', icon: Users },
  { name: 'Services', path: '/admin/services', icon: List },
  { name: 'Orders', path: '/admin/orders', icon: ShoppingCart },
  { name: 'Payments', path: '/admin/payments', icon: CreditCard },
  { name: 'Tickets', path: '/admin/tickets', icon: MessageSquare },
];

export default function AdminLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const authAdmin = useStoreState(getAdminAuthUser);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  if (!authAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <div className="min-h-screen bg-dark-bg text-white flex flex-col md:flex-row">
      <div className="md:hidden flex items-center justify-between p-4 border-b border-dark-border bg-dark-card z-50">
        <div className="flex items-center gap-2">
          <Logo className="w-8 h-8" />
          <span className="font-bold text-xl tracking-tight text-white">Admin Panel</span>
        </div>
        <button onClick={toggleMobileMenu} className="p-2 text-gray-400 hover:text-white focus:outline-none">
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <AnimatePresence>
        {(isMobileMenuOpen || typeof window !== 'undefined' && window.innerWidth >= 768) && (
          <motion.aside
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
            className={cn(
               "fixed md:sticky top-0 left-0 h-screen w-64 bg-dark-card border-r border-dark-border flex flex-col z-40 transition-transform duration-300 md:translate-x-0",
              isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
            )}
          >
            <div className="hidden md:flex items-center gap-2 p-6 border-b border-dark-border">
              <Logo className="w-8 h-8" />
              <span className="font-bold text-xl tracking-tight text-white">Admin Panel</span>
            </div>

            <div className="flex-1 overflow-y-auto py-6 px-4 flex flex-col gap-2">
              <div className="mb-4 px-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">Management</div>
              {ADMIN_NAV_ITEMS.map((item) => {
                const isActive = location.pathname.startsWith(item.path);
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={closeMobileMenu}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors group relative overflow-hidden",
                      isActive 
                        ? "text-white bg-white/5" 
                        : "text-gray-400 hover:text-white hover:bg-white/5"
                    )}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="admin-active-indicator"
                        className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#5ebdff] to-[#ab60f6]"
                      />
                    )}
                    <Icon size={18} className={cn(isActive && "text-[#5ebdff]")} />
                    <span className="font-medium text-sm">{item.name}</span>
                  </Link>
                );
              })}
            </div>

            <div className="p-4 border-t border-dark-border space-y-2">
              <button 
                className="flex items-center w-full gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                onClick={() => alert('Settings Modal')}
              >
                <Settings size={18} />
                <span className="font-medium text-sm">System Settings</span>
              </button>
              <button 
                onClick={logout}
                className="flex items-center justify-center w-full gap-2 py-2 rounded-lg text-sm text-[#5ebdff] hover:text-[#5ebdff]/80 hover:bg-[#5ebdff]/10 transition-colors cursor-pointer"
              >
                <LogOut size={16} />
                <span>Logout Admin</span>
              </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      <main className="flex-1 min-h-screen max-w-[100vw] overflow-x-hidden md:max-w-none relative">
        <div className="p-4 md:p-8 relative z-10 w-full overflow-hidden">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
