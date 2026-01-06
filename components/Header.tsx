import React, { useState } from 'react';
import { Activity, HelpCircle, Menu, X, Shield, FileText, Users, Mail, BookOpen } from 'lucide-react';

interface HeaderProps {
  onOpenMethodology: () => void;
  onNavigate: (page: string) => void;
  currentPage: string;
}

const Header: React.FC<HeaderProps> = ({ onOpenMethodology, onNavigate, currentPage }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'about', label: 'About', icon: Users },
    { id: 'faq', label: 'FAQ', icon: BookOpen },
    { id: 'contact', label: 'Contact', icon: Mail },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-slate-900/95 backdrop-blur-xl border-b border-white/5 shadow-2xl shadow-slate-900/20">
      <div className="container mx-auto flex h-20 items-center justify-between px-6">
        <div 
          className="flex gap-4 items-center cursor-pointer group" 
          onClick={() => onNavigate('home')}
        >
          <div className="relative">
            <div className="absolute inset-0 bg-white/10 blur-lg rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
            <Activity className="h-6 w-6 text-white relative z-10" />
          </div>
          <span className="text-white font-serif font-bold text-2xl tracking-tight relative">
            Alpha Quelle
          </span>
        </div>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex items-center gap-2 text-xs font-medium tracking-widest uppercase px-4 py-2.5 rounded-sm border transition-all ${
                currentPage === item.id
                  ? 'text-white bg-white/15 border-white/20'
                  : 'text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 border-white/10'
              }`}
            >
              <item.icon className="h-3.5 w-3.5" />
              <span>{item.label}</span>
            </button>
          ))}
          <button 
            onClick={onOpenMethodology}
            className="flex items-center gap-2 text-xs font-medium tracking-widest uppercase text-slate-300 hover:text-white transition-all bg-white/5 hover:bg-white/10 hover:shadow-md hover:-translate-y-0.5 px-4 py-2.5 rounded-sm border border-white/10"
          >
            <HelpCircle className="h-3.5 w-3.5" />
            <span>Methodology</span>
          </button>
        </nav>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-white p-2"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-900 border-t border-white/10">
          <nav className="container mx-auto px-6 py-4 flex flex-col gap-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`flex items-center gap-3 text-sm font-medium px-4 py-3 rounded-lg transition-all ${
                  currentPage === item.id
                    ? 'text-white bg-white/15'
                    : 'text-slate-300 hover:text-white hover:bg-white/10'
                }`}
              >
                <item.icon className="h-4 w-4" />
                <span>{item.label}</span>
              </button>
            ))}
            <button 
              onClick={() => {
                onOpenMethodology();
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-3 text-sm font-medium text-slate-300 hover:text-white hover:bg-white/10 px-4 py-3 rounded-lg transition-all"
            >
              <HelpCircle className="h-4 w-4" />
              <span>Methodology</span>
            </button>
            <div className="border-t border-white/10 mt-2 pt-4">
              <button
                onClick={() => {
                  onNavigate('privacy');
                  setMobileMenuOpen(false);
                }}
                className="flex items-center gap-3 text-xs font-medium text-slate-400 hover:text-white px-4 py-2 transition-all"
              >
                <Shield className="h-3.5 w-3.5" />
                <span>Privacy Policy</span>
              </button>
              <button
                onClick={() => {
                  onNavigate('terms');
                  setMobileMenuOpen(false);
                }}
                className="flex items-center gap-3 text-xs font-medium text-slate-400 hover:text-white px-4 py-2 transition-all"
              >
                <FileText className="h-3.5 w-3.5" />
                <span>Terms of Service</span>
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
