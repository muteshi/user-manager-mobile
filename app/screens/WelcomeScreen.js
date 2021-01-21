import React from "react";
import { Image, ImageBackground, StyleSheet, View } from "react-native";

import WelcomeScreenAppButton from "../components/WelcomeScreenAppButton";

function WelcomeScreen({ navigation, route }) {
  return (
    <>
      <ImageBackground
        blurRadius={2}
        style={styles.background}
        source={require("../assets/bg_photo.jpg")}
      >
        <View style={styles.logoContainer}>
          <Image source={require("../assets/logo.png")} />
        </View>
        <View style={styles.buttonsContainer}>
          <WelcomeScreenAppButton
            color="light"
            icon="email-outline"
            title="Sign in with email"
            onPress={() => {
              navigation.navigate("Login");
            }}
          />
          <WelcomeScreenAppButton
            color="light"
            icon="account-plus-outline"
            title="Register your account"
            onPress={() => navigation.navigate("Register", route.params)}
          />
        </View>
      </ImageBackground>
    </>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  buttonsContainer: {
    padding: 20,
    width: "100%",
  },

  logoContainer: {
    position: "absolute",
    top: 90,
    alignItems: "center",
  },
});

export default WelcomeScreen;
