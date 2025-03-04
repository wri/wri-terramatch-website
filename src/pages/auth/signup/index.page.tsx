import { yupResolver } from "@hookform/resolvers/yup";
import { useT } from "@transifex/react";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import * as yup from "yup";

import { usePasswordStrength } from "@/components/extensive/PasswordStrength/hooks/usePasswordStrength";
import { useUserCreation } from "@/connections/User";
import { useValueChanged } from "@/hooks/useValueChanged";

import SignUpForm from "./components/SignupForm";

const SignUpFormDataSchema = (t: any) =>
  yup.object({
    first_name: yup.string().required(),
    last_name: yup.string().required(),
    email_address: yup.string().email().required(),
    phone_number: yup.string().required(),
    job_role: yup.string().required(),
    password: yup.string().required(),
    role: yup.string().required(),
    country: yup.string(),
    program: yup.string(),
    confirm_password: yup.string().oneOf([yup.ref("password")], t("Passwords must match.")),
    terms: yup.boolean().isTrue(t("Please accept terms and conditions.")),
    consent: yup.boolean().isTrue(t("Please accept consent."))
  });

export type SignUpFormData = yup.InferType<ReturnType<typeof SignUpFormDataSchema>>;

const SignUpPage = ({
  role,
  selectedOption,
  selectedTitleOption
}: {
  role: string;
  selectedOption: string;
  selectedTitleOption: string;
}) => {
  const t = useT();
  const router = useRouter();

  const [, { isLoading, isSuccess, requestFailed, emailNewUser, signUp }] = useUserCreation();

  useValueChanged(isSuccess, () => {
    if (isSuccess) {
      return router.push(`/auth/signup/confirm?email=${encodeURIComponent(emailNewUser)}`);
    }
  });

  useValueChanged(requestFailed, () => {
    if (requestFailed != null) {
      let message: string;
      if (requestFailed.statusCode == 422 && requestFailed.message == "User already exist") {
        message = t(
          "An account with this email address already exists. Please try signing in with your existing account, or reset your password if you have forgotten it."
        );
        form.setError("email_address", { message: message, type: "validate" });
      } else {
        message = t("An error occurred. Please try again later.");
        form.setError("root", { message: message, type: "validate" });
      }
    }
  });

  const form = useForm<SignUpFormData>({
    resolver: yupResolver(SignUpFormDataSchema(t)),
    mode: "onSubmit"
  });

  const { strength } = usePasswordStrength({ password: form.watch("password") });

  /**
   * Form Submit Handler
   * @param data SignupFormData
   * @returns redirects to Confirm Email Page
   */
  const handleSave = async (data: SignUpFormData) => {
    if (strength !== "Strong")
      return form.setError("password", {
        message: t(
          "The password does not meet the minimum requirements. Please check that it contains at least 8 characters, including uppercase letters, lowercase letters and numbers."
        )
      });
    signUp({
      emailAddress: data.email_address,
      firstName: data.first_name,
      lastName: data.last_name,
      password: data.password,
      phoneNumber: data.phone_number,
      jobRole: data.job_role,
      callbackUrl: window.location.origin + "/auth/verify/email/",
      role: "project-developer",
      country: selectedTitleOption == "Select Country" ? (selectedOption as any) : null,
      program: selectedTitleOption == "Select Framework" ? (selectedOption?.toLowerCase() as any) : null
    });
  };

  return <SignUpForm form={form} handleSave={handleSave} loading={isLoading} role={role} />;
};

export default SignUpPage;
