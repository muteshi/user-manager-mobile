import * as SecureStore from "expo-secure-store";
import jwtDecode from "jwt-decode";

const key = "authToken";

const storeToken = async (authToken) => {
  try {
    await SecureStore.setItemAsync(key, authToken);
  } catch (error) {
    console.log("Error storing auth token");
  }
};

const getToken = async () => {
  try {
    return await SecureStore.getItemAsync(key);
  } catch (error) {
    console.log("Error getting the auth token", error);
  }
};

const getUser = async () => {
  try {
    const token = await getToken();
    return token && new Date(jwtDecode(token).exp * 1000) > new Date()
      ? jwtDecode(token)
      : removeToken();
  } catch (error) {
    console.log("Error getting user", error);
  }
};

const removeToken = async () => {
  try {
    return await SecureStore.deleteItemAsync(key);
  } catch (error) {
    console.log("Error deleting the auth token", error);
  }
};

export default {
  getToken,
  getUser,
  storeToken,
  removeToken,
};
