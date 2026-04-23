import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getFeed, createPost } from '../services/socialService';
import { setFeed, addPost, setLoading } from '../store/socialSlice';
import PostCard from '../components/social/PostCard';
import Navbar from '../components/Navbar';
import { Send, Image as ImageIcon, AtSign, TrendingUp, X } from 'lucide-react';
import { clsx } from 'clsx';

const SocialFeed = () => {
  const dispatch = useDispatch();
  const { feed, loading } = useSelector(state => state.social);
  const [postBody, setPostBody] = useState('');
  const [ticker, setTicker] = useState('');
  const [image, setImage] = useState(null);

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
    // Simulate attaching a chart screenshot
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

        {/* Feed */}
        <div className="space-y-8">
          {loading ? (
            <div className="text-center py-20">
               <div className="animate-spin w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
               <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Loading Live Feed</p>
            </div>
          ) : (
            feed.length > 0 ? (
              feed.map(post => (
                <PostCard key={post._id} post={post} />
              ))
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
    </div>
  );
};

export default SocialFeed;
