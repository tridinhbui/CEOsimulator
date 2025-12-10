export enum ScenarioCategory {
  FINANCE = 'Finance',
  HR = 'HR',
  PRODUCT = 'Product',
  MARKETING = 'Marketing',
  OPERATIONS = 'Operations',
  LEADERSHIP = 'Leadership',
  CRISIS = 'Crisis',
  EVENT = 'Event'
}

export interface CompanyMetrics {
  cash: number;
  monthlyRevenue: number;
  monthlyBurn: number;
  employees: number;
  morale: number; // 0-100
  customerSatisfaction: number; // 0-100
  marketShare: number; // 0-100 (Replaces efficiency)
  risk: number; // 0-100
  valuation: number;
  sharesHeld: number; // Number of shares held in the market index
}

export interface DecisionOption {
  id: string;
  text: string;
  description?: string;
  // Impact deltas
  impact: {
    cash?: number;
    monthlyRevenue?: number;
    monthlyBurn?: number;
    morale?: number;
    customerSatisfaction?: number;
    marketShare?: number;
    risk?: number;
    valuation?: number;
  };
  feedback: string;
  triggerEnding?: GameState; // Special flag to trigger specific endings
}

export interface Scenario {
  id: string;
  title: string;
  description: string;
  category: ScenarioCategory;
  options: DecisionOption[];
}

export interface LogEntry {
  turn: number;
  scenarioTitle: string;
  decisionText: string;
  impact: DecisionOption['impact'];
  metricsSnapshot: CompanyMetrics;
}

export enum GameState {
  INTRO = 'INTRO',
  PLAYING = 'PLAYING',
  QUARTER_SUMMARY = 'QUARTER_SUMMARY',
  GAME_OVER = 'GAME_OVER',
  IPO_WIN = 'IPO_WIN',
  ACQUISITION_WIN = 'ACQUISITION_WIN'
}

export interface ChatMessage {
  role: 'user' | 'advisor';
  text: string;
}