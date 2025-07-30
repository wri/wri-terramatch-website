import { flatten, isEmpty } from "lodash";
import { useMemo } from "react";

import { processDemographicData } from "@/admin/components/ResourceTabs/ReportTab/utils/demographicsProcessor";
import { useProjectReportIndex } from "@/connections/Entity";
import { selectDemographics } from "@/connections/EntityAssociation";
import { DemographicDto } from "@/generated/v3/entityService/entityServiceSchemas";
import { useValueChanged } from "@/hooks/useValueChanged";
import Log from "@/utils/log";

const DEFAULT_DEMOGRAPHIC_DATA = {
  fullTimeJobs: { total: 0, male: 0, female: 0, youth: 0, nonYouth: 0 },
  partTimeJobs: { total: 0, male: 0, female: 0, youth: 0, nonYouth: 0 },
  volunteers: { total: 0, male: 0, female: 0, youth: 0, nonYouth: 0 }
};

export const useDashboardEmploymentData = (projectUuid?: string) => {
  const [connectionLoaded, { loadFailure, data: reports }] = useProjectReportIndex({
    pageNumber: 1,
    sortField: "createdAt",
    sortDirection: "DESC",
    filter: { status: "approved", projectUuid },
    sideloads: [{ entity: "demographics", pageSize: 100 }],
    enabled: !isEmpty(projectUuid)
  });

  useValueChanged(loadFailure, () => {
    if (loadFailure != null) {
      Log.error("Error fetching project reports with demographics:", loadFailure);
    }
  });

  const formattedJobsData = useMemo(() => {
    // Pull the demographics data sideloaded on the reports request.
    const demographics = flatten(
      reports
        ?.map(({ uuid }) => selectDemographics({ entity: "projectReports", uuid }).data)
        .filter(associations => associations != null)
    ) as DemographicDto[];

    const rawEmploymentData =
      demographics.length === 0 ? DEFAULT_DEMOGRAPHIC_DATA : processDemographicData(demographics);
    return {
      totalFt: rawEmploymentData.fullTimeJobs.total,
      totalPt: rawEmploymentData.partTimeJobs.total,
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
  }, [reports]);

  return {
    formattedJobsData,
    isLoading: !connectionLoaded,
    error: loadFailure == null ? undefined : new Error(`Failed to fetch project reports: ${loadFailure.message}`)
  };
};
