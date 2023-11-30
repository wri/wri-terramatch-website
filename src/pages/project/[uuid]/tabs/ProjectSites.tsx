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
import { useGetV2ProjectsUUIDSites } from "@/generated/apiComponents";

interface ProjectNurseriesTabProps {
  project: any;
}

const ProjectSitesTab = ({ project }: ProjectNurseriesTabProps) => {
  const t = useT();

  const { data: sites, isLoading } = useGetV2ProjectsUUIDSites(
    {
      pathParams: { uuid: project.uuid }
    },
    {
      keepPreviousData: true
    }
  );

  return (
    <PageBody>
      <PageRow>
        <PageColumn>
          <LoadingContainer wrapInPaper loading={isLoading}>
            <If
              condition={
                //@ts-ignore
                sites?.meta?.unfiltered_total === 0
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
                    href: `/entity/sites/create/${project.framework_uuid}?parent_name=projects&parent_uuid=${project.uuid}`,
                    children: "Add Site"
                  }}
                />
              </Then>
              <Else>
                <PageCard
                  title={t("Project Sites")}
                  subtitle={t(
                    "This table displays all the sites associated with this project. You can use it to keep track of your site approvals."
                  )}
                >
                  <SitesTable project={project} />
                </PageCard>
              </Else>
            </If>
          </LoadingContainer>
        </PageColumn>
      </PageRow>
    </PageBody>
  );
};

export default ProjectSitesTab;
