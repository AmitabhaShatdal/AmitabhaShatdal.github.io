import React, { useState, useEffect, useCallback, useMemo } from 'react';
import DataGrid from './DataGrid';
import MapView from './MapView';
import DetailModal from './DetailModal';
import AddItemModal from './AddItemModal';
import FilterBar from './FilterBar';
import { AppState, DatasetConfig, SheetRow, CardType } from '../../bulletinboardTypes';
import { heuristicAnalysis, parseCSV, DEMO_CSV } from '../../services/bulletinboardUtils';
import { SHEET_TABS } from '../../bulletinboardConfig';
import { Loader2, AlertCircle, Building2, GraduationCap, Map as MapIcon, Grid as GridIcon, ShoppingBag, ShoppingCart, Car, Plus, Trash2, RefreshCw, ExternalLink } from 'lucide-react';

const BulletinBoardApp: React.FC = () => {
  const [state, setState] = useState<AppState>(AppState.LOADING);
  const [dataset, setDataset] = useState<DatasetConfig | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedRow, setSelectedRow] = useState<SheetRow | null>(null);
  const [activeModal, setActiveModal] = useState<'add' | 'delete' | null>(null);
  const [activeTabId, setActiveTabId] = useState<string>(SHEET_TABS.length > 0 ? SHEET_TABS[0].id : 'Default');
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');
  
  // Filtering State
  const [priceBounds, setPriceBounds] = useState({ min: 0, max: 5000 });
  const [filters, setFilters] = useState({ minPrice: 0, maxPrice: 5000, minRooms: '' });

  // Get current tab config
  const activeTab = useMemo(() => SHEET_TABS.find(t => t.id === activeTabId) || SHEET_TABS[0], [activeTabId]);

  // Generate Google Sheets URL for current tab
  const getSheetUrl = useMemo(() => {
    if (!activeTab.sheetId) return null;
    return `https://docs.google.com/spreadsheets/d/${activeTab.sheetId}/edit#gid=${activeTab.gid}`;
  }, [activeTab]);

  // Determine Card Type
  const cardType: CardType = useMemo(() => {
      const lower = activeTabId.toLowerCase();
      if (lower.includes('student')) return 'student';
      if (lower.includes('sale')) return 'sale';
      if (lower.includes('wanted')) return 'wanted';
      if (lower.includes('carpool') || lower.includes('rides')) return 'carpool';
      return 'lease';
  }, [activeTabId]);

  const fetchAndProcessData = useCallback(async () => {
    setState(AppState.LOADING);
    setError(null);
    
    let csvText = '';
    let sourceName = 'Data';

    const currentTab = SHEET_TABS.find(t => t.id === activeTabId);
    const gid = currentTab?.gid || '0';
    const sheetId = currentTab?.sheetId;

    try {
        if (!sheetId) {
            console.log("No Sheet ID provided, using demo data.");
            csvText = DEMO_CSV;
        } else {
            const url = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&gid=${gid}`;
            const response = await fetch(url);
            
            if (!response.ok) {
                if (response.status === 404) throw new Error("Sheet not found.");
                if (response.status === 400) throw new Error("Invalid Tab GID.");
                throw new Error("Failed to load Google Sheet.");
            }
            csvText = await response.text();
            sourceName = activeTabId;
        }

        const { headers, rows } = parseCSV(csvText);
        
        if (rows.length === 0) {
            if (csvText.toLowerCase().includes('<!doctype html>')) {
               throw new Error("Failed to fetch CSV. The Sheet GID might be incorrect.");
            }
            throw new Error("This list is currently empty.");
        }

        const analysis = heuristicAnalysis(headers, rows);
        
        // Calculate Price Bounds
        let minP = 0;
        let maxP = 5000;
        if (analysis.mapping.priceField) {
            const prices = rows.map(r => {
                const val = r[analysis.mapping.priceField!];
                if (typeof val === 'number') return val;
                return parseFloat(String(val).replace(/[^0-9.]/g, ''));
            }).filter(n => !isNaN(n));
            
            if (prices.length > 0) {
                minP = Math.floor(Math.min(...prices));
                maxP = Math.ceil(Math.max(...prices));
            }
        }
        
        // Round bounds for cleaner UI
        minP = Math.floor(minP / 10) * 10;
        maxP = Math.ceil(maxP / 10) * 10;
        if (maxP === minP) maxP += 100;

        setPriceBounds({ min: minP, max: maxP });
        setFilters({ minPrice: minP, maxPrice: maxP, minRooms: '' });

        setDataset({
            name: sourceName,
            rows: rows,
            columns: headers,
            mapping: analysis.mapping,
            summary: analysis.summary
        });
        setState(AppState.READY);

    } catch (err: any) {
        console.error(err);
        setError(err.message || "An unexpected error occurred.");
        setState(AppState.ERROR);
    }
  }, [activeTabId]);

  useEffect(() => {
    fetchAndProcessData();
  }, [fetchAndProcessData]);

  // Reset view mode when tab changes
  useEffect(() => {
    if (activeTabId !== 'Lease Transfers') {
        setViewMode('grid');
    }
  }, [activeTabId]);

  // Filter Logic
  const filteredRows = useMemo(() => {
      if (!dataset) return [];
      
      return dataset.rows.filter(row => {
          if (dataset.mapping.priceField) {
             const val = row[dataset.mapping.priceField];
             const num = typeof val === 'number' ? val : parseFloat(String(val).replace(/[^0-9.]/g, ''));
             
             if (!isNaN(num)) {
                 if (num < filters.minPrice || num > filters.maxPrice) return false;
             }
          }
          
          if (filters.minRooms && dataset.mapping.roomField) {
             const val = row[dataset.mapping.roomField];
             const num = typeof val === 'number' ? val : parseFloat(String(val).match(/\d+/)?.[0] || '0');
             
             if (!isNaN(num)) {
                 const target = parseInt(filters.minRooms);
                 if (filters.minRooms === '4') {
                     if (num < 4) return false;
                 } else {
                     if (num !== target) return false;
                 }
             }
          }

          return true;
      });
  }, [dataset, filters]);

  // Tab Icon Helper
  const getTabIcon = (id: string) => {
      const lower = id.toLowerCase();
      if (lower.includes('student')) return <GraduationCap size={16} />;
      if (lower.includes('sale')) return <ShoppingBag size={16} />;
      if (lower.includes('wanted')) return <ShoppingCart size={16} />;
      if (lower.includes('carpool') || lower.includes('rides')) return <Car size={16} />;
      return <Building2 size={16} />;
  };

  const getHeroText = () => {
      const lower = activeTabId.toLowerCase();
      if (lower.includes('student')) {
          return { title: "Find a Roommate", subtitle: "Connect with students looking for housing." };
      }
      if (lower.includes('sale')) {
          return { title: "Marketplace", subtitle: "Merchandise For Sale" };
      }
      if (lower.includes('wanted')) {
           return { title: "Marketplace", subtitle: "Merchandise Wanted" };
      }
      if (activeTabId === 'Rides Available') {
           return { title: "Carpool", subtitle: "Rides Available" };
      }
      if (activeTabId === 'Carpool Requests') {
           return { title: "Carpool", subtitle: "Looking for a Ride" };
      }
      return { title: "Lease Transfers", subtitle: "Find your perfect place." };
  };

  // Determine correct label for the filter
  const roomFilterLabel = useMemo(() => {
      if (!dataset || !dataset.mapping.roomField) return 'Bedrooms';
      const h = dataset.mapping.roomField.toLowerCase();
      if (h.includes('rent') || h.includes('spot') || h.includes('avail') || h.includes('left')) return 'Rooms for Rent';
      if (h.includes('room')) return 'Rooms';
      return 'Bedrooms';
  }, [dataset]);

  const hero = getHeroText();
  
  // Feature Flags based on Tab
  const showLeaseTransferTools = activeTabId === 'Lease Transfers';
  const isMerchTab = activeTabId.toLowerCase().includes('sale') || activeTabId.toLowerCase().includes('wanted');
  const isCarpoolTab = activeTabId.toLowerCase().includes('carpool') || activeTabId.toLowerCase().includes('rides');
  
  // Show Filter Bar for Housing and Merchandise (For Sale only)
  const showFilterBar = activeTabId === 'Lease Transfers' || activeTabId.toLowerCase().includes('sale');

  return (
    <div className="min-h-[calc(100vh-8rem)]">
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* HERO SECTION */}
        <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-2" style={{ fontFamily: 'GentiumBookW, Georgia, serif' }}>
                {hero.title}
            </h1>
            <p className="text-slate-500 max-w-xl mx-auto text-base">
                {hero.subtitle}
            </p>
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex justify-center gap-3 mb-6">
            <button 
                onClick={() => fetchAndProcessData()}
                disabled={state === AppState.LOADING}
                className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-600 bg-white hover:bg-slate-50 border border-slate-200 rounded-full transition-all shadow-sm"
            >
                <RefreshCw size={16} className={state === AppState.LOADING ? "animate-spin" : ""} />
                <span>Refresh</span>
            </button>
            <button
                onClick={() => setActiveModal('add')}
                className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-full transition-all shadow-sm"
            >
                <Plus size={16} />
                <span>Post Listing</span>
            </button>
            <button
                onClick={() => setActiveModal('delete')}
                className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-500 hover:text-red-600 bg-white hover:bg-red-50 border border-slate-200 hover:border-red-200 rounded-full transition-all shadow-sm"
            >
                <Trash2 size={16} />
                <span>Delete</span>
            </button>
        </div>

        {/* TABS */}
        {SHEET_TABS.length > 1 && (
            <div className="flex justify-center mb-4">
                <div className="inline-flex items-center gap-1 p-1 bg-white border border-slate-200 rounded-full shadow-sm">
                    {SHEET_TABS.map(tab => {
                        const isActive = activeTabId === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTabId(tab.id)}
                                className={`
                                    flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all
                                    ${isActive 
                                        ? 'text-indigo-700 bg-indigo-50 shadow-sm' 
                                        : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'}
                                `}
                            >
                                <span className={isActive ? "text-indigo-500" : "text-slate-400"}>
                                    {getTabIcon(tab.id)}
                                </span>
                                <span className="hidden sm:inline">{tab.id}</span>
                            </button>
                        );
                    })}
                </div>
            </div>
        )}

        {/* Google Sheets Link */}
        {getSheetUrl && (
            <div className="flex justify-center mb-6">
                <a
                    href={getSheetUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-indigo-600 transition-colors"
                >
                    <ExternalLink size={12} />
                    <span>View source data in Google Sheets</span>
                </a>
            </div>
        )}

        {/* VIEW MODE TOGGLE - Only for Lease Transfers */}
        {showLeaseTransferTools && (
            <div className="flex justify-center mb-6">
                <div className="inline-flex items-center gap-1 p-1 bg-white border border-slate-200 rounded-full shadow-sm">
                    <button
                        onClick={() => setViewMode('grid')}
                        className={`p-2 rounded-full transition-all ${viewMode === 'grid' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
                        title="Grid View"
                    >
                        <GridIcon size={18} />
                    </button>
                    <button
                        onClick={() => setViewMode('map')}
                        className={`p-2 rounded-full transition-all ${viewMode === 'map' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
                        title="Map View"
                    >
                        <MapIcon size={18} />
                    </button>
                </div>
            </div>
        )}

        {/* FILTER BAR */}
        {showFilterBar && state === AppState.READY && (
            <FilterBar 
                filters={filters}
                priceBounds={priceBounds}
                onFilterChange={(changes) => setFilters(prev => ({ ...prev, ...changes }))}
                onClear={() => setFilters({ minPrice: priceBounds.min, maxPrice: priceBounds.max, minRooms: '' })}
                roomLabel={roomFilterLabel}
                showRoomFilter={!isMerchTab}
            />
        )}

        {/* LOADING */}
        {state === AppState.LOADING && (
          <div className="flex flex-col items-center justify-center min-h-[40vh]">
            <Loader2 size={40} className="text-indigo-500 animate-spin" />
            <p className="text-slate-500 mt-4 font-medium">Loading listings...</p>
          </div>
        )}

        {/* ERROR */}
        {state === AppState.ERROR && (
          <div className="flex flex-col items-center justify-center min-h-[40vh] text-center">
            <div className="bg-red-50 p-4 rounded-full mb-4">
                <AlertCircle size={32} className="text-red-500" />
            </div>
            <h2 className="text-lg font-bold text-slate-800 mb-2">Unable to load data</h2>
            <p className="text-slate-500 mb-6 max-w-md text-sm">{error}</p>
            <button 
                onClick={() => fetchAndProcessData()}
                className="bg-white hover:bg-slate-50 text-slate-700 px-5 py-2 rounded-full font-semibold transition-colors border border-slate-200 shadow-sm"
            >
                Try Again
            </button>
          </div>
        )}

        {/* CONTENT */}
        {state === AppState.READY && dataset && (
          <div>
             {/* Grid View */}
             <div className={viewMode === 'grid' || isMerchTab || isCarpoolTab ? 'block' : 'hidden'}>
                 <DataGrid 
                    rows={filteredRows} 
                    mapping={dataset.mapping} 
                    onItemClick={setSelectedRow}
                    cardType={cardType}
                 />
             </div>

             {/* Map View */}
             {showLeaseTransferTools && (
                 <div className={viewMode === 'map' ? 'block' : 'hidden'}>
                     <MapView 
                        rows={filteredRows}
                        mapping={dataset.mapping}
                        onItemClick={setSelectedRow}
                        isVisible={viewMode === 'map'}
                     />
                 </div>
             )}
          </div>
        )}

        {/* MODALS */}
        {selectedRow && dataset && (
            <DetailModal 
                row={selectedRow} 
                mapping={dataset.mapping} 
                onClose={() => setSelectedRow(null)}
                cardType={cardType}
            />
        )}

        {activeModal && activeTab && (
            <AddItemModal 
                onClose={() => setActiveModal(null)} 
                formUrl={activeModal === 'add' ? (activeTab.formUrl || '') : (activeTab.deleteUrl || '')}
                title={activeModal === 'add' ? `Post to ${activeTab.id}` : `Delete from ${activeTab.id}`}
                message={activeModal === 'delete' ? "Check your email for your listing's ID." : undefined}
            />
        )}

      </main>
    </div>
  );
};

export default BulletinBoardApp;
