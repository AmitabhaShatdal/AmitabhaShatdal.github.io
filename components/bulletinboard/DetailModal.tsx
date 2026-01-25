
import React from 'react';
import { SheetRow, FieldMapping, CardType } from '../../bulletinboardTypes';
import { X, ExternalLink, Calendar, Mail, Phone, MapPin, Tag, Car, ArrowRight, Clock, Users } from 'lucide-react';

interface DetailModalProps {
  row: SheetRow | null;
  mapping: FieldMapping;
  onClose: () => void;
  cardType?: CardType;
}

const DetailModal: React.FC<DetailModalProps> = ({ row, mapping, onClose, cardType = 'lease' }) => {
  if (!row) return null;

  const isMerch = cardType === 'sale' || cardType === 'wanted';
  const isStudent = cardType === 'student';
  const isCarpool = cardType === 'carpool';

  const title = mapping.titleField ? String(row[mapping.titleField]) : 'Details';
  const image = mapping.imageField ? String(row[mapping.imageField]) : null;
  const link = mapping.linkField ? String(row[mapping.linkField]) : null;
  const date = mapping.dateField ? String(row[mapping.dateField]) : null;
  let category = mapping.categoryField ? String(row[mapping.categoryField]) : null;
  const description = mapping.descriptionField ? String(row[mapping.descriptionField]) : null;
  const price = mapping.priceField ? String(row[mapping.priceField]) : null;
  const email = mapping.emailField ? String(row[mapping.emailField]) : null;
  const phone = mapping.phoneField ? String(row[mapping.phoneField]) : null;
  const address = mapping.addressField ? String(row[mapping.addressField]) : null;

  // Carpool specifics
  const origin = mapping.originField ? String(row[mapping.originField]) : null;
  const destination = mapping.destinationField ? String(row[mapping.destinationField]) : null;
  const departure = mapping.departureTimeField ? String(row[mapping.departureTimeField]) : null;
  const returnTime = mapping.returnTimeField ? String(row[mapping.returnTimeField]) : null;
  const capacity = mapping.capacityField ? String(row[mapping.capacityField]) : null;

  // Clean Image
  // Force null image for students, keep for others if valid
  const cleanImage = (!isStudent && !isCarpool && image) ? (image.match(/https?:\/\/[^\s"]+/) || [image])[0] : null;

  // Display Priority Logic
  const hasAddress = !!address;
  
  let mainHeader = title;
  let subHeader = category;

  if (isCarpool) {
      mainHeader = origin && destination ? `${origin} to ${destination}` : title;
      subHeader = `Carpool with ${title}`;
  } else if (cardType === 'lease' && hasAddress) {
      mainHeader = address;
      subHeader = title;
  } else if (cardType === 'student') {
      mainHeader = title;
      subHeader = category || address;
  }

  let descTitle = 'About this listing';
  if (isStudent) descTitle = 'A bit about me / our group';
  if (isMerch) descTitle = 'Description';
  if (isCarpool) descTitle = 'Ride Details';

  const singleColLayout = isMerch || isCarpool;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div 
        className="absolute inset-0 bg-slate-900/20 backdrop-blur-md transition-opacity duration-300"
        onClick={onClose}
      ></div>
      
      <div className="relative bg-white w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl animate-scale-in flex flex-col">
        
        {/* Header Image - Only if exists */}
        {cleanImage ? (
            <div className="relative w-full shrink-0 h-64 sm:h-96 bg-slate-100">
                <button 
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 bg-white/50 hover:bg-white text-slate-800 rounded-full transition-colors z-20 backdrop-blur-md shadow-sm"
                >
                    <X size={20} />
                </button>
                <img 
                    src={cleanImage} 
                    alt={title} 
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent"></div>
                
                <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10 text-white">
                    <h2 className="text-3xl sm:text-5xl font-bold leading-tight shadow-sm mb-2">{mainHeader}</h2>
                    {subHeader && (
                        <div className="flex items-center gap-2 text-white/80 text-lg font-medium">
                            <Tag size={18} />
                            <span>{subHeader}</span>
                        </div>
                    )}
                </div>
            </div>
        ) : (
             // No Image Header
            <div className="p-6 sm:p-8 pb-0 flex justify-end">
                  <button 
                    onClick={onClose}
                    className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-full transition-colors"
                >
                    <X size={20} />
                </button>
            </div>
        )}

        {/* Content Body */}
        <div className={`flex-1 p-6 sm:p-10 grid grid-cols-1 ${singleColLayout ? 'lg:grid-cols-1' : 'lg:grid-cols-3'} gap-10 bg-white`}>
            
            {/* Main Column */}
            <div className={`${singleColLayout ? '' : 'lg:col-span-2'} space-y-10`}>
                
                {!cleanImage && (
                    <div className="border-b border-slate-100 pb-8">
                        {isCarpool ? (
                            // Carpool Header Layout
                            <div className="space-y-4">
                                <div className="flex items-center gap-3 text-cyan-600 font-bold uppercase tracking-wider text-sm mb-2">
                                    <Car size={16} /> Carpool
                                </div>
                                <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-3xl sm:text-4xl font-bold text-slate-900">
                                    <span>{origin || '?'}</span>
                                    <ArrowRight className="hidden sm:block text-slate-300" />
                                    <span className="sm:hidden text-slate-300 rotate-90 w-min">↓</span>
                                    <span>{destination || '?'}</span>
                                </div>
                                <div className="text-lg text-slate-500 font-medium">
                                    Driver: {title}
                                </div>
                            </div>
                        ) : (
                            // Standard Header
                            <>
                                <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 leading-tight mb-3">{mainHeader}</h2>
                                {subHeader && (
                                    <div className="flex items-center gap-2 text-slate-500 text-lg font-medium">
                                        {isMerch ? <Tag size={20} /> : (hasAddress ? <MapPin size={20} /> : <Tag size={20} />)}
                                        <span>{subHeader}</span>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                )}

                {/* Carpool Timings & Capacity Grid */}
                {isCarpool && (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {departure && (
                            <div className="bg-cyan-50/50 p-4 rounded-2xl border border-cyan-100">
                                <span className="block text-xs font-bold text-cyan-600 uppercase mb-1">Departure</span>
                                <div className="flex items-center gap-2 text-slate-800 font-bold">
                                    <Calendar size={16} className="text-cyan-500" />
                                    {departure}
                                </div>
                            </div>
                        )}
                        {returnTime && (
                            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                <span className="block text-xs font-bold text-slate-400 uppercase mb-1">Return</span>
                                <div className="flex items-center gap-2 text-slate-800 font-bold">
                                    <Clock size={16} className="text-slate-400" />
                                    {returnTime}
                                </div>
                            </div>
                        )}
                        {capacity && (
                             <div className="bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100">
                                <span className="block text-xs font-bold text-emerald-600 uppercase mb-1">Available Seats</span>
                                <div className="flex items-center gap-2 text-slate-800 font-bold">
                                    <Users size={16} className="text-emerald-500" />
                                    {capacity}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Contact Actions */}
                <div className="flex flex-wrap gap-3">
                    {email && (
                        <a href={`mailto:${email}`} className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-slate-50 text-slate-900 hover:bg-slate-100 border border-slate-200 px-6 py-4 rounded-2xl font-bold transition-colors">
                            <Mail size={18} /> Email
                        </a>
                    )}
                    {phone && (
                        <a href={`tel:${phone}`} className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-6 py-4 rounded-2xl font-bold transition-colors shadow-lg shadow-slate-900/10">
                            <Phone size={18} /> Call
                        </a>
                    )}
                    {link && (
                        <a href={link} target="_blank" rel="noreferrer" className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-4 rounded-2xl font-bold transition-colors shadow-lg shadow-blue-600/20">
                            Open Link <ExternalLink size={18} />
                        </a>
                    )}
                </div>

                {/* Primary Description */}
                {description && (
                    <div>
                        <h3 className="text-xl font-bold text-slate-900 mb-4">
                            {descTitle}
                        </h3>
                        <div className="prose prose-slate prose-lg max-w-none text-slate-600 leading-relaxed whitespace-pre-line">
                            {description}
                        </div>
                    </div>
                )}
                
                {/* For Merch, also show Price here if no sidebar */}
                {isMerch && price && (
                    <div className="mt-6 pt-6 border-t border-slate-100">
                         <span className="text-slate-500 text-sm font-bold uppercase tracking-wider block mb-2">Price</span>
                        <div className="text-3xl font-bold text-emerald-600">
                             {price.includes('$') ? price : `$${price}`}
                        </div>
                    </div>
                )}

                {/* Carpool/SingleCol Layout: Show Features (Preferences) in Main Column */}
                {singleColLayout && mapping.featuresFields && mapping.featuresFields.length > 0 && (
                     <div className="pt-8 border-t border-slate-100">
                         <h3 className="text-xl font-bold text-slate-900 mb-4">Preferences & Details</h3>
                         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {mapping.featuresFields.map(key => {
                                const val = row[key];
                                if(!val) return null;
                                return (
                                    <div key={key} className="bg-slate-50 p-4 rounded-xl">
                                        <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block mb-1">{key}</span>
                                        <span className="text-slate-700 font-medium">{String(val)}</span>
                                    </div>
                                )
                            })}
                         </div>
                     </div>
                )}




            </div>

            {/* Sidebar Column (Hidden for Merch & Carpool) */}
            {!singleColLayout && (
                <div className="space-y-8">
                    {price && (
                        <div className="bg-slate-50/50 rounded-2xl p-8 border border-slate-100">
                            <span className="text-slate-500 text-sm font-bold uppercase tracking-wider block mb-2">Monthly Rent</span>
                            <div className="text-4xl font-bold text-emerald-600 tracking-tight">
                                {price.includes('$') ? price : `$${price}`}
                            </div>
                        </div>
                    )}

                    <div className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm">
                        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-6 pb-2 border-b border-slate-100">
                            Details
                        </h3>
                        <div className="space-y-5">
                            {mapping.roomField && row[mapping.roomField] && (
                                <div className="flex justify-between items-center group">
                                    <span className="text-slate-500 font-medium capitalize">
                                        {mapping.roomField?.replace(/_/g, ' ') || 'Rooms for Rent'}
                                    </span>
                                    <span className="text-slate-900 font-bold text-right">{String(row[mapping.roomField])}</span>
                                </div>
                            )}

                            {mapping.featuresFields?.map(key => {
                                const val = row[key];
                                if(!val) return null;
                                return (
                                    <div key={key} className="flex justify-between items-center group">
                                        <span className="text-slate-500 font-medium capitalize">{key}</span>
                                        <span className="text-slate-900 font-bold text-right">{String(val)}</span>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default DetailModal;
