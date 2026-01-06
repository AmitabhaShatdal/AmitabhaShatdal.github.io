import React from 'react';

export const AdBanner: React.FC<{ slot?: string }> = ({ slot }) => {
  return (
    <div className="w-full mx-auto my-6 max-w-4xl relative z-10">
      <div className="bg-slate-50 border border-slate-200 p-8 flex flex-col items-center justify-center min-h-[120px] text-center shadow-inner rounded-lg group hover:border-indigo-200 transition-colors">
        <span className="text-[10px] text-slate-300 uppercase tracking-widest mb-2 font-bold opacity-60 group-hover:opacity-100 transition-opacity">Advertisement</span>
        {/* Placeholder for Ad Script */}
        <div className="w-full h-full flex items-center justify-center bg-white rounded border border-dashed border-slate-300 p-6">
           <p className="text-slate-400 text-xs font-mono group-hover:text-indigo-400 transition-colors">Google AdSense Space (728x90)</p>
        </div>
      </div>
    </div>
  );
};