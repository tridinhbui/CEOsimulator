import React from 'react';

interface OfficeBackgroundProps {
  stage: number; // 0=Factory, 1=HighRise, 2=Boardroom, 3=Campus
}

const OfficeBackground: React.FC<OfficeBackgroundProps> = ({ stage }) => {
  // Styles for background gradients
  const bgGradients = [
    "from-slate-800 to-slate-900", // Factory: Industrial dark
    "from-indigo-900 to-slate-800", // High Rise: Corporate Night
    "from-gray-100 to-gray-300",    // Boardroom: Clean, sterile
    "from-blue-200 to-white"    // Global HQ: Bright, expensive
  ];

  return (
    <div className={`fixed inset-0 z-0 transition-colors duration-1000 bg-gradient-to-b ${bgGradients[Math.min(stage, 3)]}`}>
      {/* Decorative elements based on stage */}
      <div className="absolute inset-0 opacity-20 pointer-events-none overflow-hidden">
        
        {/* Stage 0: Factory Floor */}
        {stage === 0 && (
          <>
             {/* Industrial girders */}
            <div className="absolute top-0 left-10 w-4 h-full bg-slate-700"></div>
            <div className="absolute top-0 right-20 w-8 h-full bg-slate-700"></div>
            <div className="absolute top-20 w-full h-8 bg-slate-600 opacity-50"></div>
            {/* Robot arm shapes */}
            <div className="absolute bottom-0 left-1/4 w-32 h-64 bg-orange-600 rounded-t-lg opacity-30"></div>
            <div className="absolute bottom-0 right-1/4 w-32 h-48 bg-orange-600 rounded-t-lg opacity-30"></div>
            {/* Warning stripe */}
            <div className="absolute bottom-0 w-full h-4 bg-[repeating-linear-gradient(45deg,yellow,yellow_10px,black_10px,black_20px)] opacity-50"></div>
          </>
        )}

        {/* Stage 1: High Rise Corporate */}
        {stage === 1 && (
          <>
            <div className="absolute bottom-0 left-0 right-0 h-1/2 flex items-end justify-center gap-2 opacity-50">
              <div className="w-16 h-40 bg-indigo-950"></div>
              <div className="w-20 h-64 bg-indigo-950"></div>
              <div className="w-24 h-52 bg-indigo-950"></div>
              <div className="w-16 h-80 bg-indigo-950"></div>
              <div className="w-32 h-48 bg-indigo-950"></div>
              <div className="w-20 h-60 bg-indigo-950"></div>
            </div>
            {/* Glass reflections */}
            <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-white/5 to-transparent"></div>
          </>
        )}

        {/* Stage 2: Boardroom */}
        {stage === 2 && (
          <>
            <div className="absolute bottom-0 w-full h-1/3 bg-slate-300"></div> {/* Table */}
            <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 bg-white shadow-xl border-4 border-slate-200"></div> {/* Projection Screen */}
            <div className="absolute top-0 right-0 w-1/3 h-full bg-slate-200 opacity-50"></div> {/* Window column */}
          </>
        )}

        {/* Stage 3: Global HQ */}
        {stage === 3 && (
          <>
            <div className="absolute bottom-0 w-full h-24 bg-green-200"></div> {/* Manicured Lawn */}
            <div className="absolute bottom-24 right-10 w-20 h-40 bg-gray-400 rounded-full opacity-50"></div> {/* Art Sculpture */}
            <div className="absolute top-10 left-10 w-24 h-24 bg-yellow-200 rounded-full blur-xl"></div> {/* Sun */}
            <div className="absolute bottom-20 left-1/4 w-96 h-64 bg-white/40 rounded-3xl backdrop-blur-sm border border-white/50"></div> {/* Glass Building */}
            <div className="absolute top-20 right-20 w-96 h-96 border-[40px] border-white/10 rounded-full"></div> {/* Architectural element */}
          </>
        )}
      </div>
    </div>
  );
};

export default OfficeBackground;