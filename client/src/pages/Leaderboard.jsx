import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import * as api from '../api/api';
import { Trophy, Medal, TrendingUp, ChevronRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Leaderboard = () => {
  const [traders, setTraders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user: currentUser } = useAuth();

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const { data } = await api.getLeaderboard();
        setTraders(data);
      } catch (error) {
        console.error('Failed to fetch leaderboard:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  return (
    <div className="min-h-screen bg-background pt-24 pb-12">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4 drop-shadow-[0_0_15px_rgba(234,179,8,0.5)]" />
          <h1 className="text-4xl font-bold mb-2">Global Leaderboard</h1>
          <p className="text-secondary">The world's top performing social traders</p>
        </div>

        <div className="glass-card rounded-3xl overflow-hidden shadow-2xl">
          <div className="grid grid-cols-12 gap-4 px-8 py-4 bg-white/5 border-b border-border text-xs font-bold uppercase tracking-widest text-secondary">
            <div className="col-span-1">Rank</div>
            <div className="col-span-6">Trader</div>
            <div className="col-span-2 text-right">Volume</div>
            <div className="col-span-3 text-right">Profit</div>
          </div>

          <div className="divide-y divide-border/50">
            {loading ? (
              <div className="p-12 text-center text-secondary">Loading champions...</div>
            ) : (
              traders.map((trader, idx) => (
                <div 
                  key={trader._id} 
                  className={`grid grid-cols-12 gap-4 px-8 py-6 items-center transition-all hover:bg-white/5 ${trader._id === currentUser?._id ? 'bg-primary/5' : ''}`}
                >
                  <div className="col-span-1 font-bold text-lg">
                    {idx === 0 ? <Medal className="text-yellow-500" /> : idx === 1 ? <Medal className="text-slate-400" /> : idx === 2 ? <Medal className="text-amber-600" /> : idx + 1}
                  </div>
                  <div className="col-span-6 flex items-center space-x-4">
                    <img src={trader.avatar} alt={trader.name} className="w-10 h-10 rounded-full border border-border" />
                    <div>
                      <h4 className="font-bold text-white">{trader.name}</h4>
                      <p className="text-xs text-secondary">{trader.tradeCount} Trades</p>
                    </div>
                  </div>
                  <div className="col-span-2 text-right font-medium text-secondary">
                    ${trader.volume.toLocaleString()}
                  </div>
                  <div className="col-span-3 text-right">
                    <div className="flex items-center justify-end space-x-1 text-success font-bold text-lg">
                      <TrendingUp size={16} />
                      <span>${trader.profit.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
