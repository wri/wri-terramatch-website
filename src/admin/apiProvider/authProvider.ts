import { AuthProvider } from "react-admin";

import { isAdmin, UserRole } from "@/admin/apiProvider/utils/user";
import { loginConnection, logout } from "@/connections/Login";
import { myUserConnection } from "@/connections/User";
import { loadConnection } from "@/utils/loadConnection";
import Log from "@/utils/log";

export const authProvider: AuthProvider = {
  login: async () => {
    Log.error("Admin app does not support direct login");
  },

  checkError: async () => {},

  // when the user navigates, make sure that their credentials are still valid
  checkAuth: async () => {
    const { user } = await loadConnection(myUserConnection);
    if (user == null) throw "No user logged in.";

    if (!isAdmin(user.primaryRole as UserRole)) throw "Only admins are allowed.";
  },

  // remove local credentials
  logout: async () => {
    console.log("LOGOUT");
    const { isLoggedIn } = await loadConnection(loginConnection);
    if (isLoggedIn) {
      logout();
      window.location.replace("/auth/login");
    }
  },

  getIdentity: async () => {
    const { user } = await loadConnection(myUserConnection);
    if (user == null) throw "No user logged in.";

    return { id: user.uuid, fullName: user.fullName, primaryRole: user.primaryRole };
  },

  // get the user permissions (optional)
  getPermissions: () => {
    return Promise.resolve();
  }
};
