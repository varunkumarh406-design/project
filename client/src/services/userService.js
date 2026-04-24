import API from './api';

export const getUserProfile = (id) => API.get(`/users/${id}`);
export const getSuggestions = () => API.get('/users/suggestions');
export const followUser = (id) => API.post(`/users/follow/${id}`);
export const searchUsers = (query) => API.get(`/users/search/${query}`);
export const updateProfile = (data) => API.put('/users/update', data);
