import { FC, useState } from "react";
import { When } from "react-if";

import AuditLogSiteTabSelection from "@/admin/components/ResourceTabs/AuditLogTab/components/AuditLogSiteTabSelection";
import SiteAuditLogEntityStatus from "@/admin/components/ResourceTabs/AuditLogTab/components/SiteAuditLogEntityStatus";
import SiteAuditLogEntityStatusSide from "@/admin/components/ResourceTabs/AuditLogTab/components/SiteAuditLogEntityStatusSide";
import SiteAuditLogProjectStatus from "@/admin/components/ResourceTabs/AuditLogTab/components/SiteAuditLogProjectStatus";
import { AuditLogButtonStates } from "@/admin/components/ResourceTabs/AuditLogTab/constants/enum";
import PageBody from "@/components/extensive/PageElements/Body/PageBody";
import PageCard from "@/components/extensive/PageElements/Card/PageCard";
import PageColumn from "@/components/extensive/PageElements/Column/PageColumn";
import PageRow from "@/components/extensive/PageElements/Row/PageRow";
import LoadingContainer from "@/components/generic/Loading/LoadingContainer";
import { ProjectFullDto } from "@/generated/v3/entityService/entityServiceSchemas";
import useAuditLogActions from "@/hooks/AuditStatus/useAuditLogActions";
import { useValueChanged } from "@/hooks/useValueChanged";

type AuditLogProps = {
  project: ProjectFullDto;
  refresh?: () => void;
};

const AuditLog: FC<AuditLogProps> = ({ project, refresh: refreshProject }) => {
  const ButtonStates = {
    PROJECTS: 0,
    SITE: 1,
    POLYGON: 2
  };
  const [buttonToggle, setButtonToggle] = useState(ButtonStates.PROJECTS);

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
    record: project,
    buttonToggle,
    entityLevel: AuditLogButtonStates.PROJECT
  });

  useValueChanged(buttonToggle, () => {
    refetch();
    loadEntityList();
  });

  return (
    <PageBody className="bg-theme-neutral-200 pt-5 text-darkCustom">
      <PageRow className="mx-0 w-full !max-w-full px-6">
        <PageColumn>
          <LoadingContainer wrapInPaper loading={isLoading}>
            <PageCard>
              <div className="flex max-h-[200vh] gap-6 overflow-auto mobile:flex-col">
                <div className="grid w-[64%] gap-6 mobile:block mobile:w-full">
                  <AuditLogSiteTabSelection
                    buttonToggle={buttonToggle}
                    setButtonToggle={setButtonToggle}
                    framework={project?.frameworkKey as string}
                    entityLevel={AuditLogButtonStates.PROJECT}
                    existNurseries={project?.totalNurseries > 0}
                  />
                  <When condition={buttonToggle === ButtonStates.PROJECTS}>
                    <SiteAuditLogProjectStatus viewPD={true} record={project} auditLogData={auditLogData} />
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
                <div className="w-[32%] pl-8 mobile:w-full">
                  <SiteAuditLogEntityStatusSide
                    getValueForStatus={valuesForStatus}
                    progressBarLabels={statusLabels}
                    refresh={() => {
                      loadEntityList();
                      refetch();
                      refreshProject?.();
                    }}
                    record={selected}
                    polygonList={entityListItem}
                    selectedPolygon={selected}
                    setSelectedPolygon={setSelected}
                    checkPolygonsSite={checkPolygonsSite}
                    entityType={entityType}
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
