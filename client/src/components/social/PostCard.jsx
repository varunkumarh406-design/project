import { useState } from 'react';
import { Heart, MessageCircle, Share2, TrendingUp, TrendingDown } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useDispatch, useSelector } from 'react-redux';
import { toggleLike, addComment } from '../../services/socialService';
import { updatePostLikes } from '../../store/socialSlice';
import { clsx } from 'clsx';

const PostCard = ({ post }) => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const [showComments, setShowComments] = useState(false);
  const [commentBody, setCommentBody] = useState('');
  const [isTip, setIsTip] = useState(false);

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
    <div className="glass-card rounded-2xl p-6 mb-6">
      <div className="flex items-center space-x-3 mb-4">
        <img src={post.author.avatar} alt={post.author.name} className="w-10 h-10 rounded-full" />
        <div>
          <h4 className="font-bold">{post.author.name}</h4>
          <p className="text-xs text-secondary">{formatDistanceToNow(new Date(post.createdAt))} ago</p>
        </div>
      </div>

      <p className="text-white mb-4 leading-relaxed">{post.body}</p>

      {post.ticker && (
        <div className="inline-flex items-center space-x-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold mb-4">
          <span>${post.ticker}</span>
        </div>
      )}

      <div className="flex items-center space-x-6 pt-4 border-t border-border">
        <button 
          onClick={handleLike}
          className={clsx("flex items-center space-x-2 transition-colors", isLiked ? "text-danger" : "text-secondary hover:text-danger")}
        >
          <Heart size={20} fill={isLiked ? "currentColor" : "none"} />
          <span>{post.likes.length}</span>
        </button>

        <button 
          onClick={() => setShowComments(!showComments)}
          className="flex items-center space-x-2 text-secondary hover:text-primary transition-colors"
        >
          <MessageCircle size={20} />
          {/* We'd need to fetch comment count separately or store it */}
        </button>

        <button className="flex items-center space-x-2 text-secondary hover:text-white transition-colors ml-auto">
          <Share2 size={20} />
        </button>
      </div>
    </div>
  );
};

export default PostCard;
