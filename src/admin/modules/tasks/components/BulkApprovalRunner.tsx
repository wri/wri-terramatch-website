import { useEffect } from "react";

import { useTask } from "@/connections/Task";

interface BulkApprovalRunnerProps {
  uuid: string;
  siteReportUuids: string[] | null;
  nurseryReportUuids: string[] | null;
  feedback: string;
  trigger: boolean;
  onDone: (uuid: string) => void;
}

const BulkApprovalRunner: React.FC<BulkApprovalRunnerProps> = ({
  uuid,
  siteReportUuids,
  nurseryReportUuids,
  feedback,
  trigger,
  onDone
}) => {
  const [, { submitForApproval }] = useTask({ uuid });

  useEffect(() => {
    if (trigger) {
      if (submitForApproval) {
        submitForApproval({
          siteReportNothingToReportUuid: siteReportUuids,
          nurseryReportNothingToReportUuid: nurseryReportUuids,
          feedback
        });
      }
      onDone(uuid);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trigger]);

  return null;
};

export default BulkApprovalRunner;
