import Link from "next/link";
import { useEffect, useState } from "react";
import { When } from "react-if";

import { convertDateFormat } from "@/admin/apiProvider/utils/entryFormat";
import AuditLogSiteTabSelection from "@/admin/components/ResourceTabs/AuditLogTab/AuditLogSiteTabSelection";
import SiteAuditLogEntityStatus from "@/admin/components/ResourceTabs/AuditLogTab/components/SiteAuditLogEntityStatus";
import SiteAuditLogEntityStatusSide from "@/admin/components/ResourceTabs/AuditLogTab/components/SiteAuditLogEntityStatusSide";
import Text from "@/components/elements/Text/Text";
import PageBody from "@/components/extensive/PageElements/Body/PageBody";
import PageCard from "@/components/extensive/PageElements/Card/PageCard";
import PageColumn from "@/components/extensive/PageElements/Column/PageColumn";
import PageRow from "@/components/extensive/PageElements/Row/PageRow";
import LoadingContainer from "@/components/generic/Loading/LoadingContainer";
import { SITE } from "@/constants/entities";
import { AuditStatusResponse } from "@/generated/apiSchemas";
import useAuditLogActions from "@/hooks/useAuditLogActions";
import { Entity } from "@/types/common";

interface ReportingTasksProps {
  site: any;
  label?: string;
  entity?: Entity["entityName"];
  refresh?: () => void;
}

const AuditLog = ({ label, entity, site, refresh: refreshSite, ...rest }: ReportingTasksProps) => {
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
    record: site,
    buttonToogle,
    entityLevel: SITE
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
                <div className="grid w-2/3 gap-6">
                  <div className="gap-6">
                    <AuditLogSiteTabSelection buttonToogle={buttonToogle} setButtonToogle={setButtonToogle} />
                    <When condition={buttonToogle === ButtonStates.PROJECTS}>
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
                </div>
                <div className="w-1/3 pl-8">
                  <SiteAuditLogEntityStatusSide
                    getValueForStatus={valuesForStatus}
                    progressBarLabels={statusLabels}
                    mutate={mutateEntity}
                    recordType={entityType as "Project" | "Site" | "Polygon"}
                    refresh={() => {
                      loadEntityList();
                      refetch();
                      refreshSite && refreshSite();
                    }}
                    record={selected}
                    polygonList={entityListItem}
                    selectedPolygon={selected}
                    setSelectedPolygon={setSelected}
                    auditLogData={auditLogData?.data}
                    recentRequestData={recentRequestData}
                    tab="polygonReview"
                    checkPolygonsSite={checkPolygonsSite}
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
