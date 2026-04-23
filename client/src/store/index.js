import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import stockReducer from './stockSlice';
import socialReducer from './socialSlice';
import tradeReducer from './tradeSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    stocks: stockReducer,
    social: socialReducer,
    trade: tradeReducer,
  },
});
