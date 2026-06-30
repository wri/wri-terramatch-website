import { Flex, Text } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { FC } from "react";

import ValidationTag from "@/redesignComponents/actions/Tags/ValidationTag/ValidationTag";
import Table from "@/redesignComponents/dataDisplay/Table/Table";
import { AreaHectaresCircleIcon } from "@/redesignComponents/foundations/Icons";
import { formatNumberLocaleString } from "@/utils/dashboardUtils";

import type { PolygonTableRow } from "../../PolygonTableRow";
import { POLYGON_APPROVAL_TABLE_CSS } from "./PolygonApprovalTable.styles";

interface PolygonApprovalTableProps {
  polygons: PolygonTableRow[];
}

const PolygonApprovalTable: FC<PolygonApprovalTableProps> = ({ polygons }) => {
  const t = useT();

  return (
    <Table
      css={POLYGON_APPROVAL_TABLE_CSS}
      variant="full-width"
      data={polygons}
      showPagination={false}
      showItemCount={false}
      selectable={true}
      columns={[
        { key: "polygonName", label: t("Polygon Name") },
        { key: "validation", label: t("Validation") },
        { key: "area", label: t("Total Area") }
      ]}
      renderDataCell={(row, columnKey) => {
        if (columnKey === "validation") {
          return row.validation != null ? <ValidationTag status={row.validation} /> : <Text>—</Text>;
        }
        if (columnKey === "area") {
          return (
            <Flex className="items-center gap-1.5">
              <AreaHectaresCircleIcon boxSize={5} />
              <Text textStyle="400" color="neutral.800">
                {formatNumberLocaleString(row.area) ?? "—"} ha
              </Text>
            </Flex>
          );
        }
        return (
          <Text textStyle="400" color="neutral.800" maxW="12rem" truncate>
            {row.polygonName ?? "—"}
          </Text>
        );
      }}
    />
  );
};

export default PolygonApprovalTable;
