import { useT } from "@transifex/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useCallback, useMemo } from "react";

import WizardFormIntro from "@/components/extensive/WizardForm/WizardFormIntro";
import BackgroundLayout from "@/components/generic/Layout/BackgroundLayout";
import ContentLayout from "@/components/generic/Layout/ContentLayout";
import LoadingContainer from "@/components/generic/Loading/LoadingContainer";
import { useForm } from "@/connections/Form";
import { useSubmissionCreate } from "@/connections/FormSubmission";
import { useFundingProgramme } from "@/connections/FundingProgramme";
import { useRequestSuccess } from "@/hooks/useConnectionUpdate";
import ApiSlice from "@/store/apiSlice";
import { resolveFormIntroDeadline } from "@/utils/formIntroDeadline";
import Log from "@/utils/log";

import ApplicationsTable from "../cards/ApplicationsTable";

const FormIntroPage = () => {
  const t = useT();
  const router = useRouter();
  const formUUID = router.query.id as string;

  const [, { data: form }] = useForm({ id: formUUID, enabled: formUUID != null });
  const [, { data: fundingProgramme }] = useFundingProgramme({
    id: form?.fundingProgrammeId ?? undefined,
    enabled: form?.fundingProgrammeId != null
  });
  const deadline = useMemo(
    () =>
      resolveFormIntroDeadline({
        formType: form?.type,
        stages: fundingProgramme?.stages,
        formUuid: form?.uuid
      }),
    [form?.type, form?.uuid, fundingProgramme?.stages]
  );

  const [, { create, data: submission, isCreating, createFailure }] = useSubmissionCreate({});
  useRequestSuccess(
    isCreating,
    createFailure,
    useCallback(() => {
      ApiSlice.pruneIndex("applications");
      router.push(`/form/submission/${submission?.uuid}`);
    }, [router, submission?.uuid]),
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
                deadline={deadline}
                ctaProps={{
                  children: form.documentationLabel != null ? t(form.documentationLabel) : t("View list of questions"),
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
