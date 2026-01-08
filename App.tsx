import React, { useState } from 'react';
import Header from './components/Header';
import TargetInput from './components/TargetInput';
import AnalysisCharts from './components/AnalysisCharts';
import AlphaSpreadDisplay from './components/AlphaSpreadDisplay';
import NewsFeed from './components/NewsFeed';
import { AdBanner } from './components/Monetization';
import MethodologyModal from './components/MethodologyModal';
import SignalCard from './components/SignalCard';
import { fetchAndAnalyzeTicker } from './services/analysisService';
import { CompanyAnalysisResult, AnalysisStatus } from './types';
import { AlertCircle, Loader2, Rss } from 'lucide-react';

const App: React.FC = () => {
  const [status, setStatus] = useState<AnalysisStatus>(AnalysisStatus.IDLE);
  const [data, setData] = useState<CompanyAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progressMsg, setProgressMsg] = useState<string>("Initializing..."); 
  const [isMethodologyOpen, setIsMethodologyOpen] = useState(false);

  const handleSearch = async (ticker: string) => {
    setStatus(AnalysisStatus.SEARCHING);
    setError(null);
    setData(null);
    setProgressMsg("Connecting to Live Data Streams...");

    try {
      const result = await fetchAndAnalyzeTicker(ticker, (msg) => {
        setProgressMsg(msg);
      });
      
      setData(result);
      setStatus(AnalysisStatus.COMPLETE);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An unexpected error occurred.");
      setStatus(AnalysisStatus.ERROR);
    }
  };

  return (
    <div className="min-h-screen font-sans selection:bg-indigo-500 selection:text-white flex flex-col relative overflow-x-hidden text-slate-800 bg-[#f8fafc]">
      
      {/* Ambient Background Mesh - Increased Vibrancy */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[900px] h-[900px] rounded-full bg-indigo-400/20 blur-[130px] mix-blend-multiply" />
        <div className="absolute top-[10%] right-[-10%] w-[700px] h-[700px] rounded-full bg-emerald-300/25 blur-[110px] mix-blend-multiply" />
        <div className="absolute bottom-[-20%] left-[20%] w-[800px] h-[800px] rounded-full bg-blue-400/20 blur-[130px] mix-blend-multiply" />
        <div className="absolute top-[40%] left-[30%] w-[600px] h-[600px] rounded-full bg-violet-400/15 blur-[100px] mix-blend-multiply" />
      </div>

      <Header onOpenMethodology={() => setIsMethodologyOpen(true)} />
      <MethodologyModal isOpen={isMethodologyOpen} onClose={() => setIsMethodologyOpen(false)} />
      
      <main className="container mx-auto px-4 py-16 flex-grow relative z-10">
        {status === AnalysisStatus.IDLE && (
          <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900 text-white text-[11px] font-bold tracking-widest uppercase mb-8 shadow-xl shadow-indigo-500/20 ring-1 ring-white/20">
              <Rss className="h-3 w-3 text-emerald-400" />
              <span>Real-time Intelligence</span>
            </div>
            <h1 className="text-6xl md:text-8xl font-bold text-slate-900 mb-6 tracking-tight drop-shadow-sm font-serif">
              Alpha <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600 italic font-serif">Quelle</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed font-light tracking-wide">
              Spot the disconnect between Wall Street hype and C-Suite reality.
            </p>
            
            {/* Intro Ad Banner */}
            <div className="mt-12 opacity-90 hover:opacity-100 transition-opacity">
               <AdBanner variant="horizontal" className="my-12" />
            </div>
          </div>
        )}

        {status === AnalysisStatus.IDLE && (
          <TargetInput onSearch={handleSearch} status={status} />
        )}

        {/* Loading State - FLEX 3-COLUMN LAYOUT */}
        {(status === AnalysisStatus.SEARCHING || status === AnalysisStatus.ANALYZING) && (
          <div className="w-full max-w-[1400px] mx-auto py-10 animate-in fade-in duration-700">
             
             {/* Main Flex Row: Left Ad | Center Content | Right Ad */}
             <div className="flex flex-col md:flex-row items-start justify-center gap-6 lg:gap-12">
                
                {/* Left Area: Skyscraper */}
                <div className="hidden md:block shrink-0 pt-4">
                  <AdBanner variant="vertical" className="w-[160px] h-[600px] sticky top-24" />
                </div>

                {/* Center Area: Header + Square Ad */}
                <div className="flex-1 flex flex-col items-center w-full max-w-2xl mx-auto">
                   
                   {/* Status Text */}
                   <div className="text-center mb-8">
                      <h2 className="text-3xl font-serif font-bold text-slate-900 mb-3 flex items-center justify-center gap-3">
                         <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
                         Synthesizing Intelligence
                      </h2>
                      <div className="inline-block px-4 py-1 bg-white/60 backdrop-blur rounded-full border border-slate-200">
                        <p className="text-xs text-slate-600 font-bold uppercase tracking-widest animate-pulse">
                          {progressMsg}
                        </p>
                      </div>
                   </div>

                   {/* Square Ad Box */}
                   <div className="w-full bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-2xl shadow-indigo-200/40 border border-white ring-1 ring-indigo-50/50">
                      <div className="flex items-center justify-center mb-6">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Sponsored Advertisement</span>
                      </div>
                      <AdBanner variant="square" />
                      <div className="mt-6 pt-6 border-t border-slate-100">
                        <p className="text-center text-[10px] text-slate-400 font-mono">
                          Processing real-time vectors...
                        </p>
                      </div>
                   </div>
                </div>

                {/* Right Area: Skyscraper */}
                <div className="hidden md:block shrink-0 pt-4">
                   <AdBanner variant="vertical" className="w-[160px] h-[600px] sticky top-24" />
                </div>

             </div>
          </div>
        )}

        {/* Error State */}
        {status === AnalysisStatus.ERROR && (
          <div className="max-w-2xl mx-auto mt-10 bg-white border-l-4 border-rose-500 rounded-r-xl p-8 text-center shadow-2xl shadow-rose-200/50">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-rose-50 rounded-full">
                <AlertCircle className="h-10 w-10 text-rose-500" />
              </div>
            </div>
            <h3 className="text-xl font-bold font-serif text-slate-900 mb-2">Analysis Interrupted</h3>
            <p className="text-slate-600 font-light mb-6">{error}</p>
            <button 
              onClick={() => setStatus(AnalysisStatus.IDLE)}
              className="px-6 py-2 bg-slate-900 text-white rounded-lg text-sm font-bold uppercase tracking-wider hover:bg-slate-800 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Results */}
        {status === AnalysisStatus.COMPLETE && data && (
          <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700">
             
             {/* Result Header */}
             <div className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6 px-6 py-8 bg-white/70 backdrop-blur-md rounded-3xl border border-white shadow-xl shadow-indigo-100/60">
                <div className="flex flex-col md:flex-row md:items-baseline gap-4">
                  <h2 className="text-6xl font-bold text-slate-900 tracking-tighter font-serif">
                    {data.ticker} 
                  </h2>
                  <span className="text-indigo-900/60 text-2xl font-serif italic">
                    {data.companyName}
                  </span>
                </div>
                <button 
                  onClick={() => setStatus(AnalysisStatus.IDLE)}
                  className="px-6 py-3 bg-white border border-slate-200 text-slate-600 hover:text-white hover:bg-indigo-600 hover:border-indigo-600 hover:shadow-lg rounded-xl font-semibold transition-all text-sm uppercase tracking-wider"
                >
                  New Search
                </button>
             </div>
             
             {data.signal && <SignalCard signal={data.signal} />}

             <AlphaSpreadDisplay data={data} />

             <AnalysisCharts data={data} />
             
             <div className="my-16">
               <AdBanner variant="horizontal" />
             </div>
             
             <NewsFeed data={data} />
          </div>
        )}
      </main>

      <footer className="border-t border-slate-200 bg-white/60 backdrop-blur-lg py-12 text-slate-500 text-sm mt-auto relative z-10">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <div className="flex items-center justify-center gap-2 mb-6 opacity-40">
             <div className="h-px w-8 bg-slate-400"></div>
             <span className="font-serif italic text-lg text-slate-400">AQ</span>
             <div className="h-px w-8 bg-slate-400"></div>
          </div>
          <p className="mb-4 font-semibold text-slate-600 tracking-widest text-xs uppercase">&copy; {new Date().getFullYear()} Alpha Quelle</p>
          <div className="space-y-2 text-xs text-slate-400 leading-relaxed font-light">
            <p className="max-w-2xl mx-auto">
              <strong>Disclaimer:</strong> Alpha Quelle is an informational analysis tool provided for educational purposes only. The sentiment scores, signals, and data aggregations are generated by artificial intelligence based on public RSS feeds and do not constitute financial advice, investment recommendations, or an offer to sell or buy any securities. Trading stocks and financial instruments involves significant risk. Please consult a qualified financial advisor before making any investment decisions.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;