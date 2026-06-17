import { useT } from "@transifex/react";
import { FC } from "react";

import EmptyState from "@/components/elements/EmptyState/EmptyState";
import { IconNames } from "@/components/extensive/Icon/Icon";

const NothingToReportEmptyState: FC = () => {
  const t = useT();

  return (
    <EmptyState
      iconProps={{ name: IconNames.DOCUMENT_CIRCLE, className: "fill-success" }}
      title={t("Nothing to report")}
      subtitle={t(
        "You've marked this report as 'Nothing to Report,' indicating there are no updates for this nursery report. If you wish to add information to this report, please use the edit button."
      )}
    />
  );
};

export default NothingToReportEmptyState;
