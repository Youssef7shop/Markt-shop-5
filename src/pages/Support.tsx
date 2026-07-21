import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, Plus, X, Send } from 'lucide-react';

export default function Support() {
  const [newTicketModal, setNewTicketModal] = useState(false);
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [msgInput, setMsgInput] = useState('');

  const [tickets, setTickets] = useState([
    { 
      id: '#6293', 
      subject: 'Issue with Order #10432 - Has not started yet', 
      status: 'Open', 
      updated: '2 hours ago',
      messages: [
        { sender: 'user', text: 'I purchased the TikTok followers 2 hours ago and the processing still says pending. Please double check that for me.', time: '12:05 PM' }
      ]
    },
    { 
      id: '#6210', 
      subject: 'Pending crypto USDT deposit confirmation', 
      status: 'Closed', 
      updated: '3 days ago',
      messages: [
        { sender: 'user', text: 'Sent USDT via TRC20 network but the corresponding balance option has not updated.', time: '3 days ago' },
        { sender: 'admin', text: 'We parsed the transaction receipt on the ledger and added the balance credits successfully. Thank you for choosing us.', time: '3 days ago' }
      ]
    },
  ]);

  const activeTicket = tickets.find(t => t.id === selectedTicketId);

  const handleNewTicket = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const subject = formData.get('subject') as string;
    const message = formData.get('message') as string;
    
    if (subject && message) {
      const newId = `#${Math.floor(1000 + Math.random() * 9000)}`;
      const newT = {
        id: newId,
        subject,
        status: 'Open',
        updated: 'now',
        messages: [
          { sender: 'user', text: message, time: 'now' }
        ]
      };
      setTickets([newT, ...tickets]);
      setSelectedTicketId(newId);
      setNewTicketModal(false);
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!msgInput.trim() || !selectedTicketId) return;

    setTickets(tickets.map(t => {
      if (t.id === selectedTicketId) {
        return {
          ...t,
          messages: [...t.messages, { sender: 'user', text: msgInput, time: 'now' }],
          updated: 'now'
        };
      }
      return t;
    }));

    setMsgInput('');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-4 text-left">
      {/* Title Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight mb-2 text-white">Help & Support</h1>
          <p className="text-gray-400 font-semibold text-sm">Need any assistance? Open a support ticket, we reply within hours.</p>
        </div>
        <button 
          onClick={() => setNewTicketModal(true)}
          className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-[#5ebdff] to-[#ab60f6] text-black font-extrabold hover:scale-[1.01] transform transition-all shadow-lg"
        >
          <Plus size={18} /> Open New Ticket
        </button>
      </div>

      {/* Main Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
        
        {/* Left column: Cards list */}
        <motion.div
           initial={{ opacity: 0, y: 15 }}
           animate={{ opacity: 1, y: 0 }}
           className="space-y-4 flex flex-col"
        >
          <div className="text-sm font-extrabold text-[#8da6cc]/60 uppercase tracking-widest mb-1 select-none">Recent Tickets</div>
          
          <div className="space-y-3 overflow-y-auto max-h-[500px] pr-1">
            {tickets.map((ticket) => {
              const isActive = ticket.id === selectedTicketId;
              return (
                <div 
                  key={ticket.id} 
                  onClick={() => setSelectedTicketId(ticket.id)}
                  className={`p-5 rounded-3xl border transition-all cursor-pointer flex flex-col justify-between gap-4 relative overflow-hidden text-left ${
                    isActive 
                      ? 'bg-[#ab60f6]/10 border-[#ab60f6]' 
                      : 'bg-[#090d16] border-white/5 hover:border-white/10'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                      isActive ? 'bg-[#ab60f6]/20 text-[#ab60f6]' : 'bg-white/5 text-gray-400'
                    }`}>
                      <MessageSquare size={20} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-base text-white truncate text-left">
                        {ticket.subject}
                      </h3>
                      <div className="flex items-center gap-2.5 text-xs text-gray-500 font-mono mt-1 justify-start">
                        <span className="text-[#5ebdff] font-extrabold">{ticket.id}</span>
                        <span>•</span>
                        <span>Updated: {ticket.updated}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center border-t border-white/5 pt-3 mt-1">
                    <div className={`px-3 py-1 rounded-full text-[10px] font-extrabold tracking-wide uppercase border ${
                      ticket.status === 'Open' 
                        ? 'bg-[#5ebdff]/10 text-[#5ebdff] border-[#5ebdff]/20' 
                        : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                    }`}>
                      {ticket.status}
                    </div>
                    <span className="text-xs text-[#8da6cc]/50 font-bold hover:underline">View Chat →</span>
                  </div>
                </div>
              );
            })}

            {tickets.length === 0 && (
              <div className="p-12 text-center border border-white/5 border-dashed rounded-3xl bg-[#090d16] text-gray-500 font-semibold">
                No tickets launched yet.
              </div>
            )}
          </div>
        </motion.div>

        {/* Right column: Workspace */}
        <motion.div
           initial={{ opacity: 0, y: 15 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 0.1 }}
           className="lg:col-span-2 bg-[#090d16] border border-white/5 rounded-[2rem] p-6 md:p-8 flex flex-col min-h-[450px] relative overflow-hidden"
        >
          {activeTicket ? (
            <div className="flex flex-col h-full justify-between gap-6">
              {/* Header inside layout */}
              <div className="border-b border-white/5 pb-4 flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-bold text-white tracking-snug text-left">{activeTicket.subject}</h2>
                  <span className="text-xs text-[#5ebdff] font-mono font-bold mt-1 block text-left">{activeTicket.id}</span>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-extrabold tracking-wide border ${
                  activeTicket.status === 'Open' 
                    ? 'bg-[#5ebdff]/10 text-[#5ebdff] border-[#5ebdff]/20' 
                    : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                }`}>
                  {activeTicket.status}
                </div>
              </div>

              {/* Chat messages */}
              <div className="flex-1 overflow-y-auto space-y-4 max-h-[300px] pr-2">
                {activeTicket.messages.map((msg, idx) => {
                  const isAdmin = msg.sender === 'admin';
                  return (
                    <div 
                      key={idx} 
                      className={`flex ${isAdmin ? 'justify-start' : 'justify-end'} text-left`}
                    >
                      <div className={`max-w-[80%] rounded-2xl p-4 text-sm leading-relaxed ${
                        isAdmin 
                          ? 'bg-white/5 text-gray-200 rounded-tl-none border border-white/5' 
                          : 'bg-[#ab60f6]/10 text-white rounded-tr-none border border-[#ab60f6]/20'
                      }`}>
                        <div className="font-extrabold text-[10px] text-gray-400 mb-1">
                          {isAdmin ? 'Technical Support Staff' : 'You'} • {msg.time}
                        </div>
                        <div>{msg.text}</div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Reply form */}
              <form onSubmit={handleSendMessage} className="border-t border-white/5 pt-4 flex gap-3">
                <input 
                  type="text" 
                  value={msgInput}
                  onChange={e => setMsgInput(e.target.value)}
                  placeholder="Type your response or update details here..."
                  className="flex-1 bg-[#050914] border border-white/5 rounded-2xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500/30 transition-all text-left"
                />
                <button 
                  type="submit"
                  className="px-5 py-3 rounded-2xl bg-white text-black font-bold hover:bg-gray-200 transition-colors flex items-center justify-center gap-1.5"
                >
                  <Send size={15} />
                  <span>Send</span>
                </button>
              </form>
            </div>
          ) : (
            /* Empty State */
            <div className="flex flex-col items-center justify-center flex-1 py-12 text-center select-none">
              <div className="w-16 h-16 rounded-3xl bg-[#ab60f6]/10 flex items-center justify-center text-[#ab60f6] border border-[#ab60f6]/20 mb-6 animate-pulse">
                <MessageSquare size={28} />
              </div>
              <h3 className="text-xl font-extrabold text-white mb-2">Select a Ticket to View Messages</h3>
              <p className="text-gray-500 font-semibold text-sm max-w-sm">Please choose a thread from the list sidebar to correspond directly with our technical support team.</p>
            </div>
          )}
        </motion.div>
      </div>

      {/* New Ticket Overlay Modal */}
      <AnimatePresence>
        {newTicketModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              onClick={() => setNewTicketModal(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-lg bg-[#090d16] border border-white/5 rounded-[2rem] p-6 md:p-8 shadow-2xl z-10 text-left"
            >
              {/* Brand glow */}
              <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-[#5ebdff] to-[#ab60f6]"></div>

              <button 
                onClick={() => setNewTicketModal(false)}
                className="absolute top-6 right-6 text-gray-500 hover:text-white transition-colors p-1 rounded-full bg-white/5"
              >
                <X size={20} />
              </button>
              
              <h2 className="text-2xl font-black text-white mb-2">Create New Support Ticket</h2>
              <p className="text-gray-400 font-semibold text-sm mb-6">Our average ticket response time is under 2 hours.</p>

              <form onSubmit={handleNewTicket} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Inquiry Department / Subject</label>
                  <select 
                    name="subject"
                    className="w-full bg-[#050914] border border-white/5 rounded-2xl px-4 py-3.5 text-white focus:outline-none focus:border-blue-500/30 transition-colors appearance-none cursor-pointer text-left font-semibold"
                  >
                    <option>Campaign Order Pending / Refund Help</option>
                    <option>Wallet Funding & Payment Processor Problem</option>
                    <option>Request Custom Target SMM Service Option</option>
                    <option>Report Technical Bug / Platform Lag</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Message Details</label>
                  <textarea 
                    name="message"
                    required
                    rows={4}
                    placeholder="Provide full order tracking link or transaction id to speed up resolution..."
                    className="w-full bg-[#050914] border border-white/5 rounded-2xl px-4 py-3.5 text-sm text-white focus:outline-none focus:border-blue-500/30 transition-all placeholder-gray-600 text-left resize-none" 
                  />
                </div>

                <button 
                  type="submit"
                  className="w-full py-4 mt-4 rounded-2xl bg-gradient-to-r from-[#5ebdff] to-[#ab60f6] text-black font-extrabold text-md hover:scale-[1.01] transform transition-all duration-200 flex items-center justify-center gap-2 shadow-xl shadow-blue-500/10"
                >
                  <span>Submit Support Ticket</span>
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
