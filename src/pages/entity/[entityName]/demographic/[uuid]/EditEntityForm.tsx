import { useT } from "@transifex/react";
import { Dictionary } from "lodash";
import { notFound } from "next/navigation";
import { useRouter } from "next/router";
import { useCallback, useMemo } from "react";

import { formatDateForEnGb } from "@/admin/apiProvider/utils/entryFormat";
import WizardForm from "@/components/extensive/WizardForm";
import LoadingContainer from "@/components/generic/Loading/LoadingContainer";
import { loadFullNurseryReport, loadFullSiteReport, pruneEntityCache } from "@/connections/Entity";
import { FormModelType } from "@/connections/util/Form";
import { CurrencyProvider } from "@/context/currency.provider";
import { toFramework } from "@/context/framework.provider";
import { OrgFormDetails, ProjectFormDetails, useApiFieldsProvider } from "@/context/wizardForm.provider";
import { usePutV2FormsENTITYUUIDSubmit } from "@/generated/apiComponents";
import { normalizedFormData } from "@/helpers/customForms";
import { getEntityDetailPageLink, isEntityReport, v3EntityName } from "@/helpers/entity";
import { useDefaultValues, useEntityForm } from "@/hooks/useFormGet";
import { useFormUpdate } from "@/hooks/useFormUpdate";
import { useReportingWindow } from "@/hooks/useReportingWindow";
import { EntityName } from "@/types/common";
import Log from "@/utils/log";

interface EditEntityFormProps {
  entityName: EntityName;
  entityUUID: string;
  entity: Record<string, any>;
}

const EditEntityForm = ({ entity, entityName, entityUUID }: EditEntityFormProps) => {
  const t = useT();
  const router = useRouter();

  // ========== MOCK MODE - Set to true to use mocked data ==========
  const USE_MOCK_DATA = true;

  const { formData, isLoading, loadError, formLoadFailure } = useEntityForm(entityName, entityUUID);
  const entityData = USE_MOCK_DATA ? { framework_key: "ppc", form_title: "Demographic Form" } : formData?.data;
  const framework = toFramework(entityData?.framework_key);

  const model = useMemo(
    () => ({ model: v3EntityName(entityName) as FormModelType, uuid: entityUUID }),
    [entityName, entityUUID]
  );

  const mode = router.query.mode as string | undefined; //edit, provide-feedback-entity, provide-feedback-change-request
  const isReport = isEntityReport(entityName);

  const feedbackFields = useMemo(
    () =>
      USE_MOCK_DATA
        ? []
        : mode?.includes("provide-feedback")
        ? entityData?.update_request?.feedback_fields ?? entityData?.feedback_fields ?? []
        : [],
    [USE_MOCK_DATA, entityData?.feedback_fields, entityData?.update_request?.feedback_fields, mode]
  );
  const [providerLoaded, fieldsProvider] = useApiFieldsProvider(
    USE_MOCK_DATA ? null : formData?.data.form_uuid,
    feedbackFields
  );
  const defaultValues = USE_MOCK_DATA
    ? {
        // Campo 1: Not Started
        "field-demographic-description": [
          {
            collection: "newJobs",
            demographics: []
          }
        ],
        // Campo 2: Complete
        "field-demographic-employees": [
          {
            collection: "newJobs",
            demographics: [
              // Gender
              { type: "gender", subtype: "male", amount: 10 },
              { type: "gender", subtype: "female", amount: 15 },
              { type: "gender", subtype: "non-binary", amount: 0 },
              { type: "gender", subtype: "unknown", amount: 0 },
              // Age
              { type: "age", subtype: "youth", amount: 8 },
              { type: "age", subtype: "adult", amount: 14 },
              { type: "age", subtype: "elder", amount: 3 },
              { type: "age", subtype: "unknown", amount: 0 },
              // Ethnicity
              { type: "ethnicity", subtype: "indigenous", amount: 5 },
              { type: "ethnicity", subtype: "other", amount: 20 },
              { type: "ethnicity", subtype: "unknown", amount: 0 }
            ]
          }
        ],
        // Campo 3: In Progress
        "field-demographic-age-range": [
          {
            collection: "newJobs",
            demographics: [
              // Gender completed
              { type: "gender", subtype: "male", amount: 8 },
              { type: "gender", subtype: "female", amount: 12 },
              { type: "gender", subtype: "non-binary", amount: 0 },
              { type: "gender", subtype: "unknown", amount: 0 },
              // Age not completed
              { type: "age", subtype: "youth", amount: 5 },
              { type: "age", subtype: "adult", amount: 0 },
              { type: "age", subtype: "elder", amount: 0 },
              { type: "age", subtype: "unknown", amount: 0 }
              // Ethnicity not completed
            ]
          }
        ]
      }
    : useDefaultValues(formData?.data, fieldsProvider);

  const organisation = entity?.organisation;

  const { updateEntity, error, isSuccess, isUpdating } = useFormUpdate(entityName, entityUUID);
  const { mutate: submitEntity, isLoading: isSubmitting } = usePutV2FormsENTITYUUIDSubmit({
    onSuccess() {
      const v3Entity = v3EntityName(entityName);
      pruneEntityCache(v3Entity, entityUUID);
      if (v3Entity === "siteReports") {
        loadFullSiteReport({ id: entityUUID });
      } else if (v3Entity === "nurseryReports") {
        loadFullNurseryReport({ id: entityUUID });
      }

      if (mode === "edit" || mode?.includes("provide-feedback")) {
        router.push(getEntityDetailPageLink(entityName, entityUUID));
      } else {
        router.replace(`/entity/${entityName}/edit/${entityUUID}/confirm`);
      }
    }
  });

  const reportingWindow = useReportingWindow(framework, entity?.due_at);
  const disturbanceReportDate = entity?.entries?.find((entry: any) => entry.name === "date-of-disturbance")?.value;
  const formTitle = USE_MOCK_DATA
    ? "Demographic Data Form (MOCKED)"
    : entityName === "site-reports"
    ? t("{siteName} Site Report", { siteName: entity?.site?.name })
    : entityName === "financial-reports"
    ? t("{orgName} Financial Report", { orgName: organisation?.name })
    : entityName === "disturbance-reports"
    ? `${t("Disturbance Report")} ${formatDateForEnGb(disturbanceReportDate)}`
    : entityName === "srp-reports"
    ? t("{projectName} Socio-Economic Report", { projectName: entity?.project?.name })
    : `${entityData?.form_title} ${isReport ? reportingWindow : ""}`;
  const formSubtitle = USE_MOCK_DATA
    ? "This is a mocked version for testing"
    : entityName === "site-reports"
    ? t("Reporting Period: {reportingWindow}", { reportingWindow })
    : undefined;

  const saveAndCloseModalMapping: any = {
    projects: t(
      "You have made progress on this form. If you close the form now, your progress will be saved for when you come back. You can access this form again on the 'My Projects' section. Would you like to close this form and continue later?"
    ),
    sites: t(
      "You have made progress on this form. If you close the form now, your progress will be saved for when you come back. You can access this form again on the sites section under your project page. Would you like to close this form and continue later?"
    ),
    nurseries: t(
      "You have made progress on this form. If you close the form now, your progress will be saved for when you come back. You can access this form again on the nurseries section under your project page. Would you like to close this form and continue later?"
    )
  };

  const initialStepProps = useMemo(() => {
    if (USE_MOCK_DATA) {
      return { initialStepIndex: 0, disableInitialAutoProgress: false };
    }

    if (providerLoaded && feedbackFields != null) {
      for (const [stepIndex, stepId] of fieldsProvider.stepIds().entries()) {
        for (const fieldId of fieldsProvider.fieldNames(stepId)) {
          if (fieldsProvider.feedbackRequired(fieldId)) {
            return { initialStepIndex: stepIndex, disableInitialAutoProgress: true };
          }
        }
      }
    }

    return { initialStepIndex: 0, disableInitialAutoProgress: false };
  }, [USE_MOCK_DATA, feedbackFields, fieldsProvider, providerLoaded]);

  const orgDetails = useMemo(
    (): OrgFormDetails =>
      USE_MOCK_DATA
        ? {
            uuid: "mock-org-uuid",
            currency: "USD",
            startMonth: 1,
            type: "non-profit-organization"
          }
        : {
            uuid: organisation?.uuid,
            currency: entityName === "financial-reports" ? entity?.currency : organisation?.currency,
            startMonth: entityName === "financial-reports" ? entity?.fin_start_month : organisation?.fin_start_month,
            type: entityName === "financial-reports" ? entity?.organisation?.type : organisation?.type
          },
    [
      USE_MOCK_DATA,
      entity?.currency,
      entity?.fin_start_month,
      entityName,
      organisation?.currency,
      organisation?.fin_start_month,
      organisation?.uuid,
      organisation?.type,
      entity?.organisation?.type
    ]
  );

  const projectDetails = useMemo(
    (): ProjectFormDetails => (USE_MOCK_DATA ? { uuid: "mock-project-uuid" } : { uuid: entity?.project?.uuid }),
    [USE_MOCK_DATA, entity?.project?.uuid]
  );

  const onChange = useCallback(
    (data: Dictionary<any>, closeAndSave?: boolean) => {
      if (USE_MOCK_DATA) {
        console.log("Mock mode: Data change", data);
        return;
      }
      updateEntity({
        answers: normalizedFormData(data, fieldsProvider),
        ...(closeAndSave ? { continue_later_action: true } : {})
      });
    },
    [USE_MOCK_DATA, fieldsProvider, updateEntity]
  );

  if (!USE_MOCK_DATA && (loadError || formLoadFailure != null)) {
    Log.error("Form data load failed", { loadError, formLoadFailure });
    return notFound();
  }

  // Mock fieldsProvider for testing/development
  const mockFieldsProvider = useMemo(
    () => ({
      stepIds: () => ["step-demographic"],

      step: (id: string) => {
        const steps: Record<string, any> = {
          "step-demographic": {
            id: "step-demographic",
            title: "Demographic Data",
            subtitle: "Mock data for testing",
            order: 1
          }
        };
        return steps[id] || null;
      },

      fieldNames: (stepId: string) => {
        const fieldsByStep: Record<string, string[]> = {
          "step-demographic": [
            "field-demographic-description",
            "field-demographic-employees",
            "field-demographic-age-range"
          ]
        };
        return fieldsByStep[stepId] || [];
      },

      fieldByName: (name: string) => {
        const mockFields: Record<string, any> = {
          "field-demographic-description": {
            name: "field-demographic-description",
            label: "In the past six months, how many new employees have started working full time on this project?",
            description:
              "Full-time employees are people that are regularly paid for their work on the project and are working 35 or more hours per week, with a consistent role that involves daily engagement for at least 3 months of the reporting period, disaggregated by gender and age group.",
            inputType: "newJobs",
            collection: "newJobs",
            validation: { required: false }
          },
          "field-demographic-employees": {
            name: "field-demographic-employees",
            label: "In the past six months, how many new employees have started working full time on this project?",
            description:
              "Full-time employees are people that are regularly paid for their work on the project and are working 35 or more hours per week, with a consistent role that involves daily engagement for at least 3 months of the reporting period, disaggregated by gender and age group.",
            inputType: "newJobs",
            collection: "newJobs",
            validation: { required: false }
          },
          "field-demographic-age-range": {
            name: "field-demographic-age-range",
            label: "In the past six months, how many new employees have started working full time on this project?",
            description:
              "Full-time employees are people that are regularly paid for their work on the project and are working 35 or more hours per week, with a consistent role that involves daily engagement for at least 3 months of the reporting period, disaggregated by gender and age group.",
            inputType: "newJobs",
            collection: "newJobs",
            validation: { required: false }
          }
        };
        return mockFields[name] || { name, label: name, inputType: "text", validation: { required: false } };
      },

      fieldByKey: (linkedFieldKey: string) => {
        return {
          name: linkedFieldKey,
          label: `Field ${linkedFieldKey}`,
          inputType: "text" as const,
          validation: { required: false }
        };
      },

      childNames: (parentName: string) => {
        return [];
      },

      feedbackRequired: (fieldId: string) => {
        return false;
      }
    }),
    []
  );

  const activeFieldsProvider = USE_MOCK_DATA ? mockFieldsProvider : fieldsProvider;

  return (
    <LoadingContainer loading={USE_MOCK_DATA ? false : isLoading || !providerLoaded}>
      <CurrencyProvider>
        {(USE_MOCK_DATA || providerLoaded) && (
          <WizardForm
            framework={framework}
            models={model}
            fieldsProvider={{
              stepIds: () => activeFieldsProvider.stepIds(),
              step: (id: string) => activeFieldsProvider.step(id),
              fieldNames: (stepId: string) => activeFieldsProvider.fieldNames(stepId),
              fieldByName: (name: string) => activeFieldsProvider.fieldByName(name),
              fieldByKey: (linkedFieldKey: string) => activeFieldsProvider.fieldByKey(linkedFieldKey),
              childNames: (parentName: string) => activeFieldsProvider.childNames(parentName),
              feedbackRequired: (fieldId: string) => activeFieldsProvider.feedbackRequired(fieldId)
            }}
            orgDetails={orgDetails}
            projectDetails={projectDetails}
            errors={USE_MOCK_DATA ? undefined : error}
            onBackFirstStep={() => {
              if (USE_MOCK_DATA) {
                console.log("Mock mode: Back");
                router.push("/home");
              } else {
                router.back();
              }
            }}
            onCloseForm={() => router.push("/home")}
            onChange={onChange}
            formStatus={isSuccess ? "saved" : isUpdating ? "saving" : undefined}
            onSubmit={() => {
              if (USE_MOCK_DATA) {
                console.log("Mock mode: Form submitted");
                alert("Mock mode: Form would be submitted here");
                return;
              }
              submitEntity({
                pathParams: {
                  entity: entityName,
                  uuid: entityUUID
                }
              });
            }}
            submitButtonDisable={USE_MOCK_DATA ? false : isSubmitting}
            defaultValues={defaultValues}
            title={formTitle}
            subtitle={formSubtitle}
            tabOptions={{
              markDone: true,
              disableFutureTabs: true
            }}
            summaryOptions={{
              title: t("Review Details"),
              downloadButtonText: t("Download")
            }}
            roundedCorners
            saveAndCloseModal={{
              content:
                saveAndCloseModalMapping[entityName] ??
                t(
                  "You have made progress on this form. If you close the form now, your progress will be saved for when you come back. You can access this form again on the reporting tasks section under your project page. Would you like to close this form and continue later?"
                ),
              onConfirm() {
                if (USE_MOCK_DATA) {
                  console.log("Mock mode: Save and close");
                  router.push("/home");
                  return;
                }
                router.push(getEntityDetailPageLink(entityName, entityUUID));
              }
            }}
            {...initialStepProps}
          />
        )}
      </CurrencyProvider>
    </LoadingContainer>
  );
};

export default EditEntityForm;
