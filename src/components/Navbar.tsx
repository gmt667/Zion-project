import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Building2, HardHat, Phone, Mail, MapPin, Menu, X, 
  Lock, LayoutDashboard, ChevronDown, MessageSquare, AlertTriangle,
  Sun, Moon
} from 'lucide-react';
import Logo from './Logo';
import { CompanyInfo, User } from '../types';

interface NavbarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  companyInfo: CompanyInfo | null;
  adminUser: User | null;
  onLogout: () => void;
}

export default function Navbar({ currentView, onNavigate, companyInfo, adminUser, onLogout }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDark, setIsDark] = useState(() => {
    const stored = localStorage.getItem('theme');
    if (stored) return stored === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: 'Home', view: 'home' },
    { label: 'About', view: 'about' },
    { label: 'Services', view: 'services' },
    { label: 'Projects', view: 'projects' },
    { label: 'Gallery', view: 'gallery' },
    { label: 'Compliance', view: 'downloads' },
    { label: 'Careers', view: 'careers' },
    { label: 'News & Blog', view: 'blog' },
    { label: 'FAQ', view: 'faq' },
    { label: 'Contact', view: 'contact' }
  ];

  const handleNavClick = (view: string) => {
    onNavigate(view);
    setIsOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="w-full flex flex-col z-50" style={{ transition: 'background 0.3s ease' }}>
      {/* Top Contact Strip */}
      <div className="w-full bg-primary dark:bg-[#061428] text-gray-300 dark:text-gray-400 text-xs py-2 px-4 md:px-8 flex flex-col sm:flex-row justify-between items-center gap-2 border-b border-white/10">
        <div className="flex flex-wrap justify-center sm:justify-start items-center gap-4">
          <a href={`tel:${companyInfo?.phone || '+265997914840'}`} className="flex items-center gap-1.5 hover:text-secondary transition-colors">
            <Phone size={13} className="text-secondary" />
            <span>
              {companyInfo?.phone 
                ? (companyInfo.phoneAlternative ? `${companyInfo.phone} / ${companyInfo.phoneAlternative}` : companyInfo.phone)
                : '+265 997 914 840 / +265 992 847 803'
              }
            </span>
          </a>
          <a href={`mailto:${companyInfo?.email || 'Zionprojectsltd265@gmail.com'}`} className="flex items-center gap-1.5 hover:text-secondary transition-colors">
            <Mail size={13} className="text-secondary" />
            <span>{companyInfo?.email || 'Zionprojectsltd265@gmail.com'}</span>
          </a>
          <span className="hidden lg:flex items-center gap-1.5 text-gray-400">
            <MapPin size={13} />
            <span>{companyInfo?.address || 'Zion House, Plot 47/3, Area 14, Lilongwe, Malawi'}</span>
          </span>
        </div>
        
        <div className="flex items-center gap-4">
          <span className="hidden sm:inline text-gray-400">
            {companyInfo?.workingHours || 'Mon - Fri: 7:30 AM - 5:00 PM'}
          </span>
        </div>
      </div>

      {/* Main Sticky Navbar */}
      <nav className={`w-full transition-all duration-500 py-3 px-4 md:px-8 flex justify-between items-center z-50 ${
        isScrolled 
          ? 'fixed top-0 left-0 shadow-lg border-b border-gray-100 dark:border-white/10 py-2' 
          : 'relative'
      } ${
        isScrolled 
          ? (isDark ? 'bg-[#0b1f3a]/80 backdrop-blur-md text-white' : 'bg-white/85 backdrop-blur-md text-primary') 
          : (isDark ? 'bg-[#0b1f3a] text-white' : 'bg-white text-primary')
      }`}>
        {/* Corporate Logo Group */}
        <div 
          onClick={() => handleNavClick('home')} 
          className="flex items-center gap-3 cursor-pointer select-none"
        >
          <Logo />
          <div className="leading-none">
            <span className="block text-base md:text-lg font-bold tracking-tight text-primary dark:text-white uppercase">
              ZION PROJECTS
            </span>
            <span className="block text-[8px] md:text-[9px] uppercase tracking-[0.2em] opacity-60 text-gray-500 dark:text-gray-400 font-bold">
              Construction & Engineering Ltd
            </span>
          </div>
        </div>

        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center gap-2">
          {navItems.map((item) => (
            <button
              key={item.view}
              onClick={() => handleNavClick(item.view)}
              className={`px-3 py-2 text-[12px] font-semibold uppercase tracking-wider transition-all duration-200 hover:text-secondary relative ${
                currentView === item.view 
                  ? 'text-secondary font-bold' 
                  : 'text-primary dark:text-gray-300'
              }`}
            >
              {item.label}
              {currentView === item.view && (
                <span className="absolute bottom-0 left-3 right-3 h-[3px] bg-secondary" />
              )}
            </button>
          ))}
        </div>

        {/* Action Button & Mobile Toggle */}
        <div className="flex items-center gap-3">
          {/* Theme Toggle Button */}
          <button
            onClick={() => setIsDark(!isDark)}
            className="p-2.5 rounded-full bg-gray-100 dark:bg-white/5 text-primary dark:text-white border border-gray-200 dark:border-white/10 hover:text-secondary dark:hover:text-secondary transition-all duration-300 cursor-pointer flex items-center justify-center"
            aria-label="Toggle light and dark mode"
          >
            {isDark ? <Sun size={14} className="text-secondary" /> : <Moon size={14} />}
          </button>

          <button
            onClick={() => handleNavClick('quote-builder')}
            className="hidden sm:flex items-center gap-1.5 bg-primary dark:bg-transparent text-secondary hover:bg-secondary hover:text-primary dark:hover:bg-secondary dark:hover:text-primary px-6 py-2.5 rounded-full text-[11px] font-bold uppercase tracking-widest border border-secondary transition-all duration-300 cursor-pointer shadow-sm"
          >
            <MessageSquare size={12} />
            Request Quote
          </button>
          
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 lg:hidden text-primary dark:text-white hover:text-secondary focus:outline-none cursor-pointer"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Floating Spaceholder to prevent content jump when navbar is fixed */}
      {isScrolled && <div className="h-[60px]" />}

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.button
              type="button"
              aria-label="Close mobile navigation"
              onClick={() => setIsOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-[2px] cursor-default"
            />

            <motion.aside
              initial={{ x: 32, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 32, opacity: 0 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              className="lg:hidden fixed top-0 right-0 z-50 h-dvh w-[78vw] max-w-[280px] bg-primary text-white shadow-2xl border-l border-white/10 flex flex-col overflow-hidden"
            >
              <div className="flex items-center justify-between px-4 py-4 border-b border-white/10">
                <div className="flex items-center gap-2.5 min-w-0">
                  <Logo className="w-8 h-8 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-[10px] uppercase tracking-[0.22em] text-white/55 font-bold truncate">Zion Projects</p>
                    <p className="text-[8px] uppercase tracking-[0.28em] text-white/40 font-bold truncate">Menu</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 text-white hover:text-secondary cursor-pointer rounded-full bg-white/5"
                  aria-label="Close menu"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-4 py-4">
                <div className="flex flex-col gap-1.5">
                  {navItems.map((item) => (
                    <button
                      key={item.view}
                      onClick={() => handleNavClick(item.view)}
                      className={`w-full text-left px-3 py-2.5 text-[12px] font-bold uppercase tracking-wider rounded-none border-l-2 transition-all duration-200 ${
                        currentView === item.view
                          ? 'text-secondary bg-white/5 border-secondary'
                          : 'text-white/85 border-transparent hover:bg-white/5 hover:border-white/20 hover:text-white'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => handleNavClick('quote-builder')}
                  className="mt-4 w-full bg-secondary hover:bg-secondary/90 text-primary font-black py-2.5 px-4 rounded-none text-[11px] uppercase tracking-[0.22em] shadow-lg cursor-pointer"
                >
                  Get Quote
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
