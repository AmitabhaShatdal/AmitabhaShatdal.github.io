
import { SheetRow, FieldMapping } from '../types';

export const DEMO_CSV = `
ID,Product Name,Description,Price,Category,Image URL,Rating,Status,Link
1,Neon Cyber Deck,High-performance cyberdeck with holographic display.,2999,Electronics,https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80,4.8,In Stock,https://example.com/deck
2,Quantum Processor,Next-gen quantum computing core for AI tasks.,5400,Hardware,https://images.unsplash.com/photo-1555664424-778a69022365?auto=format&fit=crop&w=800&q=80,5.0,Low Stock,https://example.com/proc
3,Neural Interface,Direct brain-computer interface for seamless connectivity.,1200,Implants,https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=800&q=80,4.5,In Stock,https://example.com/neural
`.trim();

/**
 * Robust CSV Parser
 * Handles:
 * - Commas within quotes
 * - Newlines within quotes
 * - Escaped quotes ("")
 */
export const parseCSV = (text: string): { headers: string[]; rows: SheetRow[] } => {
  const arr: string[][] = [];
  let quote = false;
  let row = 0;
  let col = 0;
  let c = 0;
  
  // Normalize line breaks
  text = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  
  arr[row] = [];
  arr[row][col] = '';

  for (c = 0; c < text.length; c++) {
    const cc = text[c];
    const nc = text[c+1];

    arr[row] = arr[row] || [];
    arr[row][col] = arr[row][col] || '';

    // Handle escaped quotes
    if (cc == '"' && quote && nc == '"') { 
        arr[row][col] += '"'; 
        ++c; 
        continue; 
    }
    
    // Handle quotes
    if (cc == '"') { 
        quote = !quote; 
        continue; 
    }
    
    // Handle delimiters
    if (cc == ',' && !quote) { 
        ++col; 
        arr[row][col] = '';
        continue; 
    }
    
    // Handle newlines
    if (cc == '\n' && !quote) { 
        ++row; 
        col = 0; 
        arr[row] = [];
        arr[row][col] = '';
        continue; 
    }

    arr[row][col] += cc;
  }

  // Filter out empty rows (often the last one)
  const data = arr.filter(r => r.length > 0 && (r.length > 1 || r[0].trim() !== ''));
  
  if (data.length === 0) return { headers: [], rows: [] };

  const rawHeaders = data[0].map(h => h.trim());
  
  // Identify valid indices (Excluding Column T which is index 19 if needed, keeping generic)
  const validIndices = rawHeaders.map((_, i) => i);
  
  const headers = validIndices.map(i => rawHeaders[i]);
  const rows: SheetRow[] = [];

  for (let i = 1; i < data.length; i++) {
    const currentRow = data[i];
    const rowObj: SheetRow = {};
    
    // Map only valid indices
    validIndices.forEach((originalIndex, newIndex) => {
      const header = headers[newIndex];
      let val = currentRow[originalIndex];
      
      if (val === undefined || val === '') {
        rowObj[header] = null;
      } else {
        val = val.trim();
        // Try to convert numbers/booleans
        if (!isNaN(Number(val)) && val !== '') {
            rowObj[header] = Number(val);
        } else if (val.toLowerCase() === 'true') {
            rowObj[header] = true;
        } else if (val.toLowerCase() === 'false') {
            rowObj[header] = false;
        } else {
            rowObj[header] = val;
        }
      }
    });
    rows.push(rowObj);
  }

  return { headers, rows };
};

export const heuristicAnalysis = (headers: string[], rows: SheetRow[]) => {
  const matches = (header: string, keywords: string[]) => {
    const h = header.toLowerCase();
    return keywords.some(k => h.includes(k));
  };

  const mapping: FieldMapping = {};

  // 1. Image
  mapping.imageField = headers.find(h => matches(h, ['image', 'img', 'photo', 'picture', 'thumb']));
  if (!mapping.imageField) {
      // Look for a column that looks like a URL image
      const potentialUrlField = headers.find(h => {
          const val = String(rows[0]?.[h] || '');
          return val.startsWith('http') && (val.match(/\.(jpg|jpeg|png|gif|webp|bmp|svg)/i));
      });
      if (potentialUrlField) mapping.imageField = potentialUrlField;
  }

  // 2. Title (Name)
  mapping.titleField = headers.find(h => matches(h, ['name', 'title', 'product', 'item', 'subject']));
  if (!mapping.titleField) mapping.titleField = headers[0]; 

  // 3. Category (Type)
  mapping.categoryField = headers.find(h => matches(h, ['type', 'category', 'cat', 'tag', 'classification']));

  // 4. Price (Monthly Rent)
  mapping.priceField = headers.find(h => matches(h, ['monthly rent', 'rent', 'price', 'cost', 'amount']));

  // 5. Link
  mapping.linkField = headers.find(h => matches(h, ['link', 'url', 'web', 'site', 'href']));

  // 6. Date
  mapping.dateField = headers.find(h => matches(h, ['date', 'time', 'year', 'created']));

  // 7. Contact Info
  mapping.emailField = headers.find(h => matches(h, ['email', 'mail']));
  mapping.phoneField = headers.find(h => matches(h, ['phone', 'tel', 'cell', 'mobile', 'contact']));
  mapping.addressField = headers.find(h => matches(h, ['address', 'location', 'city', 'place', 'street']));

  // 8. Coordinates
  mapping.latField = headers.find(h => matches(h, ['latitude', 'lat']));
  mapping.longField = headers.find(h => matches(h, ['longitude', 'long', 'lng']));

  // 9. Description (Other Information / About)
  // Added "a bit about yourself" explicitly
  mapping.descriptionField = headers.find(h => matches(h, ['a bit about yourself', 'other information', 'about', 'description', 'desc', 'looking for', 'info', 'note', 'detail']));
  
  if (!mapping.descriptionField) {
      // Fallback: Find the field with the longest average text length
      let bestField = undefined;
      let maxAvgLen = 0;
      const exclude = Object.values(mapping).filter(Boolean) as string[];
      
      headers.forEach(h => {
          if (exclude.includes(h)) return;
          let total = 0;
          let count = 0;
          // Sample first 10 rows
          for(let i=0; i<Math.min(rows.length, 10); i++) {
              const val = rows[i][h];
              if (typeof val === 'string') {
                  total += val.length;
                  count++;
              }
          }
          const avg = count > 0 ? total/count : 0;
          if (avg > maxAvgLen) {
              maxAvgLen = avg;
              bestField = h;
          }
      });
      // Threshold for description
      if (maxAvgLen > 20 && bestField) { 
          mapping.descriptionField = bestField;
      }
  }

  // Conflict Resolution: Category cannot be the same as Description
  if (mapping.categoryField === mapping.descriptionField) {
      mapping.categoryField = undefined;
  }

  // 10. Room Field (Specific for Filtering: Rooms for Rent)
  mapping.roomField = headers.find(h => matches(h, ['rooms for rent', 'spots available', 'number of rooms'])) 
                   || headers.find(h => matches(h, ['bedrooms', 'beds', 'br']));

  // 11. Carpool Specifics - Added Exact Matches from Prompt
  mapping.originField = headers.find(h => matches(h, ['meet-up location', 'meet-up', 'location', 'origin', 'from']));
  mapping.destinationField = headers.find(h => matches(h, ['destination', 'to']));
  mapping.departureTimeField = headers.find(h => matches(h, ['departure date/time', 'departure', 'leave']));
  mapping.returnTimeField = headers.find(h => matches(h, ['return date/time', 'return', 'back']));
  // "Number of students you have room for"
  mapping.capacityField = headers.find(h => matches(h, ['number of students you have room for', 'room for', 'seats', 'passengers', 'capacity']));

  // 12. Features / Specs (Bedroom, Bathroom, Duration, Rooms, Preferences)
  // Added "Preferences for others in car"
  const specKeywords = ['preferences', 'preference', 'bed', 'bath', 'duration', 'sqft', 'size', 'furnished', 'rooms', 'gas'];
  
  // Construct a list of fields we have already explicitly mapped to specific UI roles
  // We want to exclude these from the generic 'Features' list to avoid duplication.
  const usedFields = [
      mapping.titleField,
      mapping.addressField,
      mapping.descriptionField,
      mapping.imageField,
      mapping.priceField,
      mapping.linkField,
      mapping.dateField,
      mapping.emailField,
      mapping.phoneField,
      mapping.latField,
      mapping.longField,
      mapping.roomField,
      mapping.originField,
      mapping.destinationField,
      mapping.departureTimeField,
      mapping.returnTimeField,
      mapping.capacityField
  ].filter(Boolean) as string[];

  mapping.featuresFields = headers.filter(h => {
     if (usedFields.includes(h)) return false;
     return matches(h, specKeywords);
  });

  return {
      mapping,
      summary: `Displaying ${rows.length} items.`,
      suggestedName: "Housing List"
  };
};
