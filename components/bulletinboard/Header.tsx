import React from 'react';
import { Home, RefreshCw, Plus, Trash2 } from 'lucide-react';
import { GOOGLE_FORM_URL } from '../../bulletinboardConfig';

interface HeaderProps {
  appName?: string;
  isSyncing: boolean;
  onRefresh: () => void;
  onAddItem: () => void;
  onDeleteListing: () => void;
}

const Header: React.FC<HeaderProps> = ({ appName = "Housing Portal", isSyncing, onRefresh, onAddItem, onDeleteListing }) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
      <div className="glass-panel border-b border-white/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            {/* Logo Area */}
            <div className="flex items-center gap-3">
                <div className="relative group cursor-pointer">
                    <div className="bg-blue-50 border border-blue-100 p-2 rounded-xl relative shadow-sm">
                        <Home size={20} className="text-blue-600" />
                    </div>
                </div>
                <h1 className="text-lg font-bold tracking-tight text-slate-800 hidden sm:block">
                    {appName}
                </h1>
            </div>
            
            {/* Actions */}
            <div className="flex items-center gap-2 sm:gap-3">
                <button 
                    onClick={onRefresh}
                    disabled={isSyncing}
                    className={`
                        p-2 rounded-lg border transition-all duration-200
                        ${isSyncing 
                            ? 'bg-blue-50 text-blue-600 border-blue-100' 
                            : 'bg-transparent text-slate-500 border-transparent hover:bg-slate-100 hover:text-slate-800'}
                    `}
                    title="Refresh Data"
                >
                    <RefreshCw size={18} className={isSyncing ? "animate-spin" : ""} />
                </button>

                <div className="h-6 w-px bg-slate-200 mx-1 hidden sm:block"></div>

                <button
                    onClick={onDeleteListing}
                    className="flex items-center gap-2 text-sm text-slate-500 hover:text-red-600 hover:bg-red-50 px-3 py-2 rounded-lg font-medium transition-colors"
                >
                    <Trash2 size={16} />
                    <span className="hidden sm:inline">Delete Listing</span>
                </button>

                {GOOGLE_FORM_URL && (
                    <button 
                        onClick={onAddItem}
                        className="flex items-center gap-2 text-sm text-white bg-blue-600 hover:bg-blue-500 active:bg-blue-700 transition-all px-4 py-2 rounded-lg font-semibold shadow-lg shadow-blue-500/20 border border-blue-500/10 group"
                    >
                        <Plus size={16} className="group-hover:rotate-90 transition-transform duration-200" />
                        <span>Post Listing</span>
                    </button>
                )}
            </div>
        </div>
      </div>
    </header>
  );
};

export default Header;