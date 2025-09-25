import { camelCase, defaults } from "lodash";
import { notFound } from "next/navigation";
import { useMemo } from "react";
import { useCreatePath, useResourceContext } from "react-admin";
import { useNavigate, useParams } from "react-router-dom";

import modules from "@/admin/modules";
import WizardForm from "@/components/extensive/WizardForm";
import LoadingContainer from "@/components/generic/Loading/LoadingContainer";
import { FormModelType } from "@/connections/util/Form";
import FormModelProvider from "@/context/formModel.provider";
import FrameworkProvider, { Framework } from "@/context/framework.provider";
import { GetV2FormsENTITYUUIDResponse, useGetV2ENTITYUUID } from "@/generated/apiComponents";
import { singularEntityNameToPlural } from "@/helpers/entity";
import { useEntityForm } from "@/hooks/useFormGet";
import { useFormUpdate } from "@/hooks/useFormUpdate";
import { useFormDefaultValues, useNormalizer } from "@/hooks/useGetCustomFormSteps/useGetCustomFormSteps";
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

  const sourceData = useMemo(
    () => defaults(entityData?.update_request?.content ?? {}, entityData?.answers),
    [entityData?.answers, entityData?.update_request?.content]
  );
  const defaultValues = useFormDefaultValues(sourceData, form?.uuid);
  const normalizer = useNormalizer(form?.uuid);

  const { form_title: title } = entityData;

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

  const formSubmissionOrg = {
    uuid: organisation?.uuid,
    type: organisation?.type,
    currency: entityName === "financial-reports" ? entityValue?.data?.currency : organisation?.currency,
    start_month: entityName === "financial-reports" ? entityValue?.data?.fin_start_month : organisation?.fin_start_month
  };

  const formModelType = useMemo(
    () =>
      camelCase(
        isSingularEntityName(entityName) ? singularEntityNameToPlural(entityName) : entityName
      ) as FormModelType,
    [entityName]
  );

  return (
    <div className="mx-auto w-full max-w-7xl">
      <LoadingContainer loading={isLoading}>
        {form == null ? null : (
          <FrameworkProvider frameworkKey={form.frameworkKey as Framework}>
            <FormModelProvider model={formModelType} uuid={entityUUID}>
              <WizardForm
                formUuid={form.uuid}
                errors={error}
                onBackFirstStep={() => navigate("..")}
                onChange={data => updateEntity({ answers: normalizer(data) })}
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
                formSubmissionOrg={formSubmissionOrg}
              />
            </FormModelProvider>
          </FrameworkProvider>
        )}
      </LoadingContainer>
    </div>
  );
};
