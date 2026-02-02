import { Box, Flex, TableCell as ChakraTableCell, TableRow, Text } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { Modal } from "@worldresources/wri-design-systems";
import { FC, useCallback, useState } from "react";

import Button from "@/redesignComponents/actions/Buttons/Button/Button";
import CustomTableCell from "@/redesignComponents/dataDisplay/Table/components/TableCell";
import Table from "@/redesignComponents/dataDisplay/Table/Table";
import { RowData } from "@/redesignComponents/dataDisplay/Table/tableUtils";
import TextInput from "@/redesignComponents/Forms/Inputs/TextInput";
import { UserAdd } from "@/redesignComponents/foundations/Icons";
import ToolbarTable from "@/redesignComponents/navigation/Toolbar/ToolbarTable";

const BuildTeamMembersPage: FC = () => {
  const t = useT();
  const [isOpenMonitoringPartnerModal, setIsOpenMonitoringPartnerModal] = useState(false);

  const handleCloseModal = useCallback(() => {
    setIsOpenMonitoringPartnerModal(false);
  }, []);

  return (
    <Box paddingX={8} paddingY={6}>
      <Box
        css={{
          "& [data-part='content']": {
            width: "600px",
            maxWidth: "90vw"
          },
          "& [data-part='body']": {
            padding: "32px"
          }
        }}
      >
        <Modal
          open={isOpenMonitoringPartnerModal}
          onClose={handleCloseModal}
          size="xlarge"
          content={
            <Box className="flex flex-col gap-4">
              <Text fontSize="24px" textAlign="center" fontWeight="bold">
                INVITE MONITORING PARTNER
              </Text>
              <Text fontSize="14px" textAlign="center">
                Here, you can invite someone to create a TerraMatch account as an observer. This will allow them to
                access all your project data and reports.
              </Text>
              <TextInput label="Email Address" name="email" placeholder="Enter your email address" />
              <Flex justify="space-between">
                <Button variant="secondary" onClick={handleCloseModal}>
                  CANCEL
                </Button>
                <Button variant="primary" onClick={() => console.log("Invite Monitoring Partner")}>
                  INVITE MONITORING PARTNER
                </Button>
              </Flex>
            </Box>
          }
          header={<></>}
        />
      </Box>

      <ToolbarTable
        className="!px-0"
        filters={[
          {
            mainActionLabel: "Role",
            variant: "secondary",
            mainActionOnClick: () => console.log("Role"),
            otherActions: [
              { label: "Project Manager", value: "project-manager", onClick: () => console.log("Project Manager") },
              { label: "Team Member", value: "team-member", onClick: () => console.log("Team Member") }
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
          onClick: () => setIsOpenMonitoringPartnerModal(true)
        }}
      />
      <Table
        data={[
          {
            name: "John Doe",
            organization: "WRI",
            email: "name@email.com",
            role: "Project Manager",
            image: "https://i.pravatar.cc/300?img=4&w=640&q=75"
          },
          {
            name: "Jane Doe",
            organization: "WRI",
            email: "name@email.com",
            role: "Team Member",
            image: "https://i.pravatar.cc/300?img=4&w=640&q=71"
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
            role: "Team Member"
          },
          {
            name: "John Doe",
            organization: "WRI",
            email: "name@email.com",
            role: "Team Member"
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
              <ChakraTableCell>{/* Actions column - puedes agregar botones aquí si es necesario */}</ChakraTableCell>
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
