import { useState } from 'react';
import { Heart, MessageCircle, Share2, TrendingUp, User } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useDispatch, useSelector } from 'react-redux';
import { toggleLike } from '../../services/socialService';
import { updatePostLikes } from '../../store/socialSlice';
import { clsx } from 'clsx';

const PostCard = ({ post }) => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const [showComments, setShowComments] = useState(false);

  const isLiked = post.likes.includes(user?._id);

  const handleLike = async () => {
    try {
      const { data } = await toggleLike(post._id);
      dispatch(updatePostLikes({ postId: post._id, likes: data }));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="bg-white rounded-[2rem] p-8 shadow-lg shadow-slate-200/40 border border-slate-100 hover:border-blue-500/10 transition-all group">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <img 
            src={post.author.avatar} 
            alt={post.author.name} 
            className="w-12 h-12 rounded-2xl border-2 border-white shadow-sm" 
          />
          <div>
            <h4 className="font-black text-slate-900 group-hover:text-blue-600 transition-colors">{post.author.name}</h4>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{formatDistanceToNow(new Date(post.createdAt))} ago</p>
          </div>
        </div>
        {post.ticker && (
          <div className="bg-blue-50 text-blue-600 px-4 py-1.5 rounded-xl text-xs font-black border border-blue-100 flex items-center space-x-1">
            <TrendingUp size={14} />
            <span>${post.ticker}</span>
          </div>
        )}
      </div>

      <p className="text-slate-600 mb-8 leading-relaxed font-medium text-lg">{post.body}</p>

      <div className="flex items-center space-x-8 pt-6 border-t border-slate-50">
        <button 
          onClick={handleLike}
          className={clsx(
            "flex items-center space-x-2.5 transition-all font-bold text-sm", 
            isLiked ? "text-red-500" : "text-slate-400 hover:text-red-500"
          )}
        >
          <div className={clsx("p-2 rounded-xl transition-all", isLiked ? "bg-red-50" : "bg-slate-50 group-hover:bg-red-50/50")}>
            <Heart size={20} fill={isLiked ? "currentColor" : "none"} />
          </div>
          <span>{post.likes.length}</span>
        </button>

        <button 
          onClick={() => setShowComments(!showComments)}
          className="flex items-center space-x-2.5 text-slate-400 hover:text-blue-600 transition-all font-bold text-sm group/btn"
        >
          <div className="p-2 bg-slate-50 group-hover/btn:bg-blue-50 rounded-xl transition-all">
            <MessageCircle size={20} />
          </div>
          <span>Analyze</span>
        </button>

        <button className="flex items-center space-x-2.5 text-slate-400 hover:text-slate-900 transition-all ml-auto group/btn">
          <div className="p-2 bg-slate-50 group-hover/btn:bg-slate-100 rounded-xl transition-all">
            <Share2 size={20} />
          </div>
        </button>
      </div>
    </div>
  );
};

export default PostCard;
