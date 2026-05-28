import { Card, Divider, Stack, Typography } from "@mui/material";
import { FC } from "react";
import { Labeled, NumberField } from "react-admin";

import { ContextCondition } from "@/context/ContextCondition";
import { Framework } from "@/context/framework.provider";

const INLINE_LABEL_SX = {
  flexDirection: "row",
  justifyContent: "space-between"
};

const HighLevelMetics: FC = () => (
  <Card sx={{ padding: 3.75 }}>
    <Typography variant="h5" marginBottom={2}>
      High Level Metrics
    </Typography>

    <Divider sx={{ marginBottom: 2 }} />

    <Stack gap={3}>
      <ContextCondition frameworksShow={[Framework.TF]}>
        <Labeled label="Jobs Created" sx={INLINE_LABEL_SX}>
          <NumberField source="totalJobsCreated" emptyText="0" />
        </Labeled>
      </ContextCondition>
      <ContextCondition frameworksShow={[Framework.PPC]}>
        <Labeled label="Workdays Created (Old Calculation)" sx={INLINE_LABEL_SX}>
          <NumberField source="selfReportedWorkdayCount" emptyText="0" />
        </Labeled>
        <Labeled label="Workdays Created (New Calculation)" sx={INLINE_LABEL_SX}>
          <NumberField source="workdayCount" emptyText="0" />
        </Labeled>
        <Labeled label="Workdays Created (Combined - PD View)" sx={INLINE_LABEL_SX}>
          <NumberField source="combinedWorkdayCount" emptyText="0" />
        </Labeled>
      </ContextCondition>
      <Labeled label="Trees Planted" sx={INLINE_LABEL_SX}>
        <NumberField source="treesPlantedCount" emptyText="0" />
      </Labeled>
      <ContextCondition frameworksHide={[Framework.PPC]}>
        <Labeled label="Tree Regenerating" sx={INLINE_LABEL_SX}>
          <NumberField source="treesRegeneratingSpeciesCount" emptyText="0" />
        </Labeled>
      </ContextCondition>
      <ContextCondition frameworksShow={[Framework.PPC]}>
        <Labeled label="Seeds Planted" sx={INLINE_LABEL_SX}>
          <NumberField source="seedsPlantedCount" emptyText="0" />
        </Labeled>
      </ContextCondition>
      <Labeled label="Hectares Under Restoration" sx={INLINE_LABEL_SX}>
        <NumberField source="totalHectaresRestoredSum" emptyText="0" />
      </Labeled>
      <ContextCondition frameworksShow={[Framework.PPC]}>
        <Labeled label="Trees Restored" sx={INLINE_LABEL_SX}>
          <NumberField
            source="treesRestoredPpc"
            emptyText="0"
            options={{ minimumFractionDigits: 0, maximumFractionDigits: 0 }}
          />
        </Labeled>
      </ContextCondition>
      <ContextCondition frameworksShow={[Framework.PPC]}>
        <Labeled label="Estimate Number of Trees Restored via ANR" sx={INLINE_LABEL_SX}>
          <NumberField source="regeneratedTreesCount" emptyText="0" />
        </Labeled>
      </ContextCondition>
    </Stack>
  </Card>
);

export default HighLevelMetics;
