import { useT } from "@transifex/react";
import { useEffect, useMemo, useState } from "react";

import { ModalId } from "@/components/extensive/Modal/ModalConst";
import { useModalContext } from "@/context/modal.provider";
import { useMonitoredDataContext } from "@/context/monitoredData.provider";
import { useNotificationContext } from "@/context/notification.provider";
import {
  fetchGetV2IndicatorsEntityUuidSlugVerify,
  fetchGetV2ProjectsUUIDSitePolygonsAll,
  fetchGetV2SitesSitePolygon,
  useGetV2IndicatorsEntityUuid,
  useGetV2IndicatorsEntityUuidSlug,
  useGetV2IndicatorsEntityUuidSlugVerify,
  usePostV2IndicatorsSlug
} from "@/generated/apiComponents";
import { IndicatorPolygonsStatus, Indicators } from "@/generated/apiSchemas";
import { EntityName } from "@/types/common";

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
  const t = useT();
  const { searchTerm, indicatorSlug, setLoadingAnalysis, setIndicatorSlugAnalysis } = useMonitoredDataContext();
  const { modalOpened } = useModalContext();
  const [isLoadingVerify, setIsLoadingVerify] = useState<boolean>(false);
  const [isLoadingRerunVerify, setIsLoadingRerunVerify] = useState<boolean>(false);
  const { openNotification } = useNotificationContext();
  const [treeCoverLossData, setTreeCoverLossData] = useState<Indicators[]>([]);
  const [polygonOptions, setPolygonOptions] = useState<PolygonOption[]>([{ title: "All Polygons", value: "0" }]);
  const [treeCoverLossFiresData, setTreeCoverLossFiresData] = useState<Indicators[]>([]);
  const [analysisToSlug, setAnalysisToSlug] = useState<any>({
    treeCoverLoss: [],
    treeCoverLossFires: [],
    restorationByEcoRegion: [],
    restorationByStrategy: [],
    restorationByLandUse: []
  });
  const [rerunAnalysisToSlug, setRerunAnalysisToSlug] = useState<any>({
    treeCoverLoss: [],
    treeCoverLossFires: [],
    restorationByEcoRegion: [],
    restorationByStrategy: [],
    restorationByLandUse: []
  });
  const [dropdownAnalysisOptions, setDropdownAnalysisOptions] = useState(DROPDOWN_OPTIONS);
  const [rerunDropdownOptions, setRerunDropdownOptions] = useState(DROPDOWN_OPTIONS);
  const [totalPolygonsForRerun, setTotalPolygonsForRerun] = useState<number>(0);

  const {
    data: indicatorData,
    refetch: refetchDataIndicators,
    isLoading: isLoadingIndicator
  } = useGetV2IndicatorsEntityUuidSlug(
    {
      pathParams: {
        entity: entity!,
        uuid: entity_uuid!,
        slug: indicatorSlug!
      }
    },
    {
      enabled: !!indicatorSlug && !!entity_uuid
    }
  );

  const getComplementarySlug = (slug: string) => (slug === "treeCoverLoss" ? "treeCoverLossFires" : "treeCoverLoss");

  const { data: complementaryData } = useGetV2IndicatorsEntityUuidSlug(
    {
      pathParams: {
        entity: entity!,
        uuid: entity_uuid!,
        slug: getComplementarySlug(indicatorSlug || "")
      }
    },
    {
      enabled: (indicatorSlug === "treeCoverLoss" || indicatorSlug === "treeCoverLossFires") && !!entity_uuid
    }
  );

  useEffect(() => {
    if (indicatorSlug === "treeCoverLoss") {
      setTreeCoverLossData(indicatorData || []);
      setTreeCoverLossFiresData(complementaryData || []);
    } else if (indicatorSlug === "treeCoverLossFires") {
      setTreeCoverLossFiresData(indicatorData || []);
      setTreeCoverLossData(complementaryData || []);
    }
  }, [indicatorData, complementaryData, indicatorSlug]);

  const { mutate, isLoading } = usePostV2IndicatorsSlug({
    onSuccess: () => {
      openNotification(
        "success",
        t("Success! Analysis completed."),
        t("The analysis has been completed successfully.")
      );
      refetchDataIndicators();
      setLoadingAnalysis?.(false);
      setIndicatorSlugAnalysis?.("treeCoverLoss");
    },
    onError: () => {
      openNotification("error", t("Error! Analysis failed."), t("The analysis has failed. Please try again."));
      refetchDataIndicators();
      setLoadingAnalysis?.(false);
      setIndicatorSlugAnalysis?.("treeCoverLoss");
    }
  });

  const { data: indicatorPolygonsStatus } = useGetV2IndicatorsEntityUuid<IndicatorPolygonsStatus>(
    {
      pathParams: {
        entity: entity!,
        uuid: entity_uuid!
      }
    },
    {
      enabled: !!entity_uuid
    }
  );

  const filteredPolygons = useMemo(() => {
    if (!indicatorData) return [];

    return indicatorData
      .filter(
        (polygon: Indicators) =>
          polygon?.poly_name?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
          polygon?.site_name?.toLowerCase().includes(searchTerm?.toLowerCase())
      )
      .sort((a, b) => (a.poly_name || "").localeCompare(b.poly_name || ""));
  }, [indicatorData, searchTerm]);

  useEffect(() => {
    if (!indicatorData) return;

    const options = [
      { title: "All Polygons", value: "0" },
      ...indicatorData
        .map((item: any) => ({
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

  useEffect(() => {
    const fetchRerunData = async () => {
      if (!entity || !entity_uuid || !indicatorPolygonsStatus) return;

      setIsLoadingRerunVerify(true);

      const approvedPolygons = indicatorPolygonsStatus.approved || 0;
      setTotalPolygonsForRerun(approvedPolygons);

      if (approvedPolygons === 0) {
        const updateRerunDropdownOptions = () => {
          return DROPDOWN_OPTIONS.map(option => {
            return {
              ...option,
              title: `${option.title} (0 polygons available for rerun)`
            };
          });
        };
        setRerunAnalysisToSlug({});
        setRerunDropdownOptions(updateRerunDropdownOptions);
        setIsLoadingRerunVerify(false);
        return;
      }

      try {
        let polygonUuids: string[] = [];

        if (entity === "projects") {
          const response = await fetchGetV2ProjectsUUIDSitePolygonsAll({
            pathParams: { uuid: entity_uuid }
          });
          polygonUuids = response.map((polygon: any) => polygon.uuid).filter(Boolean) || [];
        } else if (entity === "sites") {
          const response = await fetchGetV2SitesSitePolygon({
            pathParams: { site: entity_uuid }
          });
          polygonUuids = response.map((polygon: any) => polygon.poly_id).filter(Boolean) || [];
        }

        const rerunSlugToAnalysis = SLUGS_INDICATORS.reduce<Record<string, any>>((acc, slug) => {
          acc[slug] = polygonUuids;
          return acc;
        }, {});

        const updateRerunDropdownOptions = () => {
          return DROPDOWN_OPTIONS.map(option => {
            return {
              ...option,
              title: `${option.title} (${polygonUuids.length} polygons available for rerun)`
            };
          });
        };

        setRerunAnalysisToSlug(rerunSlugToAnalysis);
        setRerunDropdownOptions(updateRerunDropdownOptions);
      } catch (error) {
        console.error("Error fetching polygon data for rerun:", error);
        const updateRerunDropdownOptions = () => {
          return DROPDOWN_OPTIONS.map(option => {
            return {
              ...option,
              title: `${option.title} (${approvedPolygons} polygons available for rerun)`
            };
          });
        };
        setRerunDropdownOptions(updateRerunDropdownOptions);
      }

      setIsLoadingRerunVerify(false);
    };

    if (modalOpened(ModalId.MODAL_RUN_ANALYSIS)) {
      fetchRerunData();
    }
  }, [entity, entity_uuid, indicatorPolygonsStatus, modalOpened]);

  return {
    polygonsIndicator: filteredPolygons,
    polygonOptions,
    indicatorPolygonsStatus,
    headerBarPolygonStatus,
    totalPolygonsStatus: totalPolygonsApproved,
    runAnalysisIndicator: mutate,
    loadingAnalysis: isLoading,
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
