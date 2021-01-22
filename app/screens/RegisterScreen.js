import React, { useState } from "react";
import { StyleSheet } from "react-native";
import * as Yup from "yup";

import Screen from "../components/Screen";
import usersApi from "../api/users";
import authApi from "../api/auth";
import useAuth from "../auth/useAuth";
import {
  AppForm,
  AppFormField,
  ErrorMessage,
  SubmitButton,
} from "../components/forms";
import useApi from "../hooks/useApi";
import ActivityIndicator from "../components/ActivityIndicator";
import routes from "../navigation/routes";
const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

const validationSchema = Yup.object().shape({
  name: Yup.string().required().label("Name"),
  email: Yup.string().required().email().label("Email"),
  password: Yup.string().required().min(6).label("Password"),
  phone: Yup.string()
    .matches(phoneRegExp, "Mobile number is not valid")
    .required()
    .min(10)
    .nullable()
    .label("Mobile number"),
});

function RegisterScreen({ navigation, route }) {
  const { user } = useAuth();
  const registerApi = useApi(usersApi.register);
  const loginApi = useApi(authApi.login);
  const [error, setError] = useState();

  const handleSubmit = async (userInfo) => {
    const userData = route.params ? { ...userInfo, owner: user._id } : userInfo;
    const result = await registerApi.request(userData);

    if (!result.ok) {
      if (result.data) setError(result.data.error);
      else {
        setError("An unexpected error occurred.");
      }
      return;
    }

    route.params
      ? navigation.navigate(routes.ACCOUNT_SCREEN)
      : navigation.navigate(routes.LOGIN);
  };

  return (
    <>
      <ActivityIndicator visible={registerApi.loading || loginApi.loading} />
      <Screen style={styles.container}>
        <AppForm
          initialValues={{ name: "", email: "", password: "", phone: "" }}
          onSubmit={handleSubmit}
          validationSchema={validationSchema}
        >
          <ErrorMessage error={error} visible={error} />
          <AppFormField
            autoCorrect={false}
            icon="account-outline"
            name="name"
            placeholder="Full Name"
          />
          <AppFormField
            autoCapitalize="none"
            autoCorrect={false}
            icon="email-outline"
            keyboardType="email-address"
            name="email"
            placeholder="Email"
            textContentType="emailAddress"
          />

          <AppFormField
            keyboardType="phone-pad"
            icon="cellphone"
            name="phone"
            placeholder="Mobile phone"
          />
          <AppFormField
            autoCapitalize="none"
            autoCorrect={false}
            icon="lock-outline"
            name="password"
            placeholder="Password"
            secureTextEntry
            textContentType="password"
          />
          <SubmitButton title="Sign up" icon="account-plus-outline" />
        </AppForm>
      </Screen>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
});

export default RegisterScreen;
