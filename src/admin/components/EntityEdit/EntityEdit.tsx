import { defaults } from "lodash";
import { notFound } from "next/navigation";
import { useMemo } from "react";
import { useCreatePath, useResourceContext } from "react-admin";
import { useNavigate, useParams } from "react-router-dom";

import modules from "@/admin/modules";
import WizardForm from "@/components/extensive/WizardForm";
import LoadingContainer from "@/components/generic/Loading/LoadingContainer";
import EntityProvider from "@/context/entity.provider";
import FrameworkProvider, { Framework } from "@/context/framework.provider";
import { GetV2FormsENTITYUUIDResponse, useGetV2ENTITYUUID } from "@/generated/apiComponents";
import { normalizedFormData } from "@/helpers/customForms";
import { pluralEntityNameToSingular } from "@/helpers/entity";
import { useEntityForm } from "@/hooks/useFormGet";
import { useFormUpdate } from "@/hooks/useFormUpdate";
import {
  useGetCustomFormSteps,
  useNormalizedFormDefaultValue
} from "@/hooks/useGetCustomFormSteps/useGetCustomFormSteps";
import { EntityName } from "@/types/common";

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

  const { formData: formResponse, isLoading, loadError } = useEntityForm(entityName, entityUUID);

  const { data: entityValue } = useGetV2ENTITYUUID({ pathParams: { entity: entityName, uuid: entityUUID } });

  // @ts-ignore
  const formData = (formResponse?.data ?? {}) as GetV2FormsENTITYUUIDResponse;

  const entity = {
    entityName: pluralEntityNameToSingular(entityName),
    entityUUID
  };
  const framework = formData?.form?.framework_key as Framework;
  const formSteps = useGetCustomFormSteps(formData.form, entity, framework);

  const sourceData = useMemo(
    () => defaults(formData?.update_request?.content ?? {}, formData?.answers),
    [formData?.answers, formData?.update_request?.content]
  );
  const defaultValues = useNormalizedFormDefaultValue(sourceData, formSteps);

  // @ts-ignore
  const { form_title: title } = formData;

  if (loadError) {
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

  return (
    <div className="mx-auto w-full max-w-7xl">
      <LoadingContainer loading={isLoading}>
        <FrameworkProvider frameworkKey={framework}>
          <EntityProvider entityUuid={entityUUID} entityName={entityName}>
            <WizardForm
              steps={formSteps!}
              errors={error}
              onBackFirstStep={() => navigate("..")}
              onChange={data => updateEntity({ answers: normalizedFormData(data, formSteps!) })}
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
          </EntityProvider>
        </FrameworkProvider>
      </LoadingContainer>
    </div>
  );
};
