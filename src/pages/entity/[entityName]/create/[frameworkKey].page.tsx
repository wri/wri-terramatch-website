import { useT } from "@transifex/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useCallback } from "react";

import PageFooter from "@/components/extensive/PageElements/Footer/PageFooter";
import WizardFormIntro from "@/components/extensive/WizardForm/WizardFormIntro";
import BackgroundLayout from "@/components/generic/Layout/BackgroundLayout";
import ContentLayout from "@/components/generic/Layout/ContentLayout";
import LoadingContainer from "@/components/generic/Loading/LoadingContainer";
import { useForm } from "@/connections/util/Form";
import { PostV2FormsENTITYResponse, usePostV2FormsENTITY } from "@/generated/apiComponents";
import { useEntityForm } from "@/hooks/useFormGet";
import { useGetReportingFrameworkFormKey } from "@/hooks/useGetFormKey";
import { EntityName } from "@/types/common";

/**
 * Starting point of creation flow
 * Provide either
 *    frameworkKey, parent_name, parent_uuid : will create a new entity
 * or
 *    entity_uuid: providing entity_uuid will bypass creation of a new entity and takes user directly to next page
 *
 * entityName: projects/sites/nurseries/project-reports/site-reports/nursery-reports
 */
const EntityIntroPage = () => {
  const t = useT();
  const router = useRouter();
  //Allowed values projects/sites/nurseries/project-reports/site-reports/nursery-reports
  const entityName = router.query.entityName as EntityName;
  const frameworkKey = router.query.frameworkKey as string;

  //Allowed values projects/sites/nurseries/project-reports/site-reports/nursery-reports
  const parentName = router.query.parent_name as EntityName | "applications";
  const parentUUID = router.query.parent_uuid as string;
  const entityUUID = router.query.entity_uuid as string | undefined;

  const formUUID = entityUUID == null ? useGetReportingFrameworkFormKey(frameworkKey, entityName) : undefined;
  const [, { data: frameworkForm }] = useForm({ id: formUUID, enabled: formUUID != null });
  const { form: entityForm } = useEntityForm(entityName, entityUUID);
  const form = frameworkForm ?? entityForm;

  const {
    mutate: createEntity,
    isSuccess,
    isLoading
  } = usePostV2FormsENTITY({
    onSuccess(response) {
      const { uuid } = (response as { data: PostV2FormsENTITYResponse }).data;
      router.replace(`/entity/${entityName}/edit/${uuid}`);
    }
  });

  const handleContinue = useCallback(() => {
    if (entityUUID != null) {
      router.push(`/entity/${entityName}/edit/${entityUUID}`);
    } else {
      createEntity({
        pathParams: {
          entity: entityName
        },
        body: {
          parent_entity: parentName,
          parent_uuid: parentUUID,
          form_uuid: formUUID
        }
      });
    }
  }, [createEntity, entityName, entityUUID, formUUID, parentName, parentUUID, router]);

  return (
    <BackgroundLayout>
      <ContentLayout>
        <LoadingContainer loading={!form}>
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
                onClick: handleContinue
              }}
              backButtonProps={{
                children: t("Cancel"),
                onClick: () => router.back()
              }}
            />
          )}
        </LoadingContainer>
      </ContentLayout>
      <PageFooter />
    </BackgroundLayout>
  );
};

export default EntityIntroPage;
