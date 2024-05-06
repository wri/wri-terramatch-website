import { useT } from "@transifex/react";
import { isEmpty } from "lodash";
import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { UseFormReturn } from "react-hook-form";

import Input from "@/components/elements/Inputs/Input/Input";
import Text from "@/components/elements/Text/Text";
import Form from "@/components/extensive/Form/Form";

import { LoginFormData } from "../index.page";

type LoginFormProps = {
  form: UseFormReturn<LoginFormData>;
  handleSave: (data: LoginFormData) => Promise<any>;
  loading?: boolean;
  errorsRequest?: {
    stack: { errors: [] };
  };
};

const LoginForm = ({ form, handleSave, loading, errorsRequest }: LoginFormProps) => {
  const t = useT();
  const errors = form.formState.errors;
  const [sendInformation, setSendInformation] = useState(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    if (form.getValues("email") === "" || form.getValues("password") === "") {
      setSendInformation(false);
      form.setError("email", { message: undefined });
      form.setError("password", { message: undefined });
    }
    handleSave(form.getValues());
    e.preventDefault();
  };
  useEffect(() => {
    if (errorsRequest?.stack) {
      setSendInformation(true);
      errorsRequest.stack?.errors?.map((error: { source: string; detail: string }) => {
        if (error.source === "email_address") {
          form.setError("email", { message: error.detail });
        } else if (error.source === "password") {
          form.setError("password", { message: error.detail });
        }
      });
    } else {
      setSendInformation(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [errorsRequest]);

  const handleChangeEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSendInformation(false);
    form.setValue("email", e.target.value);
  };

  const handleChangePwd = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSendInformation(false);
    form.setValue("password", e.target.value);
  };
  return (
    <Form formType={"login"} onSubmit={handleSubmit}>
      <div className="w-[30vw]">
        <Text variant="text-32-bold" className="text-blueCustom-700">
          {t("Sign in")}
        </Text>
        <Text variant="text-12-light" className="flex text-blueCustom-700">
          New to TerraMatch’s Dashboards?&nbsp;
          <Link href={"/auth/create-account"} className="text-12-bold text-primary underline underline-offset-4">
            Sign Up for free
          </Link>
        </Text>
        <div className="mb-5 mt-[6vh] flex flex-col gap-12">
          <Input
            name="email"
            type="text"
            label={t("Email Address")}
            variant={"login"}
            required={false}
            placeholder=" "
            id="email"
            formHook={form}
            error={sendInformation ? errors.email : undefined}
            hideErrorMessage={!sendInformation}
            containerClassName={`flex flex-col gap-2 bg-white content-login w-full  ${
              !isEmpty(form.getValues("email")) ? "input-content-login" : "input-content-login"
            }`}
            labelClassName="opacity-50 text-blueCustom-700 origin-left
            transition-transform duration-[0.3s,color] delay-[0.3s]
            absolute label-login text-14-light normal-case"
            sufixLabelView={false}
            classNameContainerInput="!mt-0"
            classNameError="!mt-0"
            onInput={(e: React.ChangeEvent<HTMLInputElement>) => handleChangeEmail(e)}
          />
          <Input
            name="password"
            type="password"
            label={t("Enter Password")}
            variant={"login"}
            required={false}
            placeholder=" "
            id="password"
            formHook={form}
            error={sendInformation ? errors.password : undefined}
            hideErrorMessage={!sendInformation}
            containerClassName={`flex flex-col gap-2 bg-white content-login w-full  ${
              !isEmpty(form.getValues("password")) ? "input-content-login" : "input-content-login"
            }`}
            labelClassName="opacity-50 text-blueCustom-700 origin-left
            transition-transform duration-[0.3s,color] delay-[0.3s]
            absolute label-login text-14-light normal-case"
            sufixLabelView={false}
            classNameContainerInput="!mt-0"
            classNameError="!mt-0"
            onInput={(e: React.ChangeEvent<HTMLInputElement>) => handleChangePwd(e)}
          />
        </div>
        <Link href="/auth/reset-password" className="flex w-fit">
          <Text variant="text-12-bold" className="mb-6 w-fit decoration-slice text-primary">
            Forgot Password?
          </Text>
        </Link>
        <Form.Footer
          primaryButtonProps={{
            children: t("Sign in"),
            disabled: loading,
            className: `bg-primary py-3.5 flex items-center justify-center rounded-lg w-full
              border-2 border-primary text-white text-14-bold hover:border-white`
          }}
        />
      </div>
    </Form>
    // <Form>
    //   <Form.Header title={t("Log In")}>
    //     <div className="flex flex-col items-center">
    //       <Text as="h2" variant="text-light-body-300" className="text-center">
    //         {t("Sign in to TerraMatch with your professional email address.")}
    //       </Text>
    //       <div className="flex gap-1">
    //         <Text variant="text-light-body-300" className="text-right color-error">
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

    //   <div className="flex items-center justify-center mt-6">
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
