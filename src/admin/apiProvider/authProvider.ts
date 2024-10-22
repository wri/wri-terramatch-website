import { AuthProvider } from "react-admin";

import { isAdmin } from "@/admin/apiProvider/utils/user";
import { fetchGetAuthLogout, fetchGetAuthMe, fetchPostAuthLogin } from "@/generated/apiComponents";

import { AdminTokenStorageKey, removeAccessToken, setAccessToken } from "./utils/token";

export const authProvider: AuthProvider = {
  // send username and password to the auth server and get back credentials
  login: params => {
    return fetchPostAuthLogin({ body: { email_address: params.username, password: params.password } })
      .then(async res => {
        //@ts-ignore
        const token = res.data.token;

        setAccessToken(token);
      })
      .catch(e => {
        console.log(e);
        throw Error("Wrong username or password");
      });
  },

  // when the dataProvider returns an error, check if this is an authentication error
  checkError: () => {
    return Promise.resolve();
  },

  // when the user navigates, make sure that their credentials are still valid
  checkAuth: async params => {
    const token = localStorage.getItem(AdminTokenStorageKey);
    if (!token) return Promise.reject();

    return new Promise((resolve, reject) => {
      fetchGetAuthMe({})
        .then(res => {
          //@ts-ignore
          if (isAdmin(res.data.role)) resolve();
          else reject("Only admins are allowed.");
        })
        .catch(() => reject());
    });
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

  // get the user's profile
  getIdentity: async () => {
    const token = localStorage.getItem(AdminTokenStorageKey);
    if (!token) return Promise.reject();

    return new Promise((resolve, reject) => {
      fetchGetAuthMe({})
        .then(response => {
          //@ts-ignore
          const userData = response.data;
          resolve({
            ...userData,
            fullName: `${userData.first_name} ${userData.last_name}`
          });
        })
        .catch(() => {
          reject();
        });
    });
  },

  // get the user permissions (optional)
  getPermissions: () => {
    return Promise.resolve();
  }
};
