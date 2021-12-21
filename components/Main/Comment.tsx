import React, { useEffect, useState } from "react";
import { View, Text, Button } from "react-native";

import firebase from "firebase";
import { FlatList, TextInput } from "react-native-gesture-handler";
require("firebase/firestore");

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { fetchUserData } from "../../redux/actions";

const mapDispatchProps = (dispatch: any) => {
  return bindActionCreators({ fetchUserData }, dispatch);
};

const mapStateToProps = (store: any) => ({
  users: store.usersState.users,
});

const Comment = (props: any) => {
  const [comments, setComments] = useState<any[]>([]);
  const [postId, setPostId] = useState<string>("");
  const [text, setText] = useState<string>("");

  useEffect(() => {
    function matchUserToComment(comments: any[]) {
      for (let i = 0; i < comments.length; i++) {
        console.log(comments[i]);

        if (comments[i].hasOwnProperty("user")) {
          continue;
        }
        const user = props.users.find(
          (user: any) => user.uid === comments[i].creator
        );
        if (user === undefined) {
          props.fetchUserData(comments[i].creator, false);
        } else {
          comments[i].user = user;
        }
      }
      setComments(comments);
    }

    if (props.route.params.postId !== postId) {
      firebase
        .firestore()
        .collection("posts")
        .doc(props.route.params.uid)
        .collection("userPosts")
        .doc(props.route.params.postId)
        .collection("comments")
        .get()
        .then((snapshot) => {
          let comments = snapshot.docs.map((doc) => {
            const data = doc.data();
            const id = doc.id;
            return { id, ...data };
          });
          matchUserToComment(comments);
        });
      setPostId(props.route.params.postId);
    } else {
      matchUserToComment(comments);
    }
  }, [props.route.params.postId, props.users]);

  const onCommentSend = () => {
    firebase
      .firestore()
      .collection("posts")
      .doc(props.route.params.uid)
      .collection("userPosts")
      .doc(props.route.params.postId)
      .collection("comments")
      .add({
        creator: firebase.auth().currentUser?.uid,
        text,
      });
  };

  return (
    <View>
      <FlatList
        numColumns={1}
        horizontal={false}
        data={comments}
        renderItem={({ item }) => {
          return (
            <View>
              {item.user !== undefined ? <Text>{item.user.name}</Text> : null}
              <Text>{item.text}</Text>
            </View>
          );
        }}
      />
      <View>
        <TextInput
          placeholder="comment..."
          onChangeText={(text) => setText(text)}
        />
        <Button
          title="comment"
          onPress={() => {
            onCommentSend();
          }}
        />
      </View>
    </View>
  );
};

export default connect(mapStateToProps, mapDispatchProps)(Comment);
