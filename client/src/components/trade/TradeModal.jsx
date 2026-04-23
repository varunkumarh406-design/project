import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { buy, sell } from '../../services/tradeService';
import { setPortfolio } from '../../store/tradeSlice';
import { X, TrendingUp, TrendingDown } from 'lucide-react';
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
      // We'd fetch full portfolio here but service returns just trade and balance
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Trade failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
      <div className="glass-card w-full max-w-md rounded-3xl p-8 shadow-2xl">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold">Trade {stock.symbol}</h2>
          <button onClick={onClose} className="text-secondary hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="flex bg-background rounded-2xl p-1 mb-8">
          <button 
            onClick={() => setAction('buy')}
            className={clsx("flex-1 py-3 rounded-xl font-bold transition-all", action === 'buy' ? "bg-primary text-white" : "text-secondary hover:text-white")}
          >BUY</button>
          <button 
            onClick={() => setAction('sell')}
            className={clsx("flex-1 py-3 rounded-xl font-bold transition-all", action === 'sell' ? "bg-danger text-white" : "text-secondary hover:text-white")}
          >SELL</button>
        </div>

        {error && <div className="bg-danger/10 border border-danger/50 text-danger px-4 py-3 rounded-xl mb-6 text-sm">{error}</div>}

        <div className="space-y-6 mb-8">
          <div className="flex justify-between items-center">
            <span className="text-secondary">Current Price</span>
            <span className="font-bold text-white">${stock.price}</span>
          </div>
          <div className="space-y-2">
            <label className="text-xs text-secondary uppercase font-bold tracking-widest">Quantity</label>
            <input 
              type="number" 
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="input-field text-xl font-bold"
            />
          </div>
          <div className="h-px bg-border" />
          <div className="flex justify-between items-center text-lg">
            <span className="text-secondary">Total Cost</span>
            <span className={clsx("font-bold", action === 'buy' ? "text-primary" : "text-success")}>${total}</span>
          </div>
        </div>

        <button 
          onClick={handleTrade}
          disabled={loading}
          className={clsx("w-full py-4 rounded-2xl font-bold text-lg transition-all", action === 'buy' ? "bg-primary hover:bg-blue-600 shadow-[0_0_20px_rgba(59,130,246,0.3)]" : "bg-danger hover:bg-red-600 shadow-[0_0_20px_rgba(239,68,68,0.3)]", "disabled:opacity-50")}
        >
          {loading ? "Processing..." : `Execute ${action.toUpperCase()}`}
        </button>
      </div>
    </div>
  );
};

export default TradeModal;
