import { useT } from "@transifex/react";
import Link from "next/link";
import { useState } from "react";
import { When } from "react-if";

import AuditLogSiteTabSelection from "@/admin/components/ResourceTabs/AuditLogTab/components/AuditLogSiteTabSelection";
import SiteAuditLogEntityStatus from "@/admin/components/ResourceTabs/AuditLogTab/components/SiteAuditLogEntityStatus";
import SiteAuditLogEntityStatusSide from "@/admin/components/ResourceTabs/AuditLogTab/components/SiteAuditLogEntityStatusSide";
import { AuditLogButtonStates } from "@/admin/components/ResourceTabs/AuditLogTab/constants/enum";
import { AuditLogEntityEnum } from "@/admin/components/ResourceTabs/AuditLogTab/constants/types";
import Text from "@/components/elements/Text/Text";
import PageBody from "@/components/extensive/PageElements/Body/PageBody";
import PageCard from "@/components/extensive/PageElements/Card/PageCard";
import PageColumn from "@/components/extensive/PageElements/Column/PageColumn";
import PageRow from "@/components/extensive/PageElements/Row/PageRow";
import LoadingContainer from "@/components/generic/Loading/LoadingContainer";
import { useFullProject } from "@/connections/Entity";
import useAuditLogActions from "@/hooks/AuditStatus/useAuditLogActions";
import { useValueChanged } from "@/hooks/useValueChanged";

interface ReportingTasksProps {
  disturbanceReport: any;
  label?: string;
  refresh?: () => void;
  enableChangeStatus?: number;
}

const AuditLog = ({
  label,
  disturbanceReport,
  refresh: refreshDisturbanceReport,
  enableChangeStatus,
  ...rest
}: ReportingTasksProps) => {
  const t = useT();
  const ButtonStates = {
    PROJECTS: 0,
    DISTURBANCE_REPORT: 8
  };
  const [buttonToggle, setButtonToggle] = useState(AuditLogButtonStates.DISTURBANCE_REPORT);
  const projectLevel = buttonToggle === AuditLogButtonStates.PROJECT;
  const disturbanceReportLevel = buttonToggle === AuditLogButtonStates.DISTURBANCE_REPORT;
  const [, { data: project }] = useFullProject({ id: disturbanceReport?.projectUuid! });
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
    record: projectLevel ? project : disturbanceReport,
    buttonToggle,
    entityLevel: AuditLogButtonStates.DISTURBANCE_REPORT
  });

  useValueChanged(buttonToggle, () => {
    refetch();
    loadEntityList();
  });

  const entityTypeDisturbanceReport = disturbanceReportLevel ? AuditLogEntityEnum.Disturbance_Report : entityType;

  return (
    <PageBody>
      <PageRow>
        <PageColumn>
          <LoadingContainer wrapInPaper loading={isLoading}>
            <PageCard>
              <div className="flex max-h-[200vh] gap-6 overflow-auto mobile:flex-col">
                <div className="grid w-[64%] gap-6 mobile:w-full">
                  <AuditLogSiteTabSelection
                    buttonToggle={buttonToggle}
                    setButtonToggle={setButtonToggle}
                    framework={disturbanceReport?.frameworkKey}
                    entityLevel={AuditLogButtonStates.DISTURBANCE_REPORT}
                  />
                  <When condition={buttonToggle === ButtonStates.PROJECTS}>
                    <Text variant="text-24-bold">Project Status</Text>
                    <Text variant="text-14-light" className="mb-4">
                      {t("Update the project status, view updates, or add comments")}
                    </Text>
                    <Link
                      className="!mb-[25vh] !w-2/5 !rounded-lg !border-2 !border-solid !border-primary-500 !bg-white !px-4 !py-[10.5px] !text-center !text-xs !font-bold !uppercase !leading-[normal] !text-primary-500 hover:!bg-grey-900 disabled:!border-transparent disabled:!bg-grey-750 disabled:!text-grey-730 lg:!mb-[40vh] lg:!text-sm wide:!text-base"
                      href={`/project/${disturbanceReport?.projectUuid}?tab=audit-log`}
                    >
                      {t("OPEN PROJECT AUDIT LOG")}
                    </Link>
                  </When>
                  <When condition={buttonToggle !== ButtonStates.PROJECTS}>
                    <SiteAuditLogEntityStatus
                      record={selected}
                      auditLogData={auditLogData}
                      refresh={refetch}
                      buttonToggle={buttonToggle}
                      entityType={entityTypeDisturbanceReport}
                      viewPD={true}
                    />
                  </When>
                </div>
                <div className="w-[32%] pl-8 mobile:w-full">
                  <SiteAuditLogEntityStatusSide
                    getValueForStatus={valuesForStatus}
                    progressBarLabels={statusLabels}
                    mutate={mutateEntity}
                    entityType={entityTypeDisturbanceReport}
                    refresh={() => {
                      loadEntityList();
                      refetch();
                      refreshDisturbanceReport?.();
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
