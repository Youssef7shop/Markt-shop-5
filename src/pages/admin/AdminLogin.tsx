import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Shield } from 'lucide-react';
import { useState } from 'react';
import { setCurrentUser, getUsers } from '@/lib/store';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const users = getUsers();
    const admin = users.find(u => u.email === email && u.role === 'Admin');
    
    if (admin) {
      if (password === 'admin123') { // Simple hardcoded password check
        setCurrentUser(admin.username);
        navigate('/admin/dashboard');
      } else {
        setError('Invalid password');
      }
    } else {
      setError('Admin not found with this email');
    }
  };

  return (
    <div className="min-h-screen bg-[#02050e] text-white flex items-center justify-center p-4 relative overflow-hidden">
      {/* Subtle bottom-right background glow */}
      <div className="absolute -bottom-1/4 -right-1/4 w-[60%] h-[60%] rounded-full bg-gradient-to-tr from-[#7c3aed]/10 to-[#3b82f6]/10 blur-[120px] pointer-events-none" />

      <motion.div
        layout
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-[440px] bg-[#05070f] border border-white/[0.04] rounded-3xl p-8 md:p-10 relative z-10 shadow-2xl"
      >
        <div className="text-left mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 text-[#5ebdff] flex items-center justify-center">
              <Shield size={20} className="stroke-[2.5]" />
            </div>
            <h2 className="text-3xl font-black text-white leading-tight">Admin Sign in</h2>
          </div>
          <p className="text-gray-400 text-[14px] font-medium leading-normal">
            Restricted area. Administrator credentials only.
          </p>
        </div>

        <form className="space-y-5" onSubmit={handleLogin}>
          {error && <div className="text-red-500 text-sm font-semibold">{error}</div>}
          <div className="text-left">
            <label className="block text-sm font-bold text-[#e2e8f0] mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full bg-[#090b14] border border-white/[0.06] rounded-xl px-4 py-3.5 text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500/40 transition-colors text-left"
              required
            />
          </div>

          <div className="text-left">
            <label className="block text-sm font-bold text-[#e2e8f0] mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-[#090b14] border border-white/[0.06] rounded-xl px-4 py-3.5 text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500/40 transition-colors text-left"
              required
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-4 rounded-xl bg-gradient-to-r from-[#5ebdff] to-[#ab60f6] text-black font-black text-center flex items-center justify-center hover:scale-[1.01] transform transition-all duration-200 shadow-xl shadow-blue-500/10 cursor-pointer text-[15px]"
            >
              Sign in as Admin
            </button>
          </div>
        </form>

        <div className="mt-6 text-center text-sm font-semibold text-gray-400">
          Not an admin?{' '}
          <Link to="/login" className="text-[#5ebdff] hover:underline cursor-pointer">
            User sign in
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
