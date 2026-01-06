import React from 'react';
import { X, Brain, Search, Scale, Globe, ShieldCheck } from 'lucide-react';

interface MethodologyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const MethodologyModal: React.FC<MethodologyModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-all" onClick={onClose} />
      <div className="relative bg-white border border-slate-200 rounded-none shadow-2xl max-w-2xl w-full p-10 max-h-[90vh] overflow-y-auto ring-1 ring-slate-900/5">
        
        <button 
          onClick={onClose}
          className="absolute right-5 top-5 p-2 rounded-full text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-all"
        >
          <X className="h-5 w-5" />
        </button>

        <h2 className="text-4xl font-serif font-bold text-slate-900 mb-8 tracking-tight">Algorithm & Methodology</h2>

        <div className="space-y-12">
          
          {/* Step 1 */}
          <div className="flex gap-6">
            <div className="bg-slate-50 p-4 rounded-full h-fit border border-slate-200 shrink-0">
              <Globe className="h-6 w-6 text-slate-700" />
            </div>
            <div>
              <h3 className="text-xl font-serif font-bold text-slate-900 mb-3">1. Global Multi-Vector Sourcing</h3>
              <p className="text-slate-600 text-sm leading-relaxed font-light">
                We bypass standard aggregators by deploying parallel data streams across <strong>5 distinct intelligence clusters</strong>:
              </p>
              <ul className="mt-4 grid grid-cols-2 gap-3 text-xs text-slate-500 font-medium">
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>Tier-1 Financials (WSJ, Seeking Alpha)</li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>Global Majors (BBC, Guardian)</li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>APAC & Regional (Nikkei, Haaretz)</li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>Industry & Tech (TechCrunch, OilPrice)</li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>Niche Sources (Scientific American)</li>
              </ul>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex gap-6">
            <div className="bg-slate-50 p-4 rounded-full h-fit border border-slate-200 shrink-0">
              <ShieldCheck className="h-6 w-6 text-slate-700" />
            </div>
            <div>
              <h3 className="text-xl font-serif font-bold text-slate-900 mb-3">2. Strict Entity Verification</h3>
              <p className="text-slate-600 text-sm leading-relaxed font-light">
                To eliminate high-noise false positives (e.g., confusing "Pool Corp" with swimming pools or "Apple" with fruit), our engine uses a <strong>Multi-Stage Validation Gate</strong>. 
                Articles are only ingested if they pass strict criteria: exact ticker matches, full corporate identity verification, or specific financial context triggers.
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex gap-6">
            <div className="bg-slate-50 p-4 rounded-full h-fit border border-slate-200 shrink-0">
              <Brain className="h-6 w-6 text-slate-700" />
            </div>
            <div>
              <h3 className="text-xl font-serif font-bold text-slate-900 mb-3">3. Dual-Layer Contextual AI</h3>
              <p className="text-slate-600 text-sm leading-relaxed font-light mb-4">
                Text is analyzed through two distinct processing lenses:
              </p>
              <div className="space-y-3">
                <div className="bg-slate-50 p-4 rounded border border-slate-100">
                   <strong className="text-slate-900 text-xs uppercase tracking-widest block mb-1">Layer A: Corporate Tone</strong>
                   <p className="text-xs text-slate-500">Parses C-Suite statements for confidence, hesitation, strategic pivots, and guidance language.</p>
                </div>
                <div className="bg-slate-50 p-4 rounded border border-slate-100">
                   <strong className="text-slate-900 text-xs uppercase tracking-widest block mb-1">Layer B: Market Action</strong>
                   <p className="text-xs text-slate-500">Parses analyst ratings, price target adjustments, and volume descriptors.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Step 4 */}
          <div className="flex gap-6">
            <div className="bg-slate-50 p-4 rounded-full h-fit border border-slate-200 shrink-0">
              <Scale className="h-6 w-6 text-slate-700" />
            </div>
            <div>
              <h3 className="text-xl font-serif font-bold text-slate-900 mb-3">4. Signal Synthesis</h3>
              <p className="text-slate-600 text-sm leading-relaxed font-light">
                We don't just average scores. We look for <strong>Divergence</strong> (when management is confident but the market is bearish) or <strong>Consensus</strong> (when both align strongly).
              </p>
            </div>
          </div>

        </div>

        <div className="mt-12 pt-8 border-t border-slate-200 text-center">
          <button 
            onClick={onClose}
            className="px-8 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold tracking-wider uppercase text-xs transition-colors shadow-xl shadow-slate-900/20"
          >
            Close Documentation
          </button>
        </div>
      </div>
    </div>
  );
};

export default MethodologyModal;