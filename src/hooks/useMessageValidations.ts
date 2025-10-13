import { useT } from "@transifex/react";
import { useMemo } from "react";

import { useIsAdmin } from "@/hooks/useIsAdmin";
import Log from "@/utils/log";

interface IntersectionInfo {
  // V2 format (snake_case)
  intersectSmaller?: boolean;
  percentage?: number;
  poly_name?: string | null;
  site_name?: string | null;
  // V3 format (camelCase)
  polyUuid?: string | null;
  polyName?: string | null;
  siteName?: string | null;
  intersectionArea?: number;
}

interface ProjectGoalInfo {
  // V2 format (snake_case)
  sum_area_project?: number;
  percentage_project?: number;
  total_area_project?: number;
  sum_area_site?: number;
  percentage_site?: number;
  total_area_site?: number;
  // V3 format (camelCase)
  sumAreaProject?: number;
  percentageProject?: number;
  totalAreaProject?: number;
  sumAreaSite?: number;
  percentageSite?: number;
  totalAreaSite?: number;
  lowerBoundSite?: number;
  upperBoundSite?: number;
  lowerBoundProject?: number;
  upperBoundProject?: number;
}

interface ExtraInfoItem {
  exists: boolean;
  field: string;
  error?: string;
}

interface PlantStartDateInfo {
  // V2 format (snake_case)
  error_type?: string;
  polygon_uuid?: string;
  polygon_name?: string;
  site_name?: string;
  provided_value?: string;
  min_date?: string;
  current_date?: string;
  site_start_date?: string;
  allowed_range?: {
    min: string;
    max: string;
  };
  error_details?: string;
  // V3 format (camelCase)
  errorType?: string;
  polygonUuid?: string;
  polygonName?: string;
  siteName?: string;
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
  poly_name: "Polygon Name",
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

  const getIntersectionMessages = useMemo(
    () =>
      (extraInfo: any): string[] => {
        if (extraInfo == null) return [];
        try {
          return extraInfo.map((info: IntersectionInfo) => {
            // Support both V2 (snake_case) and V3 (camelCase) formats
            const polyName = info.polyName || info.poly_name || "Unnamed Polygon";
            const siteName = info.siteName || info.site_name || "Unnamed Site";
            const percentage = info.percentage ?? 0;
            const isSmaller = info.intersectSmaller ?? false;
            const overlapArea = info.intersectionArea;

            let message = isSmaller
              ? t(
                  "Geometries intersect: approx. {percentage}% of another, smaller polygon ({polyName}) [in site: {siteName}]",
                  {
                    percentage: percentage.toFixed(2),
                    polyName,
                    siteName
                  }
                )
              : t(
                  "Geometries intersect: approx. {percentage}% of this polygon is intersected by polygon: {polyName} [in site: {siteName}]",
                  {
                    percentage: percentage.toFixed(2),
                    polyName,
                    siteName
                  }
                );

            // Add overlap area info if available (V3 format)
            if (overlapArea != null) {
              message += ` (${overlapArea.toFixed(4)} ha)`;
            }

            return message;
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
          if (infoObject && typeof infoObject === "object") {
            // Support both V2 (country_name) and V3 (countryName) formats
            const countryName = infoObject.countryName || infoObject.country_name || "Unknown Country";
            return [
              t("Target Country: The polygon should be located inside {country}", {
                country: countryName
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
    [t]
  );
  const getDataMessage = useMemo(
    () => (extraInfo: any) => {
      if (extraInfo == null) return [];
      try {
        // V3 format has validationErrors array
        const infoArray: ExtraInfoItem[] = extraInfo.validationErrors || extraInfo;

        return infoArray
          .filter(info => {
            if (!isAdmin && info.field === "planting_status") {
              return false;
            }
            return true;
          })
          .map(info => {
            // Convert camelCase fields to snake_case for consistent handling
            const field = info.field;
            const fieldName = FIELDS_TO_VALIDATE[field] || field;

            if (!info.exists) {
              return t("{field} is missing", { field: fieldName });
            }
            switch (field) {
              case "target_sys":
              case "targetSys":
                return t(
                  "{field}: {error} is not a valid {field} because it is not one of ['agroforest', 'natural-forest', 'mangrove', 'peatland', 'riparian-area-or-wetland', 'silvopasture', 'woodlot-or-plantation', 'urban-forest']",
                  { field: fieldName, error: info.error }
                );
              case "distr":
                return t(
                  "{field}: {error} is not a valid {field} because it is not one of ['single-line', 'partial', 'full']",
                  { field: fieldName, error: info.error }
                );
              case "num_trees":
              case "numTrees":
                return t("{field} {error} tree count is missing", {
                  field: fieldName,
                  error: info.error || ""
                });
              case "practice":
                return t(
                  "{field}: {error} is not a valid {field} because it is not one of ['tree-planting', 'direct-seeding', 'assisted-natural-regeneration']",
                  { field: fieldName, error: info.error }
                );
              default:
                return info.error ? t("{field}: {error}", { field: fieldName, error: info.error }) : null;
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
        const infoArray: ProjectGoalInfo = typeof extraInfo === "string" ? JSON.parse(extraInfo) : extraInfo;

        // Support both V2 (snake_case) and V3 (camelCase) formats
        const sumAreaSite = infoArray.sumAreaSite ?? infoArray.sum_area_site;
        const percentageSite = infoArray.percentageSite ?? infoArray.percentage_site;
        const totalAreaSite = infoArray.totalAreaSite ?? infoArray.total_area_site;
        const sumAreaProject = infoArray.sumAreaProject ?? infoArray.sum_area_project;
        const percentageProject = infoArray.percentageProject ?? infoArray.percentage_project;
        const totalAreaProject = infoArray.totalAreaProject ?? infoArray.total_area_project;

        const messages: string[] = [];

        if (totalAreaSite === null) {
          messages.push(t("Site Goal: A goal has not been specified."));
        } else if (sumAreaSite !== undefined && percentageSite !== undefined && totalAreaSite !== undefined) {
          // Ensure numeric values are properly formatted
          const formattedSumAreaSite = typeof sumAreaSite === "number" ? sumAreaSite.toFixed(2) : sumAreaSite;
          const formattedPercentageSite =
            typeof percentageSite === "number" ? percentageSite.toFixed(2) : percentageSite;
          const formattedTotalAreaSite = typeof totalAreaSite === "number" ? totalAreaSite.toFixed(2) : totalAreaSite;

          messages.push(
            t(
              "Site Goal: The sum of all site polygons {sum_area_site} ha is {percentage_site}% of total hectares to be restored for this site ({total_area_site} ha)",
              {
                sum_area_site: formattedSumAreaSite,
                percentage_site: formattedPercentageSite,
                total_area_site: formattedTotalAreaSite
              }
            )
          );
        }

        if (totalAreaProject === null) {
          messages.push(t("Project Goal: A goal has not been specified."));
        } else if (sumAreaProject !== undefined && percentageProject !== undefined && totalAreaProject !== undefined) {
          // Ensure numeric values are properly formatted
          const formattedSumAreaProject =
            typeof sumAreaProject === "number" ? sumAreaProject.toFixed(2) : sumAreaProject;
          const formattedPercentageProject =
            typeof percentageProject === "number" ? percentageProject.toFixed(2) : percentageProject;
          const formattedTotalAreaProject =
            typeof totalAreaProject === "number" ? totalAreaProject.toFixed(2) : totalAreaProject;

          messages.push(
            t(
              "Project Goal: The sum of all project polygons {sum_area_project} ha is {percentage_project}% of total hectares to be restored ({total_area_project} ha)",
              {
                sum_area_project: formattedSumAreaProject,
                percentage_project: formattedPercentageProject,
                total_area_project: formattedTotalAreaProject
              }
            )
          );
        }

        return messages;
      } catch {
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

        // Support both V2 (snake_case) and V3 (camelCase) formats
        const errorType = info.errorType || info.error_type;
        const polygonName = info.polygonName || info.polygon_name || "Unnamed Polygon";
        const siteName = info.siteName || info.site_name || "Unnamed Site";
        const providedValue = info.providedValue || info.provided_value;
        const minDate = info.minDate || info.min_date;
        const currentDate = info.currentDate || info.current_date;
        const siteStartDate = info.siteStartDate || info.site_start_date;
        const allowedRange = info.allowedRange || info.allowed_range;

        switch (errorType) {
          case "MISSING_VALUE":
            return [
              t("Plant Start Date is missing for polygon {polygon_name} in site {site_name}", {
                polygon_name: polygonName,
                site_name: siteName
              })
            ];
          case "INVALID_FORMAT":
            return [
              t(
                "Invalid format for Plant Start Date ({provided_value}) for polygon {polygon_name} in site {site_name}",
                {
                  provided_value: providedValue,
                  polygon_name: polygonName,
                  site_name: siteName
                }
              )
            ];
          case "DATE_TOO_EARLY":
            return [
              t(
                "Plant Start Date ({provided_value}) for polygon {polygon_name} in site {site_name} is before the minimum allowed date ({min_date})",
                {
                  provided_value: providedValue,
                  polygon_name: polygonName,
                  site_name: siteName,
                  min_date: minDate
                }
              )
            ];
          case "DATE_IN_FUTURE":
            return [
              t(
                "Plant Start Date ({provided_value}) for polygon {polygon_name} in site {site_name} is in the future (current date: {current_date})",
                {
                  provided_value: providedValue,
                  polygon_name: polygonName,
                  site_name: siteName,
                  current_date: currentDate
                }
              )
            ];
          case "DATE_OUTSIDE_SITE_RANGE":
            return [
              t(
                "Plant Start Date ({provided_value}) for polygon {polygon_name} in site {site_name} should be within two years of the site's establishment date ({site_start_date}). Allowed range: {min_date} to {max_date}",
                {
                  provided_value: providedValue,
                  polygon_name: polygonName,
                  site_name: siteName,
                  site_start_date: siteStartDate,
                  min_date: allowedRange?.min,
                  max_date: allowedRange?.max
                }
              )
            ];
          case "PARSE_ERROR":
            return [
              t("Error parsing Plant Start Date ({provided_value}) for polygon {polygon_name} in site {site_name}", {
                provided_value: providedValue,
                polygon_name: polygonName,
                site_name: siteName
              })
            ];
          default:
            return [
              t("Invalid Plant Start Date for polygon {polygon_name} in site {site_name}", {
                polygon_name: polygonName,
                site_name: siteName
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
