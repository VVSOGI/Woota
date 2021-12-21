import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, Image, FlatList } from "react-native";

import { connect } from "react-redux";

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
    let posts: any[] = [];

    if (
      props.following !== undefined &&
      props.usersFollowingLoaded === props.following.length
    ) {
      for (let i = 0; i < props.following.length; i++) {
        const user = props.users.find(
          (el: { uid: string }) => el.uid === props.following[i]
        );
        if (user !== undefined) {
          posts = [...posts, ...user.posts];
        }
      }

      posts.sort((x, y) => {
        return x.creation - y.creation;
      });

      setPosts(posts);
    }
  }, [props.usersFollowingLoaded]);

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
  users: store.usersState.users,
  usersFollowingLoaded: store.usersState.usersFollowingLoaded,
});

export default connect(mapStateToProps, null)(Feed);
