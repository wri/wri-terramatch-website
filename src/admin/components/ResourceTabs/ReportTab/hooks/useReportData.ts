import { useEffect, useState } from "react";
import { useDataProvider, useShowContext } from "react-admin";

import { ExtendedGetListResult } from "@/admin/apiProvider/utils/listing";
import { usePlants, useSiteReportDisturbances } from "@/connections/EntityAssociation";

import {
  BeneficiaryData,
  EmploymentDemographicData,
  IncludedDemographic,
  ProjectReport,
  ReportData,
  Site,
  SiteReport
} from "../types";
import { processBeneficiaryData, processDemographicData } from "../utils/demographicsProcessor";

export const useReportData = () => {
  const { record } = useShowContext();
  const dataProvider = useDataProvider();
  const [sites, setSites] = useState<Site[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [latestSurvivalRate, setLatestSurvivalRate] = useState<number>(0);
  const [siteReportUuids, setSiteReportUuids] = useState<string[]>([]);

  const disturbances = useSiteReportDisturbances(siteReportUuids);

  useEffect(() => {}, [disturbances]);

  const [, { associations: plants }] = usePlants({
    entity: "projects",
    uuid: record?.id,
    collection: "tree-planted"
  });

  const [employmentData, setEmploymentData] = useState<EmploymentDemographicData>({
    fullTimeJobs: { total: 0, male: 0, female: 0, youth: 0, nonYouth: 0 },
    partTimeJobs: { total: 0, male: 0, female: 0, youth: 0, nonYouth: 0 },
    volunteers: { total: 0, male: 0, female: 0, youth: 0, nonYouth: 0 }
  });

  const [beneficiaryData, setBeneficiaryData] = useState<BeneficiaryData>({
    beneficiaries: 0,
    farmers: 0
  });

  useEffect(() => {
    const fetchData = async () => {
      if (!record?.id) return;

      setIsLoading(true);
      setError(null);

      try {
        const reportsPromise = dataProvider.getList<ProjectReport>("projectReport", {
          filter: { status: "approved", projectUuid: record.id },
          pagination: { page: 1, perPage: 100 },
          sort: { field: "createdAt", order: "DESC" },
          meta: {
            sideloads: [{ entity: "demographics", pageSize: 100 }]
          }
        }) as Promise<ExtendedGetListResult<ProjectReport>>;

        const sitesPromise = dataProvider.getList<Site>("site", {
          filter: {
            projectUuid: record.id,
            status: ["approved", "restoration-in-progress"]
          },
          pagination: { page: 1, perPage: 100 },
          sort: { field: "createdAt", order: "DESC" }
        });

        const [reportsResult, sitesResult] = await Promise.all([reportsPromise, sitesPromise]);

        const latestReportWithSurvivalRate = reportsResult.data
          .filter(report => report.pctSurvivalToDate !== null)
          .sort((a, b) => new Date(b.dueAt).getTime() - new Date(a.dueAt).getTime())[0];

        setLatestSurvivalRate(latestReportWithSurvivalRate?.pctSurvivalToDate ?? 0);

        if (reportsResult.included && Array.isArray(reportsResult.included)) {
          const demographicsData = reportsResult.included.filter(item => item.type === "demographics");

          if (demographicsData.length > 0) {
            const typedDemographicsData = demographicsData as unknown as IncludedDemographic[];
            const processedEmploymentData = processDemographicData(typedDemographicsData);
            setEmploymentData(processedEmploymentData);

            const processedBeneficiaryData = processBeneficiaryData(typedDemographicsData);
            setBeneficiaryData(processedBeneficiaryData);
          }
        }

        const sitesData = sitesResult.data as Site[];
        const allSiteReportUuids: string[] = [];

        const sitesWithDisturbances = await Promise.all(
          sitesData.map(async site => {
            try {
              const siteReportsResult = await dataProvider.getList<SiteReport>("siteReport", {
                filter: { status: "approved", siteUuid: site.uuid },
                pagination: { page: 1, perPage: 100 },
                sort: { field: "updatedAt", order: "DESC" }
              });

              if (siteReportsResult?.data && siteReportsResult.data.length > 0) {
                siteReportsResult.data.forEach(report => {
                  if (report.uuid) {
                    allSiteReportUuids.push(report.uuid);
                  }
                });
              }

              return {
                ...site,
                siteReports: siteReportsResult?.data || []
              };
            } catch (siteReportError) {
              console.error(`Error fetching site reports for site ${site.uuid}:`, siteReportError);
              return {
                ...site,
                siteReports: []
              };
            }
          })
        );

        setSiteReportUuids(allSiteReportUuids);

        setSites(sitesWithDisturbances);
      } catch (err) {
        console.error("Error fetching report data:", err);
        setError(err instanceof Error ? err : new Error("Unknown error occurred"));
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [record?.id, dataProvider]);

  useEffect(() => {
    if (!disturbances || !sites.length) return;
    const sitesWithDisturbances = sites.map(site => {
      let totalDisturbances = 0;
      let climaticDisturbances = 0;
      let manmadeDisturbances = 0;
      let ecologicalDisturbances = 0;

      if (site.siteReports && site.siteReports.length > 0) {
        site.siteReports.forEach(siteReport => {
          const reportDisturbances = disturbances[siteReport.uuid] || [];
          reportDisturbances.forEach(disturbance => {
            if (disturbance.type) {
              const disturbanceType = disturbance.type.toLowerCase();
              if (disturbanceType === "climatic") {
                climaticDisturbances++;
              } else if (disturbanceType === "manmade") {
                manmadeDisturbances++;
              } else if (disturbanceType === "ecological") {
                ecologicalDisturbances++;
              }
            }
          });
        });

        totalDisturbances = climaticDisturbances + manmadeDisturbances + ecologicalDisturbances;
      }

      return {
        ...site,
        totalReportedDisturbances: totalDisturbances,
        climaticDisturbances,
        manmadeDisturbances,
        ecologicalDisturbances
      };
    });

    const siteDisturbanceChanges = sitesWithDisturbances
      .map((site, i) => site.totalReportedDisturbances !== sites[i]?.totalReportedDisturbances)
      .filter(changed => changed).length;

    if (siteDisturbanceChanges > 0) {
      setSites(sitesWithDisturbances);
    }
  }, [disturbances, sites]);

  const reportData: ReportData = {
    organization: {
      name: record?.organisationName ?? "Foundation"
    },
    project: {
      name: record?.name ?? "Ecosystem and livelihoods enhancement for People, Nature and Climate",
      trees: {
        planted: record?.treesPlantedCount ?? 0,
        goal: record?.treesGrownGoal ?? 0,
        percentage:
          record?.treesPlantedCount && record?.treesGrownGoal
            ? Math.round((record.treesPlantedCount / record.treesGrownGoal) * 100)
            : 0
      },
      hectares: {
        restored: record?.totalHectaresRestoredSum ?? 0,
        goal: record?.totalHectaresRestoredGoal ?? 0,
        percentage:
          record?.totalHectaresRestoredSum && record?.totalHectaresRestoredGoal
            ? Math.round((record.totalHectaresRestoredSum / record.totalHectaresRestoredGoal) * 100)
            : 0
      },
      jobs: {
        fullTime: employmentData.fullTimeJobs.total,
        partTime: employmentData.partTimeJobs.total
      }
    },
    metrics: {
      sites: sites.length,
      survivalRate: latestSurvivalRate,
      beneficiaries: beneficiaryData.beneficiaries,
      smallholderFarmers: beneficiaryData.farmers
    },
    employment: {
      fullTimeJobs: employmentData.fullTimeJobs.total,
      partTimeJobs: employmentData.partTimeJobs.total,
      volunteers: employmentData.volunteers.total,
      demographics: {
        fullTime: employmentData.fullTimeJobs,
        partTime: employmentData.partTimeJobs,
        volunteers: employmentData.volunteers
      }
    },
    sites: sites.map(site => ({
      name: site.name,
      hectareGoal: site.hectaresToRestoreGoal,
      hectaresUnderRestoration: site.totalHectaresRestoredSum ?? 0,
      totalReportedDisturbances: site.totalReportedDisturbances ?? 0,
      climaticDisturbances: site.climaticDisturbances ?? 0,
      manmadeDisturbances: site.manmadeDisturbances ?? 0,
      ecologicalDisturbances: site.ecologicalDisturbances ?? 0
    }))
  };

  return {
    sites,
    plants,
    employmentData,
    beneficiaryData,
    reportData,
    isLoading,
    error
  };
};
