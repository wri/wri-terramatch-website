import SiteAuditLogEntityStatus from "@/admin/components/ResourceTabs/AuditLogTab/components/SiteAuditLogEntityStatus";
import SiteAuditLogEntityStatusSide from "@/admin/components/ResourceTabs/AuditLogTab/components/SiteAuditLogEntityStatusSide";
import { AuditLogButtonStates } from "@/admin/components/ResourceTabs/AuditLogTab/constants/enum";
import { AuditLogEntityEnum } from "@/admin/components/ResourceTabs/AuditLogTab/constants/types";
import PageBody from "@/components/extensive/PageElements/Body/PageBody";
import PageCard from "@/components/extensive/PageElements/Card/PageCard";
import PageColumn from "@/components/extensive/PageElements/Column/PageColumn";
import PageRow from "@/components/extensive/PageElements/Row/PageRow";
import LoadingContainer from "@/components/generic/Loading/LoadingContainer";
import useAuditLogActions from "@/hooks/AuditStatus/useAuditLogActions";

interface ReportingTasksProps {
  financialReport: any;
  label?: string;
  refresh?: () => void;
  enableChangeStatus?: number;
}

const AuditLog = ({
  label,
  financialReport,
  refresh: refreshSite,
  enableChangeStatus,
  ...rest
}: ReportingTasksProps) => {
  const {
    mutateEntity,
    valuesForStatus,
    statusLabels,
    entityListItem,
    loadEntityList,
    selected,
    setSelected,
    auditLogData,
    refetch,
    isLoading,
    checkPolygonsSite
  } = useAuditLogActions({
    record: financialReport,
    buttonToggle: AuditLogButtonStates.FINANCIAL_REPORT,
    entityLevel: AuditLogButtonStates.FINANCIAL_REPORT
  });

  return (
    <PageBody>
      <PageRow>
        <PageColumn>
          <LoadingContainer wrapInPaper loading={isLoading}>
            <PageCard>
              <div className="flex max-h-[200vh] gap-6 overflow-auto mobile:flex-col">
                <div className="grid w-[64%] gap-6 mobile:w-full">
                  <SiteAuditLogEntityStatus
                    record={selected}
                    auditLogData={auditLogData}
                    refresh={refetch}
                    buttonToggle={AuditLogButtonStates.FINANCIAL_REPORT}
                    entityType={AuditLogEntityEnum.Financial_Report}
                    viewPD={true}
                  />
                </div>
                <div className="w-[32%] pl-8 mobile:w-full">
                  <SiteAuditLogEntityStatusSide
                    getValueForStatus={valuesForStatus}
                    progressBarLabels={statusLabels}
                    mutate={mutateEntity}
                    entityType={AuditLogEntityEnum.Financial_Report}
                    refresh={() => {
                      loadEntityList();
                      refetch();
                      refreshSite?.();
                    }}
                    record={selected}
                    polygonList={entityListItem}
                    selectedPolygon={selected}
                    setSelectedPolygon={setSelected}
                    checkPolygonsSite={checkPolygonsSite}
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
