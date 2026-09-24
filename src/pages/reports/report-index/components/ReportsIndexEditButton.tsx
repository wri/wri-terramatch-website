import { Box } from "@chakra-ui/react";
import { useT } from "@transifex/react";

import { useGetEditEntityHandler } from "@/hooks/entity/useGetEditEntityHandler";
import { getThemedColor } from "@/lib/theme";
import ActionCell from "@/redesignComponents/dataDisplay/Table/components/ActionCell";
import { EditIcon } from "@/redesignComponents/foundations/Icons";

import { ReportIndexItem } from "../reportIndex.types";
import { rememberReportsIndexPosition } from "../reportIndex.utils";

const ReportsIndexEditButton = ({ report, indexHref }: { report: ReportIndexItem; indexHref?: string }) => {
  const t = useT();
  const { handleEdit, EditModals } = useGetEditEntityHandler({
    entityName: `${report.type}s`,
    entityUUID: report.id,
    entityStatus: report.status,
    updateRequestStatus: report.updateRequestStatus,
    entityTitle: report.name ?? "",
    useStatusModal: true,
    useInformationRequiredModal: report.nothingToReport === true ? false : true
  });

  return (
    <>
      {EditModals}
      <Box pr="1.5625rem">
        <ActionCell
          button={{
            children: t("Edit"),
            onClick: () => {
              rememberReportsIndexPosition(indexHref, report.id);
              handleEdit();
            },
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
