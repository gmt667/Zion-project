import React, { useState } from 'react';
import { 
  Building2, Phone, Mail, MapPin, Send, Facebook, 
  Linkedin, Twitter, Calendar, ShieldCheck, Award 
} from 'lucide-react';
import { CompanyInfo } from '../types';

interface FooterProps {
  companyInfo: CompanyInfo | null;
  onNavigate: (view: string) => void;
}

export default function Footer({ companyInfo, onNavigate }: FooterProps) {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    
    // Call server newsletter subscription or simulate
    fetch('/api/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ newsletterEmail })
    }).then(() => {
      setSubscribed(true);
      setNewsletterEmail('');
      setTimeout(() => setSubscribed(false), 5000);
    });
  };

  const handleLinkClick = (view: string) => {
    onNavigate(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-primary text-gray-300 pt-16 pb-8 border-t-4 border-secondary relative overflow-hidden">
      <div className="absolute inset-0 geometric-pattern opacity-[0.03] pointer-events-none" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 pb-12 border-b border-white/10">
          
          {/* Corporate Profile Column */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => handleLinkClick('home')}>
              <div className="w-9 h-9 bg-secondary text-primary flex items-center justify-center rotate-45 border border-primary">
                <span className="font-extrabold text-sm -rotate-45">Z</span>
              </div>
              <span className="text-lg font-bold text-white tracking-wider uppercase">
                ZION PROJECTS
              </span>
            </div>
            
            <p className="text-xs text-white/60 leading-relaxed font-light">
              Zion Projects Construction Ltd is Malawi's premier NCIC registered Grade-A civil engineering contractor, setting benchmarks for highways, bridge designs, and complex commercial buildings.
            </p>

            <div className="flex items-center gap-3 mt-2">
              <div className="flex items-center gap-1 bg-white/5 py-1 px-2.5 rounded-none border border-white/10 text-[10px] font-bold text-gray-300 uppercase tracking-wider">
                <Award size={12} className="text-secondary" />
                <span>NCIC Grade-A</span>
              </div>
              <div className="flex items-center gap-1 bg-white/5 py-1 px-2.5 rounded-none border border-white/10 text-[10px] font-bold text-gray-300 uppercase tracking-wider">
                <ShieldCheck size={12} className="text-secondary" />
                <span>MBS Compliant</span>
              </div>
            </div>
            
            {/* Social Icons */}
            <div className="flex items-center gap-3 mt-3">
              <a href={companyInfo?.socialLinks?.facebook} target="_blank" rel="noreferrer" className="p-2.5 bg-white/5 hover:bg-secondary hover:text-primary rounded-none transition-all text-gray-400">
                <Facebook size={14} />
              </a>
              <a href={companyInfo?.socialLinks?.linkedin} target="_blank" rel="noreferrer" className="p-2.5 bg-white/5 hover:bg-secondary hover:text-primary rounded-none transition-all text-gray-400">
                <Linkedin size={14} />
              </a>
              <a href={companyInfo?.socialLinks?.twitter} target="_blank" rel="noreferrer" className="p-2.5 bg-white/5 hover:bg-secondary hover:text-primary rounded-none transition-all text-gray-400">
                <Twitter size={14} />
              </a>
            </div>
          </div>

          {/* Quick Navigation Links */}
          <div>
            <h3 className="text-white font-bold text-sm uppercase tracking-widest border-l-2 border-secondary pl-3 mb-6">
              Our Portals
            </h3>
            <ul className="space-y-3 text-xs font-semibold text-gray-400">
              <li>
                <button onClick={() => handleLinkClick('home')} className="hover:text-secondary cursor-pointer transition-colors">Home Portal</button>
              </li>
              <li>
                <button onClick={() => handleLinkClick('about')} className="hover:text-secondary cursor-pointer transition-colors">About Corporate</button>
              </li>
              <li>
                <button onClick={() => handleLinkClick('services')} className="hover:text-secondary cursor-pointer transition-colors">Engineering Services</button>
              </li>
              <li>
                <button onClick={() => handleLinkClick('projects')} className="hover:text-secondary cursor-pointer transition-colors">Completed Projects</button>
              </li>
              <li>
                <button onClick={() => handleLinkClick('gallery')} className="hover:text-secondary cursor-pointer transition-colors">Media Galleries</button>
              </li>
              <li>
                <button onClick={() => handleLinkClick('careers')} className="hover:text-secondary cursor-pointer transition-colors">Careers & Vacancies</button>
              </li>
              <li>
                <button onClick={() => handleLinkClick('downloads')} className="hover:text-secondary cursor-pointer transition-colors">Compliance Downloads</button>
              </li>
            </ul>
          </div>

          {/* Contact Details Column */}
          <div>
            <h3 className="text-white font-bold text-sm uppercase tracking-widest border-l-2 border-secondary pl-3 mb-6">
              Headquarters
            </h3>
            <ul className="space-y-4 text-xs text-gray-400">
              <li className="flex items-start gap-2.5">
                <MapPin size={15} className="text-secondary shrink-0 mt-0.5" />
                <span>{companyInfo?.address || 'Zion House, Area 4, Lilongwe, Malawi'}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone size={15} className="text-secondary shrink-0" />
                <a href={`tel:${companyInfo?.phone}`} className="hover:text-white transition-colors">{companyInfo?.phone || '+265 1 772 443'}</a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail size={15} className="text-secondary shrink-0" />
                <a href={`mailto:${companyInfo?.email}`} className="hover:text-white transition-colors">{companyInfo?.email || 'info@zionprojects.mw'}</a>
              </li>
              <li className="flex items-start gap-2.5">
                <Calendar size={15} className="text-secondary shrink-0 mt-0.5" />
                <div>
                  <p>{companyInfo?.workingHours || 'Mon-Fri: 07:30 AM - 05:00 PM'}</p>
                  <p className="text-gray-500">{companyInfo?.workingHoursSat || 'Sat: 08:00 AM - 12:30 PM'}</p>
                </div>
              </li>
            </ul>
          </div>

          {/* Interactive Newsletter Column */}
          <div>
            <h3 className="text-white font-bold text-sm uppercase tracking-widest border-l-2 border-secondary pl-3 mb-6">
              Tender Newsletter
            </h3>
            <p className="text-xs text-gray-400 leading-relaxed mb-4">
              Subscribe to stay updated with Zion’s corporate updates, vacancy listings, and materials supply catalogs.
            </p>
            
            <form onSubmit={handleSubscribe} className="flex flex-col gap-2">
              <div className="relative">
                <input
                  type="email"
                  placeholder="name@company.com"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  className="w-full bg-white/10 border border-white/20 text-white rounded-none py-2.5 pl-3 pr-10 text-xs focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary"
                  required
                />
                <button
                  type="submit"
                  className="absolute right-1 top-1 bottom-1 px-3 bg-secondary text-primary rounded-none hover:bg-secondary/90 transition-all cursor-pointer"
                >
                  <Send size={12} />
                </button>
              </div>
              {subscribed && (
                <span className="text-[11px] font-bold text-secondary animate-pulse">
                  Subscribed successfully! Thank you.
                </span>
              )}
            </form>
          </div>

        </div>

        {/* Lower Legal Bar */}
        <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500">
          <p>© {new Date().getFullYear()} Zion Projects Construction Ltd. All Rights Reserved. National Registration Number: C-1224/2012.</p>
          <div className="flex gap-4">
            <button onClick={() => handleLinkClick('privacy-policy')} className="hover:text-secondary cursor-pointer">Privacy Policy</button>
            <span>•</span>
            <button onClick={() => handleLinkClick('terms-conditions')} className="hover:text-secondary cursor-pointer">Terms & Conditions</button>
          </div>
        </div>
      </div>
    </footer>
  );
}
