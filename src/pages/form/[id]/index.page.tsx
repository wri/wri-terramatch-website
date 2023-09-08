import { useT } from "@transifex/react";
import Link from "next/link";
import { useRouter } from "next/router";

import WizardFormIntro from "@/components/extensive/WizardForm/WizardFormIntro";
import BackgroundLayout from "@/components/generic/Layout/BackgroundLayout";
import ContentLayout from "@/components/generic/Layout/ContentLayout";
import LoadingContainer from "@/components/generic/Loading/LoadingContainer";
import { useGetV2FormsUUID } from "@/generated/apiComponents";
import { FormRead } from "@/generated/apiSchemas";

//Todo: To fetch form data and populate title, image, description and downloadLink when endpoint is ready
const FormIntroPage = () => {
  const t = useT();
  const router = useRouter();
  const formUUID = router.query.id as string;

  const { data: formData } = useGetV2FormsUUID<{ data: FormRead }>({
    pathParams: { uuid: formUUID },
    queryParams: { lang: router.locale }
  });

  return (
    <BackgroundLayout>
      <ContentLayout>
        <LoadingContainer loading={!formData?.data}>
          <WizardFormIntro
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
              children: t("Continue"),
              as: Link,
              href: `/form/${formUUID}/pitch-select`
            }}
            backButtonProps={{
              children: t("Cancel"),
              as: Link,
              href: "/home"
            }}
          />
        </LoadingContainer>
      </ContentLayout>
    </BackgroundLayout>
  );
};

export default FormIntroPage;
