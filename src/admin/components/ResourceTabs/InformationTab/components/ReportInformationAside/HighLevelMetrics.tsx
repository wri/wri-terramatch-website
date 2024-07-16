import { Box, Card, Divider, Stack, SxProps, Theme, Typography } from "@mui/material";
import { FC } from "react";
import { Labeled, NumberField, useShowContext } from "react-admin";
import { When } from "react-if";

import { ContextCondition } from "@/context/ContextCondition";
import { Framework } from "@/context/framework.provider";

const HighLevelMetics: FC = () => {
  const { record, resource } = useShowContext();

  const inlineLabelSx: SxProps<Theme> = {
    flexDirection: "row",
    justifyContent: "space-between"
  };

  const workdaysType = resource === "projectReport" ? "Project" : resource === "siteReport" ? "Site" : null;

  return (
    <Card>
      <Box paddingX={3.75} paddingY={2}>
        <Typography variant="h5">High Level Metrics</Typography>
      </Box>

      <Divider />

      <Box paddingX={3.75} paddingY={2}>
        <Stack gap={3}>
          <ContextCondition frameworksHide={[Framework.TF]}>
            <Labeled label="Total Number Of Workdays Created" sx={inlineLabelSx}>
              <NumberField source={record.workdays_total ? "workdays_total" : "total_workdays_count"} emptyText="0" />
            </Labeled>
            <When condition={workdaysType != null}>
              <Labeled label={`Total Number Of Paid ${workdaysType} Workdays Created`} sx={inlineLabelSx}>
                <NumberField source="workdays_paid" emptyText="0" />
              </Labeled>
              <Labeled label={`Total Number Of Volunteer ${workdaysType} Workdays Created`} sx={inlineLabelSx}>
                <NumberField source="workdays_volunteer" emptyText="0" />
              </Labeled>
            </When>
          </ContextCondition>
          <ContextCondition frameworksShow={[Framework.TF]}>
            <Labeled label="Total Number Of Jobs Created" sx={inlineLabelSx}>
              <NumberField source="total_jobs_created" emptyText="0" />
            </Labeled>
          </ContextCondition>
          <Labeled label="Total Number Of Trees Planted" sx={inlineLabelSx}>
            <NumberField
              source={record.trees_planted_count ? "trees_planted_count" : "total_trees_planted_count"}
              emptyText="0"
            />
          </Labeled>
          <ContextCondition frameworksShow={[Framework.PPC]}>
            <When condition={resource === "projectReport" || resource === "siteReport"}>
              <Labeled label="Total Number Of Seeds Planted" sx={inlineLabelSx}>
                <NumberField
                  source={record.seeds_planted_count ? "trees_planted_count" : "total_seeds_planted_count"}
                  emptyText="0"
                />
              </Labeled>
            </When>
          </ContextCondition>
          <ContextCondition frameworksShow={[Framework.TF]}>
            <Labeled label="Total Number Of Seedlings" sx={inlineLabelSx}>
              <NumberField source="seedlings_grown" emptyText="0" />
            </Labeled>
          </ContextCondition>
        </Stack>
      </Box>
    </Card>
  );
};

export default HighLevelMetics;
