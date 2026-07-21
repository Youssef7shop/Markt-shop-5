import { useState } from 'react';
import { motion } from 'motion/react';
import { Wallet, Send, CheckCircle, ArrowDownLeft, ArrowUpRight } from 'lucide-react';

export default function SendFunds() {
  const [email, setEmail] = useState('');
  const [amount, setAmount] = useState('10.00');
  const [note, setNote] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [balance] = useState(125.50);

  const [recentTransfers, setRecentTransfers] = useState([
    { id: '1', type: 'received', name: 'Received Funds', email: 'hh@gmail.com', amount: '20.00', date: '5/4/2026, 5:31:51 PM' }
  ]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount) || 0;
    if (numAmount <= 0 || numAmount > balance) return;
    
    setIsSending(true);
    setTimeout(() => {
      setIsSending(false);
      setIsSuccess(true);
      
      const newTransfer = {
        id: Math.random().toString(),
        type: 'sent',
        name: 'Sent to ' + email.split('@')[0],
        email: email,
        amount: numAmount.toFixed(2),
        date: new Date().toLocaleString('en-US')
      };
      
      setRecentTransfers([newTransfer, ...recentTransfers]);
      
      setTimeout(() => {
        setIsSuccess(false);
        setEmail('');
        setAmount('10.00');
        setNote('');
      }, 2000);
    }, 1500);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-4">
      {/* Title Header */}
      <div className="mb-10 text-left">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-2 text-white">Send Funds</h1>
        <p className="text-gray-400 text-sm md:text-base font-semibold">Transfer advertising balance to another user account instantly.</p>
      </div>

      {/* Available Balance Box */}
      <div className="mb-8 p-6 rounded-3xl bg-[#090d16] border border-white/5 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#ab60f6]/10 flex items-center justify-center text-[#ab60f6] border border-[#ab60f6]/20">
            <Wallet size={24} />
          </div>
          <div className="text-left">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-widest block mb-1">Available balance</span>
            <span className="text-2xl font-black text-white font-mono">${balance.toFixed(2)} USD</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Column */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-2 p-6 md:p-8 rounded-[2rem] bg-[#090d16] border border-white/5 relative overflow-hidden text-left"
        >
          {/* Top glow */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#5ebdff] to-[#ab60f6]"></div>

          <form onSubmit={handleSend} className="space-y-6">
            <div>
              <label className="block text-xs font-extrabold text-[#8da6cc]/60 uppercase tracking-widest mb-2">Recipient Email Address</label>
              <input 
                type="email" 
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="friend@example.com"
                className="w-full bg-[#050914] border border-white/5 rounded-2xl px-4 py-3.5 text-sm text-white focus:outline-none focus:border-blue-500/30 transition-all placeholder-gray-600 text-left" 
                disabled={isSending}
              />
            </div>

            <div>
              <label className="block text-xs font-extrabold text-[#8da6cc]/60 uppercase tracking-widest mb-2">Amount to Send (USD)</label>
              <input 
                type="number" 
                step="0.01"
                min="0.1"
                max={balance}
                required
                value={amount}
                onChange={e => setAmount(e.target.value)}
                placeholder="10.00"
                className="w-full bg-[#050914] border border-white/5 rounded-2xl px-4 py-3.5 text-sm font-semibold text-white focus:outline-none focus:border-blue-500/30 transition-all placeholder-gray-600 font-mono text-left" 
                disabled={isSending}
              />
            </div>

            <div>
              <label className="block text-xs font-extrabold text-[#8da6cc]/60 uppercase tracking-widest mb-2">Optional Memo Description</label>
              <textarea 
                value={note}
                onChange={e => setNote(e.target.value)}
                placeholder="What is the transfer purpose?"
                rows={3}
                className="w-full bg-[#050914] border border-white/5 rounded-2xl px-4 py-3.5 text-sm text-white focus:outline-none focus:border-blue-500/30 transition-all placeholder-gray-600 text-left resize-none" 
                disabled={isSending}
              />
            </div>

            <div className="pt-4">
              <button 
                type="submit"
                disabled={isSending || isSuccess || parseFloat(amount) > balance}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#5ebdff] to-[#ab60f6] text-black font-extrabold text-md hover:scale-[1.01] transform transition-all duration-200 flex items-center justify-center gap-2 shadow-xl shadow-blue-500/10"
              >
                {isSending ? (
                  <>
                    <span className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></span>
                    <span>Broadcasting Transfer...</span>
                  </>
                ) : isSuccess ? (
                  <>
                    <CheckCircle size={18} />
                    <span>Sent Successfully!</span>
                  </>
                ) : (
                  <>
                    <Send size={16} />
                    <span>Send Funds Now</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>

        {/* Recent Transfers Column */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col gap-4 text-left"
        >
          <h2 className="text-lg font-bold text-white tracking-snug">Recent Activity</h2>
          <div className="flex flex-col gap-3">
            {recentTransfers.map((item) => (
              <div 
                key={item.id} 
                className="flex items-center justify-between p-4 rounded-2xl bg-[#090d16] border border-white/5 hover:border-white/10 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    item.type === 'received' 
                      ? 'bg-[#5ebdff]/10 text-[#5ebdff] border border-[#5ebdff]/10' 
                      : 'bg-red-500/10 text-red-400 border border-red-500/10'
                  }`}>
                    {item.type === 'received' ? <ArrowDownLeft size={16} /> : <ArrowUpRight size={16} />}
                  </div>
                  <div>
                    <span className="font-bold text-sm text-white block">{item.name}</span>
                    <span className="text-[10px] text-gray-500 font-mono block">{item.date}</span>
                  </div>
                </div>
                <div className="text-right font-mono font-bold text-sm text-[#5ebdff]">
                  {item.type === 'received' ? '+' : '-'}${item.amount}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
