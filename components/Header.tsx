import React from 'react';
import { Activity } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="w-full bg-slate-900/95 backdrop-blur-xl border-b border-white/5 shadow-2xl shadow-slate-900/20">
      <div className="container mx-auto flex h-20 items-center justify-between px-6">
        <a href="index.html" className="flex gap-4 items-center cursor-pointer group no-underline">
          <div className="relative">
            <div className="absolute inset-0 bg-white/10 blur-lg rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
            <Activity className="h-6 w-6 text-white relative z-10" />
          </div>
          <span className="text-white font-serif font-bold text-2xl tracking-wide italic relative">
            AQ
          </span>
        </a>
      </div>
    </header>
  );
};

export default Header;