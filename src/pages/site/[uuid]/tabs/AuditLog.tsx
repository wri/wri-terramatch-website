import Link from "next/link";
import { useEffect, useState } from "react";
import { When } from "react-if";

import AuditLogSiteTabSelection from "@/admin/components/ResourceTabs/AuditLogTab/components/AuditLogSiteTabSelection";
import SiteAuditLogEntityStatus from "@/admin/components/ResourceTabs/AuditLogTab/components/SiteAuditLogEntityStatus";
import SiteAuditLogEntityStatusSide from "@/admin/components/ResourceTabs/AuditLogTab/components/SiteAuditLogEntityStatusSide";
import { AuditLogButtonStates } from "@/admin/components/ResourceTabs/AuditLogTab/constants/enum";
import Text from "@/components/elements/Text/Text";
import PageBody from "@/components/extensive/PageElements/Body/PageBody";
import PageCard from "@/components/extensive/PageElements/Card/PageCard";
import PageColumn from "@/components/extensive/PageElements/Column/PageColumn";
import PageRow from "@/components/extensive/PageElements/Row/PageRow";
import LoadingContainer from "@/components/generic/Loading/LoadingContainer";
import { SITE } from "@/constants/entities";
import useAuditLogActions from "@/hooks/AuditStatus/useAuditLogActions";
import { Entity } from "@/types/common";

interface ReportingTasksProps {
  site: any;
  label?: string;
  entity?: Entity["entityName"];
  refresh?: () => void;
  ennableChangeStatus?: number;
}

const AuditLog = ({ label, entity, site, refresh: refreshSite, ennableChangeStatus, ...rest }: ReportingTasksProps) => {
  const ButtonStates = {
    PROJECTS: 0,
    SITE: 1,
    POLYGON: 2
  };
  const [buttonToggle, setButtonToggle] = useState(AuditLogButtonStates.SITE);

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
    record: site,
    buttonToggle,
    entityLevel: SITE
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
                    <Text variant="text-24-bold">Project Status</Text>
                    <Text variant="text-14-light" className="mb-4">
                      Update the site status, view updates, or add comments
                    </Text>
                    <Link
                      className="!mb-[25vh] !w-2/5 !rounded-lg !border-2 !border-solid !border-primary-500 !bg-white !px-4 !py-[10.5px] !text-xs !font-bold !uppercase !leading-[normal] !text-primary-500 hover:!bg-grey-900 disabled:!border-transparent disabled:!bg-grey-750 disabled:!text-grey-730 lg:!mb-[40vh] lg:!text-sm wide:!text-base"
                      href={`/project/${site?.project?.uuid}?tab=audit-log`}
                    >
                      OPEN PROJECT AUDIT LOG
                    </Link>
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
                    entityType={entityType}
                    refresh={() => {
                      loadEntityList();
                      refetch();
                      refreshSite?.();
                    }}
                    record={selected}
                    polygonList={entityListItem}
                    selectedPolygon={selected}
                    setSelectedPolygon={setSelected}
                    auditLogData={auditLogData?.data}
                    checkPolygonsSite={checkPolygonsSite}
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
