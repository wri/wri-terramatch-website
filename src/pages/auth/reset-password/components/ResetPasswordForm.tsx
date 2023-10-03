import { useT } from "@transifex/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { UseFormReturn } from "react-hook-form";
import { Else, If, Then } from "react-if";

import Input from "@/components/elements/Inputs/Input/Input";
import Text from "@/components/elements/Text/Text";
import Form from "@/components/extensive/Form/Form";
import PasswordStrength from "@/components/extensive/PasswordStrength/PasswordStrength";
import { PostAuthLoginError } from "@/generated/apiComponents";

import { ResetPasswordData } from "../[token].page";

type ResetPasswordFormProps = {
  form: UseFormReturn<ResetPasswordData>;
  handleSave: (data: ResetPasswordData) => Promise<void>;
  loading?: boolean;
  apiError?: PostAuthLoginError | null;
  success?: boolean;
};

const ResetPasswordForm = ({ form, loading, handleSave, success }: ResetPasswordFormProps) => {
  const t = useT();
  const errors = form.formState.errors;
  const router = useRouter();
  const isAdmin = router.asPath.includes("/admin");

  const signInUrl = isAdmin ? "/admin" : "/auth/login";

  return (
    <Form>
      <Form.Header title={t("Reset Password")} />
      <If condition={!success}>
        <Then>
          <div className="flex flex-col gap-4">
            <Input
              name="password"
              form={form}
              error={errors.password}
              type="password"
              label={t("New Password")}
              required
            />
            <PasswordStrength password={form.watch("password")} />
          </div>
          <Input
            name="confirmPassword"
            form={form}
            error={errors.confirmPassword}
            type="password"
            label={t("Repeat New Password")}
            required
          />
          <Form.Footer
            primaryButtonProps={{
              children: t("Reset Password"),
              onClick: form.handleSubmit(handleSave),
              disabled: loading
            }}
            secondaryButtonProps={{
              children: t("Cancel"),
              as: Link,
              href: "/",
              disabled: loading
            }}
          />
        </Then>
        <Else>
          <Text variant="text-body-1000" className="text-center">
            {t("Your password has been reset. Please click Sign in to continue using TerraMatch.")}
          </Text>
          <Form.Footer
            primaryButtonProps={{
              children: t("Sign In"),
              as: Link,
              href: signInUrl,
              disabled: loading
            }}
            secondaryButtonProps={{
              children: t("Cancel"),
              as: Link,
              href: "/",
              disabled: loading
            }}
          />
        </Else>
      </If>
    </Form>
  );
};

export default ResetPasswordForm;
