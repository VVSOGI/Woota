import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, Image, FlatList, Button } from "react-native";

import { connect } from "react-redux";

import firebase from "firebase";
require("firebase/firestore");

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  infoContainer: {
    margin: 20,
  },
  galleryContainer: {
    flex: 1,
  },
  image: {
    flex: 1,
    aspectRatio: 1 / 1,
  },
  imageContainer: {
    flex: 1,
  },
});

const Feed = (props: any) => {
  const [posts, setPosts] = useState<any[]>([]);

  useEffect(() => {
    if (
      props.following !== undefined &&
      props.usersFollowingLoaded === props.following.length
    ) {
      props.feed.sort((x: { creation: number }, y: { creation: number }) => {
        return x.creation - y.creation;
      });
      setPosts(props.feed);
    }
  }, [props.usersFollowingLoaded, props.feed]);

  const onLikePress = (uid: string, postId: string) => {
    firebase
      .firestore()
      .collection("posts")
      .doc(uid)
      .collection("userPosts")
      .doc(postId)
      .collection("likes")
      .doc(firebase.auth().currentUser?.uid)
      .set({});
  };

  const onDislikePress = (uid: string, postId: string) => {
    firebase
      .firestore()
      .collection("posts")
      .doc(uid)
      .collection("userPosts")
      .doc(postId)
      .collection("likes")
      .doc(firebase.auth().currentUser?.uid)
      .delete();
  };

  if (posts === null) {
    return (
      <View>
        <Text>null</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.galleryContainer}>
        <FlatList
          numColumns={1}
          horizontal={false}
          data={posts.length > 10 ? posts.slice(0, 10) : posts}
          renderItem={({ item }) => {
            return (
              <View style={styles.imageContainer}>
                <Text style={styles.container}>{item.user.name}</Text>
                <Image
                  style={styles.image}
                  source={{ uri: item.downloadURL }}
                />
                {item.currentUserLike ? (
                  <Button
                    title="Dislike"
                    onPress={() => onDislikePress(item.user.uid, item.id)}
                  />
                ) : (
                  <Button
                    title="Like"
                    onPress={() => onLikePress(item.user.uid, item.id)}
                  />
                )}
                <Text
                  onPress={() => {
                    props.navigation.navigate("Comment", {
                      postId: item.id,
                      uid: item.user.uid,
                    });
                  }}
                >
                  View Comments...
                </Text>
              </View>
            );
          }}
        />
      </View>
    </View>
  );
};

const mapStateToProps = (store: any) => ({
  currentUser: store.userState.currentUser,
  following: store.userState.following,
  feed: store.usersState.feed,
  usersFollowingLoaded: store.usersState.usersFollowingLoaded,
});

export default connect(mapStateToProps, null)(Feed);
