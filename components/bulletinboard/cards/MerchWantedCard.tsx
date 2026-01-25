
import React from 'react';
import { SheetRow, FieldMapping } from '../../../bulletinboardTypes';
import { ArrowUpRight, Search } from 'lucide-react';

interface CardProps {
  row: SheetRow;
  mapping: FieldMapping;
  onClick: () => void;
}

const MerchWantedCard: React.FC<CardProps> = ({ row, mapping, onClick }) => {
  const title = mapping.titleField ? String(row[mapping.titleField]) : 'Untitled Request';
  const description = mapping.descriptionField ? String(row[mapping.descriptionField]) : '';
  const classification = mapping.categoryField ? String(row[mapping.categoryField]) : null;
  const date = mapping.dateField ? String(row[mapping.dateField]) : null;

  const displayClass = classification || 'Wanted';

  return (
    <div 
      className="group relative bg-white rounded-2xl border border-slate-200 overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-blue-900/5 cursor-pointer flex flex-col h-full border-l-4 border-l-blue-400"
      onClick={onClick}
    >
      <div className="p-6 flex-1 flex flex-col">
        
        <div className="flex justify-between items-start mb-4">
             <span className="bg-blue-50 text-blue-700 border border-blue-100 text-xs font-bold px-2.5 py-1 rounded-md uppercase tracking-wide flex items-center gap-1">
                 <Search size={10} /> {displayClass}
             </span>
             {date && (
                <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-slate-400 font-semibold">
                    <span>{date}</span>
                </div>
            )}
        </div>

        {description && (
            <p className="text-slate-700 text-base line-clamp-5 mb-3 flex-1 leading-relaxed font-medium">
                {description}
            </p>
        )}

        <p className="text-slate-400 text-xs line-clamp-1">
            {title}
        </p>
        
        <div className="mt-auto pt-4 border-t border-slate-100/50 flex items-center justify-between text-xs font-medium text-slate-400">
            <span className="group-hover:text-blue-600 transition-colors">View Request</span>
            <div className="p-2 rounded-full bg-slate-50/80 text-slate-400 group-hover:bg-blue-500 group-hover:text-white transition-all">
                 <ArrowUpRight size={14} />
            </div>
        </div>
      </div>
    </div>
  );
};

export default MerchWantedCard;
