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

type SetPasswordFormProps = {
  form: UseFormReturn<ResetPasswordData>;
  userMail?: string;
  tokenUsed?: boolean;
  handleSave: (data: ResetPasswordData) => Promise<void>;
  loading?: boolean;
  apiError?: PostAuthLoginError | null;
  success?: boolean;
};

const SetPasswordForm = ({ form, userMail, tokenUsed, loading, handleSave, success }: SetPasswordFormProps) => {
  const t = useT();
  const errors = form.formState.errors;
  const router = useRouter();
  const isAdmin = router.asPath.includes("/admin");

  const signInUrl = isAdmin ? "/admin" : "/auth/login";

  return (
    <Form>
      <If condition={tokenUsed}>
        <Then>
          <Form.Header title={t("Link expired")} />
        </Then>
        <Else>
          <Form.Header title={t("Set Password")} />
          <If condition={!success}>
            <Then>
              <div className="flex flex-col gap-4">
                <Input
                  name="userMail"
                  formHook={form}
                  type="text"
                  label={t("Email Address")}
                  defaultValue={userMail}
                  disabled
                />
                <Input
                  name="password"
                  formHook={form}
                  error={errors.password}
                  type="password"
                  label={t("New Password")}
                  required
                />
                <PasswordStrength password={form.watch("password")} />
              </div>
              <Input
                name="confirmPassword"
                formHook={form}
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
                {t("Your password has been set. Please click Sign in to continue using TerraMatch.")}
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
        </Else>
      </If>
    </Form>
  );
};

export default SetPasswordForm;
