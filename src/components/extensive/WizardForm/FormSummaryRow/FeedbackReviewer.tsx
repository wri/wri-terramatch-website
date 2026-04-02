import { Text } from "@chakra-ui/react";
import classNames from "classnames";
import { Else, If, Then } from "react-if";

import { formatEntryValue } from "@/admin/apiProvider/utils/entryFormat";
import { useFormEntities } from "@/context/wizardForm.provider";
import Accordion from "@/redesignComponents/containers/Accordion/Accordion";
import AccordionHeader from "@/redesignComponents/containers/Accordion/AccordionHeader";

import List from "../../List/List";
import SpecialEntryRenderer, {
  SPECIAL_ENTRY_TITLES
} from "../../PageElements/PageContent/components/SpecialEntryRenderer";
import { isTrackingType } from "../../TrackingCollapseGrid/types";
import { useGetFormEntries } from "./getFormEntries";
import { FormEntry } from "./types";

interface FeedbackReviewerProps {
  feedbackFieldsOptions: string[];
  stepIds: string[];
  values: any;
}

const EntryRow = ({ entry }: { entry: FormEntry }) => {
  if (SPECIAL_ENTRY_TITLES.has(entry.title ?? "")) {
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
            <div
              className={classNames("", {
                "w-full !min-w-full": isTrackingType(entry.value?.props?.type)
              })}
            >
              {formatEntryValue(entry.value)}
            </div>
          </Else>
        </If>
      </div>
    </div>
  );
};

const FeedbackStepSection = ({
  stepId,
  values,
  entity,
  feedbackFieldsOptions
}: {
  stepId: string;
  values: any;
  entity: any;
  feedbackFieldsOptions: string[];
}) => {
  const entries = useGetFormEntries({ stepId, values: values, entity });
  // TODO: Apply feedbackFieldsOptions for validation in the Reviewer Feedback section and remove this console.log.
  console.log("feedbackFieldsOptions", feedbackFieldsOptions);
  if (entries.length === 0) return null;

  return (
    <List
      className="bg-theme-warning-100 flex flex-col gap-4 p-4"
      backgroundColor="warning.100"
      items={entries}
      render={entry => <EntryRow entry={entry} />}
    />
  );
};

const FeedbackReviewer = ({ feedbackFieldsOptions, stepIds, values }: FeedbackReviewerProps) => {
  const entities = useFormEntities();

  return (
    <div className="mt-6">
      <Accordion
        variant="primary"
        header={<AccordionHeader title={"Feedback from Reviewer"} />}
        classNameHeader="!mb-0"
      >
        {stepIds.map(stepId => (
          <FeedbackStepSection
            key={stepId}
            stepId={stepId}
            values={values}
            entity={entities[0]}
            feedbackFieldsOptions={feedbackFieldsOptions}
          />
        ))}
      </Accordion>
    </div>
  );
};

export default FeedbackReviewer;
