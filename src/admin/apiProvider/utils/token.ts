import { destroyCookie, setCookie } from "nookies";

export const AdminTokenStorageKey = "access_token";
export const AdminCookieStorageKey = "accessToken";

export const setAccessToken = (token: string) => {
  // Required for V1
  localStorage.setItem(AdminTokenStorageKey, token);
  // Required for V2
  setCookie(null, AdminCookieStorageKey, token, {
    maxAge: 60 * 60 * 12, // 12 hours
    secure: process.env.NODE_ENV !== "development",
    path: "/"
  });
};

export const removeAccessToken = () => {
  localStorage.removeItem(AdminTokenStorageKey);
  localStorage.removeItem("persist:root");
  destroyCookie(null, AdminCookieStorageKey, {
    path: "/"
  });
};
