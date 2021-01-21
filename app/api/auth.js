import client from "./client";

const login = (email, password) =>
  client.post("/users/login", { email, password });

const logoutUser = () => client.post("/users/logout-all");

export default {
  login,
  logoutUser,
};
