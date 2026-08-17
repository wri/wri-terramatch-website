import { Flex } from "@chakra-ui/react";
import { useMemo } from "react";

import TagSubmission from "@/redesignComponents/actions/Tags/TagSubmission/TagSubmission";
import { CheckApprovedIcon } from "@/redesignComponents/foundations/Icons";

import type { ReportsIndexStatus } from "../reportIndex.types";
import { areAllReportsComplete, getReportStatusCounts } from "../reportIndex.utils";

type ReportAttentionStatusLabelsProps = {
  reports: Array<{ status: ReportsIndexStatus }>;
};

const ReportAttentionStatusLabels = ({ reports }: ReportAttentionStatusLabelsProps) => {
  const counts = useMemo(() => getReportStatusCounts(reports), [reports]);
  const hasAttention = counts.due + counts.draft + counts.informationRequired > 0;

  if (hasAttention) {
    return (
      <Flex alignItems="center" gap={2} className="mobile:flex-wrap mobile:justify-end">
        {counts.due > 0 && <TagSubmission state="due" size="small" labelPrefix={counts.due} />}
        {counts.draft > 0 && <TagSubmission state="draft" size="small" labelPrefix={counts.draft} />}
        {counts.informationRequired > 0 && (
          <TagSubmission state="information-required" size="small" labelPrefix={counts.informationRequired} />
        )}
      </Flex>
    );
  }

  if (areAllReportsComplete(reports)) {
    return <CheckApprovedIcon boxSize={4} color="success.500" />;
  }

  return null;
};

export default ReportAttentionStatusLabels;
