import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { DollarSign, ShoppingCart, TrendingUp, Users, CheckCircle, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useStoreState, getCurrentUser, getServices, getOrders, addOrder } from '@/lib/store';

export default function Dashboard() {
  const currentUser = useStoreState(getCurrentUser);
  const allServices = useStoreState(getServices);
  const allOrders = useStoreState(getOrders);

  const userOrders = allOrders.filter(o => o.username.toLowerCase() === currentUser.username.toLowerCase());
  const userSpent = currentUser.spent;
  const userBalance = currentUser.balance;

  // Derive categories dynamically from the list of services in store
  const categories = Array.from(new Set(allServices.map(s => s.category))).map(cat => ({
    id: cat.toLowerCase().replace(/\s+/g, '-'),
    name: cat
  }));

  const [selectedCategory, setSelectedCategory] = useState('instagram-services');
  const [selectedService, setSelectedService] = useState('');
  const [quantity, setQuantity] = useState('');
  const [link, setLink] = useState('');
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Group services
  const currentServices = allServices.filter(
    s => s.category.toLowerCase().replace(/\s+/g, '-') === selectedCategory
  );

  // Set the first available service ID when the category changes
  useEffect(() => {
    if (currentServices.length > 0) {
      // If currently selected service is not in the list, default to first item
      if (!currentServices.some(s => String(s.id) === String(selectedService))) {
        setSelectedService(String(currentServices[0].id));
      }
    } else {
      setSelectedService('');
    }
  }, [selectedCategory, allServices]);

  const currentServiceObj = currentServices.find(s => String(s.id) === String(selectedService)) || currentServices[0];
  const rate = currentServiceObj?.price || 0;
  
  const charge = quantity ? ((parseInt(quantity) / 1000) * rate).toFixed(2) : '0.00';

  const handleOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    if (!quantity || !link || !currentServiceObj) return;

    const qtyVal = parseInt(quantity);
    if (isNaN(qtyVal) || qtyVal < currentServiceObj.min || qtyVal > currentServiceObj.max) {
      setErrorMessage(`Quantity must be between ${currentServiceObj.min} and ${currentServiceObj.max}`);
      return;
    }

    const totalCharge = Number(((qtyVal / 1000) * rate).toFixed(2));
    if (userBalance < totalCharge) {
      setErrorMessage(`Insufficient balance. This order costs $${totalCharge.toFixed(2)} split from your current $${userBalance.toFixed(2)} balance.`);
      return;
    }

    const success = addOrder(
      currentUser.username,
      currentServiceObj.name,
      link,
      qtyVal,
      totalCharge
    );

    if (success) {
      setOrderPlaced(true);
      setQuantity('');
      setLink('');
      setTimeout(() => {
        setOrderPlaced(false);
      }, 3000);
    } else {
      setErrorMessage('Failed to place order. Please inspect your profile parameters.');
    }
  };

  const stats = [
    { title: 'Total Balance', value: `$${userBalance.toFixed(2)}`, icon: DollarSign, color: 'text-[#5ebdff]' },
    { title: 'Total Spent', value: `$${userSpent.toFixed(2)}`, icon: TrendingUp, color: 'text-[#ab60f6]' },
    { title: 'Total Orders', value: userOrders.length.toLocaleString(), icon: ShoppingCart, color: 'text-white' },
    { title: 'Account Status', value: currentUser.role === 'Admin' ? 'Administrator' : currentUser.role === 'Reseller' ? 'Reseller VIP' : 'VIP Member', icon: Users, color: 'text-yellow-400' },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-4">
      {/* Welcome Heading */}
      <div className="mb-8 text-left">
        <h1 className="text-3xl font-extrabold tracking-tight mb-2 text-white">Welcome back, {currentUser.username}!</h1>
        <p className="text-gray-400 font-semibold text-sm">Here is a quick summary of your account activity today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
            className="p-6 rounded-[2rem] bg-[#090d16] border border-white/5 flex flex-col justify-between hover:border-white/10 transition-colors relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%__10%,rgba(94,189,255,0.015),transparent_50%)] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            <div className="flex justify-between items-start mb-4">
              <span className="text-sm font-bold text-gray-500">{stat.title}</span>
              <div className={`p-2.5 rounded-xl bg-white/5 ${stat.color} border border-white/5`}>
                <stat.icon size={20} />
              </div>
            </div>
            <div className="text-3xl font-black font-mono tracking-tight text-white">{stat.value}</div>
          </motion.div>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* New Order Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="lg:col-span-2 p-6 md:p-8 rounded-[2rem] bg-[#090d16] border border-white/5 relative overflow-hidden text-left"
        >
          {/* Brand glow decoration */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#5ebdff] to-[#ab60f6]"></div>
          
          <div className="mb-8">
            <h2 className="text-2xl font-black text-white mb-1">Quick New Order</h2>
            <p className="text-sm text-gray-500 font-semibold">Place a new order instantly and automatically.</p>
          </div>
          
          <form className="space-y-5" onSubmit={handleOrder}>
            {errorMessage && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-2xl flex items-center gap-2 text-sm font-semibold">
                <AlertCircle size={18} className="shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-extrabold text-gray-400 uppercase tracking-wider mb-2">Category</label>
              <select 
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full bg-[#050914] border border-white/5 rounded-2xl px-4 py-3.5 text-white focus:outline-none focus:border-blue-500/30 transition-colors appearance-none cursor-pointer text-left font-bold"
              >
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-xs font-extrabold text-gray-400 uppercase tracking-wider mb-2">Service</label>
              <select 
                value={selectedService}
                onChange={(e) => setSelectedService(e.target.value)}
                className="w-full bg-[#050914] border border-white/5 rounded-2xl px-4 py-3.5 text-white focus:outline-none focus:border-blue-500/30 transition-colors appearance-none cursor-pointer text-left text-sm"
              >
                {currentServices.map(s => (
                  <option key={s.id} value={String(s.id)}>{s.name}</option>
                ))}
              </select>
              {currentServiceObj && (
                <div className="mt-2 text-xs text-gray-500 font-mono flex items-center justify-between px-1">
                  <span>Min Limit: {currentServiceObj.min}</span>
                  <span>Max Limit: {currentServiceObj.max}</span>
                  <span className="text-[#5ebdff] font-bold">Price per 1k: ${currentServiceObj.price.toFixed(2)}</span>
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-extrabold text-gray-400 uppercase tracking-wider mb-2">Target URL / Link</label>
              <input 
                type="text" 
                value={link}
                required
                onChange={(e) => setLink(e.target.value)}
                placeholder="https://..." 
                className="w-full bg-[#050914] border border-white/5 rounded-2xl px-4 py-3.5 text-white focus:outline-none focus:border-blue-500/30 transition-colors tracking-wide text-left" 
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-extrabold text-gray-400 uppercase tracking-wider mb-2">Quantity</label>
                <input 
                  type="number" 
                  required
                  min={currentServiceObj?.min || 10}
                  max={currentServiceObj?.max || 1000000}
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder="1000" 
                  className="w-full bg-[#050914] border border-white/5 rounded-2xl px-4 py-3.5 text-white focus:outline-none focus:border-blue-500/30 transition-colors font-mono font-semibold" 
                />
              </div>
              <div>
                <label className="block text-xs font-extrabold text-gray-400 uppercase tracking-wider mb-2">Total Charge</label>
                <div className="w-full bg-[#050914]/80 border border-white/5 rounded-2xl px-4 py-3.5 text-[#5ebdff] font-mono text-xl font-bold text-center">
                  ${charge}
                </div>
              </div>
            </div>

            <div className="pt-4">
              <button 
                type="submit" 
                disabled={orderPlaced || !currentServiceObj}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#5ebdff] to-[#ab60f6] text-black font-extrabold text-md hover:scale-[1.01] transform transition-all duration-200 flex items-center justify-center gap-2 shadow-xl shadow-blue-500/10 disabled:opacity-50 cursor-pointer"
              >
                {orderPlaced ? (
                  <div className="flex items-center gap-2">
                    <CheckCircle size={20} />
                    <span>Order Placed Successfully!</span>
                  </div>
                ) : (
                  <span>Place Order Now</span>
                )}
              </button>
            </div>
          </form>
        </motion.div>

        {/* Recent Orders List */}
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.4, delay: 0.4 }}
           className="p-6 rounded-[2rem] bg-[#090d16] border border-white/5 flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-black text-white">Recent Orders</h2>
              <Link to="/panel/orders" className="text-sm text-[#5ebdff] hover:underline font-bold">View All</Link>
            </div>
            <div className="flex flex-col gap-3 flex-1 overflow-y-auto max-h-[350px] pr-1">
               {userOrders.slice(0, 5).map((order) => (
                 <div key={order.id} className="group flex items-center justify-between p-3.5 rounded-2xl bg-[#050914]/60 border border-white/5 hover:border-white/10 transition-colors">
                   <div className="text-left">
                     <div className="font-bold text-sm text-white mb-1 truncate max-w-[140px]" title={order.service}>{order.service}</div>
                     <div className="text-xs text-gray-500 font-mono">ID: #{order.id}</div>
                   </div>
                   <div className="text-right flex flex-col items-end">
                     <div className="font-mono text-sm text-[#5ebdff] mb-1 font-bold">${order.charge.toFixed(2)}</div>
                     <div className={`text-[11px] font-extrabold tracking-wide uppercase ${
                       order.status === 'Completed' ? 'text-[#5ebdff]' : 
                       order.status === 'Processing' ? 'text-blue-400' : 
                       order.status === 'Pending' ? 'text-yellow-400' : 'text-red-400'
                     }`}>
                       {order.status}
                     </div>
                   </div>
                 </div>
               ))}
               {userOrders.length === 0 && (
                 <div className="text-center py-8 text-gray-500 font-semibold text-sm">
                   No orders placed yet.
                 </div>
               )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
