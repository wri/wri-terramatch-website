import { Box, Flex, TableCell, TableRow, Text } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { Checkbox } from "@worldresources/wri-design-systems";
import { CSSProperties, FC, memo, ReactNode, useCallback, useMemo } from "react";

import { restorationStrategyType, targetLandUseType } from "@/constants/polygons";
import { useTargetLandUseLabels } from "@/hooks/translation/useTargetLandUseLabels";
import { TreeDistributionType, useTreeDistributionOptions } from "@/hooks/translation/useTreeDistributionOptions";
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
  DeleteIcon,
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

import { type SubmissionCycleOption, formatSubmissionCycleDisplay } from "./polygonFilter.constants";

export type PolygonTableRow = {
  id: string;
  polygonName: string;
  submission: MappedTagState;
  validation: ValidationTagState;
  restorationPractice: restorationStrategyType[];
  restorationPracticeSort: string;
  targetLandUse: targetLandUseType | null;
  targetLandUseSort: string;
  treeDistribution: TreeDistributionType[];
  treeDistributionSort: string;
  plantingDate: string;
  treesPlanted: number;
  area: number;
  submissionCycle: string[];
  submissionCycleSort: string;
  source: string;
};

type SiteTypeConfig = { icon: ReactNode; label: string };

const TARGET_LAND_USE_ICONS: Record<targetLandUseType, ReactNode> = {
  agroforest: <AgroforestyIcon boxSize={3.5} />,
  "agricultural-land": <AgriculturalLandIcon boxSize={3.5} />,
  grassland: <GrasslandIcon boxSize={3.5} />,
  mangrove: <MangroveIcon boxSize={3.5} />,
  "open-natural-ecosystem": <OpenNaturalEcosystemIcon boxSize={3.5} />,
  "natural-forest": <NaturalForestIcon boxSize={3.5} />,
  peatland: <PeatlandIcon boxSize={3.5} />,
  "riparian-area-or-wetland": <WetlandIcon boxSize={3.5} />,
  silvopasture: <SilvopastureIcon boxSize={3.5} />,
  "urban-forest": <UrbanForestIcon boxSize={3.5} />,
  "woodlot-or-plantation": <WoodlotIcon boxSize={3.5} />
};

const SITE_RESTORATION_STRATEGY_MAP: Record<restorationStrategyType, ReactNode> = {
  "tree-planting": (
    <Tooltip content="Tree planting">
      <TreePlantingIcon boxSize={5} color="secondary.800" />
    </Tooltip>
  ),
  "sapling-planting": (
    <Tooltip content="Sapling planting">
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

const renderTargetLandUse = (
  targetLandUse: targetLandUseType | null,
  targetLandUseMap: Record<targetLandUseType, SiteTypeConfig>
) => {
  if (targetLandUse == null) {
    return <Text>—</Text>;
  }
  const config = targetLandUseMap[targetLandUse];
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

const renderTreeDistribution = (
  treeDistribution: TreeDistributionType[],
  labelByValue: Record<TreeDistributionType, string>
) => {
  if (treeDistribution.length === 0) {
    return <Text>—</Text>;
  }

  return <Text>{treeDistribution.map(value => labelByValue[value]).join(", ")}</Text>;
};

interface PolygonRowProps {
  row: PolygonTableRow;
  rowProps?: Record<string, unknown>;
  isSelected: boolean;
  isHovered: boolean;
  onHover: (uuid: string) => void;
  onSelectChange: (row: PolygonTableRow, checked: boolean) => void;
  // Deleted-polygons audit view: no selection, no bulk actions, submission status is always "deleted".
  readOnly?: boolean;
}

const PolygonRowComponent: FC<PolygonRowProps> = ({
  row,
  rowProps,
  isSelected,
  isHovered,
  onHover,
  onSelectChange,
  readOnly = false
}) => {
  const t = useT();
  const targetLandUseLabels = useTargetLandUseLabels();
  const treeDistributionOptions = useTreeDistributionOptions();
  const treeDistributionLabels = useMemo(
    (): Record<TreeDistributionType, string> =>
      Object.fromEntries(treeDistributionOptions.map(({ value, label }) => [value, label])) as Record<
        TreeDistributionType,
        string
      >,
    [treeDistributionOptions]
  );
  const targetLandUseMap = useMemo(
    (): Record<targetLandUseType, SiteTypeConfig> =>
      (Object.keys(TARGET_LAND_USE_ICONS) as targetLandUseType[]).reduce(
        (map, key) => ({
          ...map,
          [key]: { icon: TARGET_LAND_USE_ICONS[key], label: targetLandUseLabels[key] }
        }),
        {} as Record<targetLandUseType, SiteTypeConfig>
      ),
    [targetLandUseLabels]
  );

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
          disabled={readOnly}
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
        {readOnly ? (
          <FeedbackTag type="info-grey" className="w-fit" label={t("Deleted")} icon={<DeleteIcon boxSize={2.5} />} />
        ) : row.submission != null ? (
          <MappedTag state={row.submission} />
        ) : (
          <Text>—</Text>
        )}
      </TableCell>
      <TableCell className="min-w-[12.75rem]">
        {row.validation != null ? <ValidationTag status={row.validation} /> : <Text>—</Text>}
      </TableCell>
      <TableCell className="min-w-[15.5rem]">
        <Flex className="items-center gap-2">{renderRestorationPractice(row.restorationPractice)}</Flex>
      </TableCell>
      <TableCell className="min-w-[16.75rem]">{renderTargetLandUse(row.targetLandUse, targetLandUseMap)}</TableCell>
      <TableCell className="min-w-[15.875rem]">
        {renderTreeDistribution(row.treeDistribution, treeDistributionLabels)}
      </TableCell>
      <TableCell className="min-w-[11.5rem]">
        <FeedbackTag
          type="info-grey"
          className="w-fit"
          label={row.plantingDate != "-" ? row.plantingDate : "—"}
          icon={<CalendarIcon boxSize={2.5} />}
        />
      </TableCell>
      <TableCell className="min-w-[12.75rem]">{formatNumberLocaleString(row.treesPlanted) ?? "—"}</TableCell>
      <TableCell className="min-w-[15.75rem]">{formatNumberLocaleString(row.area) ?? "—"}</TableCell>
      <TableCell className="min-w-[12rem]">
        <Text>{formatSubmissionCycleDisplay(row.submissionCycle as SubmissionCycleOption[])}</Text>
      </TableCell>
      <TableCell className="min-w-[12rem]">
        <Text>{row.source === "uploaded" ? t("Uploaded") : row.source}</Text>
      </TableCell>
    </TableRow>
  );
};

const polygonRowPropsAreEqual = (prev: PolygonRowProps, next: PolygonRowProps) =>
  prev.row === next.row &&
  prev.isSelected === next.isSelected &&
  prev.isHovered === next.isHovered &&
  prev.rowProps === next.rowProps &&
  prev.onHover === next.onHover &&
  prev.onSelectChange === next.onSelectChange &&
  prev.readOnly === next.readOnly;

export const PolygonRow = memo(PolygonRowComponent, polygonRowPropsAreEqual);

export default PolygonRow;
