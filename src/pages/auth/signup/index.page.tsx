import { yupResolver } from "@hookform/resolvers/yup";
import { useT } from "@transifex/react";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import * as yup from "yup";

import { usePasswordStrength } from "@/components/extensive/PasswordStrength/hooks/usePasswordStrength";
// import BackgroundLayout from "@/components/generic/Layout/BackgroundLayout";
// import ContentLayout from "@/components/generic/Layout/ContentLayout";
import { usePostUsersRegister } from "@/generated/apiComponents";

import SignUpForm from "./components/SignupForm";

const SignUpFormDataSchema = (t: any) =>
  yup.object({
    first_name: yup.string().required(),
    last_name: yup.string().required(),
    email_address: yup.string().email().required(),
    phone_number: yup.string().required(),
    job_role: yup.string().required(),
    password: yup.string().required(),
    primary_role: yup.string().required(),
    country: yup.string(),
    program: yup.string(),
    confirm_password: yup.string().oneOf([yup.ref("password")], t("Passwords must match.")),
    terms: yup.boolean().isTrue(t("Please accept terms and conditions.")),
    consent: yup.boolean().isTrue(t("Please accept consent."))
  });

export type SignUpFormData = yup.InferType<ReturnType<typeof SignUpFormDataSchema>>;

const SignUpPage = ({
  primary_role,
  selectedOption,
  selectedTitleOption
}: {
  primary_role: string;
  selectedOption: string;
  selectedTitleOption: string;
}) => {
  const t = useT();
  const router = useRouter();

  const { mutate: signUp, isLoading } = usePostUsersRegister({
    onSuccess(data) {
      //@ts-ignore
      const email = data.data.email_address;
      if (!email) return;
      return router.push(`/auth/signup/confirm?email=${encodeURIComponent(email)}`);
    },

    onError(error) {
      error?.errors?.forEach(error => {
        let message = error.detail;
        if (error.source === "email_address" && error.code === "UNIQUE") {
          message = t(
            "An account with this email address already exists. Please try signing in with your existing account, or reset your password if you have forgotten it."
          );
        }

        //@ts-ignore
        form.setError(error.source, { message: message, type: "validate" });
      });
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
      body: {
        email_address: data.email_address,
        first_name: data.first_name,
        last_name: data.last_name,
        password: data.password,
        phone_number: data.phone_number,
        job_role: data.job_role,
        callback_url: window.location.origin + "/auth/verify/email/",
        primary_role: primary_role as string,
        country: selectedTitleOption == "Select Country" ? (selectedOption as any) : null,
        program: selectedTitleOption == "Select Framework" ? (selectedOption?.toLowerCase() as any) : null
      }
    });
  };

  return (
    // <BackgroundLayout>
    //   <ContentLayout>
    //     <SignUpForm form={form} handleSave={handleSave} loading={isLoading} />
    //   </ContentLayout>
    // </BackgroundLayout>
    <SignUpForm form={form} handleSave={handleSave} loading={isLoading} primary_role={primary_role as string} />
  );
};

export default SignUpPage;
