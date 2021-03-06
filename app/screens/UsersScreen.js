import React, { useEffect, useState } from "react";
import { StyleSheet, FlatList, View } from "react-native";

import ActivityIndicator from "../components/ActivityIndicator";
import AppText from "../components/AppText";
import AppButton from "../components/AppButton";
import colors from "../config/colors";
import usersApi from "../api/users";
import useApi from "../hooks/useApi";
import {
  ListItem,
  ListItemDeleteAction,
  ListItemSeparator,
} from "../components/lists";
import routes from "../navigation/routes";

function UsersScreen({ navigation }) {
  const [users, setUsers] = useState([]);
  const getUsersApi = useApi(usersApi.getUsers);
  const delUserApi = useApi(usersApi.deleteUser);

  useEffect(() => {
    getUsersApi.request();
  }, []);

  const handleDelete = (user) => {
    setUsers(getUsersApi.data.filter((u) => u._id !== user));
    delUserApi.request(user);
  };

  return (
    <>
      <ActivityIndicator visible={getUsersApi.loading} />
      {getUsersApi.error && (
        <>
          <AppText>Couldn't retrieve users.</AppText>
          <AppButton title="Retry" onPress={getUsersApi.request} />
        </>
      )}
      <FlatList
        data={users.length === 0 ? getUsersApi.data : users}
        keyExtractor={(user) => user._id}
        ItemSeparatorComponent={ListItemSeparator}
        renderItem={({ item }) => (
          <ListItem
            renderRightActions={() => (
              <ListItemDeleteAction onPress={() => handleDelete(item._id)} />
            )}
            title={item.name}
            image={
              item.profile_photo
                ? item.profile_photo
                : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
            }
            prefix={item.email}
            subTitle={item.role}
            onPress={() =>
              navigation.navigate(routes.USERPROFILESCREEN, {
                user: item,
                users: getUsersApi.data,
              })
            }
          />
        )}
      />
      <View style={styles.reservation}>
        <AppButton
          color="secondary"
          title="Add new user"
          onPress={() => {
            navigation.navigate(routes.REGISTER, users);
          }}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {},
  screen: {
    padding: 5,
    backgroundColor: colors.light,
  },
  reservation: {
    flexDirection: "row",
    justifyContent: "center",
  },
});

export default UsersScreen;
