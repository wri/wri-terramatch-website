import { useT } from "@transifex/react";
import { isEmpty } from "lodash";
import Link from "next/link";
import { UseFormReturn } from "react-hook-form";

import Input from "@/components/elements/Inputs/Input/Input";
import Text from "@/components/elements/Text/Text";
import Form from "@/components/extensive/Form/Form";

import { LoginFormDataType } from "../index.page";

type LoginFormProps = {
  form: UseFormReturn<LoginFormDataType>;
  handleSave: (data: LoginFormDataType) => Promise<any>;
  loading?: boolean;
};

const LoginForm = ({ form, handleSave, loading }: LoginFormProps) => {
  const t = useT();
  const errors = form.formState.errors;

  return (
    <Form formType={"login"} onSubmit={form.handleSubmit(handleSave)}>
      <div className="w-[30vw]">
        <Text variant="text-32-bold" className="text-blueCustom-700">
          {t("Sign in")}
        </Text>
        <Text variant="text-12-light" className="flex text-blueCustom-700">
          {t("New to TerraMatch?")}&nbsp;
          <Link href={"/auth/create-account"} className="text-12-bold text-primary underline underline-offset-4">
            {t("Sign Up for free")}
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
            error={errors.email}
            containerClassName={`flex flex-col gap-2 bg-white content-login w-full  ${
              !isEmpty(form.getValues("email")) ? "input-content-login" : "input-content-login"
            }`}
            labelClassName="opacity-50 text-blueCustom-700 origin-left
            transition-transform duration-[0.3s,color] delay-[0.3s]
            absolute label-login text-14-light normal-case"
            classNameContainerInput="!mt-0"
            classNameError="!mt-0"
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
            error={errors.password}
            containerClassName={`flex flex-col gap-2 bg-white content-login w-full  ${
              !isEmpty(form.getValues("password")) ? "input-content-login" : "input-content-login"
            }`}
            labelClassName="opacity-50 text-blueCustom-700 origin-left
            transition-transform duration-[0.3s,color] delay-[0.3s]
            absolute label-login text-14-light normal-case"
            classNameContainerInput="!mt-0"
            classNameError="!mt-0"
          />
        </div>
        <Link href="/auth/reset-password" className="flex w-fit">
          <Text variant="text-12-bold" className="mb-6 w-fit decoration-slice text-primary">
            {t("Forgot Password?")}
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
  );
};

export default LoginForm;
