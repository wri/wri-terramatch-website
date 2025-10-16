import { useT } from "@transifex/react";

import { EntityName, SingularEntityName } from "@/types/common";

export const useGetReadableEntityName = () => {
  const t = useT();

  return {
    getReadableEntityName: (name: EntityName | SingularEntityName, singular?: boolean) => {
      const mapping: any = {
        projects: singular ? t("Project") : t("Projects"),
        project: singular ? t("Project") : t("Projects"),

        sites: singular ? t("Site") : t("Sites"),
        site: singular ? t("Site") : t("Sites"),

        nurseries: singular ? t("Nursery") : t("Nurseries"),
        nursery: singular ? t("Nursery") : t("Nurseries"),

        "project-report": singular ? t("Project Report") : t("Project Reports"),
        "project-reports": singular ? t("Project Report") : t("Project Reports"),
        projectReports: singular ? t("Project Report") : t("Project Reports"),

        "site-report": singular ? t("Site Report") : t("Site Reports"),
        "site-reports": singular ? t("Site Report") : t("Site Reports"),
        siteReports: singular ? t("Site Report") : t("Site Reports"),

        "nursery-report": singular ? t("Nursery Report") : t("Nursery Reports"),
        "nursery-reports": singular ? t("Nursery Report") : t("Nursery Reports"),
        nurseryReports: singular ? t("Nursery Report") : t("Nursery Reports"),

        "financial-report": singular ? t("Financial Report") : t("Financial Reports"),
        "financial-reports": singular ? t("Financial Report") : t("Financial Reports"),
        financialReports: singular ? t("Financial Report") : t("Financial Reports"),

        "disturbance-report": singular ? t("Disturbance Report") : t("Disturbance Reports"),
        "disturbance-reports": singular ? t("Disturbance Report") : t("Disturbance Reports"),
        disturbanceReports: singular ? t("Disturbance Report") : t("Disturbance Reports")
      };

      return mapping[name];
    }
  };
};
