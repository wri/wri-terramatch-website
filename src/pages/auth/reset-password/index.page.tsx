import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import * as yup from "yup";

import { RequestPasswordReset, useRequestPassword } from "@/connections/ResetPassword";
import { useValueChanged } from "@/hooks/useValueChanged";
import RequestResetForm from "@/pages/auth/reset-password/components/RequestResetForm";

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

  const router = useRouter();
  const isAdmin = router.asPath.includes("/admin");

  const baseAuthPath = isAdmin ? "/admin/auth" : "/auth";

  const [, { isLoading, requestFailed, isSuccess, requestEmail }] = useRequestPassword();

  useValueChanged(isSuccess, () => {
    if (isSuccess) router.push(`${baseAuthPath}/reset-password/confirm?email=${encodeURIComponent(requestEmail)}`);
  });

  const handleSave = async (data: RequestResetData) => {
    RequestPasswordReset(data.email, window.location.origin + `${baseAuthPath}/reset-password`);
  };

  return (
    <LoginLayout>
      <RequestResetForm form={form} loading={isLoading} handleSave={handleSave} apiError={requestFailed} />
    </LoginLayout>
  );
};

export default RequestResetPage;
