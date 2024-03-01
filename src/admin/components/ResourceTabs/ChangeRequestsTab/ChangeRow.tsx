import { Card, Typography } from "@mui/material";
import { Case, Default, Switch } from "react-if";

import VisualDiff from "@/admin/components/ResourceTabs/ChangeRequestsTab/VisualDiff";
import List from "@/components/extensive/List/List";
import { FormSummaryRowProps, useGetFormEntries } from "@/components/extensive/WizardForm/FormSummaryRow";

export interface IChangeRowProps extends Omit<FormSummaryRowProps, "values"> {
  currentValues: any;
  changedValues: any;
}

const BOOLEAN_STRING_VALUES = ["-", "No", "Yes"];

const cleanValue = (value: any) => {
  if (typeof value === "string") {
    value = value.trim();

    if (value.length === 0) {
      value = null;
    }
  }

  return value;
};

const needsVisualDiff = (currentValue: any, newValue: any) => {
  if (typeof currentValue !== "string" || typeof newValue !== "string") {
    return false;
  }

  if (BOOLEAN_STRING_VALUES.includes(currentValue) && BOOLEAN_STRING_VALUES.includes(newValue)) {
    return false;
  }

  return true;
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
          const currentValue = cleanValue(currentEntry?.value);
          const newValue = cleanValue(entry.value);

          return (
            <div>
              <Typography variant="h6" component="h4" className="capitalize">
                {entry?.title}
              </Typography>
              <Switch>
                <Case condition={newValue == currentValue}>
                  <p className="mb-2">
                    Existing Value (unchanged):
                    <Typography variant="body2">{currentValue ?? "-"}</Typography>
                  </p>
                </Case>
                <Case condition={needsVisualDiff(currentValue, newValue)}>
                  <VisualDiff {...{ currentValue, newValue }} />
                </Case>
                <Default>
                  <p className="mb-2">
                    New Value: {newValue ?? "-"} <br /> Old Value: {currentValue ?? "-"}
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
