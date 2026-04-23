import { createContext, useState, useContext, useEffect } from 'react';
import io from 'socket.io-client';
import * as api from '../api/api';
import { useAuth } from './AuthContext';

const TradeContext = createContext();

export const TradeProvider = ({ children }) => {
  const [trades, setTrades] = useState([]);
  const { user } = useAuth();
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (user) {
      const newSocket = io('http://localhost:5000');
      setSocket(newSocket);

      newSocket.on('connect', () => {
        newSocket.emit('join', user._id);
      });

      newSocket.on('new_trade', (trade) => {
        setTrades((prev) => [trade, ...prev]);
      });

      newSocket.on('like_trade', (data) => {
        setTrades((prev) => 
          prev.map((t) => t._id === data.tradeId ? { ...t, likes: data.isLiked ? [...t.likes, data.userId] : t.likes.filter(id => id !== data.userId) } : t)
        );
      });

      newSocket.on('comment_trade', (data) => {
        setTrades((prev) => 
          prev.map((t) => t._id === data.tradeId ? { ...t, comments: [...t.comments, data.comment] } : t)
        );
      });

      return () => newSocket.close();
    }
  }, [user]);

  const fetchFeed = async () => {
    try {
      const { data } = await api.getTradeFeed();
      setTrades(data);
    } catch (error) {
      console.error('Failed to fetch feed:', error);
    }
  };

  const like = async (id) => {
    try {
      await api.likeTrade(id);
      // Socket event will handle UI update
    } catch (error) {
      console.error('Failed to like trade:', error);
    }
  };

  const addComment = async (id, text) => {
    try {
      await api.commentTrade(id, { text });
      // Socket event will handle UI update
    } catch (error) {
      console.error('Failed to add comment:', error);
    }
  };

  return (
    <TradeContext.Provider value={{ trades, fetchFeed, like, addComment }}>
      {children}
    </TradeContext.Provider>
  );
};

export const useTrades = () => useContext(TradeContext);
