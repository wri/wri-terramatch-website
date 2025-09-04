import { Box, Grid, Stack, Typography } from "@mui/material";
import React from "react";
import { RaRecord, useShowContext } from "react-admin";

import Button from "@/components/elements/Button/Button";
import Text from "@/components/elements/Text/Text";
import { DisturbanceReportLightDto } from "@/generated/v3/entityService/entityServiceSchemas";

const ReportedDataAside = () => {
  const { record } = useShowContext<DisturbanceReportLightDto & RaRecord>();
  return (
    <div className="user-aside max-w-[25rem] pl-4">
      <Box className="shadow-sm mb-4 rounded-lg bg-white">
        <Typography
          variant="h6"
          className="text-gray-800 mb-4 border-b border-[#EAEAEA] px-4 py-2 text-lg font-semibold"
        >
          Report Overview
        </Typography>

        <Grid container spacing={3} className="p-4">
          <Grid item xs={12}>
            <Box className="flex flex-col gap-2">
              <Text variant="text-14-light" className="leading-none text-darkCustom-300">
                Project
              </Text>
              <Text variant="text-14" className="leading-none text-blueCustom-900">
                {record?.projectName}
              </Text>
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Box className="flex flex-col gap-2">
              <Text variant="text-14-light" className="leading-none text-darkCustom-300">
                Organisation
              </Text>
              <Text variant="text-14" className="leading-none text-blueCustom-900">
                {record?.organisationName}
              </Text>
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Box className="flex flex-col gap-2">
              <Text variant="text-14-light" className="leading-none text-darkCustom-300">
                Framework
              </Text>
              <Text variant="text-14" className="leading-none text-blueCustom-900">
                {record?.frameworkKey}
              </Text>
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Box className="flex flex-col gap-2">
              <Text variant="text-14-light" className="leading-none text-darkCustom-300">
                Status
              </Text>
              <Text variant="text-14" className="leading-none text-blueCustom-900">
                {record?.status}
              </Text>
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Box className="flex flex-col gap-2">
              <Text variant="text-14-light" className="leading-none text-darkCustom-300">
                Change Request Status
              </Text>
              <Text variant="text-14" className="leading-none text-blueCustom-900">
                {record?.updateRequestStatus}
              </Text>
            </Box>
          </Grid>
        </Grid>
        <Box className="px-4 pb-4">
          <Stack direction="row" flexWrap="wrap" gap={2}>
            <Button variant="outlined">REQUEST MORE INFO</Button>
            <Button variant="outlined" disabled>
              ✓ APPROVE
            </Button>
            <Button variant="outlined">REMINDER</Button>
          </Stack>
        </Box>
      </Box>

      <Box className="shadow-sm mb-4 rounded-lg bg-white">
        <Typography
          variant="h6"
          className="text-gray-800 mb-4 border-b border-[#EAEAEA] px-4 py-2 text-lg font-semibold"
        >
          Quick Actions
        </Typography>

        <Stack spacing={2} className="p-4">
          <Button variant="outlined" className="!text-blue-600 !border-blue-600 !justify-center !rounded-md" fullWidth>
            BACK TO PROJECT
          </Button>
        </Stack>
      </Box>
    </div>
  );
};

export default ReportedDataAside;
