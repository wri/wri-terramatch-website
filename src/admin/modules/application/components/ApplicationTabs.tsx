import { Divider, Typography } from "@mui/material";
import { FC, useMemo } from "react";
import {
  LabeledClasses,
  TabbedShowLayout,
  TabbedShowLayoutProps,
  TabbedShowLayoutTabs,
  useShowContext
} from "react-admin";

import { ApplicationShowRecord } from "@/admin/apiProvider/dataProviders/applicationDataProvider";
import { formatEntryValue } from "@/admin/apiProvider/utils/entryFormat";
import List from "@/components/extensive/List/List";
import { FormSummaryRowProps } from "@/components/extensive/WizardForm/FormSummaryRow";
import { useGetFormEntries } from "@/components/extensive/WizardForm/FormSummaryRow/getFormEntries";
import { useSubmission } from "@/connections/FormSubmission";
import WizardFormProvider, {
  FormModel,
  useApiFieldsProvider,
  useFieldsProvider,
  useFormEntities
} from "@/context/wizardForm.provider";
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
            {typeof entry.value === "string" || typeof entry.value === "number" ? (
              <Typography variant="body2" dangerouslySetInnerHTML={{ __html: formatEntryValue(entry.value) }} />
            ) : (
              formatEntryValue(entry.value)
            )}
          </div>
        )}
      />
      <Divider sx={{ marginRight: -16, marginLeft: -16 }} />
    </>
  );
};

const ApplicationTab: FC<{ submissionUuid: string }> = ({ submissionUuid }) => {
  const [, { data: submission }] = useSubmission({ id: submissionUuid });
  const [providerLoaded, fieldsProvider] = useApiFieldsProvider(submission?.formUuid);
  const values = useMemo(
    () => formDefaultValues(submission?.answers ?? {}, fieldsProvider),
    [fieldsProvider, submission?.answers]
  );
  const model = useMemo<FormModel>(
    () => ({ model: "projectPitches", uuid: submission?.projectPitchUuid ?? "" }),
    [submission?.projectPitchUuid]
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
  const { record } = useShowContext<ApplicationShowRecord>();
  const { isLoading } = useShowContext();

  return isLoading ? null : (
    <TabbedShowLayout {...props} tabs={<TabbedShowLayoutTabs variant="scrollable" scrollButtons="auto" {...props} />}>
      {record?.submissions?.map(({ stageName, uuid }) => (
        <TabbedShowLayout.Tab label={stageName ?? ""} key={uuid}>
          <ApplicationTab submissionUuid={uuid} />
        </TabbedShowLayout.Tab>
      ))}
    </TabbedShowLayout>
  );
};
