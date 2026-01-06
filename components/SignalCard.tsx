import React from 'react';
import { TradingSignal } from '../types';
import { AlertTriangle, TrendingUp, TrendingDown, Activity, CheckCircle, XCircle } from 'lucide-react';

interface SignalCardProps {
  signal: TradingSignal;
}

const SignalCard: React.FC<SignalCardProps> = ({ signal }) => {
  
  if (signal.type === 'NEUTRAL') {
    return null;
  }

  // Styles per signal type
  const getStyle = () => {
    switch (signal.type) {
      case 'BULLISH_DIVERGENCE': return {
        border: 'border-indigo-600',
        bg: 'bg-indigo-50/50',
        iconColor: 'text-indigo-700',
        iconBg: 'bg-indigo-100',
        shadow: 'shadow-indigo-100'
      };
      case 'BEARISH_DIVERGENCE': return {
        border: 'border-rose-600',
        bg: 'bg-rose-50/50',
        iconColor: 'text-rose-700',
        iconBg: 'bg-rose-100',
        shadow: 'shadow-rose-100'
      };
      case 'BULLISH_CONSENSUS': return {
        border: 'border-emerald-600',
        bg: 'bg-emerald-50/50',
        iconColor: 'text-emerald-700',
        iconBg: 'bg-emerald-100',
        shadow: 'shadow-emerald-100'
      };
      case 'BEARISH_CONSENSUS': return {
        border: 'border-orange-600',
        bg: 'bg-orange-50/50',
        iconColor: 'text-orange-700',
        iconBg: 'bg-orange-100',
        shadow: 'shadow-orange-100'
      };
      case 'VOLATILITY_WARNING': return {
        border: 'border-amber-500',
        bg: 'bg-amber-50/50',
        iconColor: 'text-amber-700',
        iconBg: 'bg-amber-100',
        shadow: 'shadow-amber-100'
      };
      default: return {
        border: 'border-slate-400',
        bg: 'bg-white',
        iconColor: 'text-slate-600',
        iconBg: 'bg-slate-100',
        shadow: 'shadow-slate-200'
      };
    }
  };

  const style = getStyle();

  const getIcon = () => {
    switch (signal.type) {
      case 'BULLISH_DIVERGENCE': return <TrendingUp className={`h-6 w-6 ${style.iconColor}`} />;
      case 'BEARISH_DIVERGENCE': return <TrendingDown className={`h-6 w-6 ${style.iconColor}`} />;
      case 'BULLISH_CONSENSUS': return <CheckCircle className={`h-6 w-6 ${style.iconColor}`} />;
      case 'BEARISH_CONSENSUS': return <XCircle className={`h-6 w-6 ${style.iconColor}`} />;
      case 'VOLATILITY_WARNING': return <AlertTriangle className={`h-6 w-6 ${style.iconColor}`} />;
      default: return <Activity className={`h-6 w-6 ${style.iconColor}`} />;
    }
  };

  return (
    <div className={`relative overflow-hidden bg-white border-y md:border border-slate-100 md:rounded-2xl p-8 mb-12 shadow-xl ${style.shadow} flex flex-col md:flex-row items-start gap-6 border-l-[6px] ${style.border}`}>
      {/* Subtle tint background */}
      <div className={`absolute inset-0 ${style.bg} opacity-30 pointer-events-none`} />
      
      <div className={`p-4 rounded-xl ${style.iconBg} relative z-10 shrink-0 shadow-sm`}>
        {getIcon()}
      </div>
      <div className="flex-grow relative z-10">
        <div className="flex items-center gap-3 mb-3">
           <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Primary Signal Detected</span>
           <span className="bg-slate-800 text-white px-2 py-0.5 rounded text-[10px] font-mono shadow-md">
             Confidence: {Math.round(signal.strength)}%
           </span>
        </div>
        <h2 className="text-3xl font-serif font-bold text-slate-900 mb-3">{signal.headline}</h2>
        <p className="text-slate-600 font-light leading-relaxed text-lg max-w-4xl">
          {signal.description}
        </p>
      </div>
    </div>
  );
};

export default SignalCard;