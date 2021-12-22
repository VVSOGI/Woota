import React, { Component } from "react";
import { View, TextInput, Button } from "react-native";

import firebase from "firebase";

export class Login extends Component {
  state: { email: string; password: string };
  constructor(props: any) {
    super(props);

    this.state = {
      email: "",
      password: "",
    };

    this.onSignUp = this.onSignUp.bind(this);
  }

  onSignUp() {
    const { email, password } = this.state;

    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then((result) => {
        // console.log(result);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  render() {
    return (
      <View>
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
          title="Sign In"
          onPress={() => {
            this.onSignUp();
          }}
        />
      </View>
    );
  }
}

export default Login;
