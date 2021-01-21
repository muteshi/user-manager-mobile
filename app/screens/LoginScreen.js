import React, { useState } from "react";
import { Image, StyleSheet } from "react-native";
import * as Yup from "yup";
import authApi from "../api/auth";

import Screen from "../components/Screen";
import {
  ErrorMessage,
  AppForm,
  AppFormField,
  SubmitButton,
} from "../components/forms/";
import useAuth from "../auth/useAuth";
import ActivityIndicator from "../components/ActivityIndicator";

const validationSchema = Yup.object().shape({
  email: Yup.string().required().email().label("Email"),
  password: Yup.string().required().min(5).label("Password"),
});

function LoginScreen({ navigation }) {
  const { logIn } = useAuth();
  const [loginFailed, setLoginFailed] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async ({ email, password }) => {
    const result = await authApi.login(email, password);

    setLoading(true);
    if (result.ok) {
      setLoading(false);
      navigation.navigate("AccountScreen");
    } else {
      setLoginFailed(true);
      setLoading(false);
      return;
    }

    logIn(result.data.token);
  };

  return (
    <Screen style={styles.container}>
      <ActivityIndicator visible={loading} />
      <Image style={styles.logo} source={require("../assets/logo.png")} />
      <AppForm
        initialValues={{ email: "", password: "" }}
        onSubmit={handleSubmit}
        validationSchema={validationSchema}
      >
        <ErrorMessage error="Invalid credentials!" visible={loginFailed} />
        <AppFormField
          autoCapitalize="none"
          autoCorrect={false}
          icon="email-outline"
          name="email"
          keyboardType="email-address"
          placeholder="Your email address"
          textContentType="emailAddress"
        />
        <AppFormField
          autoCapitalize="none"
          autoCorrect={false}
          icon="lock-outline"
          name="password"
          placeholder="Your password"
          secureTextEntry
          returnKeyType={"next"}
          textContentType="password"
        />
        <SubmitButton title="Sign in" icon="login-variant" />
      </AppForm>
    </Screen>
  );
}
const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  logo: {
    alignSelf: "center",
    marginTop: 40,
    marginBottom: 20,
  },
});

export default LoginScreen;
