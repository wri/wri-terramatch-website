import { Dictionary } from "lodash";
import { useCallback, useEffect } from "react";
import { Edit, useCreatePath, useEditContext, useResourceContext } from "react-admin";
import { useNavigate, useParams } from "react-router-dom";

import WizardForm from "@/components/extensive/WizardForm";
import LoadingContainer from "@/components/generic/Loading/LoadingContainer";
import { Framework } from "@/context/framework.provider";
import { normalizedFormData } from "@/helpers/customForms";
import { useFormUpdate } from "@/hooks/useFormUpdate";
import { useOnUnmount } from "@/hooks/useOnMount";
import { useOrganisationForm } from "@/hooks/useOrganisationForm";
import Log from "@/utils/log";

const OrganisationEditDisplay = () => {
  const { id } = useParams<"id">();
  const resource = useResourceContext();
  const { refetch } = useEditContext();
  const navigate = useNavigate();
  const createPath = useCreatePath();

  const { models, form, fieldsProvider, defaultValues, isReady, loadFailure } = useOrganisationForm(id);
  const { updateEntityAnswers, entityAnswersUpdating } = useFormUpdate("organisations", id);

  useOnUnmount(refetch);

  const onChange = useCallback(
    (data: Dictionary<unknown>) => updateEntityAnswers({ answers: normalizedFormData(data, fieldsProvider) }),
    [fieldsProvider, updateEntityAnswers]
  );

  useEffect(() => {
    if (loadFailure == null) return;
    Log.error("Organisation form data load failed", loadFailure);
    navigate(createPath({ resource, type: "list" }));
  }, [createPath, loadFailure, navigate, resource]);

  if (loadFailure != null) return null;

  return (
    <LoadingContainer loading={!isReady}>
      <WizardForm
        models={models}
        fieldsProvider={fieldsProvider}
        framework={Framework.UNDEFINED}
        onBackFirstStep={() => navigate("..")}
        onChange={onChange}
        formStatus={entityAnswersUpdating ? "saving" : "saved"}
        onSubmit={() => navigate(createPath({ resource, id, type: "show" }))}
        defaultValues={defaultValues}
        title={form?.title}
        summaryOptions={{
          title: "Review Details",
          downloadButtonText: "Download"
        }}
        roundedCorners
        hideSaveAndCloseButton
        redirectEntityPage={"admin#" + createPath({ resource, id, type: "show" })}
        adminListPath={"admin#" + createPath({ resource, type: "list" })}
        cancelEditForm={() => navigate(createPath({ resource, id, type: "show" }))}
      />
    </LoadingContainer>
  );
};

export const OrganisationEdit = () => (
  <Edit actions={false}>
    <OrganisationEditDisplay />
  </Edit>
);
