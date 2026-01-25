import React, { useState, useEffect } from 'react';
import { Bed, X, DollarSign, ChevronDown } from 'lucide-react';

interface FilterState {
  minPrice: number;
  maxPrice: number;
  minRooms: string;
}

interface FilterBarProps {
  filters: FilterState;
  priceBounds: { min: number; max: number };
  onFilterChange: (changes: Partial<FilterState>) => void;
  onClear: () => void;
  roomLabel?: string;
  showRoomFilter?: boolean;
}

const FilterBar: React.FC<FilterBarProps> = ({ 
    filters, 
    priceBounds, 
    onFilterChange, 
    onClear, 
    roomLabel = 'Bedrooms',
    showRoomFilter = true 
}) => {
  const hasFilters = filters.minPrice > priceBounds.min || filters.maxPrice < priceBounds.max || filters.minRooms !== '';
  
  const [localMin, setLocalMin] = useState(filters.minPrice);
  const [localMax, setLocalMax] = useState(filters.maxPrice);

  const range = priceBounds.max - priceBounds.min;
  const step = range <= 100 ? 1 : range <= 500 ? 5 : range <= 2000 ? 10 : range <= 10000 ? 50 : 100;

  useEffect(() => {
    setLocalMin(filters.minPrice);
    setLocalMax(filters.maxPrice);
  }, [filters.minPrice, filters.maxPrice]);

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'min' | 'max') => {
    const val = Number(e.target.value);
    const minGap = step * 2;

    if (type === 'min') {
      const newMin = Math.min(val, localMax - minGap);
      setLocalMin(newMin);
      onFilterChange({ minPrice: newMin, maxPrice: localMax });
    } else {
      const newMax = Math.max(val, localMin + minGap);
      setLocalMax(newMax);
      onFilterChange({ minPrice: localMin, maxPrice: newMax });
    }
  };

  const getPercent = (value: number) => {
     if (priceBounds.max === priceBounds.min) return 0;
     return ((value - priceBounds.min) / (priceBounds.max - priceBounds.min)) * 100;
  };

  const getSingular = (label: string) => {
    if (label === 'Rooms for Rent') return 'Room for Rent';
    if (label.endsWith('s')) return label.slice(0, -1);
    return label;
  };

  const minPercent = getPercent(localMin);
  const maxPercent = getPercent(localMax);
  const singularLabel = getSingular(roomLabel);

  const sliderStyles = `
    .dual-range-wrap {
      position: relative;
      height: 24px;
      margin: 6px 0;
    }
    .dual-range-track {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      left: 0;
      right: 0;
      height: 4px;
      background: #e2e8f0;
      border-radius: 2px;
    }
    .dual-range-active {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      height: 4px;
      background: #4f46e5;
      border-radius: 2px;
    }
    .dual-range-input {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      left: 0;
      width: 100%;
      height: 4px;
      -webkit-appearance: none;
      appearance: none;
      background: transparent;
      pointer-events: none;
      margin: 0;
      padding: 0;
    }
    .dual-range-input::-webkit-slider-runnable-track {
      -webkit-appearance: none;
      width: 100%;
      height: 4px;
      background: transparent;
    }
    .dual-range-input::-webkit-slider-thumb {
      -webkit-appearance: none;
      width: 16px;
      height: 16px;
      margin-top: -6px;
      background: white;
      border: 2px solid #4f46e5;
      border-radius: 50%;
      box-shadow: 0 1px 4px rgba(0,0,0,0.2);
      cursor: grab;
      pointer-events: auto;
    }
    .dual-range-input::-webkit-slider-thumb:hover {
      border-color: #3730a3;
      box-shadow: 0 2px 6px rgba(79,70,229,0.3);
    }
    .dual-range-input::-webkit-slider-thumb:active {
      cursor: grabbing;
    }
    .dual-range-input::-moz-range-track {
      width: 100%;
      height: 4px;
      background: transparent;
    }
    .dual-range-input::-moz-range-thumb {
      width: 16px;
      height: 16px;
      background: white;
      border: 2px solid #4f46e5;
      border-radius: 50%;
      box-shadow: 0 1px 4px rgba(0,0,0,0.2);
      cursor: grab;
      pointer-events: auto;
    }
  `;

  return (
    <div className="w-full max-w-4xl mx-auto mb-8">
        <style>{sliderStyles}</style>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
            <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-6">
                
                {/* Price Filter Section */}
                <div className="flex-1 flex flex-col gap-2">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2 text-slate-500 font-semibold text-xs uppercase tracking-wider">
                            <DollarSign size={14} />
                            <span>Price Range</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm font-semibold text-slate-800 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                            <span>${localMin.toLocaleString()}</span>
                            <span className="text-slate-300">—</span>
                            <span>${localMax.toLocaleString()}</span>
                        </div>
                    </div>

                    {/* Dual Range Slider */}
                    <div className="dual-range-wrap">
                        <div className="dual-range-track"></div>
                        <div 
                            className="dual-range-active"
                            style={{ 
                                left: `${minPercent}%`, 
                                right: `${100 - maxPercent}%` 
                            }}
                        ></div>
                        <input 
                            type="range"
                            min={priceBounds.min}
                            max={priceBounds.max}
                            step={step}
                            value={localMin}
                            onChange={(e) => handlePriceChange(e, 'min')}
                            className="dual-range-input"
                            style={{ zIndex: 3 }}
                        />
                        <input 
                            type="range"
                            min={priceBounds.min}
                            max={priceBounds.max}
                            step={step}
                            value={localMax}
                            onChange={(e) => handlePriceChange(e, 'max')}
                            className="dual-range-input"
                            style={{ zIndex: 4 }}
                        />
                    </div>
                </div>

                {/* Divider */}
                {showRoomFilter && (
                    <div className="hidden lg:block w-px h-12 bg-slate-200"></div>
                )}

                {/* Room Filter Section */}
                {showRoomFilter && (
                    <div className="w-full lg:w-56 flex flex-col gap-3">
                        <div className="flex items-center gap-2 text-slate-500 font-semibold text-xs uppercase tracking-wider">
                            <Bed size={14} />
                            <span>{roomLabel}</span>
                        </div>
                        
                        <div className="relative">
                            <select
                                value={filters.minRooms}
                                onChange={(e) => onFilterChange({ minRooms: e.target.value })}
                                className="w-full appearance-none bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-medium py-2.5 pl-4 pr-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all cursor-pointer"
                            >
                                <option value="">Any</option>
                                <option value="1">1 {singularLabel}</option>
                                <option value="2">2 {roomLabel}</option>
                                <option value="3">3 {roomLabel}</option>
                                <option value="4">4+ {roomLabel}</option>
                            </select>
                            <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-slate-400">
                                <ChevronDown size={16} />
                            </div>
                        </div>
                    </div>
                )}

                {/* Reset Button - Always visible */}
                <button 
                    onClick={onClear}
                    disabled={!hasFilters}
                    className={`flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-lg transition-all min-w-[90px] ${
                        hasFilters 
                            ? 'text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 cursor-pointer' 
                            : 'text-slate-300 bg-slate-50 border border-slate-100 cursor-default'
                    }`}
                >
                    <X size={16} />
                    <span>Reset</span>
                </button>
            </div>
        </div>
    </div>
  );
};

export default FilterBar;
