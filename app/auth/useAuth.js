import jwtDecode from "jwt-decode";
import { useContext } from "react";

import { AuthContext } from "./context";
import authStorage from "./storage";
import auth from "../api/auth";

export default useAuth = () => {
  const { user, setUser } = useContext(AuthContext);

  const logIn = (authToken) => {
    const user = jwtDecode(authToken);
    setUser(user);
    authStorage.storeToken(authToken);
  };

  const logOut = () => {
    setUser(null);
    auth.logoutUser();
    authStorage.removeToken();
  };

  return { user, logIn, logOut };
};
