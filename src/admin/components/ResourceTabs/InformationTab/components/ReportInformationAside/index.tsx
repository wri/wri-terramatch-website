import { Stack } from "@mui/material";
import { FC } from "react";

import { EntityName } from "@/types/common";

import HighLevelMetics from "./HighLevelMetrics";
import QuickActions from "./QuickActions";
import ReportOverview from "./ReportOverview";

type ReportInformationAsideProps = {
  type: EntityName;
  parent?: { label: string; source: string };
};

const ReportInformationAside: FC<ReportInformationAsideProps> = ({ type, parent }) => {
  return (
    <Stack gap={2}>
      <ReportOverview parent={parent} />

      <QuickActions type={type} />

      <HighLevelMetics />
    </Stack>
  );
};

export default ReportInformationAside;
