import { useEffect, useMemo, useState } from "react";

import { IncludedDemographic } from "@/admin/components/ResourceTabs/ReportTab/types";
import { processDemographicData } from "@/admin/components/ResourceTabs/ReportTab/utils/demographicsProcessor";
import { loadProjectReportIndex } from "@/connections/Entity";
import { EntityIndexConnectionProps } from "@/connections/Entity";
import { JsonApiResource } from "@/store/apiSlice";

const DEFAULT_DEMOGRAPHIC_DATA = {
  fullTimeJobs: { total: 0, male: 0, female: 0, youth: 0, nonYouth: 0 },
  partTimeJobs: { total: 0, male: 0, female: 0, youth: 0, nonYouth: 0 },
  volunteers: { total: 0, male: 0, female: 0, youth: 0, nonYouth: 0 }
};

export const useDashboardEmploymentData = (projectUuid: string | undefined) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [demographicsData, setDemographicsData] = useState<JsonApiResource[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      if (!projectUuid) return;

      setIsLoading(true);
      setError(null);

      try {
        const connectionProps: EntityIndexConnectionProps = {
          pageSize: 100,
          pageNumber: 1,
          sortField: "createdAt",
          sortDirection: "DESC",
          filter: {
            status: "approved",
            projectUuid: projectUuid
          },
          sideloads: [{ entity: "demographics", pageSize: 100 }]
        };

        const connection = await loadProjectReportIndex(connectionProps);

        if (connection.fetchFailure != null) {
          throw new Error(`Failed to fetch project reports: ${connection.fetchFailure}`);
        }
        console.log("Project Reports IDs:", connection);
        if (connection.included && Array.isArray(connection.included)) {
          const demographicsItems = connection.included.filter(item => item.type === "demographics");
          setDemographicsData(demographicsItems);
        } else {
          setDemographicsData([]);
        }
      } catch (err) {
        console.error("Error fetching project reports with demographics:", err);
        setError(err instanceof Error ? err : new Error("Unknown error occurred"));
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [projectUuid]);

  const employmentData = useMemo(() => {
    if (!projectUuid || demographicsData.length === 0) {
      return DEFAULT_DEMOGRAPHIC_DATA;
    }

    const typedDemographicsData = demographicsData as unknown as IncludedDemographic[];
    return processDemographicData(typedDemographicsData);
  }, [demographicsData, projectUuid]);

  const formattedJobsData = useMemo(() => {
    if (!projectUuid) return null;
    console.log("employmentData", employmentData);
    return {
      total_ft: employmentData.fullTimeJobs.total,
      total_pt: employmentData.partTimeJobs.total,
      total_ft_women: employmentData.fullTimeJobs.female,
      total_ft_men: employmentData.fullTimeJobs.male,
      total_ft_youth: employmentData.fullTimeJobs.youth,
      total_ft_non_youth: employmentData.fullTimeJobs.nonYouth,
      total_pt_women: employmentData.partTimeJobs.female,
      total_pt_men: employmentData.partTimeJobs.male,
      total_pt_youth: employmentData.partTimeJobs.youth,
      total_pt_non_youth: employmentData.partTimeJobs.nonYouth,
      totalJobsCreated: employmentData.fullTimeJobs.total + employmentData.partTimeJobs.total
    };
  }, [employmentData, projectUuid]);

  return {
    rawEmploymentData: employmentData,
    formattedJobsData,
    isLoading: isLoading && !!projectUuid,
    error
  };
};
