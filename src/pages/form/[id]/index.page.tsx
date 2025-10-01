import { useT } from "@transifex/react";
import Link from "next/link";
import { useRouter } from "next/router";

import WizardFormIntro from "@/components/extensive/WizardForm/WizardFormIntro";
import BackgroundLayout from "@/components/generic/Layout/BackgroundLayout";
import ContentLayout from "@/components/generic/Layout/ContentLayout";
import LoadingContainer from "@/components/generic/Loading/LoadingContainer";
import { useForm } from "@/connections/util/Form";
import { usePostV2FormsSubmissions } from "@/generated/apiComponents";

import ApplicationsTable from "../cards/ApplicationsTable";

const FormIntroPage = () => {
  const t = useT();
  const router = useRouter();
  const formUUID = router.query.id as string;

  const [, { data: form }] = useForm({ id: formUUID, enabled: formUUID != null });

  const { mutate: create, isLoading } = usePostV2FormsSubmissions({
    onSuccess(data) {
      // @ts-ignore
      router.push(`/form/submission/${data.data.uuid}`);
    }
  });

  return (
    <BackgroundLayout>
      <ContentLayout>
        <LoadingContainer loading={form == null}>
          {form == null ? null : (
            <>
              <WizardFormIntro
                variant="small"
                title={form.title}
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
                  onClick: () => create({ body: { form_uuid: formUUID } }),
                  disabled: isLoading
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
