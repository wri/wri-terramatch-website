import { isFetching, fetchFailed } from "../utils";
import { ApiDataStore } from "@/store/apiSlice";

export const authLoginIsFetching = (state: ApiDataStore) =>
  isFetching<{}, {}>({ state, url: "/auth/v3/logins", method: "post" });

export const authLoginFetchFailed = (state: ApiDataStore) =>
  fetchFailed<{}, {}>({ state, url: "/auth/v3/logins", method: "post" });
