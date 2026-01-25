import React from 'react';
import { ExternalLink, Calendar, User, MessageSquare, Newspaper, Mic, FileText, Twitter } from 'lucide-react';
import { CompanyAnalysisResult } from '../types';

interface NewsFeedProps {
  data: CompanyAnalysisResult;
}

const SourceIcon = ({ source }: { source: string }) => {
  const s = source.toLowerCase();
  if (s.includes("tweet") || s.includes("twitter") || s.includes("x.com")) return <Twitter className="h-3 w-3 text-sky-500" />;
  if (s.includes("reddit") || s.includes("social")) return <MessageSquare className="h-3 w-3 text-orange-500" />;
  if (s.includes("earnings") || s.includes("call") || s.includes("transcript")) return <Mic className="h-3 w-3 text-rose-500" />;
  if (s.includes("sec") || s.includes("filing") || s.includes("report")) return <FileText className="h-3 w-3 text-slate-500" />;
  return <Newspaper className="h-3 w-3 text-indigo-500" />;
};

const NewsFeed: React.FC<NewsFeedProps> = ({ data }) => {
  return (
    <div className="space-y-8">
      <div className="flex items-end justify-between border-b border-slate-200 pb-5">
        <div>
          <h3 className="text-3xl font-serif font-bold text-slate-900 mb-2">Market Intelligence</h3>
          <p className="text-sm text-slate-500 font-medium tracking-wide uppercase">
            Live Data Feed
          </p>
        </div>
        <div className="text-right">
          <span className="text-4xl font-serif font-bold text-slate-900">{data.items.length}</span>
          <span className="text-[10px] text-slate-400 block uppercase tracking-widest font-semibold mt-1">Sources</span>
        </div>
      </div>
      
      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-h-[800px] overflow-y-auto pr-2 custom-scrollbar pb-6">
        {data.items.map((item, idx) => (
          <div 
            key={idx} 
            className="group relative bg-white border border-slate-100 rounded-xl p-6 transition-all duration-500 flex flex-col shadow-sm hover:shadow-2xl hover:shadow-indigo-100/50 hover:-translate-y-1 hover:border-indigo-100"
          >
             {/* Accent Bar - Neutral Color */}
             <div className="absolute top-0 left-0 right-0 h-1 rounded-t-xl bg-slate-200 opacity-80 group-hover:bg-indigo-500 group-hover:opacity-100 transition-all duration-300" />

            {/* Header */}
            <div className="flex items-start justify-between mb-4">
               {item.relatedExecutive !== "General" ? (
                <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-indigo-900 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
                  <User className="h-3 w-3" />
                  <span className="truncate max-w-[100px]">{item.relatedExecutive}</span>
                </div>
               ) : (
                 <div className="h-6"></div> // Spacer to keep alignment
               )}
            </div>

            <h4 className="text-lg font-serif font-bold text-slate-900 mb-3 leading-snug group-hover:text-indigo-800 transition-colors">
              {item.link ? (
                <a 
                  href={item.link} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="line-clamp-2"
                >
                  {item.headline} <ExternalLink className="inline h-3 w-3 ml-1 mb-1 opacity-0 group-hover:opacity-100 transition-opacity text-indigo-400" />
                </a>
              ) : (
                <span className="line-clamp-2">{item.headline}</span>
              )}
            </h4>
            
            <p className="text-slate-600 text-sm mb-6 flex-grow line-clamp-4 leading-relaxed font-light border-l-2 border-slate-100 pl-4 group-hover:border-indigo-200 transition-colors">
              {item.summary}
            </p>

            <div className="pt-4 mt-auto border-t border-slate-50 flex justify-between items-center text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              <div className="flex items-center gap-2">
                <div className="p-1 bg-slate-50 rounded-full border border-slate-100 group-hover:bg-white group-hover:border-indigo-100 transition-colors">
                  <SourceIcon source={item.source} />
                </div>
                <span className="truncate max-w-[120px]" title={item.source}>{item.source}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-3 w-3" />
                <span>{item.date}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Grounding Sources */}
      {data.groundingLinks && data.groundingLinks.length > 0 && (
        <div className="mt-12 pt-8 border-t border-slate-200">
           <div className="flex items-center justify-between mb-6">
             <h4 className="text-xs font-bold text-slate-900 uppercase tracking-widest flex items-center gap-2">
               <span className="w-2 h-2 bg-slate-900 rounded-full"></span>
               Verified Data Citations ({data.groundingLinks.length})
             </h4>
           </div>
           <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto custom-scrollbar">
             {data.groundingLinks.map((chunk, i) => {
               if (chunk.web?.uri) {
                 return (
                   <a 
                    key={i}
                    href={chunk.web.uri}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="
                      group
                      inline-flex items-center gap-1.5 
                      px-4 py-2 rounded-full 
                      text-[11px] font-medium tracking-wide text-slate-600
                      backdrop-blur-md bg-white/40
                      ring-1 ring-slate-200/70
                      shadow-sm
                      hover:bg-white/60 hover:ring-white hover:shadow-md hover:text-slate-900
                      active:scale-95 active:shadow-inner active:ring-transparent
                      transition-all duration-200 ease-out
                      truncate max-w-[240px]
                    "
                   >
                     <ExternalLink className="h-3 w-3 opacity-50 group-hover:opacity-100 transition-opacity" />
                     <span className="truncate">{chunk.web.title || new URL(chunk.web.uri).hostname}</span>
                   </a>
                 );
               }
               return null;
             })}
           </div>
        </div>
      )}
    </div>
  );
};

export default NewsFeed;
