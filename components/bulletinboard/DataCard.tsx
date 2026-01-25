
import React from 'react';
import { SheetRow, FieldMapping } from '../../bulletinboardTypes';
import { ArrowUpRight, Tag, Bed, Bath, Clock, Calendar, Ruler, Users, DoorOpen, MapPin, Sparkles } from 'lucide-react';

interface DataCardProps {
  row: SheetRow;
  mapping: FieldMapping;
  onClick: () => void;
  variant?: 'listing' | 'profile';
}

const DataCard: React.FC<DataCardProps> = ({ row, mapping, onClick, variant = 'listing' }) => {
  const isProfile = variant === 'profile';

  const title = mapping.titleField ? String(row[mapping.titleField]) : 'Untitled';
  const description = mapping.descriptionField ? String(row[mapping.descriptionField]) : '';
  const image = mapping.imageField ? String(row[mapping.imageField]) : null;
  let category = mapping.categoryField ? String(row[mapping.categoryField]) : null;
  const price = mapping.priceField ? String(row[mapping.priceField]) : null;
  const address = mapping.addressField ? String(row[mapping.addressField]) : null;
  const date = mapping.dateField ? String(row[mapping.dateField]) : null;

  // Clean up image URL
  const cleanImage = !isProfile && image ? (image.match(/https?:\/\/[^\s"]+/) || [image])[0] : null;

  // Safety: If category is very long, it's likely a mis-mapped description. Don't show it as a pill/header.
  if (category && category.length > 40) {
      category = null;
  }

  // Smart Tag Extraction
  // 1. Find Room count (Prioritize roomField)
  let roomVal = mapping.roomField ? row[mapping.roomField] : null;
  if (!roomVal) {
      const roomKey = mapping.featuresFields?.find(f => /bed|room|chambre|br/i.test(f));
      roomVal = roomKey ? row[roomKey] : null;
  }

  // Determine Badge Label & Icon based on column name
  let badgeLabel = 'Beds';
  let BadgeIcon = Bed;
  let isSpotCount = false;

  if (mapping.roomField) {
     const h = mapping.roomField.toLowerCase();
     if (h.includes('rent') || h.includes('spot') || h.includes('avail') || h.includes('left')) {
         isSpotCount = true;
         badgeLabel = Number(roomVal) === 1 ? 'Room for Rent' : 'Rooms for Rent';
         BadgeIcon = DoorOpen;
     } else if (h.includes('room')) {
         badgeLabel = Number(roomVal) === 1 ? 'Room' : 'Rooms';
     } else {
         badgeLabel = Number(roomVal) === 1 ? 'Bed' : 'Beds';
     }
  }

  // Display Logic: 
  const hasAddress = !!address;
  const mainHeader = isProfile ? title : (hasAddress ? address : title);
  const subHeader = isProfile 
    ? (category || (hasAddress ? address : null)) 
    : (hasAddress ? title : category); 

  // Helper to get feature icons
  const getFeatureIcon = (header: string) => {
      const h = header.toLowerCase();
      if (h.includes('bath') || h.includes('toilet') || h.includes('wc')) return <Bath size={14} />;
      if (h.includes('rent') || h.includes('spot')) return <DoorOpen size={14} />;
      if (h.includes('bed') || h.includes('br')) return <Bed size={14} />;
      if (h.includes('duration') || h.includes('time') || h.includes('lease')) return <Clock size={14} />;
      if (h.includes('sqft') || h.includes('size') || h.includes('area')) return <Ruler size={14} />;
      if (h.includes('mate') || h.includes('people') || h.includes('user')) return <Users size={14} />;
      if (isProfile) return <Sparkles size={14} />; 
      return <Tag size={14} />;
  };

  // Helper to generate a short text label
  const getFormattedFeature = (header: string, val: string | number | boolean | null) => {
      if (val === null || val === '') return null;
      const vStr = String(val);
      const h = header.toLowerCase();

      if (/[a-zA-Z]/.test(vStr)) return vStr;

      if (h.includes('rent') || h.includes('spot')) return `${vStr} Room${vStr !== '1' ? 's' : ''} for Rent`;
      if (h.includes('bath')) return `${vStr} Bath${vStr !== '1' ? 's' : ''}`;
      if (h.includes('bed')) return `${vStr} Bed${vStr !== '1' ? 's' : ''}`;
      if (h.includes('room')) return `${vStr} Room${vStr !== '1' ? 's' : ''}`;
      if (h.includes('sqft')) return `${vStr} sqft`;
      
      if (header.length < 10) return `${vStr} ${header}`;
      return vStr;
  };

  return (
    <div 
      className={`group relative glass-card rounded-3xl overflow-hidden transition-all duration-300 hover:shadow-xl cursor-pointer flex flex-col h-full hover:shadow-blue-900/5`}
      onClick={onClick}
    >
      {/* --- HEADER IMAGE / PROFILE HEADER --- */}
      {cleanImage ? (
          <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
            <img 
                src={cleanImage} 
                alt={mainHeader || ''} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
            />
            
            {/* Listing Price Tag */}
            <div className="absolute top-3 left-3 flex flex-col gap-2 items-start">
                 {price && (
                    <div className="backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm border bg-blue-500/80 border-blue-400/30">
                        {price.includes('$') ? price : `$${price}`}
                    </div>
                 )}
            </div>

            {/* Listing Room Badge */}
            <div className="absolute top-3 right-3 flex flex-col gap-2 items-end">
                {roomVal && (
                    <div className={`
                        backdrop-blur-md text-xs font-bold px-2.5 py-1.5 rounded-lg shadow-sm flex items-center gap-1 border
                        ${isSpotCount ? 'bg-blue-600/80 border-blue-500/30 text-white' : 'bg-white/80 border-white/50 text-slate-800'}
                    `}>
                        <BadgeIcon size={14} className={isSpotCount ? "text-white" : "text-blue-500"} />
                        <span>{String(roomVal)} {badgeLabel}</span>
                    </div>
                )}
            </div>
          </div>
      ) : (
          /* --- NO IMAGE STATE --- */
          isProfile ? (
              // PROFILE PILL HEADER (Name + Solid Budget Pill)
              <div className="relative h-20 w-full bg-gradient-to-r from-blue-50/80 via-slate-50/50 to-blue-50/80 border-b border-blue-100/50 flex flex-col justify-center px-5">
                   
                   <div className="flex items-center justify-between relative z-10 gap-3">
                        <div className="flex items-center gap-2.5 min-w-0">
                            {/* Name - No User Icon */}
                            <h3 className="font-bold text-slate-800 text-base leading-tight truncate group-hover:text-blue-600 transition-colors">
                                {mainHeader}
                            </h3>
                        </div>
                        
                        {/* Budget Pill */}
                        <div className="shrink-0 flex items-center gap-2">
                            {price && (
                                <div className="bg-blue-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg shadow-blue-200 border border-blue-500">
                                    {price.includes('$') ? price : `$${price}`}
                                </div>
                            )}
                        </div>
                   </div>
              </div>
          ) : (
             // LISTING HEADER (Text Only)
             <div className="pt-6 px-6 flex justify-between items-start">
                 <div className="flex gap-2">
                     {price && (
                          <span className="text-blue-700 font-bold bg-blue-50/50 px-3 py-1 rounded-full text-sm border border-blue-100/50 backdrop-blur-sm">
                              {price.includes('$') ? price : `$${price}`}
                          </span>
                      )}
                 </div>
                 {roomVal && (
                    <span className={`
                        font-bold px-3 py-1 rounded-full text-xs flex items-center gap-1 backdrop-blur-sm border
                        ${isSpotCount ? 'bg-blue-50/50 text-blue-700 border-blue-100/50' : 'bg-slate-100/50 text-slate-600 border-slate-200/50'}
                    `}>
                        <BadgeIcon size={14} /> {String(roomVal)} {badgeLabel}
                    </span>
                 )}
            </div>
          )
      )}

      {/* --- CONTENT SECTION --- */}
      <div className="p-5 flex-1 flex flex-col">
        
        {/* Date */}
        {date && (
            <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-slate-400 font-semibold mb-2">
                <Calendar size={12} />
                <span>{date}</span>
            </div>
        )}

        {/* Main Heading - Hide for Profiles as it's in the header now */}
        {!isProfile && (
            <h3 className="text-lg font-bold text-slate-800 transition-colors leading-tight mb-1 group-hover:text-blue-600">
                {mainHeader}
            </h3>
        )}

        {/* Sub Heading */}
        {subHeader && (
            <div className="flex items-center gap-1.5 text-sm text-slate-500 mb-4 font-medium">
                {hasAddress ? <MapPin size={14} className="text-slate-400" /> : <Tag size={14} className="text-slate-400" />}
                <span className="truncate">{subHeader}</span>
            </div>
        )}

        {/* Features Grid */}
        {mapping.featuresFields && mapping.featuresFields.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
                {/* For Student Profiles, show room/beds logic here as badges if not in header */}
                {isProfile && roomVal && (
                     <div className="flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-md border backdrop-blur-sm bg-blue-50/50 text-blue-700 border-blue-100/50">
                        <span className="text-blue-400"><BadgeIcon size={14} /></span>
                        <span className="font-medium">{String(roomVal)} {badgeLabel}</span>
                    </div>
                )}
                
                {mapping.featuresFields.slice(0, 4).map(field => {
                    const val = row[field];
                    const formatted = getFormattedFeature(field, val);
                    if (!formatted) return null;
                    
                    return (
                        <div key={field} className={`
                            flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-md border backdrop-blur-sm bg-blue-50/50 text-blue-700 border-blue-100/50
                        `}>
                            <span className="text-blue-400">{getFeatureIcon(field)}</span>
                            <span className="font-medium">{formatted}</span>
                        </div>
                    );
                })}
            </div>
        )}

        {/* Description Snippet */}
        {description && (
            <p className="text-slate-500 text-sm line-clamp-2 mb-4 flex-1 leading-relaxed">
                {description}
            </p>
        )}
        
        {/* Footer Action */}
        <div className="mt-auto pt-4 border-t border-slate-100/50 flex items-center justify-between text-xs font-medium text-slate-400">
            <span className="transition-colors group-hover:text-blue-600">
                {isProfile ? 'View Profile' : 'View Details'}
            </span>
            <div className="p-2 rounded-full transition-all duration-300 text-white bg-slate-50/80 text-slate-400 group-hover:bg-blue-600 group-hover:text-white">
                 <ArrowUpRight size={14} />
            </div>
        </div>
      </div>
    </div>
  );
};

export default DataCard;
