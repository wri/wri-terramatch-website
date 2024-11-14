import { yupResolver } from "@hookform/resolvers/yup";
import { useT } from "@transifex/react";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import * as yup from "yup";

import { usePasswordStrength } from "@/components/extensive/PasswordStrength/hooks/usePasswordStrength";
import { useToastContext } from "@/context/toast.provider";
import { usePutV2AuthCompleteSignup } from "@/generated/apiComponents";

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

const ResetPasswordPage = () => {
  const router = useRouter();
  const { openToast } = useToastContext();
  const t = useT();

  const { mutateAsync: patchAuthChange, isLoading } = usePutV2AuthCompleteSignup({
    onSuccess() {
      openToast(t("Account created successfully"));
      router.push("/login");
    }
  });
  const form = useForm<SignUpFormData>({
    resolver: yupResolver(SignUpFormDataSchema(t)),
    mode: "onSubmit"
  });

  const { strength } = usePasswordStrength({ password: form.watch("password") });

  const handleSave = async (data: SignUpFormData) => {
    if (strength !== "Strong")
      return form.setError("password", {
        message: t(
          "The password does not meet the minimum requirements. Please check that it contains at least 8 characters, including uppercase letters, lowercase letters and numbers."
        )
      });
    await patchAuthChange({
      body: {
        token: (router.query.token as string)!,
        email_address: data.email_address,
        first_name: data.first_name,
        last_name: data.last_name,
        password: data.password,
        phone_number: data.phone_number,
        job_role: data.job_role,
        role: "project-developer"
      }
    });
  };
  return <SignUpForm form={form} handleSave={handleSave} loading={isLoading} role={"project-developer" as string} />;
};

export default ResetPasswordPage;
