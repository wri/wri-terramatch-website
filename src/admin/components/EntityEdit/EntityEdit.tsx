import { Dictionary } from "lodash";
import { notFound } from "next/navigation";
import { useCallback, useMemo } from "react";
import { useCreatePath, useResourceContext } from "react-admin";
import { useNavigate, useParams } from "react-router-dom";

import modules from "@/admin/modules";
import WizardForm from "@/components/extensive/WizardForm";
import LoadingContainer from "@/components/generic/Loading/LoadingContainer";
import { FormModelType } from "@/connections/util/Form";
import { toFramework } from "@/context/framework.provider";
import { OrgFormDetails, ProjectFormDetails, useApiFieldsProvider } from "@/context/wizardForm.provider";
import { useGetV2ENTITYUUID } from "@/generated/apiComponents";
import { normalizedFormData } from "@/helpers/customForms";
import { v3EntityName } from "@/helpers/entity";
import { useDefaultValues, useEntityForm } from "@/hooks/useFormGet";
import { useFormUpdate } from "@/hooks/useFormUpdate";
import { EntityName } from "@/types/common";
import Log from "@/utils/log";

export const EntityEdit = () => {
  const { id } = useParams<"id">();
  const resource = useResourceContext();
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

  const { updateEntity, error, isSuccess, isUpdating } = useFormUpdate(entityName, entityUUID);

  const {
    formData: entityResponse,
    form,
    isLoading,
    loadError,
    formLoadFailure
  } = useEntityForm(entityName, entityUUID);

  const { data: entityValue } = useGetV2ENTITYUUID({ pathParams: { entity: entityName, uuid: entityUUID } });

  const model = useMemo(
    () => ({ model: v3EntityName(entityName) as FormModelType, uuid: entityUUID }),
    [entityName, entityUUID]
  );
  const [providerLoaded, fieldsProvider] = useApiFieldsProvider(form?.uuid);
  const framework = toFramework(form?.frameworkKey);
  const defaultValues = useDefaultValues(entityResponse?.data, fieldsProvider);

  const bannerTitle = useMemo(() => {
    if (entityName === "site-reports") {
      return `${entityValue?.data?.site?.name} ${entityResponse?.data.form_title}`;
    } else if (entityName === "nursery-reports") {
      return `${entityValue?.data?.nursery?.name} ${entityResponse?.data.form_title}`;
    }
    return form?.title;
  }, [entityName, entityResponse, entityValue, form?.title]);

  const organisation = entityValue?.data?.organisation;

  const orgDetails = useMemo(
    (): OrgFormDetails => ({
      uuid: organisation?.uuid,
      currency: entityName === "financial-reports" ? entityValue?.data?.currency : organisation?.currency,
      startMonth:
        entityName === "financial-reports" ? entityValue?.data?.fin_start_month : organisation?.fin_start_month,
      type: entityName === "financial-reports" ? entityValue?.data?.organisation?.type : organisation?.type
    }),
    [
      entityName,
      entityValue?.data?.currency,
      entityValue?.data?.fin_start_month,
      organisation?.currency,
      organisation?.fin_start_month,
      organisation?.uuid,
      organisation?.type,
      entityValue?.data?.organisation?.type
    ]
  );

  const projectDetails = useMemo(
    (): ProjectFormDetails => ({ uuid: entityValue?.data?.project?.uuid }),
    [entityValue?.data?.project?.uuid]
  );

  const onChange = useCallback(
    (data: Dictionary<any>) => updateEntity({ answers: normalizedFormData(data, fieldsProvider) }),
    [fieldsProvider, updateEntity]
  );

  if (loadError || formLoadFailure != null) {
    Log.error("Form data load failed", { loadError, formLoadFailure });
    return notFound();
  }

  return (
    <div className="mx-auto w-full max-w-7xl">
      <LoadingContainer loading={isLoading || !providerLoaded}>
        <WizardForm
          models={model}
          fieldsProvider={fieldsProvider}
          framework={framework}
          errors={error}
          onBackFirstStep={() => navigate("..")}
          onChange={onChange}
          formStatus={isSuccess ? "saved" : isUpdating ? "saving" : undefined}
          onSubmit={() => navigate(createPath({ resource, id, type: "show" }))}
          defaultValues={defaultValues}
          title={bannerTitle}
          tabOptions={{
            markDone: true,
            disableFutureTabs: true
          }}
          summaryOptions={{
            title: "Review Details",
            downloadButtonText: "Download"
          }}
          roundedCorners
          hideSaveAndCloseButton
          orgDetails={orgDetails}
          projectDetails={projectDetails}
        />
      </LoadingContainer>
    </div>
  );
};
