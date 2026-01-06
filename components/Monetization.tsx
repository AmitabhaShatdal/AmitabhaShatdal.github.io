import React from 'react';

interface AdBannerProps {
  slot?: string;
  variant?: 'horizontal' | 'vertical' | 'square';
  className?: string;
}

/**
 * 1. DISPLAY ADS COMPONENT (Google AdSense Placeholder)
 * Supports 'horizontal' (leaderboard), 'vertical' (skyscraper), and 'square' (rect).
 */
export const AdBanner: React.FC<AdBannerProps> = ({ slot, variant = 'horizontal', className = '' }) => {
  
  let containerClasses = "w-full mx-auto relative z-10";
  let boxClasses = "bg-slate-50 border border-slate-200 flex flex-col items-center justify-center text-center shadow-inner rounded-lg group hover:border-indigo-200 transition-colors";
  let innerClasses = "w-full h-full flex items-center justify-center bg-white rounded border border-dashed border-slate-300";
  let textClasses = "text-slate-400 text-xs font-mono group-hover:text-indigo-400 transition-colors";

  if (variant === 'vertical') {
    // Skyscraper style
    containerClasses = "w-full max-w-[160px] h-full"; 
    boxClasses += " h-full p-4 min-h-[600px]";
    innerClasses += " p-2";
  } else if (variant === 'square') {
    // Rect style
    containerClasses = "w-full max-w-sm mx-auto";
    boxClasses += " aspect-square p-6";
    innerClasses += " p-6";
  } else {
    // Horizontal (Leaderboard) default
    containerClasses += " max-w-4xl";
    boxClasses += " p-8 min-h-[120px]";
    innerClasses += " p-6";
  }

  // Merge custom class names
  containerClasses = `${containerClasses} ${className}`;

  const label = variant === 'vertical' ? 'Skyscraper' : variant === 'square' ? 'Square' : 'Display Ad';

  return (
    <div className={containerClasses}>
      <div className={boxClasses}>
        <span className="text-[10px] text-slate-300 uppercase tracking-widest mb-2 font-bold opacity-60 group-hover:opacity-100 transition-opacity">Ad</span>
        {/* This is where the Google Ad Script would go */}
        <div className={innerClasses}>
           <p className={textClasses}>Google AdSense {label}</p>
        </div>
      </div>
    </div>
  );
};