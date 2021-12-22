import React, { Component } from "react";
import { View, TextInput, Button } from "react-native";

import firebase from "firebase";
import "firebase/firestore";

export class Register extends Component {
  state: { name: string; email: string; password: string };
  constructor(props: any) {
    super(props);

    this.state = {
      name: "",
      email: "",
      password: "",
    };

    this.onSignUp = this.onSignUp.bind(this);
  }

  onSignUp() {
    const { email, name, password } = this.state;

    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then((result) => {
        firebase
          .firestore()
          .collection("users")
          .doc(firebase.auth().currentUser?.uid)
          .set({ name, email });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  componentDidMount() {
    console.log("Mounted!");
  }

  render() {
    return (
      <View>
        <TextInput
          placeholder="name"
          onChangeText={(name) => {
            this.setState({ name });
          }}
        />
        <TextInput
          placeholder="email"
          onChangeText={(email) => {
            this.setState({ email });
          }}
        />
        <TextInput
          placeholder="password"
          secureTextEntry={true}
          onChangeText={(password) => {
            this.setState({ password });
          }}
        />
        <Button
          title="Sign Up"
          onPress={() => {
            this.onSignUp();
          }}
        />
      </View>
    );
  }
}

export default Register;
