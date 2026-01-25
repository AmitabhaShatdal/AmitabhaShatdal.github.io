import React from 'react';
import { SheetRow, FieldMapping } from '../../../bulletinboardTypes';
import { ArrowUpRight, Bed, Bath, Clock, Ruler, Users, DoorOpen, MapPin, Calendar, Tag } from 'lucide-react';

interface CardProps {
  row: SheetRow;
  mapping: FieldMapping;
  onClick: () => void;
}

const LeaseCard: React.FC<CardProps> = ({ row, mapping, onClick }) => {
  const title = mapping.titleField ? String(row[mapping.titleField]) : 'Untitled';
  const description = mapping.descriptionField ? String(row[mapping.descriptionField]) : '';
  const image = mapping.imageField ? String(row[mapping.imageField]) : null;
  const price = mapping.priceField ? String(row[mapping.priceField]) : null;
  const address = mapping.addressField ? String(row[mapping.addressField]) : null;
  const date = mapping.dateField ? String(row[mapping.dateField]) : null;
  
  // Room Logic
  let roomVal = mapping.roomField ? row[mapping.roomField] : null;
  if (!roomVal) {
      const roomKey = mapping.featuresFields?.find(f => /bed|room|chambre|br/i.test(f));
      roomVal = roomKey ? row[roomKey] : null;
  }
  
  let badgeLabel = 'Beds';
  let BadgeIcon = Bed;
  let isSpotCount = false;

  if (mapping.roomField) {
     const h = mapping.roomField.toLowerCase();
     if (h.includes('rent') || h.includes('spot') || h.includes('avail') || h.includes('left')) {
         isSpotCount = true;
         badgeLabel = Number(roomVal) === 1 ? 'Room' : 'Rooms';
         BadgeIcon = DoorOpen;
     } else if (h.includes('room')) {
         badgeLabel = Number(roomVal) === 1 ? 'Room' : 'Rooms';
     }
  }

  const cleanImage = image ? (image.match(/https?:\/\/[^\s"]+/) || [image])[0] : null;
  const mainHeader = address || title;
  const subHeader = address ? title : null;

  // Feature Icon Helper
  const getFeatureIcon = (header: string) => {
      const h = header.toLowerCase();
      if (h.includes('bath') || h.includes('toilet')) return <Bath size={14} />;
      if (h.includes('rent') || h.includes('spot')) return <DoorOpen size={14} />;
      if (h.includes('bed') || h.includes('br')) return <Bed size={14} />;
      if (h.includes('duration') || h.includes('time')) return <Clock size={14} />;
      if (h.includes('sqft') || h.includes('size')) return <Ruler size={14} />;
      if (h.includes('mate') || h.includes('people')) return <Users size={14} />;
      return <Tag size={14} />;
  };

  const getFormattedFeature = (header: string, val: any) => {
      if (val === null || val === '') return null;
      const vStr = String(val);
      const h = header.toLowerCase();
      if (/[a-zA-Z]/.test(vStr)) return vStr;
      if (h.includes('bath')) return `${vStr} Bath${vStr !== '1' ? 's' : ''}`;
      if (h.includes('bed')) return `${vStr} Bed${vStr !== '1' ? 's' : ''}`;
      if (header.length < 10) return `${vStr} ${header}`;
      return vStr;
  };

  return (
    <div 
      className="group relative bg-white rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-lg border border-slate-200 cursor-pointer flex flex-col h-full"
      onClick={onClick}
    >
      {/* Image / Header */}
      {cleanImage ? (
          <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
            <img 
                src={cleanImage} 
                alt={mainHeader} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
            />
            <div className="absolute top-3 left-3">
                 {price && (
                    <div className="backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm border bg-emerald-500/80 border-emerald-400/30">
                        {price.includes('$') ? price : `$${price}`}
                    </div>
                 )}
            </div>
          </div>
      ) : (
          <div className="pt-6 px-6 flex justify-between items-start">
             <div className="flex gap-2">
                 {price && (
                      <span className="text-emerald-700 font-bold bg-emerald-50/50 px-3 py-1 rounded-full text-sm border border-emerald-100/50 backdrop-blur-sm">
                          {price.includes('$') ? price : `$${price}`}
                      </span>
                  )}
             </div>
             {roomVal && (
                <span className={`font-bold px-3 py-1 rounded-full text-xs flex items-center gap-1 backdrop-blur-sm border ${isSpotCount ? 'bg-blue-50/50 text-blue-700 border-blue-100/50' : 'bg-slate-100/50 text-slate-600 border-slate-200/50'}`}>
                    <BadgeIcon size={14} /> {String(roomVal)} {badgeLabel}
                </span>
             )}
        </div>
      )}

      <div className="p-5 flex-1 flex flex-col">
        {date && (
            <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-slate-400 font-semibold mb-2">
                <Calendar size={12} /> <span>{date}</span>
            </div>
        )}

        <h3 className="text-lg font-bold text-slate-800 transition-colors leading-tight mb-1 group-hover:text-blue-600">
            {mainHeader}
        </h3>

        {subHeader && (
            <div className="flex items-center gap-1.5 text-sm text-slate-500 mb-4 font-medium">
                <MapPin size={14} className="text-slate-400" />
                <span className="truncate">{subHeader}</span>
            </div>
        )}

        {/* Features */}
        {mapping.featuresFields && (
            <div className="flex flex-wrap gap-2 mb-4">
                {mapping.featuresFields.slice(0, 4).map(field => {
                    const val = row[field];
                    const formatted = getFormattedFeature(field, val);
                    if (!formatted) return null;
                    return (
                        <div key={field} className="flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-md border backdrop-blur-sm bg-slate-50/50 text-slate-600 border-slate-200/50">
                            <span className="text-slate-400">{getFeatureIcon(field)}</span>
                            <span className="font-medium">{formatted}</span>
                        </div>
                    );
                })}
            </div>
        )}

        {description && (
            <p className="text-slate-500 text-sm line-clamp-2 mb-4 flex-1 leading-relaxed">{description}</p>
        )}
        
        <div className="mt-auto pt-4 border-t border-slate-100/50 flex items-center justify-between text-xs font-medium text-slate-400">
            <span className="group-hover:text-blue-600 transition-colors">View Details</span>
            <div className="p-2 rounded-full bg-slate-50/80 text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all">
                 <ArrowUpRight size={14} />
            </div>
        </div>
      </div>
    </div>
  );
};

export default LeaseCard;