import { Card, Typography } from "@mui/material";
import { Case, Default, Switch } from "react-if";

import VisualDiff from "@/admin/components/ResourceTabs/ChangeRequestsTab/VisualDiff";
import List from "@/components/extensive/List/List";
import { FormSummaryRowProps, useGetFormEntries } from "@/components/extensive/WizardForm/FormSummaryRow";

export interface IChangeRowProps extends Omit<FormSummaryRowProps, "values"> {
  currentValues: any;
  changedValues: any;
}

const cleanValue = (value: any) => (typeof value === "string" ? value.trim() : value);

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
          const currentValue = cleanValue(currentEntry?.value) || "-";
          const newValue = cleanValue(entry.value) || "-";

          return (
            <div>
              <Typography variant="h6" component="h4" className="capitalize">
                {entry?.title}
              </Typography>
              <Switch>
                <Case condition={newValue === currentValue}>
                  <p className="mb-2">
                    Existing Value (unchanged):
                    <Typography variant="body2">{currentValue}</Typography>
                  </p>
                </Case>
                <Case condition={typeof currentValue === "string"}>
                  <VisualDiff {...{ currentValue, newValue }} />
                </Case>
                <Default>
                  <p className="mb-2">
                    New Value: {newValue} <br /> Old Value: {currentValue}
                  </p>
                </Default>
              </Switch>
            </div>
          );
        }}
      />
    </Card>
  );
}
