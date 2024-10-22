import { destroyCookie, setCookie } from "nookies";

const TOKEN_STORAGE_KEY = "access_token";
const COOKIE_STORAGE_KEY = "accessToken";
const MiddlewareCacheKey = "middlewareCache";

export const getAccessToken = () => localStorage.getItem(TOKEN_STORAGE_KEY);

export const setAccessToken = (token: string) => {
  localStorage.setItem(TOKEN_STORAGE_KEY, token);
  setCookie(null, COOKIE_STORAGE_KEY, token, {
    maxAge: 60 * 60 * 12, // 12 hours
    secure: process.env.NODE_ENV !== "development",
    path: "/"
  });
};

export const removeAccessToken = () => {
  localStorage.removeItem(TOKEN_STORAGE_KEY);
  destroyCookie(null, COOKIE_STORAGE_KEY, {
    path: "/"
  });
  destroyCookie(null, MiddlewareCacheKey, {
    path: "/"
  });
};
