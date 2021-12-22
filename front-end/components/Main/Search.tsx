import React, { useState } from "react";
import { View, Text, TextInput, FlatList, TextInputProps } from "react-native";

import firebase from "firebase";
import { TouchableOpacity } from "react-native-gesture-handler";
require("firebase/firestore");

const Search = (props: any) => {
  const [users, setUsers] = useState<any[]>([]);

  const fetchUsers = (search: string) => {
    firebase
      .firestore()
      .collection("users")
      .where("name", ">=", search)
      .get()
      .then((snapshot) => {
        let users = snapshot.docs.map((doc) => {
          const data = doc.data();
          const id = doc.id;
          return { id, ...data };
        });
        setUsers(users);
      });
  };
  return (
    <View>
      <TextInput
        placeholder="Type Here . . ."
        onChangeText={(search) => fetchUsers(search)}
      />
      <FlatList
        numColumns={1}
        horizontal={false}
        data={users}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => {
              props.navigation.navigate("Profile", { uid: item.id });
            }}
          >
            <Text>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default Search;
