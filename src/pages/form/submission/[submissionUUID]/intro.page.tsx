import { useT } from "@transifex/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useMemo } from "react";

import WizardFormIntro from "@/components/extensive/WizardForm/WizardFormIntro";
import BackgroundLayout from "@/components/generic/Layout/BackgroundLayout";
import ContentLayout from "@/components/generic/Layout/ContentLayout";
import LoadingContainer from "@/components/generic/Loading/LoadingContainer";
import { useFundingProgramme } from "@/connections/FundingProgramme";
import { useFormSubmission } from "@/hooks/useFormGet";
import { resolveFormIntroDeadline } from "@/utils/formIntroDeadline";

const FormIntroPage = () => {
  const t = useT();
  const router = useRouter();
  const submissionUUID = router.query.submissionUUID as string;

  const submissionResult = useFormSubmission(submissionUUID);
  const form = submissionResult.isLoading ? undefined : submissionResult.form;
  const formData = submissionResult.isLoading ? undefined : submissionResult.formData;
  const [, { data: fundingProgramme }] = useFundingProgramme({
    id: form?.fundingProgrammeId ?? undefined,
    enabled: form?.fundingProgrammeId != null
  });
  const deadline = useMemo(
    () =>
      resolveFormIntroDeadline({
        formType: form?.type,
        stages: fundingProgramme?.stages,
        stageUuid: formData?.stageUuid,
        formUuid: form?.uuid
      }),
    [form?.type, form?.uuid, formData?.stageUuid, fundingProgramme?.stages]
  );

  return (
    <BackgroundLayout>
      <ContentLayout>
        <LoadingContainer loading={form == null}>
          {form == null ? null : (
            <WizardFormIntro
              title={form.title}
              imageSrc={form.banner?.url ?? undefined}
              description={form.description ?? undefined}
              deadline={deadline}
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
