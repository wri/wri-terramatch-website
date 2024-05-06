import { createContext, useContext, useState } from "react";

import { setAccessToken } from "@/admin/apiProvider/utils/token";
import { usePostAuthLogin } from "@/generated/apiComponents";
import { AuthLogIn } from "@/generated/apiSchemas";

interface IAuthContext {
  login: (body: AuthLogIn, onError?: () => void) => Promise<unknown>;
  loginLoading: boolean;
  token?: string;
  errorsRequest?: {
    stack: { errors: [] };
  };
}

export const AuthContext = createContext<IAuthContext>({
  login: async () => {},
  loginLoading: false,
  token: "",
  errorsRequest: { stack: { errors: [] } }
});

type AuthProviderProps = { children: React.ReactNode; token?: string };

const AuthProvider = ({ children, token }: AuthProviderProps) => {
  const [errorsRequest, setErrorsRequest] = useState<any>();
  const { mutateAsync: authLogin, isLoading: loginLoading } = usePostAuthLogin({
    onError: stack => {
      setErrorsRequest({ stack });
    }
  });

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
        loginLoading,
        errorsRequest
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);

export default AuthProvider;
