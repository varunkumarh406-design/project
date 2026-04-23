import { createSlice } from '@reduxjs/toolkit';

const tradeSlice = createSlice({
  name: 'trade',
  initialState: {
    holdings: [],
    virtualBalance: 100000,
    history: [],
    leaderboard: [],
    loading: false,
  },
  reducers: {
    setPortfolio: (state, action) => {
      state.holdings = action.payload.holdings;
      state.virtualBalance = action.payload.virtualBalance;
    },
    setHistory: (state, action) => {
      state.history = action.payload;
    },
    setLeaderboard: (state, action) => {
      state.leaderboard = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const { setPortfolio, setHistory, setLeaderboard, setLoading } = tradeSlice.actions;
export default tradeSlice.reducer;
