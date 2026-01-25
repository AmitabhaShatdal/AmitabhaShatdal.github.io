import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { SheetRow, FieldMapping } from '../../bulletinboardTypes';
import { Loader2, MapPinOff, CheckCircle2 } from 'lucide-react';

interface MapViewProps {
  rows: SheetRow[];
  mapping: FieldMapping;
  onItemClick: (row: SheetRow) => void;
  isVisible?: boolean;
}

interface MarkerData {
    lat: number;
    lng: number;
    row: SheetRow;
    source: string;
}

// ----------------------------------------------------------------------
// CONFIGURATION
// ----------------------------------------------------------------------

const MADISON_LAT = 43.0731;
const MADISON_LON = -89.4012;
const CACHE_KEY_PREFIX = 'SheetToSite_Geo_v15_'; 
const CONCURRENCY_LIMIT = 3; // Number of simultaneous requests

const MapView: React.FC<MapViewProps> = ({ rows, mapping, onItemClick, isVisible = true }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const isMountedRef = useRef(false);

  const [progress, setProgress] = useState({ total: 0, mapped: 0 });
  const [isProcessing, setIsProcessing] = useState(false);

  // ---------------------------------------------------------------------------
  // 1. Setup Leaflet Icons
  // ---------------------------------------------------------------------------
  useEffect(() => {
    // @ts-ignore
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
      iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    });
  }, []);

  // ---------------------------------------------------------------------------
  // 2. Initialize Map
  // ---------------------------------------------------------------------------
  useEffect(() => {
    isMountedRef.current = true;
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current).setView([MADISON_LAT, MADISON_LON], 12);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; OpenStreetMap &copy; CARTO &copy; Esri',
      subdomains: 'abcd',
      maxZoom: 20
    }).addTo(map);

    markersLayerRef.current = L.layerGroup().addTo(map);
    mapInstanceRef.current = map;

    return () => {
        isMountedRef.current = false;
        map.remove();
        mapInstanceRef.current = null;
    };
  }, []);

  // ---------------------------------------------------------------------------
  // 3. Handle Visibility
  // ---------------------------------------------------------------------------
  useEffect(() => {
      if (isVisible && mapInstanceRef.current) {
          setTimeout(() => {
              mapInstanceRef.current?.invalidateSize();
          }, 100);
      }
  }, [isVisible]);

  // ---------------------------------------------------------------------------
  // 4. Robust Worker Queue Geocoding Engine
  // ---------------------------------------------------------------------------
  useEffect(() => {
    let isActive = true;

    const runGeocoding = async () => {
        if (!mapInstanceRef.current || !markersLayerRef.current) return;
        
        // Reset Map
        markersLayerRef.current.clearLayers();
        setIsProcessing(true);
        occupiedRef.current = {}; // Reset collision map
        
        const validMarkers: MarkerData[] = [];
        const missing: { row: SheetRow; raw: string }[] = [];

        // --- Phase 1: Identify Sources & Check Cache ---
        rows.forEach(row => {
            // Priority 1: Lat/Long columns
            if (mapping.latField && mapping.longField) {
                const lat = parseFloat(String(row[mapping.latField]));
                const lng = parseFloat(String(row[mapping.longField]));
                if (!isNaN(lat) && !isNaN(lng)) {
                    validMarkers.push({ lat, lng, row, source: 'manual' });
                    return;
                }
            }

            // Priority 2: Address String
            if (mapping.addressField && row[mapping.addressField]) {
                const raw = String(row[mapping.addressField]);
                const normalized = normalizeKey(raw);
                if (!normalized) return;

                const cacheKey = CACHE_KEY_PREFIX + normalized;
                const cached = localStorage.getItem(cacheKey);

                if (cached) {
                    try {
                        const parsed = JSON.parse(cached);
                        validMarkers.push({ ...parsed, row });
                    } catch {
                        missing.push({ row, raw });
                    }
                } else {
                    missing.push({ row, raw });
                }
            }
        });

        // Initial Batch Render
        if (isActive) {
            renderMarkers(validMarkers);
            setProgress({ total: rows.length, mapped: validMarkers.length });
        }

        if (missing.length === 0) {
            if (isActive) setIsProcessing(false);
            return;
        }

        // --- Phase 2: Worker Pool Processing ---
        // We use a queue and multiple workers to process items in parallel but controlled.
        
        let cursor = 0;
        const total = missing.length;
        const pendingUpdates: MarkerData[] = [];

        // UI Updater: Flushes new markers to the map every 500ms to avoid locking the UI
        const uiInterval = setInterval(() => {
             if (!isActive) return;
             if (pendingUpdates.length > 0) {
                 const chunk = pendingUpdates.splice(0, pendingUpdates.length);
                 renderMarkers(chunk);
                 setProgress(prev => ({ ...prev, mapped: prev.mapped + chunk.length }));
             }
        }, 500);

        const worker = async (workerId: number) => {
            while (cursor < total && isActive) {
                // Atomic increment to claim a task
                const index = cursor++;
                if (index >= total) break;

                const item = missing[index];
                
                try {
                    const res = await resolveAddress(item.raw);
                    
                    if (res && isActive) {
                        // Save to cache
                        const normalized = normalizeKey(item.raw);
                        const cacheKey = CACHE_KEY_PREFIX + normalized;
                        localStorage.setItem(cacheKey, JSON.stringify(res));

                        // Queue for UI update
                        pendingUpdates.push({ ...res, row: item.row });
                    }
                } catch (e) {
                    // Fail silently to keep worker alive
                }

                // Random delay (200ms - 600ms) to throttle requests nicely across workers
                // This prevents hitting the API rate limiter "burst" threshold
                if (isActive) {
                    await new Promise(r => setTimeout(r, 200 + Math.random() * 400));
                }
            }
        };

        // Start Workers
        const workers = Array.from({ length: CONCURRENCY_LIMIT }, (_, i) => worker(i));
        await Promise.all(workers);
        
        // Cleanup
        clearInterval(uiInterval);
        
        // Final Flush
        if (isActive && pendingUpdates.length > 0) {
            renderMarkers(pendingUpdates);
            setProgress(prev => ({ ...prev, mapped: prev.mapped + pendingUpdates.length }));
        }

        if (isActive) setIsProcessing(false);
    };

    runGeocoding();

    return () => { isActive = false; };
  }, [rows, mapping]);


  // ---------------------------------------------------------------------------
  // Core: Geocoding with Timeout
  // ---------------------------------------------------------------------------
  
  // Wrapper to prevent hanging requests
  const fetchWithTimeout = async (url: string, timeout = 5000) => {
      const controller = new AbortController();
      const id = setTimeout(() => controller.abort(), timeout);
      try {
        const response = await fetch(url, { signal: controller.signal });
        clearTimeout(id);
        return response;
      } catch (error) {
        clearTimeout(id);
        throw error;
      }
  };

  const resolveAddress = async (raw: string): Promise<Omit<MarkerData, 'row'> | null> => {
      let address = raw.trim();
      
      // Ensure context
      if (!address.toLowerCase().includes('madison')) {
          address += ', Madison, WI';
      } else if (!address.toLowerCase().includes('wi') && !address.toLowerCase().includes('wisconsin')) {
          address += ', WI';
      }

      // 1. ArcGIS (ESRI)
      try {
          const esriUrl = `https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/findAddressCandidates?f=json&SingleLine=${encodeURIComponent(address)}&maxLocations=1&outFields=Addr_type,Match_addr,Score&sourceCountry=USA`;
          const res = await fetchWithTimeout(esriUrl);
          const data = await res.json();
          
          if (data.candidates && data.candidates.length > 0) {
              const best = data.candidates[0];
              // Relaxed threshold to show approximate locations (was 80)
              if (best.score > 50) {
                  return {
                      lat: best.location.y,
                      lng: best.location.x,
                      source: 'ESRI'
                  };
              }
          }
      } catch (e) {
          // Ignore
      }

      // 2. Nominatim (Fallback)
      try {
          const nomUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1&addressdetails=1`;
          const res = await fetchWithTimeout(nomUrl);
          const data = await res.json();

          if (data && data.length > 0) {
              const best = data[0];
              const lat = parseFloat(best.lat);
              const lon = parseFloat(best.lon);
              
              if (Math.abs(lat - MADISON_LAT) < 0.5 && Math.abs(lon - MADISON_LON) < 0.5) {
                  return { lat, lng: lon, source: 'Nominatim' };
              }
          }
      } catch (e) {
         // Ignore
      }

      return null;
  };

  // ---------------------------------------------------------------------------
  // Helper: Marker Rendering
  // ---------------------------------------------------------------------------
  const occupiedRef = useRef<Record<string, number>>({});

  const renderMarkers = (markers: MarkerData[]) => {
      if (!markersLayerRef.current || !mapInstanceRef.current) return;
      
      markers.forEach(m => {
          const key = `${m.lat.toFixed(5)},${m.lng.toFixed(5)}`;
          const count = occupiedRef.current[key] || 0;
          occupiedRef.current[key] = count + 1;

          let finalLat = m.lat;
          let finalLng = m.lng;

          // Spiderfy: Spiral out if overlapping
          if (count > 0) {
              const angle = count * 2.5; 
              const radius = 0.0003 * (1 + 0.2 * count); 
              finalLat = m.lat + radius * Math.cos(angle);
              finalLng = m.lng + radius * Math.sin(angle);
          }

          // CHANGED: Use Address instead of Title
          const address = mapping.addressField ? String(m.row[mapping.addressField]) : '';
          const rawPrice = mapping.priceField ? String(m.row[mapping.priceField]) : '';
          
          // CHANGED: Handle currency symbol check for price
          const displayPrice = rawPrice 
            ? (rawPrice.includes('$') ? rawPrice : `$${rawPrice}`) 
            : '';

          // UNIFIED COLOR: Blue for everyone
          const pinColor = 'bg-blue-600';

          const iconHtml = `
            <div class="relative group">
                <div class="w-3.5 h-3.5 ${pinColor} rounded-full border-2 border-white shadow-md group-hover:scale-125 transition-transform"></div>
            </div>
          `;
          
          const customIcon = L.divIcon({
              className: 'custom-pin',
              html: iconHtml,
              iconSize: [14, 14],
              iconAnchor: [7, 7]
          });

          const marker = L.marker([finalLat, finalLng], { icon: customIcon, riseOnHover: true });

          // CHANGED: Tooltip layout (Address + Price only)
          const popupContent = `
              <div class="text-slate-900 font-sans min-w-[120px]">
                  <div class="font-bold text-xs mb-1 flex items-center justify-between">
                      ${displayPrice ? `<span class="text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100">${displayPrice}</span>` : '<span></span>'} 
                  </div>
                  <div class="text-slate-700 text-xs font-semibold leading-tight line-clamp-3">
                      ${address}
                  </div>
              </div>
          `;

          marker.bindTooltip(popupContent, { 
              direction: 'top', 
              offset: [0, -12], 
              className: 'bg-white/95 backdrop-blur border border-slate-200 shadow-xl rounded-lg px-2.5 py-2 transform hover:scale-105 transition-transform'
          });

          marker.on('click', () => {
              onItemClick(m.row);
          });

          markersLayerRef.current!.addLayer(marker);
      });
  };

  // Helper for cache keys
  const normalizeKey = (str: string) => str.toLowerCase().replace(/[^a-z0-9]/g, '');

  return (
    <div className="w-full h-[600px] rounded-3xl overflow-hidden glass-panel shadow-sm relative z-0">
        <div ref={mapContainerRef} className="w-full h-full bg-slate-50/50" />
        
        {/* Status Badge */}
        <div className="absolute top-4 right-4 z-[1000] flex flex-col gap-2 items-end">
            <div className={`
                backdrop-blur px-4 py-2 rounded-full text-xs font-bold border shadow-lg flex items-center gap-2 transition-all
                ${isProcessing ? 'bg-white/90 text-blue-600 border-blue-100' : 
                  progress.mapped > 0 ? 'bg-white/90 text-slate-700 border-slate-100' : 'bg-red-50/90 text-red-600 border-red-100'}
            `}>
                {isProcessing ? (
                    <Loader2 size={12} className="animate-spin" />
                ) : (
                    progress.mapped > 0 ? <CheckCircle2 size={14} className="text-emerald-500" /> : <MapPinOff size={14} />
                )}
                <span>
                    {isProcessing ? 'Loading Map...' : 'Map Ready'} 
                    <span className="ml-1 opacity-60">({progress.mapped} / {progress.total})</span>
                </span>
            </div>
        </div>
    </div>
  );
};

export default MapView;