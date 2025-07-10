import { useT } from "@transifex/react";
import Link from "next/link";
import { useRouter } from "next/router";

import WizardFormIntro from "@/components/extensive/WizardForm/WizardFormIntro";
import BackgroundLayout from "@/components/generic/Layout/BackgroundLayout";
import ContentLayout from "@/components/generic/Layout/ContentLayout";
import LoadingContainer from "@/components/generic/Loading/LoadingContainer";
import { useFormSubmission } from "@/hooks/useFormGet";

const FormIntroPage = () => {
  const t = useT();
  const router = useRouter();
  const submissionUUID = router.query.submissionUUID as string;

  const { formData: submissionData } = useFormSubmission(submissionUUID);

  const formData = submissionData?.data.form;

  return (
    <BackgroundLayout>
      <ContentLayout>
        <LoadingContainer loading={!formData}>
          <WizardFormIntro
            title={formData?.title!}
            //@ts-ignore
            imageSrc={formData?.banner?.url}
            description={formData?.description}
            deadline={formData?.deadline_at}
            ctaProps={{
              children: formData?.documentation_label || t("View list of questions"),
              as: Link,
              href: formData?.documentation,
              target: "_blank"
            }}
            submitButtonProps={{
              children: t("Continue"),
              as: Link,
              href: `/form/submission/${submissionUUID}`
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
