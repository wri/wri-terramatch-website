import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { Box, Card, Divider, Stack, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useT } from "@transifex/react";
import { Else, If, Then } from "react-if";

import Notification from "@/components/elements/Notification/Notification";
import { IconNames } from "@/components/extensive/Icon/Icon";
import Modal from "@/components/extensive/Modal/Modal";
import { useModalContext } from "@/context/modal.provider";
import { GetV2ProjectsUUIDPartnersResponse, useGetV2ProjectsUUIDPartners } from "@/generated/apiComponents";
import { useDeletePartner } from "@/hooks/usePartnerDeletion";

export const MonitoringPartnersTable = ({ project }: { project: any }) => {
  const t = useT();
  const { data: partners, refetch } = useGetV2ProjectsUUIDPartners<{ data: GetV2ProjectsUUIDPartnersResponse }>({
    pathParams: { uuid: project.uuid }
  });

  const { openModal, closeModal } = useModalContext();
  const { notificationStatus, deletePartner } = useDeletePartner(project, refetch);

  const ModalConfirmDeletePartner = (email_address: string) => {
    openModal(
      <Modal
        iconProps={{ name: IconNames.EXCLAMATION_CIRCLE, width: 60, height: 60 }}
        title={""}
        content={t("Remove {email_address} as Monitoring Partner to {project_name}?", {
          email_address,
          project_name: project?.name
        })}
        primaryButtonProps={{
          children: t("Confirm"),
          onClick: () => {
            deletePartner(email_address as string);
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
                  { field: "status", headerName: "Status", sortable: false, filterable: false },
                  {
                    field: "''",
                    headerName: "",
                    renderCell: params => {
                      return (
                        <div onClick={() => ModalConfirmDeletePartner(params.row.email_address as string)}>
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
