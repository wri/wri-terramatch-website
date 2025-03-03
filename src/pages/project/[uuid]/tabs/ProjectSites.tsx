import { useT } from "@transifex/react";
import Link from "next/link";
import { Else, If, Then } from "react-if";

import EmptyState from "@/components/elements/EmptyState/EmptyState";
import { IconNames } from "@/components/extensive/Icon/Icon";
import PageBody from "@/components/extensive/PageElements/Body/PageBody";
import PageCard from "@/components/extensive/PageElements/Card/PageCard";
import PageColumn from "@/components/extensive/PageElements/Column/PageColumn";
import PageRow from "@/components/extensive/PageElements/Row/PageRow";
import SitesTable from "@/components/extensive/Tables/SitesTable";
import LoadingContainer from "@/components/generic/Loading/LoadingContainer";
import { useSiteIndex } from "@/connections/Entity";
import { ProjectFullDto } from "@/generated/v3/entityService/entityServiceSchemas";

interface ProjectNurseriesTabProps {
  project: ProjectFullDto;
}

const ProjectSitesTab = ({ project }: ProjectNurseriesTabProps) => {
  const t = useT();

  const [isLoaded, { entities: sites }] = useSiteIndex({ filter: { projectUuid: project.uuid } as any });

  return (
    <PageBody>
      <PageRow>
        <PageColumn>
          <LoadingContainer wrapInPaper loading={!isLoaded}>
            <If
              condition={
                //@ts-ignore
                sites?.length === 0
              }
            >
              <Then>
                <EmptyState
                  iconProps={{ name: IconNames.DOCUMENT_CIRCLE, className: "fill-success" }}
                  title={t("No Sites Added")}
                  subtitle={t(
                    "You haven't added any sites yet. To see them listed here and track their approval process, create one using the button bellow."
                  )}
                  ctaProps={{
                    as: Link,
                    href: `/entity/sites/create/${project.frameworkUuid}?parent_name=projects&parent_uuid=${project.uuid}`,
                    children: "Add Site"
                  }}
                />
              </Then>
              <Else>
                <PageCard title={t("Project Sites")}>
                  <SitesTable project={project} />
                </PageCard>
              </Else>
            </If>
          </LoadingContainer>
        </PageColumn>
      </PageRow>
      <br />
      <br />
    </PageBody>
  );
};

export default ProjectSitesTab;
