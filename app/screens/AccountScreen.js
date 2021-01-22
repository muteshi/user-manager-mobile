import React from "react";
import { StyleSheet, View, FlatList } from "react-native";

import useAuth from "../auth/useAuth";
import Icon from "../components/Icon";

import ListItem from "../components/lists/ListItem";
import ListItemSeparator from "../components/lists/ListItemSeparator";
import Screen from "../components/Screen";
import colors from "../config/colors";
import routes from "../navigation/routes";
const defaultUserImage =
  "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png";

const menuItems = [
  {
    title: "Your users",
    icon: {
      name: "format-list-bulleted",
      backgroundColor: colors.primary,
    },
    targetScreen: "Users",
  },
  {
    title: "New admin requests",
    icon: {
      name: "format-list-bulleted",
      backgroundColor: colors.primary,
    },
    targetScreen: "UserRequestsScreen",
  },
];

function AccountScreen({ navigation, route }) {
  const { user, logOut, deleteAccount } = useAuth();
  const admin = user ? user.superuser || user.role === "admin" : null;

  return (
    <Screen style={styles.screen}>
      {user && (
        <View style={styles.container}>
          <ListItem
            title={user ? user.name : null}
            subTitle={user ? user.email : null}
            image={user.profile_photo ? user_profile : defaultUserImage}
            onPress={() => navigation.navigate(routes.USER)}
          />
        </View>
      )}
      {admin && (
        <View style={styles.container}>
          <FlatList
            data={menuItems}
            keyExtractor={(menuItem) => menuItem.title}
            ItemSeparatorComponent={ListItemSeparator}
            renderItem={({ item }) => (
              <ListItem
                title={item.title}
                IconComponent={
                  <Icon
                    name={item.icon.name}
                    backgroundColor={item.icon.backgroundColor}
                  />
                }
                onPress={() => navigation.navigate(item.targetScreen)}
              />
            )}
          />
        </View>
      )}
      {user ? (
        <>
          <ListItem
            title="Delete your account"
            IconComponent={
              <Icon name="delete-outline" backgroundColor="#b00000" />
            }
            onPress={() => {
              if (user.superuser) {
                alert("You cannot delete a super user account");
                return;
              }
              deleteAccount(user._id);
              navigation.navigate(routes.WELCOME_SCREEN);
            }}
          />
          <ListItem
            title="Logout"
            IconComponent={<Icon name="logout" backgroundColor="#ffe66d" />}
            onPress={() => logOut()}
          />
        </>
      ) : (
        <ListItem
          title="Login"
          IconComponent={<Icon name="login" backgroundColor="#ffe66d" />}
          onPress={() => navigation.navigate(routes.LOGIN)}
        />
      )}
    </Screen>
  );
}
const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
  },
  screen: {
    backgroundColor: colors.light,
  },
});

export default AccountScreen;
