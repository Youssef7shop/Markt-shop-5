import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowRight, Zap, Shield, HeadphonesIcon, TrendingUp, Star, Sparkles, Box } from 'lucide-react';
import { useStoreState, getServices } from '@/lib/store';
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';

export default function Landing() {
  const services = useStoreState(getServices);
  const { t, i18n } = useTranslation();

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const lang = e.target.value;
    i18n.changeLanguage(lang);
  };

  useEffect(() => {
    document.documentElement.dir = i18n.language?.startsWith('ar') ? 'rtl' : 'ltr';
  }, [i18n.language]);

  return (
    <div className="min-h-screen bg-dark-bg text-white overflow-hidden relative">
      {/* Background Glow */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-[#3b82f6]/20 blur-[150px]" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-[#5ebdff]/20 blur-[150px]" />

      {/* Navbar */}
      <nav className="relative z-10 flex items-center justify-between py-6 px-6 md:px-12 max-w-7xl mx-auto border-b border-white/5 bg-[#030712]/40 backdrop-blur-md rounded-2xl mt-4">
        <div className="flex items-center gap-8">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#ab60f6] to-[#5ebdff] flex items-center justify-center p-2 shadow-[0_0_20px_rgba(171,96,246,0.3)] transition-transform group-hover:scale-105 duration-200">
              <Zap className="text-white fill-white w-5 h-5" />
            </div>
            <span className="font-extrabold text-2xl tracking-tight text-white">
              Boost<span className="text-[#ab60f6]">Panel</span>
            </span>
          </Link>

          {/* Center Links */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-white font-semibold text-sm hover:text-[#5ebdff] transition-colors">
              {t('landing.home')}
            </Link>
            <Link to="/panel/services" className="text-gray-400 font-semibold text-sm hover:text-white transition-colors">
              {t('landing.services')}
            </Link>
            <Link to="/panel/support" className="text-gray-400 font-semibold text-sm hover:text-white transition-colors">
              {t('landing.support')}
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-6">
          {/* Language Selector */}
          <div className="hidden sm:flex items-center gap-1.5 border border-white/10 rounded-xl px-2 py-1 bg-[#050914]/50 hover:bg-[#050914] transition-colors cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
            </svg>
            <select 
              value={i18n.language?.split('-')[0] || 'en'}
              onChange={handleLanguageChange}
              className="bg-transparent text-xs font-semibold text-gray-300 focus:outline-none cursor-pointer appearance-none outline-none border-none"
            >
              <option value="en" className="bg-[#050914] text-white">English</option>
              <option value="ar" className="bg-[#050914] text-white">العربية</option>
              <option value="fr" className="bg-[#050914] text-white">Français</option>
              <option value="es" className="bg-[#050914] text-white">Español</option>
            </select>
          </div>

          {/* Admin Sign in with Shield */}
          <Link 
            to="/admin/login" 
            className="text-[#00ff66] hover:text-[#00ff66]/80 font-semibold text-sm transition-colors flex items-center gap-1.5"
          >
            <Shield size={16} className="text-[#00ff66]" />
            <span>{t('landing.adminSignIn')}</span>
          </Link>

          {/* Sign In Link */}
          <Link 
            to="/login" 
            className="text-white font-semibold text-sm hover:text-gray-300 transition-colors hidden sm:block"
          >
            {t('landing.signIn')}
          </Link>

          {/* Gradient Get started Button */}
          <Link 
            to="/login" 
            className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-[#5ebdff] to-[#ab60f6] text-black font-extrabold text-sm hover:scale-[1.03] transition-all shadow-[0_0_20px_rgba(94,189,255,0.15)]"
          >
            {t('landing.getStarted')}
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 flex flex-col items-center justify-center pt-24 pb-32 px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#0a0f1d] border border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.1)] mb-8"
        >
          <Sparkles size={16} className="text-[#5ebdff]" />
          <span className="text-sm font-semibold text-[#8da6cc]">{t('landing.trustedBy')}</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-5xl md:text-7xl font-bold tracking-tighter mb-6 max-w-4xl leading-tight"
        >
          {t('landing.supercharge')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#5ebdff] to-[#ab60f6]">{t('landing.socialPresence')}</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg md:text-xl text-gray-400 mb-10 max-w-2xl"
        >
          {t('landing.heroDesc')}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center gap-4"
        >
          <Link 
            to="/login" 
            className="px-8 py-4.5 rounded-2xl bg-gradient-to-r from-[#5ebdff] to-[#ab60f6] text-black font-extrabold text-lg hover:scale-[1.02] transform transition-all shadow-[0_0_25px_rgba(94,189,255,0.25)] flex items-center gap-2"
          >
            <span>{t('landing.startGrowing')}</span>
            <ArrowRight size={20} className="stroke-[3] rtl:rotate-180" />
          </Link>
          <Link 
            to="/panel/services" 
            className="px-8 py-4.5 rounded-2xl bg-[#090d16]/80 border border-white/10 text-white font-extrabold text-lg hover:bg-white/5 transition-all"
          >
            {t('landing.browseServices')}
          </Link>
        </motion.div>

        {/* Social Platforms badge pills row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-wrap justify-center items-center gap-3 mt-12 mb-16"
        >
          <div className="flex items-center gap-2 px-4 py-2 border border-white/5 bg-[#050914]/60 rounded-full text-sm font-semibold text-[#8da6cc] hover:border-white/10 transition-colors">
            <svg className="w-4 h-4 text-pink-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
            </svg>
            <span>Instagram</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 border border-white/5 bg-[#050914]/60 rounded-full text-sm font-semibold text-[#8da6cc] hover:border-white/10 transition-colors">
            <svg className="w-4 h-4 text-[#00f3ff]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12.525.02c1.31 0 2.594.316 3.75.923.045.247.16.475.334.654.492.51 1.127.844 1.83.963V5.55c-1.11-.053-2.176-.46-3.058-1.168V14.5c0 4.142-3.358 7.5-7.5 7.5s-7.5-3.358-7.5-7.5 3.358-7.5 7.5-7.5c.448 0 .886.04 1.313.115v3.136c-.417-.152-.862-.234-1.313-.234-2.43 0-4.4 1.97-4.4 4.4s1.97 4.4 4.4 4.4 4.4-1.97 4.4-4.4V0h3.654z"/>
            </svg>
            <span>TikTok</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 border border-white/5 bg-[#050914]/60 rounded-full text-sm font-semibold text-[#8da6cc] hover:border-white/10 transition-colors">
            <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M23.498 6.163a3.003 3.003 0 00-2.11-2.107C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.388.511a3.003 3.003 0 00-2.11 2.107C0 8.046 0 12 0 12s0 3.954.502 5.837a3.003 3.003 0 002.11 2.107c1.883.511 9.388.511 9.388.511s7.505 0 9.388-.511a3.003 3.003 0 002.11-2.107c.502-1.883.502-5.837.502-5.837s0-3.954-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
            </svg>
            <span>YouTube</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 border border-white/5 bg-[#050914]/60 rounded-full text-sm font-semibold text-[#8da6cc] hover:border-white/10 transition-colors">
            <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z"/>
            </svg>
            <span>Facebook</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 border border-white/5 bg-[#050914]/60 rounded-full text-sm font-semibold text-[#8da6cc] hover:border-white/10 transition-colors">
            <svg className="w-4 h-4 text-[#5ebdff]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
            <span>Telegram</span>
          </div>
        </motion.div>

        {/* Features / Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-6xl mx-auto mt-8 mb-32">
          {/* Card 1 - 2.4M+ */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="p-8 rounded-[2rem] bg-[#050914]/80 border border-white/5 flex flex-col justify-center items-center h-52 text-center relative overflow-hidden group hover:border-[#ab60f6]/30 transition-all duration-300"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-[#ab60f6]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            <div className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#ab60f6] to-[#5ebdff] mb-2.5 tracking-tight">2.4M+</div>
            <div className="text-sm font-semibold text-gray-400">{t('landing.ordersCompleted')}</div>
          </motion.div>

          {/* Card 2 - 150K+ */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="p-8 rounded-[2rem] bg-[#050914]/80 border border-white/5 flex flex-col justify-center items-center h-52 text-center relative overflow-hidden group hover:border-[#5ebdff]/30 transition-all duration-300"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-[#5ebdff]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            <div className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#5ebdff] to-[#ab60f6] mb-2.5 tracking-tight">150K+</div>
            <div className="text-sm font-semibold text-gray-400">{t('landing.happyCustomers')}</div>
          </motion.div>

          {/* Card 3 - 99.9% */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="p-8 rounded-[2rem] bg-[#050914]/80 border border-white/5 flex flex-col justify-center items-center h-52 text-center relative overflow-hidden group hover:border-[#ab60f6]/30 transition-all duration-300"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-[#ab60f6]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            <div className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#ab60f6] to-[#5ebdff] mb-2.5 tracking-tight">99.9%</div>
            <div className="text-sm font-semibold text-gray-400">{t('landing.uptime')}</div>
          </motion.div>

          {/* Card 4 - < 30s */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="p-8 rounded-[2rem] bg-[#050914]/80 border border-white/5 flex flex-col justify-center items-center h-52 text-center relative overflow-hidden group hover:border-[#5ebdff]/30 transition-all duration-300"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-[#5ebdff]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            <div className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#5ebdff] to-[#ab60f6] mb-2.5 tracking-tight">&lt; 30s</div>
            <div className="text-sm font-semibold text-gray-400">{t('landing.avgStartTime')}</div>
          </motion.div>
        </div>

        {/* Public Services Display */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-6xl mx-auto px-4 mt-8 mb-24 relative z-10"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-extrabold mb-4 tracking-tight text-white">
              {t('landing.publicCatalog')}
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              {t('landing.exploreCatalog')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.slice(0, 6).map((service, idx) => (
              <motion.div 
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="bg-[#050914] border border-white/5 rounded-3xl overflow-hidden hover:border-[#5ebdff]/30 transition-all duration-300 group"
              >
                {/* Product Image Placeholder (if any) */}
                {service.image ? (
                  <div className="h-48 w-full bg-[#0a0f1d] overflow-hidden">
                    <img src={service.image} alt={service.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                ) : (
                  <div className="h-48 w-full bg-gradient-to-br from-[#0a0f1d] to-[#050914] flex items-center justify-center border-b border-white/5">
                    <Box size={40} className="text-gray-600" />
                  </div>
                )}
                
                <div className="p-6 text-left">
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-3 py-1 bg-white/5 rounded-full text-xs font-mono text-[#5ebdff] font-bold">
                      {service.platform || service.category}
                    </span>
                    {service.discount && (
                      <span className="px-2 py-1 bg-red-500/10 text-red-400 text-xs font-bold rounded-lg uppercase">
                        {service.discount}
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2 line-clamp-2 leading-snug">{service.name}</h3>
                  {service.description && (
                    <p className="text-sm text-gray-400 mb-4 line-clamp-2">{service.description}</p>
                  )}
                  
                  <div className="flex items-end justify-between mt-6">
                    <div>
                      <span className="block text-xs font-bold text-gray-500 mb-1">{t('landing.pricePer1k')}</span>
                      <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">${Number(service.price).toFixed(2)}</span>
                    </div>
                    <Link 
                      to="/login"
                      className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-xl text-sm font-bold transition-colors"
                    >
                      {t('landing.orderNow')}
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          
          {services.length > 6 && (
            <div className="text-center mt-12">
              <Link 
                to="/login" 
                className="inline-flex px-8 py-4 rounded-2xl bg-[#090d16]/80 border border-white/10 text-white font-extrabold text-sm hover:bg-white/5 transition-all"
              >
                {t('landing.viewFullCatalog')} ({services.length} services)
              </Link>
            </div>
          )}
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="w-full max-w-4xl mx-auto px-4 mt-16 mb-24 relative z-10"
        >
          {/* Card container */}
          <div className="relative w-full p-12 md:p-16 rounded-[2.5rem] bg-[#090d16] border border-white/5 overflow-hidden flex flex-col items-center justify-center text-center shadow-2xl">
            {/* Soft inner radial gradient glow */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(59,130,246,0.12),transparent_60%)] pointer-events-none" />

            {/* Five Glowing Stars */}
            <div className="flex gap-1.5 justify-center mb-6">
              {[...Array(5)].map((_, idx) => (
                <Star 
                  key={idx} 
                  className="w-5 h-5 fill-[#5ebdff] text-[#5ebdff] drop-shadow-[0_0_8px_rgba(94,189,255,0.7)]" 
                />
              ))}
            </div>

            {/* Headings */}
            <h2 className="text-4xl md:text-5xl font-extrabold mb-5 tracking-tight text-white leading-tight">
              {t('landing.readyTo')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2cc4ff] to-[#bd39ff] drop-shadow-[0_0_15px_rgba(44,196,255,0.25)]">{t('landing.goViral')}</span>
            </h2>

            {/* Subtitle */}
            <p className="text-gray-400 text-base md:text-lg mb-10 max-w-xl leading-relaxed">
              {t('landing.joinCreators')}
            </p>

            {/* Action Button */}
            <div className="relative group">
              {/* Soft reflection neon glow behind button */}
              <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-[#5ebdff] to-[#a855f7] opacity-60 blur-xl group-hover:opacity-85 transition-opacity duration-300" />
              
              <Link 
                to="/login" 
                className="relative flex items-center justify-center px-10 py-4.5 rounded-2xl bg-gradient-to-r from-[#5ebdff] to-[#ab60f6] text-black font-extrabold text-lg hover:scale-[1.02] transform transition-all duration-200"
              >
                {t('landing.createFreeAccount')}
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Footer */}
        <footer className="text-center py-8 text-sm text-gray-500 font-mono tracking-wider relative z-10 mb-8 border-t border-white/5 w-full max-w-6xl mx-auto">
          © {new Date().getFullYear()} DarkBoost. {t('landing.allRightsReserved')}
        </footer>
      </main>
    </div>
  );
}
