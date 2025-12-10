import React from 'react';
import { IconBuilding } from './ui/Icons';

interface IntroModalProps {
  onStart: () => void;
}

const IntroModal: React.FC<IntroModalProps> = ({ onStart }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/90 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8 text-center border-t-8 border-indigo-600">
        <div className="mx-auto w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-6">
          <IconBuilding className="w-8 h-8 text-indigo-600" />
        </div>
        
        <h1 className="text-4xl font-extrabold text-gray-900 mb-2">Titan Industries</h1>
        <p className="text-xl text-gray-500 font-light mb-8">Fortune 500 CEO Simulator</p>
        
        <div className="text-left bg-gray-50 p-6 rounded-lg mb-8 border border-gray-100">
          <h3 className="font-bold text-gray-900 mb-2">Your Mandate:</h3>
          <p className="text-gray-600 mb-4">
            You have been appointed CEO of Titan Industries, a global manufacturing conglomerate with 80,000 employees.
          </p>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-center gap-2">✅ Manage global supply chains and mega-factories.</li>
            <li className="flex items-center gap-2">✅ Negotiate with unions and navigate geopolitics.</li>
            <li className="flex items-center gap-2">✅ Maintain a $45 Billion valuation.</li>
          </ul>
        </div>

        <button 
          onClick={onStart}
          className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-lg transition-all transform hover:scale-[1.02] shadow-xl"
        >
          Take the Helm
        </button>
      </div>
    </div>
  );
};

export default IntroModal;