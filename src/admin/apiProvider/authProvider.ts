import { AuthProvider, UserIdentity } from "react-admin";

import { selectLogin } from "@/connections/Login";
import { loadMyUser } from "@/connections/User";
import { logout } from "@/generated/v3/utils";
import Log from "@/utils/log";

export type TMUserIdentity = UserIdentity & { primaryRole: string };

export const authProvider: AuthProvider = {
  login: async () => {
    Log.error("Admin app does not support direct login");
  },

  checkError: async () => {},

  // when the user navigates, make sure that their credentials are still valid
  checkAuth: async () => {
    const { user, isAdmin } = await loadMyUser();
    if (user == null) throw "No user logged in.";

    if (!isAdmin) throw "Only admins are allowed.";
  },

  // remove local credentials
  logout: async () => {
    const { data } = selectLogin({});
    if (data != null) logout();
  },

  getIdentity: async () => {
    const { user } = await loadMyUser();
    if (user == null) throw "No user logged in.";

    return { id: user.uuid, fullName: user.fullName ?? undefined, primaryRole: user.primaryRole } as TMUserIdentity;
  },

  // get the user permissions (optional)
  getPermissions: () => {
    return Promise.resolve();
  }
};
