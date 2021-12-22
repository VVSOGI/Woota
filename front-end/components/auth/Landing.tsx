import React from "react";
import { Text, View, StyleSheet, Button } from "react-native";

const styles = StyleSheet.create({
  LandingContainer: {
    flex: 1,
    justifyContent: "center",
  },
});

const Landing = (props: any) => {
  return (
    <View style={styles.LandingContainer}>
      <Button
        title="Register"
        onPress={() => props.navigation.navigate("Register")}
      />
      <Button
        title="Login"
        onPress={() => props.navigation.navigate("Login")}
      />
    </View>
  );
};

export default Landing;
