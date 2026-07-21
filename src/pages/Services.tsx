import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, X, Check, HelpCircle, AlertCircle, ShoppingCart } from 'lucide-react';
import { useStoreState, getServices, getCurrentUser, addOrder } from '@/lib/store';

export default function Services() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [orderModalOpen, setOrderModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<any>(null);
  
  // Quick order state
  const [link, setLink] = useState('');
  const [quantity, setQuantity] = useState('');
  const [orderingState, setOrderingState] = useState<'idle' | 'loading' | 'success'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const currentUser = useStoreState(getCurrentUser);
  const dbServices = useStoreState(getServices);

  // Map database services to matches format expected by UI rendering
  const servicesData = dbServices.map(s => {
    let category = 'Instagram';
    const catLower = s.category.toLowerCase();
    if (catLower.includes('tiktok')) category = 'TikTok';
    else if (catLower.includes('youtube')) category = 'YouTube';
    else if (catLower.includes('discord')) category = 'Discord';

    return {
      id: s.id,
      category,
      sub: s.category + ' • ' + (s.name.includes('Followers') ? 'Followers' : s.name.includes('Likes') ? 'Likes' : 'Views'),
      name: s.name,
      desc: s.type + ' automated delivery with premium status tracking and fast resolution.',
      price: s.price,
      min: s.min,
      max: s.max
    };
  });

  const categories = [
    { id: 'All', name: 'All Platforms' },
    { id: 'Discord', name: 'Discord' },
    { id: 'Instagram', name: 'Instagram' },
    { id: 'TikTok', name: 'TikTok' },
    { id: 'YouTube', name: 'YouTube' }
  ];

  const filteredServices = servicesData.filter(service => {
    const matchesCategory = activeCategory === 'All' || service.category.toLowerCase() === activeCategory.toLowerCase();
    const matchesSearch = service.name.toLowerCase().includes(search.toLowerCase()) || 
                          service.sub.toLowerCase().includes(search.toLowerCase()) || 
                          service.desc.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getPlatformIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'discord':
        return (
          <div className="w-11 h-11 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 border border-indigo-500/20 shadow-[0_0_15px_rgba(99,102,241,0.1)]">
            <svg className="w-6 h-6 fill-current" viewBox="0 0 127.14 96.36">
              <path d="M107.7,8.07A105.15,105.15,0,0,0,77.26,0a77.19,77.19,0,0,0-3.3,6.83A96.67,96.67,0,0,0,53.22,6.83,77.19,77.19,0,0,0,49.88,0,105.15,105.15,0,0,0,19.44,8.07C3.66,31.58-1.86,54.65,1,77.53A105.73,105.73,0,0,0,32,96.36a77.7,77.7,0,0,0,6.63-10.85,68.43,68.43,0,0,1-10.5-5c.88-.65,1.72-1.34,2.51-2a75.58,75.58,0,0,0,65.84,0c.79.71,1.63,1.4,2.51,2a68.43,68.43,0,0,1-10.5,5,77.7,77.7,0,0,0,6.63,10.85,105.73,105.73,0,0,0,31-18.83C129.24,48,122.52,25.22,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53S36.18,40.36,42.45,40.36,53.83,46,53.83,53,48.72,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.24,60,73.24,53S78.41,40.36,84.69,40.36,96.07,46,96.07,53,91,65.69,84.69,65.69Z"/>
            </svg>
          </div>
        );
      case 'instagram':
        return (
          <div className="w-11 h-11 rounded-xl bg-pink-500/10 flex items-center justify-center text-pink-400 border border-pink-500/20 shadow-[0_0_15px_rgba(236,72,153,0.1)]">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.25" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
            </svg>
          </div>
        );
      case 'tiktok':
        return (
          <div className="w-11 h-11 rounded-xl bg-[#00f3ff]/10 flex items-center justify-center text-[#00f3ff] border border-[#00f3ff]/20 shadow-[0_0_15px_rgba(0,243,255,0.1)]">
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M12.525.02c1.31 0 2.594.316 3.75.923.045.247.16.475.334.654.492.51 1.127.844 1.83.963V5.55c-1.11-.053-2.176-.46-3.058-1.168V14.5c0 4.142-3.358 7.5-7.5 7.5s-7.5-3.358-7.5-7.5 3.358-7.5 7.5-7.5c.448 0 .886.04 1.313.115v3.136c-.417-.152-.862-.234-1.313-.234-2.43 0-4.4 1.97-4.4 4.4s1.97 4.4 4.4 4.4 4.4-1.97 4.4-4.4V0h3.654z" />
            </svg>
          </div>
        );
      case 'youtube':
        return (
          <div className="w-11 h-11 rounded-xl bg-red-500/10 flex items-center justify-center text-red-400 border border-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.1)]">
            <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
              <path d="M23.498 6.163a3.003 3.003 0 00-2.11-2.107C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.388.511a3.003 3.003 0 00-2.11 2.107C0 8.046 0 12 0 12s0 3.954.502 5.837a3.003 3.003 0 002.11 2.107c1.883.511 9.388.511 9.388.511s7.505 0 9.388-.511a3.003 3.003 0 002.11-2.107c.502-1.883.502-5.837.502-5.837s0-3.954-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
            </svg>
          </div>
        );
      default:
        return (
          <div className="w-11 h-11 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 border border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.1)]">
            <HelpCircle size={20} />
          </div>
        );
    }
  };

  const handleOpenOrder = (service: any) => {
    setSelectedService(service);
    setLink('');
    setQuantity('');
    setErrorMessage('');
    setOrderingState('idle');
    setOrderModalOpen(true);
  };

  const submitQuickOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    if (!link || !quantity || !selectedService) return;

    const qtyVal = parseInt(quantity);
    if (isNaN(qtyVal) || qtyVal < selectedService.min || qtyVal > selectedService.max) {
      setErrorMessage(`Quantity must be between ${selectedService.min} and ${selectedService.max}`);
      return;
    }

    const priceDecimal = selectedService.price;
    const totalCharge = Number(((qtyVal / 1000) * priceDecimal).toFixed(2));
    
    if (currentUser.balance < totalCharge) {
      setErrorMessage(`Insufficient balance. This costs $${totalCharge.toFixed(2)}, currently: $${currentUser.balance.toFixed(2)}`);
      return;
    }

    setOrderingState('loading');
    setTimeout(() => {
      const success = addOrder(
        currentUser.username,
        selectedService.name,
        link,
        qtyVal,
        totalCharge
      );

      if (success) {
        setOrderingState('success');
        setTimeout(() => {
          setOrderModalOpen(false);
          setOrderingState('idle');
          setLink('');
          setQuantity('');
        }, 1500);
      } else {
        setOrderingState('idle');
        setErrorMessage('Failed to place order. Please inspect profile parameters.');
      }
    }, 1200);
  };

  const computedCharge = (selectedService && quantity) 
    ? ((parseInt(quantity) / 1000) * selectedService.price).toFixed(2) 
    : '0.00';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      {/* Title Header */}
      <div className="mb-10 text-left">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-2 text-white">Available Services</h1>
        <p className="text-gray-400 text-sm md:text-base font-semibold">Browse our directory of premium social media services and place orders instantly.</p>
      </div>

      {/* Filter Row */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 mb-8">
        {/* Search Bar matching precise style */}
        <div className="relative flex-1 max-w-lg">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
          <input 
            type="text" 
            placeholder="Search services..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#050914] border border-white/5 rounded-2xl pl-12 pr-4 py-3.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/40 transition-colors shadow-inner text-left" 
          />
        </div>

        {/* Tab Filters */}
        <div className="flex flex-wrap gap-2 items-center justify-start">
          {categories.map((cat) => {
            const isActive = activeCategory.toLowerCase() === cat.id.toLowerCase();
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-5 py-2.5 rounded-2xl text-xs md:text-sm font-extrabold tracking-wide transition-all ${
                  isActive 
                    ? 'bg-gradient-to-r from-[#5ebdff] to-[#ab60f6] text-black shadow-[0_0_15px_rgba(94,189,255,0.2)]' 
                    : 'bg-[#050914] text-gray-400 border border-white/5 hover:text-white hover:border-white/10'
                }`}
              >
                {cat.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid of Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredServices.map((service) => (
          <motion.div 
            key={service.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="p-6 rounded-[2rem] bg-[#090d16] border border-white/5 relative overflow-hidden flex flex-col justify-between hover:border-white/10 transition-all duration-300 group text-left"
          >
            {/* Subtle glow hover card effect */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%__10%,rgba(94,189,255,0.03),transparent_50%)] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

            {/* Card Content Top */}
            <div>
              <div className="flex items-start gap-4 mb-4">
                {getPlatformIcon(service.category)}
                <div className="flex-1 min-w-0">
                  <div className="text-[11px] font-extrabold text-[#8da6cc]/60 uppercase tracking-widest leading-none mb-1 text-left">
                    {service.sub}
                  </div>
                  <h3 className="text-lg font-bold text-white tracking-snug truncate group-hover:text-[#5ebdff] transition-colors text-left">
                    {service.name}
                  </h3>
                </div>
              </div>

              {/* Service Description */}
              <p className="text-gray-400 text-sm font-medium mb-6 leading-relaxed text-left">
                {service.desc}
              </p>
            </div>

            {/* Card Content Bottom & Button */}
            <div className="mt-auto">
              {/* Pricing Line */}
              <div className="flex items-baseline justify-between mb-5 border-t border-white/5 pt-4">
                <div className="flex items-baseline">
                  <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#2cc4ff] to-[#bd39ff] tracking-tight font-mono">
                    ${service.price.toFixed(2)}
                  </span>
                  <span className="text-gray-500 font-extrabold text-xs ml-1">/ 1000</span>
                </div>
                <div className="text-xs font-semibold text-[#8da6cc]/50 font-mono">
                  Min order: {service.min.toLocaleString()}
                </div>
              </div>

              {/* Order Now Trigger */}
              <div className="relative group/btn">
                <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-[#5ebdff] to-[#ab60f6] opacity-0 group-hover/btn:opacity-50 blur transition duration-300" />
                <button
                  onClick={() => handleOpenOrder(service)}
                  className="relative w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-[#5ebdff] to-[#ab60f6] text-black font-extrabold text-sm hover:scale-[1.01] transform transition-all flex items-center justify-center gap-1.5 shadow-lg"
                >
                  <ShoppingCart size={15} />
                  <span>Order Now</span>
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredServices.length === 0 && (
        <div className="text-center py-20 text-gray-500 font-semibold h-96 flex flex-col items-center justify-center">
          <AlertCircle size={40} className="text-gray-600 mb-3" />
          <span className="text-lg">No services found for "{search}"</span>
        </div>
      )}

      {/* Quick Order Modal */}
      <AnimatePresence>
        {orderModalOpen && selectedService && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Modal Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              onClick={() => {
                if (orderingState !== 'loading') setOrderModalOpen(false);
              }}
            />

            {/* Modal Box */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-lg bg-[#090d16] border border-white/5 rounded-3xl p-6 md:p-8 shadow-2xl z-10 overflow-hidden text-left"
            >
              {/* Glow accent */}
              <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-[#5ebdff] to-[#ab60f6]"></div>

              {/* Close Button */}
              {orderingState !== 'loading' && (
                <button 
                  onClick={() => setOrderModalOpen(false)}
                  className="absolute top-6 right-6 p-1.5 rounded-full bg-white/5 border border-white/5 text-gray-400 hover:text-white transition-colors"
                >
                  <X size={18} />
                </button>
              )}

              {/* Dynamic Content States */}
              {orderingState === 'success' ? (
                <div className="py-10 text-center flex flex-col items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#5ebdff] to-[#ab60f6] flex items-center justify-center text-black mb-6 shadow-lg shadow-blue-500/20">
                    <Check size={32} className="stroke-[3]" />
                  </div>
                  <h3 className="text-2xl font-black mb-2 text-white">Order Placed Successfully!</h3>
                  <p className="text-gray-400 font-semibold text-sm">Your order is now being processed automatically.</p>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-3.5 mb-6">
                    {getPlatformIcon(selectedService.category)}
                    <div>
                      <span className="text-indigo-400/80 font-extrabold text-[10px] tracking-widest uppercase block mb-1">
                        {selectedService.sub}
                      </span>
                      <h3 className="text-xl font-bold text-white tracking-tight">{selectedService.name}</h3>
                    </div>
                  </div>

                  {/* Pricing Overview Row */}
                  <div className="mb-6 p-4 rounded-2xl bg-white/5 border border-white/5 flex justify-between items-center text-sm font-semibold">
                    <span className="text-gray-400">Rate Price:</span>
                    <span className="text-[#5ebdff] font-bold font-mono">${selectedService.price.toFixed(2)} per 1000</span>
                  </div>

                  {errorMessage && (
                    <div className="mb-4 p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-2xl flex items-center gap-2 text-sm font-semibold">
                      <AlertCircle size={18} className="shrink-0" />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  {/* Order Form */}
                  <form onSubmit={submitQuickOrder} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Target URL / Link</label>
                      <input 
                        type="url" 
                        required
                        value={link}
                        onChange={e => setLink(e.target.value)}
                        placeholder="e.g. https://www.instagram.com/p/..."
                        className="w-full bg-[#050914] border border-white/5 rounded-2xl px-4 py-3.5 text-sm text-white focus:outline-none focus:border-blue-500/30 transition-all placeholder-gray-600 text-left cursor-text" 
                        disabled={orderingState === 'loading'}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Quantity</label>
                        <input 
                          type="number" 
                          required
                          min={selectedService.min}
                          max={selectedService.max}
                          value={quantity}
                          onChange={e => setQuantity(e.target.value)}
                          placeholder={`Min: ${selectedService.min}`}
                          className="w-full bg-[#050914] border border-white/5 rounded-2xl px-4 py-3.5 text-sm font-semibold text-white focus:outline-none focus:border-blue-500/30 transition-all placeholder-gray-600 font-mono" 
                          disabled={orderingState === 'loading'}
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Total Charge</label>
                        <div className="w-full bg-[#050914] border border-white/5 rounded-2xl px-4 py-3.5 text-sm text-[#5ebdff] font-bold font-mono flex items-center justify-center">
                          ${computedCharge}
                        </div>
                      </div>
                    </div>

                    <div className="pt-4">
                      <button 
                        type="submit"
                        disabled={orderingState === 'loading'}
                        className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#5ebdff] to-[#ab60f6] text-black font-extrabold text-md hover:scale-[1.01] transform transition-all duration-200 flex items-center justify-center gap-2 shadow-xl shadow-blue-500/10"
                      >
                        {orderingState === 'loading' ? (
                          <>
                            <span className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></span>
                            <span>Processing Order...</span>
                          </>
                        ) : (
                          <>
                            <ShoppingCart size={18} />
                            <span>Confirm & Place Order</span>
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
