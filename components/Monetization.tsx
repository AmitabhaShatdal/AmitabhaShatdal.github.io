import React, { useEffect } from 'react';

interface AdBannerProps {
  slot?: string;
  variant?: 'horizontal' | 'vertical' | 'square';
  className?: string;
}

/**
 * 1. DISPLAY ADS COMPONENT (Google AdSense)
 * Supports 'horizontal' (leaderboard), 'vertical' (skyscraper), and 'square' (rect).
 */
export const AdBanner: React.FC<AdBannerProps> = ({ slot, variant = 'horizontal', className = '' }) => {
  
  useEffect(() => {
    try {
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (err) {
      console.error("AdSense error", err);
    }
  }, []);

  let containerClasses = "w-full mx-auto relative z-10";
  let boxClasses = "bg-slate-50 border border-slate-200 flex flex-col items-center justify-center text-center shadow-inner rounded-lg group hover:border-indigo-200 transition-colors overflow-hidden";
  
  // Default Slots based on user config
  let adSlotId = "6681086623"; // Horizontal default

  if (variant === 'vertical') {
    // Skyscraper style
    adSlotId = "4222444245";
    containerClasses = "w-full max-w-[160px] h-full"; 
    boxClasses += " h-full min-h-[600px]";
  } else if (variant === 'square') {
    // Rect style
    adSlotId = "3817768493";
    containerClasses = "w-full max-w-sm mx-auto";
    boxClasses += " aspect-square min-h-[250px]";
  } else {
    // Horizontal (Leaderboard) default
    adSlotId = "6681086623";
    containerClasses += " max-w-4xl";
    boxClasses += " min-h-[100px]";
  }

  // Override if slot prop provided
  if (slot) adSlotId = slot;

  // Merge custom class names
  containerClasses = `${containerClasses} ${className}`;

  return (
    <div className={containerClasses}>
      <div className={boxClasses}>
        <div className="w-full h-full flex items-center justify-center bg-white/50">
           <ins className="adsbygoogle"
             style={{ display: 'block', width: '100%', height: '100%' }}
             data-ad-client="ca-pub-6254425311561751"
             data-ad-slot={adSlotId}
             data-ad-format="auto"
             data-full-width-responsive="true"></ins>
        </div>
      </div>
      <span className="block text-center text-[9px] text-slate-300 uppercase tracking-widest mt-1 opacity-60">Advertisement</span>
    </div>
  );
};
