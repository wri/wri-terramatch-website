import { Grid, Stack } from "@mui/material";
import { FC, useEffect, useState } from "react";
import { Button, Link, TabbedShowLayout, TabProps, useBasename, useShowContext } from "react-admin";

import modules from "@/admin/modules";
import Text from "@/components/elements/Text/Text";
import { DISTURBANCE_REPORT, NURSERY_REPORT, PROJECT_REPORT, SITE_REPORT } from "@/constants/entities";
import useAuditLogActions from "@/hooks/AuditStatus/useAuditLogActions";

import AuditLogSiteTabSelection from "./components/AuditLogSiteTabSelection";
import AuditLogTable from "./components/AuditLogTable";
import SiteAuditLogEntityStatus from "./components/SiteAuditLogEntityStatus";
import SiteAuditLogEntityStatusSide from "./components/SiteAuditLogEntityStatusSide";
import SiteAuditLogProjectStatus from "./components/SiteAuditLogProjectStatus";
import { AuditLogButtonStates } from "./constants/enum";

interface IProps extends Omit<TabProps, "label" | "children"> {
  label?: string;
  entity?: number;
}

const ReverseButtonStates2: { [key: number]: string } = {
  0: "project",
  1: "site",
  2: "site-polygon",
  3: "nursery",
  4: "project-reports",
  5: "site-reports",
  6: "nursery-reports",
  7: "disturbance-reports"
};

const AuditLogTab: FC<IProps> = ({ label, entity, ...rest }) => {
  const { record, isLoading } = useShowContext();
  const [buttonToggle, setButtonToggle] = useState(entity);
  const basename = useBasename();
  const isProjectReport = entity == AuditLogButtonStates.PROJECT_REPORT;
  const isNurseryToggle = buttonToggle == AuditLogButtonStates.NURSERY;
  const showOpenEntity = ["nursery-reports", "site-reports", "disturbance-reports"].includes(
    ReverseButtonStates2[entity!]
  );
  const reportsLevel = buttonToggle === AuditLogButtonStates.PROJECT_REPORT && showOpenEntity;

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
    checkPolygonsSite,
    auditData
  } = useAuditLogActions({
    record: reportsLevel ? record.project_report : record,
    buttonToggle,
    entityLevel: entity,
    isProjectReport
  });
  useEffect(() => {
    refetch();
    loadEntityList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [buttonToggle]);
  const formatUrl = () => {
    switch (ReverseButtonStates2[buttonToggle!]) {
      case "project-reports":
        return `/${modules.projectReport.ResourceName}/${selected?.uuid}/show/4`;
      case "site-reports":
        return `/${modules.siteReport.ResourceName}/${selected?.uuid}/show/4`;
      case "nursery-reports":
        return `/${modules.nurseryReport.ResourceName}/${selected?.uuid}/show/4`;
      default:
        return "";
    }
  };
  const isSite = buttonToggle === AuditLogButtonStates.SITE;
  const redirectTo = `${basename}${
    isProjectReport
      ? formatUrl()
      : isNurseryToggle
      ? `/${modules.nursery.ResourceName}/${selected?.uuid}/show/4`
      : `/${modules.site.ResourceName}/${selected?.uuid}/show/6`
  }`;
  const title = () => selected?.title ?? selected?.name ?? record?.report_title;

  const verifyEntity = ["nursery"].some(word => ReverseButtonStates2[entity!].includes(word));

  const verifyEntityReport = () => {
    switch (
      ReverseButtonStates2[
        isProjectReport || showOpenEntity
          ? buttonToggle == AuditLogButtonStates.DISTURBANCE_REPORT
            ? buttonToggle! - 1
            : buttonToggle!
          : entity!
      ]
    ) {
      case "project-reports":
        return PROJECT_REPORT;
      case "site-reports":
        return SITE_REPORT;
      case "nursery-reports":
        return NURSERY_REPORT;
      case "disturbance-reports":
        return DISTURBANCE_REPORT;
      default:
        return entityType;
    }
  };
  return isLoading ? null : (
    <TabbedShowLayout.Tab label={label ?? "Audit log"} {...rest}>
      <Grid spacing={2} container className="max-h-[200vh] overflow-auto">
        <Grid xs={8}>
          <Stack gap={4} className="pl-8 pt-9">
            {!verifyEntity &&
              entity != AuditLogButtonStates.SITE_REPORT &&
              entity != AuditLogButtonStates.DISTURBANCE_REPORT - 1 && (
                <AuditLogSiteTabSelection
                  buttonToggle={buttonToggle!}
                  setButtonToggle={setButtonToggle}
                  framework={record?.framework_key ?? record?.frameworkKey}
                  isReport={isProjectReport}
                  entityLevel={entity}
                  existNurseries={(record.totalNurseries ?? record.nursery_reports_count) > 0}
                />
              )}
            {showOpenEntity && (
              <AuditLogSiteTabSelection
                buttonToggle={buttonToggle!}
                setButtonToggle={setButtonToggle}
                framework={record?.framework_key ?? record?.frameworkKey}
                entityLevel={entity}
                isAdmin={true}
              />
            )}
            {buttonToggle === AuditLogButtonStates.PROJECT_REPORT && showOpenEntity ? (
              <>
                <Text variant="text-24-bold">Project Report Status</Text>
                <Text variant="text-14-light" className="mb-4">
                  Update all report statuses, view updates, and add comments.
                </Text>
                <Button
                  className="!mb-[25vh] !w-2/5 !rounded-lg !border-2 !border-solid !border-primary-500 !bg-white !px-4 !py-[10.5px] text-center !text-xs !font-bold !uppercase !leading-[normal] !text-primary-500 hover:!bg-grey-900 disabled:!border-transparent disabled:!bg-grey-750 disabled:!text-grey-730 lg:!mb-[40vh] lg:!text-sm wide:!text-base"
                  component={Link}
                  to={`${basename}/${modules.projectReport.ResourceName}/${record?.project_report?.uuid}/show/4`}
                  fullWidth
                  label="OPEN PROJECT REPORT AUDIT LOG"
                />
              </>
            ) : null}
            {((buttonToggle === AuditLogButtonStates.PROJECT && record?.project != null) ||
              (buttonToggle === AuditLogButtonStates.PROJECT && record?.projectName != null)) &&
            !verifyEntity ? (
              <>
                <Text variant="text-24-bold">Project Status</Text>
                <Text variant="text-14-light" className="mb-4">
                  Update the site status, view updates, or add comments
                </Text>
                <Button
                  className="!mb-[25vh] !w-2/5 !rounded-lg !border-2 !border-solid !border-primary-500 !bg-white !px-4 !py-[10.5px] text-center !text-xs !font-bold !uppercase !leading-[normal] !text-primary-500 hover:!bg-grey-900 disabled:!border-transparent disabled:!bg-grey-750 disabled:!text-grey-730 lg:!mb-[40vh] lg:!text-sm wide:!text-base"
                  component={Link}
                  to={`${basename}/${modules.project.ResourceName}/${
                    record?.project?.uuid || record?.projectUuid
                  }/show/5`}
                  fullWidth
                  label="OPEN PROJECT AUDIT LOG"
                />
              </>
            ) : null}
            {buttonToggle === AuditLogButtonStates.PROJECT &&
            record?.project == null &&
            buttonToggle === AuditLogButtonStates.PROJECT &&
            record?.projectName == null ? (
              <SiteAuditLogProjectStatus
                record={record}
                auditLogData={auditLogData}
                auditData={auditData}
                refresh={refetch}
              />
            ) : null}
            {(buttonToggle !== AuditLogButtonStates.PROJECT || verifyEntity) && !reportsLevel ? (
              <SiteAuditLogEntityStatus
                entityType={verifyEntityReport()}
                record={selected}
                auditLogData={auditLogData}
                refresh={refetch}
                buttonToggle={buttonToggle!}
                verifyEntity={verifyEntity}
                auditData={auditData}
                isProjectReport={isProjectReport}
              />
            ) : null}
          </Stack>
        </Grid>
        <Grid xs={4} className="pl-8 pr-4 pt-9">
          <SiteAuditLogEntityStatusSide
            getValueForStatus={valuesForStatus}
            progressBarLabels={statusLabels}
            mutate={mutateEntity}
            entityType={verifyEntityReport()}
            refresh={() => {
              refetch();
              loadEntityList();
            }}
            record={selected}
            polygonList={entityListItem}
            selectedPolygon={selected}
            setSelectedPolygon={setSelected}
            checkPolygonsSite={checkPolygonsSite}
          />
        </Grid>
      </Grid>
      <div className="px-2 py-2">
        {buttonToggle === AuditLogButtonStates.PROJECT &&
        record?.project == null &&
        buttonToggle === AuditLogButtonStates.PROJECT &&
        record?.projectName == null ? (
          <>
            <Text variant="text-16-bold" className="mb-6">
              History and Discussion for {record && record?.name}
            </Text>
            {auditLogData && <AuditLogTable auditLogData={auditLogData} auditData={auditData} refresh={refetch} />}
          </>
        ) : null}
        {(buttonToggle !== AuditLogButtonStates.PROJECT || verifyEntity) && !reportsLevel ? (
          <>
            <div className="mb-6">
              {!isSite && !verifyEntity && !isProjectReport && !isNurseryToggle && (
                <Text variant="text-16-bold">History and Discussion for {title()}</Text>
              )}
              {(isSite || verifyEntity || isProjectReport || isNurseryToggle) && (
                <Text variant="text-16-bold">
                  History and Discussion for{" "}
                  <Link className="text-16-bold !text-[#000000DD]" to={redirectTo}>
                    {title()}
                  </Link>
                </Text>
              )}
            </div>
            {auditLogData == null ? null : (
              <AuditLogTable auditLogData={auditLogData!} auditData={auditData} refresh={refetch} />
            )}
          </>
        ) : null}
      </div>
    </TabbedShowLayout.Tab>
  );
};

export default AuditLogTab;
