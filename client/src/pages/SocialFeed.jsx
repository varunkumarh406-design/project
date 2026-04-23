import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getFeed, createPost } from '../services/socialService';
import { setFeed, addPost, setLoading } from '../store/socialSlice';
import PostCard from '../components/social/PostCard';
import Navbar from '../components/Navbar';
import { Send, Image as ImageIcon, AtSign, TrendingUp } from 'lucide-react';

const SocialFeed = () => {
  const dispatch = useDispatch();
  const { feed, loading } = useSelector(state => state.social);
  const [postBody, setPostBody] = useState('');
  const [ticker, setTicker] = useState('');

  useEffect(() => {
    const fetch = async () => {
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
    fetch();
  }, [dispatch]);

  const handlePost = async (e) => {
    e.preventDefault();
    if (!postBody.trim()) return;
    try {
      const { data } = await createPost({ body: postBody, ticker });
      dispatch(addPost(data));
      setPostBody('');
      setTicker('');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-28 pb-12">
      <Navbar />

      <div className="max-w-2xl mx-auto px-4">
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
            
            <div className="flex items-center justify-between mt-6 pt-6 border-t border-slate-100">
              <div className="flex items-center space-x-2 bg-slate-50 px-4 py-2 rounded-xl border border-slate-100">
                <AtSign size={16} className="text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Ticker (e.g. AAPL)" 
                  className="bg-transparent border-none focus:ring-0 text-xs font-bold text-slate-600 w-24 p-0 uppercase" 
                  value={ticker}
                  onChange={(e) => setTicker(e.target.value.toUpperCase())}
                />
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

        {/* Feed */}
        <div className="space-y-8">
          {loading ? (
            <div className="text-center py-20">
               <div className="animate-spin w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
               <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Loading Live Feed</p>
            </div>
          ) : (
            feed.map(post => (
              <PostCard key={post._id} post={post} />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default SocialFeed;
