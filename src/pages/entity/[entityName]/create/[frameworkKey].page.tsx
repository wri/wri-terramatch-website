import { useT } from "@transifex/react";
import { kebabCase } from "lodash";
import Link from "next/link";
import { useRouter } from "next/router";
import { useCallback } from "react";

import PageFooter from "@/components/extensive/PageElements/Footer/PageFooter";
import WizardFormIntro from "@/components/extensive/WizardForm/WizardFormIntro";
import BackgroundLayout from "@/components/generic/Layout/BackgroundLayout";
import ContentLayout from "@/components/generic/Layout/ContentLayout";
import LoadingContainer from "@/components/generic/Loading/LoadingContainer";
import { useCreateNursery, useCreateProject, useCreateSite } from "@/connections/Entity";
import { FormEntity, useForm } from "@/connections/Form";
import {
  EntityCreateAttributes,
  NurseryFullDto,
  ProjectCreateAttributes,
  ProjectFullDto,
  SiteFullDto
} from "@/generated/v3/entityService/entityServiceSchemas";
import { singularEntityName, v3EntityName } from "@/helpers/entity";
import { useEntityForm } from "@/hooks/useFormGet";
import { useGetReportingFrameworkFormKey } from "@/hooks/useGetFormKey";
import { EntityName } from "@/types/common";
import Log from "@/utils/log";

const useCreateEntity = (
  entityName: FormEntity,
  onSuccess: (data: ProjectFullDto | SiteFullDto | NurseryFullDto) => void,
  failureMessage?: string
) => {
  const { create: createProject, isCreating: projectCreating } = useCreateProject({}, onSuccess, failureMessage);
  const { create: createSite, isCreating: siteCreating } = useCreateSite({}, onSuccess, failureMessage);
  const { create: createNursery, isCreating: nurseryCreating } = useCreateNursery({}, onSuccess, failureMessage);

  if (entityName === "projects") {
    return { createEntity: createProject, isCreating: projectCreating };
  } else if (entityName === "sites") {
    return { createEntity: createSite, isCreating: siteCreating };
  } else if (entityName === "nurseries") {
    return { createEntity: createNursery, isCreating: nurseryCreating };
  } else {
    Log.warn("useCreateEntity: Invalid entityName", { entityName });
    return {};
  }
};

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
  const parentUUID = router.query.parent_uuid as string;
  const entityUUID = router.query.entity_uuid as string | undefined;

  const formUUID = entityUUID == null ? useGetReportingFrameworkFormKey(frameworkKey, entityName) : undefined;
  const [, { data: frameworkForm }] = useForm({ id: formUUID, enabled: formUUID != null });
  const { form: entityForm } = useEntityForm(v3EntityName(entityName) as FormEntity, entityUUID);
  const form = frameworkForm ?? entityForm;
  const { createEntity, isCreating } = useCreateEntity(
    v3EntityName(entityName) as FormEntity,
    useCallback(({ uuid }) => router.replace(`/entity/${entityName}/edit/${uuid}`), [entityName, router]),
    `Failed to create ${kebabCase(singularEntityName(entityName)).replace("-", " ")}`
  );

  const handleContinue = useCallback(() => {
    if (entityUUID != null) {
      router.push(`/entity/${entityName}/edit/${entityUUID}`);
    } else {
      if (entityName === "projects") {
        (createEntity as (attributes: ProjectCreateAttributes) => void)({
          applicationUuid: parentUUID,
          formUuid: formUUID ?? ""
        });
      } else {
        (createEntity as (attributes: EntityCreateAttributes) => void)({
          parentUuid: parentUUID
        });
      }
    }
  }, [createEntity, entityName, entityUUID, formUUID, parentUUID, router]);

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
                disabled: isCreating,
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
