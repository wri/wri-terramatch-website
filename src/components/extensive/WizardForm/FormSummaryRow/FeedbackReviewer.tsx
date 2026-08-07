import { Flex, Text } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { FC, useEffect, useRef } from "react";

import { ReportSummaryAnalyticsProps } from "@/components/extensive/WizardForm/FormSummary";
import { useFieldsProvider } from "@/context/wizardForm.provider";
import Accordion from "@/redesignComponents/containers/Accordion/Accordion";
import AccordionHeader from "@/redesignComponents/containers/Accordion/AccordionHeader";

import { FormEntry } from "./types";

interface FeedbackReviewerProps {
  feedback?: string | null;
  feedbackFieldsOptions: string[] | null;
  values: any;
  reportSummaryAnalytics?: ReportSummaryAnalyticsProps;
}

const FeedbackReviewer: FC<FeedbackReviewerProps> = ({
  feedback,
  feedbackFieldsOptions,
  values,
  reportSummaryAnalytics
}) => {
  const t = useT();
  const fieldsProvider = useFieldsProvider();
  const feedbackBannerTracked = useRef(false);
  const accordionLabel = t("Feedback from Reviewer");
  const entries =
    feedbackFieldsOptions?.reduce<FormEntry[]>((acc, fieldId) => {
      const field = fieldsProvider.fieldByName(fieldId) ?? fieldsProvider.fieldByKey(fieldId);

      if (field == null) return acc;

      acc.push({
        name: field.name,
        title: field.label ?? "",
        inputType: field.inputType,
        value: values != null && typeof values === "object" && field.name in values ? values[field.name] : null
      });
      return acc;
    }, []) ?? [];

  const hasFeedbackText = feedback != null && feedback.trim().length > 0;

  useEffect(() => {
    if (reportSummaryAnalytics == null || (entries.length === 0 && !hasFeedbackText) || feedbackBannerTracked.current) {
      return;
    }

    feedbackBannerTracked.current = true;
    reportSummaryAnalytics.onFeedbackBannerDisplayed(reportSummaryAnalytics.reviewSectionName);
  }, [entries.length, hasFeedbackText, reportSummaryAnalytics]);

  if (entries.length === 0 && !hasFeedbackText) return null;

  const handleAccordionOpenChange = (open: boolean) => {
    if (open) {
      reportSummaryAnalytics?.onAccordionExpanded(accordionLabel);
    }
  };

  return (
    <div className="mt-6">
      <Accordion
        defaultOpen={true}
        variant="primary"
        header={<AccordionHeader title={accordionLabel} />}
        classNameHeader="!mb-0"
        onOpenChange={handleAccordionOpenChange}
      >
        <Flex className="bg-theme-warning-100 flex-col gap-4 p-4">
          {feedback != null && feedback.trim().length > 0 && (
            <Text textStyle="400" color="neutral.900">
              {feedback}
            </Text>
          )}
        </Flex>
      </Accordion>
    </div>
  );
};

export default FeedbackReviewer;
