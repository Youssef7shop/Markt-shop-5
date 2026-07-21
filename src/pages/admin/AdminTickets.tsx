import { useState } from 'react';
import { motion } from 'motion/react';
import { MessageSquare, AlertCircle, Clock, ChevronRight } from 'lucide-react';
import { useStoreState, getTickets, addTicketReply, closeTicket, getUsers } from '@/lib/store';

export default function AdminTickets() {
  const tickets = useStoreState(getTickets);
  const usersList = useStoreState(getUsers);

  const [activeTicketId, setActiveTicketId] = useState<string | number | null>(() => {
    return tickets.length > 0 ? tickets[0].id : null;
  });

  const [filterState, setFilterState] = useState('All');
  const [replyText, setReplyText] = useState('');

  // Auto fallback if active ticket got deleted or is invalid
  const activeTicketIdChecked = activeTicketId !== null && tickets.some(t => String(t.id) === String(activeTicketId))
    ? activeTicketId
    : (tickets.length > 0 ? tickets[0].id : null);

  const activeTicket = tickets.find(t => String(t.id) === String(activeTicketIdChecked));
  const activeUserObj = activeTicket ? usersList.find(u => u.username.toLowerCase() === activeTicket.username.toLowerCase()) : null;

  const filteredTickets = tickets.filter(t => {
    if (filterState === 'Open Only') return t.status === 'Open';
    if (filterState === 'Closed Only') return t.status === 'Closed';
    return true;
  });

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !activeTicketIdChecked) return;

    addTicketReply(activeTicketIdChecked, 'admin', replyText.trim());
    setReplyText('');
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-4 h-full flex flex-col text-left">
       <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Support Desk</h1>
          <p className="text-gray-400 font-semibold text-sm">Respond to customer technical questions and account inquiries live.</p>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
            <select 
              value={filterState}
              onChange={(e) => setFilterState(e.target.value)}
              className="bg-[#050914] border border-white/5 rounded-2xl px-4 py-3 text-sm text-gray-300 font-bold focus:outline-none cursor-pointer text-left w-full md:w-auto"
            >
              <option value="All">All Ticket Logs</option>
              <option value="Open Only">Open Only</option>
              <option value="Closed Only">Closed Only</option>
            </select>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 flex-1 min-h-0">
        {/* Ticket List Panel */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="lg:w-1/3 flex flex-col gap-3 overflow-y-auto max-h-[600px] pr-1"
        >
          {filteredTickets.map((t) => (
             <div 
                key={t.id} 
                onClick={() => setActiveTicketId(t.id)}
                className={`p-5 rounded-[2rem] border cursor-pointer transition-all hover:bg-white/5 text-left
                  ${String(t.id) === String(activeTicketIdChecked) 
                    ? 'bg-white/10 border-red-500/40 shadow-[0_0_20px_rgba(239,68,68,0.15)]' 
                    : 'bg-[#090d16] border-white/5'}
                `}
              >
               <div className="flex justify-between items-start mb-2">
                 <span className="font-mono text-xs text-gray-500 font-bold">#TICKET-{t.id}</span>
                 <span className={`text-[10px] uppercase font-black tracking-widest px-2.5 py-0.5 rounded-lg
                   ${t.status === 'Open' ? 'bg-red-500/10 text-red-500' : t.status === 'Closed' ? 'bg-gray-500/10 text-gray-400' : 'bg-[#5ebdff]/10 text-[#5ebdff]'}
                 `}>
                   {t.status}
                 </span>
               </div>
               <h4 className="font-bold text-white text-md mb-1 leading-snug truncate">{t.subject}</h4>
               <div className="flex justify-between items-center text-xs mt-3 text-gray-400">
                 <span className="flex items-center gap-1 font-bold text-gray-300">@{t.username}</span>
                 <span className="flex items-center gap-1 font-mono">{t.date}</span>
               </div>
             </div>
          ))}
          {filteredTickets.length === 0 && (
            <div className="p-8 text-center text-gray-500 font-bold bg-[#090d16] border border-white/5 rounded-[2rem]">
              No tickets matched the current query.
            </div>
          )}
        </motion.div>

        {/* Selected Ticket Conversation Panel */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="lg:w-2/3 bg-[#090d16] border border-white/5 rounded-[2.2rem] flex flex-col h-[600px] overflow-hidden"
        >
          {activeTicket ? (
            <>
              {/* Ticket Header Actions */}
              <div className="p-5 border-b border-white/5 flex justify-between items-center bg-white/[0.01]">
                <div>
                   <h3 className="font-black text-white text-md flex items-center gap-2">
                     #TICKET-{activeTicket.id} - {activeTicket.subject}
                     <span className={`text-[10px] px-2.5 py-1 rounded-full font-black ${activeTicket.status === 'Open' ? 'bg-red-500/10 text-red-500' : activeTicket.status === 'Closed' ? 'bg-gray-500/20 text-gray-400' : 'bg-[#5ebdff]/15 text-[#5ebdff]'}`}>
                       {activeTicket.status.toUpperCase()}
                     </span>
                   </h3>
                   <div className="text-xs text-gray-500 mt-1 font-semibold">User: <span className="text-white font-bold">@{activeTicket.username}</span> {activeUserObj && ` • Spent: $${activeUserObj.spent.toFixed(2)}`}</div>
                </div>
                {activeTicket.status !== 'Closed' && (
                  <button 
                    onClick={() => closeTicket(activeTicket.id)}
                    className="px-4 py-2 text-xs bg-white/5 hover:bg-white/10 rounded-2xl text-red-400 border border-white/5 hover:border-red-500/20 font-bold transition-all cursor-pointer"
                  >
                    Close Ticket
                  </button>
                )}
              </div>

              {/* Chat Messages Body */}
              <div className="flex-1 p-6 overflow-y-auto flex flex-col gap-6">
                {activeTicket.messages.map((msg, idx) => (
                  <div key={idx} className="flex gap-4">
                     <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black shrink-0 ${msg.sender === 'user' ? 'bg-[#5ebdff]/10 text-[#5ebdff] border border-[#5ebdff]/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                       {msg.sender === 'user' ? 'U' : 'A'}
                     </div>
                     <div className="flex-1">
                       <div className="flex items-center gap-2 mb-1">
                         <span className="font-extrabold text-[#ffffff] text-sm">{msg.sender === 'user' ? `@${activeTicket.username}` : 'Administrator'}</span>
                         <span className="text-[10px] text-gray-500 font-bold font-mono">{msg.time}</span>
                       </div>
                       <div className={`p-4 rounded-3xl rounded-tl-none border text-sm leading-relaxed text-left ${msg.sender === 'user' ? 'bg-white/[0.01] border-white/5 text-gray-300' : 'bg-red-500/[0.02] border-red-500/10 text-red-100'}`}>
                         {msg.text}
                       </div>
                     </div>
                  </div>
                ))}
              </div>

              {/* Ticket Input Fields Footer */}
              <form onSubmit={handleSendReply} className="p-5 border-t border-white/5 bg-[#050914]">
                <textarea 
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  disabled={activeTicket.status === 'Closed'}
                  placeholder={activeTicket.status === 'Closed' ? 'This support ticket is closed and archived.' : 'Write an official helper response...'} 
                  className="w-full bg-[#090d16] border border-white/5 p-4 rounded-2xl text-white text-sm focus:outline-none focus:border-red-500/30 min-h-[100px] resize-none mb-3"
                ></textarea>
                <div className="flex justify-between items-center">
                  <div className="text-xs text-gray-500 font-semibold">User will receive a panel notification instantly.</div>
                  <button 
                    type="submit"
                    disabled={activeTicket.status === 'Closed' || !replyText.trim()}
                    className="px-6 py-2.5 bg-gradient-to-r from-red-500 to-orange-500 disabled:from-gray-800 disabled:to-gray-900 text-white font-extrabold rounded-2xl text-xs hover:opacity-95 transform transition transition duration-200 cursor-any shadow-lg shadow-orange-500/10 disabled:shadow-none"
                  >
                    Send Reply
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-500 font-bold py-16">
              <MessageSquare size={36} className="text-gray-600 mb-2" />
              <span>Select an inquiry ticket from the sidebar to inspect conversation details.</span>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
