import API from './api';

export const buy = (ticker, quantity) => API.post('/trade/buy', { ticker, quantity });
export const sell = (ticker, quantity) => API.post('/trade/sell', { ticker, quantity });
export const getPortfolio = () => API.get('/trade/portfolio');
export const getLeaderboard = () => API.get('/trade/leaderboard');
export const getHistory = (page) => API.get(`/trade/history?page=${page}`);
