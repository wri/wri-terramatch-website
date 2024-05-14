import { useState } from "react";
import { useShowContext } from "react-admin";
import { When } from "react-if";

import SiteAuditLogPolygonStatus from "@/admin/components/ResourceTabs/AuditLogTab/components/SiteAuditLogPolygonStatus";
import SiteAuditLogPolygonStatusSide from "@/admin/components/ResourceTabs/AuditLogTab/components/SiteAuditLogPolygonStatusSide";
import SiteAuditLogProjectStatus from "@/admin/components/ResourceTabs/AuditLogTab/components/SiteAuditLogProjectStatus";
import SiteAuditLogProjectStatusSide from "@/admin/components/ResourceTabs/AuditLogTab/components/SiteAuditLogProjectStatusSide";
import SiteAuditLogSiteStatus from "@/admin/components/ResourceTabs/AuditLogTab/components/SiteAuditLogSiteStatus";
import SiteAuditLogSiteStatusSide from "@/admin/components/ResourceTabs/AuditLogTab/components/SiteAuditLogSiteStatusSide";
import Button from "@/components/elements/Button/Button";
import PageBody from "@/components/extensive/PageElements/Body/PageBody";
import PageCard from "@/components/extensive/PageElements/Card/PageCard";
import PageColumn from "@/components/extensive/PageElements/Column/PageColumn";
import PageRow from "@/components/extensive/PageElements/Row/PageRow";
import LoadingContainer from "@/components/generic/Loading/LoadingContainer";
import { useGetV2ENTITYUUIDReports } from "@/generated/apiComponents";
import { Entity } from "@/types/common";

interface ReportingTasksProps {
  project: any;
  label?: string;
  entity?: Entity["entityName"];
}

const AuditLog = ({ label, entity, project, ...rest }: ReportingTasksProps) => {
  const ctx = useShowContext();
  const ButtonStates = {
    PROJECTS: 0,
    SITE: 1,
    POLYGON: 2
  };
  const resource = entity ?? ctx.resource;
  const [buttonToogle, setButtonToogle] = useState(ButtonStates.PROJECTS);
  const { data: reports, isLoading } = useGetV2ENTITYUUIDReports(
    {
      pathParams: { entity: "projects", uuid: "1" }
    },
    { keepPreviousData: true }
  );
  console.log(reports, "REPORTS");

  return (
    <PageBody>
      <PageRow>
        <PageColumn>
          <LoadingContainer wrapInPaper loading={isLoading}>
            <PageCard>
              <div className="flex max-h-[200vh] gap-6 overflow-auto">
                <div className="grid w-2/3 gap-6">
                  <div className="gap-6">
                    <div className="mb-6 flex w-fit gap-1 rounded-lg bg-neutral-200 p-1">
                      <Button
                        variant={`${buttonToogle === ButtonStates.PROJECTS ? "white-toggle" : "transparent-toggle"}`}
                        onClick={() => setButtonToogle(ButtonStates.PROJECTS)}
                      >
                        Project Status x
                      </Button>
                      <Button
                        variant={`${buttonToogle === ButtonStates.SITE ? "white-toggle" : "transparent-toggle"}`}
                        onClick={() => setButtonToogle(ButtonStates.SITE)}
                      >
                        Site Status
                      </Button>
                      <Button
                        variant={`${buttonToogle === ButtonStates.POLYGON ? "white-toggle" : "transparent-toggle"}`}
                        onClick={() => setButtonToogle(ButtonStates.POLYGON)}
                      >
                        Polygon Status
                      </Button>
                    </div>
                    <When condition={buttonToogle === ButtonStates.PROJECTS}>
                      <SiteAuditLogProjectStatus resource={resource} />
                    </When>
                    <When condition={buttonToogle === ButtonStates.SITE}>
                      <SiteAuditLogSiteStatus resource={resource} />
                    </When>
                    <When condition={buttonToogle === ButtonStates.POLYGON}>
                      <SiteAuditLogPolygonStatus resource={resource} />
                    </When>
                  </div>
                </div>
                <div className="w-1/3 pl-8">
                  <When condition={buttonToogle === ButtonStates.PROJECTS}>
                    <SiteAuditLogProjectStatusSide />
                  </When>
                  <When condition={buttonToogle === ButtonStates.SITE}>
                    <SiteAuditLogSiteStatusSide />
                  </When>
                  <When condition={buttonToogle === ButtonStates.POLYGON}>
                    <SiteAuditLogPolygonStatusSide />
                  </When>
                </div>
              </div>
            </PageCard>
          </LoadingContainer>
        </PageColumn>
      </PageRow>
      <br />
      <br />
    </PageBody>
  );
};

export default AuditLog;
