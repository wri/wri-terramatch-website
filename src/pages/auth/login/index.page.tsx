import { yupResolver } from "@hookform/resolvers/yup";
import { useT } from "@transifex/react";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import * as yup from "yup";

import { loginConnection } from "@/connections/Login";
// import { useAuthContext } from "@/context/auth.provider";
import { ToastType, useToastContext } from "@/context/toast.provider";
import { useConnection } from "@/hooks/useConnection";
import { useSetInviteToken } from "@/hooks/useInviteToken";
import { useValueChanged } from "@/hooks/usePrevious";

import LoginLayout from "../layout";
import LoginForm from "./components/LoginForm";

export type LoginFormDataType = {
  email: string;
  password: string;
};

export const LoginFormDataSchema = (t: any) => {
  return yup.object<LoginFormDataType>({
    email: yup.string().email().required(),
    password: yup.string().required(t("Password is required"))
  });
};

const LoginPage = () => {
  useSetInviteToken();
  const t = useT();
  const router = useRouter();
  //const { login, loginLoading } = useAuthContext();
  const [, { isLoggedIn, isLoggingIn, loginFailed, login }] = useConnection(loginConnection);
  const { openToast } = useToastContext();
  const form = useForm<LoginFormDataType>({
    resolver: yupResolver(LoginFormDataSchema(t)),
    mode: "onSubmit"
  });

  useValueChanged(loginFailed, () => {
    if (loginFailed) openToast(t("Incorrect Email or Password"), ToastType.ERROR);
  });

  const handleSave = (data: LoginFormDataType) => login(data.email, data.password);

  if (isLoggedIn) return router.push("/home");

  return (
    <LoginLayout>
      <LoginForm form={form} loading={isLoggingIn} handleSave={handleSave} />
    </LoginLayout>
  );
};
export default LoginPage;
