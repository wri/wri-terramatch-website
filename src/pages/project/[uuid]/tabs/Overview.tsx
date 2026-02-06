import { useT } from "@transifex/react";
import Link from "next/link";
import { useState } from "react";

import Button from "@/components/elements/Button/Button";
import OverviewMapArea from "@/components/elements/Map-mapbox/components/OverviewMapArea";
import { downloadProjectSitePolygonsGeoJson } from "@/components/elements/Map-mapbox/utils";
import PageBody from "@/components/extensive/PageElements/Body/PageBody";
import PageCard from "@/components/extensive/PageElements/Card/PageCard";
import PageColumn from "@/components/extensive/PageElements/Column/PageColumn";
import PageRow from "@/components/extensive/PageElements/Row/PageRow";
import InlineLoader from "@/components/generic/Loading/InlineLoader";
import { ProjectFullDto } from "@/generated/v3/entityService/entityServiceSchemas";
import GoalsAndProgressEntityTab from "@/pages/site/[uuid]/components/GoalsAndProgressEntityTab";
import Log from "@/utils/log";

interface ProjectOverviewTabProps {
  project: ProjectFullDto;
}

const ProjectOverviewTab = ({ project }: ProjectOverviewTabProps) => {
  const t = useT();
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownloadPolygons = async () => {
    if (!project?.uuid || !project?.name) return;

    setIsDownloading(true);
    try {
      await downloadProjectSitePolygonsGeoJson(project.uuid, project.name, {
        includeExtendedData: true
      });
    } catch (error) {
      Log.error("Failed to download project polygons:", error);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <PageBody>
      <PageRow>
        <PageCard
          title={t("Progress & Goals")}
          headerChildren={
            <Button
              as={Link}
              variant="secondary"
              className="m-auto"
              href={`/project/${project.uuid}?tab=goals`}
              shallow
            >
              {t("View all")}
            </Button>
          }
        >
          <GoalsAndProgressEntityTab entity={project} project />
        </PageCard>
      </PageRow>
      <PageRow>
        <PageColumn>
          <PageCard
            title={t("Project Area")}
            headerChildren={
              <div className="flex gap-2">
                <Button variant="secondary" onClick={handleDownloadPolygons} disabled={isDownloading}>
                  {t("Download Polygons")}
                  <InlineLoader loading={isDownloading} />
                </Button>
                <Button
                  as={Link}
                  variant="secondary"
                  href={`/entity/sites/create/${project.frameworkKey}?parent_name=projects&parent_uuid=${project.uuid}`}
                >
                  {t("Add New Site")}
                </Button>
              </div>
            }
          >
            <OverviewMapArea entityModel={project} type="projects" />
          </PageCard>
        </PageColumn>
      </PageRow>
      <br />
      <br />
    </PageBody>
  );
};

export default ProjectOverviewTab;
