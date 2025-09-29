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

  const { form } = useFormSubmission(submissionUUID);

  return (
    <BackgroundLayout>
      <ContentLayout>
        <LoadingContainer loading={form == null}>
          {form == null ? null : (
            <WizardFormIntro
              title={form.title}
              imageSrc={form.bannerUrl ?? undefined}
              description={form.description ?? undefined}
              deadline={form.deadlineAt ?? undefined}
              ctaProps={{
                children: form.documentationLabel ?? t("View list of questions"),
                as: Link,
                href: form.documentation ?? undefined,
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
          )}
        </LoadingContainer>
      </ContentLayout>
    </BackgroundLayout>
  );
};

export default FormIntroPage;
