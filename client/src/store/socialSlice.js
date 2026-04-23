import { createSlice } from '@reduxjs/toolkit';

const socialSlice = createSlice({
  name: 'social',
  initialState: {
    feed: [],
    loading: false,
  },
  reducers: {
    setFeed: (state, action) => {
      state.feed = action.payload;
    },
    addPost: (state, action) => {
      state.feed = [action.payload, ...state.feed];
    },
    updatePostLikes: (state, action) => {
      const { postId, likes } = action.payload;
      const post = state.feed.find(p => p._id === postId);
      if (post) post.likes = likes;
    },
    addCommentToPost: (state, action) => {
      // In a real app, comments might be handled by a separate slice or state
      // For simplicity, we just keep the feed here
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const { setFeed, addPost, updatePostLikes, setLoading } = socialSlice.actions;
export default socialSlice.reducer;
