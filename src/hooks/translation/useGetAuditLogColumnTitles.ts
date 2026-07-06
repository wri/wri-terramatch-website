import { useT } from "@transifex/react";
import { useMemo } from "react";

export const useGetAuditLogColumnTitles = (entity: string, isAdmin: boolean, fullColumns: boolean) => {
  const t = useT();
  return useMemo(() => {
    if (entity === "site-polygon") {
      if (fullColumns) {
        return isAdmin
          ? [t("Date"), t("User"), t("Action"), t("Comments"), t("Attachments"), ""]
          : [t("Date"), t("User"), t("Action"), t("Comments"), t("Attachments")];
      } else {
        return [t("Date"), t("User"), t("Action")];
      }
    } else {
      return isAdmin
        ? [t("Date"), t("User"), t("Status"), t("Change Request"), t("Comments"), t("Attachments"), ""]
        : [t("Date"), t("User"), t("Status"), t("Change Request"), t("Comments"), t("Attachments")];
    }
  }, [entity, isAdmin, fullColumns, t]);
};
