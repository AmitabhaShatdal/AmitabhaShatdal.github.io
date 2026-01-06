import { CompanyAnalysisResult, NewsItem, Executive, TradingSignal, GroundingChunk } from "../types";

// --- CONFIGURATION & LEXICONS ---

// 1. CONSUMER / PRODUCT SENTIMENT (The "User" Voice)
const CONSUMER_LEXICON: Record<string, number> = {
  // Positive - Product Quality & Experience
  "amazing": 3.0, "love": 3.5, "excellent": 3.0, "best": 2.5, "great": 2.0,
  "helpful": 2.0, "clean": 1.5, "fast": 2.0, "friendly": 2.0, "easy": 2.5,
  "worth": 2.0, "recommend": 3.0, "happy": 2.0, "awesome": 2.5, "seamless": 3.0,
  "addicted": 2.0, "obsessed": 2.5, "premium": 2.0, "luxury": 1.5, "must-have": 3.5,
  "bargain": 2.0, "value": 2.0, "reliable": 3.0, "trust": 3.0, "favorite": 2.5,
  "ecosystem": 2.0, "community": 1.5, "fan": 1.5, "loyal": 2.5, "intuitive": 2.5,
  "responsive": 2.0, "durable": 2.5, "robust": 2.0, "innovative": 3.0, "sleek": 1.5,
  "flagship": 2.5, "solid": 2.0, "secure": 2.0, "original": 2.0, "affordable": 2.0,
  "fun": 2.0, "engaging": 2.0, "smooth": 2.0, "stable": 2.0, "fresh": 1.5,
  
  // Positive - Hype & Demand
  "viral": 2.5, "buzz": 2.0, "craze": 2.0, "trending": 1.5, "waitlist": 2.0, 
  "backorder": 1.5, "queue": 1.5, "hyped": 1.5, "anticipation": 1.5, "sold-out": 2.5,

  // Negative - Product Quality & Experience
  "terrible": -3.5, "hate": -3.5, "worst": -4.0, "horrible": -3.5, "awful": -3.5,
  "rude": -3.0, "slow": -2.5, "dirty": -2.5, "expensive": -2.0, "overpriced": -3.0,
  "bad": -2.5, "poor": -2.5, "useless": -3.5, "broken": -3.5, "avoid": -4.0,
  "scam": -4.5, "waiting": -2.0, "issue": -1.5, "problem": -1.5, "buggy": -3.0,
  "glitch": -2.5, "crash": -3.0, "frustrated": -3.0, "annoying": -2.5, "refund": -3.0,
  "cancel": -3.0, "unsubscribe": -3.0, "churn": -3.5, "rip-off": -4.0, "laggy": -2.5,
  "clunky": -2.5, "outdated": -2.5, "obsolete": -3.0, "flimsy": -3.0, "bloatware": -2.5,
  "ads": -1.5, "spam": -2.5, "intrusive": -2.5, "unstable": -3.0, "hack": -4.0,
  "breach": -5.0, "leak": -4.0, "toxic": -3.5, "dead": -3.0, "copy": -1.5,
  "clone": -1.5, "damaged": -3.0, "defective": -3.5, "recall": -4.0, "fail": -3.0,
  "failure": -3.0, "disappointing": -2.5, "underwhelming": -2.0, "boring": -1.5,

  // Negative - Support & Service
  "ignored": -3.0, "ghosted": -3.0, "unhelpful": -2.5, "incompetent": -3.0, 
  "robot": -1.5, "bot": -1.5, "automated": -0.5, "delays": -2.0, "charged": -1.5
};

// 2. EXECUTIVE / C-SUITE TONE (The "Internal" Voice)
const EXEC_TONE_LEXICON: Record<string, number> = {
  // Vision & Confidence (High Weight)
  "confident": 3.0, "thrilled": 3.0, "excited": 3.0, "optimistic": 2.5, "committed": 3.0,
  "vision": 2.5, "roadmap": 2.0, "transformational": 3.5, "foundational": 2.0,
  "belief": 2.0, "conviction": 2.5, "dedicated": 2.0, "mission": 2.0,
  "robust": 2.5, "resilient": 2.5, "strong": 2.0, "momentum": 2.5, "accelerate": 2.5,
  "executing": 2.5, "record": 3.0, "milestone": 2.5, "innovation": 2.5, "leadership": 2.5,
  "strategic": 1.5, "opportunity": 2.5, "discipline": 2.0, "efficiency": 2.0,
  "profitability": 2.5, "synergy": 2.5, "pleased": 2.0, "solid": 1.5, "constructive": 1.5,
  "accretive": 2.5, "outperform": 2.5, "tailwinds": 2.5, "growth": 2.0, "expansion": 2.0,
  "breakthrough": 3.5, "pioneering": 3.0, "leading": 2.5, "premier": 2.5,
  "unlocked": 2.5, "positioned": 2.0, "trajectory": 1.5, "evolution": 2.0,
  "visibility": 2.0, "clarity": 2.0, "bullish": 2.5,

  // Action Verbs (New Addition for Tech/Growth Companies)
  "announce": 1.5, "announces": 1.5, "announced": 1.5,
  "unveil": 2.0, "unveils": 2.0, "unveiled": 2.0,
  "launch": 2.0, "launches": 2.0, "launched": 2.0,
  "release": 1.5, "releases": 1.5, "released": 1.5,
  "deploy": 1.5, "deploys": 1.5, "deployed": 1.5,
  "partner": 1.5, "partners": 1.5, "partnered": 1.5, "partnership": 2.0,
  "award": 2.0, "awarded": 2.0, "contract": 1.5,
  "expand": 2.0, "expands": 2.0, "expanded": 2.0,
  "scale": 1.5, "scaling": 1.5, "scaled": 1.5,
  "production": 1.0, "deliveries": 1.5, "delivered": 1.5,
  "approve": 2.0, "approved": 2.0, "approval": 2.0,
  "secured": 2.0,

  // Evasive / Cautionary (The "Non-Answer" Penalties)
  "headwind": -2.5, "challenge": -2.0, "uncertain": -2.5, "uncertainty": -2.5,
  "volatile": -2.0, "volatility": -2.0, "pressure": -2.0, "soft": -2.0, "softness": -2.0,
  "weak": -2.5, "weakness": -2.5, "cautious": -2.0, "prudent": -0.5, "conservative": -1.0,
  "difficult": -2.0, "tough": -2.0, "impact": -1.5, "constraint": -2.0, "shortage": -2.0,
  "disappointed": -3.0, "lower": -1.5, "decline": -2.0, "slow": -1.5, "flat": -1.0,
  "recalibrate": -2.0, "restructure": -1.5, "reduction": -2.0, "risk": -1.5,
  "transitory": -1.0, "offset": -0.5, "monitor": -1.0, "temporary": -0.5,
  "navigate": -0.5, "mitigate": -0.5, "complex": -1.0, "fluid": -1.5, "dynamic": -0.5,
  "delayed": -2.0, "delay": -2.0, "pause": -1.5, "halted": -2.5
};

// 3. WALL STREET / ANALYST JARGON (The "External" Voice)
const WALL_ST_LEXICON: Record<string, number> = {
  // Bullish Signals
  "buy": 2.5, "strong buy": 3.5, "conviction buy": 4.0, "top pick": 3.5,
  "overweight": 2.5, "outperform": 3.0, "accumulate": 2.5, "add": 2.0,
  "upgrade": 3.5, "boost": 2.5, "hike": 2.5, "raise": 2.5,
  "upside": 2.5, "catalyst": 2.0, "breakout": 3.0, "rally": 2.5, "soar": 3.0,
  "surge": 3.0, "jump": 2.5, "climb": 2.0, "bull": 2.5, "bullish": 3.0,
  "beat": 3.0, "smash": 3.5, "exceed": 2.5, "recovery": 2.0, "rebound": 2.0,
  "undervalued": 3.0, "cheap": 2.0, "attractive": 2.5, "premium": 1.0,
  
  // Bearish Signals
  "sell": -3.0, "strong sell": -4.0, "underweight": -2.5, "underperform": -3.0,
  "reduce": -2.0, "avoid": -3.0, "downgrade": -3.5, "cut": -3.0, "slash": -3.5,
  "trim": -1.5, "downside": -2.5, "risk": -1.5, "breakdown": -3.0, "crash": -4.0,
  "plunge": -3.5, "dive": -3.0, "drop": -2.0, "fall": -1.5, "slide": -1.5,
  "slump": -2.5, "bear": -2.5, "bearish": -3.0, "miss": -3.0, "lag": -2.0,
  "overvalued": -3.0, "expensive": -2.0, "rich": -1.5, "bubble": -3.5,
  "correction": -2.0, "retreat": -1.5, "sell-off": -2.5, "liquidation": -3.0,
  
  // Neutral / Soft Signals
  "hold": 0.0, "neutral": -0.5, "equal-weight": 0.0, "market perform": -0.5,
  "sector perform": -0.5, "peer perform": -0.5, "in-line": 0.0
};

// 4. CONSUMER PHRASES (Multi-word identifiers for product/service quality)
const CONSUMER_PHRASES: Record<string, number> = {
  // High Praise
  "game changer": 4.0, "highly recommend": 3.5, "must buy": 3.5, "value for money": 3.0,
  "best in class": 3.5, "top tier": 3.0, "user friendly": 2.5, "seamless experience": 3.0,
  "great support": 3.0, "excellent service": 3.0, "works perfectly": 3.0, "exceeded expectations": 3.5,
  "fan favorite": 2.5, "cult following": 2.5, "sold out": 3.0, "bang for buck": 3.0,
  "easy to use": 3.0, "lasts all day": 3.0, "worth every penny": 4.0, "build quality": 2.0,
  
  // Severe Criticism & Crisis
  "waste of money": -4.0, "do not buy": -4.0, "rip off": -4.0, "stay away": -4.0,
  "worst experience": -4.0, "terrible service": -3.5, "hidden fees": -3.5, "predatory pricing": -4.0,
  "data breach": -5.0, "security flaw": -4.0, "privacy concerns": -3.0, "class action": -4.0,
  "product recall": -5.0, "safety hazard": -5.0, "fire hazard": -5.0, "not working": -3.0,
  "difficult to use": -2.5, "learning curve": -1.5, "login issues": -2.0, "server down": -3.5,
  "outage": -4.0, "service down": -3.5, "glitchy": -2.5, "unresponsive": -2.5,
  "steep learning curve": -1.5, "bad update": -2.5, "broken feature": -2.5,
  "dies fast": -3.0, "short battery": -2.5, "qc issues": -3.5, "quality control": -1.0,
  "hard to use": -3.0, "would not recommend": -4.0
};

// 5. INSIDER TRADING / ACTIONS (Highest Conviction Signal)
const INSIDER_PHRASES: Record<string, number> = {
  "insider buying": 4.5, "bought shares": 4.0, "purchased shares": 4.0, 
  "insider purchase": 4.0, "cluster buy": 4.5, "increased stake": 3.5,
  "insider selling": -3.5, "sold shares": -3.0, "dumped shares": -4.0,
  "offloaded stock": -3.5, "filed to sell": -3.5, "option exercise": -2.0,
  "form 4 sell": -3.5, "form 4 buy": 4.0
};

// CORPORATE DECODER RING
const EXEC_PHRASES: Record<string, number> = {
  "guidance raised": 4.5, "raised outlook": 4.5, "raised guidance": 4.5,
  "strong demand": 4.0, "record revenue": 4.5, "record earnings": 4.5,
  "margin expansion": 4.0, "operating leverage": 4.0, "margin improvement": 3.5,
  "cash flow positive": 3.5, "strong balance sheet": 3.0, "dividend increase": 3.5,
  "share repurchase": 3.5, "market share gains": 4.0, "competitive advantage": 3.5,
  "structural growth": 3.5, "secular tailwinds": 3.5, "firing on all cylinders": 4.0,
  "exceeding expectations": 4.0, "ahead of schedule": 3.5, "acceleration in": 3.5,
  "cost discipline": 2.5, "efficiency gains": 2.5, "optimizing footprint": 2.0,
  "streamlining operations": 2.0, "right-sizing": 1.5, "resource allocation": 1.5,
  "guidance cut": -5.0, "lowered outlook": -5.0, "guidance lowered": -5.0,
  "weak demand": -4.0, "softness in": -3.5, "macro headwinds": -3.0,
  "transitional year": -4.0, "resetting expectations": -4.5, "strategic review": -4.0,
  "exploring alternatives": -5.0, "going concern": -6.0, "liquidity preservation": -4.5,
  "covenant waiver": -5.0, "inventory correction": -3.5, "destocking": -3.0,
  "margin contraction": -4.0, "cost inflation": -3.0, "cash burn": -4.0,
  "elongated sales cycles": -3.5, "customer hesitation": -3.5, "execution challenges": -3.5,
  "supply chain constraints": -2.5, "currency headwinds": -2.0, "geopolitical uncertainty": -2.0
};

const MARKET_PHRASES: Record<string, number> = {
  "beat estimates": 4.0, "missed estimates": -4.0,
  "better than expected": 3.0, "worse than expected": -3.0,
  "buy rating": 3.5, "sell rating": -3.5,
  "price target raised": 3.5, "price target cut": -3.5,
  "raised price target": 3.5, "cut price target": -3.5,
  "record high": 3.5, "record low": -3.5,
  "all time high": 4.0, "all time low": -4.0,
  "strong buy": 4.0, "strong sell": -4.0,
  "short interest": -2.0, "insider selling": -2.5, "insider buying": 3.0
};

const IMPACT_WEIGHTS: Record<string, number> = {
  "earnings": 2.5, "revenue": 1.5, "guidance": 2.5, "acquisition": 2.0, "merger": 2.0,
  "fda": 2.5, "approval": 1.5, "lawsuit": 2.0, "investigation": 2.0, "bankruptcy": 3.0,
  "ceo": 1.5, "cfo": 1.5, "resigns": 2.5, "appoints": 1.5, "interview": 2.0,
  "form 4": 3.0, "sec filing": 2.0
};

const HEDGING_WORDS = new Set([
  "possibly", "might", "could", "hoping", "trying", "attempting", "somewhat",
  "partially", "relative", "basically", "essentially", "appears", "seems"
]);

const FUTURE_TENSE = new Set([
  "will", "expect", "target", "aim", "project", "forecast", "anticipate", "outlook", "guidance"
]);

const BOOSTER_DICT: Record<string, number> = {
  "absolutely": 0.3, "amazingly": 0.3, "completely": 0.3, "extremely": 0.4,
  "deeply": 0.3, "enormously": 0.3, "especially": 0.3, "exceptionally": 0.4,
  "hugely": 0.4, "incredibly": 0.4, "intensely": 0.3, "majorly": 0.3,
  "really": 0.3, "remarkably": 0.3, "significantly": 0.3, "totally": 0.3,
  "tremendously": 0.4, "very": 0.3, "substantially": 0.3, "unexpectedly": 0.4
};

const NEGATIONS = new Set([
  "not", "isn't", "doesn't", "wasn't", "shouldn't", "won't", "cannot", "can't", "nor", "neither", "without", "lack", "missing", "fail", "failed", "unlikely"
]);

const NOISE_PATTERNS = [
  /\bpooling\b/i, /\btalent pool\b/i, /\bgene pool\b/i, /\bdead pool\b/i, 
  /\bcar pool\b/i, /\bprize pool\b/i, /\bmining pool\b/i, /\bdark pool\b/i,
  /\bswimming pool\b/i, 
  /\bcash flow\b/i, /\bcash back\b/i,
  /\bgap in\b/i, /\bgap between\b/i
];

const GENERIC_COMMON_WORDS = new Set([
  'POOL', 'CASH', 'LOVE', 'FAST', 'BEST', 'BIG', 'SAFE', 'TRUE', 'ALL', 'NEXT',
  'GAP', 'NOW', 'OUT', 'GPS', 'KEY', 'SPOT', 'RUN', 'EAT', 'PLAY', 'CORN', 'CAR',
  'CARE', 'GOOD', 'OPEN', 'LIFE', 'GOLD', 'SAVE', 'TARGET', 'MACY', 'DELL', 'HP',
  'VISA', 'BLOCK', 'SQUARE', 'MATCH', 'UBER', 'LYFT', 'ZOOM', 'SNAP', 'BOX', 'FIVE',
  'EBS', 'RH', 'ON', 'NET', 'BILL', 'LULU', 'CROX', 'BOOT', 'DECK', 'OSTK'
]);

const FINANCIAL_CONTEXT_WORDS = [
  'stock', 'shares', 'market', 'nasdaq', 'nyse', 'dividend', 'earnings', 'revenue',
  'profit', 'quarter', 'fiscal', 'guidance', 'investor', 'capital', 'equity', 'debt',
  'valuation', 'rating', 'analyst', 'target', 'buy', 'sell', 'hold', 'underweight',
  'overweight', 'eps', 'ebitda', 'margin', 'securities', 'ticker'
];

// --- SOURCES ---

const FINANCIAL_MAJORS = [
  "site:reuters.com", "site:bloomberg.com", "site:cnbc.com", "site:wsj.com",
  "site:ft.com", "site:marketwatch.com", "site:barrons.com", "site:forbes.com",
  "site:investors.com", "site:thestreet.com", "site:benzinga.com", "site:fool.com",
  "site:seekingalpha.com", "site:tipranks.com", "site:finance.yahoo.com"
];

const GLOBAL_MAJORS = [
  "site:bbc.com", "site:nytimes.com", "site:washingtonpost.com", 
  "site:theguardian.com", "site:economist.com", "site:usatoday.com", 
  "site:apnews.com", "site:npr.org", "site:politico.com"
];

const REGIONAL_SOURCES = [
  "site:nikkei.com", "site:scmp.com", "site:straitstimes.com", 
  "site:afr.com", "site:smh.com.au", 
  "site:dw.com", "site:france24.com", "site:euronews.com", 
  "site:timesofindia.indiatimes.com", "site:hindustantimes.com", 
  "site:aljazeera.com", "site:jpost.com",
  "site:torontosun.com", "site:financialpost.com"
];

const GRASSROOTS_SOURCES = [
  "site:reddit.com", "site:trustpilot.com", "site:glassdoor.com"
];

// EXPANDED HIGH TRUST LIST
const TRUSTED_DOMAINS = [
  'theatlantic.com', 'nationalgeographic.com', 'scientificamerican.com', 'bbc.com', 'bbc.co.uk',
  'abc.net.au', 'apnews.com', 'nytimes.com', 'wsj.com', 'reuters.com', 'bloomberg.com',
  'buenosairesherald.com', 'ctvnews.ca', 'theglobeandmail.com', 'postandcourier.com',
  'thetimes.co.uk', 'lemonde.fr', 'ians.in', 'nhk.or.jp', 'asia.nikkei.com', 'japantimes.co.jp',
  'mainichi.jp', 'yomiuri.co.jp', 'saturdayeveningpost.com', 'nation.africa', 'koreaherald.com',
  'koreatimes.co.kr', 'timesofmalta.com', 'upi.com', 'theguardian.com', 'saipantribune.com',
  'ansa.it', 'dw.com', 'indianexpress.com', 'ft.com', 'straitstimes.com', 'manilatimes.net',
  'scotsman.com', 'ukrinform.net', 'afp.com', 'barrons.com', 'rferl.org', 'euronews.com',
  'france24.com', 'vrt.be', 'world.kbs.co.kr', 'rfi.fr', 'news.err.ee', 'yle.fi', 
  'radionz.co.nz', 'npr.org', 'politico.com', 'pbs.org', 'economist.com'
];

// --- FALLBACK DATA FOR TOP TICKERS ---
const TOP_TICKERS_DATA: Record<string, {name: string, executives: {name: string, role: string}[]}> = {
  "AAPL": { name: "Apple Inc.", executives: [{name: "Tim Cook", role: "CEO"}, {name: "Luca Maestri", role: "CFO"}] },
  "MSFT": { name: "Microsoft Corporation", executives: [{name: "Satya Nadella", role: "CEO"}, {name: "Amy Hood", role: "CFO"}] },
  "GOOG": { name: "Alphabet Inc.", executives: [{name: "Sundar Pichai", role: "CEO"}, {name: "Ruth Porat", role: "CFO"}] },
  "GOOGL": { name: "Alphabet Inc.", executives: [{name: "Sundar Pichai", role: "CEO"}, {name: "Ruth Porat", role: "CFO"}] },
  "AMZN": { name: "Amazon.com Inc.", executives: [{name: "Andy Jassy", role: "CEO"}, {name: "Brian Olsavsky", role: "CFO"}] },
  "NVDA": { name: "NVIDIA Corporation", executives: [{name: "Jensen Huang", role: "CEO"}, {name: "Colette Kress", role: "CFO"}] },
  "TSLA": { name: "Tesla Inc.", executives: [{name: "Elon Musk", role: "CEO"}, {name: "Vaibhav Taneja", role: "CFO"}] },
  "META": { name: "Meta Platforms Inc.", executives: [{name: "Mark Zuckerberg", role: "CEO"}, {name: "Susan Li", role: "CFO"}] },
  "AMD": { name: "Advanced Micro Devices", executives: [{name: "Lisa Su", role: "CEO"}, {name: "Jean Hu", role: "CFO"}] },
  "NFLX": { name: "Netflix Inc.", executives: [{name: "Ted Sarandos", role: "Co-CEO"}, {name: "Greg Peters", role: "Co-CEO"}] }
};

// --- UTILITIES ---

// Normalize but with Bayesian Smoothing
const normalize = (score: number, totalWeight: number): number => {
  const alpha = 8;
  const rawNorm = score / Math.sqrt((score * score) + alpha);
  
  // Bayesian Smoothing: 
  const confidence = totalWeight / (totalWeight + 5); 
  
  const smoothedScore = rawNorm * confidence;
  
  return Math.max(-1.0, Math.min(1.0, smoothedScore));
};

const calculateTimeWeight = (pubDate: Date): number => {
  const now = new Date();
  const diffHours = (now.getTime() - pubDate.getTime()) / (1000 * 60 * 60);
  
  // ALGORITHM UPDATE: Smoother prioritization
  
  // 1. Fresh (Last 24 Hours) -> Weight 1.4x 
  if (diffHours <= 24) return 1.4;
  
  // 2. Recent (Last 7 Days) -> Weight 1.15x
  if (diffHours <= 24 * 7) return 1.15;
  
  // 3. Older (Up to 28 Days) -> Decay linearly
  return Math.max(0.5, 1.0 - (diffHours / (24 * 40)));
};

const getImpactMultiplier = (text: string): number => {
  const lower = text.toLowerCase();
  let maxMult = 1.0;
  Object.entries(IMPACT_WEIGHTS).forEach(([word, mult]) => {
    if (lower.includes(word)) maxMult = Math.max(maxMult, mult);
  });
  return maxMult;
};

const jaccardIndex = (str1: string, str2: string): number => {
  const tokenize = (s: string) => new Set(s.toLowerCase().replace(/[^a-z0-9\s]/g, '').split(/\s+/).filter(w => w.length > 2));
  const set1 = tokenize(str1);
  const set2 = tokenize(str2);
  
  if (set1.size === 0 || set2.size === 0) return 0;
  
  const intersection = new Set([...set1].filter(x => set2.has(x)));
  const union = new Set([...set1, ...set2]);
  
  return intersection.size / union.size;
};

const splitClauses = (text: string): string[] => {
  return text.split(/(?:\sbut\s|\showever\s|\salthough\s|\swhile\s|\sdespite\s|\sversus\s|[.;:!])/i)
    .filter(c => c.trim().length > 3);
};

const analyzeClause = (text: string): { execScore: number, marketScore: number, consumerScore: number } => {
  const tokens = text.toLowerCase().match(/\b[\w']+\b/g) || [];
  let execScore = 0;
  let marketScore = 0;
  let consumerScore = 0;
  let phraseText = text.toLowerCase();
  
  let confidenceMultiplier = 1.0;
  let isFutureTense = false;

  tokens.forEach(t => {
      if (HEDGING_WORDS.has(t)) confidenceMultiplier *= 0.7;
      if (FUTURE_TENSE.has(t)) isFutureTense = true;
  });

  if (isFutureTense) confidenceMultiplier *= 1.2;

  Object.keys(INSIDER_PHRASES).forEach(phrase => {
    if (phraseText.includes(phrase)) {
      execScore += (INSIDER_PHRASES[phrase] * 3.0); 
    }
  });

  Object.keys(EXEC_PHRASES).forEach(phrase => {
    if (phraseText.includes(phrase)) {
      execScore += (EXEC_PHRASES[phrase] * 1.5);
    }
  });

  Object.keys(MARKET_PHRASES).forEach(phrase => {
    if (phraseText.includes(phrase)) {
      marketScore += MARKET_PHRASES[phrase];
    }
  });

  Object.keys(CONSUMER_PHRASES).forEach(phrase => {
    if (phraseText.includes(phrase)) {
      consumerScore += CONSUMER_PHRASES[phrase];
    }
  });

  for (let i = 0; i < tokens.length; i++) {
    const word = tokens[i];
    
    const eVal = EXEC_TONE_LEXICON[word] || 0;
    const mVal = WALL_ST_LEXICON[word] || 0;
    const cVal = CONSUMER_LEXICON[word] || 0;

    if (eVal === 0 && mVal === 0 && cVal === 0) continue;

    let modifier = 1.0;
    for (let j = 1; j <= 3; j++) {
      if (i - j < 0) break;
      const prevWord = tokens[i - j];
      if (BOOSTER_DICT[prevWord]) modifier += BOOSTER_DICT[prevWord];
      if (NEGATIONS.has(prevWord)) modifier *= -0.8;
    }

    if (eVal !== 0) execScore += (eVal * modifier);
    if (mVal !== 0) marketScore += (mVal * modifier);
    if (cVal !== 0) consumerScore += (cVal * modifier);
  }

  execScore *= confidenceMultiplier;

  return { execScore, marketScore, consumerScore };
};

const extractItemData = (item: Element) => {
  const title = item.querySelector("title")?.textContent || "";
  
  // Prioritize content:encoded for richer data if available (Common in RSS)
  const encodedContent = item.getElementsByTagNameNS("*", "encoded")[0]?.textContent;
  
  let description = encodedContent || 
                    item.querySelector("description")?.textContent || 
                    item.querySelector("summary")?.textContent || 
                    item.querySelector("content")?.textContent || "";
                    
  const pubDateStr = item.querySelector("pubDate")?.textContent || 
                     item.querySelector("updated")?.textContent || 
                     item.querySelector("date")?.textContent || "";
  let link = item.querySelector("link")?.textContent || "";
  if (!link) {
      const linkElem = item.querySelector("link");
      if (linkElem && linkElem.hasAttribute("href")) {
          link = linkElem.getAttribute("href") || "";
      }
  }
  return { title, description, pubDateStr, link };
}

const fetchRSS = async (url: string, sourceName: string): Promise<Element[]> => {
  const urlWithCache = `${url}${url.includes('?') ? '&' : '?'}t=${Date.now()}`;
  
  const proxies = [
    `https://api.allorigins.win/get?url=${encodeURIComponent(urlWithCache)}`,
    `https://corsproxy.io/?${encodeURIComponent(urlWithCache)}`,
    `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(urlWithCache)}`
  ];

  for (let i = 0; i < proxies.length; i++) {
    const proxyUrl = proxies[i]; 
    
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000); 

      const response = await fetch(proxyUrl, { signal: controller.signal });
      clearTimeout(timeoutId);

      if (!response.ok) throw new Error(`Status ${response.status}`);
      
      let contents = "";
      
      if (proxyUrl.includes("allorigins")) {
          const data = await response.json();
          contents = data.contents;
      } else {
          contents = await response.text();
      }

      if (!contents || contents.length < 50) throw new Error("Empty contents");

      const parser = new DOMParser();
      const doc = parser.parseFromString(contents, "text/xml");
      let items = Array.from(doc.querySelectorAll("item"));
      if (items.length === 0) items = Array.from(doc.querySelectorAll("entry"));
      
      items.forEach(item => item.setAttribute("data-custom-source", sourceName));
      return items;

    } catch (e) {
      // Continue to next proxy
    }
  }
  return [];
};

const resolveCompanyIdentity = async (ticker: string): Promise<{ name: string, executives: {name: string, role: string}[] }> => {
  const defaultExecs = [
    { name: "CEO", role: "Chief Executive" },
    { name: "CFO", role: "Chief Financial" }
  ];

  // 1. CHECK HARDCODED DATA FIRST
  if (TOP_TICKERS_DATA[ticker]) {
    return TOP_TICKERS_DATA[ticker];
  }

  // 2. FALLBACK TO NETWORK LOOKUP
  try {
    const searchUrl = `https://query1.finance.yahoo.com/v1/finance/search?q=${ticker}`;
    const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(searchUrl)}`;
    
    const res = await fetch(proxyUrl);
    if (res.ok) {
      const json = await res.json();
      const searchData = JSON.parse(json.contents);
      
      if (searchData.quotes && searchData.quotes.length > 0) {
        const match = searchData.quotes.find((q: any) => q.symbol === ticker) || searchData.quotes[0];
        const result = { 
            name: match.shortname || match.longname || ticker, 
            executives: defaultExecs 
        };
        return result;
      }
    }
  } catch (e) {
    console.warn("Company resolution failed, fallback enabled.", e);
  }

  return { name: ticker, executives: defaultExecs };
};

const escapeRegExp = (string: string) => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); 
};

const detectContentCategory = (title: string, description: string, sourceLabel: string, companyIdentity: { name: string, executives: {name: string, role: string}[] }): string => {
  const t = title.toLowerCase();
  const d = description.toLowerCase();
  const s = sourceLabel.toLowerCase();
  const fullText = `${t} . ${d}`;

  if (/\b(transcript|earnings call|conference call|8-k|10-k|shareholder letter)\b/.test(t)) return "Leadership";
  if (s.includes("executive") || s.includes("sec filing")) return "Leadership";

  const titles = /\b(ceo|cfo|cto|chief executive|chief financial|chairman|president)\b/;
  const speechActs = /\b(said|says|announced|commented|stated|noted|remarked|discussed|explained|warned|highlighted)\b/;
  
  if (titles.test(t) && speechActs.test(t)) return "Leadership";
  
  const quotePattern = /"([^"]+)"\s*(?:,|said|says|according to)\s*(?:the\s*)?(ceo|cfo|chief executive|president|[A-Z][a-z]+)/;
  if (quotePattern.test(d)) return "Leadership";

  for (const exec of companyIdentity.executives) {
      if (exec.name !== "CEO" && exec.name !== "CFO") {
          if (fullText.includes(exec.name.toLowerCase())) return "Leadership";
      }
  }

  return sourceLabel; 
}

// --- MAIN SEARCH LOGIC ---

export async function fetchAndAnalyzeTicker(ticker: string, onProgress?: (msg: string) => void): Promise<CompanyAnalysisResult> {
  const t = ticker.toUpperCase().trim();

  if (onProgress) onProgress(`Resolving Identity: ${t}...`);
  
  const identity = await resolveCompanyIdentity(t);
  const companyName = identity.name; 
  const shortName = companyName.replace(/,?\s*(Inc\.?|Corp\.?|Corporation|Ltd\.?|Limited|LLC|Plc|Co\.?|Company|Holdings)\b\.?/gi, "").trim();
  
  // Extract specific Executive Names for query injection
  const execQueries = identity.executives
    .filter(e => e.name !== "CEO" && e.name !== "CFO")
    .map(e => `"${e.name}"`)
    .join(" OR ");

  const isGeneric = GENERIC_COMMON_WORDS.has(t) || 
                    GENERIC_COMMON_WORDS.has(shortName.toUpperCase()) ||
                    (shortName.split(' ').length === 1 && shortName.length < 4); 

  if (onProgress) onProgress(isGeneric 
    ? `Strict Mode Active: Filtering generic noise for "${companyName}"...` 
    : `Broad Search Active for "${companyName}"...`);

  let entityQuery = "";
  if (isGeneric) {
    entityQuery = `("${companyName}" OR (${t} AND (stock OR earnings OR dividend OR revenue)))`;
  } else {
    entityQuery = `("${companyName}" OR ${t} OR "${shortName}")`;
  }

  const yahooRssUrl = `https://finance.yahoo.com/rss/headline?s=${t}`;
  
  // DYNAMIC EXECUTIVE QUERY: Adds specific CEO name to catch more "personality" driven news (e.g. Elon Musk, Jensen Huang)
  const execQueryBase = execQueries ? `${entityQuery} AND (${execQueries} OR CEO OR CFO OR "Chief Executive")` : `${entityQuery} AND (CEO OR CFO OR "Chief Executive")`;

  const queries = [
    { label: "Yahoo Finance", urlOverride: yahooRssUrl, q: "" },
    { label: "Financial Majors", q: `${entityQuery} AND (${FINANCIAL_MAJORS.join(" OR ")}) when:28d` },
    { label: "Global News", q: `${entityQuery} AND (${GLOBAL_MAJORS.join(" OR ")} OR ${REGIONAL_SOURCES.join(" OR ")}) when:28d` },
    { label: "Executive Voice", q: `${execQueryBase} AND ("press release" OR "earnings call" OR transcript OR "shareholder letter") when:28d` },
    { label: "Executive Media", q: `${execQueryBase} AND (interview OR speaks OR discusses OR "fireside chat" OR "Q&A" OR quotes OR said OR announced OR comments) when:28d` },
    { label: "Wall Street", q: `${entityQuery} AND (analyst OR upgrade OR downgrade OR "price target" OR rating OR buy OR sell) when:28d` },
    { label: "Consumer", q: `${entityQuery} AND (customer OR review OR product OR service OR complaint OR "social media" OR sentiment OR demand OR sales OR store OR brand OR app OR users OR traffic OR survey OR ${GRASSROOTS_SOURCES.join(" OR ")}) when:28d` },
    { label: "Industry", q: `${entityQuery} AND (business OR sector OR industry OR growth OR strategy) when:28d` },
  ];

  const fetchPromises = queries.map(query => {
    if (query.urlOverride) return fetchRSS(query.urlOverride, query.label);
    return fetchRSS(`https://news.google.com/rss/search?q=${encodeURIComponent(query.q)}&hl=en-US&gl=US&ceid=US:en`, query.label);
  });

  const timeoutPromise = new Promise<never>((_, reject) => 
    setTimeout(() => reject(new Error("Search timed out (exceeded 30 seconds). The network is congested or data sources are unresponsive.")), 30000)
  );

  const results = await Promise.race([
    Promise.all(fetchPromises),
    timeoutPromise
  ]);
  
  const allRawItems = results.flat();

  if (allRawItems.length === 0) {
    throw new Error(`No confirmed data streams found for ${t}.`);
  }

  if (onProgress) onProgress(`Analyzing ${allRawItems.length} sources...`);

  const newsItems: NewsItem[] = [];
  
  let weightedExecSum = 0;
  let totalExecWeight = 0;
  let weightedMarketSum = 0;
  let totalMarketWeight = 0;
  let weightedConsumerSum = 0;
  let totalConsumerWeight = 0;
  
  const tickerRegex = new RegExp(`\\b${t}\\b`, 'i');
  const fullCompanyRegex = new RegExp(escapeRegExp(companyName), 'i');
  const shortNameRegex = new RegExp(`\\b${escapeRegExp(shortName)}\\b`, 'i');
  const financialContextRegex = new RegExp(`\\b(${FINANCIAL_CONTEXT_WORDS.join('|')})\\b`, 'i');
  const consumerContextRegex = /\b(customer|client|user|subscriber|player|gamer|fan|community|review|complaint|feedback|support|service|product|app|platform|device|experience|ui|ux|crash|bug|glitch|quality|refund|price|cost|value|subscription)\b/i;

  const now = new Date();
  const cutoffDate = new Date();
  cutoffDate.setDate(now.getDate() - 28);
  const cutoffTime = cutoffDate.getTime();

  for (const item of allRawItems) {
    const { title, description, pubDateStr, link } = extractItemData(item);
    const fullText = `${title} . ${description}`;
    const cleanDesc = description.replace(/<[^>]*>?/gm, ''); 

    // Date Parsing Safety
    let pubDate = new Date();
    try {
      if (pubDateStr && !isNaN(new Date(pubDateStr).getTime())) {
          pubDate = new Date(pubDateStr);
      }
    } catch(e) {
      console.warn("Date parsing failed", pubDateStr);
    }
    
    if (pubDate.getTime() < cutoffTime) {
        continue; 
    }

    const normTitle = title.toLowerCase().trim();
    
    let isDuplicate = false;
    for (const existing of newsItems) {
      if (jaccardIndex(normTitle, existing.headline) > 0.6) { 
        isDuplicate = true;
        break;
      }
    }
    if (isDuplicate) continue;

    let keep = false;
    const sourceLabel = item.getAttribute("data-custom-source") || "General";

    if (sourceLabel === "Yahoo Finance") {
      keep = true; 
    } else {
      const isNoise = NOISE_PATTERNS.some(pattern => pattern.test(fullText));
      if (isNoise) {
        keep = false;
      } else {
        const hasTicker = tickerRegex.test(fullText);
        const hasFullName = fullCompanyRegex.test(fullText);
        const hasShortName = shortNameRegex.test(fullText);

        if (isGeneric) {
           const hasContext = financialContextRegex.test(fullText);
           if (hasFullName) {
             keep = true;
           } else if (hasTicker && hasContext) {
             keep = true;
           }
        } else {
           if (hasTicker || hasFullName || hasShortName) {
             keep = true;
           }
        }
      }
    }

    if (!keep) continue;

    let timeWeight = calculateTimeWeight(pubDate);
    const impactMult = getImpactMultiplier(fullText);
    
    // --- TRUSTED SOURCE CHECK ---
    let sourceScore = 1;
    if (link) {
      try {
        const hostname = new URL(link).hostname.toLowerCase();
        if (TRUSTED_DOMAINS.some(d => hostname.includes(d))) {
          sourceScore = 10;
        } else if (FINANCIAL_MAJORS.some(d => hostname.includes(d.replace('site:', '')))) {
          sourceScore = 5;
        }
      } catch (e) { /* ignore invalid url */ }
    }

    let itemExecScore = 0;
    let itemMarketScore = 0;
    let itemConsumerScore = 0;

    const combinedText = `${title}. ${cleanDesc}`;
    const clauses = splitClauses(combinedText);
    
    clauses.forEach((clause, index) => {
        const scores = analyzeClause(clause);
        let clauseWeight = 1.0;
        if (clauses.length > 1 && index >= clauses.length / 2) {
            clauseWeight = 1.3;
        }
        itemExecScore += (scores.execScore * clauseWeight);
        itemMarketScore += (scores.marketScore * clauseWeight);
        itemConsumerScore += (scores.consumerScore * clauseWeight);
    });

    // We normalize item score slightly less aggressively here to preserve range
    const finalExec = normalize(itemExecScore, 10); 
    const finalMarket = normalize(itemMarketScore, 10);
    const finalConsumer = normalize(itemConsumerScore, 10);
    
    let category = detectContentCategory(title, cleanDesc, sourceLabel, identity);
    let reliabilityWeight = 1.0;
    
    // INTEGRATE TRUST SCORE INTO WEIGHT
    // Higher trust sources now count significantly more towards the final weighted average
    if (sourceScore >= 10) {
      reliabilityWeight = 1.5; 
    } else if (sourceScore >= 5) {
      reliabilityWeight = 1.25;
    }

    if (GRASSROOTS_SOURCES.some(s => s.includes(new URL(link).hostname.replace('www.','')))) {
      reliabilityWeight = 1.3; 
      category = "Consumer";
    }

    const isExec = category === "Leadership";

    if (isExec) {
      timeWeight *= 2.0; // Slightly reduced from 2.5 to avoid over-indexing on one PR
    } else if (consumerContextRegex.test(fullText)) {
      category = "Consumer";
    }

    const finalWeight = timeWeight * impactMult * reliabilityWeight;

    let displayScore = 0;

    if (category === "Leadership") {
       weightedExecSum += finalExec * finalWeight;
       totalExecWeight += finalWeight;
       displayScore = finalExec;
    } else if (["Wall Street", "Financials", "Yahoo Finance", "Major Wires", "Market News", "Financial Majors"].includes(category)) {
       weightedMarketSum += finalMarket * finalWeight;
       totalMarketWeight += finalWeight;
       displayScore = finalMarket;
    } else {
       if (category === "Consumer" || Math.abs(finalConsumer) > 0.05) {
          weightedConsumerSum += finalConsumer * finalWeight;
          totalConsumerWeight += finalWeight;
       }
       displayScore = finalConsumer;
    }

    newsItems.push({
      headline: title,
      date: pubDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
      timestamp: pubDate.getTime(),
      summary: cleanDesc.substring(0, 160) + (cleanDesc.length > 160 ? "..." : ""),
      source: item.querySelector("source")?.textContent || sourceLabel,
      relatedExecutive: isExec ? "C-Suite" : "General", 
      sentimentScore: displayScore,
      sentimentLabel: displayScore > 0.05 ? 'Positive' : displayScore < -0.05 ? 'Negative' : 'Neutral',
      keyQuotes: [],
      link,
      relevanceScore: finalWeight,
      sourceScore: sourceScore
    });
  }

  const filterOutliers = (items: NewsItem[], targetScore: number) => {
    if (items.length < 5) return;
    const variances = items.map(i => Math.pow(i.sentimentScore - targetScore, 2));
    const stdDev = Math.sqrt(variances.reduce((a, b) => a + b, 0) / items.length);
    
    items.forEach(i => {
      if (Math.abs(i.sentimentScore - targetScore) > (stdDev * 1.5)) {
        i.sentimentScore = i.sentimentScore * 0.7; 
      }
    });
  };
  
  // Sorting: Date Descending (bucketed by day), then Source Score Descending
  newsItems.sort((a, b) => {
    // Bucket by day to allow secondary sorting
    const dateA = new Date(a.timestamp).setHours(0,0,0,0);
    const dateB = new Date(b.timestamp).setHours(0,0,0,0);
    
    if (dateA !== dateB) {
      return dateB - dateA;
    }
    // Same day: Trustworthiness
    return (b.sourceScore || 0) - (a.sourceScore || 0);
  });
  
  // Use the new normalize with totalWeight (Bayesian Smoothing)
  const finalWallSt = normalize(totalMarketWeight > 0 ? (weightedMarketSum / totalMarketWeight) * 5 : 0, totalMarketWeight);
  const finalConsumer = normalize(totalConsumerWeight > 0 ? (weightedConsumerSum / totalConsumerWeight) * 5 : 0, totalConsumerWeight);
  const finalOverall = normalize(totalExecWeight > 0 ? (weightedExecSum / totalExecWeight) * 5 : 0, totalExecWeight);
  
  filterOutliers(newsItems, finalWallSt); 

  // CORRECTED REALITY SCORE: WEIGHTED AVERAGE
  const totalRealityWeight = totalExecWeight + totalConsumerWeight;
  let realityScore = finalOverall; // Default to Exec only
  
  if (totalRealityWeight > 0) {
      // Weighted average of Exec and Consumer for "Internal Reality"
      realityScore = ((finalOverall * totalExecWeight) + (finalConsumer * totalConsumerWeight)) / totalRealityWeight;
  }

  let gap = 0;
  // Gap is only valid if we have enough market data (e.g. at least weight of ~5, roughly 2-3 reliable articles)
  // Otherwise, the gap is likely noise.
  if (totalMarketWeight > 3.0) {
      gap = realityScore - finalWallSt;
  }
  
  let signal: TradingSignal = { type: 'NEUTRAL', headline: "Mixed Signals", description: "No clear consensus found across the three vectors.", strength: 50 };
  
  if (Math.abs(gap) > 0.4) {
     signal = gap > 0 
      ? { type: 'BULLISH_DIVERGENCE', headline: "Reality Exceeds Pricing", description: "Alpha Spread Detected: Management Confidence & Product Sentiment significantly outperform Wall Street's outlook.", strength: 85 }
      : { type: 'BEARISH_DIVERGENCE', headline: "Reality Lags Pricing", description: "Alpha Spread Detected: Wall Street is overly optimistic compared to Executive tone and Customer feedback.", strength: 85 };
  } else if (Math.abs(finalOverall) > 0.3 && Math.abs(finalWallSt) > 0.3 && Math.sign(finalOverall) === Math.sign(finalWallSt)) {
     signal = finalOverall > 0
      ? { type: 'BULLISH_CONSENSUS', headline: "Full Bullish Alignment", description: "Wall St and C-Suite strongly agree on positive trajectory.", strength: 95 }
      : { type: 'BEARISH_CONSENSUS', headline: "Full Bearish Alignment", description: "Universal negative outlook detected from both analysts and management.", strength: 95 };
  } else if (Math.abs(finalConsumer) > 0.5 && Math.sign(finalConsumer) !== Math.sign(finalWallSt)) {
      signal = finalConsumer > 0
      ? { type: 'VOLATILITY_WARNING', headline: "Consumer/Market Split", description: "Customers love the product, but Wall Street hates the stock (Value Trap potential).", strength: 75 }
      : { type: 'VOLATILITY_WARNING', headline: "Brand Erosion Warning", description: "Wall Street is bullish, but consumer sentiment is collapsing.", strength: 80 };
  }

  const groundingLinks: GroundingChunk[] = newsItems.map(i => ({
      web: { uri: i.link || "", title: i.headline }
  })).filter(g => g.web?.uri);

  const processedExecs: Executive[] = identity.executives.map(e => ({ name: e.name, role: e.role, sentimentScore: 0, summary: "" }));

  const result = {
    ticker: t,
    companyName,
    overallSentiment: finalOverall,
    overallSummary: "C-Suite Confidence Index", 
    wallStreetSentiment: finalWallSt,
    wallStreetSummary: "External Market Sentiment",
    consumerSentiment: finalConsumer,
    consumerSummary: "Broad Industry Context",
    sentimentGap: gap,
    executives: processedExecs,
    items: newsItems,
    groundingLinks,
    signal
  };

  return result;
}