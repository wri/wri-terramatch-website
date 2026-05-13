import { FC, useEffect } from "react";

import SiteAuditLogEntityStatusSide from "@/admin/components/ResourceTabs/AuditLogTab/components/SiteAuditLogEntityStatusSide";
import SiteAuditLogProjectStatus from "@/admin/components/ResourceTabs/AuditLogTab/components/SiteAuditLogProjectStatus";
import { AuditLogButtonStates } from "@/admin/components/ResourceTabs/AuditLogTab/constants/enum";
import PageBody from "@/components/extensive/PageElements/Body/PageBody";
import PageCard from "@/components/extensive/PageElements/Card/PageCard";
import PageColumn from "@/components/extensive/PageElements/Column/PageColumn";
import PageRow from "@/components/extensive/PageElements/Row/PageRow";
import { ProjectReportFullDto } from "@/generated/v3/entityService/entityServiceSchemas";
import useAuditLogActions from "@/hooks/AuditStatus/useAuditLogActions";

type AuditLogProps = {
  projectReport: ProjectReportFullDto;
};

const PROJECT_REPORT_AUDIT_TOGGLE = AuditLogButtonStates.PROJECT_REPORT;

const AuditLog: FC<AuditLogProps> = ({ projectReport }) => {
  const {
    onStatusChange,
    onChangeRequest,
    valuesForStatus,
    statusLabels,
    entityListItem,
    loadEntityList,
    selected,
    setSelected,
    auditLogData,
    refetch,
    auditData
  } = useAuditLogActions({
    record: projectReport,
    buttonToggle: PROJECT_REPORT_AUDIT_TOGGLE,
    entityLevel: AuditLogButtonStates.PROJECT_REPORT,
    isProjectReport: true
  });

  useEffect(() => {
    refetch();
    loadEntityList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <PageBody>
      <PageRow>
        <PageColumn>
          <PageCard>
            <div className="flex max-h-[200vh] gap-6 overflow-auto mobile:flex-col">
              <div className="grid w-[64%] gap-6 mobile:block mobile:w-full">
                <SiteAuditLogProjectStatus
                  viewPD={true}
                  record={projectReport}
                  auditLogData={auditLogData}
                  auditData={auditData}
                  refresh={refetch}
                />
              </div>
              <div className="w-[32%] pl-8 mobile:w-full">
                <SiteAuditLogEntityStatusSide
                  getValueForStatus={valuesForStatus}
                  progressBarLabels={statusLabels}
                  refresh={() => {
                    refetch();
                    loadEntityList();
                  }}
                  record={selected}
                  polygonList={entityListItem}
                  selectedPolygon={selected}
                  setSelectedPolygon={setSelected}
                  entityType="projectReports"
                  showChangeRequest={false}
                  viewPD={true}
                  onStatusChange={onStatusChange}
                  onChangeRequest={onChangeRequest}
                />
              </div>
            </div>
          </PageCard>
        </PageColumn>
      </PageRow>
      <br />
      <br />
    </PageBody>
  );
};

export default AuditLog;
