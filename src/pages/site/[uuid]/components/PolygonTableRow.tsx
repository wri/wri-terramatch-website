import { Box, Flex, TableCell, TableRow, Text } from "@chakra-ui/react";
import { Checkbox } from "@worldresources/wri-design-systems";
import { CSSProperties, FC, memo, ReactNode, useCallback } from "react";

import { restorationStrategyType, targetLandUseType } from "@/constants/polygons";
import { getThemedColor } from "@/lib/theme";
import FeedbackTag from "@/redesignComponents/actions/Tags/FeedbackTag/FeedbackTag";
import MappedTag, { MappedTagState } from "@/redesignComponents/actions/Tags/MappedTag/MappedTag";
import ValidationTag, { ValidationTagState } from "@/redesignComponents/actions/Tags/ValidationTag/ValidationTag";
import Tooltip from "@/redesignComponents/actions/Tooltip/Tooltip";
import {
  AgriculturalLandIcon,
  AgroforestyIcon,
  AssistedNaturalRegenIcon,
  CalendarIcon,
  DirectSeedingIcon,
  GrasslandIcon,
  MangroveIcon,
  NaturalForestIcon,
  OpenNaturalEcosystemIcon,
  PeatlandIcon,
  PlusIcon,
  SilvopastureIcon,
  TreePlantingIcon,
  UrbanForestIcon,
  WetlandIcon,
  WoodlotIcon
} from "@/redesignComponents/foundations/Icons";
import { formatNumberLocaleString } from "@/utils/dashboardUtils";

import { TARGET_LAND_USE_LABELS } from "./polygonFilter.constants";

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

type SiteTypeConfig = { icon: ReactNode; label: string };

const TARGET_LAND_USE_MAP: Record<targetLandUseType, SiteTypeConfig> = {
  agroforest: { icon: <AgroforestyIcon boxSize={3.5} />, label: TARGET_LAND_USE_LABELS.agroforest },
  "agricultural-land": {
    icon: <AgriculturalLandIcon boxSize={3.5} />,
    label: TARGET_LAND_USE_LABELS["agricultural-land"]
  },
  grassland: { icon: <GrasslandIcon boxSize={3.5} />, label: TARGET_LAND_USE_LABELS.grassland },
  mangrove: { icon: <MangroveIcon boxSize={3.5} />, label: TARGET_LAND_USE_LABELS.mangrove },
  "open-natural-ecosystem": {
    icon: <OpenNaturalEcosystemIcon boxSize={3.5} />,
    label: TARGET_LAND_USE_LABELS["open-natural-ecosystem"]
  },
  "natural-forest": { icon: <NaturalForestIcon boxSize={3.5} />, label: TARGET_LAND_USE_LABELS["natural-forest"] },
  peatland: { icon: <PeatlandIcon boxSize={3.5} />, label: TARGET_LAND_USE_LABELS.peatland },
  "riparian-area-or-wetland": {
    icon: <WetlandIcon boxSize={3.5} />,
    label: TARGET_LAND_USE_LABELS["riparian-area-or-wetland"]
  },
  silvopasture: { icon: <SilvopastureIcon boxSize={3.5} />, label: TARGET_LAND_USE_LABELS.silvopasture },
  "urban-forest": { icon: <UrbanForestIcon boxSize={3.5} />, label: TARGET_LAND_USE_LABELS["urban-forest"] },
  "woodlot-or-plantation": {
    icon: <WoodlotIcon boxSize={3.5} />,
    label: TARGET_LAND_USE_LABELS["woodlot-or-plantation"]
  }
};

const SITE_RESTORATION_STRATEGY_MAP: Record<restorationStrategyType, ReactNode> = {
  "tree-planting": (
    <Tooltip content="Tree planting">
      <TreePlantingIcon boxSize={5} color="secondary.800" />
    </Tooltip>
  ),
  "assisted-natural-regeneration": (
    <Tooltip content="Assisted natural regeneration (ANR)">
      <AssistedNaturalRegenIcon boxSize={5} color="secondary.800" />
    </Tooltip>
  ),
  "direct-seeding": (
    <Tooltip content="Direct seeding">
      <DirectSeedingIcon boxSize={5} color="secondary.800" />
    </Tooltip>
  )
};

const HOVERED_ROW_STYLE: CSSProperties = {
  backgroundColor: getThemedColor("primary", 100),
  borderBottom: `2px solid ${getThemedColor("primary", 700)}`
};

const renderTargetLandUse = (targetLandUse: targetLandUseType | null) => {
  if (targetLandUse == null) {
    return <Text>—</Text>;
  }
  const config = TARGET_LAND_USE_MAP[targetLandUse];
  return (
    <Flex className="items-center gap-2" color="neutral.800">
      {config.icon}
      <Text>{config.label}</Text>
    </Flex>
  );
};

const renderRestorationPractice = (restorationPractice: restorationStrategyType[]) => {
  if (restorationPractice.length === 0) {
    return <Text>—</Text>;
  }

  return (
    <Flex className="items-center gap-2">
      {restorationPractice.map((practice, index) => (
        <Flex key={`${practice}-${index}`} className="items-center gap-2">
          {SITE_RESTORATION_STRATEGY_MAP[practice]}
          {index < restorationPractice.length - 1 && <PlusIcon boxSize={2.5} color="secondary.800" />}
        </Flex>
      ))}
    </Flex>
  );
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

export default PolygonRow;
