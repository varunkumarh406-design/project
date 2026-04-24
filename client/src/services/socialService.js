import API from './api';

export const getFeed = (page) => API.get(`/social/feed?page=${page}`);
export const createPost = (data) => API.post('/social/post', data);
export const toggleLike = (id) => API.post(`/social/post/${id}/like`);
export const addComment = (id, data) => API.post(`/social/post/${id}/comment`, data);
export const getComments = (id) => API.get(`/social/post/${id}/comments`);
export const getPostsByUser = (id) => API.get(`/social/user/${id}`);
