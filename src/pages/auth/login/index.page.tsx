import { yupResolver } from "@hookform/resolvers/yup";
import { useT } from "@transifex/react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";

import { useLogin } from "@/connections/Login";
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
  const { returnUrl } = router.query;
  const [, { data: loginData, create: login, isCreating: isLoggingIn, createFailure: loginFailure }] = useLogin({});
  const { openToast } = useToastContext();

  const form = useForm<LoginFormDataType>({
    resolver: yupResolver(LoginFormDataSchema(t)),
    mode: "onSubmit"
  });

  useEffect(() => {
    if (loginData == null || !router.isReady) return;

    let redirectTarget: string | null = null;

    if (returnUrl && typeof returnUrl === "string") {
      redirectTarget = decodeURIComponent(returnUrl);
    } else if (typeof window !== "undefined") {
      const savedUrl = localStorage.getItem("dashboardReturnUrl");
      if (savedUrl) {
        redirectTarget = savedUrl;
        localStorage.removeItem("dashboardReturnUrl");
        localStorage.removeItem("dashboardReturnUrlTimestamp");
      }
    }

    if (redirectTarget) {
      setTimeout(() => {
        router.push(redirectTarget as string);
      }, 100);
    }
  }, [loginData, returnUrl, router, router.isReady]);

  useValueChanged(loginFailure, () => {
    if (loginFailure != null) openToast(t("Incorrect Email or Password"), ToastType.ERROR);
  });

  const handleSave = (data: LoginFormDataType) => login({ emailAddress: data.email, password: data.password });

  return (
    <LoginLayout>
      <LoginForm form={form} loading={isLoggingIn || loginData != null} handleSave={handleSave} />
    </LoginLayout>
  );
};
export default LoginPage;
