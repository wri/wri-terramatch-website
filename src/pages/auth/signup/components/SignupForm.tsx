// import { useT } from "@transifex/react";
// import Link from "next/link";
import { useState } from "react";
import { UseFormReturn } from "react-hook-form";

import Button from "@/components/componentsToLogin/Button/Button";
import { BUTTON_VARIANT_BLUE, BUTTON_VARIANT_WHITE } from "@/components/componentsToLogin/Button/ButtonVariant";
import Input from "@/components/componentsToLogin/Input/Input";
import { INPUT_SIGNUP_VARIANT } from "@/components/componentsToLogin/Input/InputVariant";
import Text from "@/components/componentsToLogin/Text/Text";

// import Checkbox from "@/components/elements/Inputs/Checkbox/Checkbox";
// import Input from "@/components/elements/Inputs/Input/Input";
// import Form from "@/components/extensive/Form/Form";
// import PasswordStrength from "@/components/extensive/PasswordStrength/PasswordStrength";
// import { privacyPolicyLink, termsAndConditionsLink } from "@/constants/links";
import { SignUpFormData } from "../index.page";
import PasswordValidation from "./PasswordValidation";
import Terms from "./Terms";

type SignUpFormProps = {
  form: UseFormReturn<SignUpFormData>;
  handleSave: (data: SignUpFormData) => Promise<any>;
  loading?: boolean;
};

const SignUpForm = ({ form, loading, handleSave }: SignUpFormProps) => {
  // const t = useT();
  // const errors = form.formState.errors;
  const [inputValue, setInputValue] = useState("");

  return (
    <div className="text-14 mb-[6vh] flex w-[31vw] flex-1 flex-col p-1">
      <Text variant="text-32-bold" className="mb-2 text-blue-700">
        Sign up
      </Text>
      <Text variant="text-12-light" className="mb-8 text-blue-700">
        Sign up to Terramatch with your professional email address
      </Text>
      <div className="relative mb-8 flex-1 overflow-y-auto overflow-x-hidden">
        <div className="absolute m-[-2px] mb-8 flex flex-col gap-5 p-1">
          <div className="grid w-full grid-cols-2 items-start gap-4">
            <Input
              type="text"
              label="First Name"
              variant={INPUT_SIGNUP_VARIANT}
              required={false}
              placeholder="Add First Name"
            />
            <Input
              type="text"
              label="Last Name"
              variant={INPUT_SIGNUP_VARIANT}
              required={false}
              placeholder="Add Last Name"
            />
          </div>
          <Input
            type="text"
            label="Job Title"
            variant={INPUT_SIGNUP_VARIANT}
            required={false}
            placeholder="Add Job Title"
            description={
              <Text variant="text-12-light" className="opacity-60">
                Please enter your job role or position within your organizations
              </Text>
            }
          />
          <Input
            type="number"
            label="Professional Phone Number"
            variant={INPUT_SIGNUP_VARIANT}
            required={false}
            placeholder="Add Phone Number"
            description={
              <Text variant="text-12-light" className="opacity-60">
                Please provide a professional phone number where you can be contacted
              </Text>
            }
          />
          <Input
            type="text"
            label="Professional Email Address"
            variant={INPUT_SIGNUP_VARIANT}
            required={false}
            placeholder="Add Email Address"
            description={
              <Text variant="text-12-light" className="opacity-60">
                This is the email address you will use to log into TerraMatch. To verify your email, we will send a
                verification email to this address.
              </Text>
            }
          />
          <Input
            type="password"
            label="Password"
            description={<PasswordValidation password={inputValue} />}
            variant={INPUT_SIGNUP_VARIANT}
            required={false}
            onInputChange={setInputValue}
            placeholder="Add Password"
          />
          <Input
            type="password"
            label="Repeat Password"
            variant={INPUT_SIGNUP_VARIANT}
            required={false}
            placeholder="Repeat Password"
          />
          <Terms />
        </div>
      </div>
      <Button variant={BUTTON_VARIANT_BLUE} className="mb-4">
        Sign up
      </Button>
      <Button variant={BUTTON_VARIANT_WHITE}>Cancel</Button>
    </div>
    // <Form>
    //   <Form.Header
    //     title={t("Sign Up")}
    //     subtitle={t(
    //       "Sign up to TerraMatch with your professional email address. We'll send you an email to verify your account."
    //     )}
    //   />
    //   {/* Inputs */}
    //   <div className="flex w-full flex-col gap-8 sm:flex-row">
    //     <Input
    //       name="first_name"
    //       formHook={form}
    //       error={errors.first_name}
    //       type="text"
    //       label={t("First Name")}
    //       required
    //       containerClassName="w-full"
    //     />
    //     <Input
    //       name="last_name"
    //       formHook={form}
    //       error={errors.last_name}
    //       type="text"
    //       label={t("Last Name")}
    //       required
    //       containerClassName="w-full"
    //     />
    //   </div>
    //   <Input
    //     name="job_role"
    //     formHook={form}
    //     error={errors.job_role}
    //     type="text"
    //     label={t("Job Title")}
    //     description={t("Please enter your job role or position within your organization.")}
    //     required
    //   />
    //   <Input
    //     name="phone_number"
    //     formHook={form}
    //     error={errors.phone_number}
    //     type="tel"
    //     label={t("Professional phone number")}
    //     description={t("Please provide a professional phone number where you can be contacted.")}
    //     required
    //   />

    //   <Input
    //     name="email_address"
    //     formHook={form}
    //     error={errors.email_address}
    //     type="text"
    //     label={t("Professional Email Address")}
    //     description={t(
    //       "This is the email address you will use to log into TerraMatch. To verify your email, we will send a verification email to this address."
    //     )}
    //     required
    //   />

    //   <div className="flex flex-col gap-3">
    //     <Input name="password" formHook={form} error={errors.password} type="password" label={t("Password")} required />
    //     <PasswordStrength password={form.watch("password")} />
    //   </div>
    //   <Input
    //     name="confirm_password"
    //     formHook={form}
    //     error={errors.confirm_password}
    //     type="password"
    //     label={t("Repeat Password")}
    //     required
    //   />
    //   {/* Terms */}
    //   <div className="mt-7 flex flex-col gap-8">
    //     <Checkbox
    //       name="terms"
    //       form={form}
    //       label={t(
    //         `I agree to the <a href="{termsAndConditionsLink}">Terms of Service</a> and <a href="{privacyPolicyLink}">Privacy Policy</a>`,
    //         {
    //           termsAndConditionsLink,
    //           privacyPolicyLink
    //         }
    //       )}
    //       error={errors.terms}
    //       required
    //     />
    //     <Checkbox
    //       name="consent"
    //       form={form}
    //       label={t(
    //         "I consent to my contact information being shared with other users via terramatch for the purposes of connecting with interested parties"
    //       )}
    //       error={errors.consent}
    //       required
    //     />
    //   </div>
    //   <Form.Footer
    //     primaryButtonProps={{
    //       children: t("Sign up"),
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

export default SignUpForm;
