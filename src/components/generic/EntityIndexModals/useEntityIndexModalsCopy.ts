import { useT } from "@transifex/react";
import { useMemo } from "react";

import type { EntityIndexModalsCopy } from "./EntityIndexModals";

export type EntityIndexModalsEntity = "site" | "nursery";

export const useEntityIndexModalsCopy = (entity: EntityIndexModalsEntity): EntityIndexModalsCopy => {
  const t = useT();

  return useMemo(() => {
    if (entity === "site") {
      return {
        fallbackName: t("Site"),
        delete: {
          singular: { title: t("Delete site?"), description: t("will be permanently removed.") },
          plural: { title: t("Delete sites?"), description: t("The following sites will be permanently removed.") }
        },
        submit: {
          singular: { title: t("Submit site?"), description: t("Are you sure you want to submit") },
          plural: {
            title: t("Submit sites?"),
            description: t("Are you sure you want to submit the following Sites:")
          }
        },
        submitted: {
          singularTitle: t("Site submitted"),
          pluralTitle: t("Sites submitted"),
          pluralIntro: t("The following Sites")
        }
      };
    }

    return {
      fallbackName: t("Nursery"),
      delete: {
        singular: { title: t("Delete nursery?"), description: t("will be permanently removed.") },
        plural: {
          title: t("Delete nurseries?"),
          description: t("The following nurseries will be permanently removed.")
        }
      },
      submit: {
        singular: { title: t("Submit nursery?"), description: t("Are you sure you want to submit") },
        plural: {
          title: t("Submit nurseries?"),
          description: t("Are you sure you want to submit the following Nurseries:")
        }
      },
      submitted: {
        singularTitle: t("Nursery submitted"),
        pluralTitle: t("Nurseries submitted"),
        pluralIntro: t("The following Nurseries")
      }
    };
  }, [entity, t]);
};

export default useEntityIndexModalsCopy;
