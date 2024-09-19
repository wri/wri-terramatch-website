import { createSelector } from "reselect";

import { authLogin } from "@/generated/v3/userService/userServiceComponents";
import { authLoginFetchFailed, authLoginIsFetching } from "@/generated/v3/userService/userServicePredicates";
import { Connection } from "@/types/connection";

type LoginConnection = {
  isLoggingIn: boolean;
  isLoggedIn: boolean;
  loginFailed: boolean;
  login: (emailAddress: string, password: string) => void;
};

const login = (emailAddress: string, password: string) => authLogin({ body: { emailAddress, password } });

export const loginConnection: Connection<LoginConnection> = {
  selector: createSelector([authLoginIsFetching, authLoginFetchFailed], (isLoggingIn, failedLogin) => {
    return {
      isLoggingIn,
      // TODO get from auth token
      isLoggedIn: false,
      loginFailed: failedLogin != null,

      login
    };
  })

  // selector(state: ApiDataStore): LoginConnection {
  //   const values = Object.values(state.logins);
  //   if (values.length > 1) {
  //     console.error("More than one Login recorded in the store!", state.logins);
  //   }
  //
  //   // TODO We don't actually want the token to be part of the shape in this case, or to come from
  //   //  the store. The token should always be fetched from local storage so that logins persist.
  //   const authToken = values[0]?.token;
  //   return {
  //     authToken,
  //     isLoggingIn: authLoginIsFetching(state),
  //     isLoggedIn: authToken != null,
  //     loginFailed: authLoginFetchFailed(state) != null,
  //     login: (emailAddress: string, password: string) => {
  //       authLogin({ body: { emailAddress, password } });
  //     }
  //   };
  // }
};
