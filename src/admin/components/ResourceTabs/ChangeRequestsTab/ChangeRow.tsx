import { Box, Card, Typography } from "@mui/material";
import { FC } from "react";

import ChangeBox from "@/admin/components/ResourceTabs/ChangeRequestsTab/ChangeBox";
import DisturbanceReportEntriesVisualDiff from "@/admin/components/ResourceTabs/ChangeRequestsTab/DisturbanceReportEntriesVisualDiff";
import FieldView from "@/admin/components/ResourceTabs/ChangeRequestsTab/FieldView";
import FinancialVisualDiff from "@/admin/components/ResourceTabs/ChangeRequestsTab/FinancialVisualDiff";
import { StepChange } from "@/admin/components/ResourceTabs/ChangeRequestsTab/useFormChanges";
import VisualDiff from "@/admin/components/ResourceTabs/ChangeRequestsTab/VisualDiff";
import List from "@/components/extensive/List/List";

export interface IChangeRowProps {
  stepChange: StepChange;
}

const ChangeRow: FC<IChangeRowProps> = ({ stepChange }) => (
  <Card sx={{ padding: 4 }}>
    <Typography variant="h5" component="h3" className="capitalize">
      {stepChange.stepTitle}
    </Typography>
    <List
      className="my-4 flex flex-col gap-4"
      items={stepChange.changes}
      render={({ title, inputType, currentValue, newValue }) => (
        <div>
          <Typography variant="h6" component="h4" className="capitalize">
            {title}
          </Typography>
          {newValue == null ? (
            <Box sx={{ flexGrow: 1 }}>
              Existing Value (unchanged):
              <FieldView inputType={inputType} value={currentValue} />
            </Box>
          ) : inputType === "long-text" ? (
            <VisualDiff {...{ inputType, currentValue, newValue }} />
          ) : inputType === "financialIndicators" ? (
            <FinancialVisualDiff inputType={inputType} currentValue={currentValue} newValue={newValue} />
          ) : inputType === "disturbanceReportEntries" ? (
            <DisturbanceReportEntriesVisualDiff inputType={inputType} currentValue={currentValue} newValue={newValue} />
          ) : (
            <ChangeBox inputType={inputType} oldView={currentValue} newView={newValue} />
          )}
        </div>
      )}
    />
  </Card>
);

export default ChangeRow;
