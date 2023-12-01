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

        "site-report": singular ? t("Site Report") : t("Site Reports"),
        "site-reports": singular ? t("Site Report") : t("Site Reports"),

        "nursery-report": singular ? t("Nursery Report") : t("Nursery Reports"),
        "nursery-reports": singular ? t("Nursery Report") : t("Nursery Reports")
      };

      return mapping[name];
    }
  };
};
