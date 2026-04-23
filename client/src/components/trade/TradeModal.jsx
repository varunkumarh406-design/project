import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { buy, sell } from '../../services/tradeService';
import { setPortfolio } from '../../store/tradeSlice';
import { X, ArrowRight, Wallet } from 'lucide-react';
import { clsx } from 'clsx';

const TradeModal = ({ stock, onClose }) => {
  const dispatch = useDispatch();
  const [action, setAction] = useState('buy');
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const total = (stock.price * quantity).toFixed(2);

  const handleTrade = async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = action === 'buy' ? await buy(stock.symbol, quantity) : await sell(stock.symbol, quantity);
      dispatch(setPortfolio({ holdings: data.trade, virtualBalance: data.virtualBalance }));
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Trade failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
      <div className="bg-white w-full max-w-md rounded-[3rem] p-10 shadow-2xl border border-slate-100">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-3">
            <div className={clsx("w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-lg", action === 'buy' ? "bg-blue-600 shadow-blue-500/30" : "bg-red-500 shadow-red-500/30")}>
               <Wallet size={20} />
            </div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Trade {stock.symbol}</h2>
          </div>
          <button onClick={onClose} className="w-10 h-10 bg-slate-100 text-slate-400 hover:text-slate-900 rounded-xl transition-all flex items-center justify-center">
            <X size={20} />
          </button>
        </div>

        <div className="flex bg-slate-100 rounded-2xl p-1.5 mb-8">
          <button 
            onClick={() => setAction('buy')}
            className={clsx("flex-1 py-3.5 rounded-xl font-black text-sm transition-all", action === 'buy' ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-900")}
          >BUY</button>
          <button 
            onClick={() => setAction('sell')}
            className={clsx("flex-1 py-3.5 rounded-xl font-black text-sm transition-all", action === 'sell' ? "bg-white text-red-500 shadow-sm" : "text-slate-500 hover:text-slate-900")}
          >SELL</button>
        </div>

        {error && <div className="bg-red-50 border border-red-100 text-red-600 px-6 py-4 rounded-2xl mb-8 text-sm font-medium flex items-center space-x-2">
          <span>{error}</span>
        </div>}

        <div className="space-y-6 mb-10 bg-slate-50 p-8 rounded-[2rem] border border-slate-100">
          <div className="flex justify-between items-center">
            <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">Market Price</span>
            <span className="text-lg font-black text-slate-900">${stock.price}</span>
          </div>
          <div className="space-y-3">
            <label className="text-[10px] text-slate-400 uppercase font-black tracking-widest">Order Quantity</label>
            <input 
              type="number" 
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-2xl py-4 px-6 text-2xl font-black text-slate-900 focus:ring-4 focus:ring-blue-500/5 transition-all"
            />
          </div>
          <div className="h-px bg-slate-200" />
          <div className="flex justify-between items-center">
            <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">Total Est.</span>
            <span className={clsx("text-2xl font-black", action === 'buy' ? "text-blue-600" : "text-red-500")}>${total}</span>
          </div>
        </div>

        <button 
          onClick={handleTrade}
          disabled={loading}
          className={clsx(
            "w-full py-5 rounded-[2rem] font-black text-lg transition-all flex items-center justify-center space-x-3 shadow-xl", 
            action === 'buy' ? "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/30" : "bg-red-500 hover:bg-red-600 text-white shadow-red-500/30", 
            "disabled:opacity-50"
          )}
        >
          <span>{loading ? "Processing..." : `Execute ${action.toUpperCase()}`}</span>
          {!loading && <ArrowRight size={20} />}
        </button>
      </div>
    </div>
  );
};

export default TradeModal;
