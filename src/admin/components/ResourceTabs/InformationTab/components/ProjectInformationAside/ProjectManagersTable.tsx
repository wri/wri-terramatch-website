import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { Box, Card, Divider, Stack, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useT } from "@transifex/react";
import { Else, If, Then } from "react-if";

import Notification from "@/components/elements/Notification/Notification";
import { IconNames } from "@/components/extensive/Icon/Icon";
import Modal from "@/components/extensive/Modal/Modal";
import { useModalContext } from "@/context/modal.provider";
import { GetV2ProjectsUUIDPartnersResponse, useGetV2ProjectsUUIDManagers } from "@/generated/apiComponents";
import { useDeleteAssociate } from "@/hooks/useDeleteAssociate";

export const ProjectManagersTable = ({ project }: { project: any }) => {
  const t = useT();
  const { data: managers, refetch } = useGetV2ProjectsUUIDManagers<{ data: GetV2ProjectsUUIDPartnersResponse }>({
    pathParams: { uuid: project.uuid }
  });

  const { openModal, closeModal } = useModalContext();
  const { notificationStatus, deletePartner } = useDeleteAssociate("manager", project, refetch);

  const confirmDelete = (email_address: string, uuid: string) => {
    openModal(
      <Modal
        iconProps={{ name: IconNames.EXCLAMATION_CIRCLE, width: 60, height: 60 }}
        title={""}
        content={t("Remove {email_address} as Project Manager for {project_name}?", {
          email_address,
          project_name: project?.name
        })}
        primaryButtonProps={{
          children: t("Confirm"),
          onClick: () => {
            deletePartner(uuid);
            closeModal();
          }
        }}
        secondaryButtonProps={{
          children: t("Cancel"),
          onClick: closeModal
        }}
      />
    );
  };

  return (
    <>
      <Card>
        <Stack>
          <Box paddingX={3} paddingY={2}>
            <Typography variant="h5">Project Managers</Typography>
          </Box>

          <Divider />

          <If condition={managers?.data == null || managers.data.length === 0}>
            <Then>
              <Box padding={3}>
                <Typography>This project doesn’t have any project managers.</Typography>
              </Box>
            </Then>
            <Else>
              <DataGrid
                rows={managers?.data ?? []}
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
                  {
                    field: "''",
                    headerName: "",
                    renderCell: params => {
                      return (
                        <div
                          onClick={() => confirmDelete(params.row.email_address as string, params.row.uuid as string)}
                        >
                          <DeleteOutlineIcon className="cursor-pointer" />
                        </div>
                      );
                    },
                    sortable: false,
                    filterable: false,
                    width: 70,
                    align: "center",
                    disableColumnMenu: true
                  }
                ]}
                getRowId={item => item.uuid || item.email_address || ""}
              />
            </Else>
          </If>
        </Stack>
      </Card>
      <Notification {...notificationStatus} />
    </>
  );
};
