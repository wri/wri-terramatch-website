import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { Box, Card, Divider, Stack, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useT } from "@transifex/react";
import { FC } from "react";

import { IconNames } from "@/components/extensive/Icon/Icon";
import Modal from "@/components/extensive/Modal/Modal";
import { ModalId } from "@/components/extensive/Modal/ModalConst";
import { bulkDeleteUserAssociations, useUserAssociations } from "@/connections/UserAssociation";
import { useModalContext } from "@/context/modal.provider";

const ProjectManagersTable: FC<{ project: any }> = ({ project }) => {
  const t = useT();
  const [, { data: associatedUsers }] = useUserAssociations({
    uuid: project.uuid,
    filter: { isManager: true },
    model: "projects"
  });

  const { openModal, closeModal } = useModalContext();

  const confirmDelete = (email_address: string, uuid: string) => {
    openModal(
      ModalId.CONFIRM_DELETE,
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
            bulkDeleteUserAssociations(project.uuid, [uuid]);
            closeModal(ModalId.CONFIRM_DELETE);
          }
        }}
        secondaryButtonProps={{
          children: t("Cancel"),
          onClick: () => closeModal(ModalId.CONFIRM_DELETE)
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

          {associatedUsers == null || associatedUsers.length === 0 ? (
            <Box padding={3}>
              <Typography>This project doesn’t have any project managers.</Typography>
            </Box>
          ) : (
            <DataGrid
              rows={associatedUsers ?? []}
              rowSelection={false}
              columns={[
                {
                  field: "fullName",
                  headerName: "Name",
                  flex: 1,
                  sortable: false,
                  filterable: false
                },
                { field: "emailAddress", headerName: "Email", flex: 1, sortable: false, filterable: false },
                {
                  field: "''",
                  headerName: "",
                  renderCell: params => {
                    return (
                      <div onClick={() => confirmDelete(params.row.emailAddress as string, params.row.uuid as string)}>
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
              getRowId={item => item.uuid || item.emailAddress || ""}
            />
          )}
        </Stack>
      </Card>
    </>
  );
};

export default ProjectManagersTable;
