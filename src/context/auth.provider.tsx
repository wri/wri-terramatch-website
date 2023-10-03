import { createContext, useContext } from "react";

import { setAccessToken } from "@/admin/apiProvider/utils/token";
import { PostAuthLoginError, usePostAuthLogin } from "@/generated/apiComponents";
import { AuthLogIn } from "@/generated/apiSchemas";

interface IAuthContext {
  login: (body: AuthLogIn) => Promise<unknown>;
  loginLoading: boolean;
  token?: string;
  error?: PostAuthLoginError | null;
}

export const AuthContext = createContext<IAuthContext>({
  login: async () => {},
  loginLoading: false,
  token: "",
  error: null
});

type AuthProviderProps = { children: React.ReactNode; token?: string };

const AuthProvider = ({ children, token }: AuthProviderProps) => {
  const { mutateAsync: authLogin, isLoading: loginLoading, error: authError } = usePostAuthLogin();

  const login = async (body: AuthLogIn) => {
    const res = await authLogin({
      body
    });

    // @ts-expect-error
    const token = res["data"].token;

    setAccessToken(token);

    if (!token) return;

    return { success: true };
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        login,
        loginLoading,
        error: authError
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);

export default AuthProvider;
