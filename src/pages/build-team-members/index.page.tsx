import { Box, TableCell as ChakraTableCell, TableRow } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { FC, useCallback } from "react";

import { ModalId } from "@/components/extensive/Modal/ModalConst";
import { useModalContext } from "@/context/modal.provider";
import ActionCell from "@/redesignComponents/dataDisplay/Table/components/ActionCell";
import CustomTableCell from "@/redesignComponents/dataDisplay/Table/components/TableCell";
import Table from "@/redesignComponents/dataDisplay/Table/Table";
import { RowData } from "@/redesignComponents/dataDisplay/Table/tableUtils";
import { UserAdd } from "@/redesignComponents/foundations/Icons";
import ToolbarTable from "@/redesignComponents/navigation/Toolbar/ToolbarTable";

import InviteMonitoringPartnerModal from "../project/[uuid]/components/InviteMonitoringPartnerModal";

const BuildTeamMembersPage: FC = () => {
  const t = useT();
  const { openModal } = useModalContext();

  const handleInvite = () => {
    openModal(
      ModalId.INVITE_MONITORING_PSRTNER_MODAL,
      <InviteMonitoringPartnerModal projectUUID="123" onSuccess={() => {}} />
    );
  };

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
            <TableRow>
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
                    children: "View",
                    onClick: () => console.log("View")
                  }}
                  onButtonIconClick={() => console.log("View")}
                />
              </ChakraTableCell>
            </TableRow>
          ),
          []
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
            label: t("Actions"),
            sortable: false
          }
        ]}
      />
    </Box>
  );
};

export default BuildTeamMembersPage;
