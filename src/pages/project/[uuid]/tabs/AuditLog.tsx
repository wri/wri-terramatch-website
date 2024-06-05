import { useEffect, useState } from "react";
import { When } from "react-if";

import { convertDateFormat } from "@/admin/apiProvider/utils/entryFormat";
import AuditLogSiteTabSelection from "@/admin/components/ResourceTabs/AuditLogTab/AuditLogSiteTabSelection";
import SiteAuditLogEntityStatus from "@/admin/components/ResourceTabs/AuditLogTab/components/SiteAuditLogEntityStatus";
import SiteAuditLogEntityStatusSide from "@/admin/components/ResourceTabs/AuditLogTab/components/SiteAuditLogEntityStatusSide";
import SiteAuditLogProjectStatus from "@/admin/components/ResourceTabs/AuditLogTab/components/SiteAuditLogProjectStatus";
import PageBody from "@/components/extensive/PageElements/Body/PageBody";
import PageCard from "@/components/extensive/PageElements/Card/PageCard";
import PageColumn from "@/components/extensive/PageElements/Column/PageColumn";
import PageRow from "@/components/extensive/PageElements/Row/PageRow";
import LoadingContainer from "@/components/generic/Loading/LoadingContainer";
import { PROJECT } from "@/constants/entities";
import { AuditStatusResponse } from "@/generated/apiSchemas";
import useAuditLogActions from "@/hooks/useAuditLogActions";
import { Entity } from "@/types/common";

interface ReportingTasksProps {
  project: any;
  label?: string;
  entity?: Entity["entityName"];
  refresh?: () => void;
}

const AuditLog = ({ label, entity, project, refresh: refreshProject, ...rest }: ReportingTasksProps) => {
  const ButtonStates = {
    PROJECTS: 0,
    SITE: 1,
    POLYGON: 2
  };
  const [buttonToogle, setButtonToogle] = useState(ButtonStates.PROJECTS);

  const {
    mutateEntity,
    valuesForStatus,
    statusLabels,
    entityType,
    entityListItem,
    loadEntityList,
    selected,
    setSelected,
    auditLogData,
    refetch,
    isLoading,
    checkPolygonsSite
  } = useAuditLogActions({
    record: project,
    buttonToogle,
    entityLevel: PROJECT
  });

  useEffect(() => {
    refetch();
    loadEntityList();
  }, [buttonToogle]);

  const recentRequestData = (recentRequest: AuditStatusResponse) => {
    return `From ${recentRequest.first_name ?? ""} ${recentRequest.last_name ?? ""} on
    ${convertDateFormat(recentRequest.date_created) ?? ""}`;
  };

  return (
    <PageBody>
      <PageRow>
        <PageColumn>
          <LoadingContainer wrapInPaper loading={isLoading}>
            <PageCard>
              <div className="flex max-h-[200vh] gap-6 overflow-auto">
                <div className="grid w-[64.5%] gap-6">
                  <AuditLogSiteTabSelection buttonToogle={buttonToogle} setButtonToogle={setButtonToogle} />
                  <When condition={buttonToogle === ButtonStates.PROJECTS}>
                    <SiteAuditLogProjectStatus record={project} auditLogData={auditLogData} refresh={refetch} />
                  </When>
                  <When condition={buttonToogle !== ButtonStates.PROJECTS}>
                    <SiteAuditLogEntityStatus
                      record={selected}
                      auditLogData={auditLogData}
                      refresh={refetch}
                      buttonToogle={buttonToogle}
                      buttonStates={ButtonStates}
                    />
                  </When>
                </div>
                <div className="w-[33%] pl-8">
                  <SiteAuditLogEntityStatusSide
                    getValueForStatus={valuesForStatus}
                    progressBarLabels={statusLabels}
                    mutate={mutateEntity}
                    recordType={entityType as "Project" | "Site" | "Polygon"}
                    refresh={() => {
                      loadEntityList();
                      refetch();
                      refreshProject && refreshProject();
                    }}
                    record={selected}
                    polygonList={entityListItem}
                    selectedPolygon={selected}
                    setSelectedPolygon={setSelected}
                    auditLogData={auditLogData?.data}
                    recentRequestData={recentRequestData}
                    tab="polygonReview"
                    checkPolygonsSite={checkPolygonsSite}
                    viewPD={true}
                  />
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
