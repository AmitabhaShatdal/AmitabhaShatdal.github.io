// ------------------------------------------------------------------
// CONFIGURATION
// ------------------------------------------------------------------

import { TabConfig } from './bulletinboardTypes';

// Sheet IDs
const HOUSING_SHEET_ID = "1F0WQTDbb0ThFl1A3BhEl5HdX82gJZK96L0OaKj27mgg";
const MERCH_SHEET_ID = "1L-tk0PqcGCUVqHbtwl9m39ZB5KqiX6EkIIzLsRuRZqA";
const CARPOOL_SHEET_ID = "1JPYvFQ_LDdCNzQlWqMfX1Q-qI26MuWMcEdBNfAa8xVY";

// Forms
const HOUSING_FORM = "https://forms.gle/WGTWCoca8twMk1My5";
const HOUSING_DELETE = "https://docs.google.com/forms/d/e/1FAIpQLSf1zLf8M1WB7YnNWc-xZvActmLatHu-ahv_-G2wJcBYOSyG5w/viewform?usp=dialog";

const MERCH_FORM = "https://forms.gle/F6FjJBEVgjDtaH5fA";
const MERCH_DELETE = "https://docs.google.com/forms/d/e/1FAIpQLSdCs99OmQFr9Bh7f7Rv1LeDpIdvPPsw3dTSn6h6fiV5aQWHMw/viewform?usp=dialog";

const CARPOOL_FORM = "https://docs.google.com/forms/d/e/1FAIpQLSdeinTisVbDiPmtRl7ClFl4mjQHu1MDvgYQropl6A6U_rMM-w/viewform?usp=dialog";
const CARPOOL_DELETE = "https://docs.google.com/forms/d/e/1FAIpQLScqBdMP2kASgvE2bOmxptZv7xALXpKWnQVlluwvGQNg1oNBlg/viewform?usp=dialog";

export const SHEET_TABS: TabConfig[] = [
  { 
    id: "Lease Transfers", 
    gid: "0",
    sheetId: HOUSING_SHEET_ID,
    formUrl: HOUSING_FORM,
    deleteUrl: HOUSING_DELETE
  },
  { 
    id: "Students Looking", 
    gid: "257329705",
    sheetId: HOUSING_SHEET_ID,
    formUrl: HOUSING_FORM, 
    deleteUrl: HOUSING_DELETE
  },
  {
    id: "For Sale",
    gid: "0", 
    sheetId: MERCH_SHEET_ID,
    formUrl: MERCH_FORM,
    deleteUrl: MERCH_DELETE
  },
  {
    id: "Wanted",
    gid: "383539073",
    sheetId: MERCH_SHEET_ID,
    formUrl: MERCH_FORM,
    deleteUrl: MERCH_DELETE
  },
  {
    id: "Rides Available",
    gid: "0",
    sheetId: CARPOOL_SHEET_ID,
    formUrl: CARPOOL_FORM,
    deleteUrl: CARPOOL_DELETE
  },
  {
    id: "Carpool Requests",
    gid: "1075932750",
    sheetId: CARPOOL_SHEET_ID,
    formUrl: CARPOOL_FORM,
    deleteUrl: CARPOOL_DELETE
  }
];

export const GOOGLE_SHEET_ID = HOUSING_SHEET_ID;
export const GOOGLE_FORM_URL = HOUSING_FORM;
export const GOOGLE_DELETE_FORM_URL = HOUSING_DELETE;