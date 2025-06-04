import { yupResolver } from "@hookform/resolvers/yup";
import { useT } from "@transifex/react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";

import { usePasswordStrength } from "@/components/extensive/PasswordStrength/hooks/usePasswordStrength";
import BackgroundLayout from "@/components/generic/Layout/BackgroundLayout";
import ContentLayout from "@/components/generic/Layout/ContentLayout";
import { useGetAuthMail, usePostAuthStore } from "@/generated/apiComponents";

import SetPasswordForm from "./components/SetPasswordForm";

const ResetPasswordDataSchema = yup.object({
  password: yup.string().required(),
  confirmPassword: yup.string().required()
});

export type ResetPasswordData = yup.InferType<typeof ResetPasswordDataSchema>;

const ResetPasswordPage = () => {
  const router = useRouter();
  const t = useT();

  const { mutateAsync: requestResetPassword, isLoading, error, isSuccess } = usePostAuthStore();
  const form = useForm<ResetPasswordData>({
    resolver: yupResolver(ResetPasswordDataSchema),
    mode: "all"
  });

  const { strength } = usePasswordStrength({ password: form.watch("password") });

  const { isLoading: gettingEmail, data: authMailData } = useGetAuthMail(
    {
      queryParams: {
        token: router.query.token as string
      }
    },
    {
      enabled: !!router.query.token
    }
  );

  useEffect(() => {
    const locale = authMailData?.data?.locale;
    // Make sure we're displaying in the user's selected locale
    if (locale != null && locale !== router.locale) {
      router.push({ pathname: router.pathname, query: router.query }, router.asPath, { locale });
    }
  }, [authMailData, router]);

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
        await requestResetPassword({
          body: {
            token: router.query.token as string,
            password: data.password
          }
        });
      }
    } catch (err: any) {
      if (err.errors.length > 0) {
        const errorMessage = err.errors[0].detail;
        form.setError("password", { message: errorMessage });
      }
    }
  };

  if (gettingEmail) return null;

  return (
    <BackgroundLayout>
      <ContentLayout>
        <SetPasswordForm
          form={form}
          userMail={authMailData?.data?.email_address ?? undefined}
          tokenUsed={authMailData?.data?.token_used ?? false}
          loading={isLoading}
          handleSave={handleSave}
          apiError={error}
          success={isSuccess}
        />
      </ContentLayout>
    </BackgroundLayout>
  );
};

export default ResetPasswordPage;
