import { useT } from "@transifex/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useCallback, useEffect, useRef } from "react";

import WizardFormIntro from "@/components/extensive/WizardForm/WizardFormIntro";
import BackgroundLayout from "@/components/generic/Layout/BackgroundLayout";
import ContentLayout from "@/components/generic/Layout/ContentLayout";
import LoadingContainer from "@/components/generic/Loading/LoadingContainer";
import { useCreateProject } from "@/connections/Entity";
import { useForm } from "@/connections/Form";
import { ToastType, useToastContext } from "@/context/toast.provider";

/**
 * Use this route to create a project with a given form_uuid
 */
const ProjectIntroPage = () => {
  const t = useT();
  const router = useRouter();
  const { openToast } = useToastContext();
  const loadFailureHandled = useRef(false);
  const formUUID = router.query.formUUID as string;

  const [, { data: form, loadFailure }] = useForm({ id: formUUID, enabled: formUUID != null });
  const { create, isCreating } = useCreateProject(
    {},
    useCallback(
      ({ uuid }) => {
        router.replace(`/entity/projects/edit/${uuid}`);
      },
      [router]
    ),
    "Project creation failed"
  );

  useEffect(() => {
    if (loadFailure == null || loadFailureHandled.current) return;
    loadFailureHandled.current = true;
    openToast(t("We couldn't load this form."), ToastType.ERROR);
    router.replace("/home");
  }, [loadFailure, openToast, router, t]);

  if (loadFailure != null) return null;

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
                disabled: isCreating,
                onClick: () => create({ formUuid: formUUID })
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
