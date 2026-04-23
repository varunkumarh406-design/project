import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getQuote, getHistory, searchStocks, getWatchlist, addToWatchlist } from '../services/stockService';
import { getSuggestions, followUser } from '../services/userService';
import { setSelectedQuote, setHistory, setSearchResults, setWatchlist, setLoading } from '../store/stockSlice';
import PriceChart from '../components/charts/PriceChart';
import TradeModal from '../components/trade/TradeModal';
import Navbar from '../components/Navbar';
import Skeleton from '../components/Skeleton';
import { Search, Plus, TrendingUp, TrendingDown, Star, Users, ArrowRight, UserPlus } from 'lucide-react';
import { clsx } from 'clsx';
import { useSocket } from '../hooks/useSocket';

const Dashboard = () => {
  const dispatch = useDispatch();
  useSocket(); // Initialize real-time updates
  const { watchlist, selectedQuote, history, searchResults, loading } = useSelector(state => state.stocks);
  const [searchQuery, setSearchQuery] = useState('');
  const [isTradeModalOpen, setIsTradeModalOpen] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [suggestionsLoading, setSuggestionsLoading] = useState(false);

  useEffect(() => {
    const init = async () => {
      dispatch(setLoading(true));
      try {
        const { data } = await getWatchlist();
        dispatch(setWatchlist(data));
        if (data.length > 0) {
          handleSelectStock(data[0].symbol);
        }
      } catch (err) {
        console.error(err);
      } finally {
        dispatch(setLoading(false));
      }
    };
    init();
    fetchSuggestions();
  }, [dispatch]);

  // Auto-refresh chart every 30 seconds
  useEffect(() => {
    if (!selectedQuote) return;
    const interval = setInterval(() => {
      handleSelectStock(selectedQuote.symbol, true); // true for silent refresh
    }, 30000);
    return () => clearInterval(interval);
  }, [selectedQuote]);

  const fetchSuggestions = async () => {
    setSuggestionsLoading(true);
    try {
      const { data } = await getSuggestions();
      setSuggestions(data);
    } catch (err) {
      console.error(err);
    } finally {
      setSuggestionsLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery) return;
    const { data } = await searchStocks(searchQuery);
    dispatch(setSearchResults(data));
  };

  const handleSelectStock = async (ticker, silent = false) => {
    if (!silent) dispatch(setLoading(true));
    try {
      const [{ data: quote }, { data: hist }] = await Promise.all([
        getQuote(ticker),
        getHistory(ticker)
      ]);
      dispatch(setSelectedQuote(quote));
      dispatch(setHistory(hist));
    } catch (err) {
      console.error(err);
    } finally {
      if (!silent) dispatch(setLoading(false));
    }
  };

  const handleAddToWatchlist = async (ticker) => {
    await addToWatchlist(ticker);
    const { data } = await getWatchlist();
    dispatch(setWatchlist(data));
  };

  const handleFollow = async (id) => {
    await followUser(id);
    fetchSuggestions();
  };

  return (
    <div className="min-h-screen bg-background pt-24 pb-12">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Watchlist */}
        <div className="lg:col-span-3 space-y-6">
          <div className="glass-card rounded-2xl p-6">
            <h3 className="text-lg font-bold mb-6 flex items-center space-x-2">
              <Star size={20} className="text-yellow-500 fill-yellow-500" />
              <span>Watchlist</span>
            </h3>
            <div className="space-y-4">
              {loading && watchlist.length === 0 ? (
                [1,2,3].map(i => <Skeleton key={i} className="h-14 w-full" />)
              ) : (
                watchlist.map((stock) => (
                  <div 
                    key={stock.symbol} 
                    onClick={() => handleSelectStock(stock.symbol)}
                    className={clsx(
                      "flex justify-between items-center p-3 rounded-xl cursor-pointer transition-all border border-transparent",
                      selectedQuote?.symbol === stock.symbol ? "bg-primary/10 border-primary/50" : "hover:bg-white/5"
                    )}
                  >
                    <div>
                      <h4 className="font-bold text-sm">{stock.symbol}</h4>
                      <p className="text-[10px] text-secondary">${stock.price}</p>
                    </div>
                    <div className={clsx("text-xs font-bold", stock.change >= 0 ? "text-success" : "text-danger")}>
                      {stock.changePercent}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="glass-card rounded-2xl p-6">
            <h3 className="text-lg font-bold mb-4">Search Market</h3>
            <p className="text-[10px] text-secondary mb-4 italic">Try .NSE for Indian stocks</p>
            <form onSubmit={handleSearch} className="relative mb-4">
              <input 
                type="text" 
                placeholder="Ticker (e.g. AAPL)" 
                className="w-full bg-background border border-border rounded-xl py-2 px-10 text-sm focus:outline-none focus:border-primary"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary" />
            </form>
            <div className="space-y-2 max-h-48 overflow-y-auto mb-4">
              {searchResults.map((res) => (
                <div key={res.symbol} className="flex justify-between items-center p-2 hover:bg-white/5 rounded-lg transition-colors group cursor-pointer" onClick={() => handleSelectStock(res.symbol)}>
                  <div>
                    <h5 className="text-xs font-bold">{res.symbol}</h5>
                    <p className="text-[10px] text-secondary truncate w-32">{res.name}</p>
                  </div>
                  <button onClick={(e) => { e.stopPropagation(); handleAddToWatchlist(res.symbol); }} className="opacity-0 group-hover:opacity-100 text-primary transition-all">
                    <Plus size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Middle: Chart */}
        <div className="lg:col-span-6 space-y-6">
          {loading ? (
            <div className="glass-card rounded-3xl p-8 space-y-6">
              <Skeleton className="h-10 w-48" />
              <Skeleton className="h-80 w-full" />
              <div className="grid grid-cols-2 gap-4">
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
              </div>
            </div>
          ) : selectedQuote ? (
            <div className="glass-card rounded-3xl p-8">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h1 className="text-4xl font-black text-white flex items-center space-x-3">
                    <span>{selectedQuote.symbol}</span>
                    <span className={clsx("text-lg font-bold", selectedQuote.change >= 0 ? "text-success" : "text-danger")}>
                      {selectedQuote.changePercent}
                    </span>
                  </h1>
                  <p className="text-secondary font-medium mt-1">Live Price: <span className="text-white">${selectedQuote.price}</span></p>
                </div>
                <button 
                  onClick={() => setIsTradeModalOpen(true)}
                  className="bg-primary hover:bg-blue-600 text-white px-8 py-3 rounded-2xl font-bold transition-all shadow-[0_0_20px_rgba(59,130,246,0.4)]"
                >
                  Trade
                </button>
              </div>

              <div className="h-80 w-full mb-12">
                <PriceChart data={history} />
              </div>

              <div className="pt-8 border-t border-border">
                <h3 className="text-xl font-bold mb-6 flex items-center space-x-2">
                  <Users size={20} className="text-primary" />
                  <span>{selectedQuote.symbol} Community</span>
                </h3>
                <div className="grid grid-cols-1 gap-4">
                   {[
                    { author: 'TraderX', body: `Looking bullish on ${selectedQuote.symbol}. Support at 150.`, type: 'bullish' },
                    { author: 'MarketGuru', body: `Wait for breakout confirmation on ${selectedQuote.symbol}.`, type: 'bullish' }
                  ].map((comment, i) => (
                    <div key={i} className="bg-white/5 rounded-2xl p-4 border border-border/30">
                       <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-white">@{comment.author}</span>
                        <span className="text-[10px] text-success font-bold uppercase tracking-widest">{comment.type}</span>
                      </div>
                      <p className="text-xs text-secondary">{comment.body}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="glass-card rounded-3xl p-20 text-center space-y-4">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <TrendingUp size={40} className="text-primary" />
              </div>
              <h2 className="text-2xl font-bold">Select a stock to start</h2>
              <p className="text-secondary max-w-xs mx-auto text-sm">Real-time market analysis and social sentiment in one place.</p>
            </div>
          )}
        </div>

        {/* Right: Who to Follow */}
        <div className="lg:col-span-3 space-y-6">
          <div className="glass-card rounded-2xl p-6">
            <h3 className="text-lg font-bold mb-6 flex items-center justify-between">
              <span>Top Traders</span>
              <Users size={18} className="text-secondary" />
            </h3>
            <div className="space-y-6">
              {suggestionsLoading ? (
                [1,2,3].map(i => (
                  <div key={i} className="flex items-center space-x-3">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-3 w-20" />
                      <Skeleton className="h-2 w-full" />
                    </div>
                  </div>
                ))
              ) : (
                suggestions.map((sug) => (
                  <div key={sug._id} className="flex items-center justify-between group">
                    <div className="flex items-center space-x-3">
                      <img src={sug.avatar} className="w-10 h-10 rounded-full border border-border" alt={sug.name} />
                      <div>
                        <h4 className="text-sm font-bold group-hover:text-primary transition-colors">{sug.name}</h4>
                        <p className="text-[10px] text-secondary">{sug.followers?.length || 0} followers</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleFollow(sug._id)}
                      className="p-2 text-secondary hover:text-primary hover:bg-primary/10 rounded-xl transition-all"
                    >
                      <UserPlus size={18} />
                    </button>
                  </div>
                ))
              )}
            </div>
            <button className="w-full mt-8 py-3 text-xs font-bold text-secondary hover:text-white flex items-center justify-center space-x-2 transition-all">
              <span>View Leaderboard</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>

      {isTradeModalOpen && selectedQuote && (
        <TradeModal stock={selectedQuote} onClose={() => setIsTradeModalOpen(false)} />
      )}
    </div>
  );
};

export default Dashboard;
