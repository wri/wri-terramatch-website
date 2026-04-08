import { Flex, Text } from "@chakra-ui/react";
import { FC } from "react";

import { useFieldsProvider } from "@/context/wizardForm.provider";
import Accordion from "@/redesignComponents/containers/Accordion/Accordion";
import AccordionHeader from "@/redesignComponents/containers/Accordion/AccordionHeader";

import { FormEntry } from "./types";

interface FeedbackReviewerProps {
  feedback?: string | null;
  feedbackFieldsOptions: string[] | null;
  values: any;
}

const FeedbackReviewer: FC<FeedbackReviewerProps> = ({ feedback, feedbackFieldsOptions, values }) => {
  const fieldsProvider = useFieldsProvider();
  const entries =
    feedbackFieldsOptions?.reduce<FormEntry[]>((acc, fieldId) => {
      const field = fieldsProvider.fieldByName(fieldId) ?? fieldsProvider.fieldByKey(fieldId);
      if (field == null) return acc;

      acc.push({
        title: field.label ?? "",
        inputType: field.inputType,
        value: values != null && typeof values === "object" && fieldId in values ? values[fieldId] : null
      });
      return acc;
    }, []) ?? [];

  if (entries.length === 0) return null;

  return (
    <div className="mt-6">
      <Accordion
        defaultOpen={true}
        variant="primary"
        header={<AccordionHeader title={"Feedback from Reviewer"} />}
        classNameHeader="!mb-0"
      >
        <Flex className="flex-col gap-4 bg-theme-warning-100 p-4">
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
