import { Divider, Typography } from "@mui/material";
import { FC, useMemo } from "react";
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
import WizardFormProvider, {
  FormModel,
  useApiFieldsProvider,
  useFieldsProvider,
  useFormEntities
} from "@/context/wizardForm.provider";
import { ApplicationRead, FormSubmissionRead } from "@/generated/apiSchemas";
import { formDefaultValues } from "@/helpers/customForms";

const ApplicationTabRow: FC<Omit<FormSummaryRowProps, "index">> = props => {
  const entities = useFormEntities();
  const entries = useGetFormEntries({ ...props, entity: entities[0] });
  const title = useFieldsProvider().step(props.stepId)?.title;
  return (
    <>
      <Typography variant="h6" component="h3">
        {title}
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
  const [providerLoaded, fieldsProvider] = useApiFieldsProvider(record?.form_uuid);
  const values = useMemo(
    () => formDefaultValues(record?.answers ?? {}, fieldsProvider),
    [fieldsProvider, record?.answers]
  );
  const model = useMemo<FormModel>(
    () => ({ model: "projectPitches", uuid: record?.project_pitch_uuid ?? "" }),
    [record?.project_pitch_uuid]
  );

  return !providerLoaded ? null : (
    <WizardFormProvider models={model} fieldsProvider={fieldsProvider}>
      <List
        className="space-y-8"
        items={fieldsProvider.stepIds()}
        render={stepId => <ApplicationTabRow stepId={stepId} values={values} />}
      />
    </WizardFormProvider>
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
