import { createSlice } from '@reduxjs/toolkit';

const stockSlice = createSlice({
  name: 'stocks',
  initialState: {
    watchlist: [],
    selectedQuote: null,
    history: [],
    searchResults: [],
    loading: false,
  },
  reducers: {
    setWatchlist: (state, action) => {
      state.watchlist = Array.isArray(action.payload) ? action.payload : [];
    },
    setSelectedQuote: (state, action) => {
      state.selectedQuote = action.payload;
    },
    setHistory: (state, action) => {
      state.history = action.payload;
    },
    setSearchResults: (state, action) => {
      state.searchResults = action.payload;
    },
    updatePriceIfSelected: (state, action) => {
      const { symbol, price, changePercent } = action.payload;
      if (state.selectedQuote && state.selectedQuote.symbol === symbol) {
        state.selectedQuote.price = price;
        state.selectedQuote.changePercent = changePercent;
      }
      // Also update in watchlist if present
      const watched = state.watchlist.find(s => s.symbol === symbol);
      if (watched) {
        watched.price = price;
        watched.changePercent = changePercent;
      }
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const { setWatchlist, setSelectedQuote, setHistory, setSearchResults, updatePriceIfSelected, setLoading } = stockSlice.actions;
export default stockSlice.reducer;
