import client from "./client";

const login = (email, password) =>
  client.post("/users/login", { email, password });

const logoutUser = () => client.post("/users/logout-all");
const deleteUser = (userId) => client.delete(`/users/${userId}/delete-account`);

export default {
  deleteUser,
  login,
  logoutUser,
};
