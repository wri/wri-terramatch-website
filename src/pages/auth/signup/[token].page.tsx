import { yupResolver } from "@hookform/resolvers/yup";
import { useT } from "@transifex/react";
import { useRouter } from "next/router";
import { useCallback } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";

import { usePasswordStrength } from "@/components/extensive/PasswordStrength/hooks/usePasswordStrength";
import { useUserCreation } from "@/connections/User";
import { useToastContext } from "@/context/toast.provider";
import { useRequestComplete } from "@/hooks/useConnectionUpdate";

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
    confirm_password: yup.string().oneOf([yup.ref("password")], t("Passwords must match.")),
    terms: yup.boolean().isTrue(t("Please accept terms and conditions.")),
    consent: yup.boolean().isTrue(t("Please accept consent."))
  });

export type SignUpFormData = yup.InferType<ReturnType<typeof SignUpFormDataSchema>>;

const InviteSignupPage = () => {
  const router = useRouter();
  const { openToast } = useToastContext();
  const t = useT();
  const role = "project-developer";

  const form = useForm<SignUpFormData>({
    resolver: yupResolver(SignUpFormDataSchema(t)),
    mode: "onSubmit"
  });

  const [, { isCreating, createFailure, create: signUp }] = useUserCreation({});
  useRequestComplete(
    isCreating,
    createFailure,
    useCallback(
      failure => {
        if (failure == null) {
          openToast(t("Account created successfully"));
          router.push("/auth/login");
        } else {
          const message =
            failure.statusCode == 422 && failure.message == "User already exists"
              ? t(
                  "An account with this email address already exists. Please try signing in with your existing account, or reset your password if you have forgotten it."
                )
              : t("An error occurred. Please try again later.");
          form.setError("root", { message, type: "validate" });
        }
      },
      [form, openToast, router, t]
    )
  );

  const { strength } = usePasswordStrength({ password: form.watch("password") });

  const handleSave = async (data: SignUpFormData): Promise<void> => {
    if (strength !== "Strong") {
      form.setError("password", {
        message: t(
          "The password does not meet the minimum requirements. Please check that it contains at least 8 characters, including uppercase letters, lowercase letters and numbers."
        )
      });
      return;
    }

    const token = router.query.token as string | undefined;
    if (token == null) {
      form.setError("root", { message: t("Invalid signup link") });
      return;
    }

    signUp({
      emailAddress: data.email_address,
      firstName: data.first_name,
      lastName: data.last_name,
      // @ts-expect-error - password is not part of the UserCreateBaseAttributes, but is required by the API.
      password: data.password,
      phoneNumber: data.phone_number,
      jobRole: data.job_role,
      callbackUrl: window.location.origin + "/auth/login",
      role,
      token,
      country: "",
      program: ""
    });
  };

  return <SignUpForm form={form} handleSave={handleSave} loading={isCreating} role={role} />;
};

export default InviteSignupPage;
