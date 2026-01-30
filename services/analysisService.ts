import { CompanyAnalysisResult, NewsItem, Executive, TradingSignal, GroundingChunk, SocialSentimentData } from "../types";

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

  // Action Verbs
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

  // Evasive / Cautionary
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

// 3. WALL STREET / ANALYST JARGON
const WALL_ST_LEXICON: Record<string, number> = {
  "buy": 2.5, "strong buy": 3.5, "conviction buy": 4.0, "top pick": 3.5,
  "overweight": 2.5, "outperform": 3.0, "accumulate": 2.5, "add": 2.0,
  "upgrade": 3.5, "boost": 2.5, "hike": 2.5, "raise": 2.5,
  "upside": 2.5, "catalyst": 2.0, "breakout": 3.0, "rally": 2.5, "soar": 3.0,
  "surge": 3.0, "jump": 2.5, "climb": 2.0, "bull": 2.5, "bullish": 3.0,
  "beat": 3.0, "smash": 3.5, "exceed": 2.5, "recovery": 2.0, "rebound": 2.0,
  "undervalued": 3.0, "cheap": 2.0, "attractive": 2.5, "premium": 1.0,
  
  "sell": -3.0, "strong sell": -4.0, "underweight": -2.5, "underperform": -3.0,
  "reduce": -2.0, "avoid": -3.0, "downgrade": -3.5, "cut": -3.0, "slash": -3.5,
  "trim": -1.5, "downside": -2.5, "risk": -1.5, "breakdown": -3.0, "crash": -4.0,
  "plunge": -3.5, "dive": -3.0, "drop": -2.0, "fall": -1.5, "slide": -1.5,
  "slump": -2.5, "bear": -2.5, "bearish": -3.0, "miss": -3.0, "lag": -2.0,
  "overvalued": -3.0, "expensive": -2.0, "rich": -1.5, "bubble": -3.5,
  "correction": -2.0, "retreat": -1.5, "sell-off": -2.5, "liquidation": -3.0,
  
  "hold": 0.0, "neutral": -0.5, "equal-weight": 0.0, "market perform": -0.5,
  "sector perform": -0.5, "peer perform": -0.5, "in-line": 0.0
};

// 4. CONSUMER PHRASES
const CONSUMER_PHRASES: Record<string, number> = {
  "game changer": 4.0, "highly recommend": 3.5, "must buy": 3.5, "value for money": 3.0,
  "best in class": 3.5, "top tier": 3.0, "user friendly": 2.5, "seamless experience": 3.0,
  "great support": 3.0, "excellent service": 3.0, "works perfectly": 3.0, "exceeded expectations": 3.5,
  "fan favorite": 2.5, "cult following": 2.5, "sold out": 3.0, "bang for buck": 3.0,
  "easy to use": 3.0, "lasts all day": 3.0, "worth every penny": 4.0, "build quality": 2.0,
  
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

// 5. INSIDER TRADING / ACTIONS
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
  /\bswimming pool\b/i, /\bcash flow\b/i, /\bcash back\b/i,
  /\bgap in\b/i, /\bgap between\b/i
];

// Patterns that indicate the stock mention is peripheral (related articles, trending, etc.)
// Only very clear indicators of peripheral mentions
const PERIPHERAL_MENTION_PATTERNS = [
  /related\s+stocks?\s+to\s+watch/i,
  /see\s+also:\s/i,
  /you\s+(may|might)\s+also\s+(like|enjoy)/i,
  /more\s+stories\s+like\s+this/i,
  /recommended\s+for\s+you/i,
  /in\s+other\s+news:\s/i,
  /top\s+\d+\s+(gainers|losers)\s+today/i,
  /biggest\s+(gainers|losers)\s+of\s+the\s+day/i
];

const GENERIC_COMMON_WORDS = new Set([
  'POOL', 'CASH', 'LOVE', 'FAST', 'BEST', 'BIG', 'SAFE', 'TRUE', 'ALL', 'NEXT',
  'GAP', 'NOW', 'OUT', 'GPS', 'KEY', 'SPOT', 'RUN', 'EAT', 'PLAY', 'CORN', 'CAR',
  'CARE', 'GOOD', 'OPEN', 'LIFE', 'GOLD', 'SAVE', 'TARGET', 'MACY', 'DELL', 'HP',
  'VISA', 'BLOCK', 'SQUARE', 'MATCH', 'UBER', 'LYFT', 'ZOOM', 'SNAP', 'BOX', 'FIVE',
  'EBS', 'RH', 'ON', 'NET', 'BILL', 'LULU', 'CROX', 'BOOT', 'DECK', 'OSTK',
  // Additional short/ambiguous tickers
  'BKE', 'SIX', 'TWO', 'ARE', 'IT', 'SO', 'AN', 'OR', 'GO', 'BE', 'DO', 'UP',
  'AIR', 'SEE', 'FUN', 'SUN', 'SKY', 'ICE', 'OIL', 'GAS', 'LEG', 'ARM', 'EYE',
  'MAN', 'KID', 'CAT', 'DOG', 'PIG', 'COW', 'BEE', 'ANT', 'FLY', 'BAT', 'OWL',
  'DAY', 'BAR', 'CAB', 'JOB', 'LOW', 'OLD', 'NEW', 'BIG', 'ODD', 'FIT', 'FAT',
  'HOT', 'WET', 'DRY', 'RAW', 'LOW', 'CUT', 'HIT', 'WIN', 'PAY', 'SAY', 'TRY'
]);

// Common abbreviations/acronyms that could conflict with tickers
const AMBIGUOUS_ABBREVIATIONS: Record<string, string[]> = {
  'BKE': ['bukit timah expressway', 'bke expressway', 'bke highway'],
  'GPS': ['global positioning system', 'gps tracking', 'gps navigation'],
  'CAR': ['central african republic', 'car accident', 'car crash'],
  'AIR': ['air quality', 'air pollution', 'airline'],
  'GAS': ['natural gas', 'gas prices', 'gasoline'],
  'OIL': ['crude oil', 'oil prices', 'oil spill']
};

// Subsidiary and brand mapping for major holding companies
// Maps ticker to array of subsidiary names/brands to include in searches
// NOTE: Only include distinctive brand names, not generic words (e.g., no "Chrome", "Windows", "Java")
const SUBSIDIARY_BRANDS: Record<string, string[]> = {
  // Alphabet/Google
  'GOOG': ['Google', 'YouTube', 'Waymo', 'DeepMind', 'Fitbit', 'Waze', 'Google Cloud', 'Google Maps', 'Gmail', 'Google Search', 'Google Pixel', 'Chromebook'],
  'GOOGL': ['Google', 'YouTube', 'Waymo', 'DeepMind', 'Fitbit', 'Waze', 'Google Cloud', 'Google Maps', 'Gmail', 'Google Search', 'Google Pixel', 'Chromebook'],
  // Meta/Facebook
  'META': ['Facebook', 'Instagram', 'WhatsApp', 'Meta Threads', 'Messenger', 'Oculus', 'Meta Quest', 'Reality Labs'],
  // Amazon
  'AMZN': ['Amazon', 'AWS', 'Amazon Web Services', 'Prime Video', 'Whole Foods', 'Twitch', 'Amazon Alexa', 'Kindle', 'Amazon Prime', 'Amazon Ring'],
  // Apple
  'AAPL': ['Apple', 'iPhone', 'iPad', 'MacBook', 'Apple Watch', 'AirPods', 'Apple TV', 'App Store', 'Apple Music', 'iCloud', 'Apple Vision Pro', 'Apple Mac'],
  // Microsoft
  'MSFT': ['Microsoft', 'Microsoft Azure', 'Office 365', 'LinkedIn', 'GitHub', 'Xbox', 'Microsoft Bing', 'Microsoft Teams', 'Microsoft Outlook', 'Microsoft Copilot', 'Microsoft Windows'],
  // Tesla
  'TSLA': ['Tesla', 'Tesla Model S', 'Tesla Model 3', 'Tesla Model X', 'Tesla Model Y', 'Cybertruck', 'Tesla Powerwall', 'Tesla Supercharger', 'Full Self-Driving', 'Tesla FSD'],
  // NVIDIA
  'NVDA': ['NVIDIA', 'GeForce', 'NVIDIA RTX', 'NVIDIA CUDA', 'NVIDIA Tegra', 'NVIDIA Jetson', 'NVIDIA DGX', 'NVIDIA H100', 'NVIDIA A100'],
  // Berkshire Hathaway
  'BRK.A': ['Berkshire Hathaway', 'GEICO', 'Dairy Queen', 'Duracell', 'BNSF Railway'],
  'BRK.B': ['Berkshire Hathaway', 'GEICO', 'Dairy Queen', 'Duracell', 'BNSF Railway'],
  // Disney
  'DIS': ['Disney', 'Marvel Studios', 'Pixar', 'Lucasfilm', 'ESPN', 'Hulu', 'Disney Plus', 'Disney+'],
  // Netflix
  'NFLX': ['Netflix'],
  // Walmart
  'WMT': ['Walmart', 'Sam\'s Club'],
  // JPMorgan
  'JPM': ['JPMorgan', 'JPMorgan Chase', 'JP Morgan', 'J.P. Morgan'],
  // Visa
  'V': ['Visa'],
  // Johnson & Johnson
  'JNJ': ['Johnson & Johnson', 'J&J', 'Tylenol', 'Band-Aid', 'Neutrogena'],
  // Procter & Gamble
  'PG': ['Procter & Gamble', 'P&G', 'Pampers', 'Gillette', 'Oral-B'],
  // Coca-Cola
  'KO': ['Coca-Cola', 'Coca Cola'],
  // PepsiCo
  'PEP': ['PepsiCo', 'Pepsi', 'Gatorade', 'Frito-Lay', 'Doritos', 'Cheetos', 'Quaker Oats', 'Tropicana'],
  // AT&T
  'T': ['AT&T', 'DirecTV'],
  // Verizon
  'VZ': ['Verizon', 'Verizon Wireless', 'Verizon Fios'],
  // Comcast
  'CMCSA': ['Comcast', 'Xfinity', 'NBCUniversal', 'Peacock', 'Universal Pictures'],
  // Adobe
  'ADBE': ['Adobe', 'Adobe Photoshop', 'Adobe Illustrator', 'Adobe Premiere', 'Adobe Acrobat', 'Adobe Creative Cloud', 'Figma'],
  // Salesforce
  'CRM': ['Salesforce', 'Slack', 'Tableau'],
  // Oracle
  'ORCL': ['Oracle', 'Oracle Cloud', 'NetSuite'],
  // Intel
  'INTC': ['Intel', 'Intel Core', 'Intel Xeon', 'Mobileye'],
  // AMD
  'AMD': ['AMD', 'AMD Ryzen', 'AMD Radeon', 'AMD EPYC', 'Xilinx'],
  // Uber
  'UBER': ['Uber', 'Uber Eats', 'Uber Freight'],
  // Airbnb
  'ABNB': ['Airbnb'],
  // Spotify
  'SPOT': ['Spotify'],
  // PayPal
  'PYPL': ['PayPal', 'Venmo'],
  // Block (Square)
  'SQ': ['Block Inc', 'Square', 'Cash App', 'Afterpay'],
  // Snap
  'SNAP': ['Snapchat', 'Snap Inc'],
  // Pinterest
  'PINS': ['Pinterest'],
  // Zoom
  'ZM': ['Zoom Video', 'Zoom Communications'],
  // Shopify
  'SHOP': ['Shopify'],
  // Roblox
  'RBLX': ['Roblox'],
  // Unity
  'U': ['Unity Technologies', 'Unity Software'],
  // Electronic Arts
  'EA': ['Electronic Arts', 'EA Sports', 'Apex Legends'],
  // Activision (now part of MSFT but keeping for reference)
  'ATVI': ['Activision Blizzard', 'Call of Duty', 'World of Warcraft', 'Overwatch', 'Diablo'],
  // Take-Two
  'TTWO': ['Take-Two Interactive', 'Rockstar Games', 'Grand Theft Auto', '2K Games'],
  // Sony (ADR)
  'SONY': ['Sony', 'PlayStation', 'Sony Pictures', 'Sony Music'],
  // Toyota
  'TM': ['Toyota', 'Lexus'],
  // Ford
  'F': ['Ford', 'Ford Motor', 'Lincoln', 'Ford F-150', 'Ford Mustang'],
  // General Motors
  'GM': ['General Motors', 'Chevrolet', 'Cadillac', 'GMC', 'Buick', 'Cruise'],
  // Starbucks
  'SBUX': ['Starbucks'],
  // McDonald's
  'MCD': ['McDonald\'s', 'McDonalds'],
  // Nike
  'NKE': ['Nike', 'Air Jordan', 'Converse'],
  // Lululemon
  'LULU': ['Lululemon', 'lululemon athletica']
};

const FINANCIAL_CONTEXT_WORDS = [
  'stock', 'shares', 'market', 'nasdaq', 'nyse', 'dividend', 'earnings', 'revenue',
  'profit', 'quarter', 'fiscal', 'guidance', 'investor', 'capital', 'equity', 'debt',
  'valuation', 'rating', 'analyst', 'target', 'buy', 'sell', 'hold', 'underweight',
  'overweight', 'eps', 'ebitda', 'margin', 'securities', 'ticker'
];

// ============================================================================
// COMPREHENSIVE REPUTABLE NEWS SOURCE WHITELIST
// Only whitelisted sources will be included in analysis
// ============================================================================

// TIER 1: WIRE SERVICES & PREMIUM (Score: 10)
const WIRE_SERVICES = ['apnews.com', 'reuters.com', 'afp.com', 'upi.com'];

const PREMIUM_FINANCIAL = [
  'wsj.com', 'ft.com', 'bloomberg.com', 'barrons.com', 'economist.com',
  'marketwatch.com', 'investors.com', 'morningstar.com'
];

const PREMIUM_NATIONAL = [
  'nytimes.com', 'washingtonpost.com', 'usatoday.com', 'npr.org', 'pbs.org',
  'theatlantic.com', 'newyorker.com', 'csmonitor.com'
];

// TIER 2: MAJOR US NEWSPAPERS (Score: 9)
const MAJOR_US_NEWSPAPERS = [
  'latimes.com', 'chicagotribune.com', 'bostonglobe.com', 'sfchronicle.com',
  'dallasnews.com', 'houstonchronicle.com', 'denverpost.com', 'seattletimes.com',
  'startribune.com', 'ajc.com', 'tampabay.com', 'mercurynews.com', 
  'sandiegouniontribune.com', 'philly.com', 'inquirer.com', 'baltimoresun.com',
  'oregonlive.com', 'post-gazette.com', 'dispatch.com', 'jsonline.com',
  'stltoday.com', 'kansascity.com', 'indystar.com', 'courier-journal.com',
  'tennessean.com', 'charlotteobserver.com', 'newsobserver.com', 'sacbee.com',
  'reviewjournal.com', 'sun-sentinel.com', 'miamiherald.com', 'orlandosentinel.com',
  'azcentral.com', 'freep.com', 'detroitnews.com', 'cleveland.com', 'cincinnati.com',
  'nj.com', 'newsday.com', 'nydailynews.com', 'nypost.com', 'suntimes.com',
  'chron.com', 'expressnews.com', 'star-telegram.com', 'statesman.com',
  'pilotonline.com', 'richmond.com', 'deseret.com', 'sltrib.com'
];

// TIER 3: REGIONAL US NEWSPAPERS (Score: 8)
const REGIONAL_US_NEWSPAPERS = [
  'postandcourier.com', 'providencejournal.com', 'hartfordcourant.com', 'courant.com',
  'telegram.com', 'masslive.com', 'nhregister.com', 'unionleader.com', 'concordmonitor.com',
  'pressherald.com', 'bangordailynews.com', 'burlingtonfreepress.com', 'vtdigger.org',
  'timesunion.com', 'buffalonews.com', 'democratandchronicle.com', 'syracuse.com',
  'pressconnects.com', 'lohud.com', 'northjersey.com', 'app.com', 'delawareonline.com',
  'pennlive.com', 'mcall.com', 'triblive.com', 'jacksonville.com', 'savannahnow.com',
  'thestate.com', 'greenvilleonline.com', 'greensboro.com', 'wral.com', 'dailypress.com',
  'roanoke.com', 'commercialappeal.com', 'knoxnews.com', 'kentucky.com', 'al.com',
  'montgomeryadvertiser.com', 'clarionledger.com', 'nola.com', 'theadvocate.com',
  'arkansasonline.com', 'wvgazettemail.com', 'dailyherald.com', 'sj-r.com', 'pantagraph.com',
  'akronbeaconjournal.com', 'mlive.com', 'jconline.com', 'courierpress.com', 'madison.com',
  'twincities.com', 'desmoinesregister.com', 'qctimes.com', 'thegazette.com', 'omaha.com',
  'journalstar.com', 'argusleader.com', 'inforum.com', 'bismarcktribune.com', 'kansas.com',
  'ljworld.com', 'tucson.com', 'abqjournal.com', 'oklahoman.com', 'tulsaworld.com', 'rgj.com',
  'ocregister.com', 'fresnobee.com', 'spokesman.com', 'thenewstribune.com', 'registerguard.com',
  'statesmanjournal.com', 'gazette.com', 'coloradosun.com', 'idahostatesman.com',
  'billingsgazette.com', 'missoulian.com', 'adn.com', 'staradvertiser.com', 'sfexaminer.com',
  // Additional Midwest/Plains papers
  'pjstar.com', 'nwitimes.com', 'journalgazette.net', 'southbendtribune.com', 'heraldtimesonline.com',
  'kearneyhub.com', 'theindependent.com', 'nptelegraph.com', 'columbustelegram.com',
  'fremonttribune.com', 'norfolkdailynews.com', 'siouxcityjournal.com', 'globegazette.com',
  'hutchnews.com', 'gctelegram.com', 'herald-review.com', 'jg-tc.com', 'newstrib.com',
  'qconline.com', 'news-gazette.com', 'rrstar.com', 'galesburg.com', 'pekintimes.com',
  'saukvalley.com', 'starcourier.com', 'whig.com', 'myjournalcourier.com',
  // Additional Indiana papers
  'therepublic.com', 'tribstar.com', 'pharostribune.com', 'kokomotribune.com',
  'chronicle-tribune.com', 'elkharttruth.com', 'gabortoday.com', 'reporter-times.com'
];

// TIER 1: PREMIUM INTERNATIONAL (Score: 10)
const PREMIUM_INTERNATIONAL = [
  'bbc.com', 'bbc.co.uk', 'theguardian.com', 'telegraph.co.uk', 'thetimes.co.uk',
  'independent.co.uk', 'thescotsman.com', 'irishtimes.com', 'lemonde.fr', 'lefigaro.fr',
  'dw.com', 'spiegel.de', 'handelsblatt.com', 'faz.net', 'zeit.de', 'nzz.ch', 'swissinfo.ch',
  'ansa.it', 'corriere.it', 'repubblica.it', 'elpais.com', 'elmundo.es', 'publico.pt',
  'dutchnews.nl', 'standaard.be', 'vrt.be', 'svt.se', 'yle.fi', 'nrk.no', 'dr.dk',
  'euronews.com', 'politico.eu', 'france24.com', 'rfi.fr', 'nikkei.com', 'asia.nikkei.com',
  'japantimes.co.jp', 'mainichi.jp', 'yomiuri.co.jp', 'scmp.com', 'straitstimes.com',
  'channelnewsasia.com', 'bangkokpost.com', 'thestar.com.my', 'inquirer.net', 'manilatimes.net',
  'koreaherald.com', 'koreatimes.co.kr', 'taipeitimes.com', 'abc.net.au', 'smh.com.au',
  'theage.com.au', 'theaustralian.com.au', 'afr.com', 'stuff.co.nz', 'nzherald.co.nz',
  'rnz.co.nz', 'hindustantimes.com', 'indianexpress.com', 'livemint.com', 'thehindu.com',
  'economictimes.indiatimes.com', 'business-standard.com', 'dawn.com', 'thedailystar.net',
  'theglobeandmail.com', 'nationalpost.com', 'cbc.ca', 'ctvnews.ca', 'montrealgazette.com',
  'vancouversun.com', 'torontostar.com', 'ottawacitizen.com', 'calgaryherald.com',
  'aljazeera.com', 'haaretz.com', 'jpost.com', 'timesofisrael.com', 'mg.co.za', 'news24.com'
];

// TIER 2: QUALITY BUSINESS & TECHNOLOGY (Score: 8)
const QUALITY_BUSINESS_TECH = [
  'cnbc.com', 'finance.yahoo.com', 'seekingalpha.com', 'benzinga.com', 'thestreet.com',
  'fool.com', 'zacks.com', 'tipranks.com', 'investopedia.com', 'kiplinger.com',
  'businessinsider.com', 'fortune.com', 'forbes.com', 'inc.com', 'fastcompany.com',
  'hbr.org', 'qz.com', 'techcrunch.com', 'wired.com', 'arstechnica.com', 'theverge.com',
  'zdnet.com', 'cnet.com', 'engadget.com', 'thenextweb.com', 'venturebeat.com',
  'protocol.com', 'semafor.com', 'theinformation.com', 'techmeme.com',
  'axios.com', 'thehill.com', 'politico.com', 'rollcall.com',
  // Additional quality financial sources
  'investorplace.com', 'marketbeat.com', 'simplywall.st', 'finviz.com',
  'barchart.com', 'stocktwits.com', 'tradingview.com', 'fintel.io',
  'gurufocus.com', 'macroaxis.com', 'wallstreetjournal.com', 'moneycontrol.com',
  'thefly.com', 'streetinsider.com', 'briefing.com', 'earningswhispers.com',
  'estimize.com', 'sentieo.com', 'alphasense.com', 'koyfin.com'
];

// TIER 3: BROADCAST NEWS (Score: 7)
const BROADCAST_NEWS = [
  'cbsnews.com', 'abcnews.go.com', 'nbcnews.com', 'foxnews.com', 'foxbusiness.com',
  'msnbc.com', 'cnn.com'
];

// TIER 2: QUALITY MAGAZINES & JOURNALS (Score: 8)
const QUALITY_MAGAZINES = [
  'scientificamerican.com', 'nationalgeographic.com', 'nature.com', 'science.org',
  'time.com', 'newsweek.com', 'theweek.com', 'slate.com', 'vox.com', 'propublica.org'
];

// TIER 3: INDUSTRY TRADE PUBLICATIONS (Score: 7)
const INDUSTRY_TRADE = [
  // Automotive
  'autoblog.com', 'motortrend.com', 'caranddriver.com', 'automotive-news.com',
  'wardsauto.com', 'autonews.com', 'electrek.co', 'insideevs.com', 'greencarreports.com',
  // Healthcare/Pharma
  'fiercepharma.com', 'fiercebiotech.com', 'statnews.com', 'medscape.com', 'medpagetoday.com',
  'healio.com', 'healthcaredive.com', 'modernhealthcare.com', 'beckershospitalreview.com',
  // Energy
  'oilprice.com', 'rigzone.com', 'energyvoice.com', 'utilitydive.com', 'greentechmedia.com',
  'renewableenergyworld.com', 'solarpowerworldonline.com', 'windpowermonthly.com',
  // Retail/Consumer
  'retaildive.com', 'retailwire.com', 'chainstoreage.com', 'supermarketnews.com',
  'grocerydive.com', 'restaurantbusinessonline.com', 'nrn.com', 'qsrmagazine.com',
  // Real Estate
  'therealdeal.com', 'commercialobserver.com', 'bisnow.com', 'costar.com', 'globest.com',
  // Legal
  'law360.com', 'law.com', 'americanlawyer.com', 'reuters.com/legal', 'bloomberglaw.com',
  // Advertising/Media
  'adage.com', 'adweek.com', 'mediapost.com', 'digiday.com', 'campaignlive.com',
  // Aviation/Defense
  'aviationweek.com', 'flightglobal.com', 'defensenews.com', 'janes.com', 'aviationtoday.com',
  // Logistics/Supply Chain
  'supplychaindive.com', 'freightwaves.com', 'joc.com', 'americanshipper.com', 'dcvelocity.com',
  // Manufacturing
  'industryweek.com', 'manufacturingdive.com', 'assemblymag.com', 'plantservices.com',
  // Telecom
  'fiercewireless.com', 'lightreading.com', 'rcrwireless.com', 'telecomtv.com',
  // Construction
  'constructiondive.com', 'enr.com', 'bdcnetwork.com'
];

// TIER 3: US LOCAL TV STATIONS (Score: 7)
const LOCAL_TV_STATIONS = [
  // Major market local TV
  'abc7.com', 'abc7chicago.com', 'abc7news.com', 'abc7ny.com', 'abc13.com', 'abc11.com',
  'cbslocal.com', 'cbsnews.com/local', 'nbclosangeles.com', 'nbcchicago.com', 'nbcnewyork.com',
  'nbcbayarea.com', 'nbcdfw.com', 'nbcphiladelphia.com', 'nbcwashington.com', 'nbcboston.com',
  'fox5ny.com', 'fox5dc.com', 'fox32chicago.com', 'fox4news.com', 'fox2detroit.com',
  'khou.com', 'kprc.com', 'wfaa.com', 'king5.com', 'kiro7.com', 'ksdk.com', 'wcvb.com',
  'wgn9.com', 'wpxi.com', 'wtae.com', 'wbaltv.com', 'wisn.com', 'wesh.com', 'wftv.com',
  'wsoctv.com', 'wxii12.com', 'wral.com', 'wtvd.com', 'wfmy.com', 'wis.com', 'wyff4.com',
  'wpbf.com', 'wplg.com', 'wsvn.com', 'wptv.com', 'news4jax.com', 'clickorlando.com',
  'fox35orlando.com', 'local10.com', '10news.com', 'cbs8.com', 'fox5sandiego.com',
  'abc10.com', 'kcra.com', 'fox40.com', 'kron4.com', 'kntv.com', 'kpix.com',
  '9news.com', 'thedenverchannel.com', 'kdvr.com', 'kob.com', 'krqe.com', 'ksat.com',
  'news4sanantonio.com', 'kvue.com', 'kxan.com', 'fox7austin.com', 'click2houston.com',
  'abc13.com', 'fox26houston.com', 'khou.com', 'ktrk.com'
];

// TIER 2: ADDITIONAL INTERNATIONAL (Score: 8)
const ADDITIONAL_INTERNATIONAL = [
  // Latin America
  'lanacion.com.ar', 'clarin.com', 'infobae.com', 'folha.uol.com.br', 'estadao.com.br',
  'oglobo.globo.com', 'valor.globo.com', 'eluniversal.com.mx', 'reforma.com', 'jornada.com.mx',
  'eltiempo.com', 'elespectador.com', 'emol.com', 'latercera.com', 'elcomercio.pe',
  // Middle East
  'arabnews.com', 'gulfnews.com', 'thenationalnews.com', 'khaleejtimes.com', 'dailysabah.com',
  'hurriyetdailynews.com', 'tehrantimes.com', 'jordantimes.com', 'egypttoday.com',
  // Africa
  'allafrica.com', 'dailymaverick.co.za', 'businessday.co.za', 'theeastafrican.co.ke',
  'nation.africa', 'guardian.ng', 'thecable.ng', 'egyptindependent.com',
  // Eastern Europe
  'kyivindependent.com', 'kyivpost.com', 'pravda.com.ua', 'novinky.cz', 'gazeta.pl',
  'wyborcza.pl', 'hvg.hu', 'bne.eu', 'balkaninsight.com',
  // More Asia
  'bangkokpost.com', 'nationthailand.com', 'thejakartapost.com', 'vnexpress.net',
  'vnanet.vn', 'philstar.com', 'gmanetwork.com', 'abs-cbn.com'
];

// ============================================================================
// SOCIAL MEDIA & CONSUMER SENTIMENT SOURCES
// ============================================================================

const SOCIAL_SENTIMENT_SOURCES = {
  reddit: { domains: ['reddit.com', 'redd.it'], weight: 0.7, category: 'Social Discussion' },
  linkedin: { domains: ['linkedin.com'], weight: 0.6, category: 'Professional Network' },
  reviews: {
    domains: ['trustpilot.com', 'consumeraffairs.com', 'bbb.org', 'sitejabber.com',
      'yelp.com', 'tripadvisor.com', 'g2.com', 'capterra.com', 'gartner.com',
      'softwareadvice.com', 'getapp.com', 'producthunt.com'],
    weight: 0.8, category: 'Consumer Reviews'
  },
  employer: {
    domains: ['glassdoor.com', 'indeed.com', 'comparably.com', 'kununu.com', 'levels.fyi'],
    weight: 0.7, category: 'Employer Reviews'
  },
  appStores: { domains: ['apps.apple.com', 'play.google.com'], weight: 0.75, category: 'App Reviews' }
};

// ============================================================================
// COMPREHENSIVE BLACKLIST
// ============================================================================

const BLACKLISTED_DOMAINS = [
  // Press Release Mills
  'prnewswire.com', 'businesswire.com', 'globenewswire.com', 'accesswire.com',
  'newsfilecorp.com', 'prweb.com', 'einpresswire.com', 'newswire.com',
  // Content Farms & Low-Quality Aggregators
  'investorsobserver.com', 'stocknews.com', 'insidermonkey.com',
  'wallstreetzen.com', 'stockmarket.com',
  'stockanalysis.com', '247wallst.com', 'pennystocks.com',
  'wallstreetalerts.com', 'stocktitan.com', 'defenseworld.net', 'tickerreport.com',
  'americanbankingnews.com', 'theenterpriseleader.com', 'themarketsdaily.com',
  'dailypolitical.com', 'modernreaders.com', 'tickertech.com', 'tickerdata.com',
  // Clickbait Aggregators
  'msn.com', 'aol.com', 'yahoo.com/lifestyle', 'yahoo.com/entertainment',
  'finance.yahoo.com/video',
  // Tabloids
  'dailymail.co.uk', 'thesun.co.uk', 'mirror.co.uk', 'express.co.uk', 'thesun.com',
  'nypost.com/gossip', 'pagesix.com', 'tmz.com', 'eonline.com', 'usmagazine.com',
  // Fringe/Conspiracy/Propaganda
  'zerohedge.com', 'breitbart.com', 'infowars.com', 'naturalnews.com', 'thegatewaypundit.com',
  'rt.com', 'sputniknews.com', 'tass.com', 'cgtn.com', 'globaltimes.cn',
  'epochtimes.com', 'ntd.com', 'oann.com',
  // Non-English Unreliable (appearing in English results incorrectly)
  'ulpravda.ru', 'moivietnam.com', 'baochinhphu.vn', 'vietnamnet.vn',
  'ria.ru', 'lenta.ru', 'gazeta.ru', 'kommersant.ru', 'iz.ru', 'rbc.ru',
  'sina.com.cn', 'sohu.com', 'qq.com', '163.com', 'ifeng.com',
  // Pseudoscience
  'naturalhealth365.com', 'mercola.com', 'greenmedinfo.com', 'beforeitsnews.com',
  // Low-Quality Regional Motley Fool
  'motleyfool.com.au', 'fool.co.uk', 'fool.ca', 'fool.sg',
  'fool.com/podcasts', 'fool.com/investing/general',
  // Crypto-focused (unless specifically relevant)
  'coindesk.com', 'cointelegraph.com', 'decrypt.co', 'bitcoinmagazine.com',
  // User-Generated (Unvetted)
  'medium.com', 'substack.com', 'linkedin.com/pulse',
  'wordpress.com', 'blogger.com', 'tumblr.com'
];

const BLACKLIST_PATTERNS = [
  /\/press-release\//i, /\/sponsored\//i, /\/partner-content\//i,
  /\/brandvoice\//i, /\/contributor\//i, /\/slideshow\//i, /\/paid-post\//i
];

// ============================================================================
// SOURCE SCORING SYSTEM
// ============================================================================

const SOURCE_SCORES: Record<string, number> = {};

[...WIRE_SERVICES, ...PREMIUM_FINANCIAL, ...PREMIUM_NATIONAL, ...PREMIUM_INTERNATIONAL].forEach(d => {
  SOURCE_SCORES[d] = 10;
});

MAJOR_US_NEWSPAPERS.forEach(d => { SOURCE_SCORES[d] = 9; });

[...REGIONAL_US_NEWSPAPERS, ...QUALITY_BUSINESS_TECH, ...QUALITY_MAGAZINES, ...ADDITIONAL_INTERNATIONAL].forEach(d => {
  SOURCE_SCORES[d] = 8;
});

[...BROADCAST_NEWS, ...INDUSTRY_TRADE, ...LOCAL_TV_STATIONS].forEach(d => { SOURCE_SCORES[d] = 7; });

const SOCIAL_DOMAINS = new Set([
  ...SOCIAL_SENTIMENT_SOURCES.reddit.domains,
  ...SOCIAL_SENTIMENT_SOURCES.linkedin.domains,
  ...SOCIAL_SENTIMENT_SOURCES.reviews.domains,
  ...SOCIAL_SENTIMENT_SOURCES.employer.domains,
  ...SOCIAL_SENTIMENT_SOURCES.appStores.domains
]);

// Legacy arrays for query building
const FINANCIAL_MAJORS = PREMIUM_FINANCIAL.map(d => `site:${d}`);
const GLOBAL_MAJORS = [...WIRE_SERVICES, ...PREMIUM_NATIONAL.slice(0, 8), ...PREMIUM_INTERNATIONAL.slice(0, 10)].map(d => `site:${d}`);
const US_MAJOR_METROS = MAJOR_US_NEWSPAPERS.map(d => `site:${d}`);
const US_REGIONAL = REGIONAL_US_NEWSPAPERS.map(d => `site:${d}`);
const INTL_EUROPE = PREMIUM_INTERNATIONAL.filter(d => ['lemonde.fr', 'dw.com', 'spiegel.de', 'corriere.it', 'elpais.com', 'theguardian.com', 'telegraph.co.uk', 'bbc.com'].includes(d)).map(d => `site:${d}`);
const INTL_ASIA_PACIFIC = PREMIUM_INTERNATIONAL.filter(d => ['nikkei.com', 'scmp.com', 'straitstimes.com', 'smh.com.au', 'abc.net.au', 'japantimes.co.jp', 'koreaherald.com'].includes(d)).map(d => `site:${d}`);
const INTL_AMERICAS_OTHER = PREMIUM_INTERNATIONAL.filter(d => ['theglobeandmail.com', 'cbc.ca', 'aljazeera.com', 'haaretz.com', 'jpost.com'].includes(d)).map(d => `site:${d}`);
const TECH_INDUSTRY = QUALITY_BUSINESS_TECH.filter(d => ['techcrunch.com', 'wired.com', 'arstechnica.com', 'theverge.com', 'zdnet.com', 'cnet.com', 'axios.com', 'semafor.com'].includes(d)).map(d => `site:${d}`);
const GRASSROOTS_SOURCES = ["site:reddit.com", "site:trustpilot.com", "site:glassdoor.com", "site:consumeraffairs.com", "site:bbb.org", "site:sitejabber.com", "site:yelp.com", "site:g2.com", "site:capterra.com"];

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

const isWhitelistedSource = (url: string): { whitelisted: boolean; score: number; category: string } => {
  try {
    const hostname = new URL(url).hostname.toLowerCase().replace('www.', '');
    
    if (BLACKLISTED_DOMAINS.some(d => hostname.includes(d) || url.toLowerCase().includes(d))) {
      return { whitelisted: false, score: 0, category: 'Blacklisted' };
    }
    
    if (BLACKLIST_PATTERNS.some(p => p.test(url))) {
      return { whitelisted: false, score: 0, category: 'Blacklisted Pattern' };
    }
    
    for (const [key, config] of Object.entries(SOCIAL_SENTIMENT_SOURCES)) {
      if (config.domains.some(d => hostname.includes(d))) {
        return { whitelisted: true, score: config.weight * 10, category: config.category };
      }
    }
    
    for (const [domain, score] of Object.entries(SOURCE_SCORES)) {
      if (hostname.includes(domain) || hostname.endsWith(domain)) {
        return { whitelisted: true, score, category: 'News' };
      }
    }
    
    if (hostname.endsWith('.gov')) return { whitelisted: true, score: 9, category: 'Government' };
    if (hostname.endsWith('.edu')) return { whitelisted: true, score: 8, category: 'Educational' };
    
    return { whitelisted: false, score: 0, category: 'Unknown' };
  } catch (e) {
    return { whitelisted: false, score: 0, category: 'Invalid URL' };
  }
};

const normalize = (score: number, totalWeight: number): number => {
  const alpha = 8;
  const rawNorm = score / Math.sqrt((score * score) + alpha);
  const confidence = totalWeight / (totalWeight + 5);
  const smoothedScore = rawNorm * confidence;
  return Math.max(-1.0, Math.min(1.0, smoothedScore));
};

const calculateTimeWeight = (pubDate: Date): number => {
  const now = new Date();
  const diffHours = (now.getTime() - pubDate.getTime()) / (1000 * 60 * 60);
  if (diffHours <= 24) return 1.4;
  if (diffHours <= 24 * 7) return 1.15;
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
  return text.split(/(?:\sbut\s|\showever\s|\salthough\s|\swhile\s|\sdespite\s|\sversus\s|[.;:!])/i).filter(c => c.trim().length > 3);
};

const analyzeClause = (text: string): { execScore: number, marketScore: number, consumerScore: number } => {
  const tokens = text.toLowerCase().match(/\b[\w']+\b/g) || [];
  let execScore = 0, marketScore = 0, consumerScore = 0;
  let phraseText = text.toLowerCase();
  let confidenceMultiplier = 1.0;
  let isFutureTense = false;

  tokens.forEach(t => {
    if (HEDGING_WORDS.has(t)) confidenceMultiplier *= 0.7;
    if (FUTURE_TENSE.has(t)) isFutureTense = true;
  });
  if (isFutureTense) confidenceMultiplier *= 1.2;

  Object.keys(INSIDER_PHRASES).forEach(phrase => { if (phraseText.includes(phrase)) execScore += (INSIDER_PHRASES[phrase] * 3.0); });
  Object.keys(EXEC_PHRASES).forEach(phrase => { if (phraseText.includes(phrase)) execScore += (EXEC_PHRASES[phrase] * 1.5); });
  Object.keys(MARKET_PHRASES).forEach(phrase => { if (phraseText.includes(phrase)) marketScore += MARKET_PHRASES[phrase]; });
  Object.keys(CONSUMER_PHRASES).forEach(phrase => { if (phraseText.includes(phrase)) consumerScore += CONSUMER_PHRASES[phrase]; });

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
  const encodedContent = item.getElementsByTagNameNS("*", "encoded")[0]?.textContent;
  let description = encodedContent || item.querySelector("description")?.textContent || item.querySelector("summary")?.textContent || item.querySelector("content")?.textContent || "";
  const pubDateStr = item.querySelector("pubDate")?.textContent || item.querySelector("updated")?.textContent || item.querySelector("date")?.textContent || "";
  let link = item.querySelector("link")?.textContent || "";
  if (!link) {
    const linkElem = item.querySelector("link");
    if (linkElem && linkElem.hasAttribute("href")) link = linkElem.getAttribute("href") || "";
  }
  return { title, description, pubDateStr, link };
};

// Helper to add delays between requests
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Single proxy fetch attempt
const tryProxy = async (proxyUrl: string, isAllOrigins: boolean): Promise<string | null> => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);
    const response = await fetch(proxyUrl, { signal: controller.signal });
    clearTimeout(timeoutId);
    if (!response.ok) return null;
    if (isAllOrigins) {
      const data = await response.json();
      return data.contents || null;
    }
    return await response.text();
  } catch (e) {
    return null;
  }
};

const fetchRSS = async (url: string, sourceName: string): Promise<Element[]> => {
  const urlWithCache = `${url}${url.includes('?') ? '&' : '?'}t=${Date.now()}`;
  
  // Use only the most reliable proxies, try them in order with delays
  const proxies = [
    { url: `https://api.allorigins.win/get?url=${encodeURIComponent(urlWithCache)}`, isAllOrigins: true },
    { url: `https://corsproxy.io/?${encodeURIComponent(urlWithCache)}`, isAllOrigins: false },
    { url: `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(urlWithCache)}`, isAllOrigins: false }
  ];

  for (let i = 0; i < proxies.length; i++) {
    const proxy = proxies[i];
    const contents = await tryProxy(proxy.url, proxy.isAllOrigins);
    
    if (contents && contents.length > 50) {
      const parser = new DOMParser();
      const doc = parser.parseFromString(contents, "text/xml");
      let items = Array.from(doc.querySelectorAll("item"));
      if (items.length === 0) items = Array.from(doc.querySelectorAll("entry"));
      items.forEach(item => item.setAttribute("data-custom-source", sourceName));
      return items;
    }
    
    // Small delay before trying next proxy
    if (i < proxies.length - 1) {
      await delay(300);
    }
  }
  return [];
};

// STATE/REGION TO LOCAL NEWS SOURCES MAPPING
const STATE_LOCAL_NEWS: Record<string, string[]> = {
  "massachusetts": ["site:bostonglobe.com", "site:masslive.com", "site:telegram.com", "site:bostonherald.com"],
  "new york": ["site:nytimes.com", "site:nypost.com", "site:newsday.com", "site:timesunion.com", "site:buffalonews.com", "site:democratandchronicle.com", "site:syracuse.com", "site:nydailynews.com"],
  "new jersey": ["site:nj.com", "site:northjersey.com", "site:app.com"],
  "pennsylvania": ["site:inquirer.com", "site:post-gazette.com", "site:pennlive.com", "site:mcall.com", "site:triblive.com", "site:philly.com"],
  "connecticut": ["site:courant.com", "site:ctpost.com", "site:nhregister.com"],
  "rhode island": ["site:providencejournal.com"],
  "vermont": ["site:burlingtonfreepress.com", "site:vtdigger.org"],
  "new hampshire": ["site:unionleader.com", "site:concordmonitor.com"],
  "maine": ["site:pressherald.com", "site:bangordailynews.com"],
  "florida": ["site:miamiherald.com", "site:sun-sentinel.com", "site:tampabay.com", "site:orlandosentinel.com", "site:jacksonville.com"],
  "georgia": ["site:ajc.com", "site:savannahnow.com"],
  "north carolina": ["site:charlotteobserver.com", "site:newsobserver.com", "site:greensboro.com", "site:wral.com"],
  "south carolina": ["site:postandcourier.com", "site:thestate.com", "site:greenvilleonline.com"],
  "virginia": ["site:washingtonpost.com", "site:pilotonline.com", "site:roanoke.com", "site:dailypress.com"],
  "maryland": ["site:baltimoresun.com", "site:washingtonpost.com"],
  "tennessee": ["site:tennessean.com", "site:commercialappeal.com", "site:knoxnews.com"],
  "kentucky": ["site:courier-journal.com", "site:kentucky.com"],
  "alabama": ["site:al.com", "site:montgomeryadvertiser.com"],
  "mississippi": ["site:clarionledger.com"],
  "louisiana": ["site:nola.com", "site:theadvocate.com"],
  "arkansas": ["site:arkansasonline.com"],
  "west virginia": ["site:wvgazettemail.com"],
  "illinois": ["site:chicagotribune.com", "site:suntimes.com", "site:dailyherald.com", "site:pantagraph.com", "site:pjstar.com", "site:sj-r.com", "site:herald-review.com", "site:jg-tc.com", "site:newstrib.com", "site:qconline.com"],
  "ohio": ["site:dispatch.com", "site:cleveland.com", "site:cincinnati.com", "site:akronbeaconjournal.com"],
  "michigan": ["site:freep.com", "site:detroitnews.com", "site:mlive.com"],
  "indiana": ["site:indystar.com", "site:jconline.com", "site:courierpress.com", "site:nwitimes.com", "site:journalgazette.net", "site:southbendtribune.com", "site:heraldtimesonline.com"],
  "wisconsin": ["site:jsonline.com", "site:madison.com"],
  "minnesota": ["site:startribune.com", "site:twincities.com"],
  "iowa": ["site:desmoinesregister.com", "site:qctimes.com", "site:thegazette.com", "site:siouxcityjournal.com", "site:globegazette.com"],
  "missouri": ["site:stltoday.com", "site:kansascity.com"],
  "kansas": ["site:kansas.com", "site:kansascity.com", "site:ljworld.com", "site:hutchnews.com", "site:gctelegram.com"],
  "nebraska": ["site:omaha.com", "site:journalstar.com", "site:kearneyhub.com", "site:theindependent.com", "site:nptelegraph.com", "site:columbustelegram.com", "site:fremonttribune.com", "site:norfolkdailynews.com"],
  "south dakota": ["site:argusleader.com"],
  "north dakota": ["site:inforum.com", "site:bismarcktribune.com"],
  "texas": ["site:dallasnews.com", "site:houstonchronicle.com", "site:statesman.com", "site:expressnews.com", "site:star-telegram.com"],
  "arizona": ["site:azcentral.com", "site:tucson.com"],
  "new mexico": ["site:abqjournal.com"],
  "oklahoma": ["site:oklahoman.com", "site:tulsaworld.com"],
  "nevada": ["site:reviewjournal.com", "site:rgj.com"],
  "california": ["site:latimes.com", "site:sfchronicle.com", "site:mercurynews.com", "site:sandiegouniontribune.com", "site:sacbee.com", "site:ocregister.com", "site:fresnobee.com"],
  "washington": ["site:seattletimes.com", "site:spokesman.com", "site:thenewstribune.com"],
  "oregon": ["site:oregonlive.com", "site:registerguard.com", "site:statesmanjournal.com"],
  "colorado": ["site:denverpost.com", "site:gazette.com", "site:coloradosun.com"],
  "utah": ["site:sltrib.com", "site:deseret.com"],
  "idaho": ["site:idahostatesman.com"],
  "montana": ["site:billingsgazette.com", "site:missoulian.com"],
  "wyoming": ["site:trib.com"],
  "alaska": ["site:adn.com"],
  "hawaii": ["site:staradvertiser.com"],
  "canada": ["site:theglobeandmail.com", "site:nationalpost.com", "site:cbc.ca", "site:torontostar.com"],
  "uk": ["site:theguardian.com", "site:telegraph.co.uk", "site:thetimes.co.uk", "site:ft.com", "site:bbc.com"],
  "germany": ["site:dw.com", "site:handelsblatt.com", "site:spiegel.de"],
  "france": ["site:lemonde.fr", "site:lefigaro.fr", "site:france24.com"],
  "japan": ["site:japantimes.co.jp", "site:nikkei.com", "site:mainichi.jp"],
  "china": ["site:scmp.com"],
  "india": ["site:economictimes.indiatimes.com", "site:livemint.com", "site:hindustantimes.com"],
  "australia": ["site:smh.com.au", "site:theaustralian.com.au", "site:afr.com", "site:abc.net.au"],
};

const CITY_TO_STATE: Record<string, string> = {
  "new york": "new york", "nyc": "new york", "manhattan": "new york", "brooklyn": "new york",
  "los angeles": "california", "san francisco": "california", "san jose": "california", "silicon valley": "california",
  "san diego": "california", "oakland": "california", "palo alto": "california", "santa clara": "california",
  "chicago": "illinois", "houston": "texas", "dallas": "texas", "austin": "texas", "san antonio": "texas",
  "phoenix": "arizona", "philadelphia": "pennsylvania", "pittsburgh": "pennsylvania",
  "seattle": "washington", "redmond": "washington", "bellevue": "washington",
  "denver": "colorado", "boston": "massachusetts", "cambridge": "massachusetts",
  "atlanta": "georgia", "miami": "florida", "tampa": "florida", "orlando": "florida",
  "detroit": "michigan", "minneapolis": "minnesota", "st. louis": "missouri",
  "charlotte": "north carolina", "raleigh": "north carolina", "durham": "north carolina",
  "nashville": "tennessee", "memphis": "tennessee", "louisville": "kentucky",
  "milwaukee": "wisconsin", "indianapolis": "indiana", "columbus": "ohio", "cleveland": "ohio", "cincinnati": "ohio",
  "kansas city": "missouri", "omaha": "nebraska", "lincoln": "nebraska", "kearney": "nebraska",
  "las vegas": "nevada", "salt lake city": "utah", "portland": "oregon",
  "richmond": "virginia", "arlington": "virginia", "baltimore": "maryland", "bethesda": "maryland",
  "new orleans": "louisiana", "oklahoma city": "oklahoma", "tulsa": "oklahoma",
  "toronto": "canada", "vancouver": "canada", "montreal": "canada",
  "london": "uk", "munich": "germany", "paris": "france", "tokyo": "japan",
  "beijing": "china", "shanghai": "china", "hong kong": "china",
  "mumbai": "india", "bangalore": "india", "bengaluru": "india",
  "sydney": "australia", "melbourne": "australia",
};

const researchCompanyDetails = async (ticker: string, companyName: string): Promise<{
  location: string | null; state: string | null; localNewsSources: string[]; enhancedName: string | null;
}> => {
  const result = { location: null as string | null, state: null as string | null, localNewsSources: [] as string[], enhancedName: null as string | null };
  const searchQueries = [`${ticker} headquarters location`, `${companyName} based company`];
  const locationPatterns = [/\b([\w\s]+)-based\b/i, /\bheadquartered in ([\w\s,]+)/i, /\bbased in ([\w\s,]+)/i, /\bhome office in ([\w\s,]+)/i];
  const statePatterns = [/\b(Alabama|Alaska|Arizona|Arkansas|California|Colorado|Connecticut|Delaware|Florida|Georgia|Hawaii|Idaho|Illinois|Indiana|Iowa|Kansas|Kentucky|Louisiana|Maine|Maryland|Massachusetts|Michigan|Minnesota|Mississippi|Missouri|Montana|Nebraska|Nevada|New Hampshire|New Jersey|New Mexico|New York|North Carolina|North Dakota|Ohio|Oklahoma|Oregon|Pennsylvania|Rhode Island|South Carolina|South Dakota|Tennessee|Texas|Utah|Vermont|Virginia|Washington|West Virginia|Wisconsin|Wyoming)\b/i];

  for (let qi = 0; qi < searchQueries.length; qi++) {
    const query = searchQueries[qi];
    try {
      const rssUrl = `https://news.google.com/rss/search?q=${encodeURIComponent(query)}&hl=en-US&gl=US&ceid=US:en`;
      const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(rssUrl)}`;
      const contents = await tryProxy(proxyUrl, true);
      
      if (!contents) {
        await delay(300);
        continue;
      }
      
      const parser = new DOMParser();
      const doc = parser.parseFromString(contents, "text/xml");
      const items = Array.from(doc.querySelectorAll("item")).slice(0, 5);
      
      for (const item of items) {
        const title = item.querySelector("title")?.textContent || "";
        const description = item.querySelector("description")?.textContent || "";
        const fullText = `${title} ${description}`;
        
        for (const pattern of locationPatterns) {
          const match = fullText.match(pattern);
          if (match) {
            const location = (match[1] || match[2] || "").trim();
            if (location && location.length > 2 && location.length < 40) {
              result.location = location;
              const cityLower = location.toLowerCase();
              if (CITY_TO_STATE[cityLower]) result.state = CITY_TO_STATE[cityLower];
              break;
            }
          }
        }
        
        if (!result.state) {
          for (const pattern of statePatterns) {
            const match = fullText.match(pattern);
            if (match) { result.state = match[1].toLowerCase(); break; }
          }
        }
        
        if (companyName === ticker) {
          const namePatterns = [
            new RegExp(`([A-Z][A-Za-z0-9\\s&.,'\\-]+?)\\s*\\(${ticker}\\)`, 'i'),
            new RegExp(`([A-Z][A-Za-z0-9\\s&.,'\\-]+?)\\s*\\((?:NYSE|NASDAQ|AMEX):?\\s*${ticker}\\)`, 'i'),
          ];
          for (const np of namePatterns) {
            const nameMatch = fullText.match(np);
            if (nameMatch && nameMatch[1]) {
              const extractedName = nameMatch[1].trim();
              if (extractedName.length > 2 && extractedName.length < 50) { result.enhancedName = extractedName; break; }
            }
          }
        }
        if (result.state) break;
      }
      if (result.state) break;
    } catch (e) { /* Continue */ }
    
    // Delay between queries
    if (qi < searchQueries.length - 1) {
      await delay(400);
    }
  }
  
  if (result.state && STATE_LOCAL_NEWS[result.state]) result.localNewsSources = STATE_LOCAL_NEWS[result.state];
  return result;
};

const resolveCompanyIdentity = async (ticker: string): Promise<{ name: string, executives: {name: string, role: string}[] }> => {
  const defaultExecs = [{ name: "CEO", role: "Chief Executive" }, { name: "CFO", role: "Chief Financial" }];
  const yahooSearchUrl = `https://query1.finance.yahoo.com/v1/finance/search?q=${ticker}&quotesCount=5&newsCount=0`;
  const yahooQuoteUrl = `https://query1.finance.yahoo.com/v7/finance/quote?symbols=${ticker}`;
  
  // Try search endpoint first with allorigins
  try {
    const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(yahooSearchUrl)}`;
    const contents = await tryProxy(proxyUrl, true);
    if (contents) {
      const searchData = JSON.parse(contents);
      if (searchData.quotes && searchData.quotes.length > 0) {
        const exactMatch = searchData.quotes.find((q: any) => q.symbol === ticker || q.symbol === `${ticker}.US` || q.symbol?.toUpperCase() === ticker);
        const match = exactMatch || searchData.quotes[0];
        if (match && (match.shortname || match.longname)) {
          return { name: match.longname || match.shortname, executives: defaultExecs };
        }
      }
    }
  } catch (e) { /* Continue */ }
  
  await delay(500);
  
  // Try quote endpoint as fallback
  try {
    const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(yahooQuoteUrl)}`;
    const contents = await tryProxy(proxyUrl, true);
    if (contents) {
      const quoteData = JSON.parse(contents);
      if (quoteData.quoteResponse?.result?.length > 0) {
        const quote = quoteData.quoteResponse.result[0];
        if (quote.shortName || quote.longName) {
          return { name: quote.longName || quote.shortName, executives: defaultExecs };
        }
      }
    }
  } catch (e) { /* Continue */ }
  
  await delay(500);
  
  // Try corsproxy.io as backup
  try {
    const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(yahooSearchUrl)}`;
    const contents = await tryProxy(proxyUrl, false);
    if (contents) {
      const searchData = JSON.parse(contents);
      if (searchData.quotes && searchData.quotes.length > 0) {
        const match = searchData.quotes[0];
        if (match && (match.shortname || match.longname)) {
          return { name: match.longname || match.shortname, executives: defaultExecs };
        }
      }
    }
  } catch (e) { /* Continue */ }

  return { name: ticker, executives: defaultExecs };
};

const extractCompanyNameFromNews = (ticker: string, headlines: string[]): string | null => {
  const patterns = [
    new RegExp(`([A-Z][A-Za-z0-9\\s&.,'\\-]+?)\\s*\\(${ticker}\\)`, 'i'),
    new RegExp(`${ticker}[:\\s]+([A-Z][A-Za-z0-9\\s&.,'\\-]+?)(?:\\s+(?:reports|announces|posts|shares|sees|beats|misses|rises|falls|jumps|drops|stock|Inc|Corp|Co|Ltd))`, 'i'),
    new RegExp(`([A-Z][A-Za-z0-9\\s&.,'\\-]+?)'s\\s+(?:stock|shares|${ticker})`, 'i'),
    new RegExp(`^([A-Z][A-Za-z0-9\\s&.,'\\-]+?)\\s+(?:reported|announces|unveils|launches|reveals|posts|sees|beats|misses)`, 'i'),
  ];
  const tickerInParens = new RegExp(`([A-Z][A-Za-z0-9\\s&.,'\\-]{3,40})\\s*\\((?:NASDAQ|NYSE|AMEX)?:?\\s*${ticker}\\)`, 'i');

  for (const headline of headlines) {
    const parensMatch = headline.match(tickerInParens);
    if (parensMatch && parensMatch[1]) {
      const name = parensMatch[1].trim();
      if (name.length > 2 && name.length < 50 && /[A-Z]/.test(name) && !name.match(/^\d/)) return name;
    }
    for (const pattern of patterns) {
      const match = headline.match(pattern);
      if (match && match[1]) {
        const name = match[1].trim().replace(/^\s*[-–—]\s*/, '').replace(/\s*[-–—]\s*$/, '').replace(/\s+/g, ' ').trim();
        if (name.length > 2 && name.length < 50 && /[A-Z]/.test(name) && !name.match(/^\d/) && 
            !name.match(/^(The|A|An|In|On|At|To|For|By|With)\s*$/i) && !name.match(/^(stock|shares|price|market|trading|analyst)/i)) return name;
      }
    }
  }
  return null;
};

const escapeRegExp = (string: string) => string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const detectContentCategory = (title: string, description: string, sourceLabel: string, companyIdentity: { name: string, executives: {name: string, role: string}[] }): string => {
  const t = title.toLowerCase();
  const d = description.toLowerCase();
  const s = sourceLabel.toLowerCase();
  const fullText = `${t} . ${d}`;

  // Direct leadership content markers in title
  if (/\b(transcript|earnings call|conference call|8-k|10-k|10-q|shareholder letter|investor day|annual meeting|quarterly results)\b/.test(t)) return "Leadership";
  if (s.includes("executive") || s.includes("sec filing")) return "Leadership";
  
  // Executive titles - expanded list
  const titles = /\b(ceo|cfo|cto|coo|cmo|cio|ciso|chief executive|chief financial|chief technology|chief operating|chief marketing|chief information|chairman|vice chairman|president|founder|co-founder|managing director|general manager|evp|svp|executive vice president|senior vice president)\b/;
  const speechActs = /\b(said|says|announced|commented|stated|noted|remarked|discussed|explained|warned|highlighted|revealed|confirmed|denied|predicted|expects|believes|thinks|told|reports|according to)\b/;
  
  // Check title for executive + speech pattern
  if (titles.test(t) && speechActs.test(t)) return "Leadership";
  
  // Check description for executive + speech pattern (strong signal)
  if (titles.test(d) && speechActs.test(d)) {
    // Verify the executive reference is substantive (not just passing mention)
    const execMatch = d.match(titles);
    if (execMatch && execMatch.index !== undefined) {
      const contextAround = d.substring(Math.max(0, execMatch.index - 50), Math.min(d.length, execMatch.index + 100));
      if (speechActs.test(contextAround)) return "Leadership";
    }
  }
  
  // Quote pattern with executive attribution
  const quotePattern = /"([^"]+)"\s*(?:,|said|says|according to)\s*(?:the\s*)?(ceo|cfo|cto|chief executive|president|chairman|[A-Z][a-z]+\s+[A-Z][a-z]+)/;
  if (quotePattern.test(d)) return "Leadership";
  
  // Leadership action patterns
  const leadershipActions = /\b(ceo|cfo|chief executive|president|chairman)\s+(announces?|reveals?|confirms?|steps down|resigns?|retires?|joins?|leaves?|appoints?|hired|fired|ousted)\b/;
  if (leadershipActions.test(fullText)) return "Leadership";
  
  // Check for known executive names
  for (const exec of companyIdentity.executives) {
    if (exec.name !== "CEO" && exec.name !== "CFO" && exec.name.length > 3) {
      const execNameLower = exec.name.toLowerCase();
      if (fullText.includes(execNameLower)) return "Leadership";
      // Also check for last name only (e.g., "Nadella" for "Satya Nadella")
      const nameParts = exec.name.split(' ');
      if (nameParts.length > 1) {
        const lastName = nameParts[nameParts.length - 1].toLowerCase();
        if (lastName.length > 3 && fullText.includes(lastName)) return "Leadership";
      }
    }
  }
  
  // Earnings/guidance content often reflects executive views
  if (/\b(guidance|outlook|forecast|expects|projects|anticipates)\b/.test(t) && /\b(raised|lowered|maintained|cut|boosted|revised)\b/.test(t)) return "Leadership";
  
  return sourceLabel;
};

// ============================================================================
// SOCIAL MEDIA SENTIMENT FETCHING
// ============================================================================

const fetchSocialSentiment = async (ticker: string, companyName: string, onProgress?: (msg: string) => void): Promise<SocialSentimentData> => {
  const sentiment: SocialSentimentData = {
    reddit: { score: 0, count: 0, mentions: [] },
    reviews: { score: 0, count: 0, platforms: {} },
    employer: { score: 0, count: 0, source: '' },
    overall: 0
  };

  const shortName = companyName.replace(/,?\s*(Inc\.?|Corp\.?|Corporation|Ltd\.?|Limited|LLC|Plc|Co\.?|Company|Holdings)\b\.?/gi, "").trim();

  if (onProgress) onProgress(`Searching Reddit discussions for ${shortName}...`);
  
  try {
    // Only do one Reddit query to reduce requests
    const rssUrl = `https://news.google.com/rss/search?q=${encodeURIComponent(`site:reddit.com "${shortName}" OR ${ticker}`)}&hl=en-US&gl=US&ceid=US:en`;
    const items = await fetchRSS(rssUrl, "Reddit");
    for (const item of items.slice(0, 5)) {
      const { title, description } = extractItemData(item);
      const fullText = `${title} ${description}`;
      const scores = analyzeClause(fullText);
      sentiment.reddit.score += scores.consumerScore;
      sentiment.reddit.count++;
      sentiment.reddit.mentions.push({ title, sentiment: scores.consumerScore > 0.5 ? 'positive' : scores.consumerScore < -0.5 ? 'negative' : 'neutral' });
    }
    if (sentiment.reddit.count > 0) sentiment.reddit.score = sentiment.reddit.score / sentiment.reddit.count;
  } catch (e) { /* Reddit sentiment fetch failed silently */ }

  await delay(400);

  if (onProgress) onProgress(`Analyzing consumer reviews for ${shortName}...`);
  
  try {
    // Single combined review query
    const rssUrl = `https://news.google.com/rss/search?q=${encodeURIComponent(`("${shortName}" OR ${ticker}) (review OR rating OR complaint)`)}&hl=en-US&gl=US&ceid=US:en`;
    const items = await fetchRSS(rssUrl, "Reviews");
    for (const item of items.slice(0, 5)) {
      const { title, description } = extractItemData(item);
      const fullText = `${title} ${description}`;
      const scores = analyzeClause(fullText);
      sentiment.reviews.score += scores.consumerScore;
      sentiment.reviews.count++;
    }
    if (sentiment.reviews.count > 0) sentiment.reviews.score = sentiment.reviews.score / sentiment.reviews.count;
  } catch (e) { /* Consumer reviews fetch failed silently */ }

  await delay(400);

  if (onProgress) onProgress(`Checking employer sentiment for ${shortName}...`);
  
  try {
    const employerQuery = `site:glassdoor.com "${shortName}" reviews`;
    const rssUrl = `https://news.google.com/rss/search?q=${encodeURIComponent(employerQuery)}&hl=en-US&gl=US&ceid=US:en`;
    const items = await fetchRSS(rssUrl, "Employer Reviews");
    for (const item of items.slice(0, 5)) {
      const { title, description } = extractItemData(item);
      const fullText = `${title} ${description}`;
      const scores = analyzeClause(fullText);
      sentiment.employer.score += scores.consumerScore;
      sentiment.employer.count++;
    }
    if (sentiment.employer.count > 0) { sentiment.employer.score = sentiment.employer.score / sentiment.employer.count; sentiment.employer.source = 'Glassdoor'; }
  } catch (e) { /* Employer sentiment fetch failed silently */ }

  const weights = { reddit: 0.3, reviews: 0.5, employer: 0.2 };
  let totalWeight = 0, weightedSum = 0;
  if (sentiment.reddit.count > 0) { weightedSum += sentiment.reddit.score * weights.reddit; totalWeight += weights.reddit; }
  if (sentiment.reviews.count > 0) { weightedSum += sentiment.reviews.score * weights.reviews; totalWeight += weights.reviews; }
  if (sentiment.employer.count > 0) { weightedSum += sentiment.employer.score * weights.employer; totalWeight += weights.employer; }
  sentiment.overall = totalWeight > 0 ? weightedSum / totalWeight : 0;

  return sentiment;
};

// ============================================================================
// MAIN SEARCH LOGIC
// ============================================================================

export async function fetchAndAnalyzeTicker(ticker: string, onProgress?: (msg: string) => void): Promise<CompanyAnalysisResult> {
  const t = ticker.toUpperCase().trim();

  if (onProgress) onProgress(`Resolving Identity: ${t}...`);
  const identity = await resolveCompanyIdentity(t);
  let companyName = identity.name;

  await delay(500);

  if (onProgress) onProgress(`Researching ${companyName}...`);
  const research = await researchCompanyDetails(t, companyName);
  if (companyName === t && research.enhancedName) companyName = research.enhancedName;
  
  const shortName = companyName.replace(/,?\s*(Inc\.?|Corp\.?|Corporation|Ltd\.?|Limited|LLC|Plc|Co\.?|Company|Holdings)\b\.?/gi, "").trim();
  
  if (research.location && onProgress) onProgress(`Found: ${companyName} (${research.location})...`);

  const execQueries = identity.executives.filter(e => e.name !== "CEO" && e.name !== "CFO").map(e => `"${e.name}"`).join(" OR ");
  const isGeneric = GENERIC_COMMON_WORDS.has(t) || GENERIC_COMMON_WORDS.has(shortName.toUpperCase()) || (shortName.split(' ').length === 1 && shortName.length < 4);

  // Build subsidiary/brand query if available
  const subsidiaries = SUBSIDIARY_BRANDS[t] || [];
  const subsidiaryQuery = subsidiaries.length > 0 ? subsidiaries.map(s => `"${s}"`).join(" OR ") : "";

  if (onProgress) {
    if (isGeneric) {
      onProgress(`Strict Mode Active: Filtering generic noise for "${companyName}"...`);
    } else if (subsidiaries.length > 0) {
      onProgress(`Searching for "${companyName}" and ${subsidiaries.length} related brands/products...`);
    } else {
      onProgress(`Searching reputable news sources for "${companyName}"...`);
    }
  }
  
  // Enhanced entity query that includes subsidiaries
  let entityQuery = isGeneric 
    ? `("${companyName}" OR (${t} AND (stock OR earnings OR dividend OR revenue)))` 
    : subsidiaryQuery 
      ? `("${companyName}" OR ${t} OR "${shortName}" OR ${subsidiaryQuery})`
      : `("${companyName}" OR ${t} OR "${shortName}")`;
  
  const yahooRssUrl = `https://finance.yahoo.com/rss/headline?s=${t}`;
  const execQueryBase = execQueries ? `${entityQuery} AND (${execQueries} OR CEO OR CFO OR "Chief Executive")` : `${entityQuery} AND (CEO OR CFO OR "Chief Executive")`;

  const financialSources = FINANCIAL_MAJORS.slice(0, 10).join(" OR ");

  // Reduced set of queries - only the most essential ones for reliability
  const queries = [
    { label: "Yahoo Finance", urlOverride: yahooRssUrl, q: "" },
    { label: "Financial News", q: `${entityQuery} AND (${financialSources}) when:28d` },
    { label: "Executive Voice", q: `${execQueryBase} AND ("earnings call" OR transcript OR "shareholder letter" OR interview OR said OR announced) when:28d` },
    { label: "Wall Street", q: `${entityQuery} AND (analyst OR upgrade OR downgrade OR "price target" OR rating) when:28d` },
    { label: "Consumer Sentiment", q: `${entityQuery} AND (customer OR review OR product OR demand OR sales OR brand) when:28d` },
    { label: "Broad News", q: `${entityQuery} when:14d` },
  ];

  // Only add one subsidiary search if available
  if (subsidiaries.length > 0) {
    queries.push({ label: `${subsidiaries[0]} News`, q: `"${subsidiaries[0]}" AND (news OR announcement) when:14d` });
  }

  if (onProgress) onProgress(`Fetching social media sentiment...`);
  const socialSentimentPromise = fetchSocialSentiment(t, companyName, onProgress);

  // Fetch queries SEQUENTIALLY with delays to avoid rate limiting
  // This is slower but much more reliable on hosted environments
  let results: Element[][] = [];
  
  for (let i = 0; i < queries.length; i++) {
    const query = queries[i];
    if (onProgress) onProgress(`Fetching ${query.label}... (${i + 1}/${queries.length})`);
    
    try {
      const items = query.urlOverride 
        ? await fetchRSS(query.urlOverride, query.label) 
        : await fetchRSS(`https://news.google.com/rss/search?q=${encodeURIComponent(query.q)}&hl=en-US&gl=US&ceid=US:en`, query.label);
      results.push(items);
    } catch (e) {
      results.push([]);
    }
    
    // Add delay between queries to avoid rate limiting (except after last one)
    if (i < queries.length - 1) {
      await delay(400);
    }
  }

  const allRawItems = results.flat();

  // If we have no results at all, provide a minimal fallback instead of throwing
  if (allRawItems.length === 0) {
    if (onProgress) onProgress(`Limited data available for ${t}. Generating analysis...`);
    // Return a minimal result rather than throwing an error
    const fallbackResult: CompanyAnalysisResult = {
      ticker: t,
      companyName: companyName,
      signal: {
        direction: 'HOLD',
        strength: 50,
        confidence: 25,
        label: 'Limited Data',
        color: '#6B7280',
        reasoning: `Insufficient news data available for ${companyName} (${t}). This may indicate limited recent coverage or a less frequently traded security. Consider checking directly on financial news sites for more information.`
      },
      news: [],
      sentimentBreakdown: { execTone: 0, marketSentiment: 0, consumerSentiment: 0 },
      socialSentiment: null,
      executivesFound: identity.executives,
      groundingChunks: []
    };
    return fallbackResult;
  }

  if (onProgress) onProgress(`Filtering ${allRawItems.length} sources through relevance & credibility check...`);

  const newsItems: NewsItem[] = [];
  let weightedExecSum = 0, totalExecWeight = 0, weightedMarketSum = 0, totalMarketWeight = 0, weightedConsumerSum = 0, totalConsumerWeight = 0;
  let filteredCount = 0, passedCount = 0;

  const tickerRegex = new RegExp(`\\b${t}\\b`, 'i');
  const fullCompanyRegex = new RegExp(escapeRegExp(companyName), 'i');
  const shortNameRegex = new RegExp(`\\b${escapeRegExp(shortName)}\\b`, 'i');
  const financialContextRegex = new RegExp(`\\b(${FINANCIAL_CONTEXT_WORDS.join('|')})\\b`, 'i');
  const consumerContextRegex = /\b(customer|client|user|subscriber|player|gamer|fan|community|review|complaint|feedback|support|service|product|app|platform|device|experience|ui|ux|crash|bug|glitch|quality|refund|price|cost|value|subscription)\b/i;
  
  // Build regex for subsidiary/brand matching
  const subsidiaryRegexes = subsidiaries.map(s => new RegExp(`\\b${escapeRegExp(s)}\\b`, 'i'));

  const now = new Date();
  const cutoffDate = new Date();
  cutoffDate.setDate(now.getDate() - 28);
  const cutoffTime = cutoffDate.getTime();

  for (const item of allRawItems) {
    const { title, description, pubDateStr, link } = extractItemData(item);
    const fullText = `${title} . ${description}`;
    const cleanDesc = description.replace(/<[^>]*>?/gm, '');

    let pubDate = new Date();
    try { if (pubDateStr && !isNaN(new Date(pubDateStr).getTime())) pubDate = new Date(pubDateStr); } catch(e) {}
    if (pubDate.getTime() < cutoffTime) continue;

    const normTitle = title.toLowerCase().trim();
    let isDuplicate = false;
    for (const existing of newsItems) { if (jaccardIndex(normTitle, existing.headline) > 0.6) { isDuplicate = true; break; } }
    if (isDuplicate) continue;

    let keep = false;
    const sourceLabel = item.getAttribute("data-custom-source") || "General";

    const isNoise = NOISE_PATTERNS.some(pattern => pattern.test(fullText));
    if (!isNoise) {
      const hasTicker = tickerRegex.test(fullText);
      const hasFullName = fullCompanyRegex.test(fullText);
      const hasShortName = shortNameRegex.test(fullText);
      
      // Check for subsidiary/brand mentions
      const hasSubsidiary = subsidiaryRegexes.length > 0 && subsidiaryRegexes.some(regex => regex.test(fullText));
      
      // Check if ticker/company/subsidiary appears in the TITLE (strong relevance signal)
      const tickerInTitle = tickerRegex.test(title);
      const fullNameInTitle = fullCompanyRegex.test(title);
      const shortNameInTitle = shortNameRegex.test(title);
      const subsidiaryInTitle = subsidiaryRegexes.length > 0 && subsidiaryRegexes.some(regex => regex.test(title));
      const inTitle = tickerInTitle || fullNameInTitle || shortNameInTitle || subsidiaryInTitle;
      
      // Check if this appears to be a peripheral mention (related articles, trending, etc.)
      const isPeripheralMention = PERIPHERAL_MENTION_PATTERNS.some(pattern => pattern.test(fullText));
      
      // Check prominence: does the ticker/company/subsidiary appear in the first 250 chars of description?
      const descFirst250 = cleanDesc.substring(0, 250);
      const prominentInDesc = tickerRegex.test(descFirst250) || fullCompanyRegex.test(descFirst250) || shortNameRegex.test(descFirst250) || (subsidiaryRegexes.length > 0 && subsidiaryRegexes.some(regex => regex.test(descFirst250)));
      
      // Count how many times the ticker/company/subsidiaries are mentioned
      const tickerMatches = (fullText.match(tickerRegex) || []).length;
      const nameMatches = (fullText.match(fullCompanyRegex) || []).length + (fullText.match(shortNameRegex) || []).length;
      const subsidiaryMatches = subsidiaryRegexes.reduce((count, regex) => {
        const matches = fullText.match(new RegExp(regex.source, 'gi'));
        return count + (matches ? matches.length : 0);
      }, 0);
      const totalMentions = tickerMatches + nameMatches + subsidiaryMatches;
      
      // Any entity match (ticker, company name, or subsidiary)
      const hasAnyMatch = hasTicker || hasFullName || hasShortName || hasSubsidiary;
      
      if (isGeneric) {
        const hasContext = financialContextRegex.test(fullText);
        // For generic tickers, require title mention OR (prominent + multiple mentions + context)
        if (inTitle || (hasFullName && hasContext)) {
          keep = true;
        } else if (hasTicker && hasContext && prominentInDesc && totalMentions >= 2 && !isPeripheralMention) {
          keep = true;
        }
      } else {
        // For non-generic tickers: more permissive filtering
        // 1. Always keep if in title
        // 2. Keep if any match is found and not explicitly a peripheral mention
        // 3. Keep subsidiary mentions as relevant
        if (inTitle) {
          keep = true;
        } else if (hasAnyMatch) {
          // Only filter out if it's clearly a peripheral mention AND not prominent
          if (isPeripheralMention && !prominentInDesc && totalMentions < 2) {
            keep = false;
          } else {
            keep = true;
          }
        }
      }
    }

    if (!keep) {
      filteredCount++;
      continue;
    }

    // AMBIGUOUS ABBREVIATION CHECK - Filter out stories that match known false positives
    if (AMBIGUOUS_ABBREVIATIONS[t]) {
      const lowerText = fullText.toLowerCase();
      const falsePositives = AMBIGUOUS_ABBREVIATIONS[t];
      const isFalsePositive = falsePositives.some(fp => lowerText.includes(fp));
      if (isFalsePositive && !fullCompanyRegex.test(fullText)) {
        // Skip if matches a known false positive pattern AND doesn't mention company name
        filteredCount++;
        continue;
      }
    }

    // SOURCE VALIDATION - Use whitelist for scoring, but don't strictly enforce
    let sourceScore = 5; // Default moderate score for unknown sources
    let sourceCategory = 'Unknown';
    
    if (link) {
      const sourceCheck = isWhitelistedSource(link);
      if (sourceCheck.whitelisted) {
        sourceScore = sourceCheck.score;
        sourceCategory = sourceCheck.category;
        passedCount++;
      } else if (sourceCheck.category === 'Blacklisted' || sourceCheck.category === 'Blacklisted Pattern') {
        // Only skip blacklisted sources (content farms, tabloids, etc.)
        filteredCount++;
        continue;
      } else {
        // Unknown sources get through with moderate score
        sourceScore = 5;
        sourceCategory = 'Unverified';
        passedCount++;
      }
    }

    let timeWeight = calculateTimeWeight(pubDate);
    const impactMult = getImpactMultiplier(fullText);
    let isLocalSource = false;

    if (link && research.localNewsSources.length > 0) {
      try {
        const hostname = new URL(link).hostname.toLowerCase();
        const isMatchingLocal = research.localNewsSources.some(s => hostname.includes(s.replace('site:', '')));
        if (isMatchingLocal) isLocalSource = true;
      } catch (e) {}
    }

    let itemExecScore = 0, itemMarketScore = 0, itemConsumerScore = 0;
    const combinedText = `${title}. ${cleanDesc}`;
    const clauses = splitClauses(combinedText);
    
    clauses.forEach((clause, index) => {
      const scores = analyzeClause(clause);
      let clauseWeight = (clauses.length > 1 && index >= clauses.length / 2) ? 1.3 : 1.0;
      itemExecScore += (scores.execScore * clauseWeight);
      itemMarketScore += (scores.marketScore * clauseWeight);
      itemConsumerScore += (scores.consumerScore * clauseWeight);
    });

    const finalExec = normalize(itemExecScore, 10);
    const finalMarket = normalize(itemMarketScore, 10);
    const finalConsumer = normalize(itemConsumerScore, 10);
    
    let category = detectContentCategory(title, cleanDesc, sourceLabel, identity);
    let reliabilityWeight = 1.0;
    
    if (sourceScore >= 9) reliabilityWeight = 1.6;
    else if (sourceScore >= 8) reliabilityWeight = 1.4;
    else if (sourceScore >= 7) reliabilityWeight = 1.2;
    if (isLocalSource) reliabilityWeight *= 1.2;

    if (link) {
      try {
        const hostname = new URL(link).hostname.replace('www.','').toLowerCase();
        if (SOCIAL_DOMAINS.has(hostname) || GRASSROOTS_SOURCES.some(s => hostname.includes(s.replace('site:', '')))) {
          reliabilityWeight = 1.3; category = "Consumer";
        }
      } catch (e) {}
    }

    const isExec = category === "Leadership";
    if (isExec) timeWeight *= 2.0;

    const finalWeight = timeWeight * impactMult * reliabilityWeight;
    
    // Calculate a guaranteed sentiment score using basic word analysis as fallback
    const calculateBasicSentiment = (text: string): number => {
      const lowerText = text.toLowerCase();
      const basicPositive = ['good', 'great', 'strong', 'success', 'positive', 'growth', 'profit', 'gain', 'increase', 'rise', 'up', 'beat', 'exceed', 'above', 'better', 'improve', 'win', 'record', 'high', 'best', 'lead', 'ahead', 'boost', 'surge', 'soar', 'jump', 'rally', 'recover', 'outperform', 'buy', 'upgrade', 'bullish', 'optimistic', 'confident', 'pleased', 'excited', 'milestone', 'innovation', 'breakthrough', 'launch', 'expand', 'partner', 'award', 'approve', 'love', 'amazing', 'excellent', 'recommend'];
      const basicNegative = ['bad', 'weak', 'fail', 'loss', 'negative', 'decline', 'drop', 'fall', 'down', 'miss', 'below', 'worse', 'cut', 'low', 'concern', 'risk', 'problem', 'issue', 'challenge', 'struggle', 'lag', 'behind', 'slow', 'slump', 'plunge', 'crash', 'sell', 'downgrade', 'bearish', 'worried', 'disappoint', 'delay', 'cancel', 'lawsuit', 'investigate', 'recall', 'warning', 'threat', 'layoff', 'restructure', 'uncertain', 'volatile', 'pressure', 'hate', 'terrible', 'awful', 'avoid'];
      
      let posCount = 0, negCount = 0;
      basicPositive.forEach(w => { 
        const regex = new RegExp(`\\b${w}\\b`, 'gi');
        const matches = lowerText.match(regex);
        if (matches) posCount += matches.length;
      });
      basicNegative.forEach(w => { 
        const regex = new RegExp(`\\b${w}\\b`, 'gi');
        const matches = lowerText.match(regex);
        if (matches) negCount += matches.length;
      });
      
      if (posCount === 0 && negCount === 0) return 0;
      return (posCount - negCount) / (posCount + negCount); // Returns -1 to 1
    };
    
    // Get the best available sentiment score for this article
    const getBestScore = (exec: number, market: number, consumer: number, text: string): number => {
      const scores = [
        { val: exec, weight: 1.0 },
        { val: market, weight: 1.0 },
        { val: consumer, weight: 1.0 }
      ].filter(s => Math.abs(s.val) > 0.01);
      
      if (scores.length > 0) {
        // Return weighted average of non-zero scores
        const sum = scores.reduce((acc, s) => acc + s.val * s.weight, 0);
        const weightSum = scores.reduce((acc, s) => acc + s.weight, 0);
        return sum / weightSum;
      }
      
      // Fallback to basic sentiment
      const basic = calculateBasicSentiment(text);
      return basic * 0.3; // Scale down basic sentiment
    };
    
    let displayScore = 0;
    
    // Map source labels to primary categories
    const execLabels = ["Executive Voice", "Executive Media", "Leadership"];
    const wallStreetLabels = ["Wall Street", "Financials", "Yahoo Finance", "Major Wires", "Market News", "Financial Majors", "Financial Events"];
    const consumerLabels = ["Consumer"];
    
    // Determine which buckets this article contributes to
    let contributesToExec = isExec || execLabels.includes(sourceLabel);
    let contributesToWallStreet = wallStreetLabels.includes(category) || wallStreetLabels.includes(sourceLabel);
    let contributesToConsumer = consumerLabels.includes(category) || consumerLabels.includes(sourceLabel) || consumerContextRegex.test(fullText);
    
    // If no specific category, determine by content analysis
    if (!contributesToExec && !contributesToWallStreet && !contributesToConsumer) {
      // Check content for category hints
      const lowerText = fullText.toLowerCase();
      if (/\b(ceo|cfo|chief|executive|president|chairman|founder|management|leadership)\b/.test(lowerText)) {
        contributesToExec = true;
      }
      if (/\b(analyst|upgrade|downgrade|price target|rating|earnings|revenue|stock|shares|market|investor|quarter|guidance|forecast)\b/.test(lowerText)) {
        contributesToWallStreet = true;
      }
      if (/\b(customer|user|review|product|service|app|experience|quality|support|complaint|feedback)\b/.test(lowerText)) {
        contributesToConsumer = true;
      }
      
      // If still no category, contribute to all three with lower weight
      if (!contributesToExec && !contributesToWallStreet && !contributesToConsumer) {
        contributesToExec = true;
        contributesToWallStreet = true;
        contributesToConsumer = true;
      }
    }
    
    // Calculate scores for each bucket this article contributes to
    const bestScore = getBestScore(finalExec, finalMarket, finalConsumer, combinedText);
    
    if (contributesToExec) {
      let execScore = Math.abs(finalExec) > 0.01 ? finalExec : bestScore;
      weightedExecSum += execScore * finalWeight;
      totalExecWeight += finalWeight;
      if (isExec) displayScore = execScore; // Only set displayScore if this is the primary category
    }
    
    if (contributesToWallStreet) {
      let marketScore = Math.abs(finalMarket) > 0.01 ? finalMarket : bestScore;
      weightedMarketSum += marketScore * finalWeight;
      totalMarketWeight += finalWeight;
      if (!isExec && wallStreetLabels.includes(sourceLabel)) displayScore = marketScore;
    }
    
    if (contributesToConsumer) {
      let consumerScore = Math.abs(finalConsumer) > 0.01 ? finalConsumer : bestScore;
      weightedConsumerSum += consumerScore * finalWeight;
      totalConsumerWeight += finalWeight;
      if (!isExec && !wallStreetLabels.includes(sourceLabel)) displayScore = consumerScore;
    }
    
    // Ensure displayScore has a value
    if (Math.abs(displayScore) < 0.001) {
      displayScore = bestScore;
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
      sourceScore: sourceScore,
      sourceCategory: sourceCategory,
      isVerifiedSource: sourceScore >= 7
    });
  }

  if (onProgress) onProgress(`Relevance filter: ${passedCount} relevant articles, ${filteredCount} peripheral/low-quality rejected`);

  const filterOutliers = (items: NewsItem[], targetScore: number) => {
    if (items.length < 5) return;
    const variances = items.map(i => Math.pow(i.sentimentScore - targetScore, 2));
    const stdDev = Math.sqrt(variances.reduce((a, b) => a + b, 0) / items.length);
    items.forEach(i => { if (Math.abs(i.sentimentScore - targetScore) > (stdDev * 1.5)) i.sentimentScore = i.sentimentScore * 0.7; });
  };

  newsItems.sort((a, b) => {
    const dateA = new Date(a.timestamp).setHours(0,0,0,0);
    const dateB = new Date(b.timestamp).setHours(0,0,0,0);
    if (dateA !== dateB) return dateB - dateA;
    return (b.sourceScore || 0) - (a.sourceScore || 0);
  });

  // Calculate final scores with softer normalization to preserve signal
  const softNormalize = (weightedSum: number, totalWeight: number): number => {
    if (totalWeight <= 0) return 0;
    const rawAvg = weightedSum / totalWeight;
    // Softer sigmoid-like normalization
    const scaled = rawAvg * 3; // Amplify the signal
    const normalized = scaled / Math.sqrt(scaled * scaled + 1); // Soft clamp to -1 to 1
    // Apply confidence based on weight, but less aggressively
    const confidence = Math.min(totalWeight / (totalWeight + 2), 0.95);
    return Math.max(-1.0, Math.min(1.0, normalized * confidence));
  };
  
  let finalWallSt = softNormalize(weightedMarketSum, totalMarketWeight);
  let finalConsumerScore = softNormalize(weightedConsumerSum, totalConsumerWeight);
  let finalOverall = softNormalize(weightedExecSum, totalExecWeight);
  
  // Ensure minimum visible scores when we have data
  if (totalMarketWeight > 0 && Math.abs(finalWallSt) < 0.02) {
    const sign = weightedMarketSum >= 0 ? 1 : -1;
    finalWallSt = sign * 0.02;
  }
  if (totalConsumerWeight > 0 && Math.abs(finalConsumerScore) < 0.02) {
    const sign = weightedConsumerSum >= 0 ? 1 : -1;
    finalConsumerScore = sign * 0.02;
  }
  if (totalExecWeight > 0 && Math.abs(finalOverall) < 0.02) {
    const sign = weightedExecSum >= 0 ? 1 : -1;
    finalOverall = sign * 0.02;
  }
  
  // Integrate social sentiment into consumer score
  const socialSentiment = await socialSentimentPromise;
  if (socialSentiment && socialSentiment.overall !== 0) {
    // Blend social sentiment with news-based consumer sentiment
    // Social sentiment weight: 40%, News-based consumer sentiment: 60%
    const socialWeight = 0.4;
    const newsWeight = 0.6;
    if (totalConsumerWeight > 0) {
      finalConsumerScore = (finalConsumerScore * newsWeight) + (socialSentiment.overall * socialWeight);
    } else {
      // If no news-based consumer data, use social sentiment directly
      finalConsumerScore = socialSentiment.overall;
    }
  }
  
  filterOutliers(newsItems, finalWallSt);

  const totalRealityWeight = totalExecWeight + totalConsumerWeight;
  let realityScore = finalOverall;
  if (totalRealityWeight > 0) realityScore = ((finalOverall * totalExecWeight) + (finalConsumerScore * totalConsumerWeight)) / totalRealityWeight;

  // Calculate gap - use lower threshold to ensure it's calculated when we have data
  let gap = 0;
  if (totalMarketWeight > 0.5 && totalRealityWeight > 0.5) {
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
  } else if (Math.abs(finalConsumerScore) > 0.5 && Math.sign(finalConsumerScore) !== Math.sign(finalWallSt)) {
    signal = finalConsumerScore > 0
      ? { type: 'VOLATILITY_WARNING', headline: "Consumer/Market Split", description: "Customers love the product, but Wall Street hates the stock (Value Trap potential).", strength: 75 }
      : { type: 'VOLATILITY_WARNING', headline: "Brand Erosion Warning", description: "Wall Street is bullish, but consumer sentiment is collapsing.", strength: 80 };
  }

  const groundingLinks: GroundingChunk[] = newsItems.map(i => ({ web: { uri: i.link || "", title: i.headline } })).filter(g => g.web?.uri);
  const processedExecs: Executive[] = identity.executives.map(e => ({ name: e.name, role: e.role, sentimentScore: 0, summary: "" }));

  let finalCompanyName = companyName;
  if (companyName === t && newsItems.length > 0) {
    const headlines = newsItems.map(item => item.headline);
    const extractedName = extractCompanyNameFromNews(t, headlines);
    if (extractedName) finalCompanyName = extractedName;
  }

  const result: CompanyAnalysisResult = {
    ticker: t,
    companyName: finalCompanyName,
    overallSentiment: finalOverall,
    overallSummary: "C-Suite Confidence Index",
    wallStreetSentiment: finalWallSt,
    wallStreetSummary: "External Market Sentiment",
    consumerSentiment: finalConsumerScore,
    consumerSummary: "Broad Industry Context",
    sentimentGap: gap,
    executives: processedExecs,
    items: newsItems,
    groundingLinks,
    signal,
    socialSentiment,
    sourceStats: {
      totalProcessed: allRawItems.length,
      passed: passedCount,
      filtered: filteredCount,
      verifiedSources: newsItems.length
    }
  };

  return result;
}
