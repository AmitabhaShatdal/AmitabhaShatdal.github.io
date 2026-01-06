import React from 'react';
import { CompanyAnalysisResult } from '../types';
import { Scale, Users, LineChart as ChartIcon, Briefcase } from 'lucide-react';

interface AnalysisChartsProps {
  data: CompanyAnalysisResult;
}

const AnalysisCharts: React.FC<AnalysisChartsProps> = ({ data }) => {
  const formatScore = (score: number) => (score > 0 ? `+${score.toFixed(2)}` : score.toFixed(2));
  
  const showWallStreet = Math.abs(data.wallStreetSentiment) > 0.001;
  const showConsumer = Math.abs(data.consumerSentiment) > 0.001;
  const showCSuite = Math.abs(data.overallSentiment) > 0.001;

  if (!showWallStreet && !showConsumer && !showCSuite) {
    return null;
  }

  const renderSentimentBar = (score: number) => {
    const clampedScore = Math.max(-1, Math.min(1, score));
    const isPositive = clampedScore >= 0;
    const widthPercentage = Math.abs(clampedScore) * 50;
    
    // Default Market Colors (Green/Red) used for ALL charts now
    let barGradient = isPositive 
      ? 'bg-gradient-to-r from-emerald-500 to-emerald-400' 
      : 'bg-gradient-to-r from-rose-500 to-rose-400';
    
    return (
      <div className="relative h-2.5 w-full bg-slate-100 rounded-full overflow-hidden mb-6 mt-4 shadow-inner ring-1 ring-black/5">
        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-slate-300 -translate-x-1/2 z-10"></div>
        <div 
          className={`absolute top-0 bottom-0 transition-all duration-1000 ease-out shadow-lg ${barGradient}`}
          style={{ 
            left: isPositive ? '50%' : undefined,
            right: isPositive ? undefined : '50%',
            width: `${widthPercentage}%`,
          }}
        />
      </div>
    );
  };

  return (
    <div className="space-y-6 mb-12">
      
      {/* 360 Degree View Card */}
      <div className="bg-white/80 backdrop-blur-xl border border-white/60 rounded-3xl p-8 md:p-10 shadow-2xl shadow-indigo-900/10">
        
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-start justify-between mb-10 gap-6 border-b border-indigo-50/50 pb-8">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-br from-indigo-50 to-white rounded-xl border border-indigo-100 text-indigo-700 shadow-sm">
              <Scale className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-2xl font-serif font-bold text-slate-900 tracking-tight">360° Sentiment Radar</h3>
              <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mt-1">Multi-Vector Analysis</p>
            </div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          
          {/* Wall Street Side */}
          {showWallStreet && (
            <div className="flex flex-col h-full bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-lg shadow-slate-200/50 hover:shadow-2xl hover:shadow-indigo-100/60 hover:-translate-y-1 transition-all duration-500 group">
              <div className="p-6 border-b border-slate-50 flex items-center gap-3 bg-gradient-to-r from-blue-50/50 to-white">
                <ChartIcon className="h-4 w-4 text-blue-500 group-hover:text-blue-600 transition-colors" />
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest group-hover:text-blue-900 transition-colors">Wall Street</h4>
              </div>
              <div className="p-8 text-center flex-grow flex flex-col justify-center relative">
                <div className={`text-6xl font-serif font-bold mb-2 tracking-tight drop-shadow-sm ${data.wallStreetSentiment > 0.05 ? 'text-emerald-600' : data.wallStreetSentiment < -0.05 ? 'text-rose-600' : 'text-slate-400'}`}>
                   {formatScore(data.wallStreetSentiment)}
                </div>
                
                {renderSentimentBar(data.wallStreetSentiment)}

                <p className="text-sm text-slate-500 leading-relaxed font-light">{data.wallStreetSummary}</p>
              </div>
            </div>
          )}

          {/* Consumer Side */}
          {showConsumer && (
            <div className="flex flex-col h-full bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-lg shadow-slate-200/50 hover:shadow-2xl hover:shadow-amber-100/60 hover:-translate-y-1 transition-all duration-500 group">
               <div className="p-6 border-b border-slate-50 flex items-center gap-3 bg-gradient-to-r from-amber-50/50 to-white">
                <Users className="h-4 w-4 text-amber-500 group-hover:text-amber-600 transition-colors" />
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest group-hover:text-amber-900 transition-colors">Consumer</h4>
              </div>
              <div className="p-8 text-center flex-grow flex flex-col justify-center">
                <div className={`text-6xl font-serif font-bold mb-2 tracking-tight drop-shadow-sm ${data.consumerSentiment > 0.05 ? 'text-emerald-600' : data.consumerSentiment < -0.05 ? 'text-rose-600' : 'text-slate-400'}`}>
                   {formatScore(data.consumerSentiment)}
                </div>
                
                {renderSentimentBar(data.consumerSentiment)}

                <p className="text-sm text-slate-500 leading-relaxed font-light">{data.consumerSummary}</p>
              </div>
            </div>
          )}

          {/* C-Suite Side (Unified Card Style) */}
          {showCSuite && (
            <div className="flex flex-col h-full bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-lg shadow-slate-200/50 hover:shadow-2xl hover:shadow-indigo-100/60 hover:-translate-y-1 transition-all duration-500 group">
              <div className="p-6 border-b border-slate-50 flex items-center gap-3 bg-gradient-to-r from-indigo-50/50 to-white">
                <Briefcase className="h-4 w-4 text-indigo-500 group-hover:text-indigo-600 transition-colors" />
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest group-hover:text-indigo-900 transition-colors">C-Suite Tone</h4>
              </div>
              
              <div className="p-8 text-center flex-grow flex flex-col justify-center relative z-10">
                <div className={`text-6xl font-serif font-bold mb-2 tracking-tight drop-shadow-sm ${data.overallSentiment > 0.05 ? 'text-emerald-600' : data.overallSentiment < -0.05 ? 'text-rose-600' : 'text-slate-400'}`}>
                   {formatScore(data.overallSentiment)}
                </div>
                
                {renderSentimentBar(data.overallSentiment)}

                <p className="text-sm text-slate-500 leading-relaxed font-light">{data.overallSummary}</p>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default AnalysisCharts;