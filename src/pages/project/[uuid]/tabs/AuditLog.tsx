import { useEffect, useState } from "react";
import { When } from "react-if";

import AuditLogSiteTabSelection from "@/admin/components/ResourceTabs/AuditLogTab/components/AuditLogSiteTabSelection";
import SiteAuditLogEntityStatus from "@/admin/components/ResourceTabs/AuditLogTab/components/SiteAuditLogEntityStatus";
import SiteAuditLogEntityStatusSide from "@/admin/components/ResourceTabs/AuditLogTab/components/SiteAuditLogEntityStatusSide";
import SiteAuditLogProjectStatus from "@/admin/components/ResourceTabs/AuditLogTab/components/SiteAuditLogProjectStatus";
import PageBody from "@/components/extensive/PageElements/Body/PageBody";
import PageCard from "@/components/extensive/PageElements/Card/PageCard";
import PageColumn from "@/components/extensive/PageElements/Column/PageColumn";
import PageRow from "@/components/extensive/PageElements/Row/PageRow";
import LoadingContainer from "@/components/generic/Loading/LoadingContainer";
import { PROJECT } from "@/constants/entities";
import useAuditLogActions from "@/hooks/AuditStatus/useAuditLogActions";
import { Entity } from "@/types/common";

interface ReportingTasksProps {
  project: any;
  label?: string;
  entity?: Entity["entityName"];
  refresh?: () => void;
  ennableChangeStatus?: number;
}

const AuditLog = ({
  label,
  entity,
  project,
  refresh: refreshProject,
  ennableChangeStatus,
  ...rest
}: ReportingTasksProps) => {
  const ButtonStates = {
    PROJECTS: 0,
    SITE: 1,
    POLYGON: 2
  };
  const [buttonToggle, setButtonToggle] = useState(ButtonStates.PROJECTS);

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
    buttonToggle,
    entityLevel: PROJECT
  });

  useEffect(() => {
    refetch();
    loadEntityList();
  }, [buttonToggle]);

  return (
    <PageBody>
      <PageRow>
        <PageColumn>
          <LoadingContainer wrapInPaper loading={isLoading}>
            <PageCard>
              <div className="flex max-h-[200vh] gap-6 overflow-auto">
                <div className="grid w-[64%] gap-6">
                  <AuditLogSiteTabSelection buttonToggle={buttonToggle} setButtonToggle={setButtonToggle} />
                  <When condition={buttonToggle === ButtonStates.PROJECTS}>
                    <SiteAuditLogProjectStatus record={project} auditLogData={auditLogData} refresh={refetch} />
                  </When>
                  <When condition={buttonToggle !== ButtonStates.PROJECTS}>
                    <SiteAuditLogEntityStatus
                      record={selected}
                      auditLogData={auditLogData}
                      refresh={refetch}
                      buttonToggle={buttonToggle}
                      entityType={entityType}
                      viewPD={true}
                    />
                  </When>
                </div>
                <div className="w-[32%] pl-8">
                  <SiteAuditLogEntityStatusSide
                    getValueForStatus={valuesForStatus}
                    progressBarLabels={statusLabels}
                    mutate={mutateEntity}
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
                    checkPolygonsSite={checkPolygonsSite}
                    entityType={entityType}
                    showChangeRequest={true}
                    viewPD={true}
                    buttonToggle={buttonToggle}
                    ennableChangeStatus={ennableChangeStatus}
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
