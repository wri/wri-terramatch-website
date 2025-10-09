import { Stack } from "@mui/material";
import { FC } from "react";

import { EntityName } from "@/types/common";

import HighLevelMetrics from "./HighLevelMetrics";
import ReportQuickActions from "./QuickActions";
import ReportOverview from "./ReportOverview";

type ReportInformationAsideProps = {
  type: EntityName;
  parent?: { label: string; source: string };
};

const ReportInformationAside: FC<ReportInformationAsideProps> = ({ type, parent }) => {
  return (
    <Stack gap={2}>
      <ReportOverview parent={parent} />

      {type !== "financial-reports" && (
        <>
          <ReportQuickActions type={type} />
          {type !== "disturbance-reports" && <HighLevelMetrics />}
        </>
      )}
    </Stack>
  );
};

export default ReportInformationAside;
