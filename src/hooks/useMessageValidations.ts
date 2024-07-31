import { useT } from "@transifex/react";

interface IntersectionInfo {
  intersectSmaller: boolean;
  percentage: number;
  poly_name: string | null;
}

interface ProjectGoalInfo {
  sum_area: number;
  percentage: number;
  total_area_project: number;
}

interface ExtraInfoItem {
  exists: boolean;
  field: string;
  error?: string;
}

export const useMessageValidators = () => {
  const t = useT();

  const getIntersectionMessages = (extraInfo: any): string[] => {
    if (!extraInfo) return [];
    try {
      const infoArray: IntersectionInfo[] = JSON.parse(extraInfo);
      return infoArray.map(({ intersectSmaller, percentage, poly_name }: IntersectionInfo) => {
        return intersectSmaller
          ? t("Geometries intersect: approx. {percentage}% of another, smaller polygon ({poly_name})", {
              percentage,
              poly_name: poly_name || "unknown"
            })
          : t("Geometries intersect: approx. {percentage}% of this polygon is intersected by {poly_name}", {
              percentage,
              poly_name: poly_name || "unknown"
            });
      });
    } catch (error) {
      console.error(error);
      return [t("Error parsing extra info.")];
    }
  };
  const getDataMessage = (extraInfo: string | undefined) => {
    if (!extraInfo) return [];
    try {
      const infoArray: ExtraInfoItem[] = JSON.parse(extraInfo);
      return infoArray
        .map(info => {
          if (info.exists === false) {
            return t("{field} is missing.", { field: info.field });
          } else if (info.exists === true && info.error === "target_sys") {
            return t(
              "{field}: target_sys is not a valid {field} because it is not one of ['agroforest', 'natural-forest', 'mangrove', 'peatland', 'riparian-area-or-wetland', 'silvopasture', 'woodlot-or-plantation', 'urban-forest'].",
              { field: info.field }
            );
          } else if (info.exists === true && info.error === "distr") {
            return t(
              "{field}: distr is not a valid {field} because it is not one of ['single-line', 'partial', 'full'].",
              { field: info.field }
            );
          } else if (info.exists === true && info.error === "num_trees") {
            return t("{field}: num_trees is not a valid {field} because it is not an integer.", { field: info.field });
          } else if (info.exists === true && info.error === "practice") {
            return t(
              "{field}: practice is not a valid {field} because it is not one of ['tree-planting', 'direct-seeding', 'assisted-natural-regeneration'].",
              { field: info.field }
            );
          }
          return null;
        })
        .filter((message): message is string => message !== null);
    } catch {
      return [t("Error parsing extra info.")];
    }
  };

  const getProjectGoalMessage = ({ sum_area, percentage, total_area_project }: ProjectGoalInfo) => {
    return t(
      "Project Goal: Sum of all project polygons {sum_area} is {percentage}% of total hectares to be restored {total_area_project}",
      { sum_area, percentage, total_area_project }
    );
  };
  const getFormatedExtraInfo = (extraInfo: string | undefined, criteria_id: any) => {
    if (criteria_id === 12) {
      return [getProjectGoalMessage(JSON.parse(extraInfo ?? ""))];
    } else if (criteria_id === 3) {
      return getIntersectionMessages(extraInfo);
    } else if (criteria_id === 14) {
      return getDataMessage(extraInfo);
    } else {
      return [];
    }
  };
  return {
    getFormatedExtraInfo
  };
};
