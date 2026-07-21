import { useState } from 'react';
import { motion } from 'motion/react';
import { Search, Filter, RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react';
import { useStoreState, getOrders, updateOrderStatus, Order } from '@/lib/store';

export default function AdminOrders() {
  const orders = useStoreState(getOrders);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const filteredOrders = orders.filter((o) => {
    const matchesSearch = 
      String(o.id).includes(search) || 
      o.username.toLowerCase().includes(search.toLowerCase()) || 
      o.link.toLowerCase().includes(search.toLowerCase()) || 
      o.service.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = 
      statusFilter === 'All' || 
      o.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = (orderId: string | number, value: any) => {
    updateOrderStatus(orderId, value);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-4">
       <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4 text-left">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Order Log</h1>
          <p className="text-gray-400 font-semibold text-sm">Monitor system requests and update fulfillment pathways.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
            <input 
              type="text" 
              placeholder="Search Order ID, Link, User..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#050914] border border-white/5 rounded-2xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-red-500/40 transition-colors text-left" 
            />
          </div>
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#050914] border border-white/5 rounded-2xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-red-500/40 transition-colors cursor-pointer text-left font-bold"
          >
            <option value="All">All Standings</option>
            <option value="Pending">Pending</option>
            <option value="Processing">Processing</option>
            <option value="Completed">Completed</option>
            <option value="Canceled">Canceled</option>
            <option value="Failed">Failed</option>
          </select>
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="rounded-[2rem] border border-white/5 overflow-hidden bg-[#090d16]"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="bg-white/5 border-b border-white/5 text-gray-400 text-xs uppercase tracking-wider">
                <th className="py-4 px-6 font-bold text-left">ID / Date</th>
                <th className="py-4 px-6 font-bold text-left">User</th>
                <th className="py-4 px-6 font-bold w-64 text-left">Service & Link</th>
                <th className="py-4 px-6 font-bold text-right">Amount</th>
                <th className="py-4 px-6 font-bold text-right">Charge</th>
                <th className="py-4 px-6 font-bold text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-white/5 transition-colors text-sm">
                  <td className="py-4 px-6 text-left">
                    <div className="font-mono text-white mb-0.5 font-bold">#{order.id}</div>
                    <div className="text-xs text-gray-500 font-mono">{order.date}</div>
                  </td>
                  <td className="py-4 px-6 text-gray-300 font-bold text-left">@{order.username}</td>
                  <td className="py-4 px-6 text-left">
                    <div className="truncate max-w-[200px] text-white font-bold mb-0.5" title={order.service}>{order.service}</div>
                    <div className="truncate max-w-[200px] text-xs text-blue-400 hover:underline cursor-pointer font-mono" title={order.link}>{order.link}</div>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="font-mono text-white font-bold">{order.quantity.toLocaleString()}</div>
                    <div className="text-xs text-gray-500 font-mono">Start: {order.startCount}</div>
                  </td>
                  <td className="py-4 px-6 text-right font-mono font-bold text-white">
                    ${order.charge.toFixed(2)}
                  </td>
                  <td className="py-4 px-6 text-center">
                    <select 
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value as any)}
                      className={`text-xs font-extrabold px-3 py-1.5 rounded-xl bg-[#050914] border focus:outline-none cursor-pointer text-left
                        ${order.status === 'Completed' ? 'text-[#5ebdff] border-[#5ebdff]/30' : 
                          order.status === 'Processing' ? 'text-blue-400 border-blue-500/30' : 
                          order.status === 'Pending' ? 'text-yellow-400 border-yellow-500/30' : 
                          'text-red-400 border-red-500/30'}`
                      }
                    >
                      <option value="Pending">Pending</option>
                      <option value="Processing">Processing</option>
                      <option value="Completed">Completed</option>
                      <option value="Canceled">Canceled</option>
                      <option value="Failed">Failed</option>
                    </select>
                  </td>
                </tr>
              ))}
              {filteredOrders.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-gray-500 font-bold">
                    No orders registered in system standings.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
