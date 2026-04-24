import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { getFeed, createPost } from '../services/socialService';
import { searchUsers, followUser, getSuggestions } from '../services/userService';
import { setFeed, addPost, setLoading } from '../store/socialSlice';
import PostCard from '../components/social/PostCard';
import Navbar from '../components/Navbar';
import Skeleton from '../components/Skeleton';
import { Send, Image as ImageIcon, AtSign, TrendingUp, X, Search, UserPlus, Users as UsersIcon } from 'lucide-react';
import { clsx } from 'clsx';

const SocialFeed = () => {
  const dispatch = useDispatch();
  const { feed, loading } = useSelector(state => state.social);
  const { user: currentUser } = useSelector(state => state.auth);
  const [postBody, setPostBody] = useState('');
  const [ticker, setTicker] = useState('');
  const [image, setImage] = useState(null);
  
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [userSearchResults, setUserSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    fetchFeed();
    fetchSuggestions();
  }, [dispatch]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (userSearchQuery.trim()) {
        handleUserSearch();
      } else {
        setUserSearchResults([]);
      }
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [userSearchQuery]);

  const fetchFeed = async () => {
    dispatch(setLoading(true));
    try {
      const { data } = await getFeed(1);
      dispatch(setFeed(data));
    } catch (err) {
      console.error(err);
    } finally {
      dispatch(setLoading(false));
    }
  };

  const fetchSuggestions = async () => {
    try {
      const { data } = await getSuggestions();
      setSuggestions(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleUserSearch = async () => {
    setSearchLoading(true);
    try {
      const { data } = await searchUsers(userSearchQuery);
      setUserSearchResults(data);
    } catch (err) {
      console.error(err);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleFollow = async (userId) => {
    try {
      await followUser(userId);
      fetchSuggestions();
      if (userSearchQuery) handleUserSearch();
    } catch (err) {
      console.error(err);
    }
  };

  const handlePost = async (e) => {
    e.preventDefault();
    if (!postBody.trim()) return;
    try {
      const { data } = await createPost({ body: postBody, ticker, image });
      dispatch(addPost(data));
      setPostBody('');
      setTicker('');
      setImage(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddChart = () => {
    const chartImages = [
      'https://images.unsplash.com/photo-1611974714658-208e9846b403?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1611974714658-208e9846b403?auto=format&fit=crop&w=1200&q=80'
    ];
    setImage(chartImages[Math.floor(Math.random() * chartImages.length)]);
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-28 pb-12">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Feed */}
        <div className="lg:col-span-8">
          {/* Create Post */}
          <div className="bg-white rounded-[2rem] p-8 mb-10 shadow-xl shadow-slate-200/50 border border-slate-100">
            <form onSubmit={handlePost}>
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center">
                  <TrendingUp className="text-blue-600" size={24} />
                </div>
                <textarea 
                  placeholder="Share your market analysis..." 
                  className="flex-1 bg-transparent border-none focus:ring-0 text-slate-900 placeholder-slate-400 resize-none text-lg font-medium pt-2"
                  rows="3"
                  value={postBody}
                  onChange={(e) => setPostBody(e.target.value)}
                />
              </div>
              
              {image && (
                <div className="mt-4 relative group">
                  <img src={image} className="w-full h-48 object-cover rounded-3xl border border-slate-100" alt="Chart preview" />
                  <button 
                    onClick={() => setImage(null)} 
                    className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm p-2 rounded-xl text-slate-400 hover:text-red-500 shadow-sm opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <X size={16} />
                  </button>
                </div>
              )}
              
              <div className="flex items-center justify-between mt-6 pt-6 border-t border-slate-100">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2 bg-slate-50 px-4 py-2 rounded-xl border border-slate-100">
                    <AtSign size={16} className="text-slate-400" />
                    <input 
                      type="text" 
                      placeholder="Ticker" 
                      className="bg-transparent border-none focus:ring-0 text-xs font-bold text-slate-600 w-16 p-0 uppercase" 
                      value={ticker}
                      onChange={(e) => setTicker(e.target.value.toUpperCase())}
                    />
                  </div>
                  
                  <button 
                    type="button"
                    onClick={handleAddChart}
                    className={clsx("p-2.5 rounded-xl transition-all border", image ? "bg-blue-50 border-blue-200 text-blue-600" : "bg-white border-slate-100 text-slate-400 hover:text-blue-600")}
                  >
                    <ImageIcon size={20} />
                  </button>
                </div>
                
                <button 
                  type="submit" 
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-2xl font-black flex items-center space-x-2 transition-all shadow-lg shadow-blue-500/20"
                >
                  <span>Post Trade</span>
                  <Send size={18} />
                </button>
              </div>
            </form>
          </div>

          {/* Feed List */}
          <div className="space-y-8">
            {loading ? (
              [1,2,3].map(i => <Skeleton key={i} className="h-64 w-full rounded-[3rem]" />)
            ) : (
              feed.length > 0 ? (
                feed.map(post => <PostCard key={post._id} post={post} />)
              ) : (
                <div className="text-center py-20 bg-white rounded-[3rem] border border-slate-100 shadow-sm">
                  <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <AtSign className="text-blue-600" size={32} />
                  </div>
                  <h3 className="text-xl font-black text-slate-900 mb-2">No market analysis yet</h3>
                  <p className="text-slate-400 font-medium">Be the first to share a trade or chart with the community!</p>
                </div>
              )
            )}
          </div>
        </div>

        {/* Sidebar: Search & Suggestions */}
        <div className="lg:col-span-4 space-y-8">
          <div className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-slate-200/50 border border-slate-100 sticky top-28">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-black text-slate-900 flex items-center space-x-2">
                <UsersIcon size={24} className="text-blue-600" />
                <span>Search Traders</span>
              </h3>
            </div>

            <div className="relative mb-8">
              <input 
                type="text" 
                placeholder="Find people to follow..." 
                className="w-full bg-slate-50 border-none rounded-2xl py-4 pl-12 pr-4 text-sm font-medium focus:ring-4 focus:ring-blue-500/5 transition-all"
                value={userSearchQuery}
                onChange={(e) => setUserSearchQuery(e.target.value)}
              />
              <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            </div>

            <div className="space-y-6">
              {searchLoading ? (
                [1,2].map(i => <Skeleton key={i} className="h-16 w-full rounded-2xl" />)
              ) : userSearchResults.length > 0 ? (
                userSearchResults.map(u => (
                  <div key={u._id} className="flex items-center justify-between group">
                    <Link to={`/user/${u._id}`} className="flex items-center space-x-4">
                      <img src={u.avatar} className="w-12 h-12 rounded-2xl border-2 border-white shadow-sm" alt={u.name} />
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{u.name}</h4>
                        <p className="text-[10px] text-slate-400 font-medium tracking-tight truncate w-32">{u.bio || 'Trader'}</p>
                      </div>
                    </Link>
                    <button 
                      onClick={() => handleFollow(u._id)}
                      className={clsx(
                        "p-2.5 rounded-xl transition-all shadow-sm",
                        currentUser?.following?.includes(u._id) ? "bg-slate-100 text-slate-400" : "bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white"
                      )}
                    >
                      <UserPlus size={18} />
                    </button>
                  </div>
                ))
              ) : userSearchQuery ? (
                <p className="text-center text-xs text-slate-400 font-bold uppercase tracking-widest py-4">No traders found</p>
              ) : (
                <>
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Recommended for you</h4>
                  {suggestions.map(sug => (
                    <div key={sug._id} className="flex items-center justify-between group">
                      <div className="flex items-center space-x-4">
                        <img src={sug.avatar} className="w-12 h-12 rounded-2xl border-2 border-white shadow-sm" alt={sug.name} />
                        <div>
                          <h4 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{sug.name}</h4>
                          <p className="text-[10px] text-slate-400 font-medium">{sug.followers?.length || 0} followers</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => handleFollow(sug._id)}
                        className="p-2.5 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white rounded-xl transition-all shadow-sm"
                      >
                        <UserPlus size={18} />
                      </button>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SocialFeed;
