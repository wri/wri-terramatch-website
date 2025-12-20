import { useT } from "@transifex/react";
import Link from "next/link";
import { useRouter } from "next/router";

import WizardFormIntro from "@/components/extensive/WizardForm/WizardFormIntro";
import BackgroundLayout from "@/components/generic/Layout/BackgroundLayout";
import ContentLayout from "@/components/generic/Layout/ContentLayout";
import LoadingContainer from "@/components/generic/Loading/LoadingContainer";
import { useForm } from "@/connections/Form";
import { useSubmissionCreate } from "@/connections/FormSubmission";
import { useRequestSuccess } from "@/hooks/useConnectionUpdate";
import Log from "@/utils/log";

import ApplicationsTable from "../cards/ApplicationsTable";

const FormIntroPage = () => {
  const t = useT();
  const router = useRouter();
  const formUUID = router.query.id as string;

  const [, { data: form }] = useForm({ id: formUUID, enabled: formUUID != null });

  const [, { create, data: submission, isCreating, createFailure }] = useSubmissionCreate({});
  useRequestSuccess(
    isCreating,
    createFailure,
    () => {
      router.push(`/form/submission/${submission?.uuid}`);
    },
    "Application creation failed"
  );

  return (
    <BackgroundLayout>
      <ContentLayout>
        <LoadingContainer loading={form == null}>
          {form == null ? null : (
            <>
              <WizardFormIntro
                variant="small"
                title={form.title}
                imageSrc={form.banner?.url ?? undefined}
                description={form.description ?? undefined}
                deadline={form.deadlineAt ?? undefined}
                ctaProps={{
                  children: form.documentationLabel ?? t("View list of questions"),
                  as: Link,
                  href: form.documentation ?? undefined,
                  target: "_blank"
                }}
                submitButtonProps={{
                  children: t("Start Application"),
                  onClick: () => {
                    if (form?.fundingProgrammeId == null) {
                      Log.error("Funding programme ID is missing");
                    } else {
                      create({ fundingProgrammeUuid: form.fundingProgrammeId });
                    }
                  },
                  disabled: isCreating
                }}
                backButtonProps={{
                  children: t("Cancel"),
                  as: Link,
                  href: "/home"
                }}
              />
              <ApplicationsTable fundingProgrammeUuid={form.fundingProgrammeId ?? undefined} />
            </>
          )}
        </LoadingContainer>
      </ContentLayout>
    </BackgroundLayout>
  );
};

export default FormIntroPage;
