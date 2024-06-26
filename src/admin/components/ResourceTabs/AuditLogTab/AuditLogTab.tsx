import { Grid, Stack } from "@mui/material";
import { FC, useEffect, useState } from "react";
import { Button, Link, TabbedShowLayout, TabProps, useBasename, useShowContext } from "react-admin";
import { When } from "react-if";

import modules from "@/admin/modules";
import Text from "@/components/elements/Text/Text";
import { PROJECT, SITE } from "@/constants/entities";
import useAuditLogActions from "@/hooks/AuditStatus/useAuditLogActions";

import AuditLogSiteTabSelection from "./components/AuditLogSiteTabSelection";
import SiteAuditLogEntityStatus from "./components/SiteAuditLogEntityStatus";
import SiteAuditLogEntityStatusSide from "./components/SiteAuditLogEntityStatusSide";
import SiteAuditLogProjectStatus from "./components/SiteAuditLogProjectStatus";
import { AuditLogButtonStates } from "./constants/enum";

interface IProps extends Omit<TabProps, "label" | "children"> {
  label?: string;
}

const AuditLogTab: FC<IProps> = ({ label, ...rest }) => {
  const { record, isLoading } = useShowContext();
  const [buttonToogle, setButtonToogle] = useState(() => {
    return record?.project ? AuditLogButtonStates.SITE : AuditLogButtonStates.PROJECT;
  });

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
    checkPolygonsSite
  } = useAuditLogActions({
    record,
    buttonToogle,
    entityLevel: record?.project ? SITE : PROJECT
  });

  useEffect(() => {
    refetch();
    loadEntityList();
  }, [buttonToogle]);

  return (
    <When condition={!isLoading}>
      <TabbedShowLayout.Tab label={label ?? "Audit log"} {...rest}>
        <Grid spacing={2} container className="max-h-[200vh] overflow-auto">
          <Grid xs={8}>
            <Stack gap={4} className="pl-8 pt-9">
              <AuditLogSiteTabSelection buttonToogle={buttonToogle} setButtonToogle={setButtonToogle} />
              <When condition={buttonToogle === AuditLogButtonStates.PROJECT && record?.project}>
                <div>
                  <Text variant="text-24-bold">Project Status</Text>
                  <Text variant="text-14-light" className="mb-4">
                    Update the project status, view updates, or add comments
                  </Text>
                </div>
                <Button
                  className="!mb-[25vh] !w-2/5 !rounded-lg !border-2 !border-solid !border-primary-500 !bg-white !px-4 !py-[10.5px] !text-xs !font-bold !uppercase !leading-[normal] !text-primary-500 hover:!bg-grey-900 disabled:!border-transparent disabled:!bg-grey-750 disabled:!text-grey-730 lg:!mb-[40vh] lg:!text-sm wide:!text-base"
                  component={Link}
                  to={`${basename}/${modules.project.ResourceName}/${record?.project?.uuid}/show/5`}
                  fullWidth
                  label="OPEN PROJECT AUDIT LOG"
                />
              </When>
              <When condition={buttonToogle === AuditLogButtonStates.PROJECT && !record?.project}>
                <SiteAuditLogProjectStatus record={record} auditLogData={auditLogData} />
              </When>
              <When condition={buttonToogle !== AuditLogButtonStates.PROJECT}>
                <SiteAuditLogEntityStatus
                  entityType={entityType}
                  record={selected}
                  auditLogData={auditLogData}
                  refresh={refetch}
                  buttonToogle={buttonToogle}
                />
              </When>
            </Stack>
          </Grid>
          <Grid xs={4} className="pl-8 pr-4 pt-9">
            <SiteAuditLogEntityStatusSide
              getValueForStatus={valuesForStatus}
              progressBarLabels={statusLabels}
              mutate={mutateEntity}
              entityType={entityType}
              refresh={() => {
                refetch();
                loadEntityList();
              }}
              record={selected}
              polygonList={entityListItem}
              selectedPolygon={selected}
              setSelectedPolygon={setSelected}
              auditLogData={auditLogData?.data}
              checkPolygonsSite={checkPolygonsSite}
              showChangeRequest={true}
            />
          </Grid>
        </Grid>
      </TabbedShowLayout.Tab>
    </When>
  );
};

export default AuditLogTab;
