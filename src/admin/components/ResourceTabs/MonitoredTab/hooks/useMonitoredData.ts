import { useT } from "@transifex/react";
import { useEffect, useState } from "react";

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
  },
  {
    title: "Tree Count",
    value: "6",
    slug: "treeCount"
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

export const useMonitoredData = (entity?: EntityName, entity_uuid?: string) => {
  const t = useT();
  const { searchTerm, indicatorSlug, setLoadingAnalysis, setIndicatorSlugAnalysis } = useMonitoredDataContext();
  const { modalOpened } = useModalContext();
  const [isLoadingVerify, setIsLoadingVerify] = useState<boolean>(false);
  const { openNotification } = useNotificationContext();
  const [analysisToSlug, setAnalysisToSlug] = useState<any>({
    treeCoverLoss: [],
    treeCoverLossFires: [],
    restorationByEcoRegion: [],
    restorationByStrategy: [],
    restorationByLandUse: [],
    treeCount: []
  });
  const [dropdownAnalysisOptions, setDropdownAnalysisOptions] = useState(DROPDOWN_OPTIONS);

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

  const { data: indicatorData, refetch: refetchDataIndicators } = useGetV2IndicatorsEntityUuidSlug(
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

  const filteredPolygons = indicatorData?.filter(
    (polygon: Indicators) =>
      polygon?.poly_name?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
      polygon?.site_name?.toLowerCase().includes(searchTerm?.toLowerCase())
  );

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

  const verifySlug = async (slug: string) =>
    fetchGetV2IndicatorsEntityUuidSlugVerify({
      pathParams: {
        entity: entity!,
        uuid: entity_uuid!,
        slug: slug!
      }
    });

  useEffect(() => {
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
      await setDropdownAnalysisOptions(updateTitleDropdownOptions);
      setIsLoadingVerify(false);
    };
    if (modalOpened(ModalId.MODAL_RUN_ANALYSIS)) {
      fetchSlugs();
    }
  }, [entity]);

  return {
    polygonsIndicator: filteredPolygons,
    indicatorPolygonsStatus: indicatorPolygonsStatus,
    headerBarPolygonStatus: headerBarPolygonStatus,
    totalPolygonsStatus: totalPolygonsApproved,
    runAnalysisIndicator: mutate,
    loadingAnalysis: isLoading,
    loadingVerify: isLoadingVerify,
    setIsLoadingVerify: setIsLoadingVerify,
    dropdownAnalysisOptions: dropdownAnalysisOptions,
    analysisToSlug: analysisToSlug,
    polygonMissingAnalysis: polygonMissingAnalysis
  };
};
