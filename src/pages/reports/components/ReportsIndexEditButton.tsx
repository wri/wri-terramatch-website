import { Box } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { FC } from "react";

import { getThemedColor } from "@/lib/theme";
import ActionCell from "@/redesignComponents/dataDisplay/Table/components/ActionCell";
import { EditIcon } from "@/redesignComponents/foundations/Icons";

import { ReportIndexItem } from "../reportIndex.types";
import { isReportEditable } from "../reportIndex.utils";
import { useReportEditHandler } from "../useReportEditHandler";

const ReportsIndexEditButton: FC<{ report: ReportIndexItem; indexHref?: string }> = ({ report, indexHref }) => {
  const t = useT();
  const { editReport, EditModals } = useReportEditHandler(report, indexHref);

  if (!isReportEditable(report)) return null;

  return (
    <>
      {EditModals}
      <Box pr="1.5625rem">
        <ActionCell
          button={{
            children: t("Edit"),
            onClick: editReport,
            leftIcon: (
              <EditIcon
                css={{
                  "& svg path": {
                    fill: getThemedColor("neutral", 900) + " !important",
                    color: getThemedColor("neutral", 900) + " !important"
                  }
                }}
              />
            )
          }}
        />
      </Box>
    </>
  );
};

export default ReportsIndexEditButton;
