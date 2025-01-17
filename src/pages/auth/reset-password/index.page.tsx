import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as yup from "yup";

import { requestPasswordReset as newRequestResetPassword } from "@/generated/v3/userService/userServiceComponents";
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

  const handleSave = async (data: RequestResetData) => {
    /*return requestResetPassword({
      body: {
        email_address: data.email,
        callback_url: window.location.origin + `${baseAuthPath}/reset-password/`
      }
    });*/
    newRequestResetPassword({ body: { emailAddress: data.email } });
  };

  return (
    <LoginLayout>
      <RequestResetForm form={form} loading={false} handleSave={handleSave} apiError={null} />
    </LoginLayout>
  );
};

export default RequestResetPage;
