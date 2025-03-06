import { useEffect, useState } from "react";
import { When } from "react-if";

import AuditLogSiteTabSelection from "@/admin/components/ResourceTabs/AuditLogTab/components/AuditLogSiteTabSelection";
import SiteAuditLogEntityStatus from "@/admin/components/ResourceTabs/AuditLogTab/components/SiteAuditLogEntityStatus";
import SiteAuditLogEntityStatusSide from "@/admin/components/ResourceTabs/AuditLogTab/components/SiteAuditLogEntityStatusSide";
import SiteAuditLogProjectStatus from "@/admin/components/ResourceTabs/AuditLogTab/components/SiteAuditLogProjectStatus";
import { AuditLogButtonStates } from "@/admin/components/ResourceTabs/AuditLogTab/constants/enum";
import { AuditLogEntity } from "@/admin/components/ResourceTabs/AuditLogTab/constants/types";
import PageBody from "@/components/extensive/PageElements/Body/PageBody";
import PageCard from "@/components/extensive/PageElements/Card/PageCard";
import PageColumn from "@/components/extensive/PageElements/Column/PageColumn";
import PageRow from "@/components/extensive/PageElements/Row/PageRow";
import { NURSERY_REPORT, PROJECT_REPORT, SITE_REPORT } from "@/constants/entities";
import useAuditLogActions from "@/hooks/AuditStatus/useAuditLogActions";

interface ReportingTasksProps {
  projectReport: any;
  label?: string;
  refresh?: () => void;
  enableChangeStatus?: number;
}

const reportTypesMappging: { [key: number]: string } = {
  4: "project-reports",
  5: "site-reports",
  6: "nursery-reports"
};

const AuditLog = ({
  label,
  projectReport,
  refresh: refreshProject,
  enableChangeStatus,
  ...rest
}: ReportingTasksProps) => {
  const ButtonStates = {
    PROJECT_REPORT: 0,
    SITE_REPORT: 1,
    NURSERY_REPORT: 2
  };
  const [buttonToggle, setButtonToggle] = useState(AuditLogButtonStates.PROJECT_REPORT);

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
    refetch
  } = useAuditLogActions({
    record: projectReport,
    buttonToggle,
    entityLevel: AuditLogButtonStates.PROJECT_REPORT,
    isProjectReport: true
  });

  useEffect(() => {
    refetch();
    loadEntityList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [buttonToggle]);

  const statusActionsMap = {
    [AuditLogButtonStates.PROJECT_REPORT as number]: {
      entityType: PROJECT_REPORT
    },
    [AuditLogButtonStates.SITE_REPORT as number]: {
      entityType: SITE_REPORT
    },
    [AuditLogButtonStates.NURSERY_REPORT as number]: {
      entityType: NURSERY_REPORT
    }
  };

  const verifyEntityReport = () => {
    switch (reportTypesMappging[buttonToggle!]) {
      case "project-reports":
        return PROJECT_REPORT;
      case "site-reports":
        return SITE_REPORT;
      case "nursery-reports":
        return NURSERY_REPORT;
      default:
        return entityType;
    }
  };

  const verifyEntity = ["site-reports", "nursery-reports"].some(word =>
    reportTypesMappging[buttonToggle!].includes(word)
  );

  return (
    <PageBody>
      <PageRow>
        <PageColumn>
          <PageCard>
            <div className="flex max-h-[200vh] gap-6 overflow-auto">
              <div className="grid w-[64%] gap-6">
                <AuditLogSiteTabSelection
                  buttonToggle={buttonToggle}
                  setButtonToggle={setButtonToggle}
                  isReport={true}
                  framework={projectReport?.framework_key as string}
                  existNurseries={projectReport?.nursery_reports_count > 0}
                />
                <When condition={buttonToggle === ButtonStates.PROJECT_REPORT}>
                  <SiteAuditLogProjectStatus viewPD={true} record={projectReport} auditLogData={auditLogData} />
                </When>
                <When condition={buttonToggle !== ButtonStates.PROJECT_REPORT}>
                  <SiteAuditLogEntityStatus
                    record={selected}
                    auditLogData={auditLogData}
                    refresh={refetch}
                    buttonToggle={buttonToggle}
                    entityType={statusActionsMap[buttonToggle].entityType as AuditLogEntity}
                    viewPD={true}
                    verifyEntity={verifyEntity}
                    isProjectReport
                  />
                </When>
              </div>
              <div className="w-[32%] pl-8">
                <SiteAuditLogEntityStatusSide
                  getValueForStatus={valuesForStatus}
                  progressBarLabels={statusLabels}
                  mutate={mutateEntity}
                  refresh={() => {
                    refetch();
                    loadEntityList();
                  }}
                  record={selected}
                  polygonList={entityListItem}
                  selectedPolygon={selected}
                  setSelectedPolygon={setSelected}
                  entityType={verifyEntityReport()}
                  showChangeRequest={false}
                  viewPD={true}
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
