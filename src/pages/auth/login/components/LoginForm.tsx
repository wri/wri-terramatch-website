import { useT } from "@transifex/react";
import Link from "next/link";
import { UseFormReturn } from "react-hook-form";

import Button from "@/components/componentsToLogin/Button/Button";
import { BUTTON_VARIANT_BLUE } from "@/components/componentsToLogin/Button/ButtonVariant";
import Input from "@/components/componentsToLogin/Input/Input";
import { INPUT_LOGIN_VARIANT } from "@/components/componentsToLogin/Input/InputVariant";
import Text from "@/components/componentsToLogin/Text/Text";
// import Button from "@/components/elements/Button/Button";
// import Input from "@/components/elements/Inputs/Input/Input";
// import Text from "@/components/elements/Text/Text";
import Form from "@/components/extensive/Form/Form";

import { LoginFormData } from "../index.page";

type LoginFormProps = {
  form: UseFormReturn<LoginFormData>;
  handleSave: (data: LoginFormData) => Promise<any>;
  loading?: boolean;
};

const LoginForm = ({ form, handleSave, loading }: LoginFormProps) => {
  const t = useT();
  // const errors = form.formState.errors;

  return (
    <Form>
      <div className="w-[30vw]">
        <Text variant="text-32-bold">{t("Sign in")}</Text>
        <Text variant="text-12-light" className="flex">
          New to TerraMatch’s Dashboards?&nbsp;
          <Link href={"/auth/create-account"}>
            <Text variant="text-12-bold" className="text-blue-300 underline underline-offset-4">
              Sign Up for free
            </Text>
          </Link>
        </Text>
        <div className="mt-11 mb-6 flex flex-col gap-12">
          <Input
            type="text"
            label={t("Email Address")}
            variant={INPUT_LOGIN_VARIANT}
            required={true}
            placeholder=" "
            id="email"
            // formHook={form}
            // error={errors.email}
          />
          <Input
            type="password"
            label={t("Enter Password")}
            variant={INPUT_LOGIN_VARIANT}
            required={true}
            placeholder=" "
            id="password"
            // formHook={form}
            // error={errors.password}
          />
        </div>
        <Link href="/auth/reset-password">
          <Text variant="text-12-bold" className="mb-6 decoration-slice text-blue-300">
            Forgot Password?
          </Text>
        </Link>
        <Button variant={BUTTON_VARIANT_BLUE} onClick={form.handleSubmit(handleSave)}>
          {t("Sign in")}
        </Button>
      </div>
    </Form>
    // <Form>
    //   <Form.Header title={t("Log In")}>
    //     <div className="flex flex-col items-center">
    //       <Text as="h2" variant="text-light-body-300" className="text-center">
    //         {t("Sign in to TerraMatch with your professional email address.")}
    //       </Text>
    //       <div className="flex gap-1">
    //         <Text variant="text-light-body-300" className="color-error text-right">
    //           {t("Don’t have an account?")}
    //         </Text>
    //         <Button as={Link} href="/auth/signup" variant="link">
    //           {t("Sign up")}
    //         </Button>
    //       </div>
    //     </div>
    //   </Form.Header>

    //   <Input name="email" formHook={form} error={errors.email} type="text" label={t("Email")} required />
    //   <Input name="password" formHook={form} error={errors.password} type="password" label={t("Password")} required />

    //   <div className="mt-6 flex items-center justify-center">
    //     <Button as={Link} href="/auth/reset-password" variant="link">
    //       {t("Reset password")}
    //     </Button>
    //   </div>
    //   <Form.Footer
    //     primaryButtonProps={{
    //       children: t("Sign in"),
    //       onClick: form.handleSubmit(handleSave),
    //       disabled: loading
    //     }}
    //     secondaryButtonProps={{
    //       children: t("Cancel"),
    //       as: Link,
    //       href: "/",
    //       disabled: loading
    //     }}
    //   />
    // </Form>
  );
};

export default LoginForm;
