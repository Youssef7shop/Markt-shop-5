import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Search, Edit2, Archive, Trash, X, Award } from 'lucide-react';
import { useStoreState, getServices, addService, deleteService } from '@/lib/store';

export default function AdminServices() {
  const services = useStoreState(getServices);
  const [isAddOpen, setIsAddOpen] = useState(false);

  // New Service form fields
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Instagram Services');
  const [platform, setPlatform] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [discount, setDiscount] = useState('');
  const [price, setPrice] = useState('');
  const [cost, setCost] = useState('');
  const [min, setMin] = useState('100');
  const [max, setMax] = useState('10000');
  const [provider, setProvider] = useState('API Provider');
  
  // Custom unique categories
  const categories = Array.from(new Set(services.map(s => s.category))).map((catName, index) => ({
    name: catName,
    id: `cat-${index}`
  }));

  const handleCreateService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !category || !price || !cost) return;

    addService(
      name,
      category,
      platform,
      description,
      image,
      discount,
      parseFloat(price) || 0,
      parseFloat(cost) || 0,
      parseInt(min) || 10,
      parseInt(max) || 1000000,
      provider
    );

    // Reset fields
    setName('');
    setPlatform('');
    setDescription('');
    setImage('');
    setDiscount('');
    setPrice('');
    setCost('');
    setMin('100');
    setMax('10000');
    setProvider('API Provider');
    setIsAddOpen(false);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-4 text-left">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Services Matrix</h1>
          <p className="text-gray-400 font-semibold text-sm">Configure catalog SMM offerings, profit margins, and limit ranges.</p>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <button 
            onClick={() => setIsAddOpen(true)}
            className="flex items-center justify-center gap-2 px-6 py-2.5 bg-gradient-to-r from-red-500 to-orange-500 text-white font-extrabold rounded-2xl text-sm hover:opacity-95 cursor-pointer shadow-lg shadow-red-500/10"
          >
            <Plus size={16} /> 
            <span>Add New Service</span>
          </button>
        </div>
      </div>

      <div className="space-y-8">
        {categories.map((cat, i) => {
          const catServices = services.filter(s => s.category === cat.name);
          return (
            <motion.div 
              key={cat.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="rounded-[2.2rem] border border-white/5 bg-[#090d16] overflow-hidden"
            >
              <div className="px-6 py-4 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                <h2 className="font-extrabold text-lg text-white font-mono">{cat.name}</h2>
                <span className="text-xs text-gray-500 font-mono font-bold uppercase">{catServices.length} Services</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/5 text-gray-500 text-xs uppercase tracking-wider">
                      <th className="py-4 px-6 font-bold">ID</th>
                      <th className="py-4 px-6 font-bold w-1/3">Service</th>
                      <th className="py-4 px-6 font-bold">Provider</th>
                      <th className="py-4 px-6 font-bold text-right text-red-400/80">API Cost</th>
                      <th className="py-4 px-6 font-bold text-right text-blue-400/80">User Price</th>
                      <th className="py-4 px-6 font-bold text-center">Profit margin</th>
                      <th className="py-4 px-6 font-bold text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {catServices.map(s => {
                      const costVal = Number(s.cost) || 0.01;
                      const priceVal = Number(s.price) || 0.02;
                      const profitMargin = priceVal > costVal 
                        ? (((priceVal - costVal) / priceVal) * 100).toFixed(0) 
                        : '0';

                      return (
                        <tr key={s.id} className="hover:bg-white/5 transition-colors">
                          <td className="py-4 px-6 font-mono font-bold text-gray-500 text-sm">#{s.id}</td>
                          <td className="py-4 px-6 text-sm font-bold text-white">
                            <div>{s.name}</div>
                            <div className="text-xs text-gray-500 mt-0.5 font-mono">Min: {s.min} • Max: {s.max}</div>
                          </td>
                          <td className="py-4 px-6 text-xs text-gray-400 font-bold uppercase tracking-wide">{s.provider}</td>
                          <td className="py-4 px-6 text-right font-mono text-sm text-gray-500">${costVal.toFixed(3)}</td>
                          <td className="py-4 px-6 text-right font-mono text-sm font-bold text-white">${priceVal.toFixed(2)}</td>
                          <td className="py-4 px-6 text-center text-xs font-mono font-black text-blue-400">+{profitMargin}%</td>
                          <td className="py-4 px-6 text-right">
                            <button 
                              onClick={() => {
                                if (confirm(`Are you sure you want to delete SMM service #${s.id}?`)) {
                                  deleteService(s.id);
                                }
                              }}
                              className="p-2 text-gray-500 hover:text-red-500 rounded-xl bg-white/5 hover:bg-red-500/10 transition-all cursor-pointer" 
                              title="Delete Service"
                            >
                              <Trash size={14} />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Add Service Modal */}
      <AnimatePresence>
        {isAddOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/85 backdrop-blur-sm"
              onClick={() => setIsAddOpen(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-lg bg-[#090d16] border border-white/5 rounded-[2.5rem] p-6 md:p-8 shadow-2xl z-20 overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 to-orange-500" />
              <div className="flex items-center justify-between xl:items-start mb-6">
                <div>
                  <h3 className="text-xl font-bold text-white tracking-tight">Add New Service</h3>
                  <p className="text-xs text-gray-500 mt-1">Configure user pricing and API providers.</p>
                </div>
                <button 
                  onClick={() => setIsAddOpen(false)}
                  className="p-1.5 rounded-full bg-white/5 text-gray-400 hover:text-white transition-colors cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleCreateService} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Service Category Name</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-[#050914] border border-white/5 rounded-2xl px-4 py-3 text-sm text-white font-bold focus:outline-none focus:border-red-500/30 cursor-pointer text-left"
                  >
                    <option value="Instagram Services">Instagram Services</option>
                    <option value="TikTok Services">TikTok Services</option>
                    <option value="YouTube Services">YouTube Services</option>
                    <option value="Discord Services">Discord Services</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Service Label / Name</label>
                  <input 
                    type="text" 
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. IG Followers - Premium Guaranteed"
                    className="w-full bg-[#050914] border border-white/5 rounded-2xl px-4 py-3 text-sm font-semibold text-white focus:outline-none focus:border-red-500/30 text-left"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Description</label>
                  <textarea 
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Provide details about the service"
                    className="w-full bg-[#050914] border border-white/5 rounded-2xl px-4 py-3 text-sm font-semibold text-white focus:outline-none focus:border-red-500/30 text-left resize-none h-20"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Platform / Location</label>
                    <input 
                      type="text" 
                      value={platform}
                      onChange={(e) => setPlatform(e.target.value)}
                      placeholder="e.g. Instagram"
                      className="w-full bg-[#050914] border border-white/5 rounded-2xl px-4 py-3 text-sm font-semibold text-white focus:outline-none focus:border-red-500/30 text-left"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Photo URL</label>
                    <input 
                      type="text" 
                      value={image}
                      onChange={(e) => setImage(e.target.value)}
                      placeholder="https://example.com/image.jpg"
                      className="w-full bg-[#050914] border border-white/5 rounded-2xl px-4 py-3 text-sm font-semibold text-white focus:outline-none focus:border-red-500/30 text-left"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Discount (e.g. Discount 1, Discount 2, -2)</label>
                  <input 
                    type="text" 
                    value={discount}
                    onChange={(e) => setDiscount(e.target.value)}
                    placeholder="e.g. -2%"
                    className="w-full bg-[#050914] border border-white/5 rounded-2xl px-4 py-3 text-sm font-semibold text-white focus:outline-none focus:border-red-500/30 text-left"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">API Cost ($ per 1K)</label>
                    <input 
                      type="number" 
                      step="0.001"
                      required
                      value={cost}
                      onChange={(e) => setCost(e.target.value)}
                      placeholder="e.g. 0.20"
                      className="w-full bg-[#050914] border border-white/5 rounded-2xl px-4 py-3 text-sm font-mono font-semibold text-white focus:outline-none focus:border-red-500/30"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">User Price ($ per 1K)</label>
                    <input 
                      type="number" 
                      step="0.01"
                      required
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="e.g. 1.50"
                      className="w-full bg-[#050914] border border-white/5 rounded-2xl px-4 py-3 text-sm font-mono font-semibold text-white focus:outline-none focus:border-red-500/30"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Minimum Count</label>
                    <input 
                      type="number" 
                      required
                      value={min}
                      onChange={(e) => setMin(e.target.value)}
                      placeholder="100"
                      className="w-full bg-[#050914] border border-white/5 rounded-2xl px-4 py-3 text-sm font-mono font-semibold text-white focus:outline-none focus:border-red-500/30"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Maximum Count</label>
                    <input 
                      type="number" 
                      required
                      value={max}
                      onChange={(e) => setMax(e.target.value)}
                      placeholder="10000"
                      className="w-full bg-[#050914] border border-white/5 rounded-2xl px-4 py-3 text-sm font-mono font-semibold text-white focus:outline-none focus:border-red-500/30"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Source / Provider</label>
                  <input 
                    type="text" 
                    value={provider}
                    onChange={(e) => setProvider(e.target.value)}
                    placeholder="e.g. API Provider X"
                    className="w-full bg-[#050914] border border-white/5 rounded-2xl px-4 py-3 text-sm font-semibold text-white focus:outline-none focus:border-red-500/30 text-left"
                  />
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    className="w-full py-4 bg-gradient-to-r from-red-500 to-orange-500 text-white font-extrabold text-sm rounded-2xl hover:opacity-95 transform transition duration-200 cursor-pointer shadow-lg shadow-orange-500/15"
                  >
                    Publish SMM Service
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
