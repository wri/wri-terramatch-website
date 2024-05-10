import { Grid, Stack } from "@mui/material";
import { FC, useState } from "react";
import { TabbedShowLayout, TabProps, useShowContext } from "react-admin";
import { When } from "react-if";

import Button from "@/components/elements/Button/Button";
import { Entity } from "@/types/common";

import SiteAuditLogPolygonStatus from "./components/SiteAuditLogPolygonStatus";
import SiteAuditLogPolygonStatusSide from "./components/SiteAuditLogPolygonStatusSide";
import SiteAuditLogProjectStatus from "./components/SiteAuditLogProjectStatus";
import SiteAuditLogProjectStatusSide from "./components/SiteAuditLogProjectStatusSide";
import SiteAuditLogSiteStatus from "./components/SiteAuditLogSiteStatus";
import SiteAuditLogSiteStatusSide from "./components/SiteAuditLogSiteStatusSide";

interface IProps extends Omit<TabProps, "label" | "children"> {
  label?: string;
  entity?: Entity["entityName"];
}

const AuditLogSiteTab: FC<IProps> = ({ label, entity, ...rest }) => {
  const ctx = useShowContext();
  const resource = entity ?? ctx.resource;
  const ButtonStates = {
    PROJECTS: 0,
    SITE: 1,
    POLYGON: 2
  };
  const [buttonToogle, setButtonToogle] = useState(ButtonStates.PROJECTS);

  return (
    <When condition={!ctx.isLoading}>
      <TabbedShowLayout.Tab label={label ?? "Audit log"} {...rest}>
        <Grid spacing={2} container className="max-h-[200vh] overflow-auto">
          <Grid xs={8}>
            <Stack gap={4} className="pt-9 pl-8">
              <div className="flex w-fit gap-1 rounded-lg bg-neutral-200 p-1">
                <Button
                  variant={`${buttonToogle === ButtonStates.PROJECTS ? "white-toggle" : "transparent-toggle"}`}
                  onClick={() => setButtonToogle(ButtonStates.PROJECTS)}
                >
                  Project Status
                </Button>
                <Button
                  variant={`${buttonToogle === ButtonStates.SITE ? "white-toggle" : "transparent-toggle"}`}
                  onClick={() => setButtonToogle(ButtonStates.SITE)}
                >
                  Site Status
                </Button>
                <Button
                  variant={`${buttonToogle === ButtonStates.POLYGON ? "white-toggle" : "transparent-toggle"}`}
                  onClick={() => setButtonToogle(ButtonStates.POLYGON)}
                >
                  Polygon Status
                </Button>
              </div>
              <When condition={buttonToogle === ButtonStates.PROJECTS}>
                <SiteAuditLogProjectStatus resource={resource} uuid={ctx.record.uuid} record={ctx.record} />
              </When>
              <When condition={buttonToogle === ButtonStates.SITE}>
                <SiteAuditLogSiteStatus resource={resource} uuid={ctx.record.uuid} record={ctx.record} />
              </When>
              <When condition={buttonToogle === ButtonStates.POLYGON}>
                <SiteAuditLogPolygonStatus resource={resource} uuid={ctx.record.uuid} record={ctx.record} />
              </When>
            </Stack>
          </Grid>
          <Grid xs={4} className="pt-9 pl-8 pr-4">
            <When condition={buttonToogle === ButtonStates.PROJECTS}>
              <SiteAuditLogProjectStatusSide />
            </When>
            <When condition={buttonToogle === ButtonStates.SITE}>
              <SiteAuditLogSiteStatusSide />
            </When>
            <When condition={buttonToogle === ButtonStates.POLYGON}>
              <SiteAuditLogPolygonStatusSide />
            </When>
          </Grid>
        </Grid>
      </TabbedShowLayout.Tab>
    </When>
  );
};

export default AuditLogSiteTab;
