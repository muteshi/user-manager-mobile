import Constants from "expo-constants";

const settings = {
  dev: {
    apiUrl: "http://192.168.0.95:3000",
  },
  staging: {
    apiUrl: "https://muteshi-user-manager-api.herokuapp.com",
  },
  prod: {
    apiUrl: "https://muteshi-user-manager-api.herokuapp.com",
  },
};

const getCurrentSettings = () => {
  if (__DEV__) return settings.dev;
  if (Constants.manifest.releaseChannel === "staging") return settings.staging;
  return settings.prod;
};

export default getCurrentSettings();
