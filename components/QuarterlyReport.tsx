import React from 'react';
import { CompanyMetrics, LogEntry } from '../types';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Tooltip, ResponsiveContainer } from 'recharts';

interface QuarterlyReportProps {
  metrics: CompanyMetrics;
  history: LogEntry[];
  quarter: number;
  onContinue: () => void;
}

const QuarterlyReport: React.FC<QuarterlyReportProps> = ({ metrics, history, quarter, onContinue }) => {
  // Filter history for this quarter (4 weeks)
  const quarterStartTurn = (quarter - 1) * 4;
  const quarterHistory = history.filter(h => h.turn > quarterStartTurn);

  const radarData = [
    { subject: 'Finance', A: Math.min(100, metrics.cash / 10000), fullMark: 100 }, 
    { subject: 'Morale', A: metrics.morale, fullMark: 100 },
    { subject: 'CSAT', A: metrics.customerSatisfaction, fullMark: 100 },
    { subject: 'Market', A: metrics.marketShare, fullMark: 100 },
    { subject: 'Safety', A: 100 - metrics.risk, fullMark: 100 },
  ];

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 z-20 animate-popup">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full overflow-hidden border-4 border-indigo-600">
        <div className="bg-indigo-900 p-8 text-white text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
          <h2 className="text-4xl font-black mb-2 relative z-10">Q{quarter} Board Review</h2>
          <p className="opacity-80 relative z-10 font-medium">Performance Evaluation</p>
        </div>

        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8 bg-white">
          
          {/* Left Column: Stats */}
          <div>
            <div className="grid grid-cols-2 gap-4 mb-6">
               <div className="bg-gray-50 p-4 rounded-lg text-center">
                 <div className="text-gray-500 text-xs font-bold uppercase">Ending Cash</div>
                 <div className="text-xl font-black text-gray-800">${metrics.cash.toLocaleString()}</div>
               </div>
               <div className="bg-gray-50 p-4 rounded-lg text-center">
                 <div className="text-gray-500 text-xs font-bold uppercase">Valuation</div>
                 <div className="text-xl font-black text-indigo-600">${(metrics.valuation / 1000000).toFixed(1)}M</div>
               </div>
            </div>

            <div className="mt-4">
              <h4 className="font-bold text-gray-900 mb-3 border-b pb-2">Key Decisions</h4>
              <ul className="text-sm text-gray-600 space-y-3">
                {quarterHistory.map((entry, i) => (
                  <li key={i} className="flex items-start gap-3 bg-gray-50 p-3 rounded-lg">
                    <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center flex-shrink-0 text-xs font-bold">
                      {i + 1}
                    </div>
                    <span>
                      <span className="font-semibold block text-gray-800">{entry.scenarioTitle}</span>
                      <span className="italic">"{entry.decisionText}"</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right Column: Radar Chart */}
          <div className="flex flex-col items-center justify-center h-80 bg-gray-50 rounded-xl p-4">
            <h3 className="text-xs uppercase font-bold text-gray-500 mb-4 tracking-widest">Balanced Scorecard</h3>
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" tick={{fill: '#6b7280', fontSize: 12, fontWeight: 'bold'}} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                <Radar
                  name="Score"
                  dataKey="A"
                  stroke="#4f46e5"
                  strokeWidth={3}
                  fill="#4f46e5"
                  fillOpacity={0.4}
                />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </div>

        </div>

        <div className="p-6 bg-gray-50 border-t flex justify-end gap-4">
           <div className="flex-1 flex items-center text-sm text-gray-500 italic">
              {12 - quarter} quarters remaining until IPO target.
           </div>
          <button 
            onClick={onContinue}
            className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-all shadow-lg hover:scale-105 active:scale-95"
          >
            Start Quarter {quarter + 1} →
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuarterlyReport;