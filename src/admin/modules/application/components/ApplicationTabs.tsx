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

import List from "@/components/extensive/List/List";
import { FormSummaryRowProps, useGetFormEntries } from "@/components/extensive/WizardForm/FormSummaryRow";
import { ApplicationRead, FormSubmissionRead } from "@/generated/apiSchemas";
import { getCustomFormSteps, normalizedFormDefaultValue } from "@/helpers/customForms";

const ApplicationTabRow = ({ index, ...props }: FormSummaryRowProps) => {
  const entries = useGetFormEntries(props);

  const formatDateString = (inputDateString: string) => {
    try {
      const dateObject = new Date(inputDateString);
      const formattedDay = dateObject.getUTCDate().toString().padStart(2, "0");
      const formattedMonth = (dateObject.getUTCMonth() + 1).toString().padStart(2, "0");
      const formattedYear = dateObject.getUTCFullYear();
      const formattedDate = `${formattedDay}/${formattedMonth}/${formattedYear}`;
      return formattedDate;
    } catch (error) {
      // Manejar el error, por ejemplo, puedes retornar "Invalid Date"
      return "Invalid Date";
    }
  };

  function isDateStringValid(dateString: string): boolean {
    if (!isNaN(Number(dateString))) {
      return false;
    }
    const timestamp = Date.parse(dateString);
    return !isNaN(timestamp);
  }

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
                <If condition={isDateStringValid(entry.value)}>
                  <Then>{formatDateString(entry.value)}</Then>
                  <Else>
                    <Typography variant="body2" dangerouslySetInnerHTML={{ __html: entry.value }} />
                  </Else>
                </If>
              </Then>
              <Else>{entry.value}</Else>
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
  const formSteps = getCustomFormSteps(record?.form!, t);
  const values = normalizedFormDefaultValue(record?.answers, formSteps);

  return (
    <List
      className="space-y-8"
      items={formSteps}
      render={(step, index) => <ApplicationTabRow index={index} step={step} values={values} steps={formSteps} />}
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
