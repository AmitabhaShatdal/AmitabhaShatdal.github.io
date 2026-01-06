export interface Executive {
  name: string;
  role: string;
  sentimentScore: number;
  summary: string;
}

export interface NewsItem {
  headline: string;
  date: string; // Display string
  timestamp: number; // For sorting
  summary: string;
  source: string;
  relatedExecutive: string; // The executive this item is about
  sentimentScore: number; // -1.0 to 1.0
  sentimentLabel: 'Positive' | 'Neutral' | 'Negative';
  keyQuotes: string[];
  link?: string;
  relevanceScore?: number;
  sourceScore?: number;
}

export interface TradingSignal {
  type: 'BULLISH_DIVERGENCE' | 'BEARISH_DIVERGENCE' | 'BULLISH_CONSENSUS' | 'BEARISH_CONSENSUS' | 'VOLATILITY_WARNING' | 'NEUTRAL';
  headline: string;
  description: string;
  strength: number;
}

export interface CompanyAnalysisResult {
  ticker: string;
  companyName: string;
  overallSentiment: number; // C-Suite Sentiment
  overallSummary: string;
  
  // Wall Street Data
  wallStreetSentiment: number; // -1.0 to 1.0
  wallStreetSummary: string;
  
  // Consumer Data
  consumerSentiment: number;
  consumerSummary: string;

  sentimentGap: number; // C-Suite - Wall Street

  executives: Executive[];
  items: NewsItem[];
  
  groundingLinks?: GroundingChunk[];
  signal?: TradingSignal;
}

export interface GroundingChunk {
  web?: {
    uri: string;
    title: string;
  };
}

export enum AnalysisStatus {
  IDLE = 'IDLE',
  SEARCHING = 'SEARCHING',
  ANALYZING = 'ANALYZING',
  COMPLETE = 'COMPLETE',
  ERROR = 'ERROR'
}