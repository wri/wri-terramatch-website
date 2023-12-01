import { useT } from "@transifex/react";
import Link from "next/link";
import { Else, If, Then } from "react-if";

import EmptyState from "@/components/elements/EmptyState/EmptyState";
import { IconNames } from "@/components/extensive/Icon/Icon";
import PageBody from "@/components/extensive/PageElements/Body/PageBody";
import PageCard from "@/components/extensive/PageElements/Card/PageCard";
import PageColumn from "@/components/extensive/PageElements/Column/PageColumn";
import PageRow from "@/components/extensive/PageElements/Row/PageRow";
import NurseriesTable from "@/components/extensive/Tables/NurseriesTable";
import LoadingContainer from "@/components/generic/Loading/LoadingContainer";
import { useGetV2ProjectsUUIDNurseries } from "@/generated/apiComponents";

interface ProjectNurseriesTabProps {
  project: any;
}

const ProjectNurseriesTab = ({ project }: ProjectNurseriesTabProps) => {
  const t = useT();
  const { data: nurseries, isLoading } = useGetV2ProjectsUUIDNurseries(
    {
      pathParams: { uuid: project.uuid }
    },
    { keepPreviousData: true }
  );

  return (
    <PageBody>
      <PageRow>
        <PageColumn>
          <LoadingContainer wrapInPaper loading={isLoading}>
            <If
              condition={
                //@ts-ignore
                nurseries?.meta?.unfiltered_total === 0
              }
            >
              <Then>
                <EmptyState
                  iconProps={{ name: IconNames.DOCUMENT_CIRCLE, className: "fill-success" }}
                  title={t("No Nurseries Added")}
                  subtitle={t(
                    "You haven't added any nurseries yet. To see them listed here and track their approval process, create one using the button bellow."
                  )}
                  ctaProps={{
                    as: Link,
                    href: `/entity/nurseries/create/${project.framework_uuid}?parent_name=projects&parent_uuid=${project.uuid}`,
                    children: "Add Nursery"
                  }}
                />
              </Then>
              <Else>
                <PageCard
                  title={t("Project Nurseries")}
                  subtitle={t(
                    "This table displays all the nurseries associated with this project. You can use it to keep track of your nursery approvals."
                  )}
                >
                  <NurseriesTable project={project} />
                </PageCard>
              </Else>
            </If>
          </LoadingContainer>
        </PageColumn>
      </PageRow>
    </PageBody>
  );
};

export default ProjectNurseriesTab;
