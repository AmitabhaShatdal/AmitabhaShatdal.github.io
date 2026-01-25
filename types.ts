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
  sourceCategory?: string; // 'News', 'Social Discussion', 'Consumer Reviews', 'Employer Reviews'
  isVerifiedSource?: boolean; // true if passed whitelist validation
}

export interface SocialSentimentData {
  reddit: {
    score: number;
    count: number;
    mentions: Array<{ title: string; sentiment: string; subreddit?: string }>;
  };
  reviews: {
    score: number;
    count: number;
    platforms: Record<string, { score: number; count: number }>;
  };
  employer: {
    score: number;
    count: number;
    source: string;
  };
  overall: number;
}

export interface SourceStats {
  totalProcessed: number;
  passed: number;
  filtered: number;
  verifiedSources: number;
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
  
  // Social sentiment data from Reddit, reviews, employer sites
  socialSentiment?: SocialSentimentData;
  
  // Source filtering statistics
  sourceStats?: SourceStats;
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