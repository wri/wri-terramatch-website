import { Button, Card, Divider, Stack, SxProps, Theme, Typography } from "@mui/material";
import { FC, useState } from "react";
import { Labeled, NumberField, useShowContext } from "react-admin";
import { useNavigate } from "react-router";

import { AddManagerDialog } from "@/admin/components/Dialogs/AddManagerDialog";
import { InviteMonitoringPartnerDialog } from "@/admin/components/Dialogs/InviteMonitoringPartnerDialog";
import modules from "@/admin/modules";
import { ContextCondition } from "@/context/ContextCondition";
import { Framework } from "@/context/framework.provider";
import { fetchGetV2ProjectsUUIDENTITYExport } from "@/generated/apiComponents";
import { downloadFileBlob } from "@/utils/network";

const QuickActions: FC = () => {
  const { record } = useShowContext();
  const [invitePartnerDialogOpen, setInvitePartnerDialogOpen] = useState(false);
  const [addManagerDialogOpen, setAddManagerDialogOpen] = useState(false);
  const navigate = useNavigate();

  const handleExport = (
    entity: "project-reports" | "sites" | "nurseries" | "shapefiles" | "site-reports" | "nursery-reports"
  ) => {
    if (!record) return;

    fetchGetV2ProjectsUUIDENTITYExport({
      pathParams: {
        uuid: record.uuid,
        entity
      }
    }).then((response: any) => {
      if (entity === "shapefiles") {
        const exportName = `${record.name}_polygons.geojson`;
        if (response instanceof Blob) {
          downloadFileBlob(response, exportName);
        } else {
          const jsonString = JSON.stringify(response, null, 2);
          const fileBlob = new Blob([jsonString], { type: "application/geo+json" });
          downloadFileBlob(fileBlob, exportName);
        }
      } else {
        downloadFileBlob(response, `${record.name} ${entity.replace("-reports", "")} reports.csv`);
      }
    });
  };

  const handleNavigate = (view: keyof typeof modules, params?: object) => {
    if (!record) return;

    const queryParams = new URLSearchParams({
      ...params,
      order: "ASC",
      page: "1",
      perPage: "10",
      sort: "id"
    }).toString();

    navigate(`/${view}?${queryParams}`);
  };

  const inlineLabelSx: SxProps<Theme> = {
    flexDirection: "row",
    justifyContent: "space-between"
  };

  return (
    <Card sx={{ padding: 3.75 }}>
      <Typography variant="h5" marginBottom={2}>
        Quick Actions
      </Typography>

      <Divider sx={{ marginBottom: 2 }} />

      <Stack gap={3}>
        <Labeled label="Total Sites" sx={inlineLabelSx}>
          <NumberField source="totalSites" />
        </Labeled>
        <Button
          variant="outlined"
          onClick={() =>
            handleNavigate("site", {
              displayedFilters: JSON.stringify({ projectUuid: true }),
              filter: JSON.stringify({ projectUuid: record.uuid })
            })
          }
        >
          View Sites
        </Button>
        <Button variant="outlined" onClick={() => handleExport("site-reports")}>
          Export Site Reports
        </Button>
        <Button variant="outlined" onClick={() => handleExport("shapefiles")}>
          Download Polygons
        </Button>
        <Divider sx={{ marginBottom: 2 }} />
      </Stack>

      <ContextCondition frameworksHide={[Framework.PPC]}>
        <Stack gap={3}>
          <Labeled label="Total Nurseries" sx={inlineLabelSx}>
            <NumberField source="totalNurseries" />
          </Labeled>
          <Button
            variant="outlined"
            onClick={() =>
              handleNavigate("nursery", {
                displayedFilters: JSON.stringify({ project_uuid: true }),
                filter: JSON.stringify({ project_uuid: record.uuid })
              })
            }
          >
            View Nurseries
          </Button>
          <Button variant="outlined" onClick={() => handleExport("nursery-reports")}>
            Export Nursery Reports
          </Button>
          <Divider sx={{ marginBottom: 2 }} />
        </Stack>
      </ContextCondition>

      <Stack gap={3}>
        <Labeled label="Total Project Reports" sx={inlineLabelSx}>
          <NumberField source="totalProjectReports" />
        </Labeled>
        <Labeled label="Total Overdue Reports" sx={inlineLabelSx}>
          <NumberField source="totalOverdueReports" />
        </Labeled>
        <Button
          variant="outlined"
          onClick={() =>
            handleNavigate("projectReport", {
              displayedFilters: JSON.stringify({ project_uuid: true }),
              filter: JSON.stringify({ project_uuid: record.uuid })
            })
          }
        >
          View Reports
        </Button>
        <Button variant="outlined" onClick={() => handleExport("project-reports")}>
          Export Project Reports
        </Button>
        <Button variant="outlined" onClick={() => navigate("./4")}>
          Add Monitored Data
        </Button>
        <Button variant="outlined" onClick={() => setInvitePartnerDialogOpen(true)}>
          Add Monitoring partner
        </Button>
        <Button variant="outlined" onClick={() => setAddManagerDialogOpen(true)}>
          Add Project Manager
        </Button>
      </Stack>
      <InviteMonitoringPartnerDialog
        open={invitePartnerDialogOpen}
        handleClose={() => setInvitePartnerDialogOpen(false)}
      />
      <AddManagerDialog open={addManagerDialogOpen} handleClose={() => setAddManagerDialogOpen(false)} />
    </Card>
  );
};

export default QuickActions;
