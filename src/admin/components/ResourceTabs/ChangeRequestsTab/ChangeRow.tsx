import { Box, Card, Typography } from "@mui/material";
import { Case, Default, Switch } from "react-if";

import ChangeBox from "@/admin/components/ResourceTabs/ChangeRequestsTab/ChangeBox";
import FieldView from "@/admin/components/ResourceTabs/ChangeRequestsTab/FieldView";
import VisualDiff from "@/admin/components/ResourceTabs/ChangeRequestsTab/VisualDiff";
import List from "@/components/extensive/List/List";
import { FormSummaryRowProps, useGetFormEntries } from "@/components/extensive/WizardForm/FormSummaryRow";
import { FieldType } from "@/components/extensive/WizardForm/types";

export interface IChangeRowProps extends Omit<FormSummaryRowProps, "values"> {
  currentValues: any;
  changedValues: any;
}

const cleanValue = (value: any) => {
  if (typeof value === "string") {
    value = value.trim();

    if (value.length === 0) {
      value = null;
    }
  }

  return value;
};

export default function ChangeRow({ index, ...props }: IChangeRowProps) {
  const currentEntries = useGetFormEntries({
    values: props.currentValues,
    nullText: "-",
    ...props
  });
  const changedEntries = useGetFormEntries({
    values: props.changedValues,
    nullText: "-",
    ...props
  });

  return (
    <Card sx={{ padding: 4 }}>
      <Typography variant="h5" component="h3" className="capitalize">
        {props.step.title}
      </Typography>
      <List
        className="my-4 flex flex-col gap-4"
        items={changedEntries}
        render={entry => {
          const currentEntry = currentEntries.find(e => e.title === entry.title);
          const currentValue = cleanValue(currentEntry?.value) ?? "-";
          const newValue = cleanValue(entry.value) ?? "-";

          return (
            <div>
              <Typography variant="h6" component="h4" className="capitalize">
                {entry?.title}
              </Typography>
              <Switch>
                <Case condition={newValue == currentValue}>
                  <Box sx={{ flexGrow: 1 }}>
                    Existing Value (unchanged):
                    <FieldView type={entry.type} value={currentValue} />
                  </Box>
                </Case>
                <Case condition={entry.type === FieldType.TextArea}>
                  <VisualDiff type={entry.type} {...{ currentValue, newValue }} />
                </Case>
                <Default>
                  <ChangeBox type={entry.type} oldView={currentValue} newView={newValue} />
                </Default>
              </Switch>
            </div>
          );
        }}
      />
    </Card>
  );
}
