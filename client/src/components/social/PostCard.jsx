import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, MessageCircle, Share2, TrendingUp, User } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useDispatch, useSelector } from 'react-redux';
import { toggleLike, addComment as submitComment, getComments } from '../../services/socialService';
import { updatePostLikes } from '../../store/socialSlice';
import { clsx } from 'clsx';

const PostCard = ({ post }) => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState([]);
  const [loadingComments, setLoadingComments] = useState(false);

  useEffect(() => {
    if (showComments) {
      fetchComments();
    }
  }, [showComments]);

  const fetchComments = async () => {
    setLoadingComments(true);
    try {
      const { data } = await getComments(post._id);
      setComments(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingComments(false);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    try {
      const { data } = await submitComment(post._id, { body: commentText });
      setComments([...comments, data]);
      setCommentText('');
    } catch (err) {
      console.error(err);
    }
  };

  if (!post || !post.author) return null;

  const isLiked = post.likes?.includes(user?._id) || false;

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
        <Link to={`/user/${post.author._id}`} className="flex items-center space-x-4 group/author">
          <img 
            src={post.author.avatar} 
            alt={post.author.name} 
            className="w-12 h-12 rounded-2xl border-2 border-white shadow-sm group-hover/author:border-blue-500 transition-all" 
          />
          <div>
            <h4 className="font-black text-slate-900 group-hover/author:text-blue-600 transition-colors">{post.author.name}</h4>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{formatDistanceToNow(new Date(post.createdAt))} ago</p>
          </div>
        </Link>
        {post.ticker && (
          <div className="bg-blue-50 text-blue-600 px-4 py-1.5 rounded-xl text-xs font-black border border-blue-100 flex items-center space-x-1">
            <TrendingUp size={14} />
            <span>${post.ticker}</span>
          </div>
        )}
      </div>

      <p className="text-slate-600 mb-6 leading-relaxed font-medium text-lg">{post.body}</p>

      {post.image && (
        <div className="mb-8 rounded-[2rem] overflow-hidden border border-slate-100 shadow-sm">
          <img src={post.image} className="w-full h-auto object-cover max-h-[400px]" alt="Trade screenshot" />
        </div>
      )}

      <div className="flex items-center justify-between pt-6 border-t border-slate-50">
        <div className="flex items-center space-x-6">
          <button 
            onClick={handleLike}
            className={clsx(
              "flex items-center space-x-2 transition-all font-bold text-sm", 
              isLiked ? "text-red-500" : "text-slate-400 hover:text-red-500"
            )}
          >
            <Heart size={20} fill={isLiked ? "currentColor" : "none"} />
            <span>{post.likes?.length || 0}</span>
          </button>

          <button 
            onClick={() => setShowComments(!showComments)}
            className="flex items-center space-x-2 text-slate-400 hover:text-blue-600 transition-all font-bold text-sm"
          >
            <MessageCircle size={20} />
            <span>Comment</span>
          </button>

          <button 
            className="flex items-center space-x-2 text-slate-400 hover:text-amber-500 transition-all font-bold text-sm"
          >
            <TrendingUp size={20} />
            <span>Advice</span>
          </button>
        </div>

        <button className="text-slate-400 hover:text-slate-900 transition-all">
          <Share2 size={20} />
        </button>
      </div>

      {showComments && (
        <div className="mt-8 pt-8 border-t border-slate-50 space-y-6">
          {/* Comment Form */}
          <form onSubmit={handleComment} className="flex items-center space-x-3">
            <img src={user?.avatar} className="w-8 h-8 rounded-xl shadow-sm" alt="My avatar" />
            <input 
              type="text" 
              placeholder="Write a comment..." 
              className="flex-1 bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-blue-500/10 focus:bg-white transition-all outline-none"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
            />
          </form>

          {/* Comments List */}
          <div className="space-y-6 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
            {loadingComments ? (
              <div className="text-center py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest animate-pulse">Loading analysis...</div>
            ) : comments.length > 0 ? (
              comments.map(c => (
                <div key={c._id} className="flex items-start space-x-3 group/comment">
                  <img src={c.author.avatar} className="w-8 h-8 rounded-xl shadow-sm" alt={c.author.name} />
                  <div className="flex-1 bg-slate-50 rounded-2xl p-4 group-hover/comment:bg-slate-100 transition-colors">
                    <div className="flex items-center justify-between mb-1">
                      <h5 className="text-xs font-black text-slate-900">{c.author.name}</h5>
                      <span className="text-[9px] text-slate-400 font-bold uppercase">{formatDistanceToNow(new Date(c.createdAt))}</span>
                    </div>
                    <p className="text-sm text-slate-600 font-medium leading-relaxed">{c.body}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">No analysis shared yet. Be the first!</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PostCard;
