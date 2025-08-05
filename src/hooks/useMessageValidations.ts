import { useT } from "@transifex/react";
import { useMemo } from "react";

import { useIsAdmin } from "@/hooks/useIsAdmin";
import Log from "@/utils/log";

interface IntersectionInfo {
  intersectSmaller: boolean;
  percentage: number;
  poly_name: string | null;
  site_name: string | null;
}

interface ProjectGoalInfo {
  sum_area_project: number;
  percentage_project: number;
  total_area_project: number;
  sum_area_site: number;
  percentage_site: number;
  total_area_site: number;
}

interface ExtraInfoItem {
  exists: boolean;
  field: string;
  error?: string;
}

interface PlantStartDateInfo {
  error_type: string;
  polygon_uuid: string;
  polygon_name: string;
  site_name: string;
  provided_value?: string;
  min_date?: string;
  current_date?: string;
  site_start_date?: string;
  allowed_range?: {
    min: string;
    max: string;
  };
  error_details?: string;
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
          const infoArray: IntersectionInfo[] = JSON.parse(extraInfo);
          return infoArray.map(({ intersectSmaller, percentage, poly_name, site_name }: IntersectionInfo) => {
            return intersectSmaller
              ? t(
                  "Geometries intersect: approx. {percentage}% of another, smaller polygon ({poly_name}) [in site: {site_name}]",
                  {
                    percentage,
                    poly_name: poly_name || "Unnamed Polygon",
                    site_name: site_name || "Unnamed Site"
                  }
                )
              : t(
                  "Geometries intersect: approx. {percentage}% of this polygon is intersected by polygon: {poly_name} [in site: {site_name}]",
                  {
                    percentage,
                    poly_name: poly_name || "Unnamed Polygon",
                    site_name: site_name || "Unnamed Site"
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
          const infoObject = JSON.parse(extraInfo);
          if (infoObject && typeof infoObject === "object" && "country_name" in infoObject) {
            const countryName = infoObject.country_name || "Unknown Country";
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
    () => (extraInfo: string | undefined) => {
      if (extraInfo == null) return [];
      try {
        const infoArray: ExtraInfoItem[] = JSON.parse(extraInfo);
        console.log("infoArray", infoArray);
        return infoArray
          .filter(info => {
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
                return t("{field} {error} is not a valid number", {
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
    () => (extraInfo: string | undefined) => {
      if (extraInfo == null) return [];
      try {
        const infoArray: ProjectGoalInfo = JSON.parse(extraInfo);
        const {
          sum_area_project,
          percentage_project,
          total_area_project,
          sum_area_site,
          percentage_site,
          total_area_site
        } = infoArray;
        const messages: string[] = [];

        if (total_area_site === null) {
          messages.push(t("Site Goal: A goal has not been specified."));
        } else if (sum_area_site !== undefined && percentage_site !== undefined && total_area_site !== undefined) {
          messages.push(
            t(
              "Site Goal: The sum of all site polygons {sum_area_site} ha is {percentage_site}% of total hectares to be restored for this site ({total_area_site} ha)",
              { sum_area_site, percentage_site, total_area_site }
            )
          );
        }

        if (total_area_project === null) {
          messages.push(t("Project Goal: A goal has not been specified."));
        } else if (
          sum_area_project !== undefined &&
          percentage_project !== undefined &&
          total_area_project !== undefined
        ) {
          messages.push(
            t(
              "Project Goal: The sum of all project polygons {sum_area_project} ha is {percentage_project}% of total hectares to be restored ({total_area_project} ha)",
              { sum_area_project, percentage_project, total_area_project }
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
    () => (extraInfo: string | undefined) => {
      if (extraInfo == null) return [];
      try {
        const info: PlantStartDateInfo = JSON.parse(extraInfo);

        switch (info.error_type) {
          case "MISSING_VALUE":
            return [
              t("Plant Start Date is missing for polygon {polygon_name} in site {site_name}", {
                polygon_name: info.polygon_name || "Unnamed Polygon",
                site_name: info.site_name || "Unnamed Site"
              })
            ];
          case "INVALID_FORMAT":
            return [
              t(
                "Invalid format for Plant Start Date ({provided_value}) for polygon {polygon_name} in site {site_name}",
                {
                  provided_value: info.provided_value,
                  polygon_name: info.polygon_name || "Unnamed Polygon",
                  site_name: info.site_name || "Unnamed Site"
                }
              )
            ];
          case "DATE_TOO_EARLY":
            return [
              t(
                "Plant Start Date ({provided_value}) for polygon {polygon_name} in site {site_name} is before the minimum allowed date ({min_date})",
                {
                  provided_value: info.provided_value,
                  polygon_name: info.polygon_name || "Unnamed Polygon",
                  site_name: info.site_name || "Unnamed Site",
                  min_date: info.min_date
                }
              )
            ];
          case "DATE_IN_FUTURE":
            return [
              t(
                "Plant Start Date ({provided_value}) for polygon {polygon_name} in site {site_name} is in the future (current date: {current_date})",
                {
                  provided_value: info.provided_value,
                  polygon_name: info.polygon_name || "Unnamed Polygon",
                  site_name: info.site_name || "Unnamed Site",
                  current_date: info.current_date
                }
              )
            ];
          case "DATE_OUTSIDE_SITE_RANGE":
            return [
              t(
                "Plant Start Date ({provided_value}) for polygon {polygon_name} in site {site_name} should be within two years of the site's establishment date ({site_start_date}). Allowed range: {min_date} to {max_date}",
                {
                  provided_value: info.provided_value,
                  polygon_name: info.polygon_name || "Unnamed Polygon",
                  site_name: info.site_name || "Unnamed Site",
                  site_start_date: info.site_start_date,
                  min_date: info.allowed_range?.min,
                  max_date: info.allowed_range?.max
                }
              )
            ];
          case "PARSE_ERROR":
            return [
              t("Error parsing Plant Start Date ({provided_value}) for polygon {polygon_name} in site {site_name}", {
                provided_value: info.provided_value,
                polygon_name: info.polygon_name || "Unnamed Polygon",
                site_name: info.site_name || "Unnamed Site"
              })
            ];
          default:
            return [
              t("Invalid Plant Start Date for polygon {polygon_name} in site {site_name}", {
                polygon_name: info.polygon_name || "Unnamed Polygon",
                site_name: info.site_name || "Unnamed Site"
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
    () => (extraInfo: string | undefined, criteria_id: any) => {
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
