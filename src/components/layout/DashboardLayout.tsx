import { Outlet, Link, useLocation, Navigate } from 'react-router-dom';
import { 
  BarChart3, 
  List, 
  ShoppingCart, 
  Wallet, 
  LifeBuoy, 
  User, 
  LogOut, 
  Menu, 
  X,
  Send
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import Logo from '@/components/Logo';
import { getAuthUser, logout, useStoreState } from '@/lib/store';

const NAV_ITEMS = [
  { name: 'Dashboard', path: '/panel', icon: BarChart3 },
  { name: 'Services', path: '/panel/services', icon: List },
  { name: 'Orders', path: '/panel/orders', icon: ShoppingCart },
  { name: 'Add Funds', path: '/panel/add-funds', icon: Wallet },
  { name: 'Send Funds', path: '/panel/send-funds', icon: Send },
  { name: 'Support', path: '/panel/support', icon: LifeBuoy },
];

export default function DashboardLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const authUser = useStoreState(getAuthUser);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  if (!authUser) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-dark-bg text-white flex flex-col md:flex-row">
      {/* Mobile Navbar */}
      <div className="md:hidden flex items-center justify-between p-4 border-b border-dark-border bg-dark-card z-50">
        <Link to="/" className="flex items-center gap-2">
          <Logo className="w-8 h-8" />
          <span className="font-extrabold text-xl tracking-tight text-white leading-none">Boost<span className="text-[#ab60f6]">Panel</span></span>
        </Link>
        <button onClick={toggleMobileMenu} className="p-2 text-gray-400 hover:text-white focus:outline-none">
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar Desktop & Mobile Dropdown */}
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
            <div className="hidden md:flex items-center gap-2.5 p-6 border-b border-dark-border">
              <Logo className="w-8 h-8" />
              <span className="font-extrabold text-xl tracking-tight text-white leading-none">Boost<span className="text-[#ab60f6]">Panel</span></span>
            </div>

            <div className="flex-1 overflow-y-auto py-6 px-4 flex flex-col gap-2">
              <div className="mb-4 px-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">Navigation</div>
              {NAV_ITEMS.map((item) => {
                const isActive = location.pathname === item.path;
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
                        layoutId="active-indicator"
                        className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#5ebdff] to-[#ab60f6]"
                      />
                    )}
                    <Icon size={18} className={cn(isActive ? "text-[#5ebdff]" : "text-gray-400")} />
                    <span className="font-bold text-sm">{item.name}</span>
                  </Link>
                );
              })}
            </div>

            <div className="p-4 border-t border-dark-border">
              <div className="flex items-center gap-3 px-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-dark-bg border border-dark-border flex items-center justify-center">
                  <User size={18} className="text-gray-400" />
                </div>
                <div className="flex flex-col flex-1 overflow-hidden">
                  <span className="text-sm font-semibold truncate">{authUser.username}</span>
                  <span className="text-xs text-[#5ebdff] font-bold font-mono">${authUser.balance.toFixed(2)}</span>
                </div>
              </div>
              <button 
                onClick={logout}
                className="flex items-center justify-center w-full gap-2 py-2 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
              >
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 min-h-screen max-w-[100vw] overflow-x-hidden md:max-w-none relative">
        {/* Glow Effects */}
        <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-[#5ebdff]/10 blur-[120px] pointer-events-none z-0" />
        <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-[#ab60f6]/10 blur-[120px] pointer-events-none z-0" />
        
        <div className="p-4 md:p-8 relative z-10">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
