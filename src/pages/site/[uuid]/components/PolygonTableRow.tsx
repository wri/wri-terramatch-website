import { Box, Flex, TableCell, TableRow, Text } from "@chakra-ui/react";
import { Checkbox } from "@worldresources/wri-design-systems";
import { CSSProperties, FC, memo, useCallback } from "react";

import { restorationStrategyType, targetLandUseType } from "@/constants/polygons";
import { getThemedColor } from "@/lib/theme";
import FeedbackTag from "@/redesignComponents/actions/Tags/FeedbackTag/FeedbackTag";
import MappedTag, { MappedTagState } from "@/redesignComponents/actions/Tags/MappedTag/MappedTag";
import ValidationTag, { ValidationTagState } from "@/redesignComponents/actions/Tags/ValidationTag/ValidationTag";
import { CalendarIcon } from "@/redesignComponents/foundations/Icons";
import { formatNumberLocaleString } from "@/utils/dashboardUtils";

import { renderRestorationPractice, renderTargetLandUse } from "./polygonTable.constants";

export type PolygonTableRow = {
  id: string;
  polygonName: string;
  submission: MappedTagState;
  validation: ValidationTagState;
  restorationPractice: restorationStrategyType[];
  targetLandUse: targetLandUseType | null;
  plantingDate: string;
  treeDistribution: string[];
  treesPlanted: number;
  area: number;
};

const HOVERED_ROW_STYLE: CSSProperties = {
  backgroundColor: getThemedColor("primary", 100),
  borderBottom: `2px solid ${getThemedColor("primary", 700)}`
};

interface PolygonRowProps {
  row: PolygonTableRow;
  rowProps?: Record<string, unknown>;
  isSelected: boolean;
  isHovered: boolean;
  onHover: (uuid: string) => void;
  onSelectChange: (row: PolygonTableRow, checked: boolean) => void;
}

const PolygonRowComponent: FC<PolygonRowProps> = ({
  row,
  rowProps,
  isSelected,
  isHovered,
  onHover,
  onSelectChange
}) => {
  const handleOnRowSelected = useCallback(
    ({ checked }: { checked?: boolean | "indeterminate" }) => {
      onSelectChange(row, Boolean(checked));
    },
    [row, onSelectChange]
  );

  const handleMouseEnter = useCallback(() => {
    onHover(row.id);
  }, [row.id, onHover]);

  return (
    <TableRow
      {...(rowProps ?? {})}
      aria-selected={isSelected}
      onMouseEnter={handleMouseEnter}
      style={isHovered ? HOVERED_ROW_STYLE : undefined}
    >
      <TableCell>
        <Checkbox
          name={`checkbox-${row.id}`}
          aria-label={`Select polygon ${row.polygonName}`}
          onCheckedChange={handleOnRowSelected}
          checked={isSelected}
        />
      </TableCell>
      <TableCell className="min-w-[17.75rem] max-w-[17.75rem]">
        <Box>
          <Text textStyle="400-bold" color="neutral.800" className="truncate">
            {row.polygonName ?? "—"}
          </Text>
        </Box>
      </TableCell>
      <TableCell className="min-w-[15.875rem]">
        {row.submission != null ? <MappedTag state={row.submission} /> : <Text>—</Text>}
      </TableCell>
      <TableCell className="min-w-[12.75rem]">
        {row.validation != null ? <ValidationTag status={row.validation} /> : <Text>—</Text>}
      </TableCell>
      <TableCell className="min-w-[15.5rem]">
        <Flex className="items-center gap-2">{renderRestorationPractice(row.restorationPractice)}</Flex>
      </TableCell>
      <TableCell className="min-w-[16.75rem]">{renderTargetLandUse(row.targetLandUse)}</TableCell>
      <TableCell className="min-w-[11.5rem]">
        <FeedbackTag
          type="info-grey"
          className="w-fit"
          label={row.plantingDate != "-" ? row.plantingDate : "—"}
          icon={<CalendarIcon boxSize={2.5} />}
        />
      </TableCell>
      <TableCell className="min-w-[15.875rem]">
        <Text>{row.treeDistribution.length > 0 ? row.treeDistribution.join(", ") : "—"}</Text>
      </TableCell>
      <TableCell className="min-w-[12.75rem]">{formatNumberLocaleString(row.treesPlanted) ?? "—"}</TableCell>
      <TableCell className="min-w-[15.75rem]">{formatNumberLocaleString(row.area) ?? "—"}</TableCell>
    </TableRow>
  );
};

export const PolygonRow = memo(PolygonRowComponent);
