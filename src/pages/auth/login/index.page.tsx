import { yupResolver } from "@hookform/resolvers/yup";
import { useT } from "@transifex/react";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import * as yup from "yup";

// import BackgroundLayout from "@/components/generic/Layout/BackgroundLayout";
// import ContentLayout from "@/components/generic/Layout/ContentLayout";
import { useAuthContext } from "@/context/auth.provider";
import { ToastType, useToastContext } from "@/context/toast.provider";
import { useSetInviteToken } from "@/hooks/useInviteToken";

import LoginLayout from "../layout";
import LoginForm from "./components/LoginForm";

export const LoginFormDataSchema = yup.object({
  email: yup.string().email().required(),
  password: yup.string().required()
});

export type LoginFormData = yup.InferType<typeof LoginFormDataSchema>;

const LoginPage = () => {
  useSetInviteToken();
  const t = useT();
  const router = useRouter();
  const { login, loginLoading, errorsRequest } = useAuthContext();
  const { openToast } = useToastContext();
  const form = useForm<LoginFormData>({
    resolver: yupResolver(LoginFormDataSchema),
    mode: "all"
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
      () => openToast(t("Incorrect email or password"), ToastType.ERROR)
    )) as { success: boolean };

    if (!res?.success) return;

    return router.push("/home");
  };

  return (
    // <BackgroundLayout>
    //   <ContentLayout>
    //     <LoginForm form={form} loading={loginLoading} handleSave={handleSave} />
    //   </ContentLayout>
    // </BackgroundLayout>
    <>
      <LoginLayout>
        <LoginForm form={form} loading={loginLoading} handleSave={handleSave} errorsRequest={errorsRequest} />
      </LoginLayout>
    </>
  );
};
export default LoginPage;
