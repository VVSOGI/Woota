import {
  USERS_POSTS_STATE_CHANGE,
  USERS_DATA_STATE_CHANGE,
  CLEAR_DATA,
} from "../constants";

const initialState = {
  users: [],
  usersFollowingLoaded: 0,
};

export const users = (state = initialState, action: any) => {
  switch (action.type) {
    case USERS_DATA_STATE_CHANGE:
      return {
        ...state,
        users: [...state.users, action.user],
      };

    case USERS_POSTS_STATE_CHANGE:
      return {
        ...state,
        usersFollowingLoaded: state.usersFollowingLoaded + 1,
        users: state.users.map((user: { uid: string }) => {
          return user.uid === action.uid
            ? { ...user, posts: action.posts }
            : user;
        }),
      };

    case CLEAR_DATA:
      return {
        users: [],
        usersFollowingLoaded: 0,
      };

    default:
      return state;
    // default를 첨부하지 않으면 에러.
  }
};
