import { AuthProvider } from "react-admin";

import { fetchGetAuthLogout } from "@/generated/apiComponents";
import Log from "@/utils/log";

import { AdminTokenStorageKey, removeAccessToken } from "./utils/token";

export const authProvider: AuthProvider = {
  // send username and password to the auth server and get back credentials
  login: async () => {
    Log.error("Admin app does not support direct login");
  },

  // when the dataProvider returns an error, check if this is an authentication error
  checkError: () => {
    return Promise.resolve();
  },

  // when the user navigates, make sure that their credentials are still valid
  checkAuth: async () => {
    const token = localStorage.getItem(AdminTokenStorageKey);
    if (!token) return Promise.reject();

    // TODO (TM-1312) Once we have a connection for the users/me object, we can check the cached
    //  value without re-fetching on every navigation in the admin UI. The previous implementation
    //  is included below for reference until that ticket is complete.
    // return new Promise((resolve, reject) => {
    //   fetchGetAuthMe({})
    //     .then(res => {
    //       //@ts-ignore
    //       if (isAdmin(res.data.role)) resolve();
    //       else reject("Only admins are allowed.");
    //     })
    //     .catch(() => reject());
    // });
  },
  // remove local credentials and notify the auth server that the user logged out
  logout: async () => {
    const token = localStorage.getItem(AdminTokenStorageKey);
    if (!token) return Promise.resolve();

    return new Promise(resolve => {
      fetchGetAuthLogout({})
        .then(async () => {
          removeAccessToken();
          window.location.replace("/auth/login");
        })
        .catch(() => {
          resolve();
        });
    });
  },

  // get the user permissions (optional)
  getPermissions: () => {
    return Promise.resolve();
  }
};
