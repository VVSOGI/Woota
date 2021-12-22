import firebase from "firebase";
import {
  USERS_DATA_STATE_CHANGE,
  USERS_POSTS_STATE_CHANGE,
  USER_FOLLOWING_STATE_CHANGE,
  USERS_LIKES_STATE_CHANGE,
  USER_POSTS_STATE_CHANGE,
  USER_STATE_CHANGE,
  CLEAR_DATA,
} from "../constants";

export function clearData() {
  return async (dispatch: any) => {
    dispatch({ type: CLEAR_DATA });
  };
}

export function fetchUser() {
  return async (dispatch: any) => {
    firebase
      .firestore()
      .collection("users")
      .doc(firebase.auth().currentUser?.uid)
      .get()
      .then((snapshot) => {
        if (snapshot.exists) {
          dispatch({ type: USER_STATE_CHANGE, currentUser: snapshot.data() });
        } else {
          console.log("does not exist");
        }
      });
  };
}

export function fetchUserPosts() {
  return async (dispatch: any) => {
    firebase
      .firestore()
      .collection("posts")
      .doc(firebase.auth().currentUser?.uid)
      .collection("userPosts")
      .orderBy("creation", "asc")
      .get()
      .then((snapshot) => {
        let posts = snapshot.docs.map((doc) => {
          const data = doc.data();
          const id = doc.id;
          return { id, ...data };
        });
        dispatch({ type: USER_POSTS_STATE_CHANGE, posts });
      });
  };
}

export function fetchUserFollowing() {
  return async (dispatch: any) => {
    firebase
      .firestore()
      .collection("following")
      .doc(firebase.auth().currentUser?.uid)
      .collection("userFollowing")
      .onSnapshot((snapshot) => {
        let following = snapshot.docs.map((doc) => {
          const id = doc.id;
          return id;
        });
        dispatch({ type: USER_FOLLOWING_STATE_CHANGE, following });
        for (let i = 0; i < following.length; i++) {
          dispatch(fetchUserData(following[i], true));
        }
      });
  };
}

export function fetchUserData(uid: string, getPosts: boolean) {
  return async (dispatch: any, getState: any) => {
    const found = getState().usersState.users.some(
      (el: { uid: string }) => el.uid === uid
    );
    if (!found) {
      firebase
        .firestore()
        .collection("users")
        .doc(uid)
        .get()
        .then((snapshot) => {
          if (snapshot.exists) {
            let user = snapshot.data();
            if (user) {
              user.uid = snapshot.id;
              dispatch({
                type: USERS_DATA_STATE_CHANGE,
                user,
              });
            }
          } else {
            console.log("does not exist");
          }
        });
    }
    if (getPosts) {
      dispatch(fetchUserFollowingPosts(uid));
    }
  };
}

export function fetchUserFollowingPosts(uid: string) {
  return async (dispatch: any, getState: any) => {
    firebase
      .firestore()
      .collection("posts")
      .doc(uid)
      .collection("userPosts")
      .orderBy("creation", "asc")
      .get()
      .then((snapshot: any) => {
        let uid = snapshot.query._delegate._query.path.segments[1];

        const user = getState().usersState.users.find(
          (el: { uid: string }) => el.uid === uid
        );

        let posts = snapshot.docs.map((doc: any) => {
          const data = doc.data();
          const id = doc.id;
          return { id, ...data, user };
        });

        for (let i = 0; i < posts.length; i++) {
          dispatch(fetchUserFollowingLikes(uid, posts[i].id));
        }

        dispatch({ type: USERS_POSTS_STATE_CHANGE, posts, uid });
      });
  };
}

export function fetchUserFollowingLikes(uid: string, postId: string) {
  return async (dispatch: any, getState: any) => {
    firebase
      .firestore()
      .collection("posts")
      .doc(uid)
      .collection("userPosts")
      .doc(postId)
      .collection("likes")
      .doc(firebase.auth().currentUser?.uid)
      .onSnapshot((snapshot: any) => {
        const postId = snapshot._delegate._key.path.segments[3];
        let currentUserLike = false;
        if (snapshot.exists) {
          currentUserLike = true;
        }
        dispatch({ type: USERS_LIKES_STATE_CHANGE, postId, currentUserLike });
      });
  };
}
