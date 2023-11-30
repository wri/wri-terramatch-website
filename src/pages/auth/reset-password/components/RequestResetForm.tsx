import { useT } from "@transifex/react";
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
    <Form>
      <Form.Header title="Reset Password" />
      <Input name="email" formHook={form} error={errors.email} type="text" label={t("Email")} required />
      <When condition={!!apiError}>
        <Text variant="text-body-600" className="text-right">
          {t("Cant verify your email address.")}
        </Text>
      </When>
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
    </Form>
  );
};

export default RequestResetForm;
