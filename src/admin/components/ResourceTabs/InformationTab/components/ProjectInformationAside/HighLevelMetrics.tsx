import { Card, Divider, Stack, SxProps, Theme, Typography } from "@mui/material";
import { FC } from "react";
import { Labeled, NumberField } from "react-admin";

import { ContextCondition } from "@/context/ContextCondition";
import { Framework } from "@/context/framework.provider";

const HighLevelMetics: FC = () => {
  const inlineLabelSx: SxProps<Theme> = {
    flexDirection: "row",
    justifyContent: "space-between"
  };

  return (
    <Card sx={{ padding: 3.75 }}>
      <Typography variant="h5" marginBottom={2}>
        High Level Metrics
      </Typography>

      <Divider sx={{ marginBottom: 2 }} />

      <Stack gap={3}>
        <ContextCondition frameworksShow={[Framework.TF]}>
          <Labeled label="Jobs Created" sx={inlineLabelSx}>
            <NumberField source="total_jobs_created" emptyText="0" />
          </Labeled>
        </ContextCondition>
        <ContextCondition frameworksShow={[Framework.PPC]}>
          <Labeled label="Workdays Created (Old Calculation)" sx={inlineLabelSx}>
            <NumberField source="self_reported_workday_count" emptyText="0" />
          </Labeled>
          <Labeled label="Workdays Created (New Calculation)" sx={inlineLabelSx}>
            <NumberField source="workday_count" emptyText="0" />
          </Labeled>
          <Labeled label="Workdays Created (Combined - PD View)" sx={inlineLabelSx}>
            <NumberField source="combined_workday_count" emptyText="0" />
          </Labeled>
        </ContextCondition>
        <Labeled label="Trees Planted" sx={inlineLabelSx}>
          <NumberField source="trees_planted_count" emptyText="0" />
        </Labeled>
        <ContextCondition frameworksShow={[Framework.PPC]}>
          <Labeled label="Seeds Planted" sx={inlineLabelSx}>
            <NumberField source="seeds_planted_count" emptyText="0" />
          </Labeled>
        </ContextCondition>
        <Labeled label="Hectares Under Restoration" sx={inlineLabelSx}>
          <NumberField source="total_hectares_restored_sum" emptyText="0" />
        </Labeled>
        <ContextCondition frameworksShow={[Framework.PPC]}>
          <Labeled label="Trees Restored" sx={inlineLabelSx}>
            <NumberField
              source="trees_restored_ppc"
              emptyText="0"
              options={{ minimumFractionDigits: 0, maximumFractionDigits: 0 }}
            />
          </Labeled>
        </ContextCondition>
      </Stack>
    </Card>
  );
};

export default HighLevelMetics;
