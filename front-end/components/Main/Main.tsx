import React, { Component } from "react";
import { Text, View } from "react-native";
import MatrialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
  clearData,
  fetchUser,
  fetchUserPosts,
  fetchUserFollowing,
} from "../../redux/actions/index";

import Feed from "./Feed";
import Profile from "./Profile";
import Search from "./Search";

import firebase from "firebase";

const mapDispatchProps = (dispatch: any) => {
  return bindActionCreators(
    { clearData, fetchUser, fetchUserPosts, fetchUserFollowing },
    dispatch
  );
};

const mapStateToProps = (store: any) => ({
  currentUser: store.userState.currentUser,
});

interface MainProps {
  fetchUser: () => void;
  fetchUserPosts: () => void;
  fetchUserFollowing: () => void;
  clearData: () => void;
  currentUser: { name: string; email: string };
  route: any;
}

const Tab = createMaterialBottomTabNavigator();

const Empty = () => {
  return null;
};

export class Main extends Component<MainProps> {
  componentDidMount() {
    this.props.clearData();
    this.props.fetchUser();
    this.props.fetchUserPosts();
    this.props.fetchUserFollowing();
  }
  componentDidUpdate() {
    if (this.props.route.params !== undefined) {
      this.props.fetchUserPosts();
    }
  }
  render() {
    const { currentUser } = this.props;
    if (currentUser === undefined) {
      return (
        <View>
          <Text>empty</Text>
        </View>
      );
    }

    return (
      <Tab.Navigator initialRouteName="Feed" labeled={false}>
        <Tab.Screen
          name="Feed"
          component={Feed}
          options={{
            tabBarIcon: ({ color }) => (
              <MatrialCommunityIcons name="home" color={color} size={26} />
            ),
          }}
        />
        <Tab.Screen
          name="Search"
          component={Search}
          options={{
            tabBarIcon: ({ color }) => (
              <MatrialCommunityIcons name="magnify" color={color} size={26} />
            ),
          }}
        />
        <Tab.Screen
          name="AddContainer"
          listeners={({ navigation }) => ({
            tabPress: (event) => {
              event.preventDefault();
              navigation.navigate("Add");
            },
          })}
          component={Empty}
          options={{
            tabBarIcon: ({ color }) => (
              <MatrialCommunityIcons name="plus-box" color={color} size={26} />
            ),
          }}
        />
        <Tab.Screen
          name="Profile"
          listeners={({ navigation }) => ({
            tabPress: (event) => {
              event.preventDefault();
              navigation.navigate("Profile", {
                uid: firebase.auth().currentUser?.uid,
              });
            },
          })}
          component={Profile}
          options={{
            tabBarIcon: ({ color }) => (
              <MatrialCommunityIcons
                name="account-circle"
                color={color}
                size={26}
              />
            ),
          }}
        />
      </Tab.Navigator>
    );
  }
}

export default connect(mapStateToProps, mapDispatchProps)(Main);
