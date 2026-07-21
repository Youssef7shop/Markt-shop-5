import { motion } from 'motion/react';
import { CreditCard, Bitcoin, CheckCircle, MessageCircle } from 'lucide-react';
import { useState } from 'react';
import { redeemTelegramCode, getCurrentUser, useStoreState } from '@/lib/store';

export default function AddFunds() {
  const [method, setMethod] = useState('stripe');
  const [amount, setAmount] = useState('25.00');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [telegramCode, setTelegramCode] = useState('');
  const [telegramError, setTelegramError] = useState('');

  const currentUser = useStoreState(getCurrentUser);

  const numAmount = parseFloat(amount) || 0;
  const fee = method === 'crypto' ? 0.00 : 0.50;
  const total = (numAmount + fee).toFixed(2);

  const paymentButtons = ['10', '25', '50', '100', '250', '500'];

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (method === 'telegram') {
      if (!telegramCode) return;
      setIsProcessing(true);
      setTelegramError('');
      
      setTimeout(() => {
        const result = redeemTelegramCode(currentUser.username, telegramCode);
        if (result.success) {
          setIsSuccess(true);
          setTelegramCode('');
          setTimeout(() => setIsSuccess(false), 3000);
        } else {
          setTelegramError(result.error || 'Invalid code');
        }
        setIsProcessing(false);
      }, 1000);
      return;
    }

    if (numAmount < 5) return;
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        setAmount('25.00');
      }, 3000);
    }, 1500);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-4">
      {/* Header Title */}
      <div className="mb-10 text-left">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-2 text-white">Add Funds</h1>
        <p className="text-gray-400 text-sm md:text-base font-semibold">Load credits to start immediate instant automatic social optimization runs.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Left column: Payment methods and input */}
        <motion.div
           initial={{ opacity: 0, x: -20 }}
           animate={{ opacity: 1, x: 0 }}
           transition={{ duration: 0.4 }}
           className="space-y-6"
        >
          {/* Payment Method Selector */}
          <div className="text-left">
            <span className="block text-xs font-extrabold text-[#8da6cc]/60 uppercase tracking-widest mb-3">Select Provider</span>
            <div className="space-y-3">
              <button 
                onClick={() => setMethod('stripe')}
                className={`w-full flex items-center gap-4 p-5 rounded-3xl border transition-all text-left hover:bg-white/5 ${
                  method === 'stripe' ? 'bg-[#5ebdff]/10 border-[#5ebdff]' : 'bg-[#090d16] border-white/5'
                }`}
              >
                <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 border border-indigo-500/20">
                  <CreditCard size={22} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-base text-white mb-0.5">Credit or Debit Card (Stripe)</div>
                  <div className="text-xs text-gray-500 font-semibold">Secure, SSL-encrypted dynamic card processing (Fee: $0.50)</div>
                </div>
              </button>
              
              <button 
                onClick={() => setMethod('paypal')}
                className={`w-full flex items-center gap-4 p-5 rounded-3xl border transition-all text-left hover:bg-white/5 ${
                  method === 'paypal' ? 'bg-[#5ebdff]/10 border-[#5ebdff]' : 'bg-[#090d16] border-white/5'
                }`}
              >
                <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-400 font-extrabold italic text-xl border border-blue-500/20">
                  P
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-base text-white mb-0.5">PayPal Instant Checkout</div>
                  <div className="text-xs text-gray-500 font-semibold">Top up immediately via PayPal balances or linked bank (Fee: $0.50)</div>
                </div>
              </button>
              
              <button 
                onClick={() => setMethod('crypto')}
                className={`w-full flex items-center gap-4 p-5 rounded-3xl border transition-all text-left hover:bg-white/5 ${
                  method === 'crypto' ? 'bg-[#5ebdff]/10 border-[#5ebdff]' : 'bg-[#090d16] border-white/5'
                }`}
              >
                <div className="w-12 h-12 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-400 border border-orange-500/20">
                  <Bitcoin size={22} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-base text-white mb-0.5">Cryptocurrency Payment</div>
                  <div className="text-xs text-gray-500 font-semibold">Accepts BTC, ETH, USDT & more tokens (No processor gateway fees)</div>
                </div>
              </button>

              <button 
                onClick={() => setMethod('telegram')}
                className={`w-full flex items-center gap-4 p-5 rounded-3xl border transition-all text-left hover:bg-white/5 ${
                  method === 'telegram' ? 'bg-[#5ebdff]/10 border-[#5ebdff]' : 'bg-[#090d16] border-white/5'
                }`}
              >
                <div className="w-12 h-12 rounded-2xl bg-[#0088cc]/10 flex items-center justify-center text-[#0088cc] border border-[#0088cc]/20">
                  <MessageCircle size={22} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-base text-white mb-0.5">Telegram Recharge Code</div>
                  <div className="text-xs text-gray-500 font-semibold">Redeem a code received via our Telegram bot (No fees)</div>
                </div>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Right column: Form Amount and summary */}
        <motion.div
           initial={{ opacity: 0, x: 20 }}
           animate={{ opacity: 1, x: 0 }}
           transition={{ duration: 0.4, delay: 0.1 }}
           className="bg-[#090d16] border border-white/5 rounded-[2rem] p-6 md:p-8 h-fit relative overflow-hidden text-left"
        >
          {/* Top border decoration */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#5ebdff] to-[#ab60f6]"></div>
          
          <h2 className="text-2xl font-black text-white mb-6">Payment and Overview</h2>
          <form className="space-y-6" onSubmit={handlePayment}>
            
            {method === 'telegram' ? (
              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Enter Telegram Code</label>
                  <input 
                    type="text" 
                    required
                    value={telegramCode}
                    onChange={(e) => setTelegramCode(e.target.value)}
                    placeholder="e.g. TELEGRAM1" 
                    className="w-full bg-[#050914] border border-[#ab60f6]/20 rounded-2xl px-4 py-4 text-white font-mono text-xl font-bold focus:outline-none focus:border-blue-500/30 transition-colors text-left uppercase" 
                  />
                  {telegramError && <p className="mt-2 text-sm text-red-500 font-bold">{telegramError}</p>}
                  <p className="mt-2 text-xs text-gray-500 font-semibold">Contact our support on Telegram to purchase recharge codes.</p>
                </div>
                
                <div className="pt-2">
                  <button 
                    type="submit" 
                    disabled={isProcessing || isSuccess || !telegramCode}
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-[#0088cc] to-[#00aaff] text-white font-extrabold text-md hover:scale-[1.01] transform transition-all flex items-center justify-center disabled:opacity-50 shadow-xl shadow-blue-500/10"
                  >
                    {isProcessing ? (
                      <span className="flex items-center gap-2">
                        <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span> Verifying Code...
                      </span>
                    ) : isSuccess ? (
                      <motion.span 
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="flex items-center gap-2"
                      >
                        <CheckCircle size={20} /> Code Redeemed Successfully!
                      </motion.span>
                    ) : (
                      'Redeem Code'
                    )}
                  </button>
                </div>
              </div>
            ) : (
              <>
                {/* Amount Field Choice Grid */}
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Choose standard tier</label>
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    {paymentButtons.map((val) => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => setAmount(parseFloat(val).toFixed(2))}
                        className={`py-3 rounded-xl text-sm font-bold font-mono transition-colors border ${
                          numAmount === parseFloat(val)
                            ? 'bg-[#ab60f6]/10 text-[#ab60f6] border-[#ab60f6]'
                            : 'bg-[#050914] text-gray-400 border-white/5 hover:text-white hover:border-white/10'
                        }`}
                      >
                        ${val}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Or enter custom USD amount</label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-mono text-lg">$</div>
                    <input 
                      type="number" 
                      step="0.01"
                      min="5"
                      required
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="25.00" 
                      className="w-full bg-[#050914] border border-[#ab60f6]/20 rounded-2xl pl-10 pr-4 py-4 text-white font-mono text-xl font-bold focus:outline-none focus:border-blue-500/30 transition-colors text-left" 
                    />
                  </div>
                  <p className="mt-2 text-xs text-gray-500 font-semibold">Minimum limit allowed per recharge is $5.00 USD.</p>
                </div>
                
                {/* Dynamic Summary Rows */}
                <div className="pt-6 border-t border-white/5 space-y-3 font-semibold text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">Designated Recharge:</span>
                    <span className="font-mono text-white text-base">${numAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">Gateway Processor Fee:</span>
                    <span className="font-mono text-white text-base">${fee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center pt-3 border-t border-white/5">
                    <span className="text-white font-black text-lg">Subtotal Due:</span>
                    <span className="font-mono text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#2cc4ff] to-[#bd39ff]">${total}</span>
                  </div>
                </div>

                <div className="pt-2">
                  <button 
                    type="submit" 
                    disabled={isProcessing || isSuccess || numAmount < 5}
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-[#5ebdff] to-[#ab60f6] text-black font-extrabold text-md hover:scale-[1.01] transform transition-all flex items-center justify-center disabled:opacity-50 shadow-xl shadow-blue-500/10"
                  >
                    {isProcessing ? (
                      <span className="flex items-center gap-2">
                        <span className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></span> Connecting Secure Checkout...
                      </span>
                    ) : isSuccess ? (
                      <motion.span 
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="flex items-center gap-2"
                      >
                        <CheckCircle size={20} /> Balance Loaded Successfully!
                      </motion.span>
                    ) : (
                      'Proceed with funding checkout'
                    )}
                  </button>
                  <span className="block text-center text-xs text-gray-500 mt-3 font-semibold">Merchant secure connection. 256-Bit SSL protection guaranteed.</span>
                </div>
              </>
            )}
          </form>
        </motion.div>
      </div>

    </div>
  );
}
