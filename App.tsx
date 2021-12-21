import React, { Component } from "react";
import { View, Text } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Landing from "./components/auth/Landing";
import Register from "./components/auth/Register";

import firebase from "firebase";

import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import rootReducer from "./redux/reducers";
import thunk from "redux-thunk";

import Main from "./components/Main/Main";
import Login from "./components/auth/Login";
import Add from "./components/Main/Add";
import Save from "./components/Main/Save.js";

import { FIREBASE_API_KEY } from "@env";
import Comment from "./components/Main/Comment";

const store = createStore(rootReducer, applyMiddleware(thunk));

const Stack = createStackNavigator();

const firebaseConfig = {
  apiKey: `${FIREBASE_API_KEY}`,
  authDomain: "instagram-clone-f2d46.firebaseapp.com",
  projectId: "instagram-clone-f2d46",
  storageBucket: "instagram-clone-f2d46.appspot.com",
  messagingSenderId: "912097737348",
  appId: "1:912097737348:web:84562db14afa02f18fe0d1",
  measurementId: "G-VNRT08MQ4D",
};

if (firebase.app.length !== 0) {
  firebase.initializeApp(firebaseConfig);
}

export class App extends Component {
  state: { loaded: boolean; loggedIn?: boolean };

  constructor(props: any) {
    super(props);
    this.state = {
      loaded: false,
      loggedIn: false,
    };
  }

  componentDidMount() {
    firebase.auth().onAuthStateChanged((user) => {
      if (!user) {
        this.setState({
          loggedIn: false,
          loaded: true,
        });
      } else {
        this.setState({
          loggedIn: true,
          loaded: true,
        });
      }
    });
  }

  render() {
    const { loggedIn, loaded } = this.state;
    if (!loaded) {
      return (
        <View>
          <Text>Loading</Text>
        </View>
      );
    }
    if (!loggedIn) {
      return (
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Landing">
            <Stack.Screen
              name="Landing"
              component={Landing}
              options={{ headerShown: false }}
            />
            <Stack.Screen name="Register" component={Register} />
            <Stack.Screen name="Login" component={Login} />
          </Stack.Navigator>
        </NavigationContainer>
      );
    }
    return (
      <Provider store={store}>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Main">
            <Stack.Screen name="Main" component={Main} />
            <Stack.Screen name="Add" component={Add} />
            <Stack.Screen name="Save" component={Save} />
            <Stack.Screen name="Comment" component={Comment} />
          </Stack.Navigator>
        </NavigationContainer>
      </Provider>
    );
  }
}

export default App;

// dependencies를 yarn에 넣었을 때는 오류가 났지만 expo에 넣으니 오류가 사라짐.
