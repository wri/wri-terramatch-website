import { Button, Card, Divider, Stack, SxProps, Theme, Typography } from "@mui/material";
import { FC, useState } from "react";
import { Labeled, NumberField, useShowContext } from "react-admin";
import { When } from "react-if";
import { useNavigate } from "react-router";

import { InviteMonitoringPartnerDialog } from "@/admin/components/Dialogs/InviteMonitoringPartnerDialog";
import modules from "@/admin/modules";
import { fetchGetV2ProjectsUUIDENTITYExport } from "@/generated/apiComponents";
import { downloadFileBlob } from "@/utils";

const QuickActions: FC = () => {
  const { record } = useShowContext();
  const [invitePartnerDialogOpen, setInvitePartnerDialogOpen] = useState(false);
  const navigate = useNavigate();

  const handleExport = (entity: "project-reports" | "sites" | "nurseries") => {
    if (!record) return;

    fetchGetV2ProjectsUUIDENTITYExport({
      pathParams: {
        uuid: record.uuid,
        entity
      }
    }).then((response: any) => {
      downloadFileBlob(response, `${record.name} ${entity.replace("-reports", "")} reports.csv`);
    });
  };

  const handleNavigate = (view: keyof typeof modules) => {
    if (!record) return;

    const queryParams = new URLSearchParams({
      displayedFilters: JSON.stringify({ project_uuid: true }),
      filter: JSON.stringify({ project_uuid: record.uuid }),
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
          <NumberField source="total_sites" />
        </Labeled>
        <Button variant="outlined" onClick={() => handleNavigate("site")}>
          View Sites
        </Button>
        <Button variant="outlined" onClick={() => handleExport("sites")}>
          Export Site Reports
        </Button>
        <Divider sx={{ marginBottom: 2 }} />
      </Stack>

      <When condition={record?.framework_key !== "ppc"}>
        <Stack gap={3}>
          <Labeled label="Total Nurseries" sx={inlineLabelSx}>
            <NumberField source="total_nurseries" />
          </Labeled>
          <Button variant="outlined" onClick={() => handleNavigate("nursery")}>
            View Nurseries
          </Button>
          <Button variant="outlined" onClick={() => handleExport("nurseries")}>
            Export Nursery Reports
          </Button>
          <Divider sx={{ marginBottom: 2 }} />
        </Stack>
      </When>

      <Stack gap={3}>
        <Labeled label="Total Project Reports" sx={inlineLabelSx}>
          <NumberField source="total_project_reports" />
        </Labeled>
        <Labeled label="Total Overdue Reports" sx={inlineLabelSx}>
          <NumberField source="total_overdue_reports" />
        </Labeled>
        <Button variant="outlined" onClick={() => handleNavigate("projectReport")}>
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
      </Stack>
      <InviteMonitoringPartnerDialog
        open={invitePartnerDialogOpen}
        handleClose={() => setInvitePartnerDialogOpen(false)}
      />
    </Card>
  );
};

export default QuickActions;
