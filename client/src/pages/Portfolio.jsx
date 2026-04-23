import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getPortfolio } from '../services/tradeService';
import { setPortfolio, setLoading } from '../store/tradeSlice';
import Navbar from '../components/Navbar';
import { Wallet, TrendingUp, TrendingDown, Briefcase } from 'lucide-react';
import { clsx } from 'clsx';

const Portfolio = () => {
  const dispatch = useDispatch();
  const { holdings, virtualBalance, loading } = useSelector(state => state.trade);

  useEffect(() => {
    const fetch = async () => {
      dispatch(setLoading(true));
      const { data } = await getPortfolio();
      dispatch(setPortfolio(data));
      dispatch(setLoading(false));
    };
    fetch();
  }, [dispatch]);

  const totalHoldingsValue = holdings.reduce((acc, h) => acc + h.value, 0);
  const totalValue = virtualBalance + totalHoldingsValue;
  const totalPnl = holdings.reduce((acc, h) => acc + h.pnl, 0);

  return (
    <div className="min-h-screen bg-background pt-24 pb-12">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4">
        {/* Header Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="glass-card rounded-3xl p-8 bg-primary/5 border-primary/20">
            <div className="flex items-center space-x-3 text-secondary mb-4">
              <Wallet size={20} />
              <span className="text-xs font-bold uppercase tracking-widest">Total Net Worth</span>
            </div>
            <h2 className="text-4xl font-black text-white">${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}</h2>
          </div>

          <div className="glass-card rounded-3xl p-8">
            <div className="flex items-center space-x-3 text-secondary mb-4">
              <Briefcase size={20} />
              <span className="text-xs font-bold uppercase tracking-widest">Virtual Balance</span>
            </div>
            <h2 className="text-4xl font-black text-white">${virtualBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}</h2>
          </div>

          <div className="glass-card rounded-3xl p-8">
            <div className="flex items-center space-x-3 text-secondary mb-4">
              {totalPnl >= 0 ? <TrendingUp size={20} className="text-success" /> : <TrendingDown size={20} className="text-danger" />}
              <span className="text-xs font-bold uppercase tracking-widest">Total Profit/Loss</span>
            </div>
            <h2 className={clsx("text-4xl font-black", totalPnl >= 0 ? "text-success" : "text-danger")}>
              {totalPnl >= 0 ? '+' : ''}${Math.abs(totalPnl).toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </h2>
          </div>
        </div>

        {/* Portfolio Table */}
        <div className="glass-card rounded-3xl overflow-hidden">
          <div className="p-8 border-b border-border">
            <h3 className="text-xl font-bold">Active Holdings</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-secondary text-xs uppercase tracking-widest border-b border-border/50">
                  <th className="px-8 py-6 font-bold">Asset</th>
                  <th className="px-8 py-6 font-bold">Shares</th>
                  <th className="px-8 py-6 font-bold">Avg Cost</th>
                  <th className="px-8 py-6 font-bold">Market Price</th>
                  <th className="px-8 py-6 font-bold text-right">P&L</th>
                </tr>
              </thead>
              <tbody>
                {holdings.map((h) => (
                  <tr key={h.ticker} className="border-b border-border/30 hover:bg-white/5 transition-colors">
                    <td className="px-8 py-6">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center font-bold text-primary text-xs">
                          {h.ticker[0]}
                        </div>
                        <span className="font-bold text-white">{h.ticker}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6 font-medium text-secondary">{h.shares}</td>
                    <td className="px-8 py-6 font-medium text-secondary">${h.avgBuyPrice.toFixed(2)}</td>
                    <td className="px-8 py-6 font-bold text-white">${h.currentPrice.toFixed(2)}</td>
                    <td className={clsx("px-8 py-6 font-black text-right", h.pnl >= 0 ? "text-success" : "text-danger")}>
                      {h.pnl >= 0 ? '+' : ''}{h.pnl.toFixed(2)}
                    </td>
                  </tr>
                ))}
                {holdings.length === 0 && (
                  <tr>
                    <td colSpan="5" className="px-8 py-20 text-center text-secondary font-medium">Your portfolio is currently empty. Start trading to see your holdings here!</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Portfolio;
