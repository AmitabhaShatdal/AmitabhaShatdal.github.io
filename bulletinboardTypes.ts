
export interface SheetRow {
  [key: string]: string | number | boolean | null;
}

export interface FieldMapping {
  titleField?: string;
  descriptionField?: string;
  imageField?: string;
  categoryField?: string;
  priceField?: string;
  linkField?: string;
  dateField?: string;
  
  // New fields for housing/contact
  emailField?: string;
  phoneField?: string;
  addressField?: string;
  
  // Specific housing fields
  roomField?: string; // For "Rooms for Rent" count
  
  // Carpool specific
  originField?: string;
  destinationField?: string;
  departureTimeField?: string;
  returnTimeField?: string;
  capacityField?: string; // "Number of students you have room for"

  featuresFields?: string[]; // Array of column names for specs like 'Bedrooms', 'Duration'
  
  // Map fields
  latField?: string;
  longField?: string;
}

export interface DatasetConfig {
  name: string;
  rows: SheetRow[];
  columns: string[];
  mapping: FieldMapping;
  summary?: string;
}

export interface TabConfig {
  id: string; // The text name of the tab for display
  gid: string; // The Google Sheet GID parameter
  sheetId?: string; // Optional: Override the default sheet ID
  formUrl?: string; // Optional: Override the add form URL
  deleteUrl?: string; // Optional: Override the delete form URL
}

export type CardType = 'lease' | 'student' | 'sale' | 'wanted' | 'carpool';

export enum AppState {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  READY = 'READY',
  ERROR = 'ERROR'
}