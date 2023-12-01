import { createContext, useContext } from "react";

import { setAccessToken } from "@/admin/apiProvider/utils/token";
import { usePostAuthLogin } from "@/generated/apiComponents";
import { AuthLogIn } from "@/generated/apiSchemas";

interface IAuthContext {
  login: (body: AuthLogIn, onError?: () => void) => Promise<unknown>;
  loginLoading: boolean;
  token?: string;
}

export const AuthContext = createContext<IAuthContext>({
  login: async () => {},
  loginLoading: false,
  token: ""
});

type AuthProviderProps = { children: React.ReactNode; token?: string };

const AuthProvider = ({ children, token }: AuthProviderProps) => {
  const { mutateAsync: authLogin, isLoading: loginLoading } = usePostAuthLogin();

  const login = async (body: AuthLogIn, onError?: () => void) => {
    return new Promise(r => {
      authLogin({
        body
      })
        .then(res => {
          // @ts-expect-error
          const token = res["data"].token;

          setAccessToken(token);

          r({ success: true });
        })
        .catch(() => {
          onError?.();
          r({ success: false });
        });
    });
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        login,
        loginLoading
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);

export default AuthProvider;
