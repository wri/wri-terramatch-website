import { yupResolver } from "@hookform/resolvers/yup";
import { useT } from "@transifex/react";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import * as yup from "yup";

import { login, useLogin } from "@/connections/Login";
import { ToastType, useToastContext } from "@/context/toast.provider";
import { useSetInviteToken } from "@/hooks/useInviteToken";
import { useValueChanged } from "@/hooks/useValueChanged";

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
  const [, { isLoggedIn, isLoggingIn, loginFailed }] = useLogin();
  const { openToast } = useToastContext();
  const form = useForm<LoginFormDataType>({
    resolver: yupResolver(LoginFormDataSchema(t)),
    mode: "onSubmit"
  });

  useValueChanged(loginFailed, () => {
    if (loginFailed) openToast(t("Incorrect Email or Password"), ToastType.ERROR);
  });
  useValueChanged(isLoggedIn, () => {
    if (isLoggedIn) router.push("/home");
  });

  const handleSave = (data: LoginFormDataType) => login(data.email, data.password);

  return (
    <LoginLayout>
      <LoginForm form={form} loading={isLoggingIn || isLoggedIn} handleSave={handleSave} />
    </LoginLayout>
  );
};
export default LoginPage;
