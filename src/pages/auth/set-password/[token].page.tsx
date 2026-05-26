import { yupResolver } from "@hookform/resolvers/yup";
import { useT } from "@transifex/react";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";

import { usePasswordStrength } from "@/components/extensive/PasswordStrength/hooks/usePasswordStrength";
import BackgroundLayout from "@/components/generic/Layout/BackgroundLayout";
import ContentLayout from "@/components/generic/Layout/ContentLayout";
import { useGetResetPassword, useResetPassword } from "@/connections/ResetPassword";

import SetPasswordForm from "./components/SetPasswordForm";

const ResetPasswordDataSchema = yup.object({
  password: yup.string().required(),
  confirmPassword: yup.string().required()
});

export type ResetPasswordData = yup.InferType<typeof ResetPasswordDataSchema>;

const ResetPasswordPage = () => {
  const router = useRouter();
  const t = useT();
  const [hasBeenCalled, setHasBeenCalled] = useState<boolean>(false);

  const [, { isLoading, requestFailed, resetPassword }] = useResetPassword({
    token: router.query.token as string
  });

  const form = useForm<ResetPasswordData>({
    resolver: yupResolver(ResetPasswordDataSchema),
    mode: "all"
  });

  const { strength } = usePasswordStrength({ password: form.watch("password") });

  const [resetPasswordTokenLoaded, { data: resetPasswordTokenData }] = useGetResetPassword({
    token: router.query.token as string,
    enabled: !!router.query.token
  });

  useEffect(() => {
    const locale = resetPasswordTokenData?.locale;
    // Make sure we're displaying in the user's selected locale
    if (locale != null && locale !== router.locale) {
      router.push({ pathname: router.pathname, query: router.query }, router.asPath, { locale });
    }
  }, [resetPasswordTokenData, router]);

  const handleSave = useCallback(
    async (data: ResetPasswordData) => {
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
          setHasBeenCalled(true);
          await resetPassword(data.password);
        }
      } catch (err: any) {
        if (err.errors.length > 0) {
          const errorMessage = err.errors[0].detail;
          form.setError("password", { message: errorMessage });
        }
      }
    },
    [form, resetPassword, router, strength, t]
  );

  if (!resetPasswordTokenLoaded) return null;

  return (
    <BackgroundLayout>
      <ContentLayout>
        <SetPasswordForm
          form={form}
          userMail={resetPasswordTokenData?.emailAddress ?? undefined}
          tokenUsed={resetPasswordTokenData?.tokenUsed ?? false}
          loading={isLoading}
          handleSave={handleSave}
          apiError={requestFailed}
          success={hasBeenCalled}
        />
      </ContentLayout>
    </BackgroundLayout>
  );
};

export default ResetPasswordPage;
