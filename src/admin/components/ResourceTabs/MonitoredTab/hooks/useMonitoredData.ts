import { useT } from "@transifex/react";

// import { useEffect, useMemo, useState } from "react";
// import { useMyUser } from "@/connections/User";
// import { useLoading } from "@/context/loaderAdmin.provider";
import { useMonitoredDataContext } from "@/context/monitoredData.provider";
import { useNotificationContext } from "@/context/notification.provider";
import {
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

type InterfaceIndicatorPolygonsStatus = {
  draft: number;
  submitted: number;
  "needs-more-information": number;
  approved: number;
};

export const useMonitoredData = (entity?: EntityName, entity_uuid?: string) => {
  // const [, { user }] = useMyUser();
  const t = useT();
  // const [updateFilters, setUpdateFilters] = useState<any>({});
  // const { showLoader, hideLoader } = useLoading();
  const { searchTerm, indicatorSlug, indicatorSlugAnalysis, setLoadingAnalysis } = useMonitoredDataContext();
  const { openNotification } = useNotificationContext();

  const { mutate, isLoading } = usePostV2IndicatorsSlug({
    onSuccess: () => {
      openNotification(
        "success",
        t("Success! Analysis completed."),
        t("The analysis has been completed successfully.")
      );
      refetchDataIndicators();
      setLoadingAnalysis?.(false);
    },
    onError: () => {
      openNotification("error", t("Error! Analysis failed."), t("The analysis has failed. Please try again."));
      refetchDataIndicators();
      setLoadingAnalysis?.(false);
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

  const totalPolygonsStatus = headerBarPolygonStatus.reduce((acc, item) => acc + item.count, 0);

  const { data: unparsedUuids, isLoading: isLoadingVerify } = useGetV2IndicatorsEntityUuidSlugVerify(
    {
      pathParams: {
        entity: entity!,
        uuid: entity_uuid!,
        slug: indicatorSlugAnalysis!
      }
    },
    {
      enabled: !!indicatorSlugAnalysis && !!entity_uuid
    }
  );

  return {
    polygonsIndicator: filteredPolygons,
    indicatorPolygonsStatus: indicatorPolygonsStatus,
    headerBarPolygonStatus: headerBarPolygonStatus,
    totalPolygonsStatus: totalPolygonsStatus,
    runAnalysisIndicator: mutate,
    unparsedUuids: unparsedUuids,
    loadingAnalysis: isLoading,
    loadingVerify: isLoadingVerify
  };
};
