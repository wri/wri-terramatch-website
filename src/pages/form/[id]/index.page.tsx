import { useT } from "@transifex/react";
import Link from "next/link";
import { useRouter } from "next/router";

import WizardFormIntro from "@/components/extensive/WizardForm/WizardFormIntro";
import BackgroundLayout from "@/components/generic/Layout/BackgroundLayout";
import ContentLayout from "@/components/generic/Layout/ContentLayout";
import LoadingContainer from "@/components/generic/Loading/LoadingContainer";
import { useGetV2FormsUUID, usePostV2FormsSubmissions } from "@/generated/apiComponents";
import { FormRead } from "@/generated/apiSchemas";

import ApplicationsTable from "../cards/ApplicationsTable";

const FormIntroPage = () => {
  const t = useT();
  const router = useRouter();
  const formUUID = router.query.id as string;

  const { data: formData } = useGetV2FormsUUID<{ data: FormRead }>({
    pathParams: { uuid: formUUID },
    queryParams: { lang: router.locale }
  });

  const { mutate: create, isLoading } = usePostV2FormsSubmissions({
    onSuccess(data) {
      // @ts-ignore
      router.push(`/form/submission/${data.data.uuid}`);
    }
  });

  return (
    <BackgroundLayout>
      <ContentLayout>
        <LoadingContainer loading={!formData?.data}>
          <WizardFormIntro
            variant="small"
            title={formData?.data.title!}
            //@ts-ignore
            imageSrc={formData?.data?.banner?.url}
            description={formData?.data.description}
            deadline={formData?.data.deadline_at}
            ctaProps={{
              children: formData?.data.documentation_label || t("View list of questions"),
              as: Link,
              href: formData?.data.documentation,
              target: "_blank"
            }}
            submitButtonProps={{
              children: t("Start Application"),
              onClick: () => create({ body: { form_uuid: formUUID } }),
              disabled: isLoading
            }}
            backButtonProps={{
              children: t("Cancel"),
              as: Link,
              href: "/home"
            }}
          />
          <ApplicationsTable fundingProgrammeUuid={formData?.data.funding_programme_uuid} />
        </LoadingContainer>
      </ContentLayout>
    </BackgroundLayout>
  );
};

export default FormIntroPage;
