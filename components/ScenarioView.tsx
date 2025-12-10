import React, { useState } from 'react';
import { Scenario, DecisionOption } from '../types';
import { IconBriefcase } from './ui/Icons';

interface ScenarioViewProps {
  scenario: Scenario;
  onDecision: (option: DecisionOption) => void;
  loading: boolean;
}

const ScenarioView: React.FC<ScenarioViewProps> = ({ scenario, onDecision, loading }) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleSelect = (option: DecisionOption) => {
    setSelectedId(option.id);
    setTimeout(() => {
      onDecision(option);
      setSelectedId(null);
    }, 400);
  };

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 z-10">
        <div className="bg-white/80 backdrop-blur-md p-8 rounded-2xl shadow-xl w-full max-w-2xl animate-pulse">
           <div className="h-6 bg-gray-200 rounded w-1/3 mb-6"></div>
           <div className="h-4 bg-gray-200 rounded w-full mb-3"></div>
           <div className="h-4 bg-gray-200 rounded w-5/6 mb-8"></div>
           <div className="space-y-4">
             <div className="h-20 bg-gray-100 rounded-xl"></div>
             <div className="h-20 bg-gray-100 rounded-xl"></div>
             <div className="h-20 bg-gray-100 rounded-xl"></div>
           </div>
           <div className="mt-6 text-center text-gray-500 font-medium flex items-center justify-center gap-2">
             <span className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce"></span>
             <span>Analyzing market conditions...</span>
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 lg:p-12 overflow-y-auto z-10">
      <div className="w-full max-w-3xl animate-slideIn perspective-1000">
        
        {/* Scenario Card */}
        <div className="bg-white/95 backdrop-blur shadow-2xl rounded-2xl overflow-hidden border border-white/50">
          
          {/* Header */}
          <div className="p-8 border-b border-gray-100">
             <div className="flex items-center justify-between mb-4">
               <span className="px-3 py-1 rounded-full text-xs font-bold tracking-wide bg-indigo-100 text-indigo-800 uppercase shadow-sm">
                 {scenario.category} Event
               </span>
               <div className="text-xs text-gray-400 font-bold uppercase tracking-wider">Decision Required</div>
             </div>
             <h1 className="text-3xl font-extrabold text-gray-900 mb-4 leading-tight">
               {scenario.title}
             </h1>
             <p className="text-lg text-gray-600 leading-relaxed">
               {scenario.description}
             </p>
          </div>

          {/* Options */}
          <div className="p-6 bg-gray-50/50 grid gap-4">
            {scenario.options.map((option) => (
              <button
                key={option.id}
                onClick={() => handleSelect(option)}
                disabled={selectedId !== null}
                className={`
                  relative group flex flex-col text-left p-5 rounded-xl border-2 transition-all duration-300 transform
                  ${selectedId === option.id 
                    ? 'border-indigo-600 bg-indigo-50 ring-2 ring-indigo-200 scale-95' 
                    : 'border-white bg-white shadow-sm hover:border-indigo-400 hover:shadow-lg hover:-translate-y-1'
                  }
                  ${selectedId !== null && selectedId !== option.id ? 'opacity-40 blur-[1px]' : 'opacity-100'}
                `}
              >
                <div className="flex items-start gap-4">
                  <div className={`
                    flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors
                    ${selectedId === option.id ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-500 group-hover:bg-indigo-100 group-hover:text-indigo-600'}
                  `}>
                    {option.id.replace('opt', '')}
                  </div>
                  <div>
                    <h3 className={`font-bold text-lg mb-1 ${selectedId === option.id ? 'text-indigo-900' : 'text-gray-900'}`}>
                      {option.text}
                    </h3>
                    {option.description && (
                      <p className="text-sm text-gray-500">{option.description}</p>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default ScenarioView;