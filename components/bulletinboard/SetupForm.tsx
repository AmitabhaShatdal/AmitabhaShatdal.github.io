import React, { useState, useRef } from 'react';
import { Upload, Link as LinkIcon, FileText, Play, Database } from 'lucide-react';
import { parseCSV } from '../services/utils';
import { SheetRow } from '../types';

interface SetupFormProps {
  onDataLoaded: (rows: SheetRow[], headers: string[], sourceName: string) => void;
  onError: (msg: string) => void;
}

const SetupForm: React.FC<SetupFormProps> = ({ onDataLoaded, onError }) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'url' | 'paste'>('url');
  const [url, setUrl] = useState('');
  const [pasteContent, setPasteContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUrlSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;
    setIsLoading(true);
    try {
      // Basic check to see if it's a Google Sheet generic URL, try to convert to export link
      let fetchUrl = url;
      if (url.includes('docs.google.com/spreadsheets') && !url.includes('output=csv')) {
         // Attempt to convert generic edit URL to export URL
         // https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit... -> https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/export?format=csv
         const match = url.match(/\/d\/([a-zA-Z0-9-_]+)/);
         if (match && match[1]) {
            fetchUrl = `https://docs.google.com/spreadsheets/d/${match[1]}/export?format=csv`;
         }
      }

      const response = await fetch(fetchUrl);
      if (!response.ok) throw new Error('Failed to fetch CSV');
      const text = await response.text();
      processCSV(text, 'Imported from URL');
    } catch (err) {
      onError("Could not fetch data. Ensure the sheet is 'Published to Web' or the URL is a direct CSV link.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      processCSV(text, file.name.replace('.csv', ''));
    };
    reader.readAsText(file);
  };

  const handlePasteSubmit = () => {
    if (!pasteContent.trim()) return;
    processCSV(pasteContent, 'Pasted Data');
  };

  const processCSV = (text: string, sourceName: string) => {
    try {
      const { headers, rows } = parseCSV(text);
      if (rows.length === 0) {
        onError("No valid rows found in the CSV data.");
        return;
      }
      onDataLoaded(rows, headers, sourceName);
    } catch (err) {
      onError("Failed to parse CSV data.");
    }
  };

  const loadDemoData = () => {
    const demoCSV = `
ID,Product Name,Description,Price,Category,Image URL,Rating
1,Neon Cyber Deck,High-performance cyberdeck with holographic display.,2999,Electronics,https://picsum.photos/400/300?random=1,4.8
2,Quantum Processor,Next-gen quantum computing core for AI tasks.,5400,Hardware,https://picsum.photos/400/300?random=2,5.0
3,Neural Interface,Direct brain-computer interface for seamless connectivity.,1200,Implants,https://picsum.photos/400/300?random=3,4.5
4,Plasma Cutter,Industrial grade plasma cutter for heavy duty modifications.,850,Tools,https://picsum.photos/400/300?random=4,4.2
5,Stealth Drone,Silent reconnaissance drone with 4K optics.,1500,Drones,https://picsum.photos/400/300?random=5,4.7
6,Holo-Projector,Portable 3D hologram projector for field briefings.,600,Gadgets,https://picsum.photos/400/300?random=6,4.0
    `.trim();
    processCSV(demoCSV, "CyberShop Demo");
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6 glass-panel rounded-2xl shadow-2xl animate-fade-in-up">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2 text-white">Connect Your Data</h2>
        <p className="text-slate-400">Turn your Google Sheet or CSV into a stunning website in seconds.</p>
      </div>

      <div className="flex gap-2 mb-6 p-1 bg-slate-800/50 rounded-lg">
        {[
            { id: 'url', label: 'Link', icon: LinkIcon },
            { id: 'upload', label: 'Upload', icon: Upload },
            { id: 'paste', label: 'Paste', icon: FileText }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-sm font-medium transition-all ${
              activeTab === tab.id 
                ? 'bg-blue-600 text-white shadow-lg' 
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <tab.icon size={16} />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="min-h-[200px] flex flex-col justify-center">
        {activeTab === 'url' && (
          <form onSubmit={handleUrlSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Google Sheet Public URL</label>
              <input
                type="text"
                placeholder="https://docs.google.com/spreadsheets/..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
              />
              <p className="text-xs text-slate-500">
                Ensure your Google Sheet is published to the web (File {'>'} Share {'>'} Publish to web {'>'} CSV).
              </p>
            </div>
            <button
              type="submit"
              disabled={isLoading || !url}
              className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition-all flex items-center justify-center gap-2"
            >
              {isLoading ? <span className="animate-spin">⌛</span> : <Play size={18} />}
              Generate Website
            </button>
          </form>
        )}

        {activeTab === 'upload' && (
          <div className="border-2 border-dashed border-slate-700 rounded-xl p-8 text-center hover:border-blue-500 hover:bg-slate-800/30 transition-all cursor-pointer group"
               onClick={() => fileInputRef.current?.click()}>
            <input 
                type="file" 
                ref={fileInputRef}
                accept=".csv"
                className="hidden" 
                onChange={handleFileUpload}
            />
            <div className="w-16 h-16 bg-blue-600/20 text-blue-400 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
              <Upload size={32} />
            </div>
            <h3 className="text-lg font-medium text-white mb-1">Click to upload CSV</h3>
            <p className="text-slate-400 text-sm">Or drag and drop your file here</p>
          </div>
        )}

        {activeTab === 'paste' && (
          <div className="space-y-4">
            <textarea
              placeholder="Paste your CSV data here..."
              value={pasteContent}
              onChange={(e) => setPasteContent(e.target.value)}
              className="w-full h-48 bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none font-mono text-xs"
            />
            <button
              onClick={handlePasteSubmit}
              disabled={!pasteContent.trim()}
              className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold py-3 rounded-lg transition-all flex items-center justify-center gap-2"
            >
              <Play size={18} />
              Visualize Data
            </button>
          </div>
        )}
      </div>

      <div className="mt-8 pt-6 border-t border-slate-800 text-center">
        <button 
          onClick={loadDemoData}
          className="text-sm text-slate-400 hover:text-blue-400 flex items-center justify-center gap-2 mx-auto transition-colors"
        >
          <Database size={14} />
          Try with Demo Data
        </button>
      </div>
    </div>
  );
};

export default SetupForm;
