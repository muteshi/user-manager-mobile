import client from "./client";

const usersEndpoint = "/users";

const register = (userInfo) => client.post(usersEndpoint, userInfo);
const editUser = (userInfo, onUploadProgress, userId) =>
  client.patch(`${usersEndpoint}/${userId}/edit-account`, userInfo, {
    onUploadProgress: (progress) =>
      onUploadProgress(progress.loaded / progress.total),
  });
const getUsers = () => client.get(usersEndpoint);
const logOut = () => client.get(`${usersEndpoint}/logout-all`);
const deleteUser = (userId) =>
  client.delete(`${usersEndpoint}/${userId}/delete-account`);
const uploadProfilePhoto = (photo) =>
  client.post(`${usersEndpoint}/profile/photo`, photo, {
    "Content-Type": "multipart/form-data; ",
  });

export default {
  register,
  getUsers,
  deleteUser,
  editUser,
  logOut,
  uploadProfilePhoto,
};
