import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getPortfolio } from '../services/tradeService';
import { setPortfolio, setLoading } from '../store/tradeSlice';
import Navbar from '../components/Navbar';
import { Wallet, TrendingUp, TrendingDown, Briefcase, History } from 'lucide-react';
import { clsx } from 'clsx';
import { formatDisplaySymbol } from '../utils/symbolUtils';

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
  const totalSharesPurchased = holdings.reduce((acc, h) => acc + h.shares, 0); // Simplified for active

  return (
    <div className="min-h-screen bg-background pt-24 pb-12">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4">
        {/* Header Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="glass-card rounded-3xl p-8 bg-blue-600 border-none shadow-xl shadow-blue-500/20">
            <div className="flex items-center space-x-3 text-blue-100 mb-4">
              <Wallet size={20} />
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">Net Worth</span>
            </div>
            <h2 className="text-3xl font-black text-white">₹{totalValue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</h2>
          </div>

          <div className="glass-card rounded-3xl p-8 bg-white border-slate-100 shadow-sm">
            <div className="flex items-center space-x-3 text-slate-400 mb-4">
              <Briefcase size={20} />
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">Balance</span>
            </div>
            <h2 className="text-3xl font-black text-slate-900">₹{(virtualBalance || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</h2>
          </div>

          <div className="glass-card rounded-3xl p-8 bg-white border-slate-100 shadow-sm">
            <div className="flex items-center space-x-3 text-slate-400 mb-4">
              <TrendingUp size={20} className="text-blue-600" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">Active Shares</span>
            </div>
            <h2 className="text-3xl font-black text-slate-900">{totalSharesPurchased}</h2>
          </div>

          <div className="glass-card rounded-3xl p-8 bg-white border-slate-100 shadow-sm">
            <div className="flex items-center space-x-3 text-slate-400 mb-4">
              {totalPnl >= 0 ? <TrendingUp size={20} className="text-emerald-500" /> : <TrendingDown size={20} className="text-red-500" />}
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">Total P&L</span>
            </div>
            <h2 className={clsx("text-3xl font-black", totalPnl >= 0 ? "text-emerald-500" : "text-red-500")}>
              {totalPnl >= 0 ? '+' : ''}₹{Math.abs(totalPnl).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
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
                  <th className="px-8 py-6 font-bold">Invested</th>
                  <th className="px-8 py-6 font-bold">Market Price</th>
                  <th className="px-8 py-6 font-bold text-right">P&L</th>
                </tr>
              </thead>
              <tbody>
                {holdings.map((h) => (
                  <tr key={h.ticker} className="border-b border-border/30 hover:bg-white/5 transition-colors">
                    <td className="px-8 py-6">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center font-black text-blue-600 text-xs border border-slate-100 shadow-sm">
                          {h.ticker[0]}
                        </div>
                        <div>
                          <span className="font-black text-slate-900 block">{formatDisplaySymbol(h.ticker)}</span>
                          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{h.ticker}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6 font-bold text-slate-600">{h.shares}</td>
                    <td className="px-8 py-6 font-bold text-slate-600">₹{h.avgBuyPrice.toFixed(2)}</td>
                    <td className="px-8 py-6 font-black text-blue-600">₹{(h.shares * h.avgBuyPrice).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                    <td className="px-8 py-6 font-black text-slate-900">₹{(h.currentPrice || 0).toFixed(2)}</td>
                    <td className={clsx("px-8 py-6 font-black text-right", h.pnl >= 0 ? "text-emerald-500" : "text-red-500")}>
                      {h.pnl >= 0 ? '+' : ''}{h.pnl.toFixed(2)}
                    </td>
                  </tr>
                ))}
                {holdings.length === 0 && (
                  <tr>
                    <td colSpan="6" className="px-8 py-20 text-center text-slate-400 font-medium">Your portfolio is currently empty. Start trading to see your holdings here!</td>
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
