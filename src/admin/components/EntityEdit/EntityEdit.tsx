import { notFound } from "next/navigation";
import { useCreatePath, useResourceContext } from "react-admin";
import { useNavigate, useParams } from "react-router-dom";

import modules from "@/admin/modules";
import WizardForm from "@/components/extensive/WizardForm";
import LoadingContainer from "@/components/generic/Loading/LoadingContainer";
import {
  useGetV2FormsENTITYUUID,
  useGetV2UpdateRequestsENTITYUUID,
  usePutV2FormsENTITYUUID
} from "@/generated/apiComponents";
import { normalizedFormData } from "@/helpers/customForms";
import { pluralEntityNameToSingular } from "@/helpers/entity";
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

    [modules.projectReport.ResourceName]: "project-reports",
    [modules.siteReport.ResourceName]: "site-reports",
    [modules.nurseryReport.ResourceName]: "nursery-reports"
  };

  const entityName = ResourceEntityMapping[resource] as EntityName;
  const entityUUID = id as string;

  const { mutate: updateEntity, error, isSuccess, isLoading: isUpdating } = usePutV2FormsENTITYUUID({});

  const { data: updateRequestResponse, isLoading: updateRequestLoading } = useGetV2UpdateRequestsENTITYUUID(
    {
      pathParams: {
        entity: pluralEntityNameToSingular(entityName),
        uuid: entityUUID
      }
    },
    {
      retry(failureCount: number, error: any): boolean {
        // avoid retries on a 404; that's expected in most cases for this form
        return error.statusCode !== 404 && failureCount < 3;
      },
      onError() {
        // To override error toast
      }
    }
  );
  // @ts-ignore
  const updateRequest = updateRequestResponse?.data;

  const {
    data: formResponse,
    isLoading: formDataLoading,
    isError
  } = useGetV2FormsENTITYUUID({
    pathParams: { entity: entityName, uuid: entityUUID }
  });
  //@ts-ignore

  const formData = (formResponse?.data || {}) as GetV2FormsENTITYUUIDResponse;

  const formSteps = useGetCustomFormSteps(formData.form, {
    entityName: pluralEntityNameToSingular(entityName),
    entityUUID
  });

  const isLoading = updateRequestLoading || formDataLoading;
  //@ts-ignore
  const defaultValues = useNormalizedFormDefaultValue(updateRequest?.content ?? formData.answers, formSteps);

  if (isError) {
    return notFound();
  }

  return (
    <div className="mx-auto w-full max-w-7xl">
      <LoadingContainer loading={isLoading}>
        <WizardForm
          steps={formSteps!}
          errors={error}
          onBackFirstStep={() => navigate("..")}
          onChange={data =>
            updateEntity({
              pathParams: { uuid: entityUUID, entity: entityName },
              body: { answers: normalizedFormData(data, formSteps!) }
            })
          }
          formStatus={isSuccess ? "saved" : isUpdating ? "saving" : undefined}
          onSubmit={() => navigate(createPath({ resource, id, type: "show" }))}
          defaultValues={defaultValues}
          title={formData.form_title}
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
        />
      </LoadingContainer>
    </div>
  );
};
