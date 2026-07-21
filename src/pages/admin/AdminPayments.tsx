import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CreditCard, ArrowUpRight, ArrowDownRight, Check, X, Plus } from 'lucide-react';
import { useStoreState, getPayments, approvePayment, rejectPayment, addPayment, getUsers } from '@/lib/store';

export default function AdminPayments() {
  const transactions = useStoreState(getPayments);
  const users = useStoreState(getUsers);
  
  const [isManualOpen, setIsManualOpen] = useState(false);
  const [targetUser, setTargetUser] = useState('');
  const [amount, setAmount] = useState('');
  const [gateway, setGateway] = useState('Manual Load');

  const totalStripe = transactions
    .filter(t => t.status === 'Paid' && t.method.toLowerCase().includes('stripe'))
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const totalPayPal = transactions
    .filter(t => t.status === 'Paid' && t.method.toLowerCase().includes('paypal'))
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const totalLoaded = transactions
    .filter(t => t.status === 'Paid')
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const handleManualAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetUser || !amount) return;

    addPayment(targetUser, gateway, parseFloat(amount) || 0, true);

    setAmount('');
    setIsManualOpen(false);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-4 text-left">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Payments & Gateway</h1>
          <p className="text-gray-400 font-semibold text-sm">Review incoming transaction pathways and manual wallet provisions.</p>
        </div>
        <button 
          onClick={() => {
            if (users.length > 0) {
              setTargetUser(users[0].username);
            }
            setIsManualOpen(true);
          }}
          className="px-6 py-2.5 bg-gradient-to-r from-red-500 to-orange-500 text-white font-extrabold rounded-2xl text-sm hover:opacity-95 flex items-center gap-1.5 cursor-pointer shadow-lg shadow-orange-500/10"
        >
          <Plus size={16} />
          <span>Add Manual Payment</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="p-6 rounded-[2rem] bg-[#090d16] border border-white/5">
          <div className="text-gray-400 font-bold text-xs uppercase tracking-wider mb-1">Stripe Deposits</div>
          <div className="text-2xl font-black font-mono text-white">${totalStripe.toFixed(2)}</div>
        </div>
        <div className="p-6 rounded-[2rem] bg-[#090d16] border border-white/5">
          <div className="text-gray-400 font-bold text-xs uppercase tracking-wider mb-1">PayPal Deposits</div>
          <div className="text-2xl font-black font-mono text-white">${totalPayPal.toFixed(2)}</div>
        </div>
        <div className="p-6 rounded-[2rem] bg-[#090d16] border border-white/5">
          <div className="text-gray-400 font-bold text-xs uppercase tracking-wider mb-1">System Load Total</div>
          <div className="text-2xl font-black font-mono text-[#5ebdff]">${totalLoaded.toFixed(2)}</div>
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="rounded-[2.2rem] border border-white/5 overflow-hidden bg-[#090d16]"
      >
        <div className="px-6 py-4 border-b border-white/5 flex justify-between items-center bg-white/[0.01]">
          <h3 className="font-extrabold text-lg text-white font-mono">Transaction History log</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/[0.02] border-b border-white/5 text-gray-500 text-xs uppercase tracking-wider">
                <th className="py-4 px-6 font-bold">TxID / Date</th>
                <th className="py-4 px-6 font-bold">User</th>
                <th className="py-4 px-6 font-bold">Gateway</th>
                <th className="py-4 px-6 font-bold text-right">Amount</th>
                <th className="py-4 px-6 font-bold text-right">Fee</th>
                <th className="py-4 px-6 font-bold text-center">Status</th>
                <th className="py-4 px-6 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {transactions.map((trx) => (
                <tr key={trx.id} className="hover:bg-white/5 transition-colors">
                  <td className="py-4 px-6">
                    <div className="font-mono text-sm text-gray-300 font-bold">#{trx.id}</div>
                    <div className="text-xs text-gray-500 mt-0.5 font-mono">{trx.date}</div>
                  </td>
                  <td className="py-4 px-6 font-bold text-white text-md">@{trx.username}</td>
                  <td className="py-4 px-6 text-sm text-gray-400">
                    <div className="flex items-center gap-2">
                      <CreditCard size={14} className="text-gray-500"/> 
                      <span className="font-bold">{trx.method}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-right font-mono font-bold text-blue-400">+${Number(trx.amount).toFixed(2)}</td>
                  <td className="py-4 px-6 text-right font-mono text-xs text-gray-500">-${Number(trx.fee).toFixed(2)}</td>
                  <td className="py-4 px-6 text-center text-sm">
                    {trx.status === 'Paid' && <span className="text-[#5ebdff] font-extrabold tracking-wider bg-[#5ebdff]/15 px-3 py-1 rounded-full text-[11px]">PAID</span>}
                    {trx.status === 'Pending' && <span className="text-yellow-400 font-extrabold tracking-wider bg-yellow-500/15 px-3 py-1 rounded-full text-[11px]">PENDING</span>}
                    {trx.status === 'Failed' && <span className="text-red-400 font-extrabold tracking-wider bg-red-500/15 px-3 py-1 rounded-full text-[11px]">FAILED</span>}
                  </td>
                  <td className="py-4 px-6 text-right">
                    {trx.status === 'Pending' ? (
                       <div className="flex justify-end gap-2">
                          <button 
                            onClick={() => approvePayment(trx.id)}
                            className="p-1.5 text-[#5ebdff] hover:bg-[#5ebdff]/15 rounded-xl border border-[#5ebdff]/20 transition-colors cursor-pointer" 
                            title="Approve & Fund Wallet"
                          >
                            <Check size={16} />
                          </button>
                          <button 
                            onClick={() => rejectPayment(trx.id)}
                            className="p-1.5 text-red-400 hover:bg-red-500/15 rounded-xl border border-red-500/20 transition-colors cursor-pointer" 
                            title="Reject Transaction"
                          >
                            <X size={16} />
                          </button>
                       </div>
                    ) : (
                      <span className="text-gray-600 text-xs">-</span>
                    )}
                  </td>
                </tr>
              ))}
              {transactions.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-gray-500 font-bold">
                    No transactions registered.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Manual Load Modal */}
      <AnimatePresence>
        {isManualOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/85 backdrop-blur-sm"
              onClick={() => setIsManualOpen(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-md bg-[#090d16] border border-white/5 rounded-[2rem] p-6 md:p-8 shadow-2xl z-20 overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 to-orange-500" />
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold text-white tracking-tight">Manual Deposit load</h3>
                  <p className="text-xs text-gray-500 mt-1">Directly inject balance into a client wallet instantly.</p>
                </div>
                <button 
                  onClick={() => setIsManualOpen(false)}
                  className="p-1.5 rounded-full bg-white/5 text-gray-400 hover:text-white transition-colors cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleManualAdd} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Recipient Customer</label>
                  <select
                    value={targetUser}
                    onChange={(e) => setTargetUser(e.target.value)}
                    className="w-full bg-[#050914] border border-white/5 rounded-2xl px-4 py-3 text-sm text-white font-bold focus:outline-none focus:border-red-500/30 cursor-pointer text-left"
                  >
                    {users.map(u => (
                      <option key={u.id} value={u.username}>@{u.username} (${u.balance.toFixed(2)})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Deposit gateway channel</label>
                  <input 
                    type="text" 
                    required
                    value={gateway}
                    onChange={(e) => setGateway(e.target.value)}
                    placeholder="e.g. PayPal Deposit, Crypto Load"
                    className="w-full bg-[#050914] border border-white/5 rounded-2xl px-4 py-3 text-sm font-semibold text-white focus:outline-none focus:border-red-500/30 text-left"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Fund Amount ($)</label>
                  <input 
                    type="number" 
                    step="0.01"
                    required
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="e.g. 150.00"
                    className="w-full bg-[#050914] border border-white/5 rounded-2xl px-4 py-3 text-sm font-mono font-semibold text-white focus:outline-none focus:border-red-500/30"
                  />
                </div>

                <div className="pt-4 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setIsManualOpen(false)}
                    className="flex-1 py-3.5 border border-white/5 text-gray-400 hover:text-white rounded-2xl hover:bg-white/5 cursor-pointer text-sm font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3.5 bg-gradient-to-r from-red-500 to-orange-500 text-white font-extrabold text-sm rounded-2xl hover:opacity-95 transform transition duration-200 cursor-pointer shadow-lg"
                  >
                    Inject Credit
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
