import { useT } from "@transifex/react";
import { useMemo } from "react";

import { useGadmChoices } from "@/connections/Gadm";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import Log from "@/utils/log";

interface IntersectionInfo {
  intersectSmaller: boolean;
  percentage: number;
  polyName: string | null;
  siteName: string | null;
}

interface ProjectGoalInfo {
  polygonStatus?: string;
  polygonArea?: number;
  isPolygonApproved?: boolean;
  sumAreaSiteApproved?: number;
  percentageSiteApproved?: number;
  totalAreaSite?: number;
  sumAreaProjectApproved?: number;
  percentageProjectApproved?: number;
  totalAreaProject?: number;
  projectedSumAreaSite?: number;
  projectedPercentageSite?: number;
  projectedSumAreaProject?: number;
  projectedPercentageProject?: number;
}

interface ExtraInfoItem {
  exists: boolean;
  field: string;
  error?: string;
}

interface PlantStartDateInfo {
  errorType: string;
  polygonUuid: string;
  polygonName: string;
  siteName: string;
  providedValue?: string;
  minDate?: string;
  currentDate?: string;
  siteStartDate?: string;
  allowedRange?: {
    min: string;
    max: string;
  };
  errorDetails?: string;
}

const FIELDS_TO_VALIDATE: Record<string, string> = {
  polyName: "Polygon Name",
  plantstart: "Plant Start Date",
  practice: "Restoration Practice",
  target_sys: "Target Land Use System",
  distr: "Tree Distribution",
  planting_status: "Planting Status",
  num_trees: "Number of Trees"
};

export const useMessageValidators = () => {
  const t = useT();
  const isAdmin = useIsAdmin();
  const countryChoices = useGadmChoices({ level: 0 });

  const getIntersectionMessages = useMemo(
    () =>
      (extraInfo: any): string[] => {
        if (extraInfo == null) return [];
        try {
          return extraInfo.map(({ intersectSmaller, percentage, polyName, siteName }: IntersectionInfo) => {
            return intersectSmaller
              ? t(
                  "Geometries intersect: approx. {percentage}% of another, smaller polygon ({polyName}) [in site: {siteName}]",
                  {
                    percentage,
                    polyName: polyName || "Unnamed Polygon",
                    siteName: siteName || "Unnamed Site"
                  }
                )
              : t(
                  "Geometries intersect: approx. {percentage}% of this polygon is intersected by polygon: {polyName} [in site: {siteName}]",
                  {
                    percentage,
                    polyName: polyName || "Unnamed Polygon",
                    siteName: siteName || "Unnamed Site"
                  }
                );
          });
        } catch (error) {
          Log.error("Failed to get intersection messages", error);
          return [t("Error parsing extra info.")];
        }
      },
    [t]
  );
  const getTargetCountryMessage = useMemo(
    () =>
      (extraInfo: any): string[] => {
        if (extraInfo == null) return [];

        try {
          // Handle both V2 (string) and V3 (object) data formats
          const infoObject = typeof extraInfo === "string" ? JSON.parse(extraInfo) : extraInfo;
          if (infoObject && typeof infoObject === "object" && "countryName" in infoObject) {
            const countryName = infoObject.countryName || "Unknown Country";
            const country =
              countryChoices.find(choice => choice.id === countryName) ??
              countryChoices.find(choice => choice.name.toLowerCase() === countryName.toLowerCase());
            return [
              t("Target Country: The polygon should be located inside {country}", {
                country: country?.name ?? countryName
              })
            ];
          } else {
            return [t("Error: Country information is missing in extra info.")];
          }
        } catch (error) {
          Log.error("Failed to get target country message", error);
          return [t("Error parsing extra info.")];
        }
      },
    [t, countryChoices]
  );
  const getDataMessage = useMemo(
    () => (extraInfo: any) => {
      if (extraInfo == null) return [];
      try {
        const infoArray: ExtraInfoItem[] = extraInfo;
        return infoArray
          .filter(info => {
            // Filter out deleted plantend field
            if (info.field === "plantend") {
              return false;
            }
            if (!isAdmin && info.field === "planting_status") {
              return false;
            }
            return true;
          })
          .map(info => {
            if (!info.exists) {
              return t("{field} is missing", { field: FIELDS_TO_VALIDATE[info.field] });
            }
            switch (info.field) {
              case "target_sys":
                return t(
                  "{field}: {error} is not a valid {field} because it is not one of ['agroforest', 'natural-forest', 'mangrove', 'peatland', 'riparian-area-or-wetland', 'silvopasture', 'woodlot-or-plantation', 'urban-forest']",
                  { field: FIELDS_TO_VALIDATE[info.field], error: info.error }
                );
              case "distr":
                return t(
                  "{field}: {error} is not a valid {field} because it is not one of ['single-line', 'partial', 'full']",
                  { field: FIELDS_TO_VALIDATE[info.field], error: info.error }
                );
              case "num_trees":
                return t("{field} {error} tree count is missing", {
                  field: FIELDS_TO_VALIDATE[info.field],
                  error: info.error
                });
              case "practice":
                return t(
                  "{field}: {error} is not a valid {field} because it is not one of ['tree-planting', 'direct-seeding', 'assisted-natural-regeneration']",
                  { field: FIELDS_TO_VALIDATE[info.field], error: info.error }
                );
              default:
                return null;
            }
          })
          .filter((message): message is string => message !== null);
      } catch {
        return [t("Error parsing extra info.")];
      }
    },
    [t, isAdmin]
  );

  const getProjectGoalMessage = useMemo(
    () => (extraInfo: any) => {
      if (extraInfo == null) return [];
      try {
        const info: ProjectGoalInfo = typeof extraInfo === "string" ? JSON.parse(extraInfo) : extraInfo;
        const messages: string[] = [];

        const formatNumber = (value: number | undefined) => (typeof value === "number" ? value.toFixed(2) : value);

        const sumAreaSite = info.sumAreaSiteApproved;
        const percentageSite = info.percentageSiteApproved;
        const totalAreaSite = info.totalAreaSite;
        const sumAreaProject = info.sumAreaProjectApproved;
        const percentageProject = info.percentageProjectApproved;
        const totalAreaProject = info.totalAreaProject;

        if (totalAreaSite === null || totalAreaSite === undefined) {
          messages.push(t("Site Goal: A goal has not been specified."));
        } else if (sumAreaSite !== undefined && percentageSite !== undefined) {
          if (info.isPolygonApproved) {
            messages.push(
              t(
                "Site Goal: The sum of all site polygons {sumAreaSite} ha is {percentageSite}% of total hectares to be restored for this site ({totalAreaSite} ha)",
                {
                  sumAreaSite: formatNumber(sumAreaSite),
                  percentageSite: formatNumber(percentageSite),
                  totalAreaSite: formatNumber(totalAreaSite)
                }
              )
            );
          } else if (info.projectedSumAreaSite !== undefined && info.projectedPercentageSite !== undefined) {
            messages.push(
              t(
                "Site Goal: Approved polygons sum to {sumAreaSite} ha ({percentageSite}%). If this polygon ({polygonArea} ha) is approved, the total would be {projectedSum} ha ({projectedPercentage}%) of total hectares to be restored ({totalAreaSite} ha)",
                {
                  sumAreaSite: formatNumber(sumAreaSite),
                  percentageSite: formatNumber(percentageSite),
                  polygonArea: formatNumber(info.polygonArea),
                  projectedSum: formatNumber(info.projectedSumAreaSite),
                  projectedPercentage: formatNumber(info.projectedPercentageSite),
                  totalAreaSite: formatNumber(totalAreaSite)
                }
              )
            );
          } else {
            messages.push(
              t(
                "Site Goal: The sum of all approved site polygons {sumAreaSite} ha is {percentageSite}% of total hectares to be restored for this site ({totalAreaSite} ha)",
                {
                  sumAreaSite: formatNumber(sumAreaSite),
                  percentageSite: formatNumber(percentageSite),
                  totalAreaSite: formatNumber(totalAreaSite)
                }
              )
            );
          }
        }

        if (totalAreaProject === null || totalAreaProject === undefined) {
          messages.push(t("Project Goal: A goal has not been specified."));
        } else if (sumAreaProject !== undefined && percentageProject !== undefined) {
          if (info.isPolygonApproved) {
            messages.push(
              t(
                "Project Goal: The sum of all project polygons {sumAreaProject} ha is {percentageProject}% of total hectares to be restored ({totalAreaProject} ha)",
                {
                  sumAreaProject: formatNumber(sumAreaProject),
                  percentageProject: formatNumber(percentageProject),
                  totalAreaProject: formatNumber(totalAreaProject)
                }
              )
            );
          } else if (info.projectedSumAreaProject !== undefined && info.projectedPercentageProject !== undefined) {
            messages.push(
              t(
                "Project Goal: Approved polygons sum to {sumAreaProject} ha ({percentageProject}%). If this polygon ({polygonArea} ha) is approved, the total would be {projectedSum} ha ({projectedPercentage}%) of total hectares to be restored ({totalAreaProject} ha)",
                {
                  sumAreaProject: formatNumber(sumAreaProject),
                  percentageProject: formatNumber(percentageProject),
                  polygonArea: formatNumber(info.polygonArea),
                  projectedSum: formatNumber(info.projectedSumAreaProject),
                  projectedPercentage: formatNumber(info.projectedPercentageProject),
                  totalAreaProject: formatNumber(totalAreaProject)
                }
              )
            );
          } else {
            messages.push(
              t(
                "Project Goal: The sum of all approved project polygons {sumAreaProject} ha is {percentageProject}% of total hectares to be restored ({totalAreaProject} ha)",
                {
                  sumAreaProject: formatNumber(sumAreaProject),
                  percentageProject: formatNumber(percentageProject),
                  totalAreaProject: formatNumber(totalAreaProject)
                }
              )
            );
          }
        }

        return messages;
      } catch (error) {
        Log.error("Failed to parse project goal message", error);
        return [t("Error parsing extra info.")];
      }
    },
    [t]
  );

  const getPlantStartDateMessage = useMemo(
    () => (extraInfo: any) => {
      if (extraInfo == null) return [];
      try {
        // Handle both V2 (string) and V3 (object) data formats
        const info: PlantStartDateInfo = typeof extraInfo === "string" ? JSON.parse(extraInfo) : extraInfo;

        switch (info.errorType) {
          case "MISSING_VALUE":
            return [
              t("Plant Start Date is missing for polygon {polygonName} in site {siteName}", {
                polygonName: info.polygonName || "Unnamed Polygon",
                siteName: info.siteName || "Unnamed Site"
              })
            ];
          case "INVALID_FORMAT":
            return [
              t("Invalid format for Plant Start Date ({providedValue}) for polygon {polygonName} in site {siteName}", {
                providedValue: info.providedValue,
                polygonName: info.polygonName || "Unnamed Polygon",
                siteName: info.siteName || "Unnamed Site"
              })
            ];
          case "DATE_TOO_EARLY":
            return [
              t(
                "Plant Start Date ({providedValue}) for polygon {polygonName} in site {siteName} is before the minimum allowed date ({minDate})",
                {
                  providedValue: info.providedValue,
                  polygonName: info.polygonName || "Unnamed Polygon",
                  siteName: info.siteName || "Unnamed Site",
                  minDate: info.minDate
                }
              )
            ];
          case "DATE_IN_FUTURE":
            return [
              t(
                "Plant Start Date ({providedValue}) for polygon {polygonName} in site {siteName} is in the future (current date: {currentDate})",
                {
                  providedValue: info.providedValue,
                  polygonName: info.polygonName || "Unnamed Polygon",
                  siteName: info.siteName || "Unnamed Site",
                  currentDate: info.currentDate
                }
              )
            ];
          case "DATE_OUTSIDE_SITE_RANGE":
            return [
              t(
                "Plant Start Date ({providedValue}) for polygon {polygonName} in site {siteName} should be within two years of the site's establishment date ({siteStartDate}). Allowed range: {minDate} to {maxDate}",
                {
                  providedValue: info.providedValue,
                  polygonName: info.polygonName || "Unnamed Polygon",
                  siteName: info.siteName || "Unnamed Site",
                  siteStartDate: info.siteStartDate,
                  minDate: info.allowedRange?.min,
                  maxDate: info.allowedRange?.max
                }
              )
            ];
          case "PARSE_ERROR":
            return [
              t("Error parsing Plant Start Date ({providedValue}) for polygon {polygonName} in site {siteName}", {
                providedValue: info.providedValue,
                polygonName: info.polygonName || "Unnamed Polygon",
                siteName: info.siteName || "Unnamed Site"
              })
            ];
          default:
            return [
              t("Invalid Plant Start Date for polygon {polygonName} in site {siteName}", {
                polygonName: info.polygonName || "Unnamed Polygon",
                siteName: info.siteName || "Unnamed Site"
              })
            ];
        }
      } catch (error) {
        Log.error("Failed to get plant start date message", error);
        return [t("Error parsing extra info.")];
      }
    },
    [t]
  );

  const getFormatedExtraInfo = useMemo(
    () => (extraInfo: any, criteria_id: any) => {
      if (criteria_id === 12) {
        return getProjectGoalMessage(extraInfo);
      } else if (criteria_id === 3) {
        return getIntersectionMessages(extraInfo);
      } else if (criteria_id === 14) {
        return getDataMessage(extraInfo);
      } else if (criteria_id === 7) {
        return getTargetCountryMessage(extraInfo);
      } else if (criteria_id === 15) {
        return getPlantStartDateMessage(extraInfo);
      } else {
        return [];
      }
    },
    [getProjectGoalMessage, getIntersectionMessages, getDataMessage, getTargetCountryMessage, getPlantStartDateMessage]
  );

  return {
    getFormatedExtraInfo
  };
};
