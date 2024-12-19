import { Card, Divider, Typography } from "@mui/material";
import { Box, Stack } from "@mui/system";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useT } from "@transifex/react";
import { FC } from "react";
import { Else, If, Then } from "react-if";

import Text from "@/components/elements/Text/Text";
import Icon, { IconNames } from "@/components/extensive/Icon/Icon";
import { EstablishmentEntityType } from "@/connections/EstablishmentTrees";
import { useGetV2TreeSpeciesEntityUUID } from "@/generated/apiComponents";

type TreeSpeciesTableTFProps = {
  uuid: string;
  entity: EstablishmentEntityType;
  total?: number;
  totalText?: string;
  title?: string;
  countColumnName?: string;
  collection?: string;
};

const TreeSpeciesTableTF: FC<TreeSpeciesTableTFProps> = ({
  uuid,
  entity,
  total,
  totalText,
  title,
  countColumnName,
  collection = "tree-planted"
}) => {
  const t = useT();
  const { data: rows } = useGetV2TreeSpeciesEntityUUID({
    pathParams: {
      uuid,
      entity: entity?.replace("Report", "-report")!
    }
  });

  const columns: GridColDef[] = [
    {
      field: "name",
      headerName: "SPECIES NAME",
      flex: 1,
      sortable: false,
      filterable: false
    },
    {
      field: "amount",
      headerName: countColumnName ?? "TREE COUNT",
      type: "number",
      flex: 1,
      headerAlign: "left",
      align: "left",
      sortable: false,
      filterable: false
    }
  ];

  if (!rows || !rows.data) return null;

  return (
    <Card className="!shadow-none">
      <Stack>
        <Box paddingX={3} paddingY={2}>
          <Text variant="text-24-bold" className="text-darkCustom">
            {title ?? "N/A"}
          </Text>
        </Box>
        <Box paddingX={3} paddingY={2}>
          <div className="flex items-center gap-1">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#00000008]">
              <Icon name={IconNames.TREE_DASHABOARD} className="text-primary" />
            </div>
            <Text variant="text-16-semibold" className="text-grey-500">
              {totalText}:
            </Text>
            <Text variant="text-24-bold" className="text-black">
              {new Intl.NumberFormat("en-US").format(total!) ?? "N/A"}
            </Text>
          </div>
        </Box>

        <Divider />

        <If condition={rows.data.length > 0}>
          <Then>
            <DataGrid
              rows={rows?.data.filter(row => row.collection == collection) as any}
              columns={columns.map(column =>
                column.field === "name"
                  ? {
                      ...column,
                      renderCell: params => (
                        <div className="flex items-center gap-1">
                          <Text variant="text-14-light" className="text-black">
                            {params?.row?.name}
                          </Text>
                          <div title={t("Non-Scientific Name")}>
                            <Icon
                              name={IconNames.NON_SCIENTIFIC_NAME_CUSTOM}
                              className="min-h-8 min-w-8 h-8 w-8 text-[#092C3C80]"
                            />
                          </div>
                        </div>
                      )
                    }
                  : column
              )}
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
              <Typography>No {title} Recorded</Typography>
            </Box>
          </Else>
        </If>
      </Stack>
    </Card>
  );
};

export default TreeSpeciesTableTF;
