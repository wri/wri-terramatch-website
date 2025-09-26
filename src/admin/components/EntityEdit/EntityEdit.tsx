import { camelCase, defaults } from "lodash";
import { notFound } from "next/navigation";
import { useMemo } from "react";
import { useCreatePath, useResourceContext } from "react-admin";
import { useNavigate, useParams } from "react-router-dom";

import modules from "@/admin/modules";
import { OrgFormDetails } from "@/components/elements/Inputs/FinancialTableInput/types";
import WizardForm from "@/components/extensive/WizardForm";
import LoadingContainer from "@/components/generic/Loading/LoadingContainer";
import { FormModelType } from "@/connections/util/Form";
import { toFramework } from "@/context/framework.provider";
import { useApiFieldsProvider } from "@/context/wizardForm.provider";
import { GetV2FormsENTITYUUIDResponse, useGetV2ENTITYUUID } from "@/generated/apiComponents";
import { formDefaultValues, normalizedFormData } from "@/helpers/customForms";
import { singularEntityNameToPlural } from "@/helpers/entity";
import { useEntityForm } from "@/hooks/useFormGet";
import { useFormUpdate } from "@/hooks/useFormUpdate";
import { EntityName, isSingularEntityName } from "@/types/common";
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
    [modules.financialReport.ResourceName]: "financial-reports"
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

  const entityData = (entityResponse?.data ?? {}) as GetV2FormsENTITYUUIDResponse;
  const { form_title: title } = entityData;

  const model = useMemo(() => {
    const model = camelCase(
      isSingularEntityName(entityName) ? singularEntityNameToPlural(entityName) : entityName
    ) as FormModelType;
    return { model, uuid: entityUUID };
  }, [entityName, entityUUID]);
  const [providerLoaded, fieldsProvider] = useApiFieldsProvider(form?.uuid);
  const framework = toFramework(form?.frameworkKey);

  const sourceData = useMemo(
    () => defaults(entityData?.update_request?.content ?? {}, entityData?.answers),
    [entityData?.answers, entityData?.update_request?.content]
  );
  const defaultValues = useMemo(() => formDefaultValues(sourceData, fieldsProvider), [fieldsProvider, sourceData]);

  if (loadError != null || formLoadFailure != null) {
    Log.error("Form data load failed", { loadError, formLoadFailure });
    return notFound();
  }

  const bannerTitle = useMemo(() => {
    if (entityName === "site-reports") {
      return `${entityValue?.data?.site?.name} ${title}`;
    } else if (entityName === "nursery-reports") {
      return `${entityValue?.data?.nursery?.name} ${title}`;
    }
    return title;
  }, [entityName, entityValue, title]);

  const organisation = entityValue?.data?.organisation;

  const orgDetails = useMemo(
    (): OrgFormDetails => ({
      uuid: organisation?.uuid,
      currency: entityName === "financial-reports" ? entityValue?.data?.currency : organisation?.currency,
      startMonth:
        entityName === "financial-reports" ? entityValue?.data?.fin_start_month : organisation?.fin_start_month
    }),
    [
      entityName,
      entityValue?.data?.currency,
      entityValue?.data?.fin_start_month,
      organisation?.currency,
      organisation?.fin_start_month,
      organisation?.uuid
    ]
  );

  return (
    <div className="mx-auto w-full max-w-7xl">
      <LoadingContainer loading={isLoading || !providerLoaded}>
        <WizardForm
          models={model}
          fieldsProvider={fieldsProvider}
          framework={framework}
          errors={error}
          onBackFirstStep={() => navigate("..")}
          onChange={data => updateEntity({ answers: normalizedFormData(data, fieldsProvider) })}
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
        />
      </LoadingContainer>
    </div>
  );
};
