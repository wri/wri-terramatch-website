import { useT } from "@transifex/react";

import { Option } from "@/types/common";

export const getEntitiesOptions = (t: typeof useT | Function = (t: string) => t) =>
  [
    {
      value: "projects",
      title: t("Project")
    },
    {
      value: "sites",
      title: t("Site")
    },
    {
      value: "nurseries",
      title: t("Nursery")
    },
    {
      value: "project-reports",
      title: t("Project Reports")
    },
    {
      value: "site-reports",
      title: t("Site Reports")
    },
    {
      value: "nursery-reports",
      title: t("Nursery Reports")
    }
  ] as Option[];
