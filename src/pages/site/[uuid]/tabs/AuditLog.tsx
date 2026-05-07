import { FC, useState } from "react";

import AuditLogSiteTabSelection from "@/admin/components/ResourceTabs/AuditLogTab/components/AuditLogSiteTabSelection";
import SiteAuditLogEntityStatus from "@/admin/components/ResourceTabs/AuditLogTab/components/SiteAuditLogEntityStatus";
import SiteAuditLogEntityStatusSide from "@/admin/components/ResourceTabs/AuditLogTab/components/SiteAuditLogEntityStatusSide";
import { AuditLogButtonStates } from "@/admin/components/ResourceTabs/AuditLogTab/constants/enum";
import PageBody from "@/components/extensive/PageElements/Body/PageBody";
import PageCard from "@/components/extensive/PageElements/Card/PageCard";
import PageColumn from "@/components/extensive/PageElements/Column/PageColumn";
import PageRow from "@/components/extensive/PageElements/Row/PageRow";
import LoadingContainer from "@/components/generic/Loading/LoadingContainer";
import { SiteFullDto } from "@/generated/v3/entityService/entityServiceSchemas";
import useAuditLogActions from "@/hooks/AuditStatus/useAuditLogActions";
import { useValueChanged } from "@/hooks/useValueChanged";

type AuditLogProps = {
  site: SiteFullDto;
  refresh?: () => void;
};

const AuditLog: FC<AuditLogProps> = ({ site, refresh: refreshSite }) => {
  const [buttonToggle, setButtonToggle] = useState(AuditLogButtonStates.SITE);

  const {
    onStatusChange,
    onChangeRequest,
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
    entityLevel: AuditLogButtonStates.SITE
  });

  useValueChanged(buttonToggle, () => {
    refetch();
    loadEntityList();
  });

  return (
    <PageBody>
      <PageRow>
        <PageColumn>
          <LoadingContainer wrapInPaper loading={isLoading}>
            <PageCard>
              <div className="flex max-h-[200vh] gap-6 overflow-auto mobile:flex-col">
                <div className="grid w-[64%] gap-6 mobile:block mobile:w-full">
                  <AuditLogSiteTabSelection
                    buttonToggle={buttonToggle}
                    setButtonToggle={setButtonToggle}
                    framework={site.frameworkKey ?? undefined}
                    entityLevel={AuditLogButtonStates.SITE}
                  />
                  <SiteAuditLogEntityStatus
                    record={selected}
                    auditLogData={auditLogData}
                    refresh={refetch}
                    buttonToggle={buttonToggle}
                    entityType={entityType}
                    viewPD={true}
                  />
                </div>
                <div className="w-[32%] pl-8 mobile:w-full">
                  <SiteAuditLogEntityStatusSide
                    getValueForStatus={valuesForStatus}
                    progressBarLabels={statusLabels}
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
                    checkPolygonsSite={checkPolygonsSite}
                    showChangeRequest={false}
                    viewPD={true}
                    onStatusChange={onStatusChange}
                    onChangeRequest={onChangeRequest}
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
