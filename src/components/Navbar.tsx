import React, { useState, useEffect } from 'react';
import { 
  Building2, HardHat, Phone, Mail, MapPin, Menu, X, 
  Lock, LayoutDashboard, ChevronDown, MessageSquare, AlertTriangle 
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
    <header className="w-full flex flex-col z-50">
      {/* Top Contact Strip */}
      <div className="w-full bg-primary text-gray-300 text-xs py-2 px-4 md:px-8 flex flex-col sm:flex-row justify-between items-center gap-2 border-b border-white/10">
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
      <nav className={`w-full transition-all duration-300 py-3 px-4 md:px-8 flex justify-between items-center ${
        isScrolled 
          ? 'fixed top-0 left-0 bg-white shadow-md border-b border-gray-100 py-2 text-primary' 
          : 'bg-white text-primary'
      }`}>
        {/* Corporate Logo Group */}
        <div 
          onClick={() => handleNavClick('home')} 
          className="flex items-center gap-3 cursor-pointer select-none"
        >
          <Logo />
          <div className="leading-none">
            <span className="block text-base md:text-lg font-bold tracking-tight text-primary uppercase">
              ZION PROJECTS
            </span>
            <span className="block text-[8px] md:text-[9px] uppercase tracking-[0.2em] opacity-60 text-gray-500 font-bold">
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
                  : 'text-primary'
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
          <button
            onClick={() => handleNavClick('quote-builder')}
            className="hidden sm:flex items-center gap-1.5 bg-primary text-secondary hover:bg-secondary hover:text-primary px-6 py-2.5 rounded-full text-[11px] font-bold uppercase tracking-widest border border-secondary transition-all duration-300 cursor-pointer shadow-sm"
          >
            <MessageSquare size={12} />
            Request Quote
          </button>
          
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 lg:hidden text-primary hover:text-secondary focus:outline-none cursor-pointer"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Floating Spaceholder to prevent content jump when navbar is fixed */}
      {isScrolled && <div className="h-[60px]" />}

      {/* Mobile Drawer Menu */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 bg-primary/95 text-white z-40 flex flex-col justify-center items-center p-6 transition-all duration-300">
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-6 right-6 p-2 text-white hover:text-secondary cursor-pointer"
          >
            <X size={28} />
          </button>

          <div className="flex flex-col items-center gap-6 text-center w-full max-w-sm">
            {navItems.map((item) => (
              <button
                key={item.view}
                onClick={() => handleNavClick(item.view)}
                className={`text-lg font-bold tracking-wide w-full py-2 hover:text-secondary transition-all ${
                  currentView === item.view ? 'text-secondary border-b border-secondary/30' : ''
                }`}
              >
                {item.label}
              </button>
            ))}
            
            <button
              onClick={() => handleNavClick('quote-builder')}
              className="mt-4 w-full bg-secondary hover:bg-secondary/90 text-primary font-black py-3 px-6 rounded-full text-sm uppercase tracking-widest shadow-lg cursor-pointer"
            >
              Get Estimation Quote
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
