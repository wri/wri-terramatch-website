import { useT } from "@transifex/react";
import Link from "next/link";
import { UseFormReturn } from "react-hook-form";

import Checkbox from "@/components/elements/Inputs/Checkbox/Checkbox";
import Input from "@/components/elements/Inputs/Input/Input";
import Text from "@/components/elements/Text/Text";
import Form from "@/components/extensive/Form/Form";
import PasswordStrength from "@/components/extensive/PasswordStrength/PasswordStrength";
import { privacyPolicyLink, termsAndConditionsLink } from "@/constants/links";
import { useValueChanged } from "@/hooks/useValueChanged";

import LoginLayout from "../../layout";
import { SignUpFormData } from "../index.page";

type SignUpFormProps = {
  form: UseFormReturn<SignUpFormData>;
  handleSave: (data: SignUpFormData) => Promise<any>;
  loading?: boolean;
  role: string;
};

const SignUpForm = ({ form, loading, handleSave, role }: SignUpFormProps) => {
  const t = useT();
  const errors = form.formState.errors;

  useValueChanged(role, () => {
    form.setValue("role", "project-developer");
  });

  return (
    <LoginLayout>
      <div className="text-14 mb-auto mt-auto flex w-[31vw] p-1 mobile:w-full">
        <Form formType="signUp" onSubmit={form.handleSubmit(handleSave)} className="mobile:w-full">
          <Text variant="text-32-bold" className="mb-2 text-blueCustom-700">
            {t("Sign Up")}
          </Text>
          <Text variant="text-12-light" className="text-blue-700 mb-6">
            {t("Sign up to Terramatch with your professional email address")}
          </Text>
          <div className="relative mb-8 h-[calc(100vh-409px)] flex-1 overflow-y-auto overflow-x-hidden">
            <div className="m-[-2px] flex flex-col gap-3 p-1">
              <div className="grid w-full grid-cols-2 items-start gap-4">
                <Input
                  name="first_name"
                  formHook={form}
                  error={errors.first_name}
                  type="text"
                  label={t("First Name")}
                  required
                  variant={"signup"}
                  placeholder={t("Add First Name")}
                  labelClassName={"text-14-light normal-case text-dark-500"}
                />
                <Input
                  name="last_name"
                  formHook={form}
                  error={errors.last_name}
                  type="text"
                  label={t("Last Name")}
                  required
                  variant={"signup"}
                  placeholder={t("Add Last Name")}
                  labelClassName={"text-14-light normal-case text-dark-500"}
                />
              </div>
              <Input
                name="job_role"
                formHook={form}
                error={errors.job_role}
                type="text"
                label={t("Job Title")}
                required
                variant={"signup"}
                placeholder={t("Add Job Title")}
                labelClassName={"text-14-light normal-case text-dark-500"}
                descriptionClassName={"opacity-60 text-12-light"}
                descriptionFooter={t("Please enter your job role or position within your organizations.")}
              />
              <Input
                name="phone_number"
                formHook={form}
                error={errors.phone_number}
                type="tel"
                label={t("Professional phone number")}
                required
                variant={"signup"}
                placeholder={t("Add Phone Number")}
                labelClassName={"text-14-light normal-case text-dark-500"}
                descriptionClassName={"opacity-60 text-12-light"}
                descriptionFooter={t("Please provide a professional phone number where you can be contacted")}
              />
              <Input
                name="email_address"
                formHook={form}
                error={errors.email_address}
                type="text"
                label={t("Professional Email Address")}
                required
                variant={"signup"}
                placeholder={t("Add Email Address")}
                labelClassName={"text-14-light normal-case text-dark-500"}
                descriptionClassName={"opacity-60 text-12-light"}
                descriptionFooter={t(
                  "This is the email address you will use to log into TerraMatch. To verify your email, we will send a verification email to this address."
                )}
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
                label={t("Repeat Password")}
                required
                variant={"signup"}
                labelClassName={"text-14-light normal-case text-dark-500"}
                placeholder={t("Repeat Password")}
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
                  className="letter-spacing-normal relative text-xs font-normal lg:text-sm wide:text-base"
                  inputClassName="rounded-full"
                  textClassName="!text-12-light"
                  errorClassName="!text-left mt-2"
                />
                <Checkbox
                  name="consent"
                  form={form}
                  label={t(
                    "I consent to my contact information being shared with other users via terramatch for the purposes of connecting with interested parties"
                  )}
                  error={errors.consent}
                  required
                  className="letter-spacing-normal text-12-light relative text-xs font-normal lg:text-sm wide:text-base"
                  inputClassName="rounded-full"
                  textClassName="!text-12-light"
                  errorClassName="!text-left mt-2"
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
                "bg-primary py-3.5 flex items-center justify-center rounded-lg w-full border-2 border-primary text-white text-14-bold hover:border-white mb-4"
            }}
            secondaryButtonProps={{
              children: t("Cancel"),
              as: Link,
              href: "/",
              disabled: loading,
              className:
                "bg-white py-4 flex items-center justify-center rounded-lg w-full border-2 border-blue-700 text-blue-700 text-14-bold hover:border-primary hover:text-primary"
            }}
          />
        </Form>
      </div>
    </LoginLayout>
  );
};

export default SignUpForm;
