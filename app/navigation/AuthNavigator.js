import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import LoginScreen from "../screens/LoginScreen";
import colors from "../config/colors";
import WelcomeScreen from "../screens/WelcomeScreen";
import UsersScreen from "../screens/UsersScreen";
import routes from "./routes";
import AccountScreen from "../screens/AccountScreen";
import UserScreen from "../screens/UserScreen";
import UserProfileScreen from "../screens/UserProfileScreen";
import RegisterScreen from "../screens/RegisterScreen";
import UserRequestsScreen from "../screens/UserRequestsScreen";

const Stack = createStackNavigator();

export default AuthNavigator = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="Welcome"
      component={WelcomeScreen}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="Login"
      component={LoginScreen}
      options={{ headerShown: false }}
    />
    <Stack.Screen name="Register" component={RegisterScreen} />
    <Stack.Screen
      name={routes.ACCOUNT_SCREEN}
      component={AccountScreen}
      options={() => ({
        title: "Your account",
        headerTintColor: colors.white,
        headerStyle: {
          backgroundColor: colors.secondary,
        },
      })}
    />
    <Stack.Screen name={routes.USERS} component={UsersScreen} />
    <Stack.Screen
      name={routes.USER}
      component={UserScreen}
      options={() => ({
        title: "Update acount details",
        headerTintColor: colors.white,
        headerStyle: {
          backgroundColor: colors.secondary,
        },
      })}
    />
    <Stack.Screen
      name={routes.USERPROFILESCREEN}
      component={UserProfileScreen}
      options={() => ({
        title: "User details",
        headerTintColor: colors.white,
        headerStyle: {
          backgroundColor: colors.secondary,
        },
      })}
    />
    <Stack.Screen
      name={routes.USEREQUESTSCREEN}
      component={UserRequestsScreen}
      options={() => ({
        title: "Admin requests",
        headerTintColor: colors.white,
        headerStyle: {
          backgroundColor: colors.secondary,
        },
      })}
    />
  </Stack.Navigator>
);
