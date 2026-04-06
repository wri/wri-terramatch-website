import { Flex, Text } from "@chakra-ui/react";
import classNames from "classnames";
import { Else, If, Then } from "react-if";

import { formatEntryValue } from "@/admin/apiProvider/utils/entryFormat";
import { useFieldsProvider } from "@/context/wizardForm.provider";
import Accordion from "@/redesignComponents/containers/Accordion/Accordion";
import AccordionHeader from "@/redesignComponents/containers/Accordion/AccordionHeader";

import List from "../../List/List";
import SpecialEntryRenderer, {
  SPECIAL_ENTRY_TITLES
} from "../../PageElements/PageContent/components/SpecialEntryRenderer";
import { isTrackingType } from "../../TrackingCollapseGrid/types";
import { FormEntry } from "./types";

interface FeedbackReviewerProps {
  feedback?: string | null;
  feedbackFieldsOptions: string[] | null;
  values: any;
}

const EntryRow = ({ entry }: { entry: FormEntry }) => {
  if (SPECIAL_ENTRY_TITLES.has(entry.title ?? "") || entry.inputType === "file") {
    return <SpecialEntryRenderer entry={entry} />;
  }

  return (
    <div className={classNames("flex w-full flex-col items-start gap-2 transition-all delay-300 duration-300")}>
      <Text textStyle="300-bold" color="primary.900">
        {entry.title}
      </Text>
      <div className={classNames("w-full flex-1")}>
        <If condition={typeof entry.value === "string" || typeof entry.value === "number"}>
          <Then>
            <Text textStyle="400" color="neutral.900">
              {formatEntryValue(entry.value)}
            </Text>
          </Then>
          <Else>
            <Text
              textStyle="400"
              color="neutral.900"
              className={classNames("", {
                "w-full !min-w-full": isTrackingType(entry.value?.props?.type)
              })}
            >
              {formatEntryValue(entry.value) ?? "Answer Not Provided"}
            </Text>
          </Else>
        </If>
      </div>
    </div>
  );
};

const FeedbackReviewer = ({ feedback, feedbackFieldsOptions, values }: FeedbackReviewerProps) => {
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
          <List className="flex flex-col gap-4" items={entries} render={entry => <EntryRow entry={entry} />} />
        </Flex>
      </Accordion>
    </div>
  );
};

export default FeedbackReviewer;
