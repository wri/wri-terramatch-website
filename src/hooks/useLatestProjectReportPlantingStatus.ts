import { useEffect, useMemo, useState } from "react";

import { loadFullProjectReport, loadProjectReportIndex } from "@/connections/Entity";
import { ProjectReportFullDto, ProjectReportLightDto } from "@/generated/v3/entityService/entityServiceSchemas";

export const useLatestProjectReportPlantingStatus = (
  projectUuid: string | null | undefined | string[]
): string | null | Record<string, string | null> => {
  const isArray = Array.isArray(projectUuid);
  const uuids = useMemo(() => {
    if (isArray) {
      return projectUuid;
    }
    return projectUuid ? [projectUuid] : [];
  }, [isArray, projectUuid]);

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
            const reportsResult = await loadProjectReportIndex({
              filter: { status: "approved", projectUuid: uuid },
              pageSize: 100,
              pageNumber: 1,
              sortField: "dueAt",
              sortDirection: "DESC"
            });

            if (!reportsResult.data || reportsResult.data.length === 0) {
              return { projectUuid: uuid, plantingStatus: null };
            }

            const latestReport = reportsResult.data[0] as ProjectReportLightDto;

            if (!latestReport?.uuid) {
              return { projectUuid: uuid, plantingStatus: null };
            }

            const fullReport = await loadFullProjectReport({ id: latestReport.uuid });

            if (fullReport.loadFailure || !fullReport.data) {
              return { projectUuid: uuid, plantingStatus: null };
            }

            const plantingStatus = (fullReport.data as ProjectReportFullDto).plantingStatus ?? null;
            return { projectUuid: uuid, plantingStatus };
          } catch (error) {
            console.error(`Error fetching planting status for project ${uuid}:`, error);
            return { projectUuid: uuid, plantingStatus: null };
          }
        });

        const results = await Promise.all(reportsPromises);
        results.forEach(({ projectUuid, plantingStatus }) => {
          map[projectUuid] = plantingStatus;
        });

        setPlantingStatusMap(map);
      } catch (error) {
        console.error("Error fetching latest project report planting status:", error);
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
