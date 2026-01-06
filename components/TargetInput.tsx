import React, { useState } from 'react';
import { Search, Loader2, ArrowRight } from 'lucide-react';
import { AnalysisStatus } from '../types';

interface TargetInputProps {
  onSearch: (term: string) => void;
  status: AnalysisStatus;
}

const PRESETS = [
  "AAPL",
  "MSFT",
  "GOOGL",
  "NVDA",
  "TSLA"
];

const TargetInput: React.FC<TargetInputProps> = ({ onSearch, status }) => {
  const [value, setValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim()) {
      onSearch(value.trim());
    }
  };

  const isLoading = status === AnalysisStatus.SEARCHING || status === AnalysisStatus.ANALYZING;

  return (
    <div className="w-full max-w-xl mx-auto mb-16 relative z-20">
      <form onSubmit={handleSubmit} className={`relative group rounded-2xl transition-all duration-300 ${isFocused ? 'scale-[1.02] shadow-2xl shadow-indigo-500/20' : 'scale-100 shadow-xl shadow-slate-900/10'}`}>
        
        {/* Glow effect */}
        <div className={`absolute -inset-1 rounded-2xl bg-gradient-to-r from-indigo-500 to-violet-500 opacity-20 blur transition-opacity duration-300 ${isFocused ? 'opacity-40' : 'opacity-0'}`} />
        
        <div className="absolute inset-y-0 left-0 flex items-center pl-6 pointer-events-none z-10">
          <Search className={`h-5 w-5 transition-colors duration-300 ${isFocused ? 'text-indigo-500' : 'text-slate-400'}`} />
        </div>
        
        <input
          type="text"
          className="w-full h-16 pl-14 pr-24 rounded-2xl bg-white/70 backdrop-blur-xl border border-white/50 text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-white text-xl font-serif font-bold tracking-widest uppercase shadow-inner transition-all"
          placeholder="ENTER TICKER..."
          value={value}
          onChange={(e) => setValue(e.target.value.toUpperCase())}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          disabled={isLoading}
        />
        
        <button
          type="submit"
          disabled={isLoading || !value.trim()}
          className="absolute right-2 top-2 bottom-2 bg-slate-900 hover:bg-slate-800 text-white px-6 rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg shadow-slate-900/20 active:scale-95 hover:shadow-xl"
        >
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin text-indigo-400" /> : <ArrowRight className="h-5 w-5 text-white" />}
        </button>
      </form>

      <div className="mt-6 flex flex-wrap justify-center gap-2">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest py-1.5 px-2 flex items-center">Trending:</span>
        {PRESETS.map((preset) => (
          <button
            key={preset}
            onClick={() => {
              setValue(preset);
              onSearch(preset);
            }}
            disabled={isLoading}
            className="
              group
              px-4 py-1.5 rounded-full 
              text-[10px] font-bold tracking-wide text-slate-500
              bg-white/50 backdrop-blur-sm border border-white/60
              shadow-sm
              hover:bg-white hover:text-indigo-600 hover:border-indigo-100 hover:shadow-md hover:-translate-y-0.5
              active:scale-95 active:shadow-inner
              transition-all duration-200 ease-out
              disabled:opacity-50 disabled:cursor-not-allowed
            "
          >
            {preset}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TargetInput;