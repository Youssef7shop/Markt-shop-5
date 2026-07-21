import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Shield } from 'lucide-react';
import { useState } from 'react';
import { auth, provider, signInWithPopup } from '@/lib/firebase';
import { addUser, getUsers, setCurrentUser } from '@/lib/store';

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    try {
      setErrorMsg('');
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      const userEmail = user.email || '';
      const username = user.displayName || userEmail.split('@')[0];
      
      const users = getUsers();
      const existingUser = users.find(u => u.email === userEmail);
      
      const role = userEmail === 'haitamraiss71@gmail.com' ? 'Admin' : 'User';

      if (!existingUser) {
        addUser(username, userEmail, 0, role);
      } else if (userEmail === 'haitamraiss71@gmail.com' && existingUser.role !== 'Admin') {
        const u = users.find(u => u.email === userEmail);
        if (u) u.role = 'Admin';
      }
      
      setCurrentUser(existingUser ? existingUser.username : username);
      if (role === 'Admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/panel');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      setErrorMsg(error.message || 'Google Login failed. Please try Email instead.');
    }
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    const users = getUsers();
    const existingUser = users.find(u => u.email === email);

    if (isLogin) {
      if (existingUser) {
        setCurrentUser(existingUser.username);
        if (existingUser.role === 'Admin') {
          navigate('/admin/dashboard');
        } else {
          navigate('/panel');
        }
      } else {
        setErrorMsg('User not found. Please sign up.');
      }
    } else {
      const role = email === 'haitamraiss71@gmail.com' ? 'Admin' : 'User';
      if (!existingUser) {
        addUser(name, email, 0, role);
      }
      setCurrentUser(existingUser ? existingUser.username : name);
      if (role === 'Admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/panel');
      }
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
          <h2 className="text-3xl font-black text-white mb-2 leading-tight">
            {isLogin ? 'Welcome back' : 'Create your account'}
          </h2>
          <p className="text-gray-400 text-[14px] font-medium leading-normal">
            {isLogin ? 'Sign in to your BoostPanel account' : 'Start growing your social presence today'}
          </p>
        </div>

        <div className="flex justify-center mb-6">
          <button 
            type="button" 
            onClick={handleGoogleSignIn}
            className="w-full bg-white text-gray-800 font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-3 hover:bg-gray-100 transition-colors shadow-sm"
          >
            <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-5 h-5">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
              <path fill="none" d="M0 0h48v48H0z"></path>
            </svg>
            Continue with Google
          </button>
        </div>

        <div className="relative flex py-5 items-center">
          <div className="flex-grow border-t border-white/[0.06]"></div>
          <span className="flex-shrink-0 mx-4 text-gray-500 text-sm">or continue with email</span>
          <div className="flex-grow border-t border-white/[0.06]"></div>
        </div>

        <form className="space-y-5" onSubmit={handleEmailSubmit}>
          {errorMsg && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl text-sm font-semibold">
              {errorMsg}
            </div>
          )}
          {!isLogin && (
            <div className="text-left">
              <label className="block text-sm font-bold text-[#e2e8f0] mb-2">Display name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="w-full bg-[#090b14] border border-white/[0.06] rounded-xl px-4 py-3.5 text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500/40 transition-colors text-left"
              />
            </div>
          )}

          <div className="text-left">
            <label className="block text-sm font-bold text-[#e2e8f0] mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full bg-[#090b14] border border-white/[0.06] rounded-xl px-4 py-3.5 text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500/40 transition-colors text-left"
            />
          </div>

          <div className="text-left">
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-bold text-[#e2e8f0]">Password</label>
            </div>
            <input
              type="password"
              placeholder={isLogin ? '••••••••' : 'At least 6 characters'}
              className="w-full bg-[#090b14] border border-white/[0.06] rounded-xl px-4 py-3.5 text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500/40 transition-colors text-left"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-4 rounded-xl bg-gradient-to-r from-[#5ebdff] to-[#ab60f6] text-black font-black text-center flex items-center justify-center hover:scale-[1.01] transform transition-all duration-200 shadow-xl shadow-blue-500/10 cursor-pointer text-[15px]"
            >
              {isLogin ? 'Sign in' : 'Create account'}
            </button>
          </div>
        </form>

        <div className="mt-6 text-center text-sm font-semibold text-gray-400">
          {isLogin ? (
            <>
              Don't have an account?{' '}
              <button onClick={() => setIsLogin(false)} className="text-[#5ebdff] hover:underline cursor-pointer">
                Sign up
              </button>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <button onClick={() => setIsLogin(true)} className="text-[#5ebdff] hover:underline cursor-pointer">
                Sign in
              </button>
            </>
          )}
        </div>

        {isLogin && (
          <div className="mt-4 flex justify-center border-t border-white/[0.04] pt-4">
            <Link
              to="/admin/login"
              className="flex items-center gap-1.5 text-[#5ebdff] hover:text-[#5ebdff]/80 text-[14px] font-bold transition-all"
            >
              <Shield size={15} />
              <span>Admin sign in</span>
            </Link>
          </div>
        )}
      </motion.div>
    </div>
  );
}
