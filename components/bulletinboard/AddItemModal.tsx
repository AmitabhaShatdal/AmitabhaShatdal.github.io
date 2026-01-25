import React from 'react';
import { X, ExternalLink, Info } from 'lucide-react';

interface AddItemModalProps {
  onClose: () => void;
  formUrl: string;
  title: string;
  message?: string;
}

const AddItemModal: React.FC<AddItemModalProps> = ({ onClose, formUrl, title, message }) => {
  if (!formUrl) return null;

  // Ensure the URL is embedded properly if possible, or just use iframe
  // Google Forms often have /viewform?embedded=true
  let embedUrl = formUrl;
  if (!embedUrl.includes('embedded=true')) {
      embedUrl += embedUrl.includes('?') ? '&embedded=true' : '?embedded=true';
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>
      
      <div className="relative bg-slate-900 border border-slate-700 w-full max-w-4xl h-[90vh] rounded-2xl shadow-2xl animate-scale-up flex flex-col overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-900">
            <h3 className="text-lg font-semibold text-white">{title}</h3>
            <div className="flex items-center gap-4">
                <a 
                    href={formUrl} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="text-slate-400 hover:text-blue-400 text-sm flex items-center gap-1"
                >
                    Open in new tab <ExternalLink size={12} />
                </a>
                <button 
                    onClick={onClose}
                    className="p-1 hover:bg-slate-800 rounded-full transition-colors text-slate-400 hover:text-white"
                >
                    <X size={24} />
                </button>
            </div>
        </div>

        {message && (
            <div className="bg-amber-50/10 border-b border-amber-500/20 p-4 flex gap-3 text-amber-100 text-sm">
                <Info size={20} className="shrink-0 text-amber-400" />
                <p>{message}</p>
            </div>
        )}

        <div className="flex-1 bg-white">
            <iframe 
                src={embedUrl} 
                className="w-full h-full border-0"
                title={title}
            >
                Loading...
            </iframe>
        </div>
      </div>
    </div>
  );
};

export default AddItemModal;