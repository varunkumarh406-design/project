import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getFeed, createPost } from '../services/socialService';
import { setFeed, addPost, setLoading } from '../store/socialSlice';
import PostCard from '../components/social/PostCard';
import Navbar from '../components/Navbar';
import { Send, Image as ImageIcon, AtSign } from 'lucide-react';

const SocialFeed = () => {
  const dispatch = useDispatch();
  const { feed, loading } = useSelector(state => state.social);
  const [postBody, setPostBody] = useState('');
  const [ticker, setTicker] = useState('');

  useEffect(() => {
    const fetch = async () => {
      dispatch(setLoading(true));
      const { data } = await getFeed(1);
      dispatch(setFeed(data));
      dispatch(setLoading(false));
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
    <div className="min-h-screen bg-background pt-24 pb-12">
      <Navbar />

      <div className="max-w-2xl mx-auto px-4">
        {/* Create Post */}
        <div className="glass-card rounded-3xl p-6 mb-8 border-primary/20 bg-primary/5">
          <form onSubmit={handlePost}>
            <textarea 
              placeholder="What's your market take?" 
              className="w-full bg-transparent border-none focus:ring-0 text-white placeholder-secondary resize-none text-lg"
              rows="3"
              value={postBody}
              onChange={(e) => setPostBody(e.target.value)}
            />
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
              <div className="flex space-x-4 text-secondary">
                <button type="button" className="hover:text-primary transition-colors"><ImageIcon size={20} /></button>
                <div className="flex items-center space-x-1 hover:text-primary transition-colors">
                  <AtSign size={18} />
                  <input 
                    type="text" 
                    placeholder="Ticker" 
                    className="bg-transparent border-none focus:ring-0 text-xs w-16 p-0" 
                    value={ticker}
                    onChange={(e) => setTicker(e.target.value.toUpperCase())}
                  />
                </div>
              </div>
              <button 
                type="submit" 
                className="bg-primary hover:bg-blue-600 text-white px-6 py-2 rounded-xl font-bold flex items-center space-x-2 transition-all"
              >
                <span>Post</span>
                <Send size={16} />
              </button>
            </div>
          </form>
        </div>

        {/* Feed */}
        <div className="space-y-6">
          {loading ? (
            <div className="text-center py-12 text-secondary">Analyzing market sentiment...</div>
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
