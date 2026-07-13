import { useCallback, useMemo } from "react";

import { hasFeedbackInStep } from "@/components/extensive/WizardForm/feedbackUtils";
import { FormStepWithValidation } from "@/components/extensive/WizardForm/useFormStepsWithValidation";
import { FormFieldsProvider, FormModelsDefinition } from "@/context/wizardForm.provider";
import { useValueChanged } from "@/hooks/useValueChanged";
import {
  ACCORDION_CONTEXT_REPORT_DETAILS,
  getAnalyticsUserRole,
  PAGE_CONTEXT_REPORT_OVERVIEW,
  ReportEntityType,
  resolveReportEntityType,
  resolveReportSectionName,
  trackReportAnalyticsEvent
} from "@/utils/analytics/reportAnalytics";

type UseReportAnalyticsProps = {
  models: FormModelsDefinition;
  steps: FormStepWithValidation[];
  selectedStepIndex: number;
  fieldsProvider: FormFieldsProvider;
  entityId?: string | null;
  feedbackFields?: string[] | null;
  initialValues?: Record<string, unknown>;
  summaryTitle?: string;
  stepHasIssues: (stepId: string, validation: FormStepWithValidation["validation"]) => boolean;
};

const getFormModel = (models: FormModelsDefinition) => (Array.isArray(models) ? models[0] : models);

export const useReportAnalytics = ({
  models,
  steps,
  selectedStepIndex,
  fieldsProvider,
  entityId,
  feedbackFields,
  initialValues,
  summaryTitle,
  stepHasIssues
}: UseReportAnalyticsProps) => {
  const formModel = useMemo(() => getFormModel(models), [models]);
  const reportEntityType = useMemo(() => resolveReportEntityType(formModel?.model), [formModel?.model]);
  const isTrackingEnabled = reportEntityType != null && entityId != null && entityId !== "";
  const summaryStepIndex = steps.length;

  const getSectionNameForIndex = useCallback(
    (stepIndex: number): string => {
      if (stepIndex === summaryStepIndex) return summaryTitle?.trim() ?? "";
      if (stepIndex < 0 || stepIndex >= steps.length) return "";
      return resolveReportSectionName(fieldsProvider, steps[stepIndex].id);
    },
    [fieldsProvider, steps, summaryStepIndex, summaryTitle]
  );

  const getReportContext = useCallback(
    () =>
      isTrackingEnabled
        ? {
            entityType: reportEntityType as ReportEntityType,
            entityId: entityId as string,
            userRole: getAnalyticsUserRole()
          }
        : null,
    [entityId, isTrackingEnabled, reportEntityType]
  );

  const trackFormNavClicked = useCallback(
    (targetIndex: number, currentIndex: number) => {
      const context = getReportContext();
      if (context == null || currentIndex < 0) return;

      const targetSection = getSectionNameForIndex(targetIndex);
      const currentSection = getSectionNameForIndex(currentIndex);
      if (targetSection === "" || currentSection === "") return;

      trackReportAnalyticsEvent("form_nav_clicked", {
        ...context,
        target_section: targetSection,
        current_section: currentSection
      });
    },
    [getReportContext, getSectionNameForIndex]
  );

  const trackReportSaveExited = useCallback(() => {
    const context = getReportContext();
    if (context == null) return;

    const currentSection = getSectionNameForIndex(selectedStepIndex);
    if (currentSection === "") return;

    trackReportAnalyticsEvent("report_save_exited", {
      ...context,
      current_section: currentSection
    });
  }, [getReportContext, getSectionNameForIndex, selectedStepIndex]);

  const trackReportSubmitted = useCallback(() => {
    const context = getReportContext();
    if (context == null) return;

    trackReportAnalyticsEvent("report_submitted", context);
  }, [getReportContext]);

  const trackFeedbackBannerDisplayed = useCallback(
    (sectionName: string) => {
      const context = getReportContext();
      if (context == null || sectionName === "") return;

      trackReportAnalyticsEvent("feedback_banner_displayed", {
        ...context,
        section_name: sectionName
      });
    },
    [getReportContext]
  );

  const trackAccordionExpanded = useCallback(
    (accordionLabel: string) => {
      const context = getReportContext();
      if (context == null || accordionLabel === "") return;

      trackReportAnalyticsEvent("accordion_expanded", {
        entityType: context.entityType,
        entityId: context.entityId,
        page_context: PAGE_CONTEXT_REPORT_OVERVIEW,
        accordion_context: ACCORDION_CONTEXT_REPORT_DETAILS,
        accordion_label: accordionLabel
      });
    },
    [getReportContext]
  );

  useValueChanged(selectedStepIndex, () => {
    if (!isTrackingEnabled || selectedStepIndex !== summaryStepIndex) return;

    const context = getReportContext();
    if (context == null) return;

    const sectionsComplete = steps.filter(({ id, validation }) => !stepHasIssues(id, validation)).length;
    const sectionsWithFeedback = steps.filter(({ id }) => hasFeedbackInStep(fieldsProvider, id, feedbackFields)).length;

    trackReportAnalyticsEvent("review_page_viewed", {
      ...context,
      sections_complete: sectionsComplete,
      sections_with_feedback: sectionsWithFeedback
    });
  });

  const hasFeedbackBannerInCurrentStep = useCallback(
    (stepId: string) => hasFeedbackInStep(fieldsProvider, stepId, feedbackFields),
    [feedbackFields, fieldsProvider]
  );

  return {
    isTrackingEnabled,
    getSectionNameForIndex,
    trackFormNavClicked,
    trackReportSaveExited,
    trackReportSubmitted,
    trackFeedbackBannerDisplayed,
    trackAccordionExpanded,
    hasFeedbackBannerInCurrentStep
  };
};
