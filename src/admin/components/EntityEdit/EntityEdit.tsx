import { Dictionary } from "lodash";
import { useCallback, useEffect, useMemo } from "react";
import { Edit, useCreatePath, useEditContext, useResourceContext } from "react-admin";
import { useNavigate, useParams } from "react-router-dom";

import modules from "@/admin/modules";
import WizardForm from "@/components/extensive/WizardForm";
import LoadingContainer from "@/components/generic/Loading/LoadingContainer";
import { pruneEntityCache, useFullEntity } from "@/connections/Entity";
import { FormEntity, FormModelType } from "@/connections/Form";
import { toFramework } from "@/context/framework.provider";
import { useApiFieldsProvider } from "@/context/wizardForm.provider";
import { NurseryReportFullDto, SiteReportFullDto } from "@/generated/v3/entityService/entityServiceSchemas";
import { normalizedFormData } from "@/helpers/customForms";
import { v3EntityName } from "@/helpers/entity";
import { useDefaultValues, useEntityForm } from "@/hooks/useFormGet";
import { useFormUpdate } from "@/hooks/useFormUpdate";
import { useOnUnmount } from "@/hooks/useOnMount";
import { useProjectOrgFormData } from "@/hooks/useProjectOrgFormData";
import { EntityName } from "@/types/common";
import Log from "@/utils/log";

const EntityEditDisplay = () => {
  const { id } = useParams<"id">();
  const resource = useResourceContext();
  const { refetch } = useEditContext();
  const navigate = useNavigate();
  const createPath = useCreatePath();

  const ResourceEntityMapping = {
    [modules.project.ResourceName]: "projects",
    [modules.site.ResourceName]: "sites",
    [modules.nursery.ResourceName]: "nurseries",
    [modules.financialReport.ResourceName]: "financial-reports",

    [modules.projectReport.ResourceName]: "project-reports",
    [modules.siteReport.ResourceName]: "site-reports",
    [modules.nurseryReport.ResourceName]: "nursery-reports",
    [modules.financialReport.ResourceName]: "financial-reports",
    [modules.disturbanceReport.ResourceName]: "disturbance-reports",
    [modules.srpReport.ResourceName]: "srp-reports"
  };

  const entityName = ResourceEntityMapping[resource] as EntityName;
  const entityUUID = id as string;

  const formEntity = v3EntityName(entityName) as FormEntity;
  const { updateEntityAnswers, entityAnswersUpdating } = useFormUpdate(formEntity, entityUUID);
  const { formData, form, isLoading, loadFailure, formLoadFailure } = useEntityForm(formEntity, entityUUID);
  const [entityLoading, { data: entity }] = useFullEntity(formEntity, entityUUID);
  const { isLoading: orgLoading, orgDetails, projectDetails } = useProjectOrgFormData(entityName, entity);

  // When we unmount, clear the cache of the base entity so it gets fetched again when needed.
  useOnUnmount(() => {
    pruneEntityCache(formEntity, entityUUID);
    refetch();
  });

  const model = useMemo(
    () => ({ model: v3EntityName(entityName) as FormModelType, uuid: entityUUID }),
    [entityName, entityUUID]
  );
  const [providerLoaded, fieldsProvider] = useApiFieldsProvider(form?.uuid);
  const framework = toFramework(form?.frameworkKey);
  const defaultValues = useDefaultValues(formData, fieldsProvider);

  const bannerTitle = useMemo(() => {
    if (entityName === "site-reports") {
      return `${(entity as SiteReportFullDto)?.siteName} ${formData?.formTitle}`;
    } else if (entityName === "nursery-reports") {
      return `${(entity as NurseryReportFullDto)?.nurseryName} ${formData?.formTitle}`;
    }
    return form?.title;
  }, [entityName, form?.title, entity, formData?.formTitle]);

  const onChange = useCallback(
    (data: Dictionary<any>) => updateEntityAnswers({ answers: normalizedFormData(data, fieldsProvider) }),
    [fieldsProvider, updateEntityAnswers]
  );

  const hasLoadFailure = loadFailure != null || formLoadFailure != null;

  useEffect(() => {
    if (!hasLoadFailure) return;
    Log.error("Form data load failed", { loadFailure, formLoadFailure });
    navigate(createPath({ resource, type: "list" }));
  }, [createPath, formLoadFailure, hasLoadFailure, loadFailure, navigate, resource]);

  if (hasLoadFailure) return null;

  return (
    <LoadingContainer loading={orgLoading || isLoading || !providerLoaded || !entityLoading}>
      <WizardForm
        models={model}
        fieldsProvider={fieldsProvider}
        framework={framework}
        onBackFirstStep={() => navigate("..")}
        onChange={onChange}
        formStatus={entityAnswersUpdating ? "saving" : "saved"}
        onSubmit={() => navigate(createPath({ resource, id, type: "show" }))}
        defaultValues={defaultValues}
        title={bannerTitle}
        summaryOptions={{
          title: "Review Details",
          downloadButtonText: "Download"
        }}
        roundedCorners
        hideSaveAndCloseButton
        orgDetails={orgDetails}
        projectDetails={projectDetails}
        redirectEntityPage={"admin#" + createPath({ resource, id, type: "show" })}
        adminListPath={"admin#" + createPath({ resource, type: "list" })}
        cancelEditForm={() => navigate(createPath({ resource, id, type: "show" }))}
        entity={entity ?? undefined}
      />
    </LoadingContainer>
  );
};

export const EntityEdit = () => (
  <Edit>
    <EntityEditDisplay />
  </Edit>
);
