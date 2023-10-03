import { useT } from "@transifex/react";
import Link from "next/link";
import { UseFormReturn } from "react-hook-form";

import Checkbox from "@/components/elements/Inputs/Checkbox/Checkbox";
import Input from "@/components/elements/Inputs/Input/Input";
import Form from "@/components/extensive/Form/Form";
import PasswordStrength from "@/components/extensive/PasswordStrength/PasswordStrength";
import { privacyPolicyLink, termsAndConditionsLink } from "@/utils/const";

import { SignUpFormData } from "../index.page";

type SignUpFormProps = {
  form: UseFormReturn<SignUpFormData>;
  handleSave: (data: SignUpFormData) => Promise<any>;
  loading?: boolean;
};

const SignUpForm = ({ form, loading, handleSave }: SignUpFormProps) => {
  const t = useT();
  const errors = form.formState.errors;

  return (
    <Form>
      <Form.Header
        title={t("Sign Up")}
        subtitle={t(
          "Sign up to TerraMatch with your professional email address. We'll send you an email to verify your account."
        )}
      />
      {/* Inputs */}
      <div className="flex w-full flex-col gap-8 sm:flex-row">
        <Input
          name="first_name"
          form={form}
          error={errors.first_name}
          type="text"
          label={t("First Name")}
          required
          containerClassName="w-full"
        />
        <Input
          name="last_name"
          form={form}
          error={errors.last_name}
          type="text"
          label={t("Last Name")}
          required
          containerClassName="w-full"
        />
      </div>
      <Input
        name="job_role"
        form={form}
        error={errors.job_role}
        type="text"
        label={t("Job Title")}
        description={t("Please enter your job role or position within your organization.")}
        required
      />
      <Input
        name="phone_number"
        form={form}
        error={errors.phone_number}
        type="tel"
        label={t("Professional phone number")}
        description={t("Please provide a professional phone number where you can be contacted.")}
        required
      />

      <Input
        name="email_address"
        form={form}
        error={errors.email_address}
        type="text"
        label={t("Professional Email Address")}
        description={t(
          "This is the email address you will use to log into TerraMatch. To verify your email, we will send a verification email to this address."
        )}
        required
      />

      <div className="flex flex-col gap-3">
        <Input name="password" form={form} error={errors.password} type="password" label={t("Password")} required />
        <PasswordStrength password={form.watch("password")} />
      </div>
      <Input
        name="confirm_password"
        form={form}
        error={errors.confirm_password}
        type="password"
        label={t("Repeat Password")}
        required
      />
      {/* Terms */}
      <div className="mt-7 flex flex-col gap-8">
        <Checkbox
          name="terms"
          form={form}
          label={t(
            `I agree to the <a href="{termsAndConditionsLink}">Terms of Service</a> and <a href="{privacyPolicyLink}">Privacy Policy</a>`,
            {
              termsAndConditionsLink,
              privacyPolicyLink
            }
          )}
          error={errors.terms}
          required
        />
        <Checkbox
          name="consent"
          form={form}
          label={t(
            "I consent to my contact information being shared with other users via terramatch for the purposes of connecting with interested parties"
          )}
          error={errors.consent}
          required
        />
      </div>
      <Form.Footer
        primaryButtonProps={{
          children: t("Sign up"),
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

export default SignUpForm;
