// import { useT } from "@transifex/react";
import Link from "next/link";
import { UseFormReturn } from "react-hook-form";

// import { When } from "react-if";
import Button from "@/components/componentsToLogin/Button/Button";
import { BUTTON_VARIANT_BLUE } from "@/components/componentsToLogin/Button/ButtonVariant";
import Input from "@/components/componentsToLogin/Input/Input";
import { INPUT_LOGIN_VARIANT } from "@/components/componentsToLogin/Input/InputVariant";
// import Text from "@/components/elements/Text/Text";
import Text from "@/components/componentsToLogin/Text/Text";
// import Input from "@/components/elements/Inputs/Input/Input";
// import Form from "@/components/extensive/Form/Form";
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
  // const t = useT();
  // const errors = form.formState.errors;

  return (
    <div>
      <div className="w-[30vw] overflow-auto">
        <div className="mb-10 flex flex-col gap-2">
          <Text variant="text-32-bold" className="text-blue-700">
            Reset Password
          </Text>
          <div className="mb-11 flex items-center gap-1">
            <Text variant="text-12-light" className="text-blue-700">
              Return to Sign-In?
            </Text>
            <Link href={"/login"}>
              <Text variant="text-12-bold" className="text-blue-300 underline">
                Click here
              </Text>
            </Link>
          </div>
          <Input type="text" label="Email Address" variant={INPUT_LOGIN_VARIANT} required={false} placeholder=" " />
        </div>
        <Button variant={BUTTON_VARIANT_BLUE} onClick={() => {}}>
          Reset Password
        </Button>
      </div>
    </div>
    // <Form>
    //   <Form.Header title="Reset Password" />
    //   <Input name="email" formHook={form} error={errors.email} type="text" label={t("Email")} required />
    //   <When condition={!!apiError}>
    //     <Text variant="text-body-600" className="text-right">
    //       {t("Cant verify your email address.")}
    //     </Text>
    //   </When>
    //   <Form.Footer
    //     primaryButtonProps={{
    //       children: t("Reset Password"),
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

export default RequestResetForm;
