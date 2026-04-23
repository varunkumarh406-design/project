import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTrades } from '../context/TradeContext';
import { Heart, MessageCircle, Share2, TrendingUp, TrendingDown } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { clsx } from 'clsx';

const TradeCard = ({ trade }) => {
  const { user } = useAuth();
  const { like, addComment } = useTrades();
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');

  const isLiked = trade.likes.includes(user?._id);

  const handleSubmitComment = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    addComment(trade._id, commentText);
    setCommentText('');
  };

  return (
    <div className="glass-card rounded-2xl p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <img src={trade.user.avatar} alt={trade.user.name} className="w-10 h-10 rounded-full border border-border" />
          <div>
            <h4 className="font-semibold text-white">{trade.user.name}</h4>
            <p className="text-xs text-secondary">{formatDistanceToNow(new Date(trade.createdAt))} ago</p>
          </div>
        </div>
        <div className={clsx(
          "px-3 py-1 rounded-full text-xs font-bold",
          trade.type === 'BUY' ? "bg-success/10 text-success" : "bg-danger/10 text-danger"
        )}>
          {trade.type}
        </div>
      </div>

      <div className="bg-background/50 rounded-xl p-4 mb-4 border border-border/50">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-secondary text-xs uppercase tracking-wider mb-1">Asset</p>
            <h3 className="text-xl font-bold text-white flex items-center space-x-2">
              <span>{trade.stockSymbol}</span>
              {trade.type === 'BUY' ? <TrendingUp size={18} className="text-success" /> : <TrendingDown size={18} className="text-danger" />}
            </h3>
          </div>
          <div className="text-right">
            <p className="text-secondary text-xs uppercase tracking-wider mb-1">Price</p>
            <p className="text-xl font-bold text-white">${trade.price}</p>
          </div>
          <div className="text-right">
            <p className="text-secondary text-xs uppercase tracking-wider mb-1">Qty</p>
            <p className="text-xl font-bold text-white">{trade.quantity}</p>
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-6">
        <button 
          onClick={() => like(trade._id)}
          className={clsx(
            "flex items-center space-x-2 transition-colors",
            isLiked ? "text-danger" : "text-secondary hover:text-danger"
          )}
        >
          <Heart size={20} fill={isLiked ? "currentColor" : "none"} />
          <span>{trade.likes.length}</span>
        </button>

        <button 
          onClick={() => setShowComments(!showComments)}
          className="flex items-center space-x-2 text-secondary hover:text-primary transition-colors"
        >
          <MessageCircle size={20} />
          <span>{trade.comments.length}</span>
        </button>

        <button className="flex items-center space-x-2 text-secondary hover:text-white transition-colors">
          <Share2 size={20} />
        </button>
      </div>

      {showComments && (
        <div className="mt-6 pt-6 border-t border-border">
          <div className="space-y-4 mb-4 max-h-48 overflow-y-auto">
            {trade.comments.map((comment, idx) => (
              <div key={idx} className="flex space-x-3">
                <img src={comment.user.avatar} className="w-8 h-8 rounded-full" />
                <div className="bg-card px-4 py-2 rounded-2xl flex-1">
                  <p className="text-xs font-bold text-white mb-1">{comment.user.name}</p>
                  <p className="text-sm text-secondary">{comment.text}</p>
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmitComment} className="flex space-x-3">
            <input 
              type="text" 
              placeholder="Add a comment..." 
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className="flex-1 bg-background border border-border rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-primary"
            />
            <button type="submit" className="text-primary font-semibold text-sm px-2">Post</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default TradeCard;
