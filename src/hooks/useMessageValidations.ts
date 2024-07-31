import { useT } from "@transifex/react";
import { useMemo } from "react";

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
  const fieldsToValidate: any = {
    poly_name: "Polygon Name",
    plantstart: "Plant Start",
    plantend: "Plant End",
    practice: "Restoration Practice",
    target_sys: "Target Land Use System",
    distr: "Tree Distribution",
    num_trees: "Number of Trees"
  };
  const getIntersectionMessages = useMemo(
    () =>
      (extraInfo: any): string[] => {
        if (!extraInfo) return [];
        try {
          const infoArray: IntersectionInfo[] = JSON.parse(extraInfo);
          return infoArray.map(({ intersectSmaller, percentage, poly_name }: IntersectionInfo) => {
            return intersectSmaller
              ? t("Geometries intersect: approx. {percentage}% of another, smaller polygon ({poly_name})", {
                  percentage,
                  poly_name: poly_name || "Unnamed Polygon"
                })
              : t("Geometries intersect: approx. {percentage}% of this polygon is intersected by {poly_name}", {
                  percentage,
                  poly_name: poly_name || "Unnamed Polygon"
                });
          });
        } catch (error) {
          console.error(error);
          return [t("Error parsing extra info.")];
        }
      },
    [t]
  );
  const getDataMessage = useMemo(
    () => (extraInfo: string | undefined) => {
      if (!extraInfo) return [];
      try {
        const infoArray: ExtraInfoItem[] = JSON.parse(extraInfo);
        return infoArray
          .map(info => {
            if (!info.exists) {
              return t("{field} is missing.", { field: fieldsToValidate[info.field] });
            }
            switch (info.field) {
              case "target_sys":
                return t(
                  "{field}: {error} is not a valid {field} because it is not one of ['agroforest', 'natural-forest', 'mangrove', 'peatland', 'riparian-area-or-wetland', 'silvopasture', 'woodlot-or-plantation', 'urban-forest'].",
                  { field: fieldsToValidate[info.field], error: info.error }
                );
              case "distr":
                return t(
                  "{field}: {error} is not a valid {field} because it is not one of ['single-line', 'partial', 'full'].",
                  { field: fieldsToValidate[info.field], error: info.error }
                );
              case "num_trees":
                return t("{field}: {error} is not a valid {field}.", {
                  field: fieldsToValidate[info.field],
                  error: info.error
                });
              case "practice":
                return t(
                  "{field}: {error} is not a valid {field} because it is not one of ['tree-planting', 'direct-seeding', 'assisted-natural-regeneration'].",
                  { field: fieldsToValidate[info.field], error: info.error }
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
    [t]
  );

  const getProjectGoalMessage = useMemo(
    () => (extraInfo: string | undefined) => {
      if (!extraInfo) return [];
      try {
        const infoArray: ProjectGoalInfo = JSON.parse(extraInfo);
        const { sum_area, percentage, total_area_project } = infoArray;
        return [
          t(
            "Project Goal: Sum of all project polygons {sum_area} is {percentage}% of total hectares to be restored {total_area_project}",
            { sum_area, percentage, total_area_project }
          )
        ];
      } catch {
        return [t("Error parsing extra info.")];
      }
    },
    [t]
  );
  const getFormatedExtraInfo = useMemo(
    () => (extraInfo: string | undefined, criteria_id: any) => {
      console.log("Called get formated extra info", extraInfo, criteria_id);
      if (criteria_id === 12) {
        return getProjectGoalMessage(extraInfo);
      } else if (criteria_id === 3) {
        return getIntersectionMessages(extraInfo);
      } else if (criteria_id === 14) {
        return getDataMessage(extraInfo);
      } else {
        return [];
      }
    },
    [getProjectGoalMessage, getIntersectionMessages, getDataMessage]
  );

  return {
    getFormatedExtraInfo
  };
};
