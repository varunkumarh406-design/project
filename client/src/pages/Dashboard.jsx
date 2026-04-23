import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getQuote, getHistory, searchStocks, getWatchlist, addToWatchlist } from '../services/stockService';
import { getSuggestions, followUser } from '../services/userService';
import { setSelectedQuote, setHistory, setSearchResults, setWatchlist, setLoading } from '../store/stockSlice';
import TradingViewChart from '../components/charts/TradingViewChart';
import TradeModal from '../components/trade/TradeModal';
import Navbar from '../components/Navbar';
import Skeleton from '../components/Skeleton';
import { Search, Plus, TrendingUp, TrendingDown, Star, Users, ArrowRight, UserPlus, Info } from 'lucide-react';
import { clsx } from 'clsx';
import { useSocket } from '../hooks/useSocket';
import { formatDisplaySymbol } from '../utils/symbolUtils';
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
      try {
        const { data } = await getWatchlist();
        dispatch(setWatchlist(data));
        if (data.length > 0) {
          await handleSelectStock(data[0].symbol);
        }
      } catch (err) {
        console.error(err);
      } finally {
        // Only set loading false if we didn't start handleSelectStock 
        // or if it already finished. handleSelectStock handles its own loading.
      }
    };
    init();
    fetchSuggestions();
  }, [dispatch]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchQuery) {
        handleSearch();
      } else {
        dispatch(setSearchResults([]));
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  useEffect(() => {
    if (!selectedQuote) return;
    const interval = setInterval(() => {
      handleSelectStock(selectedQuote.symbol, true);
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
    if (e) e.preventDefault();
    const query = searchQuery.trim();
    if (!query) return;
    try {
      const { data } = await searchStocks(query);
      dispatch(setSearchResults(data));
    } catch (err) {
      console.error('Search error:', err);
    }
  };

  const handleSelectStock = async (ticker, silent = false) => {
    if (!silent) {
      dispatch(setLoading(true));
      dispatch(setHistory([])); // Clear old chart data immediately
    }
    try {
      // Phase 1: Get Quote (Very fast with caching)
      const { data: quote } = await getQuote(ticker);
      dispatch(setSelectedQuote(quote));
      
      if (!silent) dispatch(setLoading(false)); // Show header and skeletons for chart

      // Phase 2: Get History (Can be slower)
      const { data: hist } = await getHistory(ticker);
      dispatch(setHistory(hist));
    } catch (err) {
      console.error('Error selecting stock:', err);
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
    <div className="min-h-screen bg-slate-50 pt-28 pb-12">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Watchlist */}
        <div className="lg:col-span-3 space-y-6">
          <div className="glass-card rounded-[2rem] p-8">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-bold flex items-center space-x-2">
                <Star size={22} className="text-amber-400 fill-amber-400" />
                <span>Watchlist</span>
              </h3>
              <span className="bg-slate-100 text-slate-500 text-[10px] font-black px-2 py-1 rounded-lg">{watchlist.length}</span>
            </div>
            <div className="space-y-4">
              {loading && watchlist.length === 0 ? (
                [1,2,3,4].map(i => <Skeleton key={i} className="h-16 w-full rounded-2xl" />)
              ) : (
                watchlist.map((stock) => (
                  <div 
                    key={stock.symbol} 
                    onClick={() => handleSelectStock(stock.symbol)}
                    className={clsx(
                      "flex justify-between items-center p-4 rounded-2xl cursor-pointer transition-all border-2",
                      selectedQuote?.symbol === stock.symbol ? "bg-blue-50 border-blue-500/20" : "bg-white border-transparent hover:border-slate-100 hover:bg-slate-50"
                    )}
                  >
                    <div>
                      <h4 className="font-bold text-slate-900">{formatDisplaySymbol(stock.symbol)}</h4>
                      <p className="text-[10px] text-slate-400 font-medium">₹{stock.price}</p>
                    </div>
                    <div className={clsx("text-xs font-black px-2 py-1 rounded-lg", stock.change >= 0 ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600")}>
                      {stock.changePercent}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="glass-card rounded-[2rem] p-8">
            <h3 className="text-lg font-bold mb-6 flex items-center space-x-2">
              <Search size={20} className="text-blue-600" />
              <span>Explore Market</span>
            </h3>
            <form onSubmit={handleSearch} className="relative mb-6">
              <input 
                type="text" 
                placeholder="Ticker (e.g. TCS.NS)" 
                className="w-full bg-slate-50 border-none rounded-2xl py-3.5 px-12 text-sm focus:ring-2 focus:ring-blue-500/20"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            </form>
            <div className="space-y-3 max-h-48 overflow-y-auto mb-6 pr-2">
              {searchResults.length > 0 ? (
                searchResults.map((res) => (
                  <div key={res.symbol} className="flex justify-between items-center p-3 hover:bg-slate-50 rounded-2xl transition-colors group cursor-pointer" onClick={() => handleSelectStock(res.symbol)}>
                    <div>
                      <h5 className="text-xs font-bold text-slate-900">{formatDisplaySymbol(res.symbol)}</h5>
                      <p className="text-[10px] text-slate-400 truncate w-32">{res.name}</p>
                    </div>
                    <button onClick={(e) => { e.stopPropagation(); handleAddToWatchlist(res.symbol); }} className="p-1.5 bg-slate-100 text-slate-400 hover:bg-blue-600 hover:text-white rounded-xl transition-all">
                      <Plus size={16} />
                    </button>
                  </div>
                ))
              ) : searchQuery && (
                <div className="text-center py-4">
                  <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">No symbols found</p>
                </div>
              )}
            </div>

            <div className="pt-6 border-t border-slate-100">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">India NSE Highlights</h4>
              <div className="grid grid-cols-2 gap-3">
                {['TCS.NS', 'RELIANCE.NS', 'INFY.NS', 'HDFCBANK.NS'].map(ticker => (
                  <button 
                    key={ticker}
                    onClick={() => handleAddToWatchlist(ticker)}
                    className="text-[10px] font-bold text-slate-600 bg-slate-50 hover:bg-blue-50 hover:text-blue-600 border border-transparent hover:border-blue-500/10 py-2 px-3 rounded-xl transition-all"
                  >
                    + {ticker.split('.')[0]}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Middle: Chart */}
        <div className="lg:col-span-6 space-y-6">
          {loading ? (
            <div className="glass-card rounded-[2.5rem] p-10 space-y-8">
              <div className="flex justify-between">
                <Skeleton className="h-12 w-48" />
                <Skeleton className="h-12 w-32 rounded-2xl" />
              </div>
              <Skeleton className="h-80 w-full rounded-[2rem]" />
              <div className="grid grid-cols-2 gap-6">
                <Skeleton className="h-32 w-full rounded-[2rem]" />
                <Skeleton className="h-32 w-full rounded-[2rem]" />
              </div>
            </div>
          ) : selectedQuote ? (
            <div className="glass-card rounded-[2.5rem] p-10">
              <div className="flex justify-between items-start mb-10">
                <div>
                  <div className="flex items-center space-x-3 mb-2">
                    <h1 className="text-5xl font-black text-slate-900 tracking-tight">
                      {formatDisplaySymbol(selectedQuote.symbol)}
                    </h1>
                    <span className={clsx("text-sm font-black px-3 py-1 rounded-full", selectedQuote.change >= 0 ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600")}>
                      {selectedQuote.changePercent}
                    </span>
                  </div>
                  <p className="text-lg font-medium text-slate-400 flex items-center space-x-2">
                    <span className="text-slate-900 font-bold">₹{selectedQuote.price}</span>
                    <span className="text-sm">• Market Live</span>
                  </p>
                </div>
                <button 
                  onClick={() => setIsTradeModalOpen(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-2xl font-black text-lg transition-all shadow-xl shadow-blue-500/30"
                >
                  Quick Trade
                </button>
              </div>

              <div className="h-[32rem] w-full mb-12">
                <TradingViewChart symbol={selectedQuote.symbol} />
              </div>

              <div className="pt-10 border-t border-slate-100">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h3 className="text-2xl font-black text-slate-900 flex items-center space-x-3">
                      <Users size={26} className="text-blue-600" />
                      <span>{formatDisplaySymbol(selectedQuote.symbol)} Hub</span>
                    </h3>
                    <p className="text-sm font-medium text-slate-400 mt-1">Join the conversation with 4.2k active traders</p>
                  </div>
                  <div className="flex -space-x-3 group cursor-pointer">
                    {[1,2,3,4].map(i => (
                      <img key={i} src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${formatDisplaySymbol(selectedQuote.symbol)}${i}`} className="w-10 h-10 rounded-full border-4 border-white shadow-sm transition-transform group-hover:translate-x-1" alt="follower" />
                    ))}
                    <div className="w-10 h-10 rounded-full bg-slate-100 border-4 border-white flex items-center justify-center text-[10px] font-black text-slate-500">+2.4k</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6">
                   {[
                    { author: 'TraderX', body: `Looking bullish on ${selectedQuote.symbol}. Support at 150. Target for the week is 185.`, type: 'bullish' },
                    { author: 'MarketGuru', body: `Wait for breakout confirmation on ${selectedQuote.symbol}. RSI is overbought.`, type: 'cautious' }
                  ].map((comment, i) => (
                    <div key={i} className="bg-slate-50/50 rounded-3xl p-6 border border-slate-100 hover:bg-white hover:border-slate-200 transition-all cursor-pointer group">
                       <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-white rounded-xl flex items-center justify-center border border-slate-100 shadow-sm font-black text-[10px] text-blue-600">
                            {comment.author[0]}
                          </div>
                          <span className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">@{comment.author}</span>
                        </div>
                        <span className={clsx("text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest", comment.type === 'bullish' ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600")}>
                          {comment.type}
                        </span>
                      </div>
                      <p className="text-sm text-slate-500 leading-relaxed font-medium">{comment.body}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="glass-card rounded-[3rem] p-24 text-center space-y-6">
              <div className="w-24 h-24 bg-blue-50 rounded-[2rem] flex items-center justify-center mx-auto shadow-inner">
                <TrendingUp size={48} className="text-blue-600" />
              </div>
              <div>
                <h2 className="text-3xl font-black text-slate-900 tracking-tight">Market Intelligence</h2>
                <p className="text-slate-400 max-w-sm mx-auto text-lg mt-2 font-medium">Select a ticker to analyze live charts and community sentiment.</p>
              </div>
              <div className="pt-8 grid grid-cols-3 gap-4 max-w-md mx-auto">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <p className="text-xl font-black text-slate-900">2.4k</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Symbols</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <p className="text-xl font-black text-slate-900">10ms</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Latency</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <p className="text-xl font-black text-slate-900">1M+</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Trades</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right: Who to Follow */}
        <div className="lg:col-span-3 space-y-6">
          <div className="glass-card rounded-[2rem] p-8">
            <h3 className="text-xl font-bold mb-8 flex items-center justify-between">
              <span>Top Traders</span>
              <Info size={18} className="text-slate-300" />
            </h3>
            <div className="space-y-8">
              {suggestionsLoading ? (
                [1,2,3,4].map(i => (
                  <div key={i} className="flex items-center space-x-4">
                    <Skeleton className="h-12 w-12 rounded-2xl" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-3 w-full" />
                    </div>
                  </div>
                ))
              ) : (
                suggestions.map((sug) => (
                  <div key={sug._id} className="flex items-center justify-between group cursor-pointer">
                    <div className="flex items-center space-x-4">
                      <img src={sug.avatar} className="w-14 h-14 rounded-2xl border-4 border-white shadow-md transition-all group-hover:scale-105" alt={sug.name} />
                      <div>
                        <h4 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors tracking-tight">{sug.name}</h4>
                        <p className="text-xs text-slate-400 font-medium">{sug.followers?.length || 0} followers</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleFollow(sug._id)}
                      className="w-10 h-10 bg-slate-50 text-slate-400 hover:bg-blue-600 hover:text-white rounded-xl transition-all flex items-center justify-center shadow-sm"
                    >
                      <UserPlus size={18} />
                    </button>
                  </div>
                ))
              )}
            </div>
            <button className="w-full mt-10 py-4 bg-slate-900 text-white rounded-2xl font-black text-sm flex items-center justify-center space-x-3 hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10">
              <span>Full Leaderboard</span>
              <ArrowRight size={16} />
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
