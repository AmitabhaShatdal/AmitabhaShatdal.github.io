
import React from 'react';
import { SheetRow, FieldMapping } from '../../../bulletinboardTypes';
import { ArrowUpRight, Calendar } from 'lucide-react';

interface CardProps {
  row: SheetRow;
  mapping: FieldMapping;
  onClick: () => void;
}

const MerchSaleCard: React.FC<CardProps> = ({ row, mapping, onClick }) => {
  const title = mapping.titleField ? String(row[mapping.titleField]) : 'Untitled Item';
  const description = mapping.descriptionField ? String(row[mapping.descriptionField]) : '';
  const image = mapping.imageField ? String(row[mapping.imageField]) : null;
  const price = mapping.priceField ? String(row[mapping.priceField]) : null;
  const classification = mapping.categoryField ? String(row[mapping.categoryField]) : null; // Classification
  const date = mapping.dateField ? String(row[mapping.dateField]) : null;

  const cleanImage = image ? (image.match(/https?:\/\/[^\s"]+/) || [image])[0] : null;

  // The classification is the primary pill info as requested
  const displayClass = classification || 'For Sale';

  return (
    <div 
      className="group relative bg-white rounded-2xl border border-slate-200 overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-blue-900/5 cursor-pointer flex flex-col h-full"
      onClick={onClick}
    >
      {/* Image Section */}
      {cleanImage ? (
          <div className="relative aspect-square w-full overflow-hidden bg-slate-100">
            <img 
                src={cleanImage} 
                alt={title} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
            />
            {/* Price Tag Overlay */}
            <div className="absolute bottom-3 right-3">
                 {price && (
                    <div className="backdrop-blur-md text-white text-sm font-bold px-4 py-1.5 rounded-full shadow-lg border bg-blue-600/90 border-blue-500/30">
                        {price.includes('$') ? price : `$${price}`}
                    </div>
                 )}
            </div>
          </div>
      ) : (
          // No Image Header - Focus on Classification & Price
          <div className="pt-6 px-6">
               <div className="flex justify-between items-start">
                   <span className="bg-blue-50 text-blue-700 border border-blue-100 text-xs font-bold px-2.5 py-1 rounded-md uppercase tracking-wide">
                       {displayClass}
                   </span>
                   {price && (
                       <div className="text-blue-600 text-lg font-bold">
                            {price.includes('$') ? price : `$${price}`}
                       </div>
                   )}
               </div>
          </div>
      )}

      <div className="p-5 flex-1 flex flex-col">
        {date && (
            <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-slate-400 font-semibold mb-2">
                <Calendar size={12} /> <span>{date}</span>
            </div>
        )}

        {/* If image exists, show classification as pill here */}
        {cleanImage && (
             <div className="mb-2">
                 <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100/50">
                     {displayClass}
                 </span>
             </div>
        )}

        {description && (
            <p className="text-slate-700 text-base line-clamp-4 mb-3 flex-1 leading-relaxed font-medium">
                {description}
            </p>
        )}

        <p className="text-slate-400 text-xs line-clamp-1">
            {title}
        </p>
        
        <div className="mt-auto pt-4 border-t border-slate-100/50 flex items-center justify-between text-xs font-medium text-slate-400">
            <span className="group-hover:text-blue-600 transition-colors">View Item</span>
            <div className="p-2 rounded-full bg-slate-50/80 text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all">
                 <ArrowUpRight size={14} />
            </div>
        </div>
      </div>
    </div>
  );
};

export default MerchSaleCard;
