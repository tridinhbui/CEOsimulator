import React, { useState, useEffect, useCallback } from 'react';
import { GameState, CompanyMetrics, Scenario, LogEntry, DecisionOption } from './types';
import { INITIAL_METRICS } from './constants';
import { generateScenario } from './services/geminiService';
import Dashboard from './components/Dashboard';
import ScenarioView from './components/ScenarioView';
import QuarterlyReport from './components/QuarterlyReport';
import IntroModal from './components/IntroModal';
import OfficeBackground from './components/OfficeBackground';
import ChatAdvisor from './components/ChatAdvisor';
import { IconAlert, IconTrendingUp, IconTrendingDown, IconAward } from './components/ui/Icons';

const QUARTER_LENGTH = 4; // weeks per quarter
const WIN_QUARTERS = 12; // quarters to reach IPO

// Confetti Component
const Confetti = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {[...Array(50)].map((_, i) => (
        <div 
          key={i} 
          className="confetti"
          style={{
            left: `${Math.random() * 100}%`,
            animationDuration: `${Math.random() * 3 + 2}s`,
            animationDelay: `${Math.random() * 2}s`,
            backgroundColor: ['#ff0', '#f00', '#0f0', '#00f', '#f0f'][Math.floor(Math.random() * 5)]
          }} 
        />
      ))}
    </div>
  );
};

function App() {
  const [gameState, setGameState] = useState<GameState>(GameState.INTRO);
  const [metrics, setMetrics] = useState<CompanyMetrics>(INITIAL_METRICS);
  const [turn, setTurn] = useState(1);
  const [quarter, setQuarter] = useState(1);
  const [history, setHistory] = useState<LogEntry[]>([]);
  const [currentScenario, setCurrentScenario] = useState<Scenario | null>(null);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<{message: string, positive: boolean} | null>(null);
  const [shake, setShake] = useState(false);
  
  // Stock Market State
  const [stockPrice, setStockPrice] = useState(145.50);
  
  // Calculated Game Stage for Background (0-3)
  const getStage = () => {
    // Stage logic based on Valuation for Fortune 500
    if (metrics.valuation > 100000000000) return 3; // >100B (Global HQ)
    if (metrics.valuation > 60000000000) return 2; // >60B (Boardroom)
    if (metrics.valuation > 40000000000) return 1; // >40B (High Rise)
    return 0; // Factory Floor (Starting)
  };

  // Calculated Level Title
  const getLevelTitle = () => {
    if (metrics.marketShare > 30) return "Industry Titan";
    if (metrics.valuation > 80000000000) return "Global Conglomerate CEO";
    if (quarter > 8) return "Veteran Executive";
    return "Group CEO";
  };

  const startGame = useCallback(async () => {
    setGameState(GameState.PLAYING);
    setLoading(true);
    const scenario = await generateScenario(metrics, 1);
    setCurrentScenario(scenario);
    setLoading(false);
  }, [metrics]);

  const handleBuyStock = (shares: number) => {
    const cost = shares * stockPrice;
    if (metrics.cash >= cost) {
      setMetrics(prev => ({
        ...prev,
        cash: prev.cash - cost,
        sharesHeld: (prev.sharesHeld || 0) + shares
      }));
    }
  };

  const handleSellStock = (shares: number) => {
    if ((metrics.sharesHeld || 0) >= shares) {
      const proceeds = shares * stockPrice;
      setMetrics(prev => ({
        ...prev,
        cash: prev.cash + proceeds,
        sharesHeld: (prev.sharesHeld || 0) - shares
      }));
    }
  };

  const handleDecision = async (option: DecisionOption) => {
    if (!currentScenario) return;

    // Check for explicit ending trigger from the option (e.g. Acquisition)
    if (option.triggerEnding) {
        setGameState(option.triggerEnding);
        return;
    }

    // 1. Calculate new metrics
    const newMetrics = { ...metrics };
    const impact = option.impact;

    if (impact.cash) newMetrics.cash += impact.cash;
    if (impact.monthlyRevenue) newMetrics.monthlyRevenue += impact.monthlyRevenue;
    if (impact.monthlyBurn) newMetrics.monthlyBurn += impact.monthlyBurn;
    if (impact.morale) newMetrics.morale = Math.max(0, Math.min(100, newMetrics.morale + (impact.morale || 0)));
    if (impact.customerSatisfaction) newMetrics.customerSatisfaction = Math.max(0, Math.min(100, newMetrics.customerSatisfaction + (impact.customerSatisfaction || 0)));
    if (impact.marketShare) newMetrics.marketShare = Math.max(0, Math.min(100, newMetrics.marketShare + (impact.marketShare || 0)));
    if (impact.risk) newMetrics.risk = Math.max(0, Math.min(100, newMetrics.risk + (impact.risk || 0)));
    
    // Explicit valuation override or formula
    if (impact.valuation) {
        newMetrics.valuation += impact.valuation;
    } else {
        // Valuation logic for big corp: Revenue * 5 multiplier + Cash
        newMetrics.valuation = (newMetrics.monthlyRevenue * 12 * 5) + (newMetrics.cash);
    }

    // Apply generic time passing (Burn rate)
    const weeklyBurn = (newMetrics.monthlyBurn - newMetrics.monthlyRevenue) / 4;
    newMetrics.cash -= weeklyBurn;

    // Stock Market Fluctuation logic (Random walk)
    const volatility = 0.03; // 3% swing max for stable stock
    const change = 1 + (Math.random() * volatility * 2 - volatility);
    const newStockPrice = Math.max(10, stockPrice * change);
    setStockPrice(newStockPrice);

    // Trigger visual effects
    const isBadOutcome = (impact.cash && impact.cash < -100000000) || (impact.morale && impact.morale < -10) || (impact.marketShare && impact.marketShare < -2);
    if (isBadOutcome) {
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }

    // 2. Update State
    setMetrics(newMetrics);
    setHistory(prev => [...prev, {
      turn,
      scenarioTitle: currentScenario.title,
      decisionText: option.text,
      impact: option.impact,
      metricsSnapshot: newMetrics
    }]);

    setFeedback({
      message: option.feedback,
      positive: !isBadOutcome
    });

    // 3. Pause for feedback
    setTimeout(async () => {
      setFeedback(null);
      
      // Check Game Over Conditions (Strict!)
      if (newMetrics.cash <= 0 || newMetrics.morale <= 0 || newMetrics.customerSatisfaction <= 0 || newMetrics.marketShare <= 0) {
        setGameState(GameState.GAME_OVER);
        return;
      }

      // Check Win Condition
      if (quarter >= WIN_QUARTERS && turn % QUARTER_LENGTH === 0) {
         setGameState(GameState.IPO_WIN); // Reusing IPO_WIN enum for Market Dominance to save refactoring
         return;
      }

      // Check Quarter End
      if (turn % QUARTER_LENGTH === 0) {
        setGameState(GameState.QUARTER_SUMMARY);
        return;
      }

      // Next Turn
      setTurn(t => t + 1);
      setLoading(true);
      const nextScenario = await generateScenario(newMetrics, turn + 1);
      setCurrentScenario(nextScenario);
      setLoading(false);

    }, 2000);
  };

  const startNextQuarter = async () => {
    setQuarter(q => q + 1);
    setTurn(t => t + 1);
    setGameState(GameState.PLAYING);
    setLoading(true);
    const nextScenario = await generateScenario(metrics, turn + 1);
    setCurrentScenario(nextScenario);
    setLoading(false);
  };

  return (
    <div className={`flex flex-col lg:flex-row h-screen overflow-hidden font-sans ${shake ? 'animate-shake' : ''}`}>
      
      {/* Dynamic Background */}
      {gameState !== GameState.INTRO && <OfficeBackground stage={getStage()} />}
      
      {/* Intro Modal */}
      {gameState === GameState.INTRO && <IntroModal onStart={startGame} />}

      {/* Main Layout */}
      {gameState !== GameState.INTRO && (
        <>
          {/* Dashboard Sidebar */}
          <Dashboard 
            metrics={metrics} 
            turn={turn} 
            quarter={quarter} 
            levelTitle={getLevelTitle()}
            stockPrice={stockPrice}
            onBuyStock={handleBuyStock}
            onSellStock={handleSellStock}
          />

          {/* Main Content Area */}
          <main className="flex-1 relative flex flex-col h-full overflow-hidden">
            
            {/* Advisor Chatbot */}
            {gameState === GameState.PLAYING && (
                <ChatAdvisor scenario={currentScenario} metrics={metrics} />
            )}
            
            {/* Feedback Overlay */}
            {feedback && (
              <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none">
                <div className="bg-white/90 backdrop-blur-md border-2 border-indigo-100 shadow-2xl rounded-2xl p-8 max-w-lg text-center animate-popup pointer-events-auto">
                  <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 ${feedback.positive ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                     {feedback.positive ? <IconTrendingUp className="w-8 h-8" /> : <IconAlert className="w-8 h-8" />}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{feedback.positive ? 'Strategic Move' : 'Critical Warning'}</h3>
                  <p className="text-lg text-gray-600 font-medium">{feedback.message}</p>
                </div>
              </div>
            )}

            {/* Game Over Screen */}
            {gameState === GameState.GAME_OVER && (
              <div className="flex-1 flex flex-col items-center justify-center z-50 bg-gray-900/95 text-white p-8 text-center animate-popup">
                <IconAlert className="w-24 h-24 text-red-500 mb-6 animate-pulse" />
                <h1 className="text-6xl font-black mb-4 tracking-tight">INSOLVENCY</h1>
                <p className="text-2xl text-gray-400 mb-8 max-w-md leading-relaxed">
                  {metrics.cash <= 0 ? "Titan Industries has filed for Chapter 11 bankruptcy." : 
                   metrics.morale <= 0 ? "A massive general strike has paralyzed operations." :
                   metrics.marketShare <= 0 ? "You have been delisted from the S&P 500." :
                   "The Board of Directors has voted to remove you."}
                </p>
                <div className="bg-gray-800 p-8 rounded-2xl mb-8 border border-gray-700">
                  <div className="text-sm text-gray-500 uppercase font-bold tracking-widest mb-1">Final Valuation</div>
                  <div className="text-4xl font-mono text-red-400">$0</div>
                </div>
                <button 
                  onClick={() => window.location.reload()}
                  className="px-10 py-4 bg-red-600 hover:bg-red-700 rounded-xl font-bold text-lg transition-transform hover:scale-105"
                >
                  Restart Simulation
                </button>
              </div>
            )}

            {/* IPO Win Screen (Used for Market Dominance) */}
            {gameState === GameState.IPO_WIN && (
              <div className="flex-1 flex flex-col items-center justify-center z-50 bg-indigo-900/95 text-white p-8 text-center animate-popup">
                <Confetti />
                <div className="w-32 h-32 bg-yellow-400 rounded-full flex items-center justify-center mb-8 animate-float shadow-[0_0_50px_rgba(250,204,21,0.5)]">
                  <IconAward className="w-16 h-16 text-yellow-900" />
                </div>
                <h1 className="text-6xl font-black mb-4 tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-yellow-500">
                  MARKET DOMINANCE
                </h1>
                <p className="text-2xl text-indigo-200 mb-10 max-w-lg leading-relaxed">
                  Titan Industries is now the most valuable company on Earth. Your legacy is cemented in history.
                </p>
                <div className="bg-white/10 backdrop-blur p-8 rounded-2xl mb-10 border border-white/20">
                  <div className="text-sm text-indigo-300 uppercase font-bold tracking-widest mb-1">Final Valuation</div>
                  <div className="text-5xl font-mono text-green-400 font-bold">${(metrics.valuation / 1000000000).toFixed(1)} Billion</div>
                </div>
                <button 
                  onClick={() => window.location.reload()}
                  className="px-10 py-4 bg-white text-indigo-900 hover:bg-gray-100 rounded-xl font-bold text-lg transition-transform hover:scale-105 shadow-xl"
                >
                  Start New Tenure
                </button>
              </div>
            )}

            {/* Acquisition Win Screen */}
            {gameState === GameState.ACQUISITION_WIN && (
              <div className="flex-1 flex flex-col items-center justify-center z-50 bg-emerald-900/95 text-white p-8 text-center animate-popup">
                <Confetti />
                <div className="w-32 h-32 bg-emerald-400 rounded-full flex items-center justify-center mb-8 animate-float">
                  <IconAward className="w-16 h-16 text-emerald-900" />
                </div>
                <h1 className="text-6xl font-black mb-4 tracking-tight">TAKEN PRIVATE</h1>
                <p className="text-2xl text-emerald-200 mb-10 max-w-lg leading-relaxed">
                  The acquisition deal is closed. You walked away with a Golden Parachute worth hundreds of millions.
                </p>
                <div className="bg-white/10 backdrop-blur p-8 rounded-2xl mb-10 border border-white/20">
                  <div className="text-sm text-emerald-300 uppercase font-bold tracking-widest mb-1">Exit Value</div>
                  <div className="text-5xl font-mono text-white font-bold">${(metrics.valuation / 1000000000).toFixed(1)}B</div>
                </div>
                <button 
                  onClick={() => window.location.reload()}
                  className="px-10 py-4 bg-white text-emerald-900 hover:bg-gray-100 rounded-xl font-bold text-lg transition-transform hover:scale-105 shadow-xl"
                >
                  Start New Tenure
                </button>
              </div>
            )}

            {/* Quarter Summary */}
            {gameState === GameState.QUARTER_SUMMARY && (
              <QuarterlyReport 
                metrics={metrics} 
                history={history} 
                quarter={quarter} 
                onContinue={startNextQuarter} 
              />
            )}

            {/* Scenario View */}
            {gameState === GameState.PLAYING && currentScenario && (
              <ScenarioView 
                scenario={currentScenario} 
                onDecision={handleDecision}
                loading={loading}
              />
            )}

          </main>
        </>
      )}
    </div>
  );
}

export default App;