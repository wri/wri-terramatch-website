import { useEffect, useMemo, useState } from "react";

import { ModalId } from "@/components/extensive/Modal/ModalConst";
import { startIndicatorCalculationResource } from "@/connections/Indicators";
import { Indicator, useAllSitePolygons } from "@/connections/SitePolygons";
import { useModalContext } from "@/context/modal.provider";
import { useMonitoredDataContext } from "@/context/monitoredData.provider";
import {
  fetchGetV2IndicatorsEntityUuidSlugVerify,
  useGetV2IndicatorsEntityUuidSlugVerify
} from "@/generated/apiComponents";
import { Indicators } from "@/generated/apiSchemas";
import { StartIndicatorCalculationPathParams } from "@/generated/v3/researchService/researchServiceComponents";
import { IndicatorsAttributes } from "@/generated/v3/researchService/researchServiceSchemas";
import { EntityName } from "@/types/common";
import Log from "@/utils/log";
import { transformSitePolygonsToIndicators } from "@/utils/MonitoredIndicatorUtils";

type IndicatorsWithPolyId = Indicators & {
  poly_id?: string;
  site_id?: string;
};

const dataPolygonOverview = [
  {
    status: "Draft",
    status_key: "draft",
    count: 12.5,
    color: "bg-grey-200"
  },
  {
    status: "Submitted",
    status_key: "submitted",
    count: 42.5
  },
  {
    status: "Needs Info",
    status_key: "needs-more-information",
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
  submitted: number;
  "needs-more-information": number;
  approved: number;
};

interface PolygonOption {
  title: string;
  value: string;
}

export const useMonitoredData = (entity?: EntityName, entity_uuid?: string) => {
  const { searchTerm, indicatorSlug, loadingAnalysis } = useMonitoredDataContext();
  const { modalOpened } = useModalContext();
  const [isLoadingVerify, setIsLoadingVerify] = useState<boolean>(false);
  const [isLoadingRerunVerify, setIsLoadingRerunVerify] = useState<boolean>(false);
  const [treeCoverLossData, setTreeCoverLossData] = useState<Indicators[]>([]);
  const [polygonOptions, setPolygonOptions] = useState<PolygonOption[]>([{ title: "All Polygons", value: "0" }]);
  const [treeCoverLossFiresData, setTreeCoverLossFiresData] = useState<Indicators[]>([]);
  const [analysisToSlug, setAnalysisToSlug] = useState<
    Record<string, string[] | Record<string, string> | { message?: string }>
  >({
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

  const { data: sitePolygonsData, isLoading: isLoadingSitePolygons } = useAllSitePolygons({
    entityName: entity as "sites" | "projects",
    entityUuid: entity_uuid!,
    enabled: !!entity_uuid && !!entity
  });

  const [sitePolygonsApprovedData, indicatorPolygonsStatus] = useMemo(() => {
    const polygonStatuses = ["draft", "submitted", "needs-more-information", "approved"];
    const polygonStatusCount = [0, 0, 0, 0];
    if (sitePolygonsData.length > 0 && !isLoadingSitePolygons) {
      sitePolygonsData.forEach(polygon => {
        const statusIndex = polygonStatuses.indexOf(polygon.status);
        polygonStatusCount[statusIndex]++;
      });
    }
    const sitePolygonsApprovedData = sitePolygonsData?.filter(polygon => polygon.status === "approved");
    const indicatorPolygonsStatus = Object.fromEntries(
      polygonStatuses.map((status, index) => [status, polygonStatusCount[index]])
    );
    return [sitePolygonsApprovedData, indicatorPolygonsStatus];
  }, [sitePolygonsData, isLoadingSitePolygons]);

  const getComplementarySlug = (slug: string): Indicator | undefined =>
    slug === "treeCoverLoss" ? "treeCoverLossFires" : slug === "treeCoverLossFires" ? "treeCoverLoss" : undefined;

  const complementarySlug = getComplementarySlug(indicatorSlug || "");
  const { data: complementarySitePolygonsData, isLoading: isLoadingComplementary } = useAllSitePolygons({
    entityName: entity as "sites" | "projects",
    entityUuid: entity_uuid!,
    enabled:
      (indicatorSlug === "treeCoverLoss" || indicatorSlug === "treeCoverLossFires") &&
      !!entity_uuid &&
      !!entity &&
      !!complementarySlug,
    filter: {
      "presentIndicator[]": complementarySlug ? [complementarySlug] : undefined,
      "polygonStatus[]": ["approved"]
    }
  });

  const indicatorData = useMemo(() => {
    if (!sitePolygonsApprovedData || !indicatorSlug) return [];
    return transformSitePolygonsToIndicators(sitePolygonsApprovedData, indicatorSlug as Indicator);
  }, [sitePolygonsApprovedData, indicatorSlug]);

  const complementaryData = useMemo(() => {
    if (!complementarySitePolygonsData || !complementarySlug) return [];
    return transformSitePolygonsToIndicators(complementarySitePolygonsData, complementarySlug);
  }, [complementarySitePolygonsData, complementarySlug]);

  const isLoadingIndicator = isLoadingSitePolygons || isLoadingComplementary;

  useEffect(() => {
    if (indicatorSlug === "treeCoverLoss") {
      setTreeCoverLossData(indicatorData || []);
      setTreeCoverLossFiresData(complementaryData || []);
    } else if (indicatorSlug === "treeCoverLossFires") {
      setTreeCoverLossFiresData(indicatorData || []);
      setTreeCoverLossData(complementaryData || []);
    }
  }, [indicatorData, complementaryData, indicatorSlug]);

  const mutate = async (params: {
    slug?: StartIndicatorCalculationPathParams["slug"];
    body?: IndicatorsAttributes;
  }) => {
    const slug = (params.slug || indicatorSlug || "treeCoverLoss") as StartIndicatorCalculationPathParams["slug"];
    const body = params.body || { polygonUuids: [], forceRecalculation: false, updateExisting: false };
    return startIndicatorCalculationResource({ slug, body });
  };

  const filteredPolygons = useMemo(() => {
    if (!indicatorData) return [];

    return indicatorData
      .filter(
        (polygon: Indicators) =>
          polygon?.status === "approved" &&
          (polygon?.poly_name?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
            polygon?.site_name?.toLowerCase().includes(searchTerm?.toLowerCase()))
      )
      .sort((a, b) => (a.poly_name || "").localeCompare(b.poly_name || ""));
  }, [indicatorData, searchTerm]);

  useEffect(() => {
    if (!indicatorData) return;

    const options = [
      { title: "All Polygons", value: "0" },
      ...indicatorData
        .filter((item: IndicatorsWithPolyId) => item.status === "approved")
        .map((item: IndicatorsWithPolyId) => ({
          title: item.poly_name || "",
          value: item.poly_id || ""
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

  const totalPolygonsApproved = headerBarPolygonStatus.find(item => item.status_key === "approved")?.count;

  const { data: dataToMissingPolygonVerify } = useGetV2IndicatorsEntityUuidSlugVerify(
    {
      pathParams: {
        entity: entity!,
        uuid: entity_uuid!,
        slug: indicatorSlug!
      }
    },
    {
      enabled: !!indicatorSlug
    }
  );

  // @ts-ignore
  const polygonMissingAnalysis = dataToMissingPolygonVerify?.message
    ? totalPolygonsApproved
    : totalPolygonsApproved! - Object?.keys(dataToMissingPolygonVerify ?? {})?.length;

  useEffect(() => {
    const verifySlug = async (slug: string) =>
      fetchGetV2IndicatorsEntityUuidSlugVerify({
        pathParams: {
          entity: entity!,
          uuid: entity_uuid!,
          slug: slug!
        }
      });

    const fetchSlugs = async () => {
      setIsLoadingVerify(true);
      const slugVerify = await Promise.all(SLUGS_INDICATORS.map(verifySlug));
      const slugToAnalysis = SLUGS_INDICATORS.reduce<Record<string, any>>((acc, slug, index) => {
        acc[slug] = slugVerify[index];
        return acc;
      }, {});
      const updateTitleDropdownOptions = () => {
        return DROPDOWN_OPTIONS.map(option => {
          if (slugToAnalysis[`${option.slug}`]?.message) {
            return {
              ...option,
              title: `${option.title} (0 polygons not run)`
            };
          }
          if (!slugToAnalysis[`${option.slug}`]) {
            return option;
          }
          return {
            ...option,
            title: `${option.title} (${Object?.keys(slugToAnalysis[`${option.slug}`]).length} polygons not run)`
          };
        });
      };
      setAnalysisToSlug(slugToAnalysis);
      setDropdownAnalysisOptions(updateTitleDropdownOptions);
      setIsLoadingVerify(false);
    };
    if (modalOpened(ModalId.MODAL_RUN_ANALYSIS)) {
      fetchSlugs();
    }
  }, [entity, entity_uuid, modalOpened]);

  const { data: allPolygonsData, isLoading: isLoadingPolygons } = useAllSitePolygons({
    entityName: entity as "sites" | "projects",
    entityUuid: entity_uuid!,
    enabled: entity != null && entity_uuid != null && modalOpened(ModalId.MODAL_RUN_ANALYSIS),
    filter: {
      "polygonStatus[]": ["approved"]
    }
  });

  useEffect(() => {
    const processRerunData = () => {
      if (entity == null || entity_uuid == null || indicatorPolygonsStatus == null) return;

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

      if (!allPolygonsData || allPolygonsData.length === 0) {
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
        const polygonUuids = allPolygonsData.map(polygon => polygon.polygonUuid).filter(Boolean) as string[];

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
        Log.error("Error processing polygon data for rerun:", error);
        const updateRerunDropdownOptions = () =>
          DROPDOWN_OPTIONS.map(option => ({
            ...option,
            title: `${option.title} (${approvedPolygons} polygons available for rerun)`
          }));
        setRerunDropdownOptions(updateRerunDropdownOptions);
      }

      setIsLoadingRerunVerify(false);
    };

    if (modalOpened(ModalId.MODAL_RUN_ANALYSIS) && !isLoadingPolygons) {
      processRerunData();
    }
  }, [entity, entity_uuid, indicatorPolygonsStatus, modalOpened, allPolygonsData, isLoadingPolygons]);

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
    polygonMissingAnalysis,
    treeCoverLossData,
    treeCoverLossFiresData,
    totalPolygonsForRerun
  };
};
