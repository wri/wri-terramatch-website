import { Box, Card, Divider, Stack, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { Else, If, Then } from "react-if";

import { GetV2ProjectsUUIDPartnersResponse, useGetV2ProjectsUUIDPartners } from "@/generated/apiComponents";

export const MonitoringPartnersTable = ({ projectUUID }: { projectUUID: string }) => {
  const { data: partners } = useGetV2ProjectsUUIDPartners<{ data: GetV2ProjectsUUIDPartnersResponse }>({
    pathParams: { uuid: projectUUID }
  });

  return (
    <Card>
      <Stack>
        <Box paddingX={3} paddingY={2}>
          <Typography variant="h5">Monitored partners</Typography>
        </Box>

        <Divider />

        <If condition={partners?.data.length === 0}>
          <Then>
            <Box padding={3}>
              <Typography>This project doesn’t have monitoring partners</Typography>
            </Box>
          </Then>
          <Else>
            <DataGrid
              rows={partners?.data || []}
              rowSelection={false}
              columns={[
                {
                  field: "first_name",
                  headerName: "Name",
                  renderCell: params => `${params.row.first_name || ""} ${params.row.last_name || ""}`,
                  flex: 1,
                  sortable: false,
                  filterable: false
                },
                { field: "email_address", headerName: "Email", flex: 1, sortable: false, filterable: false },
                { field: "status", headerName: "Status", sortable: false, filterable: false }
              ]}
              getRowId={item => item.uuid || item.email_address || ""}
            />
          </Else>
        </If>
      </Stack>
    </Card>
  );
};
