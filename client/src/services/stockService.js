import API from './api';

export const searchStocks = (q) => API.get(`/stocks/search?q=${q}`);
export const getQuote = (ticker) => API.get(`/stocks/quote/${ticker}`);
export const getHistory = (ticker) => API.get(`/stocks/history/${ticker}`);
export const addToWatchlist = (ticker) => API.post('/stocks/watchlist', { ticker });
export const removeFromWatchlist = (ticker) => API.delete(`/stocks/watchlist/${ticker}`);
export const getWatchlist = () => API.get('/stocks/watchlist');
