import { useT } from "@transifex/react";
import Link from "next/link";
import { FC } from "react";

import EmptyState from "@/components/elements/EmptyState/EmptyState";
import { DEFAULT_PAGE_SIZE } from "@/components/elements/ServerSideTable/ServerSideTable";
import { IconNames } from "@/components/extensive/Icon/Icon";
import PageBody from "@/components/extensive/PageElements/Body/PageBody";
import PageCard from "@/components/extensive/PageElements/Card/PageCard";
import PageColumn from "@/components/extensive/PageElements/Column/PageColumn";
import PageRow from "@/components/extensive/PageElements/Row/PageRow";
import SitesTable from "@/components/extensive/Tables/SitesTable";
import LoadingContainer from "@/components/generic/Loading/LoadingContainer";
import { useSiteIndex } from "@/connections/Entity";
import { ProjectFullDto } from "@/generated/v3/entityService/entityServiceSchemas";

type ProjectNurseriesTabProps = {
  project: ProjectFullDto;
};

const ProjectSitesTab: FC<ProjectNurseriesTabProps> = ({ project }) => {
  const t = useT();

  const [isLoaded, { indexTotal }] = useSiteIndex({
    filter: { projectUuid: project.uuid },
    pageSize: DEFAULT_PAGE_SIZE,
    pageNumber: 1
  });

  return (
    <PageBody className="bg-theme-neutral-200 pt-5 text-darkCustom">
      <PageRow className="mx-0 w-full !max-w-full px-6">
        <PageColumn>
          <LoadingContainer wrapInPaper loading={!isLoaded}>
            {indexTotal === 0 ? (
              <EmptyState
                iconProps={{ name: IconNames.DOCUMENT_CIRCLE, className: "fill-success" }}
                title={t("No Sites Added")}
                subtitle={t(
                  "You haven't added any sites yet. To see them listed here and track their approval process, create one using the button bellow."
                )}
                ctaProps={{
                  as: Link,
                  href: `/entity/sites/create/${project.frameworkKey}?parent_name=projects&parent_uuid=${project.uuid}`,
                  children: "Add Site"
                }}
              />
            ) : (
              <PageCard title={t("Project Sites")}>
                <SitesTable project={project} alwaysShowPagination />
              </PageCard>
            )}
          </LoadingContainer>
        </PageColumn>
      </PageRow>
      <br />
      <br />
    </PageBody>
  );
};

export default ProjectSitesTab;
