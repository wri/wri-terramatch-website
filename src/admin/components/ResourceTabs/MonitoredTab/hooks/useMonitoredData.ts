import { useT } from "@transifex/react";
import { useEffect, useMemo, useState } from "react";

import { ModalId } from "@/components/extensive/Modal/ModalConst";
import { useModalContext } from "@/context/modal.provider";
import { useMonitoredDataContext } from "@/context/monitoredData.provider";
import { useNotificationContext } from "@/context/notification.provider";
import {
  fetchGetV2IndicatorsEntityUuidSlugVerify,
  useGetV2IndicatorsEntityUuid,
  useGetV2IndicatorsEntityUuidSlug,
  useGetV2IndicatorsEntityUuidSlugVerify,
  usePostV2IndicatorsSlug
} from "@/generated/apiComponents";
import { IndicatorPolygonsStatus, Indicators } from "@/generated/apiSchemas";
import { sitePolygonsIndex } from "@/generated/v3/researchService/researchServiceComponents";
import { useValueChanged } from "@/hooks/useValueChanged";
import { EntityName } from "@/types/common";
import { processTreeCoverData } from "@/utils/MonitoredIndicatorUtils";

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

// Delete mock data when research Service API get correct data
const MOCK_TREE_COVER_API_RESPONSE = {
  meta: {
    type: "sitePolygons",
    page: {
      total: 5,
      cursor: "cursor-id-123"
    }
  },
  data: [
    {
      type: "sitePolygons",
      id: "poly-001",
      attributes: {
        name: "North Forest Zone",
        status: "active",
        siteId: "site-highland-restoration",
        geometry: {},
        plantStart: "2023-04-15T10:00:00.000Z",
        plantEnd: "2024-04-15T10:00:00.000Z",
        practice: "mixed native species",
        targetSys: "native forest",
        distr: "natural",
        numTrees: 12500,
        calcArea: 145.8,
        indicators: [
          {
            indicatorSlug: "treeCover",
            yearOfAnalysis: 2024,
            projectPhase: "Establishment",
            percentCover: 28.5,
            plusMinusPercent: 2.1
          },
          {
            indicatorSlug: "treeCoverLoss",
            yearOfAnalysis: 2024,
            value: {
              "2023": "0.3",
              "2024": "0.2"
            }
          }
        ],
        establishmentTreeSpecies: [
          {
            name: "Acacia binervia",
            amount: 4500
          },
          {
            name: "Eucalyptus globulus",
            amount: 8000
          }
        ]
      },
      meta: {
        page: {
          cursor: "cursor-item-1"
        }
      }
    },
    {
      type: "sitePolygons",
      id: "poly-002",
      attributes: {
        name: "South Valley Corridor",
        status: "active",
        siteId: "site-highland-restoration",
        geometry: {},
        plantStart: "2023-06-22T10:00:00.000Z",
        plantEnd: "2024-06-22T10:00:00.000Z",
        practice: "assisted regeneration",
        targetSys: "native forest",
        distr: "natural",
        numTrees: 7500,
        calcArea: 98.2,
        indicators: [
          {
            indicatorSlug: "treeCover",
            yearOfAnalysis: 2024,
            projectPhase: "Growth",
            percentCover: 34.7,
            plusMinusPercent: 1.8
          },
          {
            indicatorSlug: "restorationByEcoRegion",
            yearOfAnalysis: 2024,
            value: {
              "Northern Acacia-Commiphora bushlands and thickets": 0.104
            }
          }
        ],
        establishmentTreeSpecies: [
          {
            name: "Acacia binervia",
            amount: 3000
          },
          {
            name: "Eucalyptus globulus",
            amount: 4500
          }
        ]
      },
      meta: {
        page: {
          cursor: "cursor-item-2"
        }
      }
    },
    {
      type: "sitePolygons",
      id: "poly-003",
      attributes: {
        name: "Eastern Ridge",
        status: "planned",
        siteId: "site-coastal-regeneration",
        geometry: {},
        plantStart: "2024-03-10T10:00:00.000Z",
        plantEnd: "2025-03-10T10:00:00.000Z",
        practice: "direct seeding",
        targetSys: "agroforestry",
        distr: "planned",
        numTrees: 15000,
        calcArea: 210.5,
        indicators: [
          {
            indicatorSlug: "treeCover",
            yearOfAnalysis: 2023,
            projectPhase: "Planning",
            percentCover: 12.3,
            plusMinusPercent: 3.4
          },
          {
            indicatorSlug: "treeCount",
            yearOfAnalysis: 2023,
            surveyType: "satellite",
            surveyId: 125,
            treeCount: 3200,
            uncertaintyType: "standard deviation",
            imagerySource: "Planet",
            imageryId: "planet-123456",
            projectPhase: "Planning",
            confidence: 0.85
          }
        ],
        establishmentTreeSpecies: [
          {
            name: "Acacia binervia",
            amount: 7500
          },
          {
            name: "Eucalyptus globulus",
            amount: 7500
          }
        ]
      },
      meta: {
        page: {
          cursor: "cursor-item-3"
        }
      }
    },
    {
      type: "sitePolygons",
      id: "poly-004",
      attributes: {
        name: "Wetland Buffer Zone",
        status: "monitoring",
        siteId: "site-riverside-project",
        geometry: {},
        plantStart: "2022-09-01T10:00:00.000Z",
        plantEnd: "2023-09-01T10:00:00.000Z",
        practice: "mixed native species",
        targetSys: "mangrove",
        distr: "natural",
        numTrees: 6500,
        calcArea: 85.3,
        indicators: [
          {
            indicatorSlug: "treeCover",
            yearOfAnalysis: 2024,
            projectPhase: "Maturation",
            percentCover: 52.8,
            plusMinusPercent: 1.2
          },
          {
            indicatorSlug: "fieldMonitoring",
            yearOfAnalysis: 2024,
            treeCount: 5850,
            projectPhase: "Maturation",
            species: "mixed",
            survivalRate: 0.9
          }
        ],
        establishmentTreeSpecies: [
          {
            name: "Rhizophora mangle",
            amount: 6500
          }
        ]
      },
      meta: {
        page: {
          cursor: "cursor-item-4"
        }
      }
    },
    {
      type: "sitePolygons",
      id: "poly-005",
      attributes: {
        name: "Western Hillside",
        status: "active",
        siteId: "site-mountain-reforestation",
        geometry: {},
        plantStart: "2023-08-15T10:00:00.000Z",
        plantEnd: "2024-08-15T10:00:00.000Z",
        practice: "assisted regeneration",
        targetSys: "native forest",
        distr: "natural",
        numTrees: 10800,
        calcArea: 132.7,
        indicators: [
          {
            indicatorSlug: "treeCover",
            yearOfAnalysis: 2024,
            projectPhase: "Growth",
            percentCover: 18.9,
            plusMinusPercent: 2.6
          },
          {
            indicatorSlug: "msuCarbon",
            yearOfAnalysis: 2024,
            carbonOutput: 128.5,
            projectPhase: "Growth",
            confidence: 0.92
          }
        ],
        establishmentTreeSpecies: [
          {
            name: "Pinus sylvestris",
            amount: 5400
          },
          {
            name: "Quercus robur",
            amount: 5400
          }
        ]
      },
      meta: {
        page: {
          cursor: "cursor-item-5"
        }
      }
    }
  ]
};

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
  const [isLoadingTreeCover, setIsLoadingTreeCover] = useState<boolean>(false);
  const { openNotification } = useNotificationContext();
  const [treeCoverLossData, setTreeCoverLossData] = useState<Indicators[]>([]);
  const [polygonOptions, setPolygonOptions] = useState<PolygonOption[]>([{ title: "All Polygons", value: "0" }]);
  const [treeCoverLossFiresData, setTreeCoverLossFiresData] = useState<Indicators[]>([]);
  // The next two const were added for research service data, any type should change depending on API response
  const [sitePolygonEntityData, setSitePolygonEntityData] = useState<any[]>([]);
  const [treeCoverPolygonsData, setTreeCoverPolygonsData] = useState([]);
  const [analysisToSlug, setAnalysisToSlug] = useState<any>({
    treeCoverLoss: [],
    treeCoverLossFires: [],
    restorationByEcoRegion: [],
    restorationByStrategy: [],
    restorationByLandUse: []
  });
  const [dropdownAnalysisOptions, setDropdownAnalysisOptions] = useState(DROPDOWN_OPTIONS);

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

  // 1st attempt: Fetch tree cover data using sitePolygonsIndex (research service)
  const fetchTreeCoverData = async () => {
    if (!entity_uuid) return;

    setIsLoadingTreeCover(true);
    try {
      const response: any = await sitePolygonsIndex({
        queryParams: {
          ["page[size]"]: 100,
          ["projectId[]"]: [entity_uuid],
          includeTestProjects: false
        }
      });
      if (response && response.data) {
        setSitePolygonEntityData(response.data);
      }
    } catch (error) {
      console.error("Error fetching tree cover data:", error);
      openNotification(
        "error",
        t("Error fetching tree cover data"),
        t("Failed to fetch tree cover data. Please try again.")
      );
    } finally {
      setIsLoadingTreeCover(false);
    }
  };

  useValueChanged(entity_uuid, () => {
    if (entity_uuid) {
      fetchTreeCoverData();
    }
  });
  //  --------end of 1st attempt---------
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

  // Filter sitePolygonEntityData based on search term
  const filteredTreeCoverPolygons = useMemo(() => {
    if (!sitePolygonEntityData || sitePolygonEntityData.length === 0) return [];

    return sitePolygonEntityData
      .filter(item => {
        const polygonName = item.attributes?.name || "";
        const siteName = item.attributes?.site?.name || "";
        return (
          polygonName.toLowerCase().includes(searchTerm?.toLowerCase()) ||
          siteName.toLowerCase().includes(searchTerm?.toLowerCase())
        );
      })
      .sort((a, b) => (a.attributes?.name || "").localeCompare(b.attributes?.name || ""));
  }, [sitePolygonEntityData, searchTerm]);

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

  // added for setting mocked data - Remove when apiResponse is loaded correctly
  useEffect(() => {
    const processedData: any = processTreeCoverData(MOCK_TREE_COVER_API_RESPONSE);
    setTreeCoverPolygonsData(processedData);
  }, [entity_uuid]);

  return {
    polygonsIndicator: filteredPolygons,
    polygonOptions,
    indicatorPolygonsStatus,
    headerBarPolygonStatus,
    totalPolygonsStatus: totalPolygonsApproved,
    runAnalysisIndicator: mutate,
    loadingAnalysis: isLoading,
    loadingVerify: isLoadingVerify,
    isLoadingIndicator,
    isLoadingTreeCover,
    setIsLoadingVerify,
    dropdownAnalysisOptions,
    analysisToSlug,
    polygonMissingAnalysis,
    treeCoverLossData,
    treeCoverLossFiresData,
    treeCoverPolygonsData,
    sitePolygonEntityData: filteredTreeCoverPolygons,
    refreshTreeCoverData: fetchTreeCoverData
  };
};
