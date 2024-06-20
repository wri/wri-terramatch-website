import { yupResolver } from "@hookform/resolvers/yup";
import { useT } from "@transifex/react";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import * as yup from "yup";

import { useAuthContext } from "@/context/auth.provider";
import { ToastType, useToastContext } from "@/context/toast.provider";
import { useSetInviteToken } from "@/hooks/useInviteToken";

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
  const { login, loginLoading } = useAuthContext();
  const { openToast } = useToastContext();
  const form = useForm<LoginFormDataType>({
    resolver: yupResolver(LoginFormDataSchema(t)),
    mode: "onSubmit"
  });

  /**
   * Form Submit Handler
   * @param data LoginFormData
   * @returns Log in user and redirect to homepage
   */
  const handleSave = async (data: LoginFormDataType) => {
    const res = (await login(
      {
        email_address: data.email,
        password: data.password
      },
      () => openToast(t("Incorrect Email or Password"), ToastType.ERROR)
    )) as { success: boolean };

    if (!res?.success) return;

    return router.push("/home");
  };

  return (
    <LoginLayout>
      <LoginForm form={form} loading={loginLoading} handleSave={handleSave} />
    </LoginLayout>
  );
};
export default LoginPage;
