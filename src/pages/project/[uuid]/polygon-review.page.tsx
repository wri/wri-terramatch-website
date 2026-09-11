import { useRouter } from "next/router";
import { useEffect } from "react";

import { useMyUser } from "@/connections/User";
// SitePageProviders is entity-agnostic (MapAreaProvider + FrameworkProvider + loader); reused here.
import SitePageProviders from "@/pages/site/[uuid]/components/SitePageProviders";

import { useProjectPageLoad } from "./hooks/useProjectPageLoad";
import AdminProjectPolygonReviewShell from "./projectPolygonReview/AdminProjectPolygonReviewShell";

const ProjectPolygonReviewPage = () => {
  const router = useRouter();
  const projectUUID = router.query.uuid as string;

  const [isUserLoaded, { isAdmin }] = useMyUser();
  const { isLoaded, project } = useProjectPageLoad(projectUUID);

  const isAccessDenied = isUserLoaded && !isAdmin;
  useEffect(() => {
    if (isAccessDenied) {
      void router.replace(`/project/${projectUUID}`);
    }
  }, [isAccessDenied, router, projectUUID]);

  if (!isUserLoaded || isAccessDenied) return null;

  return (
    <SitePageProviders frameworkKey={project?.frameworkKey} isLoaded={isLoaded}>
      {project == null ? null : <AdminProjectPolygonReviewShell project={project} />}
    </SitePageProviders>
  );
};

export default ProjectPolygonReviewPage;
