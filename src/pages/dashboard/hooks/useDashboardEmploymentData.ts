import { isEmpty } from "lodash";
import { useMemo } from "react";

import { IncludedDemographic } from "@/admin/components/ResourceTabs/ReportTab/types";
import { processDemographicData } from "@/admin/components/ResourceTabs/ReportTab/utils/demographicsProcessor";
import { useProjectReportIndex } from "@/connections/Entity";
import { useValueChanged } from "@/hooks/useValueChanged";
import Log from "@/utils/log";

const DEFAULT_DEMOGRAPHIC_DATA = {
  fullTimeJobs: { total: 0, male: 0, female: 0, youth: 0, nonYouth: 0 },
  partTimeJobs: { total: 0, male: 0, female: 0, youth: 0, nonYouth: 0 },
  volunteers: { total: 0, male: 0, female: 0, youth: 0, nonYouth: 0 }
};

export const useDashboardEmploymentData = (projectUuid: string | undefined) => {
  const [connectionLoaded, { fetchFailure, included }] = useProjectReportIndex({
    pageNumber: 1,
    sortField: "createdAt",
    sortDirection: "DESC",
    filter: { status: "approved", projectUuid },
    sideloads: [{ entity: "demographics", pageSize: 100 }],
    enabled: !isEmpty(projectUuid)
  });

  useValueChanged(fetchFailure, () => {
    if (fetchFailure != null) {
      Log.error("Error fetching project reports with demographics:", fetchFailure);
    }
  });

  const { rawEmploymentData, formattedJobsData } = useMemo(() => {
    const demographicsData = included?.filter(({ type }) => type === "demographics");
    const rawEmploymentData =
      demographicsData == null || demographicsData.length === 0
        ? DEFAULT_DEMOGRAPHIC_DATA
        : processDemographicData(demographicsData as unknown as IncludedDemographic[]);

    const formattedJobsData = {
      total_ft: rawEmploymentData.fullTimeJobs.total,
      total_pt: rawEmploymentData.partTimeJobs.total,
      total_ft_women: rawEmploymentData.fullTimeJobs.female,
      total_ft_men: rawEmploymentData.fullTimeJobs.male,
      total_ft_youth: rawEmploymentData.fullTimeJobs.youth,
      total_ft_non_youth: rawEmploymentData.fullTimeJobs.nonYouth,
      total_pt_women: rawEmploymentData.partTimeJobs.female,
      total_pt_men: rawEmploymentData.partTimeJobs.male,
      total_pt_youth: rawEmploymentData.partTimeJobs.youth,
      total_pt_non_youth: rawEmploymentData.partTimeJobs.nonYouth,
      totalJobsCreated: rawEmploymentData.fullTimeJobs.total + rawEmploymentData.partTimeJobs.total
    };

    return { rawEmploymentData, formattedJobsData };
  }, [included]);

  return {
    rawEmploymentData,
    formattedJobsData,
    isLoading: !connectionLoaded,
    error: fetchFailure
  };
};
