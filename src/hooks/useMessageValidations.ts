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
  sumAreaProject: number;
  percentageProject: number;
  totalAreaProject: number;
  sumAreaSite: number;
  percentageSite: number;
  totalAreaSite: number;
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
        const infoArray: ProjectGoalInfo = typeof extraInfo === "string" ? JSON.parse(extraInfo) : extraInfo;
        const { sumAreaProject, percentageProject, totalAreaProject, sumAreaSite, percentageSite, totalAreaSite } =
          infoArray;
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
              "Site Goal: The sum of all site polygons {sumAreaSite} ha is {percentageSite}% of total hectares to be restored for this site ({totalAreaSite} ha)",
              {
                sumAreaSite: formattedSumAreaSite,
                percentageSite: formattedPercentageSite,
                totalAreaSite: formattedTotalAreaSite
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
              "Project Goal: The sum of all project polygons {sumAreaProject} ha is {percentageProject}% of total hectares to be restored ({totalAreaProject} ha)",
              {
                sumAreaProject: formattedSumAreaProject,
                percentageProject: formattedPercentageProject,
                totalAreaProject: formattedTotalAreaProject
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
