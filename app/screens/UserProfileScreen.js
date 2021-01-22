import React, { useState } from "react";
import { StyleSheet, ScrollView } from "react-native";
import Card from "../components/Card";

import * as Yup from "yup";
import {
  AppForm as Form,
  AppFormField,
  AppFormPicker,
  SubmitButton,
} from "../components/forms";
import Screen from "../components/Screen";
import userApi from "../api/users";
import CategoryPickerItem from "../components/CategoryPickerItem";
import UploadScreen from "./UploadScreen";
import routes from "../navigation/routes";
import AdminPicker from "../components/AdminPicker";
import { useEffect } from "react";
import useApi from "../hooks/useApi";

const roles = [
  {
    backgroundColor: "#fc5c65",
    icon: "account-outline",
    label: "Normal user",
    value: "member",
  },
  {
    backgroundColor: "#fd9644",
    icon: "account-key-outline",
    label: "Admin user",
    value: "admin",
  },
];

const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

const defaultUserImage =
  "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png";

function UserProfileScreen({ navigation, route }) {
  const getUsersApi = useApi(userApi.getUsers);
  const user = route.params.user;
  const users = route.params.users;
  const [uploadVisible, setUploadVisible] = useState(false);
  const [progress, setProgress] = useState(0);
  const [admin, setAdmin] = useState([]);

  useEffect(() => {
    getUsersApi.request();
  }, []);

  const admins = users.filter((u) => u.role === "admin");

  const validationSchema = Yup.object().shape({
    name: user
      ? Yup.string().required().min(4).label(user.name)
      : Yup.string().required().label("Name"),
    email: user
      ? Yup.string().email().required().label(user.email)
      : Yup.string().required().email().label("Email"),
    phone: user
      ? Yup.string()
          .matches(phoneRegExp, "Mobile number is not valid")
          .label(user.phone)
          .min(10)
      : Yup.string()
          .matches(phoneRegExp, "Mobile number is not valid")
          .min(10)
          .nullable()
          .label("Mobile number"),
    role: Yup.object().nullable().label("Role"),
    password: Yup.string().nullable().min(6).label("Password"),
  });

  const handleSubmit = async (userData) => {
    setProgress(0);
    setUploadVisible(true);

    const role =
      userData.hasOwnProperty("role") && userData.role !== null
        ? userData.role.value
        : null;

    const approved =
      userData.hasOwnProperty("role") &&
      userData.role !== null &&
      userData.role.value === "admin"
        ? true
        : null;

    const owner = admin.length !== 0 ? admin[0]._id : null;

    userData["approved"] = approved;
    userData["owner"] = owner;
    userData["role"] = role;

    Object.keys(userData).forEach((key) =>
      userData[key] === null ? delete userData[key] : {}
    );

    const result = await userApi.editUser(
      userData,
      (progress) => setProgress(progress),
      user._id
    );

    if (!result.ok) {
      setUploadVisible(false);
      return alert("Could not save the listing");
    }
  };
  return (
    <Screen style={styles.container}>
      <Card
        title={user.name}
        imageUrl={user.profile_photo ? user.profile_photo : defaultUserImage}
        memberType={user.role}
      />
      <UploadScreen
        progress={progress}
        visible={uploadVisible}
        onDone={() => {
          setUploadVisible(false);
          navigation.navigate(routes.ACCOUNT_SCREEN);
        }}
      />
      <ScrollView style={styles.scrollView}>
        <Form
          initialValues={{
            name: user.name ? user.name : null,
            password: null,
            email: user.email ? user.email : null,
            phone: user.phone ? user.phone : null,
            role: null,
          }}
          onSubmit={handleSubmit}
          validationSchema={validationSchema}
        >
          <AppFormField
            maxLength={255}
            name="name"
            autoFocus={user ? true : false}
            defaultValue={user.name ? user.name : ""}
            placeholder="Your full name"
          />
          <AppFormField
            autoCapitalize="none"
            autoCorrect={false}
            icon="email-outline"
            keyboardType="email-address"
            name="email"
            placeholder="Email"
            defaultValue={user.email ? user.email : ""}
            textContentType="emailAddress"
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
          <AppFormField
            keyboardType="phone-pad"
            icon="cellphone"
            defaultValue={user.phone ? user.phone : ""}
            name="phone"
            placeholder="Mobile phone"
          />
          <AdminPicker
            selectedUser={
              admin.length !== 0 ? admin[0].name : "Assign user to admin"
            }
            onSelectUser={(userA) => {
              const adminId = getUsersApi.data.filter(
                (u) => u._id === userA._id
              );
              setAdmin(adminId);
            }}
            users={admins}
            icon="apps"
            placeholder="Assign user to admin"
          />

          <AppFormPicker
            items={roles}
            name="role"
            numberOfColumns={2}
            PickerItemComponent={CategoryPickerItem}
            placeholder="Member type"
            width="50%"
          />

          <SubmitButton title="Update details" />
        </Form>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
});

export default UserProfileScreen;
