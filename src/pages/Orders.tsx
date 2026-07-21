import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search } from 'lucide-react';
import { useStoreState, getOrders, getCurrentUser } from '@/lib/store';

export default function Orders() {
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');

  const currentUser = useStoreState(getCurrentUser);
  const allOrders = useStoreState(getOrders);

  // Filter only current user's orders
  const userOrders = allOrders.filter(o => o.username.toLowerCase() === currentUser.username.toLowerCase());

  const filteredOrders = userOrders.filter(o => 
    (filter === 'All' || o.status === filter) && 
    (o.link.toLowerCase().includes(search.toLowerCase()) || String(o.id).includes(search))
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-4">
      {/* Title Header */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight mb-2 text-white">Orders History</h1>
          <p className="text-gray-400 font-semibold text-sm">Track and manage all your campaign orders in real-time.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
            <input 
              type="text" 
              placeholder="Search ID or URL..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full sm:w-64 bg-[#050914] border border-white/5 rounded-2xl pl-9 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500/40 transition-colors text-left"
            />
          </div>
          <select 
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="bg-[#050914] border border-white/5 rounded-2xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500/40 transition-colors appearance-none cursor-pointer pr-10 text-left font-semibold"
          >
            <option value="All">All Standings</option>
            <option value="Completed">Completed</option>
            <option value="Processing">Processing</option>
            <option value="Pending">Pending</option>
            <option value="Canceled">Canceled</option>
            <option value="Failed">Failed</option>
          </select>
        </div>
      </div>

      {/* Orders Table Layout Container */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="rounded-[2rem] border border-white/5 overflow-hidden bg-[#090d16]"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5 border-b border-white/5 text-gray-400 text-sm">
                <th className="py-4 px-6 font-bold text-left">ID</th>
                <th className="py-4 px-6 font-bold text-left">Date Launched</th>
                <th className="py-4 px-6 font-bold text-left">Target Link</th>
                <th className="py-4 px-6 font-bold text-left">Charge</th>
                <th className="py-4 px-6 font-bold text-left">Start Count</th>
                <th className="py-4 px-6 font-bold text-left">Remains</th>
                <th className="py-4 px-6 font-bold text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 relative">
              <AnimatePresence>
                {filteredOrders.length > 0 ? filteredOrders.map((order) => (
                  <motion.tr 
                    key={order.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="hover:bg-white/5 transition-colors"
                  >
                    <td className="py-4 px-6 font-mono font-bold text-gray-500 text-sm">#{order.id}</td>
                    <td className="py-4 px-6 text-sm text-gray-400 font-mono">{order.date}</td>
                    <td className="py-4 px-6 text-sm">
                      <span className="truncate max-w-[150px] md:max-w-[200px] inline-block text-white font-mono" title={order.link}>{order.link}</span>
                    </td>
                    <td className="py-4 px-6 text-left font-mono font-bold text-white">${order.charge.toFixed(2)}</td>
                    <td className="py-4 px-6 text-left font-mono text-gray-400">{order.startCount}</td>
                    <td className="py-4 px-6 text-left font-mono text-gray-400">{order.remains}</td>
                    <td className="py-4 px-6 text-center">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-extrabold tracking-wide
                        ${order.status === 'Completed' ? 'bg-[#5ebdff]/15 text-[#5ebdff] border border-[#5ebdff]/30' : 
                          order.status === 'Processing' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : 
                          order.status === 'Pending' ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20' :
                          'bg-red-500/10 text-red-400 border border-red-500/20'}
                      `}>
                        {order.status}
                      </span>
                    </td>
                  </motion.tr>
                )) : (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-gray-500 font-bold">
                      No matching orders found.
                    </td>
                  </tr>
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
