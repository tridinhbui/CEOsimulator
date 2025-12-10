import React, { useEffect, useState } from 'react';
import { CompanyMetrics } from '../types';
import { 
  IconUsers, 
  IconDollar, 
  IconRocket, 
  IconHeart,
  IconSmile,
  IconAlert,
  IconTrendingUp,
  IconTrendingDown,
  IconAward
} from './ui/Icons';
import StockCard from './StockCard';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface DashboardProps {
  metrics: CompanyMetrics;
  turn: number;
  quarter: number;
  levelTitle: string;
  stockPrice: number;
  onBuyStock: (amount: number) => void;
  onSellStock: (amount: number) => void;
}

// Hook for counting numbers
const useCounter = (end: number, duration = 1000) => {
  const [count, setCount] = useState(end);

  useEffect(() => {
    let startTimestamp: number | null = null;
    const start = count; // Start from previous value
    
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      setCount(Math.floor(progress * (end - start) + start));
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }, [end]);

  return count;
};

const formatMoney = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 1,
    notation: "compact",
    compactDisplay: "short"
  }).format(amount);
};

// A colorful card for a single big metric
const MetricCard = ({ label, value, icon: Icon, color, subtext, trend }: any) => {
  return (
    <div className={`relative overflow-hidden bg-white p-4 rounded-xl shadow-md border-b-4 ${color.border} transition-transform hover:scale-[1.02]`}>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{label}</p>
          <p className="text-2xl font-black text-gray-800 mt-1">{value}</p>
        </div>
        <div className={`p-2 rounded-lg ${color.bg} ${color.text}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
      {subtext && (
        <div className={`mt-2 text-xs font-semibold flex items-center gap-1 ${trend === 'up' ? 'text-green-500' : trend === 'down' ? 'text-red-500' : 'text-gray-400'}`}>
          {trend === 'up' && <IconTrendingUp className="w-3 h-3" />}
          {trend === 'down' && <IconTrendingDown className="w-3 h-3" />}
          {subtext}
        </div>
      )}
    </div>
  );
};

// Animated progress bar with icon
const StatBar = ({ label, value, icon: Icon, colorClass, barColor }: any) => {
  const displayValue = useCounter(value, 800);
  
  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <Icon className={`w-4 h-4 ${colorClass}`} />
          <span className="text-xs font-bold text-gray-600 uppercase">{label}</span>
        </div>
        <span className={`text-sm font-bold ${colorClass}`}>{Math.round(displayValue)}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden shadow-inner">
        <div 
          className={`h-full rounded-full transition-all duration-700 ease-out ${barColor}`} 
          style={{ width: `${Math.max(5, Math.min(100, displayValue))}%` }}
        >
          <div className="w-full h-full opacity-20 bg-white animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};

const Dashboard: React.FC<DashboardProps> = ({ 
  metrics, 
  turn, 
  quarter, 
  levelTitle,
  stockPrice,
  onBuyStock,
  onSellStock
}) => {
  const profit = metrics.monthlyRevenue - metrics.monthlyBurn;
  const animatedCash = useCounter(metrics.cash);
  const animatedProfit = useCounter(profit);

  return (
    <div className="w-full lg:w-96 flex-shrink-0 bg-gray-50/95 backdrop-blur-md border-r border-gray-200 h-full overflow-y-auto p-4 lg:p-6 custom-scrollbar z-10 shadow-xl">
      
      {/* Header / Avatar Section */}
      <div className="flex items-center gap-4 mb-8 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <div className="w-14 h-14 bg-indigo-100 rounded-full flex items-center justify-center border-2 border-indigo-200">
           <IconAward className="w-8 h-8 text-indigo-600" />
        </div>
        <div>
          <div className="text-xs text-gray-400 font-bold uppercase">Current Role</div>
          <h2 className="text-lg font-black text-gray-900 leading-none">{levelTitle}</h2>
          <div className="text-xs text-indigo-500 font-semibold mt-1">Q{quarter} • Week {turn}</div>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <MetricCard 
          label="Cash Reserves" 
          value={formatMoney(animatedCash)} 
          icon={IconDollar}
          color={{ border: 'border-green-500', bg: 'bg-green-100', text: 'text-green-600' }}
          subtext={metrics.monthlyBurn > 0 ? `${(metrics.cash/metrics.monthlyBurn).toFixed(1)}mo Runway` : 'Safe'}
          trend={metrics.monthlyBurn > metrics.monthlyRevenue ? 'down' : 'up'}
        />
        <MetricCard 
          label="Net Profit" 
          value={formatMoney(animatedProfit)} 
          icon={profit >= 0 ? IconTrendingUp : IconTrendingDown}
          color={{ 
            border: profit >= 0 ? 'border-emerald-500' : 'border-red-500', 
            bg: profit >= 0 ? 'bg-emerald-100' : 'bg-red-100', 
            text: profit >= 0 ? 'text-emerald-600' : 'text-red-600' 
          }}
          subtext={profit >= 0 ? "Profitable" : "Loss"}
          trend={profit >= 0 ? 'up' : 'down'}
        />
      </div>

      {/* Stock Market Card (New) */}
      <StockCard 
        price={stockPrice}
        sharesOwned={metrics.sharesHeld || 0}
        cash={metrics.cash}
        onBuy={onBuyStock}
        onSell={onSellStock}
      />

      <div className="bg-white p-5 rounded-xl shadow-md border border-gray-100 mb-6">
        <div className="flex items-center justify-between mb-4">
           <h3 className="font-bold text-gray-800">Global Metrics</h3>
           <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-bold rounded-full">{metrics.employees.toLocaleString()} Staff</span>
        </div>
        
        <StatBar 
          label="Workforce Morale" 
          value={metrics.morale} 
          icon={IconHeart} 
          colorClass="text-pink-500" 
          barColor="bg-gradient-to-r from-pink-400 to-pink-600" 
        />
        <StatBar 
          label="Brand Reputation" 
          value={metrics.customerSatisfaction} 
          icon={IconSmile} 
          colorClass="text-purple-500" 
          barColor="bg-gradient-to-r from-purple-400 to-purple-600" 
        />
        <StatBar 
          label="Global Market Share" 
          value={metrics.marketShare} 
          icon={IconRocket} 
          colorClass="text-blue-500" 
          barColor="bg-gradient-to-r from-blue-400 to-blue-600" 
        />
        <StatBar 
          label="Supply Chain Risk" 
          value={metrics.risk} 
          icon={IconAlert} 
          colorClass="text-orange-500" 
          barColor="bg-gradient-to-r from-orange-400 to-orange-600" 
        />
      </div>

      <div className="mt-auto text-center opacity-50 text-xs text-gray-500 font-medium">
         Goal: Achieve Global Market Dominance
      </div>
    </div>
  );
};

export default Dashboard;