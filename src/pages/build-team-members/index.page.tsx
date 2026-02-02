import { Box, TableCell as ChakraTableCell, TableRow } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { FC, useCallback } from "react";

import CustomTableCell from "@/redesignComponents/dataDisplay/Table/components/TableCell";
import Table from "@/redesignComponents/dataDisplay/Table/Table";
import { RowData } from "@/redesignComponents/dataDisplay/Table/tableUtils";

const BuildTeamMembersPage: FC = () => {
  const t = useT();

  return (
    <Box paddingX={6} paddingY={4}>
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
