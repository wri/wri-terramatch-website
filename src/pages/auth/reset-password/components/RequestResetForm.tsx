import { useT } from "@transifex/react";
import { isEmpty } from "lodash";
import Link from "next/link";
import { UseFormReturn } from "react-hook-form";
import { When } from "react-if";

import Input from "@/components/elements/Inputs/Input/Input";
import Text from "@/components/elements/Text/Text";
import Form from "@/components/extensive/Form/Form";
import { PostAuthLoginError } from "@/generated/apiComponents";

import { RequestResetData } from "../index.page";

type RequestResetProps = {
  form: UseFormReturn<RequestResetData>;
  handleSave: (data: RequestResetData) => Promise<any>;
  loading?: boolean;
  apiError?: PostAuthLoginError | null;
  success?: boolean;
};

const RequestResetForm = ({ form, handleSave, loading, apiError, success }: RequestResetProps) => {
  const t = useT();
  const errors = form.formState.errors;

  return (
    <Form formType="reset-password" className="mobile:w-full">
      <div className="w-[30vw] overflow-auto mobile:w-full">
        <div className="mb-10 flex flex-col gap-2">
          <Text variant="text-32-bold" className="text-blue-700">
            {t("Reset Password")}
          </Text>
          <div className="mb-11 flex items-center gap-1">
            <Text variant="text-12-light" className="text-blue-700">
              {t("Return to Sign-In?")}
            </Text>
            <Link href={"/login"}>
              <Text variant="text-12-bold" className="text-primary underline">
                {t("Click here")}
              </Text>
            </Link>
          </div>
          <Input
            name="email"
            formHook={form}
            error={errors.email}
            type="text"
            label={t("Email Address")}
            required
            variant={"login"}
            containerClassName={`flex flex-col gap-2 bg-white content-login w-full  ${
              !isEmpty(form.getValues("email")) ? "input-content-login" : "input-content-login"
            }`}
            labelClassName="opacity-50 text-blueCustom-700 origin-left
            transition-transform duration-[0.3s,color] delay-[0.3s]
            absolute label-login text-14-light normal-case"
            classNameContainerInput="!mt-0"
            classNameError="!mt-0"
          />
          <When condition={!!apiError}>
            <Text variant="text-12-light" className="text-right">
              {t("Cant verify your email address.")}
            </Text>
          </When>
        </div>
        <Form.Footer
          primaryButtonProps={{
            children: t("Reset Password"),
            onClick: form.handleSubmit(handleSave),
            disabled: loading,
            className:
              "bg-primary py-3.5 flex items-center justify-center rounded-lg w-full border-2 border-primary text-white text-14-bold hover:border-white"
          }}
        />
      </div>
    </Form>
  );
};

export default RequestResetForm;
