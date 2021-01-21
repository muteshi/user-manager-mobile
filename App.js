import React, { useState } from "react";
import AuthNavigator from "./app/navigation/AuthNavigator";
import { NavigationContainer } from "@react-navigation/native";
import AppLoading from "expo-app-loading";

import { AuthContext } from "./app/auth/context";
import navigationTheme from "./app/navigation/navigationTheme";
import OfflineNotice from "./app/components/OfflineNotice";
import authStorage from "./app/auth/storage";
import { navigationRef } from "./app/navigation/rootNavigation";
import logger from "./app/utility/logger";
import WelcomeScreen from "./app/screens/WelcomeScreen";

// logger.start();

export default function App() {
  const [user, setUser] = useState();
  const [isReady, setIsReady] = useState(false);

  const restoreUser = async () => {
    const appUser = await authStorage.getUser();

    if (appUser) setUser(appUser);
  };

  if (!isReady)
    return (
      <AppLoading
        onError={console.warn}
        startAsync={restoreUser}
        onFinish={() => setIsReady(true)}
      />
    );

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      <OfflineNotice />
      <NavigationContainer ref={navigationRef} theme={navigationTheme}>
        <AuthNavigator />
      </NavigationContainer>
    </AuthContext.Provider>
  );
}
