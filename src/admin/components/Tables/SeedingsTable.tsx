import { Card, Divider, Typography } from "@mui/material";
import { Box, Stack } from "@mui/system";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { FC } from "react";
import { Else, If, Then } from "react-if";

import modules from "@/admin/modules";
import { useGetV2SeedingsENTITYUUID } from "@/generated/apiComponents";

type SeedingsTableProps = {
  uuid: string;
  entity: keyof typeof modules | string;
};

const columns: GridColDef[] = [
  {
    field: "name",
    headerName: "Name",
    flex: 1,
    sortable: false,
    filterable: false
  },
  {
    field: "amount",
    headerName: "Amount",
    type: "number",
    flex: 1,
    headerAlign: "left",
    align: "left",
    sortable: false,
    filterable: false
  }
];

const SeedingsTable: FC<SeedingsTableProps> = ({ uuid, entity }) => {
  const { data: rows } = useGetV2SeedingsENTITYUUID({
    pathParams: {
      uuid,
      entity: entity.replace("Report", "-report")
    }
  });

  if (rows?.data == null) return null;

  return (
    <Card>
      <Stack>
        <Box paddingX={3} paddingY={2}>
          <Typography variant="h5">Seedings</Typography>
        </Box>
      </Stack>

      <Divider />

      <If condition={rows.data.length > 0}>
        <Then>
          <DataGrid
            rows={rows.data}
            columns={columns}
            getRowId={row => row.uuid}
            sx={{
              border: "none",
              "& .MuiDataGrid-columnHeader": {
                paddingX: 3
              },
              "& .MuiDataGrid-cell": {
                paddingX: 3
              }
            }}
            pageSizeOptions={[5, 10, 25, 50]}
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: 5 }
              }
            }}
          />
        </Then>
        <Else>
          <Box padding={3}>
            <Typography>No Seedings Recorded</Typography>
          </Box>
        </Else>
      </If>
    </Card>
  );
};

export default SeedingsTable;
