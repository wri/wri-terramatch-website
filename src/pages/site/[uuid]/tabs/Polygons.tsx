import { Flex, TableCell, TableRow, Text } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { Checkbox } from "@worldresources/wri-design-systems";
import { FC, ReactNode, useMemo } from "react";

import PolygonsMap from "@/components/elements/Map-mapbox/components/PolygonsMap";
import PageContent from "@/components/extensive/PageElements/PageContent/PageContent";
import { useAllSitePolygons } from "@/connections/SitePolygons";
import { restorationStrategyType, targetLandUseType } from "@/constants/polygons";
import { SiteFullDto } from "@/generated/v3/entityService/entityServiceSchemas";
import { useDate } from "@/hooks/useDate";
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
import {
  mapSitePolygonStatusToMappedTagState,
  mapSitePolygonValidationStatusToValidationTagState
} from "@/utils/mapStatusToTagStateEntity";

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
  targetLandUse: targetLandUseType | null;
  plantingDate: string;
  treeDistribution: string[];
  treesPlanted: number;
  area: number;
};

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

const isRestorationStrategy = (value: string): value is restorationStrategyType => {
  return value === "tree-planting" || value === "assisted-natural-regeneration" || value === "direct-seeding";
};

const isTargetLandUseType = (value: string): value is targetLandUseType => {
  return value in TARGET_LAND_USE_MAP;
};

const formatDistributionValue = (value: string): string => {
  return value
    .split("-")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const getTargetLandUseConfig = (targetLandUse: targetLandUseType | null) => {
  if (targetLandUse == null) {
    return { icon: null, label: "-" };
  }
  return TARGET_LAND_USE_MAP[targetLandUse];
};

const renderRestorationPractice = (restorationPractice: restorationStrategyType[]) => {
  if (restorationPractice.length === 0) {
    return <Text>-</Text>;
  }

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
  const { format } = useDate();
  const { data: polygonsData = [] } = useAllSitePolygons({
    entityName: "sites",
    entityUuid: site.uuid,
    enabled: !!site.uuid
  });

  const polygonRows = useMemo<PolygonTableRow[]>(
    () =>
      polygonsData.map(polygon => ({
        id: polygon.uuid,
        polygonName: polygon.name ?? t("Unnamed Polygon"),
        submission: mapSitePolygonStatusToMappedTagState(polygon.status),
        validation: mapSitePolygonValidationStatusToValidationTagState(polygon.validationStatus),
        restorationPractice: (polygon.practice ?? []).filter(isRestorationStrategy),
        targetLandUse: polygon.targetSys != null && isTargetLandUseType(polygon.targetSys) ? polygon.targetSys : null,
        plantingDate: polygon.plantStart != null ? format(polygon.plantStart, "yyyy-MM-dd") : "-",
        treeDistribution: (polygon.distr ?? []).map(formatDistributionValue),
        treesPlanted: polygon.numTrees ?? 0,
        area: polygon.calcArea ?? 0
      })),
    [format, polygonsData, t]
  );

  const { selectedRows, handleRowSelected, onAllItemsSelected } = useTableSelection<PolygonTableRow>(true, polygonRows);

  const { totalTreesPlanted, totalRestorationAreaHa } = useMemo(() => {
    let trees = 0;
    let area = 0;
    for (const polygon of polygonsData) {
      trees += polygon.numTrees ?? 0;
      area += polygon.calcArea ?? 0;
    }
    return {
      totalTreesPlanted: trees,
      totalRestorationAreaHa: Math.round(area * 100) / 100
    };
  }, [polygonsData]);

  const { selectedTreesPlanted, selectedRestorationAreaHa } = useMemo(
    () =>
      selectedRows.reduce(
        (acc, row) => ({
          selectedTreesPlanted: acc.selectedTreesPlanted + row.treesPlanted,
          selectedRestorationAreaHa: acc.selectedRestorationAreaHa + row.area
        }),
        { selectedTreesPlanted: 0, selectedRestorationAreaHa: 0 }
      ),
    [selectedRows]
  );

  const selectedRestorationAreaRounded = Math.round(selectedRestorationAreaHa * 100) / 100;
  const hasPolygonSelection = selectedRows.length > 0;

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
        label: t("Target Land Use")
      },
      {
        key: "plantingDate",
        label: t("Planting Date"),
        sortable: true
      },
      {
        key: "treeDistribution",
        label: t("Tree Distribution")
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
        <TableCell className="min-w-[10.688rem] max-w-[18.75rem]">
          <Text textStyle="400-bold" color="neutral.800">
            {row.polygonName}
          </Text>
        </TableCell>
        <TableCell className="min-w-[9.375rem] max-w-[16.875rem]">
          <MappedTag state={row.submission} />
        </TableCell>
        <TableCell className="min-w-[8.563rem] max-w-[13.75rem]">
          <ValidationTag className="" status={row.validation} />
        </TableCell>
        <TableCell className="min-w-[12.5rem] max-w-[17.5rem]">
          <Flex className="items-center gap-2">{renderRestorationPractice(row.restorationPractice)}</Flex>
        </TableCell>
        <TableCell className="min-w-[11.563rem] max-w-[18.75rem]">
          <Flex className="items-center gap-2" color="neutral.800">
            {getTargetLandUseConfig(row.targetLandUse).icon}
            <Text>{getTargetLandUseConfig(row.targetLandUse).label}</Text>
          </Flex>
        </TableCell>
        <TableCell className="min-w-[10.188rem] max-w-[12.5rem]">
          <FeedbackTag
            type="info-white"
            className="w-fit"
            label={row.plantingDate}
            size="small"
            icon={<CalendarIcon boxSize={2.5} />}
          />
        </TableCell>
        <TableCell className="min-w-[11.875rem] max-w-[16.875rem]">
          <Text>{row.treeDistribution.join(", ")}</Text>
        </TableCell>
        <TableCell className="min-w-[8.875rem] max-w-[13.75rem]">{row.treesPlanted}</TableCell>
        <TableCell className="min-w-[8.25rem] max-w-[16.75rem]">{row.area}</TableCell>
      </TableRow>
    );
  };

  return (
    <PageContent>
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
            progress={totalTreesPlanted}
            goal={Math.max(totalTreesPlanted, 1)}
            selection={hasPolygonSelection ? selectedTreesPlanted : undefined}
            tooltipContent={t("Trees Planted")}
            className="min-w-[12.5rem]"
          />
          <MetricCard
            color="secondary.700"
            icon={<AreaHectaresIcon />}
            variant="medium"
            title={t("Restoration Area")}
            progress={totalRestorationAreaHa}
            goal={Math.max(totalRestorationAreaHa, 1)}
            selection={hasPolygonSelection ? selectedRestorationAreaRounded : undefined}
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
        data={polygonRows}
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
