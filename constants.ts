import { CompanyMetrics, Scenario, ScenarioCategory, GameState } from './types';

export const INITIAL_METRICS: CompanyMetrics = {
  cash: 2500000000, // $2.5 Billion
  monthlyRevenue: 850000000, // $850 Million/mo
  monthlyBurn: 780000000, // $780 Million/mo (High OpEx due to manufacturing)
  employees: 80000,
  morale: 65, // Corporate morale is usually average
  customerSatisfaction: 75,
  marketShare: 12, // Global market share
  risk: 15,
  valuation: 45000000000, // $45 Billion
  sharesHeld: 0
};

export const SEED_SCENARIOS: Scenario[] = [
  // --- OPERATIONS & SUPPLY CHAIN ---
  {
    id: 's1',
    title: 'Global Semiconductor Shortage',
    description: 'A geopolitical crisis has halted chip shipments from Taiwan. Your automotive assembly lines will stop in 3 weeks.',
    category: ScenarioCategory.OPERATIONS,
    options: [
      {
        id: 'opt1',
        text: 'Halt production & Furlough workers',
        impact: { monthlyRevenue: -200000000, monthlyBurn: -100000000, morale: -20, risk: 5 },
        feedback: "You saved cash, but the unions are furious about the furloughs."
      },
      {
        id: 'opt2',
        text: 'Pay 10x premium for black market chips',
        impact: { cash: -500000000, monthlyBurn: 50000000, customerSatisfaction: 5 },
        feedback: "Production continues, but margins are decimated for this quarter."
      },
      {
        id: 'opt3',
        text: 'Ship unfinished units (Retrofit later)',
        impact: { risk: 30, cash: 100000000, customerSatisfaction: -15 },
        feedback: "Dealers have inventory, but logistics for the retrofit will be a nightmare."
      }
    ]
  },
  {
    id: 's2',
    title: 'Labor Union Strike Threat',
    description: 'The Manufacturing Union representing 30,000 workers demands a 15% wage increase and a ban on new robotics.',
    category: ScenarioCategory.HR,
    options: [
      {
        id: 'opt1',
        text: 'Accept all demands',
        impact: { monthlyBurn: 40000000, morale: 20, risk: -10 },
        feedback: "Peace is restored, but your operating costs just skyrocketed."
      },
      {
        id: 'opt2',
        text: 'Reject and weather the strike',
        impact: { monthlyRevenue: -300000000, morale: -30, risk: 20 },
        feedback: "The factories are silent. Media coverage is brutal. Revenue is bleeding."
      },
      {
        id: 'opt3',
        text: 'Negotiate: Raise wages, keep robots',
        impact: { monthlyBurn: 20000000, cash: -50000000, morale: 5 },
        feedback: "A costly compromise, but automation can proceed."
      }
    ]
  },
  {
    id: 's3',
    title: 'Factory Automation Upgrade',
    description: 'The CTO proposes a $200M overhaul of the Detroit plant to replace 5,000 workers with AI-driven robotics.',
    category: ScenarioCategory.PRODUCT,
    options: [
      {
        id: 'opt1',
        text: 'Approve Automation',
        impact: { cash: -200000000, monthlyBurn: -30000000, morale: -15, marketShare: 2 },
        feedback: "Efficiency is up 40%, but layoffs have damaged the company reputation."
      },
      {
        id: 'opt2',
        text: 'Reject Automation',
        impact: { morale: 10, marketShare: -1 },
        feedback: "Workers are relieved, but competitors are producing units cheaper than you."
      },
      {
        id: 'opt3',
        text: 'Pilot Program (Hybrid)',
        impact: { cash: -50000000, monthlyBurn: -5000000 },
        feedback: "A slow rollout. Safe, but not transformative."
      }
    ]
  },
  {
    id: 's4',
    title: 'Lithium Mine Acquisition',
    description: 'To secure battery supply for EVs, you have the chance to acquire a mining operation in South America.',
    category: ScenarioCategory.FINANCE,
    options: [
      {
        id: 'opt1',
        text: 'Acquire for $1.5 Billion',
        impact: { cash: -1500000000, risk: 10, valuation: 2000000000, marketShare: 5 },
        feedback: "Vertical integration achieved! Wall Street loves the bold move."
      },
      {
        id: 'opt2',
        text: 'Sign long-term contract instead',
        impact: { monthlyBurn: 10000000, risk: 5 },
        feedback: "Supply secured without depleting cash reserves."
      },
      {
        id: 'opt3',
        text: 'Pass',
        impact: { marketShare: -3, risk: 15 },
        feedback: "Competitors bought the mine. Your battery costs are rising."
      }
    ]
  },
  {
    id: 's5',
    title: 'Environmental Scandal',
    description: 'Whistleblowers reveal your flagship chemical plant has been leaking toxins into the local water supply.',
    category: ScenarioCategory.CRISIS,
    options: [
      {
        id: 'opt1',
        text: 'Full Accountability & Cleanup',
        impact: { cash: -300000000, risk: -20, customerSatisfaction: 5 },
        feedback: "Massively expensive, but you saved the brand image."
      },
      {
        id: 'opt2',
        text: 'Deny and Fight in Court',
        impact: { cash: -20000000, risk: 40, customerSatisfaction: -20 },
        feedback: "Legal fees are low for now, but the public hates you."
      },
      {
        id: 'opt3',
        text: 'Quiet Settlement',
        impact: { cash: -100000000, risk: 10 },
        feedback: "It went away, but journalists are still digging."
      }
    ]
  },
  // --- MARKET & TECH ---
  {
    id: 's6',
    title: 'Competitor Merger',
    description: 'Two of your mid-sized rivals are merging to form a giant that rivals your market share.',
    category: ScenarioCategory.EVENT,
    options: [
      {
        id: 'opt1',
        text: 'Trigger Hostile Takeover of one',
        impact: { cash: -2000000000, marketShare: 15, risk: 25 },
        feedback: "Aggressive! You spent almost all cash, but now dominate the market."
      },
      {
        id: 'opt2',
        text: 'Slash prices to bleed them',
        impact: { monthlyRevenue: -100000000, monthlyBurn: 50000000, marketShare: 5 },
        feedback: "Margin war initiated. It will be a painful year."
      },
      {
        id: 'opt3',
        text: 'Focus on Premium Market',
        impact: { marketShare: -5, monthlyRevenue: 20000000 },
        feedback: "You ceded volume for higher margins."
      }
    ]
  },
  {
    id: 's7',
    title: 'Legacy Tech Debt',
    description: 'Your ERP system from 1990 is failing. It runs the entire global logistics network.',
    category: ScenarioCategory.PRODUCT,
    options: [
      {
        id: 'opt1',
        text: 'Global SAP Migration ($500M)',
        impact: { cash: -500000000, monthlyBurn: -20000000, risk: -10 },
        feedback: "A painful 2-year process, but operations are finally modern."
      },
      {
        id: 'opt2',
        text: 'Patch the old system',
        impact: { cash: -20000000, risk: 25 },
        feedback: "Band-aid applied. One bad glitch could kill the company."
      },
      {
        id: 'opt3',
        text: 'Build custom internal solution',
        impact: { cash: -150000000, monthlyBurn: 10000000, morale: -5 },
        feedback: "Engineering is overwhelmed. The project is over budget."
      }
    ]
  },
  {
    id: 's8',
    title: 'Government Regulations',
    description: 'New Carbon Tax legislation requires you to cut emissions by 30% or face massive fines.',
    category: ScenarioCategory.EVENT,
    options: [
      {
        id: 'opt1',
        text: 'Green Factory Retrofit',
        impact: { cash: -400000000, monthlyBurn: -10000000, risk: -15 },
        feedback: "You are now a green leader. Operating costs dropped due to energy savings."
      },
      {
        id: 'opt2',
        text: 'Buy Carbon Credits',
        impact: { monthlyBurn: 25000000, risk: 5 },
        feedback: "An ongoing expense that hurts profitability."
      },
      {
        id: 'opt3',
        text: 'Lobby against the bill',
        impact: { cash: -50000000, risk: 10, customerSatisfaction: -10 },
        feedback: "You delayed the bill, but environmentalists are protesting HQ."
      }
    ]
  },
  {
    id: 's9',
    title: 'Recall Crisis',
    description: 'Reports indicate a safety defect in your best-selling product line. Potential for injury.',
    category: ScenarioCategory.CRISIS,
    options: [
      {
        id: 'opt1',
        text: 'Global Recall (1M units)',
        impact: { cash: -600000000, customerSatisfaction: 10, risk: -20 },
        feedback: "A massive financial hit, but customers trust your integrity."
      },
      {
        id: 'opt2',
        text: 'Regional Repair Program',
        impact: { cash: -100000000, risk: 10 },
        feedback: "Cheaper, but regulators are watching closely."
      },
      {
        id: 'opt3',
        text: 'Ignore (Blame User Error)',
        impact: { risk: 50, customerSatisfaction: -30 },
        feedback: "Gambling with lives. A class-action lawsuit is forming."
      }
    ]
  },
  {
    id: 's10',
    title: 'Acquisition Offer',
    description: 'A Sovereign Wealth Fund offers to take the company private at a 40% premium.',
    category: ScenarioCategory.EVENT,
    options: [
      {
        id: 'opt1',
        text: 'Accept and Go Private',
        impact: { cash: 10000000000, morale: 5 },
        feedback: "Shareholders are rich. You are now answerable to the fund.",
        triggerEnding: GameState.ACQUISITION_WIN
      },
      {
        id: 'opt2',
        text: 'Reject to stay Public',
        impact: { risk: 5, valuation: 2000000000 },
        feedback: "The market likes your confidence. Stock price bumps up."
      },
      {
        id: 'opt3',
        text: 'Reject with Poison Pill',
        impact: { cash: -100000000, risk: 10 },
        feedback: "You protected the company, but the board is divided."
      }
    ]
  },
  {
    id: 's11',
    title: 'Supply Chain Bottleneck',
    description: 'A ship is stuck in a major canal, blocking $500M of your inventory.',
    category: ScenarioCategory.OPERATIONS,
    options: [
      {
        id: 'opt1',
        text: 'Air freight replacement parts',
        impact: { cash: -100000000, customerSatisfaction: 5 },
        feedback: "Expensive logistics, but production didn't stop."
      },
      {
        id: 'opt2',
        text: 'Wait it out',
        impact: { monthlyRevenue: -150000000, customerSatisfaction: -10 },
        feedback: "Delays caused order cancellations."
      },
      {
        id: 'opt3',
        text: 'Reroute via longer sea path',
        impact: { cash: -20000000, monthlyRevenue: -50000000 },
        feedback: "Moderate delays, moderate cost."
      }
    ]
  },
  {
    id: 's12',
    title: 'Data Center Expansion',
    description: 'To support AI initiatives, IT needs a new $100M data center.',
    category: ScenarioCategory.OPERATIONS,
    options: [
      {
        id: 'opt1',
        text: 'Build internal Data Center',
        impact: { cash: -100000000, monthlyBurn: 5000000, valuation: 50000000 },
        feedback: "Asset heavy, but you control the data."
      },
      {
        id: 'opt2',
        text: 'Partner with Cloud Provider',
        impact: { monthlyBurn: 15000000, cash: -10000000 },
        feedback: "OpEx went up, but CapEx was saved."
      },
      {
        id: 'opt3',
        text: 'Delay Project',
        impact: { risk: 10, marketShare: -1 },
        feedback: "Tech debt accumulates."
      }
    ]
  }
];