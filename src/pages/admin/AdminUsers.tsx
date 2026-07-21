import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, ShieldAlert, Edit, Trash, Ban, Plus, X, Check, Landmark } from 'lucide-react';
import { useStoreState, getUsers, addUser, updateUserBalance, toggleUserStatus, deleteUser } from '@/lib/store';

export default function AdminUsers() {
  const users = useStoreState(getUsers);
  const [search, setSearch] = useState('');
  
  // Modals state
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditBalanceOpen, setIsEditBalanceOpen] = useState(false);
  const [selectedUsername, setSelectedUsername] = useState('');
  
  // New User Form fields
  const [newUsername, setNewUsername] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newBalance, setNewBalance] = useState('0');
  const [newRole, setNewRole] = useState<'User' | 'Reseller' | 'Admin'>('User');
  const [addError, setAddError] = useState('');

  // Edit Balance fields
  const [editBalanceVal, setEditBalanceVal] = useState('0');

  const filteredUsers = users.filter(u => 
    u.username.toLowerCase().includes(search.toLowerCase()) || 
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    setAddError('');

    if (!newUsername || !newEmail) {
      setAddError('Username and email are required');
      return;
    }

    if (users.some(u => u.username.toLowerCase() === newUsername.trim().toLowerCase())) {
      setAddError('Username is already taken');
      return;
    }

    addUser(
      newUsername.trim(),
      newEmail.trim(),
      parseFloat(newBalance) || 0,
      newRole
    );

    // Reset fields
    setNewUsername('');
    setNewEmail('');
    setNewBalance('0');
    setNewRole('User');
    setIsAddOpen(false);
  };

  const handleEditBalanceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserBalance(selectedUsername, parseFloat(editBalanceVal) || 0);
    setIsEditBalanceOpen(false);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-4">
      {/* Header Container */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4 text-left">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Users Management</h1>
          <p className="text-gray-400 font-semibold text-sm">Manage clients, balances, and permissions instantly.</p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
            <input 
              type="text" 
              placeholder="Search users..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#050914] border border-white/5 rounded-2xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-red-500/40 transition-colors text-left" 
            />
          </div>
          <button 
            onClick={() => {
              setAddError('');
              setIsAddOpen(true);
            }}
            className="px-5 py-2.5 bg-gradient-to-r from-red-500 to-orange-500 text-white font-extrabold rounded-2xl text-sm hover:opacity-90 flex items-center justify-center gap-1.5 cursor-pointer shadow-lg shadow-red-500/10"
          >
            <Plus size={16} />
            <span>Add New User</span>
          </button>
        </div>
      </div>

      {/* Main Table View */}
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
                <th className="py-4 px-6 font-bold text-left">User</th>
                <th className="py-4 px-6 font-bold text-left">Role</th>
                <th className="py-4 px-6 font-bold text-right">Balance</th>
                <th className="py-4 px-6 font-bold text-right">Spent</th>
                <th className="py-4 px-6 font-bold text-center">Status</th>
                <th className="py-4 px-6 font-bold text-left">Joined</th>
                <th className="py-4 px-6 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-white/5 transition-colors group">
                  <td className="py-4 px-6 text-left">
                    <div className="flex flex-col">
                      <span className="font-bold text-white text-md">@{user.username}</span>
                      <span className="text-xs text-gray-500 font-mono mt-0.5">{user.email}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-left">
                    <span className={`px-2.5 py-0.5 rounded-lg text-xs font-black tracking-wide border ${user.role === 'Admin' ? 'border-red-500/30 text-red-400 bg-red-500/10' : user.role === 'Reseller' ? 'border-purple-500/30 text-purple-400 bg-purple-500/10' : 'border-gray-500/30 text-gray-400 bg-gray-500/10'}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right font-mono font-bold text-blue-400">${user.balance.toFixed(2)}</td>
                  <td className="py-4 px-6 text-right font-mono text-gray-300">${user.spent.toFixed(2)}</td>
                  <td className="py-4 px-6 text-center">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold tracking-wider uppercase ${user.status === 'Active' ? 'bg-[#5ebdff]/10 text-[#5ebdff] border border-[#5ebdff]/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'}`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-400 font-semibold font-mono text-left">{user.joined}</td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex justify-end gap-2 hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => {
                          setSelectedUsername(user.username);
                          setEditBalanceVal(String(user.balance));
                          setIsEditBalanceOpen(true);
                        }}
                        className="p-2 text-gray-400 hover:text-white rounded-xl bg-white/5 hover:bg-white/15 transition-all cursor-pointer" 
                        title="Edit Balance"
                      >
                        <Landmark size={14} />
                      </button>
                      <button 
                        onClick={() => toggleUserStatus(user.username)}
                        className={`p-2 text-gray-400 rounded-xl bg-white/5 hover:bg-white/15 transition-all cursor-pointer ${user.status === 'Active' ? 'hover:text-orange-400' : 'hover:text-green-400'}`} 
                        title={user.status === 'Active' ? 'Ban Client' : 'Unban Client'}
                      >
                        <Ban size={14} />
                      </button>
                      <button 
                        onClick={() => {
                          if (confirm(`Are you absolutely sure you want to delete @${user.username}?`)) {
                            deleteUser(user.username);
                          }
                        }}
                        className="p-2 text-gray-400 hover:text-red-500 rounded-xl bg-white/5 hover:bg-red-500/10 transition-all cursor-pointer" 
                        title="Delete User Account"
                      >
                        <Trash size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-gray-500 font-bold">
                    No clients matched the current query.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Add User Modal */}
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
              className="relative w-full max-w-md bg-[#090d16] border border-white/5 rounded-[2rem] p-6 md:p-8 shadow-2xl z-20 text-left overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 to-orange-500" />
              <div className="flex items-center justify-between xl:items-start mb-6">
                <div>
                  <h3 className="text-xl font-bold text-white tracking-tight">Add New Client Account</h3>
                  <p className="text-xs text-gray-500 mt-1">Provide username, role standing, and balance limits.</p>
                </div>
                <button 
                  onClick={() => setIsAddOpen(false)}
                  className="p-1.5 rounded-full bg-white/5 text-gray-400 hover:text-white transition-colors cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleCreateUser} className="space-y-4">
                {addError && (
                  <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-xs font-semibold">
                    {addError}
                  </div>
                )}
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Username</label>
                  <input 
                    type="text" 
                    required
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value.replace(/\s+/g, ''))}
                    placeholder="e.g. client_99"
                    className="w-full bg-[#050914] border border-white/5 rounded-2xl px-4 py-3 text-sm text-white focus:outline-none focus:border-red-500/30 text-left"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Email Address</label>
                  <input 
                    type="email" 
                    required
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="e.g. test@social.com"
                    className="w-full bg-[#050914] border border-white/5 rounded-2xl px-4 py-3 text-sm text-white focus:outline-none focus:border-red-500/30 text-left"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Initial Balance ($)</label>
                    <input 
                      type="number" 
                      step="0.01"
                      required
                      value={newBalance}
                      onChange={(e) => setNewBalance(e.target.value)}
                      placeholder="e.g. 100"
                      className="w-full bg-[#050914] border border-white/5 rounded-2xl px-4 py-3 text-sm font-semibold font-mono text-white focus:outline-none focus:border-red-500/30"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Role Status</label>
                    <select
                      value={newRole}
                      onChange={(e: any) => setNewRole(e.target.value)}
                      className="w-full bg-[#050914] border border-white/5 rounded-2xl px-4 py-3 text-sm text-white font-bold focus:outline-none focus:border-red-500/30 cursor-pointer text-left"
                    >
                      <option value="User">Regular User</option>
                      <option value="Reseller">Reseller VIP</option>
                      <option value="Admin">Administrator</option>
                    </select>
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    className="w-full py-4 bg-gradient-to-r from-red-500 to-orange-500 text-white font-extrabold text-sm rounded-2xl hover:opacity-95 transform transition duration-200 cursor-pointer shadow-lg shadow-orange-500/15"
                  >
                    Create Client Profile
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit Balance Modal */}
      <AnimatePresence>
        {isEditBalanceOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/85 backdrop-blur-sm"
              onClick={() => setIsEditBalanceOpen(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-md bg-[#090d16] border border-white/5 rounded-[2rem] p-6 md:p-8 shadow-2xl z-20 text-left overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 to-orange-500" />
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold text-white tracking-tight">Adjust Client Wallet</h3>
                  <p className="text-xs text-gray-500 mt-1">Configuring balance for customer: <b>@{selectedUsername}</b></p>
                </div>
                <button 
                  onClick={() => setIsEditBalanceOpen(false)}
                  className="p-1.5 rounded-full bg-white/5 text-gray-400 hover:text-white transition-colors cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleEditBalanceSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Adjust Balance ($)</label>
                  <input 
                    type="number" 
                    step="0.01"
                    required
                    value={editBalanceVal}
                    onChange={(e) => setEditBalanceVal(e.target.value)}
                    placeholder="e.g. 500"
                    className="w-full bg-[#050914] border border-white/5 rounded-2xl px-4 py-3 text-sm font-semibold font-mono text-white focus:outline-none focus:border-red-500/30"
                  />
                </div>

                <div className="pt-4 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setIsEditBalanceOpen(false)}
                    className="flex-1 py-3.5 border border-white/5 text-gray-400 hover:text-white rounded-2xl hover:bg-white/5 cursor-pointer text-sm font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3.5 bg-gradient-to-r from-red-500 to-orange-500 text-white font-extrabold text-sm rounded-2xl hover:opacity-95 transform transition duration-200 cursor-pointer shadow-lg"
                  >
                    Apply Changes
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
