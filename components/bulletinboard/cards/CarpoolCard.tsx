
import React from 'react';
import { SheetRow, FieldMapping } from '../../../bulletinboardTypes';
import { ArrowUpRight, MapPin, Clock, Users, ArrowRight, Calendar, Tag } from 'lucide-react';

interface CardProps {
  row: SheetRow;
  mapping: FieldMapping;
  onClick: () => void;
  isRequest?: boolean;
}

const CarpoolCard: React.FC<CardProps> = ({ row, mapping, onClick, isRequest = false }) => {
  const name = mapping.titleField ? String(row[mapping.titleField]) : 'Anonymous';
  const description = mapping.descriptionField ? String(row[mapping.descriptionField]) : '';
  const origin = mapping.originField ? String(row[mapping.originField]) : 'Unknown';
  const destination = mapping.destinationField ? String(row[mapping.destinationField]) : 'Unknown';
  const departure = mapping.departureTimeField ? String(row[mapping.departureTimeField]) : null;
  const returnTime = mapping.returnTimeField ? String(row[mapping.returnTimeField]) : null;
  const capacity = mapping.capacityField ? String(row[mapping.capacityField]) : null;

  // For Requests, 'capacity' usually isn't there, but "willing to pay for gas" might be in features
  const features = mapping.featuresFields || [];
  const gasPref = features.find(f => f.toLowerCase().includes('gas'));
  const gasVal = gasPref ? String(row[gasPref]) : null;

  return (
    <div 
      className="group relative bg-white rounded-2xl border border-slate-200 overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-blue-900/5 cursor-pointer flex flex-col h-full border-l-4 border-l-blue-400"
      onClick={onClick}
    >
      <div className="p-6 flex-1 flex flex-col">
        
        {/* Header: Route */}
        <div className="flex items-center gap-2 mb-6 text-slate-800">
             <div className="flex-1 min-w-0">
                 <div className="flex items-center gap-1 text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">
                     <MapPin size={10} /> Origin
                 </div>
                 <div className="font-bold text-lg leading-tight truncate" title={origin}>
                     {origin}
                 </div>
             </div>
             
             <div className="text-blue-400 flex flex-col items-center justify-center">
                 <ArrowRight size={20} />
             </div>

             <div className="flex-1 min-w-0 text-right">
                 <div className="flex items-center justify-end gap-1 text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">
                     Destination <MapPin size={10} />
                 </div>
                 <div className="font-bold text-lg leading-tight truncate" title={destination}>
                     {destination}
                 </div>
             </div>
        </div>

        {/* Timings */}
        <div className="space-y-3 mb-6">
            {departure && (
                <div className="flex items-start gap-3 bg-blue-50/50 p-3 rounded-xl border border-blue-100/50">
                    <Calendar size={18} className="text-blue-600 mt-0.5" />
                    <div>
                        <span className="block text-[10px] font-bold text-blue-600 uppercase tracking-wide">Departure</span>
                        <span className="text-sm font-semibold text-slate-700">{departure}</span>
                    </div>
                </div>
            )}
            {returnTime && (
                <div className="flex items-start gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <Clock size={18} className="text-slate-400 mt-0.5" />
                    <div>
                        <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide">Return</span>
                        <span className="text-sm font-semibold text-slate-600">{returnTime}</span>
                    </div>
                </div>
            )}
        </div>

        {/* Driver/Rider Info */}
        <div className="flex items-center justify-between mb-4">
             <div className="flex items-center gap-2">
                 <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                     {name.slice(0, 2).toUpperCase()}
                 </div>
                 <div className="text-sm font-medium text-slate-700 max-w-[120px] truncate">
                     {name}
                 </div>
             </div>

             {/* Badge: Seats or Gas */}
             {!isRequest && capacity && (
                 <span className="bg-blue-50 text-blue-700 border border-blue-100 text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                     <Users size={12} /> {capacity} Seat{capacity !== '1' ? 's' : ''}
                 </span>
             )}
             {isRequest && gasVal && (
                 <span className="bg-blue-50 text-blue-700 border border-blue-100 text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                     Gas: {gasVal}
                 </span>
             )}
        </div>

        {/* Features / Preferences (if any, excluding gas which is handled) */}
        {features.length > 0 && (
             <div className="flex flex-wrap gap-1.5 mb-4">
                 {features.map(f => {
                     if (f.toLowerCase().includes('gas')) return null; // handled in badge
                     const val = row[f];
                     if (!val) return null;
                     return (
                         <span key={f} className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-1 rounded-md bg-slate-50 text-slate-500 border border-slate-100">
                             <Tag size={10} /> {f}: {String(val)}
                         </span>
                     );
                 })}
             </div>
        )}

        {description && (
            <p className="text-slate-500 text-xs line-clamp-2 mb-4 flex-1 leading-relaxed italic border-t border-slate-100 pt-3">
                "{description}"
            </p>
        )}
        
        <div className="mt-auto pt-3 flex items-center justify-between text-xs font-medium text-slate-400">
            <span className="group-hover:text-blue-600 transition-colors">
                {isRequest ? 'View Request' : 'View Offer'}
            </span>
            <div className="p-2 rounded-full bg-slate-50/80 text-slate-400 group-hover:bg-blue-500 group-hover:text-white transition-all">
                 <ArrowUpRight size={14} />
            </div>
        </div>
      </div>
    </div>
  );
};

export default CarpoolCard;
