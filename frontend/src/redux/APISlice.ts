import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { APIType, commentType, likedType } from "../types";

export interface APIData {
  data: APIType[];
}

const initialState: APIData = {
  data: [],
};

export const APISlice = createSlice({
  name: "API",
  initialState,
  reducers: {
    setAPI: (state, action: PayloadAction<APIType[]>) => {
      state.data = action.payload;
    },
    updateIsCommentSection: (state, action: PayloadAction<string>) => {
      state.data = state.data.map((api) =>
        api._id === action.payload
          ? { ...api, isCommentSection: !api.isCommentSection }
          : api,
      );
    },

    postComment: (
      state,
      action: PayloadAction<{ id: string; comment: commentType }>,
    ) => {
      state.data = state.data.map((api) =>
        api._id === action.payload.id
          ? { ...api, comments: [action.payload.comment, ...api.comments] }
          : api,
      );
    },
    updateLikedAPIOnly: (
      state,
      action: PayloadAction<{ id: string; liked: likedType }>,
    ) => {
      state.data = state.data.map((api) =>
        api._id === action.payload.id
          ? { ...api, likes: [action.payload.liked, ...api.likes] }
          : api,
      );
    },

    removeLikedAPIOnly: (
      state,
      action: PayloadAction<{ id: string; userId: string }>,
    ) => {
      state.data = state.data.map((api) =>
        api._id === action.payload.id
          ? {
              ...api,
              likes: api.likes.filter(
                (liked) => liked.userId !== action.payload.userId,
              ),
            }
          : api,
      );
    },

    updateShowLikedUsers: (state, action: PayloadAction<string>) => {
      state.data = state.data.map((api) =>
        api._id === action.payload
          ? { ...api, isLikeHover: !api.isLikeHover }
          : api,
      );
    },
  },
});

export const {
  setAPI,
  updateIsCommentSection,
  postComment,
  updateLikedAPIOnly,
  removeLikedAPIOnly,
  updateShowLikedUsers,
} = APISlice.actions;
export default APISlice.reducer;
