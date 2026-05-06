import { Flex, TableCell, TableRow, Text } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { Checkbox } from "@worldresources/wri-design-systems";
import { FC, ReactNode, useMemo } from "react";

import PolygonsMap from "@/components/elements/Map-mapbox/components/PolygonsMap";
import PageContent from "@/components/extensive/PageElements/PageContent/PageContent";
import { restorationStrategyType, targetLandUseType } from "@/constants/polygons";
import { SiteFullDto } from "@/generated/v3/entityService/entityServiceSchemas";
import FeedbackTag from "@/redesignComponents/actions/Tags/FeedbackTag/FeedbackTag";
import MappedTag, { MappedTagState } from "@/redesignComponents/actions/Tags/MappedTag/MappedTag";
import ValidationTag, { ValidationTagState } from "@/redesignComponents/actions/Tags/ValidationTag/ValidationTag";
import Tooltip from "@/redesignComponents/actions/Tooltip/Tooltip";
import ResizeBox from "@/redesignComponents/containers/ResizableSplitView/ResizableBox";
import MetricCard from "@/redesignComponents/dataDisplay/Metrics/MetricCard";
import Table from "@/redesignComponents/dataDisplay/Table/Table";
import { useTableSelection } from "@/redesignComponents/dataDisplay/Table/useTableSelection";
import {
  AgriculturalLandIcon,
  AgroforestyIcon,
  AreaHectaresIcon,
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
  TreeIcon,
  TreePlantingIcon,
  UrbanForestIcon,
  WetlandIcon,
  WoodlotIcon
} from "@/redesignComponents/foundations/Icons";
import InlineMessage from "@/redesignComponents/status/InlineMessage/InlineMessage";

interface SitePolygonsTabProps {
  site: SiteFullDto;
}

type SiteTypeConfig = { icon: ReactNode; label: string; tooltip?: string };

type PolygonTableRow = {
  id: string;
  polygonName: string;
  submission: MappedTagState;
  validation: ValidationTagState;
  restorationPractice: restorationStrategyType[];
  targetLandUse: targetLandUseType;
  plantingDate: string;
  treeDistribution: string[];
  treesPlanted: number;
  area: number;
};

const MOCKED_DATA: PolygonTableRow[] = [
  {
    id: "1",
    polygonName: "Polygon Name long truncate test long truncate test long 1",
    submission: "draft",
    validation: "not-started",
    restorationPractice: ["tree-planting"],
    targetLandUse: "agroforest",
    plantingDate: "2026-01-01",
    treeDistribution: ["single line"],
    treesPlanted: 100,
    area: 100
  },
  {
    id: "2",
    polygonName: "Polygon 2",
    submission: "pending-approval",
    validation: "partially-passed",
    restorationPractice: ["tree-planting", "assisted-natural-regeneration"],
    targetLandUse: "agricultural-land",
    plantingDate: "2026-01-01",
    treeDistribution: ["single line", "partial"],
    treesPlanted: 100,
    area: 100
  },
  {
    id: "3",
    polygonName: "Polygon 3",
    submission: "information-required",
    validation: "failed",
    restorationPractice: ["tree-planting", "assisted-natural-regeneration", "direct-seeding"],
    targetLandUse: "grassland",
    plantingDate: "2026-01-01",
    treeDistribution: ["single line", "partial", "full"],
    treesPlanted: 100,
    area: 100
  },
  {
    id: "4",
    polygonName: "Polygon 4",
    submission: "approved",
    validation: "passed",
    restorationPractice: ["tree-planting", "assisted-natural-regeneration", "direct-seeding"],
    targetLandUse: "mangrove",
    plantingDate: "2026-01-01",
    treeDistribution: ["single line", "partial", "full"],
    treesPlanted: 100,
    area: 100
  },
  {
    id: "5",
    polygonName: "Polygon 5",
    submission: "draft",
    validation: "partially-passed",
    restorationPractice: ["tree-planting"],
    targetLandUse: "open-natural-ecosystem",
    plantingDate: "2026-01-15",
    treeDistribution: ["partial"],
    treesPlanted: 220,
    area: 45
  },
  {
    id: "6",
    polygonName: "Polygon 6",
    submission: "pending-approval",
    validation: "not-started",
    restorationPractice: ["assisted-natural-regeneration"],
    targetLandUse: "natural-forest",
    plantingDate: "2026-02-01",
    treeDistribution: ["single line", "full"],
    treesPlanted: 340,
    area: 62
  },
  {
    id: "7",
    polygonName: "Polygon 7",
    submission: "information-required",
    validation: "passed",
    restorationPractice: ["tree-planting", "direct-seeding"],
    targetLandUse: "peatland",
    plantingDate: "2026-02-14",
    treeDistribution: ["full"],
    treesPlanted: 180,
    area: 28
  },
  {
    id: "8",
    polygonName: "Polygon 8",
    submission: "approved",
    validation: "failed",
    restorationPractice: ["tree-planting", "assisted-natural-regeneration"],
    targetLandUse: "riparian-area-or-wetland",
    plantingDate: "2026-03-01",
    treeDistribution: ["single line", "partial"],
    treesPlanted: 410,
    area: 95
  },
  {
    id: "9",
    polygonName: "Polygon 9",
    submission: "draft",
    validation: "not-started",
    restorationPractice: ["direct-seeding"],
    targetLandUse: "silvopasture",
    plantingDate: "2026-03-10",
    treeDistribution: ["single line"],
    treesPlanted: 95,
    area: 18
  },
  {
    id: "10",
    polygonName: "Polygon 10",
    submission: "pending-approval",
    validation: "partially-passed",
    restorationPractice: ["tree-planting", "assisted-natural-regeneration", "direct-seeding"],
    targetLandUse: "urban-forest",
    plantingDate: "2026-03-22",
    treeDistribution: ["partial", "full"],
    treesPlanted: 275,
    area: 52
  },
  {
    id: "11",
    polygonName: "Polygon 11",
    submission: "information-required",
    validation: "not-started",
    restorationPractice: ["tree-planting"],
    targetLandUse: "woodlot-or-plantation",
    plantingDate: "2026-04-05",
    treeDistribution: ["single line", "partial", "full"],
    treesPlanted: 520,
    area: 120
  },
  {
    id: "12",
    polygonName: "Polygon 12",
    submission: "approved",
    validation: "partially-passed",
    restorationPractice: ["assisted-natural-regeneration", "direct-seeding"],
    targetLandUse: "agroforest",
    plantingDate: "2026-04-18",
    treeDistribution: ["full"],
    treesPlanted: 160,
    area: 33
  },
  {
    id: "13",
    polygonName: "Polygon 13",
    submission: "draft",
    validation: "passed",
    restorationPractice: ["tree-planting", "assisted-natural-regeneration"],
    targetLandUse: "agricultural-land",
    plantingDate: "2026-05-01",
    treeDistribution: ["single line", "partial"],
    treesPlanted: 300,
    area: 71
  },
  {
    id: "14",
    polygonName: "Polygon 14",
    submission: "pending-approval",
    validation: "failed",
    restorationPractice: ["tree-planting", "direct-seeding"],
    targetLandUse: "grassland",
    plantingDate: "2026-05-12",
    treeDistribution: ["partial"],
    treesPlanted: 145,
    area: 24
  },
  {
    id: "15",
    polygonName: "Polygon 15",
    submission: "information-required",
    validation: "partially-passed",
    restorationPractice: ["assisted-natural-regeneration"],
    targetLandUse: "mangrove",
    plantingDate: "2026-05-28",
    treeDistribution: ["single line", "full"],
    treesPlanted: 390,
    area: 88
  }
];

const TARGET_LAND_USE_MAP: Record<targetLandUseType, SiteTypeConfig> = {
  agroforest: {
    icon: <AgroforestyIcon boxSize={3.5} />,
    label: "Agroforest"
  },
  "agricultural-land": {
    icon: <AgriculturalLandIcon boxSize={3.5} />,
    label: "Agricultural Land"
  },
  grassland: {
    icon: <GrasslandIcon boxSize={3.5} />,
    label: "Grassland"
  },
  mangrove: {
    icon: <MangroveIcon boxSize={3.5} />,
    label: "Mangrove"
  },
  "open-natural-ecosystem": {
    icon: <OpenNaturalEcosystemIcon boxSize={3.5} />,
    label: "Open Natural Ecosystem"
  },
  "natural-forest": {
    icon: <NaturalForestIcon boxSize={3.5} />,
    label: "Natural Forest"
  },
  peatland: {
    icon: <PeatlandIcon boxSize={3.5} />,
    label: "Peatland"
  },
  "riparian-area-or-wetland": {
    icon: <WetlandIcon boxSize={3.5} />,
    label: "Riparian Area / Wetland"
  },
  silvopasture: {
    icon: <SilvopastureIcon boxSize={3.5} />,
    label: "Silvopasture"
  },
  "urban-forest": {
    icon: <UrbanForestIcon boxSize={3.5} />,
    label: "Urban Forest"
  },
  "woodlot-or-plantation": {
    icon: <WoodlotIcon boxSize={3.5} />,
    label: "Woodlot / Plantation"
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

const renderRestorationPractice = (restorationPractice: restorationStrategyType[]) => {
  return (
    <Flex className="items-center gap-2">
      {restorationPractice.map((rp, index) => (
        <Flex key={`${rp}-${index}`} className="items-center gap-2">
          {SITE_RESTORATION_STRATEGY_MAP[rp]}
          {index < restorationPractice.length - 1 && <PlusIcon boxSize={2.5} color="secondary.800" />}
        </Flex>
      ))}
    </Flex>
  );
};

const SitePolygonsTab: FC<SitePolygonsTabProps> = ({ site }) => {
  const t = useT();

  const { selectedRows, handleRowSelected, onAllItemsSelected } = useTableSelection<PolygonTableRow>(true, MOCKED_DATA);

  const columns = useMemo(
    () => [
      {
        key: "polygonName",
        label: t("Polygon Name"),
        sortable: true
      },
      {
        key: "submission",
        label: t("Submission"),
        sortable: true
      },
      {
        key: "validation",
        label: t("Validation"),
        sortable: true
      },
      {
        key: "restorationPractice",
        label: t("Restoration Practice")
      },
      {
        key: "targetLandUse",
        label: t("Target Land Use"),
        sortable: true
      },
      {
        key: "plantingDate",
        label: t("Planting Date"),
        sortable: true
      },
      {
        key: "treeDistribution",
        label: t("Tree Distribution"),
        sortable: true
      },
      {
        key: "treesPlanted",
        label: t("Trees Planted"),
        sortable: true
      },
      {
        key: "area",
        label: t("Area (ha)"),
        sortable: true
      }
    ],
    [t]
  );

  const selectableRenderRow = (row: PolygonTableRow, rowProps?: Record<string, unknown>) => {
    const isSelected = selectedRows.some(item => item.id === row.id);
    const handleOnRowSelected = ({ checked }: any) => {
      handleRowSelected(row, Boolean(checked));
    };

    return (
      <TableRow {...(rowProps as any)} aria-selected={isSelected}>
        <TableCell>
          <Checkbox name={`checkbox-${row.id}`} onCheckedChange={handleOnRowSelected} checked={isSelected} />
        </TableCell>
        <TableCell className="min-w-[17.75rem] max-w-[17.75rem]">
          <Text textStyle="400-bold" color="neutral.800" className="truncate">
            {row.polygonName}
          </Text>
        </TableCell>
        <TableCell className="min-w-[15.875rem]">
          <MappedTag state={row.submission} />
        </TableCell>
        <TableCell className="min-w-[12.75rem]">
          <ValidationTag className="" status={row.validation} />
        </TableCell>
        <TableCell className="min-w-[15.5rem]">
          <Flex className="items-center gap-2">{renderRestorationPractice(row.restorationPractice)}</Flex>
        </TableCell>
        <TableCell className="min-w-[16.75rem]">
          <Flex className="items-center gap-2" color="neutral.800">
            {TARGET_LAND_USE_MAP[row.targetLandUse as targetLandUseType].icon}
            <Text>{TARGET_LAND_USE_MAP[row.targetLandUse as targetLandUseType].label}</Text>
          </Flex>
        </TableCell>
        <TableCell className="min-w-[11.5rem]">
          <FeedbackTag
            type="info-grey"
            className="w-fit"
            label={row.plantingDate}
            icon={<CalendarIcon boxSize={2.5} />}
          />
        </TableCell>
        <TableCell className="min-w-[15.875rem]">
          <Text>{row.treeDistribution.join(", ")}</Text>
        </TableCell>
        <TableCell className="min-w-[12.75rem]">{row.treesPlanted}</TableCell>
        <TableCell className="min-w-[15.75rem]">{row.area}</TableCell>
      </TableRow>
    );
  };

  return (
    <PageContent className="bg-theme-neutral-100">
      <ResizeBox initialHeight={100} minHeight={100} maxHeight={600}>
        <PolygonsMap
          entityModel={site}
          type="sites"
          className="max-h-full overflow-hidden !rounded-[0.25rem_0.25rem_0_0]"
        />
      </ResizeBox>
      <Flex className="items-center justify-between gap-4">
        <Flex className="items-center gap-4">
          <MetricCard
            color="secondary.600"
            icon={<TreeIcon />}
            variant="medium"
            title={t("Trees Planted")}
            progress={4897}
            goal={10000}
            tooltipContent={t("Trees Planted")}
            className="min-w-[12.5rem]"
          />
          <MetricCard
            color="secondary.700"
            icon={<AreaHectaresIcon />}
            variant="medium"
            title={t("Restoration Area")}
            progress={1587}
            goal={3000}
            selection={976}
            tooltipContent={t("Restoration Area")}
            className="min-w-[12.5rem]"
          />
        </Flex>
        <InlineMessage
          actionLabel={t("Selected Polygons")}
          isButtonRight
          size="small"
          label={t("6 Overlaps detected")}
          onActionClick={function noRefCheck() {}}
          variant="error"
        />
      </Flex>
      <Table<PolygonTableRow>
        data={MOCKED_DATA}
        columns={columns}
        isScrollable
        scrollableWidth="100%"
        showPagination
        pageSize={10}
        selectable
        selectedRows={selectedRows}
        onAllRowsSelected={(checked, visibleRows) => onAllItemsSelected(checked, visibleRows)}
        renderRow={selectableRenderRow}
      />
    </PageContent>
  );
};

export default SitePolygonsTab;
