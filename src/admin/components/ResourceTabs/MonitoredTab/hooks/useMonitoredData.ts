import { useEffect, useMemo, useRef, useState } from "react";

import { ModalId } from "@/components/extensive/Modal/ModalConst";
import { startIndicatorCalculationResource } from "@/connections/Indicators";
import { Indicator, loadSitePolygons, useSitePolygonSummary } from "@/connections/SitePolygons";
import { POLYGON_INFORMATION_REQUIRED, POLYGON_PENDING_APPROVAL } from "@/constants/polygonStatuses";
import { useModalContext } from "@/context/modal.provider";
import { useMonitoredDataContext } from "@/context/monitoredData.provider";
import { StartIndicatorCalculationPathParams } from "@/generated/v3/researchService/researchServiceComponents";
import { IndicatorsAttributes, SitePolygonLightDto } from "@/generated/v3/researchService/researchServiceSchemas";
import { EntityName } from "@/types/common";
import Log from "@/utils/log";
import { transformSitePolygonsToIndicators } from "@/utils/MonitoredIndicatorUtils";

export type MonitoredIndicator = {
  polygonName?: string;
  status?: SitePolygonLightDto["status"];
  plantStart?: string;
  siteName?: string;
  indicatorSlug: Indicator;
  yearOfAnalysis?: number;
  createdAt?: string;
  polygonUuid?: string;
  siteId?: string;
  data?: Record<string, number>;
};

const dataPolygonOverview = [
  {
    status: "Draft",
    status_key: "draft",
    count: 12.5,
    color: "bg-grey-200"
  },
  {
    status: "Pending Approval",
    status_key: POLYGON_PENDING_APPROVAL,
    count: 42.5
  },
  {
    status: "Information Required",
    status_key: POLYGON_INFORMATION_REQUIRED,
    count: 22.5
  },
  {
    status: "Approved",
    status_key: "approved",
    count: 22.5
  }
];

const DROPDOWN_OPTIONS = [
  {
    title: "Tree Cover (TTC)",
    value: "0",
    slug: "treeCover"
  },
  {
    title: "Tree Cover Loss",
    value: "1",
    slug: "treeCoverLoss"
  },
  {
    title: "Tree Cover Loss from Fire",
    value: "2",
    slug: "treeCoverLossFires"
  },
  {
    title: "Hectares Under Restoration By WWF EcoRegion",
    value: "3",
    slug: "restorationByEcoRegion"
  },
  {
    title: "Hectares Under Restoration By Strategy",
    value: "4",
    slug: "restorationByStrategy"
  },
  {
    title: "Hectares Under Restoration By Target Land Use System",
    value: "5",
    slug: "restorationByLandUse"
  }
];

const SLUGS_INDICATORS = [
  "treeCoverLoss",
  "treeCoverLossFires",
  "restorationByEcoRegion",
  "restorationByStrategy",
  "restorationByLandUse"
];

type InterfaceIndicatorPolygonsStatus = {
  draft: number;
  "pending-approval": number;
  "information-required": number;
  approved: number;
};

interface PolygonOption {
  title: string;
  value: string;
}

const PAGE_SIZE = 100;

type IndicatorSummaryShape = {
  polygonsWithLoss?: number;
  polygonsNoLoss?: number;
  polygonsWithIndicator?: number;
  polygonsMissing?: number;
  sumByYear?: Record<string, number>;
  sumByBucket?: Record<string, number>;
};

const getSummaryIndicator = (summary: unknown, slug: string): IndicatorSummaryShape | undefined => {
  if (summary == null || typeof summary !== "object") {
    return undefined;
  }
  const indicators = (summary as { indicators?: Record<string, unknown> }).indicators;
  if (indicators == null || typeof indicators !== "object") {
    return undefined;
  }
  const indicator = indicators[slug];
  if (indicator == null || typeof indicator !== "object") {
    return undefined;
  }
  return indicator as IndicatorSummaryShape;
};

const loadAllPolygonUuidsByFilter = async ({
  entityName,
  entityUuid,
  filter
}: {
  entityName: "sites" | "projects";
  entityUuid: string;
  filter: Record<string, unknown>;
}): Promise<string[]> => {
  let pageNumber = 1;
  let hasMorePages = true;
  const polygonUuids: string[] = [];

  while (hasMorePages) {
    const response = await loadSitePolygons({
      entityName,
      entityUuid,
      enabled: true,
      filter,
      pageNumber,
      pageSize: PAGE_SIZE,
      sortField: "createdAt",
      sortDirection: "ASC"
    });
    if (response.loadFailure != null) {
      throw response.loadFailure;
    }

    const pageData = response.data ?? [];
    pageData.forEach(polygon => {
      const polygonUuid = polygon.polygonUuid;
      if (polygonUuid != null && polygonUuid !== "") {
        polygonUuids.push(polygonUuid);
      }
    });

    const indexTotal = response.indexTotal ?? 0;
    hasMorePages = pageNumber * PAGE_SIZE < indexTotal;
    pageNumber += 1;
  }

  return Array.from(new Set(polygonUuids));
};

const loadApprovedIndicatorPolygons = async ({
  entityName,
  entityUuid,
  indicatorSlug
}: {
  entityName: "sites" | "projects";
  entityUuid: string;
  indicatorSlug: Indicator;
}) => {
  let pageNumber = 1;
  let hasMorePages = true;
  const polygons: SitePolygonLightDto[] = [];

  while (hasMorePages) {
    const response = await loadSitePolygons({
      entityName,
      entityUuid,
      enabled: true,
      filter: {
        "presentIndicator[]": [indicatorSlug],
        "polygonStatus[]": ["approved"]
      },
      pageNumber,
      pageSize: PAGE_SIZE,
      sortField: "createdAt",
      sortDirection: "ASC"
    });
    if (response.loadFailure != null) {
      throw response.loadFailure;
    }

    const pageData = response.data ?? [];
    polygons.push(...pageData);
    const indexTotal = response.indexTotal ?? 0;
    hasMorePages = pageNumber * PAGE_SIZE < indexTotal;
    pageNumber += 1;
  }

  return polygons;
};

export const useMonitoredData = (entity?: EntityName, entity_uuid?: string) => {
  const { searchTerm, indicatorSlug, loadingAnalysis } = useMonitoredDataContext();
  const { modalOpened } = useModalContext();
  const wasLoadingAnalysis = useRef(false);
  const [refreshNonce, setRefreshNonce] = useState(0);
  const [isLoadingVerify, setIsLoadingVerify] = useState<boolean>(false);
  const [isLoadingRerunVerify, setIsLoadingRerunVerify] = useState<boolean>(false);
  const [isLoadingIndicatorData, setIsLoadingIndicatorData] = useState(false);
  const [indicatorPolygonsData, setIndicatorPolygonsData] = useState<SitePolygonLightDto[]>([]);
  const [complementaryPolygonsData, setComplementaryPolygonsData] = useState<SitePolygonLightDto[]>([]);
  const [polygonOptions, setPolygonOptions] = useState<PolygonOption[]>([{ title: "All Polygons", value: "0" }]);
  const [analysisToSlug, setAnalysisToSlug] = useState<Record<string, string[] | { message?: string }>>({
    treeCoverLoss: {},
    treeCoverLossFires: {},
    restorationByEcoRegion: {},
    restorationByStrategy: {},
    restorationByLandUse: {}
  });
  const [rerunAnalysisToSlug, setRerunAnalysisToSlug] = useState<Record<string, string[]>>({
    treeCoverLoss: [],
    treeCoverLossFires: [],
    restorationByEcoRegion: [],
    restorationByStrategy: [],
    restorationByLandUse: []
  });
  const [dropdownAnalysisOptions, setDropdownAnalysisOptions] = useState(DROPDOWN_OPTIONS);
  const [rerunDropdownOptions, setRerunDropdownOptions] = useState(DROPDOWN_OPTIONS);
  const [totalPolygonsForRerun, setTotalPolygonsForRerun] = useState<number>(0);
  const [allApprovedPolygonUuids, setAllApprovedPolygonUuids] = useState<string[]>([]);
  const entityName = entity as "sites" | "projects";
  const hasEntityScope = entity != null && entity_uuid != null && entity_uuid !== "";

  const [, { data: baseSummaryData }] = useSitePolygonSummary({
    entityName,
    entityUuid: entity_uuid ?? "",
    enabled: hasEntityScope
  });

  const summaryIndicatorSlugs = useMemo(() => {
    if (indicatorSlug == null || indicatorSlug === "") {
      return SLUGS_INDICATORS;
    }
    if (indicatorSlug === "treeCoverLoss" || indicatorSlug === "treeCoverLossFires") {
      return ["treeCoverLoss", "treeCoverLossFires"] as const;
    }
    return [indicatorSlug];
  }, [indicatorSlug]);

  const [, { data: approvedSummaryData }] = useSitePolygonSummary({
    entityName,
    entityUuid: entity_uuid ?? "",
    enabled: hasEntityScope,
    filter: {
      "polygonStatus[]": ["approved"],
      "indicatorSlug[]": summaryIndicatorSlugs as Array<
        | "treeCoverLoss"
        | "treeCoverLossFires"
        | "restorationByEcoRegion"
        | "restorationByStrategy"
        | "restorationByLandUse"
      >
    }
  });

  const indicatorPolygonsStatus = useMemo<InterfaceIndicatorPolygonsStatus>(() => {
    const countByStatus = baseSummaryData?.countByStatus;
    return {
      draft: countByStatus?.draft ?? 0,
      "pending-approval": countByStatus?.["pending-approval"] ?? 0,
      "information-required": countByStatus?.["information-required"] ?? 0,
      approved: countByStatus?.approved ?? 0
    };
  }, [baseSummaryData]);

  useEffect(() => {
    if (wasLoadingAnalysis.current && !loadingAnalysis) {
      setRefreshNonce(prev => prev + 1);
    }
    wasLoadingAnalysis.current = loadingAnalysis === true;
  }, [loadingAnalysis]);

  const getComplementarySlug = (slug: string): Indicator | undefined =>
    slug === "treeCoverLoss" ? "treeCoverLossFires" : slug === "treeCoverLossFires" ? "treeCoverLoss" : undefined;

  const complementarySlug = getComplementarySlug(indicatorSlug ?? "");

  useEffect(() => {
    if (!hasEntityScope || indicatorSlug == null || indicatorSlug === "") {
      setIndicatorPolygonsData([]);
      setComplementaryPolygonsData([]);
      setIsLoadingIndicatorData(false);
      return;
    }

    const currentIndicator = indicatorSlug as Indicator;
    let cancelled = false;
    const loadIndicatorData = async () => {
      try {
        setIsLoadingIndicatorData(true);
        const baseData = await loadApprovedIndicatorPolygons({
          entityName,
          entityUuid: entity_uuid!,
          indicatorSlug: currentIndicator
        });
        if (!cancelled) {
          setIndicatorPolygonsData(baseData);
        }

        if (
          !cancelled &&
          complementarySlug != null &&
          (currentIndicator === "treeCoverLoss" || currentIndicator === "treeCoverLossFires")
        ) {
          const pairedData = await loadApprovedIndicatorPolygons({
            entityName,
            entityUuid: entity_uuid!,
            indicatorSlug: complementarySlug
          });
          if (!cancelled) {
            setComplementaryPolygonsData(pairedData);
          }
        } else if (!cancelled) {
          setComplementaryPolygonsData([]);
        }
      } catch (error) {
        Log.error("Error loading monitored indicator polygon data:", error);
        if (!cancelled) {
          setIndicatorPolygonsData([]);
          setComplementaryPolygonsData([]);
        }
      } finally {
        if (!cancelled) {
          setIsLoadingIndicatorData(false);
        }
      }
    };

    void loadIndicatorData();
    return () => {
      cancelled = true;
    };
  }, [complementarySlug, entityName, entity_uuid, hasEntityScope, indicatorSlug, refreshNonce]);

  const indicatorData = useMemo(() => {
    if (indicatorSlug == null || indicatorSlug === "") return [];
    return transformSitePolygonsToIndicators(indicatorPolygonsData, indicatorSlug as Indicator);
  }, [indicatorPolygonsData, indicatorSlug]);

  const complementaryData = useMemo(() => {
    if (complementarySlug == null) return [];
    return transformSitePolygonsToIndicators(complementaryPolygonsData, complementarySlug);
  }, [complementaryPolygonsData, complementarySlug]);

  const [treeCoverLossData, treeCoverLossFiresData] = useMemo(() => {
    if (indicatorSlug === "treeCoverLoss") {
      return [indicatorData, complementaryData];
    }
    if (indicatorSlug === "treeCoverLossFires") {
      return [complementaryData, indicatorData];
    }
    if (indicatorSlug === "treeCover") {
      return [indicatorData, complementaryData];
    }
    return [[], []];
  }, [complementaryData, indicatorData, indicatorSlug]);

  const isLoadingIndicator = isLoadingIndicatorData;

  const mutate = async (params: {
    slug?: StartIndicatorCalculationPathParams["slug"];
    body?: IndicatorsAttributes;
  }) => {
    const slug = (params.slug ?? indicatorSlug ?? "treeCoverLoss") as StartIndicatorCalculationPathParams["slug"];
    const body = params.body ?? { polygonUuids: [], forceRecalculation: false, updateExisting: false };
    return startIndicatorCalculationResource({ slug, body });
  };

  const filteredPolygons = useMemo(() => {
    if (!indicatorData) return [];

    return indicatorData
      .filter(
        (polygon: MonitoredIndicator) =>
          polygon?.status === "approved" &&
          (polygon?.polygonName?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
            polygon?.siteName?.toLowerCase().includes(searchTerm?.toLowerCase()))
      )
      .sort((a, b) => (a.polygonName ?? "").localeCompare(b.polygonName ?? ""));
  }, [indicatorData, searchTerm]);

  useEffect(() => {
    if (!indicatorData) return;

    const options = [
      { title: "All Polygons", value: "0" },
      ...indicatorData
        .filter((item: MonitoredIndicator) => item.status === "approved")
        .map((item: MonitoredIndicator) => ({
          title: item.polygonName ?? "",
          value: item.polygonUuid ?? ""
        }))
        .sort((a, b) => a.title.localeCompare(b.title))
    ];

    setPolygonOptions(options);
  }, [indicatorData]);

  const headerBarPolygonStatus = dataPolygonOverview.map(status => {
    const key = status.status_key as keyof InterfaceIndicatorPolygonsStatus;
    return {
      ...status,
      count: indicatorPolygonsStatus?.[key] ?? 0
    };
  });

  const totalPolygonsApproved = approvedSummaryData?.totalPolygons ?? indicatorPolygonsStatus.approved;
  const selectedSummaryIndicator =
    indicatorSlug != null && indicatorSlug !== "" ? getSummaryIndicator(approvedSummaryData, indicatorSlug) : undefined;

  const polygonsWithAnalysis = selectedSummaryIndicator?.polygonsWithIndicator ?? 0;

  useEffect(() => {
    const fetchSlugs = async () => {
      if (!hasEntityScope) {
        setIsLoadingVerify(false);
        return;
      }

      setIsLoadingVerify(true);

      try {
        const slugToAnalysis: Record<string, string[] | { message?: string }> = {};

        for (const slug of SLUGS_INDICATORS) {
          const summaryBySlug = getSummaryIndicator(approvedSummaryData, slug);
          const missingCount = summaryBySlug?.polygonsMissing ?? 0;
          if (missingCount === 0) {
            slugToAnalysis[slug] = { message: "No missing polygons" };
            continue;
          }

          try {
            const missingPolygonUuids = await loadAllPolygonUuidsByFilter({
              entityName,
              entityUuid: entity_uuid!,
              filter: {
                "polygonStatus[]": ["approved"],
                "missingIndicator[]": [slug as Indicator]
              }
            });
            slugToAnalysis[slug] =
              missingPolygonUuids.length > 0 ? missingPolygonUuids : { message: "No missing polygons" };
          } catch (error) {
            Log.error(`Error fetching missing polygons for indicator ${slug}:`, error);
            slugToAnalysis[slug] = { message: "Error fetching data" };
          }
        }

        const updateTitleDropdownOptions = () => {
          return DROPDOWN_OPTIONS.map(option => {
            const slugData = slugToAnalysis[`${option.slug}`];
            if (!Array.isArray(slugData) && slugData?.message != null) {
              return {
                ...option,
                title: `${option.title} (0 polygons not run)`
              };
            }
            if (!slugData) {
              return option;
            }
            return {
              ...option,
              title: `${option.title} (${Array.isArray(slugData) ? slugData.length : 0} polygons not run)`
            };
          });
        };
        setAnalysisToSlug(slugToAnalysis);
        setDropdownAnalysisOptions(updateTitleDropdownOptions);
      } catch (error) {
        Log.error("Error fetching missing polygons for indicators:", error);
      } finally {
        setIsLoadingVerify(false);
      }
    };

    if (modalOpened(ModalId.MODAL_RUN_ANALYSIS)) {
      void fetchSlugs();
    }
  }, [approvedSummaryData, entityName, entity_uuid, hasEntityScope, modalOpened]);

  useEffect(() => {
    const processRerunData = async () => {
      if (!hasEntityScope || indicatorPolygonsStatus == null) return;

      setIsLoadingRerunVerify(true);

      const approvedPolygons = indicatorPolygonsStatus.approved ?? 0;
      setTotalPolygonsForRerun(approvedPolygons);

      if (approvedPolygons === 0) {
        const updateRerunDropdownOptions = () =>
          DROPDOWN_OPTIONS.map(option => ({
            ...option,
            title: `${option.title} (0 polygons available for rerun)`
          }));
        setRerunAnalysisToSlug({});
        setRerunDropdownOptions(updateRerunDropdownOptions);
        setIsLoadingRerunVerify(false);
        return;
      }

      try {
        const polygonUuids =
          allApprovedPolygonUuids.length > 0
            ? allApprovedPolygonUuids
            : await loadAllPolygonUuidsByFilter({
                entityName,
                entityUuid: entity_uuid!,
                filter: {
                  "polygonStatus[]": ["approved"]
                }
              });
        setAllApprovedPolygonUuids(polygonUuids);

        const rerunSlugToAnalysis = SLUGS_INDICATORS.reduce<Record<string, string[]>>((acc, slug) => {
          acc[slug] = polygonUuids;
          return acc;
        }, {});

        const updateRerunDropdownOptions = () =>
          DROPDOWN_OPTIONS.map(option => ({
            ...option,
            title: `${option.title} (${polygonUuids.length} polygons available for rerun)`
          }));

        setRerunAnalysisToSlug(rerunSlugToAnalysis);
        setRerunDropdownOptions(updateRerunDropdownOptions);
      } catch (error) {
        Log.error("Error loading polygon UUIDs for rerun:", error);
        const updateRerunDropdownOptions = () =>
          DROPDOWN_OPTIONS.map(option => ({
            ...option,
            title: `${option.title} (${approvedPolygons} polygons available for rerun)`
          }));
        setRerunDropdownOptions(updateRerunDropdownOptions);
      }

      setIsLoadingRerunVerify(false);
    };

    if (modalOpened(ModalId.MODAL_RUN_ANALYSIS)) {
      void processRerunData();
    }
  }, [allApprovedPolygonUuids, entityName, entity_uuid, hasEntityScope, indicatorPolygonsStatus, modalOpened]);

  return {
    polygonsIndicator: filteredPolygons,
    polygonOptions,
    indicatorPolygonsStatus,
    headerBarPolygonStatus,
    totalPolygonsStatus: totalPolygonsApproved,
    runAnalysisIndicator: mutate,
    loadingAnalysis: loadingAnalysis,
    loadingVerify: isLoadingVerify,
    loadingRerunVerify: isLoadingRerunVerify,
    isLoadingIndicator,
    setIsLoadingVerify,
    dropdownAnalysisOptions,
    rerunDropdownOptions,
    analysisToSlug,
    rerunAnalysisToSlug,
    polygonMissingAnalysis: polygonsWithAnalysis,
    treeCoverLossData,
    treeCoverLossFiresData,
    totalPolygonsForRerun
  };
};
