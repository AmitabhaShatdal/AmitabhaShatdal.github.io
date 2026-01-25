
import React from 'react';
import { SheetRow, FieldMapping } from '../../../bulletinboardTypes';
import { ArrowUpRight, MapPin, Tag, Calendar, Bed, DoorOpen } from 'lucide-react';

interface CardProps {
  row: SheetRow;
  mapping: FieldMapping;
  onClick: () => void;
}

const StudentCard: React.FC<CardProps> = ({ row, mapping, onClick }) => {
  const title = mapping.titleField ? String(row[mapping.titleField]) : 'Untitled';
  const description = mapping.descriptionField ? String(row[mapping.descriptionField]) : '';
  const price = mapping.priceField ? String(row[mapping.priceField]) : null;
  const address = mapping.addressField ? String(row[mapping.addressField]) : null;
  const category = mapping.categoryField ? String(row[mapping.categoryField]) : null;
  const date = mapping.dateField ? String(row[mapping.dateField]) : null;
  
  // Room/Bed Logic
  let roomVal = mapping.roomField ? row[mapping.roomField] : null;
  if (!roomVal) {
      const roomKey = mapping.featuresFields?.find(f => /bed|room/i.test(f));
      roomVal = roomKey ? row[roomKey] : null;
  }
  
  const mainHeader = title;
  const subHeader = category || address;

  // Icons logic
  const getFeatureIcon = (header: string) => {
      const h = header.toLowerCase();
      if (h.includes('bed')) return <Bed size={14} />;
      return <Tag size={14} />;
  };

  return (
    <div 
      className="group relative bg-white rounded-2xl border border-slate-200 overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-blue-900/5 cursor-pointer flex flex-col h-full"
      onClick={onClick}
    >
      {/* Profile Header (Name + Budget) */}
      <div className="relative h-20 w-full bg-gradient-to-r from-blue-50/80 via-slate-50/50 to-blue-50/80 border-b border-blue-100/50 flex flex-col justify-center px-5">
           <div className="flex items-center justify-between relative z-10 gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                    <h3 className="font-bold text-slate-800 text-base leading-tight truncate group-hover:text-blue-600 transition-colors">
                        {mainHeader}
                    </h3>
                </div>
                <div className="shrink-0 flex items-center gap-2">
                    {price && (
                        <div className="bg-blue-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg shadow-blue-200 border border-blue-500">
                            {price.includes('$') ? price : `$${price}`}
                        </div>
                    )}
                </div>
           </div>
      </div>

      <div className="p-5 flex-1 flex flex-col">
        {date && (
            <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-slate-400 font-semibold mb-2">
                <Calendar size={12} /> <span>{date}</span>
            </div>
        )}

        {subHeader && (
            <div className="flex items-center gap-1.5 text-sm text-slate-500 mb-4 font-medium">
                {address ? <MapPin size={14} className="text-slate-400" /> : <Tag size={14} className="text-slate-400" />}
                <span className="truncate">{subHeader}</span>
            </div>
        )}

        <div className="flex flex-wrap gap-2 mb-4">
            {roomVal && (
                 <div className="flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-md border backdrop-blur-sm bg-blue-50/50 text-blue-700 border-blue-100/50">
                    <span className="text-blue-400"><DoorOpen size={14} /></span>
                    <span className="font-medium">{String(roomVal)}</span>
                </div>
            )}
            
            {mapping.featuresFields?.slice(0, 3).map(field => {
                const val = row[field];
                if (!val) return null;
                return (
                    <div key={field} className="flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-md border backdrop-blur-sm bg-blue-50/50 text-blue-700 border-blue-100/50">
                        <span className="text-blue-400">{getFeatureIcon(field)}</span>
                        <span className="font-medium">{String(val)}</span>
                    </div>
                );
            })}
        </div>

        {description && (
            <p className="text-slate-500 text-sm line-clamp-2 mb-4 flex-1 leading-relaxed">
                {description}
            </p>
        )}
        
        <div className="mt-auto pt-4 border-t border-slate-100/50 flex items-center justify-between text-xs font-medium text-slate-400">
            <span className="group-hover:text-blue-600 transition-colors">View Profile</span>
            <div className="p-2 rounded-full bg-slate-100 text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all">
                 <ArrowUpRight size={14} />
            </div>
        </div>
      </div>
    </div>
  );
};

export default StudentCard;
