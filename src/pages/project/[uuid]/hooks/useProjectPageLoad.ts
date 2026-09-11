import { useT } from "@transifex/react";
import { showToast } from "@worldresources/wri-design-systems";

import { useFullProject } from "@/connections/Entity";
import { useValueChanged } from "@/hooks/useValueChanged";
import Log from "@/utils/log";

// Project counterpart of useSitePageLoad — loads the full project for the admin polygon-review page.
export const useProjectPageLoad = (projectUUID: string) => {
  const t = useT();
  const [isLoaded, { data: project, loadFailure, refetch }] = useFullProject({ id: projectUUID });

  useValueChanged(isLoaded, () => {
    if (isLoaded && project == null) {
      Log.error("Project not found", { projectUUID, loadFailure });
      showToast({
        label: t("Project not found"),
        type: "error",
        id: "project-not-found",
        placement: "bottom",
        duration: 5000,
        maxWidth: "auto"
      });
    }
  });

  return { isLoaded, project, loadFailure, refetch };
};
