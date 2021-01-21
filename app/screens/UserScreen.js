import React, { useState } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import Card from "../components/Card";
import useAuth from "../auth/useAuth";
import * as Yup from "yup";
import {
  AppForm as Form,
  AppFormField,
  AppFormPicker,
  FormImagePicker,
  SubmitButton,
} from "../components/forms";
import Screen from "../components/Screen";
import userApi from "../api/users";
import CategoryPickerItem from "../components/CategoryPickerItem";
import UploadScreen from "./UploadScreen";
import routes from "../navigation/routes";

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

function UserScreen({ navigation, route }) {
  const { user } = useAuth();
  const [uploadVisible, setUploadVisible] = useState(false);
  const [progress, setProgress] = useState(0);

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
    Object.keys(userData).forEach((key) =>
      userData[key] === null ? delete userData[key] : {}
    );

    const profilePhoto =
      userData.images.length !== 0
        ? userData.images[0].replace("file:/", "")
        : [];

    const file = {
      name: "profilePhoto",
      type: "image/jpeg",
      uri: profilePhoto,
    };

    if (profilePhoto.length !== 0) {
      const data = new FormData();
      data.append("file", file);
      const res = await userApi.uploadProfilePhoto(data);
      if (!res.ok) {
        alert(res.data.error);
        return;
      }
    }

    delete userData.images;

    const role = userData.hasOwnProperty("role")
      ? userData.role.value
      : user.role;

    const approved =
      userData.hasOwnProperty("role") && userData.role.value === "admin"
        ? (userData.approved = false)
        : user.approved;

    const result = await userApi.editUser(
      {
        ...userData,
        role,
        approved,
      },
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
            images: [],
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
          <FormImagePicker name="images" />
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

export default UserScreen;
