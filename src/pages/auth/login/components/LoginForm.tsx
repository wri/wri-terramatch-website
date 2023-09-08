import { useT } from "@transifex/react";
import Link from "next/link";
import { UseFormReturn } from "react-hook-form";
import { When } from "react-if";

import Input from "@/components/elements/Inputs/Input/Input";
import Text from "@/components/elements/Text/Text";
import Form from "@/components/extensive/Form/Form";
import { PostAuthLoginError } from "@/generated/apiComponents";

import { LoginFormData } from "../index.page";

type LoginFormProps = {
  form: UseFormReturn<LoginFormData>;
  handleSave: (data: LoginFormData) => Promise<any>;
  loading?: boolean;
  loginError?: PostAuthLoginError | null;
};

const LoginForm = ({ form, handleSave, loading, loginError }: LoginFormProps) => {
  const t = useT();
  const errors = form.formState.errors;

  return (
    <Form>
      <Form.Header title={t("Log In")} subtitle={t("Sign in to TerraMatch with your professional email address.")} />
      {/* Inputs */}
      <Input name="email" form={form} error={errors.email} type="text" label={t("Email")} required />
      <Input name="password" form={form} error={errors.password} type="password" label={t("Password")} required />
      {/* Reset */}
      <When condition={!!loginError}>
        <Text variant="text-body-500" className="color-error text-right">
          {t("Your email or password are incorrect")}
        </Text>
      </When>
      <div className="mt-6 flex items-center justify-center">
        <Link href="/auth/reset-password">
          <Text variant="text-body-600" className="uppercase underline">
            {t("Reset password")}
          </Text>
        </Link>
      </div>
      <Form.Footer
        primaryButtonProps={{
          children: t("Sign in"),
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
    </Form>
  );
};

export default LoginForm;
