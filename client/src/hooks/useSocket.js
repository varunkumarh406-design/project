import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { useSelector, useDispatch } from 'react-redux';
import { updatePostLikes, addPost } from '../store/socialSlice';
import { setSelectedQuote } from '../store/stockSlice';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

export const useSocket = () => {
  const { user, token } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const socketRef = useRef(null);

  useEffect(() => {
    if (user && token) {
      socketRef.current = io(SOCKET_URL, {
        auth: { token }
      });

      socketRef.current.on('connect', () => {
        console.log('Connected to socket server');
      });

      socketRef.current.on('new_post', (post) => {
        dispatch(addPost(post));
      });

      socketRef.current.on('post_liked', (data) => {
        dispatch(updatePostLikes(data));
      });

      socketRef.current.on('stock_price_update', (update) => {
        // We only update if it's the currently selected stock
        // Note: We'd need current state here, or handle it in a way that respects the current view
        // For simplicity, we can dispatch a generic action or check symbol
        dispatch({ type: 'stocks/updatePriceIfSelected', payload: update });
      });

      return () => {
        if (socketRef.current) {
          socketRef.current.disconnect();
        }
      };
    }
  }, [user, token, dispatch]);

  return socketRef.current;
};
