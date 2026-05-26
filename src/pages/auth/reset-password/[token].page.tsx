import { yupResolver } from "@hookform/resolvers/yup";
import { useT } from "@transifex/react";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import * as yup from "yup";

import { usePasswordStrength } from "@/components/extensive/PasswordStrength/hooks/usePasswordStrength";
import BackgroundLayout from "@/components/generic/Layout/BackgroundLayout";
import ContentLayout from "@/components/generic/Layout/ContentLayout";
import { useResetPassword } from "@/connections/ResetPassword";

import ResetPasswordForm from "./components/ResetPasswordForm";

const ResetPasswordDataSchema = yup.object({
  password: yup.string().required(),
  confirmPassword: yup.string().required()
});

export type ResetPasswordData = yup.InferType<typeof ResetPasswordDataSchema>;

const ResetPasswordPage = () => {
  const router = useRouter();
  const t = useT();
  const form = useForm<ResetPasswordData>({
    resolver: yupResolver(ResetPasswordDataSchema),
    mode: "all"
  });

  const [, { isLoading, requestFailed, isSuccess, resetPassword }] = useResetPassword({
    token: router.query.token as string
  });

  const { strength } = usePasswordStrength({ password: form.watch("password") });

  const handleSave = async (data: ResetPasswordData) => {
    try {
      if (strength !== "Strong")
        return form.setError("password", {
          message: t(
            "The password does not meet the minimum requirements. Please check that it contains at least 8 characters, including uppercase letters, lowercase letters and numbers."
          )
        });
      if (data.password !== data.confirmPassword)
        return form.setError("confirmPassword", { message: t("Passwords must match.") });

      if (!router.query.token) {
        router.push("/");
      } else {
        resetPassword(data.password);
      }
    } catch (err: any) {
      if (err.errors.length > 0) {
        const errorMessage = err.errors[0].detail;
        form.setError("password", { message: errorMessage });
      }
    }
  };

  return (
    <BackgroundLayout>
      <ContentLayout>
        <ResetPasswordForm
          form={form}
          loading={isLoading}
          handleSave={handleSave}
          apiError={requestFailed}
          success={isSuccess}
        />
      </ContentLayout>
    </BackgroundLayout>
  );
};

export default ResetPasswordPage;
