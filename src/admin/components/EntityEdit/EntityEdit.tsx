import { notFound } from "next/navigation";
import { useCreatePath, useResourceContext } from "react-admin";
import { useNavigate, useParams } from "react-router-dom";

import useFormData from "@/admin/components/EntityEdit/useFormData";
import modules from "@/admin/modules";
import WizardForm from "@/components/extensive/WizardForm";
import LoadingContainer from "@/components/generic/Loading/LoadingContainer";
import { normalizedFormData } from "@/helpers/customForms";
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

  const { isLoading, loadError, isUpdating, isSuccess, error, updateEntity, formSteps, values, title } = useFormData(
    entityName,
    entityUUID
  );

  if (loadError) {
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
          values={values}
          title={title}
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
