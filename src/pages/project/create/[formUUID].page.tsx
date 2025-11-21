import { useT } from "@transifex/react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { useRouter } from "next/router";

import WizardFormIntro from "@/components/extensive/WizardForm/WizardFormIntro";
import BackgroundLayout from "@/components/generic/Layout/BackgroundLayout";
import ContentLayout from "@/components/generic/Layout/ContentLayout";
import LoadingContainer from "@/components/generic/Loading/LoadingContainer";
import { useForm } from "@/connections/util/Form";
import { usePostV2FormsProjectsUUID } from "@/generated/apiComponents";

/**
 * Use this route to create a project with a given form_uuid
 */
const ProjectIntroPage = () => {
  const t = useT();
  const router = useRouter();
  const formUUID = router.query.formUUID as string;

  const [, { data: form, loadFailure }] = useForm({ id: formUUID, enabled: formUUID != null });

  const {
    mutate: createProject,
    isLoading,
    isSuccess
  } = usePostV2FormsProjectsUUID({
    onSuccess(data) {
      //@ts-ignore
      router.replace(`/entity/projects/edit/${data.data.uuid}`);
    }
  });

  if (loadFailure != null) {
    return notFound();
  }

  return (
    <BackgroundLayout>
      <ContentLayout>
        <LoadingContainer loading={form == null}>
          {form == null ? null : (
            <WizardFormIntro
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
                children: t("Continue"),
                disabled: isLoading || isSuccess,
                onClick: () => {
                  createProject({
                    pathParams: {
                      uuid: formUUID
                    }
                  });
                }
              }}
              backButtonProps={{
                children: t("Cancel"),
                onClick: () => router.back()
              }}
            />
          )}
        </LoadingContainer>
      </ContentLayout>
    </BackgroundLayout>
  );
};

export default ProjectIntroPage;
