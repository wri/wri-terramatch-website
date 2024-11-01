import { Divider, Typography } from "@mui/material";
import { useT } from "@transifex/react";
import {
  LabeledClasses,
  RaRecord,
  TabbedShowLayout,
  TabbedShowLayoutProps,
  TabbedShowLayoutTabs,
  useShowContext
} from "react-admin";
import { Else, If, Then, When } from "react-if";

import { formatEntryValue } from "@/admin/apiProvider/utils/entryFormat";
import List from "@/components/extensive/List/List";
import { FormSummaryRowProps, useGetFormEntries } from "@/components/extensive/WizardForm/FormSummaryRow";
import { Framework } from "@/context/framework.provider";
import { ApplicationRead, FormSubmissionRead } from "@/generated/apiSchemas";
import { getCustomFormSteps, normalizedFormDefaultValue } from "@/helpers/customForms";
import { Entity } from "@/types/common";

const ApplicationTabRow = ({ index, ...props }: FormSummaryRowProps) => {
  const entries = useGetFormEntries(props);
  return (
    <>
      <Typography variant="h6" component="h3">
        {props.step.title}
      </Typography>
      <List
        className="my-4 flex flex-col gap-4"
        items={entries}
        render={entry => (
          <div>
            <Typography className={LabeledClasses.label}>
              <span>{entry.title}</span>
            </Typography>
            <If condition={typeof entry.value === "string" || typeof entry.value === "number"}>
              <Then>
                <Typography variant="body2" dangerouslySetInnerHTML={{ __html: formatEntryValue(entry.value) }} />
              </Then>
              <Else>{formatEntryValue(entry.value)}</Else>
            </If>
          </div>
        )}
      />
      <Divider sx={{ marginRight: -16, marginLeft: -16 }} />
    </>
  );
};

const ApplicationTab = ({ record }: { record: FormSubmissionRead }) => {
  const t = useT();
  const framework = record?.form?.framework_key as Framework;
  const formSteps = getCustomFormSteps(record?.form!, t, undefined, framework);
  const values = normalizedFormDefaultValue(record?.answers, formSteps);
  const currentPitchEntity: Entity = {
    entityName: "project-pitches",
    entityUUID: record?.project_pitch_uuid ?? ""
  };
  return (
    <List
      className="space-y-8"
      items={formSteps}
      render={(step, index) => (
        <ApplicationTabRow index={index} step={step} values={values} steps={formSteps} entity={currentPitchEntity} />
      )}
    />
  );
};

export const ApplicationTabs = (props: Omit<TabbedShowLayoutProps, "children">) => {
  const { record } = useShowContext<ApplicationRead & RaRecord>();
  const { isLoading } = useShowContext();

  return (
    <When condition={!isLoading}>
      <TabbedShowLayout {...props} tabs={<TabbedShowLayoutTabs variant="scrollable" scrollButtons="auto" {...props} />}>
        {record?.form_submissions?.map(submission => (
          <TabbedShowLayout.Tab
            label={submission.stage?.name || ""}
            key={submission.id}
            record={submission as FormSubmissionRead & RaRecord}
          >
            <ApplicationTab record={submission} />
          </TabbedShowLayout.Tab>
        ))}
      </TabbedShowLayout>
    </When>
  );
};
