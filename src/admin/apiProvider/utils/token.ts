import { destroyCookie, setCookie } from "nookies";

export const AdminTokenStorageKey = "access_token";
export const AdminCookieStorageKey = "accessToken";
const MiddlewareCacheKey = "middlewareCache";

export const setAccessToken = (token: string) => {
  localStorage.setItem(AdminTokenStorageKey, token);
  setCookie(null, AdminCookieStorageKey, token, {
    maxAge: 60 * 60 * 12, // 12 hours
    secure: process.env.NODE_ENV !== "development",
    path: "/"
  });
};

export const removeAccessToken = () => {
  localStorage.removeItem(AdminTokenStorageKey);
  destroyCookie(null, AdminCookieStorageKey, {
    path: "/"
  });
  destroyCookie(null, MiddlewareCacheKey, {
    path: "/"
  });
};
