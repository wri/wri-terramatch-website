import { useT } from "@transifex/react";
import Link from "next/link";
import { useRouter } from "next/router";

import WizardFormIntro from "@/components/extensive/WizardForm/WizardFormIntro";
import BackgroundLayout from "@/components/generic/Layout/BackgroundLayout";
import ContentLayout from "@/components/generic/Layout/ContentLayout";
import LoadingContainer from "@/components/generic/Loading/LoadingContainer";
import { useGetV2FormsENTITYUUID, useGetV2FormsUUID, usePostV2FormsENTITY } from "@/generated/apiComponents";
import { FormRead } from "@/generated/apiSchemas";
import { useGetFormUUID } from "@/hooks/useGetFormUUID";
import { EntityName } from "@/types/common";

/**
 * Starting point of creation flow
 * Provide either
 *    frameworkUUID, parent_name, parent_uuid : will create a new entity
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
  const frameworkUUID = router.query.frameworkUUID as string;

  //Allowed values projects/sites/nurseries/project-reports/site-reports/nursery-reports
  const parentName = router.query.parent_name as EntityName | "applications";
  const parentUUID = router.query.parent_uuid as string;
  const entityUUID = router.query.entity_uuid as string | undefined;

  const formUUID = !entityUUID ? useGetFormUUID(frameworkUUID, entityName) : undefined;

  const { data: formData } = useGetV2FormsUUID<{ data: FormRead }>(
    {
      pathParams: { uuid: formUUID! },
      queryParams: { lang: router.locale }
    },
    {
      enabled: !!formUUID
    }
  );

  const { data: entityData } = useGetV2FormsENTITYUUID(
    {
      pathParams: { entity: entityName, uuid: entityUUID! }
    },
    { enabled: !!entityUUID }
  );

  //@ts-ignore
  const form = entityData?.data?.form || formData?.data;

  const {
    mutate: createEntity,
    isSuccess,
    isLoading
  } = usePostV2FormsENTITY({
    onSuccess(data) {
      //@ts-ignore
      router.replace(`/entity/${entityName}/edit/${data.data.uuid}`);
    }
  });

  const handleContinue = () => {
    if (entityUUID) {
      router.push(`/entity/${entityName}/edit/${entityUUID}`);
    } else {
      createEntity({
        //@ts-ignore
        pathParams: {
          entity: entityName
        },
        body: {
          parent_entity: parentName,
          parent_uuid: parentUUID
        }
      });
    }
  };

  return (
    <BackgroundLayout>
      <ContentLayout>
        <LoadingContainer loading={!form}>
          <WizardFormIntro
            title={form?.title!}
            //@ts-ignore
            imageSrc={form?.banner?.url}
            description={form?.description}
            deadline={form?.deadline_at}
            ctaProps={{
              children: form?.documentation_label || t("View list of questions"),
              as: Link,
              href: form?.documentation,
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
        </LoadingContainer>
      </ContentLayout>
    </BackgroundLayout>
  );
};

export default EntityIntroPage;
