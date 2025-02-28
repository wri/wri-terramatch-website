import { useState } from "react";
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
import LoadingContainer from "@/components/generic/Loading/LoadingContainer";
import { NURSERY_REPORT, PROJECT_REPORT, SITE_REPORT } from "@/constants/entities";
import { useGetV2TasksUUIDReports } from "@/generated/apiComponents";
import useAuditLogActions from "@/hooks/AuditStatus/useAuditLogActions";
import { SelectedItem } from "@/hooks/AuditStatus/useLoadEntityList";
import { useValueChanged } from "@/hooks/useValueChanged";

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
  const [selectedReport, setSelectedReport] = useState<SelectedItem | null>(null);

  const { data: reportsResponse, isLoading: isLoadingReports } = useGetV2TasksUUIDReports({
    pathParams: { uuid: projectReport.task_uuid }
  });

  const statusActionsMap = {
    [AuditLogButtonStates.PROJECT_REPORT as number]: {
      entityType: PROJECT_REPORT,
      list: reportsResponse?.data
        ?.filter(entity => entity.type == "project-report")
        .map(report => ({
          title: (report?.parent_name ?? "") + " " + "(" + report.report_title + ")",
          uuid: report.uuid,
          status: report.status,
          value: report.uuid,
          meta: report.status,
          poly_id: undefined
        }))
    },
    [AuditLogButtonStates.SITE_REPORT as number]: {
      entityType: SITE_REPORT,
      list: reportsResponse?.data
        ?.filter(entity => entity.type == "site-report")
        .map(report => ({
          title: (report?.parent_name ?? "") + " " + "(" + report.report_title + ")",
          uuid: report.uuid,
          status: report.status,
          value: report.uuid,
          meta: report.status,
          poly_id: undefined
        }))
    },
    [AuditLogButtonStates.NURSERY_REPORT as number]: {
      entityType: NURSERY_REPORT,
      list: reportsResponse?.data
        ?.filter(entity => entity.type == "nursery-report")
        .map(report => ({
          title: (report?.parent_name ?? "") + " " + "(" + report.report_title + ")",
          uuid: report.uuid,
          status: report.status,
          value: report.uuid,
          meta: report.status,
          poly_id: undefined
        }))
    }
  };

  const {
    mutateEntity,
    valuesForStatus,
    statusLabels,
    entityType,
    auditLogData,
    refetch,
    isLoading,
    checkPolygonsSite
  } = useAuditLogActions({
    record: selectedReport,
    buttonToggle,
    entityLevel: buttonToggle
  });

  useValueChanged(isLoadingReports, () => {
    if (!isLoadingReports) {
      console.log("test");
      setSelectedReport(statusActionsMap[buttonToggle].list?.[0] ?? null);
    }
    refetch();
  });

  useValueChanged(buttonToggle, () => {
    if (statusActionsMap[buttonToggle].list) {
      console.log("test1");
      setSelectedReport(statusActionsMap[buttonToggle].list[0] ?? null);
    }
    refetch();
  });

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

  return (
    <PageBody>
      <PageRow>
        <PageColumn>
          <LoadingContainer wrapInPaper loading={isLoading}>
            <PageCard>
              <div className="flex max-h-[200vh] gap-6 overflow-auto">
                <div className="grid w-[64%] gap-6">
                  <AuditLogSiteTabSelection
                    buttonToggle={buttonToggle}
                    setButtonToggle={setButtonToggle}
                    isReport={true}
                    framework={projectReport?.framework_key as string}
                  />
                  <When condition={buttonToggle === ButtonStates.PROJECT_REPORT}>
                    <SiteAuditLogProjectStatus viewPD={true} record={projectReport} auditLogData={auditLogData} />
                  </When>
                  <When condition={buttonToggle !== ButtonStates.PROJECT_REPORT}>
                    <SiteAuditLogEntityStatus
                      record={selectedReport}
                      auditLogData={auditLogData}
                      refresh={refetch}
                      buttonToggle={buttonToggle}
                      entityType={statusActionsMap[buttonToggle].entityType as AuditLogEntity}
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
                      refetch();
                    }}
                    record={selectedReport}
                    polygonList={statusActionsMap[buttonToggle].list}
                    selectedPolygon={selectedReport}
                    setSelectedPolygon={setSelectedReport}
                    checkPolygonsSite={checkPolygonsSite}
                    entityType={verifyEntityReport()}
                    showChangeRequest={false}
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
