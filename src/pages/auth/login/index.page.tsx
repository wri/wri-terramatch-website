import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import * as yup from "yup";

import BackgroundLayout from "@/components/generic/Layout/BackgroundLayout";
import ContentLayout from "@/components/generic/Layout/ContentLayout";
import { useAuthContext } from "@/context/auth.provider";

import LoginForm from "./components/LoginForm";

export const LoginFormDataSchema = yup.object({
  email: yup.string().email().required(),
  password: yup.string().required()
});

export type LoginFormData = yup.InferType<typeof LoginFormDataSchema>;

const LoginPage = () => {
  const router = useRouter();
  const { login, loginLoading, error } = useAuthContext();

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
    const res = (await login({
      email_address: data.email,
      password: data.password
    })) as { success: boolean };

    if (!res?.success) return;

    return router.push("/home");
  };

  return (
    <BackgroundLayout>
      <ContentLayout>
        <LoginForm form={form} loading={loginLoading} handleSave={handleSave} loginError={error} />
      </ContentLayout>
    </BackgroundLayout>
  );
};

export default LoginPage;
