import { Grid, Stack } from "@mui/material";
import { FC, useEffect, useState } from "react";
import { Button, Link, TabbedShowLayout, TabProps, useBasename, useShowContext } from "react-admin";
import { When } from "react-if";

import modules from "@/admin/modules";
import Text from "@/components/elements/Text/Text";
import { NURSERY_REPORT, PROJECT_REPORT, SITE_REPORT } from "@/constants/entities";
import useAuditLogActions from "@/hooks/AuditStatus/useAuditLogActions";

import AuditLogSiteTabSelection from "./components/AuditLogSiteTabSelection";
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
  6: "nursery-reports"
};

const AuditLogTab: FC<IProps> = ({ label, entity, ...rest }) => {
  const { record, isLoading } = useShowContext();
  const [buttonToggle, setButtonToggle] = useState(entity);
  const basename = useBasename();

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
    record,
    buttonToggle,
    entityLevel: entity
  });

  useEffect(() => {
    refetch();
    loadEntityList();
  }, [buttonToggle]);

  const verifyEntity = ["reports", "nursery"].some(word => ReverseButtonStates2[entity!].includes(word));

  const verifyEntityReport = () => {
    switch (ReverseButtonStates2[entity!]) {
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
    <When condition={!isLoading}>
      <TabbedShowLayout.Tab label={label ?? "Audit log"} {...rest}>
        <Grid spacing={2} container className="max-h-[200vh] overflow-auto">
          <Grid xs={8}>
            <Stack gap={4} className="pl-8 pt-9">
              {!verifyEntity && (
                <AuditLogSiteTabSelection buttonToggle={buttonToggle!} setButtonToggle={setButtonToggle} />
              )}
              <When condition={buttonToggle === AuditLogButtonStates.PROJECT && record?.project && !verifyEntity}>
                <Text variant="text-24-bold">Project Status</Text>
                <Text variant="text-14-light" className="mb-4">
                  Update the site status, view updates, or add comments
                </Text>
                <Button
                  className="!mb-[25vh] !w-2/5 !rounded-lg !border-2 !border-solid !border-primary-500 !bg-white !px-4 !py-[10.5px] text-center !text-xs !font-bold !uppercase !leading-[normal] !text-primary-500 hover:!bg-grey-900 disabled:!border-transparent disabled:!bg-grey-750 disabled:!text-grey-730 lg:!mb-[40vh] lg:!text-sm wide:!text-base"
                  component={Link}
                  to={`${basename}/${modules.project.ResourceName}/${record?.project?.uuid}/show/5`}
                  fullWidth
                  label="OPEN PROJECT AUDIT LOG"
                />
              </When>
              <When condition={buttonToggle === AuditLogButtonStates.PROJECT && !record?.project}>
                <SiteAuditLogProjectStatus
                  record={record}
                  auditLogData={auditLogData}
                  auditData={auditData}
                  refresh={refetch}
                />
              </When>
              <When condition={buttonToggle !== AuditLogButtonStates.PROJECT || verifyEntity}>
                <SiteAuditLogEntityStatus
                  entityType={verifyEntityReport()}
                  record={selected}
                  auditLogData={auditLogData}
                  refresh={refetch}
                  buttonToggle={buttonToggle!}
                  verifyEntity={verifyEntity}
                  auditData={auditData}
                />
              </When>
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
      </TabbedShowLayout.Tab>
    </When>
  );
};

export default AuditLogTab;
