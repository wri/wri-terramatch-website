import { useT } from "@transifex/react";
import { defaults } from "lodash";
import { useRouter } from "next/router";
import { useMemo } from "react";

import WizardForm from "@/components/extensive/WizardForm";
import { FormStepSchema } from "@/components/extensive/WizardForm/types";
import { pruneEntityCache } from "@/connections/Entity";
import EntityProvider from "@/context/entity.provider";
import { GetV2FormsENTITYUUIDResponse, usePutV2FormsENTITYUUIDSubmit } from "@/generated/apiComponents";
import { normalizedFormData } from "@/helpers/customForms";
import { getEntityDetailPageLink } from "@/helpers/entity";
import { useFormUpdate } from "@/hooks/useFormUpdate";
import { useNormalizedFormDefaultValue } from "@/hooks/useGetCustomFormSteps/useGetCustomFormSteps";
import { useReportingWindow } from "@/hooks/useReportingWindow";
import { EntityName } from "@/types/common";

const mockEntityName: EntityName = "site-reports";
const mockEntityUUID = "123";
const mockEntity = {
  organisation: {
    uuid: "123",
    name: "Test Org",
    type: "non-profit",
    currency: "USD",
    fin_start_month: 1
  },
  site: {
    name: "Test Site"
  },
  due_at: "2024-12-31",
  currency: "USD",
  fin_start_month: 1
};

const mockFormData: GetV2FormsENTITYUUIDResponse = {
  uuid: "123",
  name: "Disturbance Report",
  status: "draft",
  form: {
    title: "Disturbance Report",
    uuid: "123",
    framework_key: "disturbance-report",
    fields: []
  },
  answers: {},
  form_title: "Disturbance Report",
  feedback: "",
  feedback_fields: [],
  update_request: {
    uuid: "123",
    framework_key: "disturbance-report",
    status: "draft",
    readable_status: "Draft",
    content: "{}",
    feedback: "",
    feedback_fields: [],
    project: {},
    organisation: {},
    created_by: {}
  }
};

const mockFormSteps: FormStepSchema[] = [
  {
    id: "step-1",
    title: "Disturbance Report",
    tabTitle: `Step 1
        <p className="text-sm font-normal">Review + Details</p>`,
    subtitle: "Please use this form to update us on the changes to your site since the last reporting period. ",
    fields: [
      {
        id: "add_disturbance_information",
        name: "add_disturbance_information",
        label: "Add Disturbance Information",
        description: `The three major disturbance types used in TerraMatch are defined below: <ul>
          <li>Ecological – minor natural disturbances that impact less than half of planted species, including pests, small erosion events, etc.</li>
          <li>Climatic – major natural disturbances that impact more than half of planted species or the landscape as a whole, including flooding, wildfires, etc.</li>
          <li>Man-made – minor or major human-caused disturbances, including site vandalism, illegal grazing, etc.</li>
        </ul>
        `,
        placeholder: "Select Type of Disturbance",
        condition: true,
        is_parent_conditional_default: false,
        type: "collapseDisturbance",
        fieldProps: {
          fields: [
            {
              type: "dropdown",
              fieldProps: {
                options: [
                  { value: "fire", label: "Fire" },
                  { value: "disease", label: "Disease" },
                  { value: "pest", label: "Pest" },
                  { value: "weather", label: "Weather Event" }
                ]
              }
            }
          ]
        }
      }
    ]
  }
] as any;

const DisturbanceForm = () => {
  const t = useT();
  const router = useRouter();
  const organisation = mockEntity?.organisation;

  const mode = router.query.mode as string | undefined;

  const { updateEntity, error, isSuccess, isUpdating } = useFormUpdate(mockEntityName, mockEntityUUID);
  const { mutate: submitEntity, isLoading: isSubmitting } = usePutV2FormsENTITYUUIDSubmit({
    onSuccess() {
      pruneEntityCache(mockEntityName, mockEntityUUID);

      if (mode === "edit" || mode?.includes("provide-feedback")) {
        router.push(getEntityDetailPageLink(mockEntityName, mockEntityUUID));
      } else {
        router.replace(`/entity/${mockEntityName}/edit/${mockEntityUUID}/confirm`);
      }
    }
  });

  const formSteps = mockFormSteps;

  const sourceData = useMemo(() => defaults(mockFormData?.update_request?.content ?? {}, mockFormData?.answers), []);
  const defaultValues = useNormalizedFormDefaultValue(sourceData, formSteps);

  const reportingWindow = useReportingWindow(mockEntity?.due_at);

  const formSubtitle =
    mockEntityName === "site-reports" ? t("Reporting Period: {reportingWindow}", { reportingWindow }) : undefined;

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
    const stepIndex =
      mode == null
        ? 0
        : formSteps!.findIndex((step: any) => step.fields.find((field: any) => field.feedbackRequired) != null);

    return {
      initialStepIndex: stepIndex < 0 ? undefined : stepIndex,
      disableInitialAutoProgress: stepIndex >= 0
    };
  }, [formSteps, mode]);

  const formSubmissionOrg = {
    uuid: organisation?.uuid,
    type: organisation?.type,
    currency: mockEntity?.currency || organisation?.currency,
    start_month: mockEntity?.fin_start_month || organisation?.fin_start_month
  };

  return (
    <EntityProvider entityUuid={mockEntityUUID} entityName={mockEntityName}>
      <WizardForm
        formSubmissionOrg={formSubmissionOrg}
        steps={formSteps!}
        errors={error}
        onBackFirstStep={router.back}
        onCloseForm={() => router.push("/home")}
        onChange={(data, closeAndSave?: boolean) =>
          updateEntity({
            answers: normalizedFormData(data, formSteps!),
            ...(closeAndSave ? { continue_later_action: true } : {})
          })
        }
        formStatus={isSuccess ? "saved" : isUpdating ? "saving" : undefined}
        onSubmit={() =>
          submitEntity({
            pathParams: {
              entity: mockEntityName,
              uuid: mockEntityUUID
            }
          })
        }
        submitButtonDisable={isSubmitting}
        defaultValues={defaultValues}
        title={`Disturbance Report for {Project Name}`}
        subtitle={formSubtitle}
        tabOptions={{
          markDone: true,
          disableFutureTabs: true
        }}
        roundedCorners
        saveAndCloseModal={{
          content:
            saveAndCloseModalMapping[mockEntityName] ??
            t(
              "You have made progress on this form. If you close the form now, your progress will be saved for when you come back. You can access this form again on the reporting tasks section under your project page. Would you like to close this form and continue later?"
            ),
          onConfirm() {
            router.push(getEntityDetailPageLink(mockEntityName, mockEntityUUID));
          }
        }}
        {...initialStepProps}
      />
    </EntityProvider>
  );
};

export default DisturbanceForm;
