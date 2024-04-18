import { Box, Card, Typography } from "@mui/material";
import { Case, Default, Switch } from "react-if";

import ChangeBox from "@/admin/components/ResourceTabs/ChangeRequestsTab/ChangeBox";
import FieldView from "@/admin/components/ResourceTabs/ChangeRequestsTab/FieldView";
import { StepChange } from "@/admin/components/ResourceTabs/ChangeRequestsTab/useFormChanges";
import VisualDiff from "@/admin/components/ResourceTabs/ChangeRequestsTab/VisualDiff";
import List from "@/components/extensive/List/List";
import { FieldType } from "@/components/extensive/WizardForm/types";

export interface IChangeRowProps {
  stepChange: StepChange;
}

export default function ChangeRow({ stepChange }: IChangeRowProps) {
  return (
    <Card sx={{ padding: 4 }}>
      <Typography variant="h5" component="h3" className="capitalize">
        {stepChange.step.title}
      </Typography>
      <List
        className="my-4 flex flex-col gap-4"
        items={stepChange.changes}
        render={({ title, type, currentValue, newValue }) => {
          return (
            <div>
              <Typography variant="h6" component="h4" className="capitalize">
                {title}
              </Typography>
              <Switch>
                <Case condition={newValue == null}>
                  <Box sx={{ flexGrow: 1 }}>
                    Existing Value (unchanged):
                    <FieldView type={type} value={currentValue} />
                  </Box>
                </Case>
                <Case condition={type === FieldType.TextArea}>
                  <VisualDiff type={type} {...{ currentValue, newValue }} />
                </Case>
                <Default>
                  <ChangeBox type={type} oldView={currentValue} newView={newValue} />
                </Default>
              </Switch>
            </div>
          );
        }}
      />
    </Card>
  );
}
