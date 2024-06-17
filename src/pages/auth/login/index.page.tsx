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

export const LoginFormDataSchema = yup.object({
  email: yup.string().email().required(),
  password: yup.string().required("Password is required")
});

export type LoginFormData = yup.InferType<typeof LoginFormDataSchema>;

const LoginPage = () => {
  useSetInviteToken();
  const t = useT();
  const router = useRouter();
  const { login, loginLoading } = useAuthContext();
  const { openToast } = useToastContext();
  const form = useForm<LoginFormData>({
    resolver: yupResolver(LoginFormDataSchema),
    mode: "onSubmit"
  });

  /**
   * Form Submit Handler
   * @param data LoginFormData
   * @returns Log in user and redirect to homepage
   */
  const handleSave = async (data: LoginFormData) => {
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
