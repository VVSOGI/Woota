import {
  USER_FOLLOWING_STATE_CHANGE,
  USER_POSTS_STATE_CHANGE,
  USER_STATE_CHANGE,
  CLEAR_DATA,
} from "../constants";

const initialState = {
  currentUser: null,
  post: [],
  following: [],
};

export const user = (state = initialState, action: any) => {
  switch (action.type) {
    case USER_STATE_CHANGE:
      return {
        ...state,
        currentUser: action.currentUser,
      };

    case USER_POSTS_STATE_CHANGE:
      return {
        ...state,
        posts: action.posts,
      };

    case USER_FOLLOWING_STATE_CHANGE:
      return {
        ...state,
        following: action.following,
      };

    case CLEAR_DATA:
      return {
        currentUser: null,
        post: [],
        following: [],
      };

    default:
      return state;
    // default를 첨부하지 않으면 에러.
  }
};
