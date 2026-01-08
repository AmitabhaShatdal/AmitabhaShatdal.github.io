import React from 'react';
import { Activity, HelpCircle } from 'lucide-react';

interface HeaderProps {
  onOpenMethodology: () => void;
}

const Header: React.FC<HeaderProps> = ({ onOpenMethodology }) => {
  return (
    <header className="sticky top-0 z-50 w-full bg-slate-900/95 backdrop-blur-xl border-b border-white/5 shadow-2xl shadow-slate-900/20">
      <div className="container mx-auto flex h-20 items-center justify-between px-6">
        <div className="flex gap-4 items-center cursor-pointer group" onClick={() => window.location.reload()}>
          <div className="relative">
            <div className="absolute inset-0 bg-white/10 blur-lg rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
            <Activity className="h-6 w-6 text-white relative z-10" />
          </div>
          <span className="text-white font-serif font-bold text-2xl tracking-tight relative">
            Alpha Quelle
          </span>
        </div>
        
        <div className="flex items-center gap-4">
          <button 
            onClick={onOpenMethodology}
            className="flex items-center gap-2 text-xs font-medium tracking-widest uppercase text-slate-300 hover:text-white transition-all bg-white/5 hover:bg-white/10 hover:shadow-md hover:-translate-y-0.5 px-5 py-2.5 rounded-sm border border-white/10"
          >
            <HelpCircle className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Methodology</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;