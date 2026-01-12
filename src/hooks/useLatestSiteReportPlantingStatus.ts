import { useEffect, useMemo, useState } from "react";

import { loadFullSiteReport, loadSiteReportIndex } from "@/connections/Entity";
import { SiteReportFullDto, SiteReportLightDto } from "@/generated/v3/entityService/entityServiceSchemas";

export const useLatestSiteReportPlantingStatus = (
  siteUuid: string | null | undefined | string[]
): string | null | Record<string, string | null> => {
  const isArray = Array.isArray(siteUuid);
  const uuids = useMemo(() => {
    if (isArray) {
      return siteUuid;
    }
    return siteUuid ? [siteUuid] : [];
  }, [isArray, siteUuid]);

  const [plantingStatusMap, setPlantingStatusMap] = useState<Record<string, string | null>>({});

  const dependencyKey = useMemo(() => {
    return isArray ? uuids.join(",") : uuids[0] ?? "";
  }, [isArray, uuids]);

  useEffect(() => {
    const fetchPlantingStatus = async () => {
      if (uuids.length === 0) {
        setPlantingStatusMap({});
        return;
      }

      try {
        const map: Record<string, string | null> = {};

        uuids.forEach(uuid => {
          map[uuid] = null;
        });

        const reportsPromises = uuids.map(async uuid => {
          try {
            const reportsResult = await loadSiteReportIndex({
              filter: { status: "approved", siteUuid: uuid },
              pageSize: 100,
              pageNumber: 1,
              sortField: "dueAt",
              sortDirection: "DESC"
            });

            if (!reportsResult.data || reportsResult.data.length === 0) {
              return { siteUuid: uuid, plantingStatus: null };
            }

            const latestReport = reportsResult.data[0] as SiteReportLightDto;

            if (!latestReport?.uuid) {
              return { siteUuid: uuid, plantingStatus: null };
            }

            const fullReport = await loadFullSiteReport({ id: latestReport.uuid });

            if (fullReport.loadFailure || !fullReport.data) {
              return { siteUuid: uuid, plantingStatus: null };
            }

            const plantingStatus = (fullReport.data as SiteReportFullDto).plantingStatus ?? null;
            return { siteUuid: uuid, plantingStatus };
          } catch (error) {
            console.error(`Error fetching planting status for site ${uuid}:`, error);
            return { siteUuid: uuid, plantingStatus: null };
          }
        });

        const results = await Promise.all(reportsPromises);
        results.forEach(({ siteUuid, plantingStatus }) => {
          map[siteUuid] = plantingStatus;
        });

        setPlantingStatusMap(map);
      } catch (error) {
        console.error("Error fetching latest site report planting status:", error);
        setPlantingStatusMap({});
      }
    };

    fetchPlantingStatus();
  }, [dependencyKey, isArray, uuids]);

  return useMemo(() => {
    if (!isArray && uuids.length > 0) {
      return plantingStatusMap[uuids[0]] ?? null;
    }
    return plantingStatusMap;
  }, [isArray, uuids, plantingStatusMap]);
};
