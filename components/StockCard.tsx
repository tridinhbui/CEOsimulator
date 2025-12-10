import React, { useState } from 'react';
import { IconTrendingUp, IconTrendingDown, IconDollar } from './ui/Icons';

interface StockCardProps {
  price: number;
  sharesOwned: number;
  cash: number;
  onBuy: (amount: number) => void;
  onSell: (amount: number) => void;
}

const StockCard: React.FC<StockCardProps> = ({ price, sharesOwned, cash, onBuy, onSell }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mode, setMode] = useState<'buy' | 'sell'>('buy');
  const [amount, setAmount] = useState<string>('');

  const handleOpen = (transactionMode: 'buy' | 'sell') => {
    setMode(transactionMode);
    setAmount('');
    setIsModalOpen(true);
  };

  const handleConfirm = () => {
    const qty = parseInt(amount, 10);
    if (!qty || qty <= 0) return;

    if (mode === 'buy') {
      onBuy(qty);
    } else {
      onSell(qty);
    }
    setIsModalOpen(false);
  };

  const maxBuy = Math.floor(cash / price);
  const maxSell = sharesOwned;
  const totalValue = sharesOwned * price;

  return (
    <div className="bg-white p-4 rounded-xl shadow-md border border-gray-100 mb-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-gray-500 text-xs font-bold uppercase tracking-wider">Treasury Investments</h3>
          <div className="text-sm text-indigo-600 font-bold">Tech Index ETF</div>
        </div>
        <div className={`flex items-center gap-1 font-bold ${price >= 100 ? 'text-green-600' : 'text-red-500'}`}>
          {price >= 100 ? <IconTrendingUp className="w-4 h-4" /> : <IconTrendingDown className="w-4 h-4" />}
          ${price.toFixed(2)}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-gray-50 p-2 rounded-lg">
           <div className="text-xs text-gray-400">Shares</div>
           <div className="font-bold">{sharesOwned}</div>
        </div>
        <div className="bg-gray-50 p-2 rounded-lg">
           <div className="text-xs text-gray-400">Value</div>
           <div className="font-bold">${totalValue.toLocaleString()}</div>
        </div>
      </div>

      <div className="flex gap-2">
        <button 
          onClick={() => handleOpen('buy')}
          className="flex-1 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-bold transition-colors"
        >
          Buy
        </button>
        <button 
          onClick={() => handleOpen('sell')}
          disabled={sharesOwned <= 0}
          className="flex-1 py-2 bg-red-500 hover:bg-red-600 disabled:bg-gray-300 disabled:text-gray-500 text-white rounded-lg text-sm font-bold transition-colors"
        >
          Sell
        </button>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-popup">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden">
            <div className={`p-4 text-white font-bold flex justify-between items-center ${mode === 'buy' ? 'bg-green-600' : 'bg-red-500'}`}>
              <span>{mode === 'buy' ? 'Buy Shares' : 'Sell Shares'}</span>
              <button onClick={() => setIsModalOpen(false)} className="opacity-80 hover:opacity-100">✕</button>
            </div>
            
            <div className="p-6">
              <div className="text-center mb-6">
                 <div className="text-3xl font-black text-gray-800">${price.toFixed(2)}</div>
                 <div className="text-xs text-gray-400 font-bold uppercase">Current Price</div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                   Quantity ({mode === 'buy' ? `Max: ${maxBuy}` : `Max: ${maxSell}`})
                </label>
                <input 
                  type="number" 
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none text-lg font-mono"
                  placeholder="0"
                  min="1"
                  max={mode === 'buy' ? maxBuy : maxSell}
                />
              </div>

              <div className="flex justify-between text-sm text-gray-600 mb-6 font-medium bg-gray-50 p-3 rounded">
                <span>Total {mode === 'buy' ? 'Cost' : 'Proceeds'}:</span>
                <span>${((parseInt(amount) || 0) * price).toLocaleString()}</span>
              </div>

              <div className="flex gap-3">
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-3 text-gray-600 hover:bg-gray-100 rounded-lg font-bold"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleConfirm}
                  disabled={!amount || parseInt(amount) <= 0 || (mode === 'buy' ? parseInt(amount) > maxBuy : parseInt(amount) > maxSell)}
                  className={`flex-1 py-3 text-white rounded-lg font-bold shadow-lg ${
                    mode === 'buy' 
                      ? 'bg-green-600 hover:bg-green-700 disabled:bg-green-300' 
                      : 'bg-red-500 hover:bg-red-600 disabled:bg-red-300'
                  }`}
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StockCard;