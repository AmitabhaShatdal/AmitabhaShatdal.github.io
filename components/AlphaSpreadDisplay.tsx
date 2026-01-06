import React from 'react';
import { CompanyAnalysisResult } from '../types';

interface AlphaSpreadDisplayProps {
  data: CompanyAnalysisResult;
}

const AlphaSpreadDisplay: React.FC<AlphaSpreadDisplayProps> = ({ data }) => {
  const { sentimentGap, ticker } = data;
  const gap = sentimentGap;

  const showGap = Math.abs(data.wallStreetSentiment) > 0.001 || Math.abs(data.overallSentiment) > 0.001;

  if (!showGap) return null;

  const getInterpretation = (spread: number) => {
    // THRESHOLD ADJUSTMENT: 0.10 (10% Divergence) provides a balanced sensitivity between noise and signal.
    if (spread > 0.10) {
      return {
        type: 'POSITIVE',
        title: "Undervaluation Signal",
        desc: `Internal indicators (Management Tone & Customer Sentiment) are consistently stronger than Wall Street's current pricing model. This suggests ${ticker} may be fundamentally undervalued relative to its operational reality.`,
        bg: "bg-gradient-to-br from-emerald-50 to-white",
        border: "border-emerald-100",
        titleColor: "text-emerald-900",
        textColor: "text-emerald-800/80",
        accent: "text-emerald-600",
        barColor: "bg-emerald-500",
        badge: "bg-emerald-100 text-emerald-800 border-emerald-200"
      };
    } else if (spread < -0.10) {
      return {
        type: 'NEGATIVE',
        title: "Overvaluation Risk",
        desc: `Wall Street is pricing in perfection, but actual Management Tone or Customer Sentiment is lagging behind. This creates a risk of correction if earnings fail to meet these elevated expectations.`,
        bg: "bg-gradient-to-br from-rose-50 to-white",
        border: "border-rose-100",
        titleColor: "text-rose-900",
        textColor: "text-rose-800/80",
        accent: "text-rose-600",
        barColor: "bg-rose-500",
        badge: "bg-rose-100 text-rose-800 border-rose-200"
      };
    }
    return {
      type: 'NEUTRAL',
      title: "Fair Market Value",
      desc: "Wall Street's pricing model is largely in sync with internal operational signals. The current stock price likely reflects a fair assessment of known fundamentals.",
      bg: "bg-gradient-to-br from-slate-50 to-white",
      border: "border-slate-200",
      titleColor: "text-slate-900",
      textColor: "text-slate-600",
      accent: "text-slate-500",
      barColor: "bg-slate-400",
      badge: "bg-slate-100 text-slate-600 border-slate-200"
    };
  };

  const info = getInterpretation(gap);

  // Normalize gap for display (-0.8 to 0.8 range clamped)
  const displayGap = Math.max(-0.8, Math.min(0.8, gap));

  return (
    <div className="w-full max-w-7xl mx-auto mb-12">
      <div className={`rounded-3xl overflow-hidden shadow-2xl shadow-slate-200/50 border relative ${info.bg} ${info.border}`}>
        
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
             style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, black 1px, transparent 0)', backgroundSize: '24px 24px' }}>
        </div>

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-0">
          
          {/* Left Column: The Meter */}
          <div className="lg:col-span-7 p-8 md:p-12 flex flex-col justify-center border-b lg:border-b-0 lg:border-r border-slate-100/80">
            <div className="flex items-center gap-3 mb-6">
               <span className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full border shadow-sm ${info.badge}`}>
                 Proprietary Metric
               </span>
            </div>

            <h2 className="text-4xl md:text-5xl font-serif font-bold text-slate-900 mb-2">Alpha Spread</h2>
            <div className={`text-6xl md:text-7xl font-mono font-bold tracking-tighter ${info.accent} mb-8`}>
              {gap > 0 ? '+' : ''}{gap.toFixed(3)}
            </div>

            {/* Visual Tug of War */}
            <div className="relative h-16 w-full bg-slate-100 rounded-2xl border border-slate-200 overflow-hidden shadow-inner">
               {/* Center Line */}
               <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-slate-300 z-10"></div>
               <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[10px] font-bold uppercase text-slate-400 z-20">Bearish Drag</div>
               <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold uppercase text-slate-400 z-20">Bullish Lift</div>

               {/* The Bar */}
               <div 
                 className={`absolute top-2 bottom-2 rounded-lg transition-all duration-1000 ease-out shadow-md ${info.barColor}`}
                 style={{ 
                   left: '50%',
                   width: `${Math.abs(displayGap) * 50}%`,
                   transform: `translateX(${gap < 0 ? '-100%' : '0%'})`
                 }}
               />
            </div>
            <div className="flex justify-between mt-3 text-xs font-mono text-slate-400 font-medium">
               <span>Wall Street Dominated</span>
               <span>Reality Dominated</span>
            </div>
          </div>

          {/* Right Column: Interpretation */}
          <div className="lg:col-span-5 p-8 md:p-12 flex flex-col justify-center bg-white/40 backdrop-blur-sm">
             <div className="mb-6">
               <h3 className={`text-sm font-bold uppercase tracking-wider mb-2 ${info.accent}`}>
                 Strategic Implication
               </h3>
               <div className={`h-1 w-12 rounded-full ${info.barColor} opacity-50`}></div>
             </div>
             
             <h4 className={`text-3xl font-serif font-bold mb-4 ${info.titleColor}`}>
               {info.title}
             </h4>
             
             <p className={`text-lg leading-relaxed font-light ${info.textColor}`}>
               {info.desc}
             </p>

             <div className="mt-8 pt-8 border-t border-slate-200 flex items-center gap-6">
                <div className="text-center">
                   <div className="text-[10px] text-slate-400 uppercase tracking-widest mb-1 font-bold">Raw Reality</div>
                   <div className="text-xl font-bold text-slate-700">{(data.overallSentiment + data.consumerSentiment / 2).toFixed(2)}</div>
                </div>
                <div className="text-xl text-slate-300 font-light italic">vs</div>
                <div className="text-center">
                   <div className="text-[10px] text-slate-400 uppercase tracking-widest mb-1 font-bold">Pricing Model</div>
                   <div className="text-xl font-bold text-slate-700">{data.wallStreetSentiment.toFixed(2)}</div>
                </div>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AlphaSpreadDisplay;