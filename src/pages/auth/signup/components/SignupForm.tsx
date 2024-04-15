import { useT } from "@transifex/react";
import Link from "next/link";
import { useEffect } from "react";
import { UseFormReturn } from "react-hook-form";

import Checkbox from "@/components/elements/Inputs/Checkbox/Checkbox";
import Input from "@/components/elements/Inputs/Input/Input";
import Text from "@/components/elements/Text/Text";
import Form from "@/components/extensive/Form/Form";
import PasswordStrength from "@/components/extensive/PasswordStrength/PasswordStrength";
import { privacyPolicyLink, termsAndConditionsLink } from "@/constants/links";

import { SignUpFormData } from "../index.page";

type SignUpFormProps = {
  form: UseFormReturn<SignUpFormData>;
  handleSave: (data: SignUpFormData) => Promise<any>;
  loading?: boolean;
  roleId: string;
};

const SignUpForm = ({ form, loading, handleSave, roleId }: SignUpFormProps) => {
  const t = useT();
  const errors = form.formState.errors;
  useEffect(() => {
    form.setValue("role_id", roleId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="text-14 mb-[6vh] flex w-[31vw] flex-1 flex-col p-1">
      <Form formType="signUp">
        <Text variant="text-32-bold" className="mb-2 text-blue-700">
          Sign up
        </Text>
        <Text variant="text-12-light" className="mb-8 text-blue-700">
          Sign up to Terramatch with your professional email address
        </Text>
        <div className="relative mb-8 flex-1 overflow-y-auto overflow-x-hidden" style={{ height: "50vh" }}>
          <div className="m-[-2px] mb-8 flex flex-col gap-5 p-1">
            <div className="grid w-full grid-cols-2 items-start gap-4">
              <Input
                name="first_name"
                formHook={form}
                error={errors.first_name}
                type="text"
                label="First Name"
                required
                variant={"signup"}
                placeholder="Add First Name"
                labelClassName={"text-14-light normal-case text-dark-500"}
              />
              <Input
                name="last_name"
                formHook={form}
                error={errors.last_name}
                type="text"
                label="Last Name"
                required
                variant={"signup"}
                placeholder="Add Last Name"
                labelClassName={"text-14-light normal-case text-dark-500"}
              />
            </div>
            <Input
              name="job_role"
              formHook={form}
              error={errors.job_role}
              type="text"
              label="Job Title"
              required
              variant={"signup"}
              placeholder="Add Job Title"
              labelClassName={"text-14-light normal-case text-dark-500"}
              descriptionClassName={"opacity-60 text-12-light"}
              descriptionFooter={"Please enter your job role or position within your organizations."}
            />
            <Input
              name="phone_number"
              formHook={form}
              error={errors.phone_number}
              type="number"
              label="Professional Phone Number"
              required
              variant={"signup"}
              placeholder="Add Phone Number"
              labelClassName={"text-14-light normal-case text-dark-500"}
              descriptionClassName={"opacity-60 text-12-light"}
              descriptionFooter={"Please provide a professional phone number where you can be contacted"}
            />
            <Input
              name="email_address"
              formHook={form}
              error={errors.email_address}
              type="text"
              label="Professional Email Address"
              required
              variant={"signup"}
              placeholder="Add Email Address"
              labelClassName={"text-14-light normal-case text-dark-500"}
              descriptionClassName={"opacity-60 text-12-light"}
              descriptionFooter={
                "This is the email address you will use to log into TerraMatch. To verify your email, we will send a verification email to this address."
              }
            />
            <div className="flex flex-col gap-3">
              <Input
                name="password"
                formHook={form}
                error={errors.password}
                type="password"
                label={t("Password")}
                required
                variant={"signup"}
                labelClassName={"text-14-light normal-case text-dark-500"}
              />
              <PasswordStrength password={form.watch("password")} />
            </div>
            <Input
              name="confirm_password"
              formHook={form}
              error={errors.confirm_password}
              type="password"
              label="Repeat Password"
              required
              variant={"signup"}
              labelClassName={"text-14-light normal-case text-dark-500"}
              placeholder="Repeat Password"
            />
            <div className={`mt-7 flex flex-col ${errors.terms ? "gap-7" : "gap-1"}`}>
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
                className="letter-spacing-normal text-xs font-normal lg:text-sm wide:text-base"
                inputClassName="rounded-full"
              />
              <Checkbox
                name="consent"
                form={form}
                label={t(
                  "I consent to my contact information being shared with other users via terramatch for the purposes of connecting with interested parties"
                )}
                error={errors.consent}
                required
                className="letter-spacing-normal text-xs font-normal lg:text-sm wide:text-base"
                inputClassName="rounded-full"
              />
            </div>
          </div>
        </div>
        <Form.Footer
          formType="signUp"
          primaryButtonProps={{
            children: t("Sign up"),
            onClick: form.handleSubmit(handleSave),
            disabled: loading,
            className:
              "mb-4 bg-blue-300 py-6.5 flex items-center justify-center rounded-lg w-full border-2 border-blue-300 text-white text-14-bold hover:border-white"
          }}
          secondaryButtonProps={{
            children: t("Cancel"),
            as: Link,
            href: "/",
            disabled: loading,
            className:
              "bg-white py-6.5 flex items-center justify-center rounded-lg w-full border-2 border-blue-700 text-blue-700 text-14-bold hover:border-blue-300 hover:text-blue-300"
          }}
        />
      </Form>
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
