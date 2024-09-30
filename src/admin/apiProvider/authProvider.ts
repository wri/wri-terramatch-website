import { AuthProvider } from "react-admin";

import { isAdmin, UserRole } from "@/admin/apiProvider/utils/user";
import { loadLogin, logout } from "@/connections/Login";
import { loadMyUser } from "@/connections/User";
import Log from "@/utils/log";

export const authProvider: AuthProvider = {
  login: async () => {
    Log.error("Admin app does not support direct login");
  },

  checkError: async () => {},

  // when the user navigates, make sure that their credentials are still valid
  checkAuth: async () => {
    const { user } = await loadMyUser();
    if (user == null) throw "No user logged in.";

    if (!isAdmin(user.primaryRole as UserRole)) throw "Only admins are allowed.";
  },

  // remove local credentials
  logout: async () => {
    const { isLoggedIn } = await loadLogin();
    if (isLoggedIn) {
      logout();
      window.location.replace("/auth/login");
    }
  },

  getIdentity: async () => {
    const { user } = await loadMyUser();
    if (user == null) throw "No user logged in.";

    return { id: user.uuid, fullName: user.fullName, primaryRole: user.primaryRole };
  },

  // get the user permissions (optional)
  getPermissions: () => {
    return Promise.resolve();
  }
};
