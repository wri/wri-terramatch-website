import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "next/router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";

import { requestPasswordReset } from "@/generated/v3/userService/userServiceComponents";
import { useValueChanged } from "@/hooks/useValueChanged";
import RequestResetForm from "@/pages/auth/reset-password/components/RequestResetForm";
import { useRequestPassword } from "@/store/apiSlice";

import LoginLayout from "../layout";

const RequestResetDataSchema = yup.object({
  email: yup.string().email().required()
});

export type RequestResetData = yup.InferType<typeof RequestResetDataSchema>;

const RequestResetPage = () => {
  const form = useForm<RequestResetData>({
    resolver: yupResolver(RequestResetDataSchema),
    mode: "onSubmit"
  });
  const [isToggled, setIsToggled] = useState(false);

  const router = useRouter();
  const isAdmin = router.asPath.includes("/admin");

  const baseAuthPath = isAdmin ? "/admin/auth" : "/auth";

  const [, { isLoading, requestFailed, isSuccess, requestEmail }] = useRequestPassword();

  useValueChanged(isSuccess, () => {
    if (isSuccess && isToggled)
      router.push(`${baseAuthPath}/reset-password/confirm?email=${encodeURIComponent(requestEmail)}`);
  });

  const handleSave = async (data: RequestResetData) => {
    setIsToggled(true);
    requestPasswordReset({
      body: { emailAddress: data.email, callbackUrl: window.location.origin + `${baseAuthPath}/reset-password` }
    });
  };

  return (
    <LoginLayout>
      <RequestResetForm form={form} loading={isLoading} handleSave={handleSave} apiError={requestFailed} />
    </LoginLayout>
  );
};

export default RequestResetPage;
