import { yupResolver } from "@hookform/resolvers/yup";
import { useT } from "@transifex/react";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import * as yup from "yup";

import Input from "@/components/elements/Inputs/Input/Input";
import Text from "@/components/elements/Text/Text";
import Form from "@/components/extensive/Form/Form";
import BackgroundLayout from "@/components/generic/Layout/BackgroundLayout";
import ContentLayout from "@/components/generic/Layout/ContentLayout";
import { fetchGetV2ReportingFrameworksAccessCodeACCESSCODE } from "@/generated/apiComponents";

const schema = yup.object({
  access_code: yup.string().label("Access Code").required()
});

export type FormData = yup.InferType<typeof schema>;

const ReportingFrameworkSelect = () => {
  const t = useT();
  const router = useRouter();

  const { register, formState, setError, handleSubmit } = useForm<FormData>({
    resolver: yupResolver(schema)
  });

  const onSubmitForm = (data: FormData) => {
    fetchGetV2ReportingFrameworksAccessCodeACCESSCODE({
      pathParams: {
        accessCode: data.access_code
      }
    })
      .then(data =>
        //@ts-ignore
        router.push(`/project/create/${data.data.project_form_uuid}`)
      )
      .catch(() => {
        setError("access_code", { message: t("Invalid access code, please try again"), type: "validate" });
      });
  };

  return (
    <BackgroundLayout>
      <ContentLayout>
        <Form onSubmit={handleSubmit(onSubmitForm)}>
          <Form.Header
            title={t("Enter Access Code")}
            subtitle="If you have been invited to monitor and report on your project in TerraMatch, please enter your invite code below. This will give you access to custom project and reporting templates."
          />

          <Input
            {...register("access_code")}
            type="text"
            name="access_code"
            label={t("Access Code")}
            error={formState.errors.access_code}
          />

          <Text variant="text-light-body-300" containHtml className="mt-7 text-center">
            {`${t("Not sure where to get this code?")} <a href="/">${t("Contact TerraMatch Support")}</a>`}
          </Text>

          <Form.Footer
            primaryButtonProps={{
              children: t("Continue"),
              className: "px-[5%]",
              type: "submit"
            }}
            secondaryButtonProps={{
              children: t("Cancel"),
              onClick: () => router.back()
            }}
          />
        </Form>
      </ContentLayout>
    </BackgroundLayout>
  );
};

export default ReportingFrameworkSelect;
