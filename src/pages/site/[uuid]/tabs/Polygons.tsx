import { Box, Flex, TableCell, TableRow, Text } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { Checkbox } from "@worldresources/wri-design-systems";
import { FC, memo, ReactNode, useCallback, useEffect, useMemo, useRef, useState } from "react";

import PolygonsMap from "@/components/elements/Map-mapbox/components/PolygonsMap";
import PageContent from "@/components/extensive/PageElements/PageContent/PageContent";
import PageItem from "@/components/extensive/PageElements/PageItem/PageItem";
import { useAllSitePolygons } from "@/connections/SitePolygons";
import { useAllSiteValidations } from "@/connections/Validation";
import { restorationStrategyType, targetLandUseType } from "@/constants/polygons";
import { SiteFullDto } from "@/generated/v3/entityService/entityServiceSchemas";
import { SitePolygonsIndexQueryParams } from "@/generated/v3/researchService/researchServiceComponents";
import { useDate } from "@/hooks/useDate";
import { getThemedColor } from "@/lib/theme";
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
  DownloadIcon,
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
import { SelectedFilter } from "@/redesignComponents/navigation/Toolbar/ToolBar.type";
import InlineMessage from "@/redesignComponents/status/InlineMessage/InlineMessage";
import { OVERLAPPING_CRITERIA_ID } from "@/types/validation";
import {
  mapSitePolygonStatusToMappedTagState,
  mapSitePolygonValidationStatusToValidationTagState
} from "@/utils/mapStatusToTagStateEntity";

import {
  EMPTY_POLYGON_FILTERS,
  PolygonFilterState,
  RESTORATION_PRACTICE_LABELS,
  SUBMISSION_STATUS_LABELS,
  TARGET_LAND_USE_LABELS,
  VALIDATION_STATUS_LABELS
} from "../components/polygonFilter.constants";
import PolygonToolbar from "../components/PolygonToolbar";

interface SitePolygonsTabProps {
  site: SiteFullDto;
}

type SiteTypeConfig = { icon: ReactNode; label: string; tooltip?: string };

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

const HOVERED_ROW_STYLE: React.CSSProperties = {
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

  const targetLandUseConfig = getTargetLandUseConfig(row.targetLandUse);

  return (
    <TableRow
      {...(rowProps as Record<string, unknown>)}
      aria-selected={isSelected || isHovered}
      onMouseEnter={handleMouseEnter}
      style={isHovered ? HOVERED_ROW_STYLE : undefined}
    >
      <TableCell>
        <Checkbox name={`checkbox-${row.id}`} onCheckedChange={handleOnRowSelected} checked={isSelected} />
      </TableCell>
      <TableCell className="min-w-[17.75rem] max-w-[17.75rem]">
        <Box>
          <Text textStyle="400-bold" color="neutral.800" className="truncate">
            {row.polygonName}
          </Text>
        </Box>
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
          {targetLandUseConfig.icon}
          <Text>{targetLandUseConfig.label}</Text>
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

const PolygonRow = memo(PolygonRowComponent);

const SitePolygonsTab: FC<SitePolygonsTabProps> = ({ site }) => {
  const t = useT();
  const { format } = useDate();
  const tableContainerRef = useRef<HTMLDivElement>(null);
  const [isStickyActive, setIsStickyActive] = useState(false);
  const [polygonSearch, setPolygonSearch] = useState("");
  const [debouncedPolygonSearch, setDebouncedPolygonSearch] = useState("");
  const [polygonFilters, setPolygonFilters] = useState<PolygonFilterState>(EMPTY_POLYGON_FILTERS);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setDebouncedPolygonSearch(polygonSearch.trim());
    }, 300);

    return () => window.clearTimeout(timeout);
  }, [polygonSearch]);

  const sitePolygonFilter = useMemo(() => {
    const filter: Record<string, unknown> = {};
    if (polygonFilters.polygonStatus.length > 0) filter.polygonStatus = polygonFilters.polygonStatus;
    if (polygonFilters.validationStatus.length > 0) filter.validationStatus = polygonFilters.validationStatus;
    if (polygonFilters.plantStartFrom !== "") filter.plantStartFrom = polygonFilters.plantStartFrom;
    if (polygonFilters.plantStartTo !== "") filter.plantStartTo = polygonFilters.plantStartTo;
    if (polygonFilters.practice.length > 0) filter.practice = polygonFilters.practice;
    if (polygonFilters.targetSys.length > 0) filter.targetSys = polygonFilters.targetSys;
    if (polygonFilters.hasOverlap) filter.hasOverlap = true;
    if (debouncedPolygonSearch !== "") {
      filter.search = debouncedPolygonSearch;
      filter.searchFields = ["polyName", "polygonUuid"];
    }
    return filter as Partial<SitePolygonsIndexQueryParams>;
  }, [debouncedPolygonSearch, polygonFilters]);

  const { data: polygonsData = [] } = useAllSitePolygons({
    entityName: "sites",
    entityUuid: site.uuid,
    enabled: site.uuid != null && site.uuid !== "",
    filter: sitePolygonFilter
  });

  const { allValidations: overlapValidations, fetchAllValidationPages: fetchOverlapValidations } =
    useAllSiteValidations(site.uuid, OVERLAPPING_CRITERIA_ID);

  const polygonIdsKey = useMemo(
    () =>
      polygonsData
        .map(p => p.uuid)
        .filter((uuid): uuid is string => uuid != null && uuid !== "")
        .sort()
        .join(","),
    [polygonsData]
  );

  useEffect(() => {
    if (site.uuid == null || site.uuid === "") {
      return;
    }
    void fetchOverlapValidations();
  }, [site.uuid, polygonIdsKey, fetchOverlapValidations]);

  const polygonsWithOverlapCount = useMemo(() => {
    const currentPolygonUuids = new Set(
      polygonsData
        .map(polygon => polygon.polygonUuid ?? polygon.uuid)
        .filter((id): id is string => id != null && id !== "")
    );
    const ids = new Set(
      overlapValidations
        .map(v => v.polygonUuid)
        .filter((id): id is string => id != null && id !== "" && currentPolygonUuids.has(id))
    );
    return ids.size;
  }, [overlapValidations, polygonsData]);

  const polygonRows = useMemo<PolygonTableRow[]>(
    () =>
      polygonsData.map(polygon => ({
        id: polygon.polygonUuid ?? polygon.uuid,
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

  const { selectedRows, selectedRowIds, setSelectedRowIds, handleRowSelected, onAllItemsSelected } =
    useTableSelection<PolygonTableRow>(true, polygonRows);

  const [hoveredPolygonUuid, setHoveredPolygonUuid] = useState<string | null>(null);

  const selectedPolygonUuids = useMemo(() => Array.from(selectedRowIds, id => String(id)), [selectedRowIds]);

  useEffect(() => {
    const visibleRowIds = new Set(polygonRows.map(row => row.id));
    setSelectedRowIds(prev => {
      const next = new Set(Array.from(prev).filter(id => visibleRowIds.has(String(id))));
      return next.size === prev.size ? prev : next;
    });
  }, [polygonRows, setSelectedRowIds]);

  const handlePolygonClickedFromMap = useCallback(
    (uuid: string) => {
      setSelectedRowIds(prev => {
        if (prev.has(uuid)) return prev;
        const next = new Set(prev);
        next.add(uuid);
        return next;
      });
    },
    [setSelectedRowIds]
  );

  const polygonTableHighlight = useMemo(
    () => ({
      hoveredPolygonUuid,
      selectedPolygonUuids,
      onHoveredPolygonFromMap: setHoveredPolygonUuid,
      onPolygonClickedFromMap: handlePolygonClickedFromMap
    }),
    [hoveredPolygonUuid, selectedPolygonUuids, handlePolygonClickedFromMap]
  );

  const handleClearHover = useCallback(() => setHoveredPolygonUuid(null), []);

  const handleClearPolygonFilters = useCallback(() => {
    setPolygonFilters(EMPTY_POLYGON_FILTERS);
    setPolygonSearch("");
    setDebouncedPolygonSearch("");
  }, []);

  const activeFilterLabels = useMemo<SelectedFilter[]>(() => {
    const labels: SelectedFilter[] = [];
    if (polygonFilters.polygonStatus.length > 0) {
      labels.push({
        label: polygonFilters.polygonStatus.map(status => t(SUBMISSION_STATUS_LABELS[status])),
        onRemove: () => {
          setPolygonFilters(current => ({ ...current, polygonStatus: [] }));
        }
      });
    }
    if (polygonFilters.validationStatus.length > 0) {
      labels.push({
        label: polygonFilters.validationStatus.map(status => t(VALIDATION_STATUS_LABELS[status])),
        onRemove: () => {
          setPolygonFilters(current => ({ ...current, validationStatus: [] }));
        }
      });
    }
    if (polygonFilters.plantStartFrom !== "" || polygonFilters.plantStartTo !== "") {
      const fromLabel = polygonFilters.plantStartFrom !== "" ? polygonFilters.plantStartFrom : t("Any date");
      const toLabel = polygonFilters.plantStartTo !== "" ? polygonFilters.plantStartTo : t("Any date");
      labels.push({
        label: `${fromLabel} - ${toLabel}`,
        onRemove: () => {
          setPolygonFilters(current => ({ ...current, plantStartFrom: "", plantStartTo: "" }));
        }
      });
    }
    if (polygonFilters.practice.length > 0) {
      labels.push({
        label: polygonFilters.practice.map(practice => t(RESTORATION_PRACTICE_LABELS[practice])),
        onRemove: () => {
          setPolygonFilters(current => ({ ...current, practice: [] }));
        }
      });
    }
    if (polygonFilters.targetSys.length > 0) {
      labels.push({
        label: polygonFilters.targetSys.map(targetSys => t(TARGET_LAND_USE_LABELS[targetSys])),
        onRemove: () => {
          setPolygonFilters(current => ({ ...current, targetSys: [] }));
        }
      });
    }
    if (polygonFilters.hasOverlap) {
      labels.push({
        label: t("Failed overlap validation"),
        onRemove: () => {
          setPolygonFilters(current => ({ ...current, hasOverlap: false }));
        }
      });
    }
    return labels;
  }, [polygonFilters, t, setPolygonFilters]);

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

  const selectableRenderRow = useCallback(
    (row: PolygonTableRow, rowProps?: Record<string, unknown>) => (
      <PolygonRow
        row={row}
        rowProps={rowProps}
        isSelected={selectedRowIds.has(row.id)}
        isHovered={hoveredPolygonUuid === row.id}
        onHover={setHoveredPolygonUuid}
        onSelectChange={handleRowSelected}
      />
    ),
    [handleRowSelected, hoveredPolygonUuid, selectedRowIds]
  );

  const getPolygonsTableStyles = (isStickyActive: boolean) => ({
    "& table td": {
      height: "3rem"
    },
    "& table th:first-child": {
      position: "sticky",
      left: 0,
      zIndex: 2,
      background: getThemedColor("neutral", 200)
    },
    "& table td:first-child": {
      position: "sticky",
      left: 0,
      zIndex: 2,
      background: getThemedColor("neutral", 100),
      transition: "background-color 0.15s ease-in-out"
    },
    "& table th:nth-child(2)": {
      position: "sticky",
      left: "3rem",
      zIndex: 2,
      background: getThemedColor("neutral", 200),
      padding: 0
    },
    "& table td:nth-child(2)": {
      position: "sticky",
      left: "3rem",
      zIndex: 2,
      background: getThemedColor("neutral", 100),
      padding: 0,
      transition: "background-color 0.15s ease-in-out"
    },
    "& table tbody tr:hover td:nth-child(2), & table tbody tr:hover td:first-child, & table tbody tr[aria-selected='true'] td:nth-child(2), & table tbody tr[aria-selected='true'] td:first-child":
      {
        background: getThemedColor("primary", 100)
      },
    "& table th:nth-child(2) > div, & table td:nth-child(2) div": {
      position: "relative",
      padding: "0.75rem",
      display: "flex",
      alignItems: "center",
      height: "100%",
      ...(isStickyActive && {
        borderRight: `1px solid ${getThemedColor("neutral", 400)}`
      })
    }
  });

  useEffect(() => {
    const container = tableContainerRef.current?.children[0]?.children[0];
    if (container == null) return;
    const handleScroll = () => {
      setIsStickyActive(container.scrollLeft > 0);
    };
    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <PageContent className="bg-theme-neutral-100">
      <PageItem
        title={t("Polygons")}
        flexProps={{ width: "100%" }}
        buttonProps={{
          variant: "secondary",
          size: "small",
          children: t("Download All"),
          leftIcon: <DownloadIcon />
        }}
        multiActionButtonProps={{
          mainActionLabel: t("Add"),
          size: "small",
          leftIcon: <PlusIcon />,
          mainActionOnClick: () => {},
          otherActions: [
            {
              label: t("Save as Draft"),
              onClick: () => {},
              value: "draft"
            },
            {
              label: t("Save and Close"),
              onClick: () => {},
              value: "save-close"
            }
          ],
          variant: "primary"
        }}
      >
        <PolygonToolbar
          resultCount={polygonRows.length}
          polygonSearch={polygonSearch}
          polygonFilters={polygonFilters}
          activeFilterLabels={activeFilterLabels}
          onSearchChange={setPolygonSearch}
          onApplyFilters={setPolygonFilters}
          onClearFilters={handleClearPolygonFilters}
        />
      </PageItem>
      <ResizeBox initialHeight={100} minHeight={100} maxHeight={600}>
        <PolygonsMap
          entityModel={site}
          type="sites"
          className="max-h-full overflow-hidden !rounded-[0.25rem_0.25rem_0_0]"
          polygonsDataOverride={polygonsData}
          polygonTableHighlight={polygonTableHighlight}
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
        {polygonsWithOverlapCount > 0 && (
          <InlineMessage
            actionLabel={t("Selected Polygons")}
            isButtonRight
            size="small"
            label={
              polygonsWithOverlapCount === 1
                ? t("1 overlap detected")
                : t("{count} overlaps detected", { count: polygonsWithOverlapCount })
            }
            onActionClick={() => {
              setPolygonFilters(current => ({ ...current, hasOverlap: true }));
            }}
            variant="error"
          />
        )}
      </Flex>
      <Box onMouseLeave={handleClearHover}>
        <Table<PolygonTableRow>
          css={getPolygonsTableStyles(isStickyActive)}
          containerRef={tableContainerRef}
          data={polygonRows}
          columns={columns}
          showPagination
          pageSize={10}
          selectable
          selectedRows={selectedRows}
          onAllItemsSelected={onAllItemsSelected}
          renderRow={selectableRenderRow}
        />
      </Box>
    </PageContent>
  );
};

export default SitePolygonsTab;
