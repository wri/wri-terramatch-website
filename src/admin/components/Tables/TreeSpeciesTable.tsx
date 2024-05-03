import { Card, Divider, Typography } from "@mui/material";
import { Box, Stack } from "@mui/system";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { FC } from "react";
import { Else, If, Then } from "react-if";

import modules from "@/admin/modules";
import Text from "@/components/elements/Text/Text";
import { useGetV2TreeSpeciesEntityUUID } from "@/generated/apiComponents";

type TreeSpeciesTableProps = {
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

const TreeSpeciesTable: FC<TreeSpeciesTableProps> = ({ uuid, entity }) => {
  const { data: rows } = useGetV2TreeSpeciesEntityUUID({
    pathParams: {
      uuid,
      entity: entity.replace("Report", "-report")
    }
  });

  if (!rows || !rows.data) return null;

  return (
    <Card className="!shadow-none">
      <Stack>
        <Box paddingX={3} paddingY={2}>
          <Text variant="text-16-semibold" className="text-darkCustom">
            Tree Species
          </Text>
        </Box>

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
              <Typography>No Tree Species Recorded</Typography>
            </Box>
          </Else>
        </If>
      </Stack>
    </Card>
  );
};

export default TreeSpeciesTable;
