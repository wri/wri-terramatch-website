import { Box, TableCell as ChakraTableCell, TableRow } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { FC, useCallback } from "react";

import { IconNames } from "@/components/extensive/Icon/Icon";
import Modal from "@/components/extensive/Modal/Modal";
import { ModalId } from "@/components/extensive/Modal/ModalConst";
import { useModalContext } from "@/context/modal.provider";
import { getThemedColor } from "@/lib/theme";
import ActionCell from "@/redesignComponents/dataDisplay/Table/components/ActionCell";
import CustomTableCell from "@/redesignComponents/dataDisplay/Table/components/TableCell";
import Table from "@/redesignComponents/dataDisplay/Table/Table";
import { RowData } from "@/redesignComponents/dataDisplay/Table/tableUtils";
import { Delete, Edit, UserAdd } from "@/redesignComponents/foundations/Icons";
import ToolbarTable from "@/redesignComponents/navigation/Toolbar/ToolbarTable";

import InviteMonitoringPartnerModal from "../project/[uuid]/components/InviteMonitoringPartnerModal";

const BuildTeamMembersPage: FC = () => {
  const t = useT();
  const { openModal, closeModal } = useModalContext();

  const handleInvite = () => {
    openModal(
      ModalId.INVITE_MONITORING_PSRTNER_MODAL,
      <InviteMonitoringPartnerModal projectUUID="123" onSuccess={() => {}} />
    );
  };

  const ModalConfirmDeletePartner = useCallback(
    (email_address: string) => {
      openModal(
        ModalId.MODAL_CONFIRM_DELETE_PARTNER,
        <Modal
          iconProps={{ name: IconNames.EXCLAMATION_CIRCLE, width: 60, height: 60 }}
          title={"REMOVE MONITORING PARTNER?"}
          content={t(
            "Remove {email_address} as Monitoring Partner to Ecosystem and livelihoods enhancement for People, Nature and Climate in Marsabit County International Tree Foundation??",
            {
              email_address
            }
          )}
          primaryButtonProps={{
            children: t("Confirm"),
            onClick: () => {
              console.log("deletePartner", email_address);
              closeModal(ModalId.MODAL_CONFIRM_DELETE_PARTNER);
            }
          }}
          secondaryButtonProps={{
            children: t("Cancel"),
            onClick: () => closeModal(ModalId.MODAL_CONFIRM_DELETE_PARTNER)
          }}
        />
      );
    },
    [closeModal, openModal, t]
  );

  return (
    <Box paddingX={8} paddingY={6}>
      <ToolbarTable
        className="!px-0"
        filters={[
          {
            mainActionLabel: "Role",
            variant: "secondary",
            mainActionOnClick: () => console.log("Role"),
            otherActions: [
              {
                label: "Monitoring Partner",
                value: "monitoring-partner",
                onClick: handleInvite
              },
              { label: "Project Manager", value: "project-manager", onClick: () => console.log("Project Manager") }
            ]
          }
        ]}
        search={{
          label: "Members",
          placeholder: "Search",
          options: [
            { label: "Name", value: "name" },
            { label: "Organization", value: "organization" },
            { label: "Email", value: "email" },
            { label: "Role", value: "role" }
          ]
        }}
        button={{
          children: "Add Team Member",
          leftIcon: <UserAdd />,
          onClick: handleInvite
        }}
      />
      <Table
        data={[
          {
            name: "John Doe",
            organization: "WRI",
            email: "name@email.com",
            role: "Project Manager",
            image: "https://i.pravatar.cc/300?img=4&w=640&q=75",
            status: "Approved"
          },
          {
            name: "Jane Doe",
            organization: "WRI",
            email: "name@email.com",
            role: "Team Member",
            image: "https://i.pravatar.cc/300?img=4&w=640&q=71",
            status: "Pending"
          },
          {
            name: "John Doe",
            organization: "WRI",
            email: "name@email.com",
            role: "Team Member",
            status: "Pending"
          },
          {
            name: "John Doe",
            organization: "WRI",
            email: "name@email.com",
            role: "Team Member",
            status: "Pending"
          },
          {
            name: "John Doe",
            organization: "WRI",
            email: "name@email.com",
            role: "Team Member",
            status: "Pending"
          },
          {
            name: "John Doe",
            organization: "WRI",
            email: "name@email.com",
            role: "Team Member",
            status: "Pending"
          },
          {
            name: "John Doe",
            organization: "WRI",
            email: "name@email.com",
            role: "Team Member"
          },
          {
            name: "John Doe",
            organization: "WRI",
            email: "name@email.com",
            role: "Team Member",
            status: "Pending"
          },
          {
            name: "John Doe",
            organization: "WRI",
            email: "name@email.com",
            role: "Team Member",
            status: "Pending"
          },
          {
            name: "John Doe",
            organization: "WRI",
            email: "name@email.com",
            role: "Team Member"
          },
          {
            name: "John Doe",
            organization: "WRI",
            email: "name@email.com",
            role: "Team Member"
          },
          {
            name: "John Doe",
            organization: "WRI",
            email: "name@email.com",
            role: "Team Member",
            status: "Pending"
          },
          {
            name: "John Doe",
            organization: "WRI",
            email: "name@email.com",
            role: "Team Member"
          },
          {
            name: "John Doe",
            organization: "WRI",
            email: "name@email.com",
            role: "Team Member",
            status: "Pending"
          },
          {
            name: "John Doe",
            organization: "WRI",
            email: "name@email.com",
            role: "Team Member",
            status: "Pending"
          },
          {
            name: "John Doe",
            organization: "WRI",
            email: "name@email.com",
            role: "Team Member",
            status: "Pending"
          }
        ]}
        renderRow={useCallback(
          (rowData: RowData) => (
            <TableRow className="group">
              <ChakraTableCell>
                <CustomTableCell
                  avatars={[
                    {
                      name: rowData.name,
                      src: (rowData as any).image,
                      ariaLabel: rowData.name
                    }
                  ]}
                />
              </ChakraTableCell>
              <ChakraTableCell>{(rowData as any).organization}</ChakraTableCell>
              <ChakraTableCell>{(rowData as any).email}</ChakraTableCell>
              <ChakraTableCell>{(rowData as any).role}</ChakraTableCell>
              <ChakraTableCell>{(rowData as any).status}</ChakraTableCell>
              <ChakraTableCell>
                <ActionCell
                  button={{
                    children: "Edit",
                    onClick: () => console.log("Edit"),
                    leftIcon: (
                      <Edit
                        className="!text-theme-neutral-900"
                        css={{
                          "& svg path": {
                            fill: getThemedColor("neutral", 900) + " !important",
                            color: getThemedColor("neutral", 900) + " !important"
                          }
                        }}
                      />
                    )
                  }}
                  buttonSecondary={{
                    children: "Remove",
                    variant: "secondary",
                    onClick: () => ModalConfirmDeletePartner((rowData as any).email as string),
                    leftIcon: (
                      <Delete
                        className="!text-theme-error-500"
                        css={{
                          "& svg path": {
                            fill: getThemedColor("error", 500) + " !important",
                            color: getThemedColor("error", 500) + " !important"
                          }
                        }}
                      />
                    ),
                    className: "!text-theme-error-900 !border-theme-error-300 !bg-theme-error-100",
                    size: "small"
                  }}
                />
              </ChakraTableCell>
            </TableRow>
          ),
          [ModalConfirmDeletePartner]
        )}
        columns={[
          {
            key: "name",
            label: t("Name"),
            sortable: true
          },
          {
            key: "organization",
            label: t("Organization"),
            sortable: true
          },
          {
            key: "email",
            label: t("Email"),
            sortable: true
          },
          {
            key: "role",
            label: t("Role"),
            sortable: true
          },
          {
            key: "status",
            label: t("Status"),
            sortable: true
          },
          {
            key: "actions",
            label: t(""),
            sortable: false
          }
        ]}
      />
    </Box>
  );
};

export default BuildTeamMembersPage;
