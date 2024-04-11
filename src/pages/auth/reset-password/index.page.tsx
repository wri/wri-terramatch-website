import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import * as yup from "yup";

// import BackgroundLayout from "@/components/generic/Layout/BackgroundLayout";
// import ContentLayout from "@/components/generic/Layout/ContentLayout";
import { usePostAuthReset } from "@/generated/apiComponents";
import RequestResetForm from "@/pages/auth/reset-password/components/RequestResetForm";

import LoginLayout from "../layout";

const RequestResetDataSchema = yup.object({
  email: yup.string().email().required()
});

export type RequestResetData = yup.InferType<typeof RequestResetDataSchema>;

const RequestResetPage = () => {
  const router = useRouter();
  const isAdmin = router.asPath.includes("/admin");

  const baseAuthPath = isAdmin ? "/admin/auth" : "/auth";

  const {
    mutateAsync: requestResetPassword,
    isLoading,
    error
  } = usePostAuthReset({
    onSuccess(_, variables) {
      router.push(`${baseAuthPath}/reset-password/confirm?email=${encodeURIComponent(variables.body?.email_address!)}`);
    }
  });

  const form = useForm<RequestResetData>({
    resolver: yupResolver(RequestResetDataSchema),
    mode: "all"
  });

  const handleSave = async (data: RequestResetData) => {
    return requestResetPassword({
      body: {
        email_address: data.email,
        callback_url: window.location.origin + `${baseAuthPath}/reset-password/`
      }
    });
  };

  return (
    <LoginLayout>
      <RequestResetForm form={form} loading={isLoading} handleSave={handleSave} apiError={error} />
    </LoginLayout>
    // <BackgroundLayout>
    //   <ContentLayout>
    //     <RequestResetForm form={form} loading={isLoading} handleSave={handleSave} apiError={error} />
    //   </ContentLayout>
    // </BackgroundLayout>
  );
};

export default RequestResetPage;
