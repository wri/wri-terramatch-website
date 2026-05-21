import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { Box, Card, Divider, Stack, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useT } from "@transifex/react";
import { FC, useMemo } from "react";

import { IconNames } from "@/components/extensive/Icon/Icon";
import Modal from "@/components/extensive/Modal/Modal";
import { ModalId } from "@/components/extensive/Modal/ModalConst";
import { bulkDeleteUserAssociations, useUserAssociations } from "@/connections/UserAssociation";
import { useModalContext } from "@/context/modal.provider";
import { TranslatedText } from "@/i18n/types";

const MonitoringPartnersTable: FC<{ project: any }> = ({ project }: { project: any }) => {
  const t = useT();

  const [, { data: associatedUsers }] = useUserAssociations({
    uuid: project.uuid,
    filter: { isManager: false },
    model: "projects"
  });

  const monitoringPartners = useMemo(() => {
    return (
      associatedUsers?.map(user => ({
        ...user,
        status: user.status === "active" ? "Accepted" : "Pending"
      })) ?? []
    );
  }, [associatedUsers]);

  const { openModal, closeModal } = useModalContext();

  const ModalConfirmDeletePartner = (uuid: string, emailAddress: string) => {
    openModal(
      ModalId.MODAL_CONFIRM_DELETE_PARTNER,
      <Modal
        iconProps={{ name: IconNames.EXCLAMATION_CIRCLE, width: 60, height: 60 }}
        title={"" as TranslatedText}
        content={t("Remove {email_address} as Monitoring Partner to {project_name}?", {
          email_address: emailAddress,
          project_name: project?.name
        })}
        primaryButtonProps={{
          children: t("Confirm"),
          onClick: () => {
            bulkDeleteUserAssociations(project.uuid, [uuid]);
            closeModal(ModalId.MODAL_CONFIRM_DELETE_PARTNER);
          }
        }}
        secondaryButtonProps={{
          children: t("Cancel"),
          onClick: () => closeModal(ModalId.MODAL_CONFIRM_DELETE_PARTNER)
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

          {monitoringPartners?.length === 0 ? (
            <Box padding={3}>
              <Typography>This project doesn’t have monitoring partners</Typography>
            </Box>
          ) : (
            <DataGrid
              rows={monitoringPartners ?? []}
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
                { field: "status", headerName: "Status", sortable: false, filterable: false },
                {
                  field: "''",
                  headerName: "",
                  renderCell: params => {
                    return (
                      <div
                        onClick={() => ModalConfirmDeletePartner(params.row.uuid, params.row.emailAddress as string)}
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
              getRowId={item => item.uuid || item.emailAddress || ""}
            />
          )}
        </Stack>
      </Card>
    </>
  );
};

export default MonitoringPartnersTable;
