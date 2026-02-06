import { Box, TableCell as ChakraTableCell, TableRow } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { FC, useCallback, useMemo, useState } from "react";

import { IconNames } from "@/components/extensive/Icon/Icon";
import Modal from "@/components/extensive/Modal/Modal";
import { ModalId } from "@/components/extensive/Modal/ModalConst";
import { useModalContext } from "@/context/modal.provider";
import {
  GetV2ProjectsUUIDManagersResponse,
  GetV2ProjectsUUIDPartnersResponse,
  useGetV2ProjectsUUIDManagers,
  useGetV2ProjectsUUIDPartners
} from "@/generated/apiComponents";
import { ProjectFullDto } from "@/generated/v3/entityService/entityServiceSchemas";
import { getThemedColor } from "@/lib/theme";
import ActionCell from "@/redesignComponents/dataDisplay/Table/components/ActionCell";
import CustomTableCell from "@/redesignComponents/dataDisplay/Table/components/TableCell";
import Table from "@/redesignComponents/dataDisplay/Table/Table";
import { RowData } from "@/redesignComponents/dataDisplay/Table/tableUtils";
import { Delete, Edit, UserAdd } from "@/redesignComponents/foundations/Icons";
import ToolbarTable from "@/redesignComponents/navigation/Toolbar/ToolbarTable";

import InviteMonitoringPartnerModal from "../project/[uuid]/components/InviteMonitoringPartnerModal";

interface BuildTeamMembersPageProps {
  project: ProjectFullDto;
}

export const teamMemberRoleChoices = [
  {
    id: "admin-ppc",
    name: "PPC Admin"
  },
  {
    id: "admin-terrafund",
    name: "TerraFund Admin"
  },
  {
    id: "admin-hbf",
    name: "HBF Admin"
  },
  {
    id: "admin-epa-ghana-pilot",
    name: "EPA Ghana Pilot Admin"
  },
  {
    id: "monitoring-partner",
    name: "Monitoring Partner"
  },
  {
    id: "project-manager",
    name: "Project Manager"
  }
];

const teamMembersFormatted = (
  teamMembers: GetV2ProjectsUUIDPartnersResponse | GetV2ProjectsUUIDManagersResponse,
  role: string
) => {
  return teamMembers?.map((member, index) => ({
    name: `${member.first_name} ${member.last_name}`,
    organization: member.organisation?.name,
    email: member.email_address,
    role: role,
    status: member.status,
    image: `https://i.pravatar.cc/300?img=${index}&w=640&q=71`
  }));
};

const BuildTeamMembersPage: FC<BuildTeamMembersPageProps> = ({ project }) => {
  const t = useT();
  const { openModal, closeModal } = useModalContext();
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

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

  const { data: partners } = useGetV2ProjectsUUIDPartners<{
    data: GetV2ProjectsUUIDPartnersResponse;
  }>({
    pathParams: { uuid: project?.uuid ?? "d2c2a1fe-c5e8-435a-b865-00dce7a9809f" }
  });

  const { data: managers } = useGetV2ProjectsUUIDManagers<{ data: GetV2ProjectsUUIDManagersResponse }>({
    pathParams: { uuid: project?.uuid ?? "d2c2a1fe-c5e8-435a-b865-00dce7a9809f" }
  });

  const teamMembers = useMemo(() => {
    const all = [
      ...teamMembersFormatted(partners?.data ?? [], "monitoring-partner"),
      ...teamMembersFormatted(managers?.data ?? [], "project-manager")
    ].filter(member => (selectedRole ? member.role === selectedRole : true));

    if (!searchQuery.trim()) return all;

    const q = searchQuery.trim().toLowerCase();
    return all.filter(
      member =>
        String(member.name ?? "")
          .toLowerCase()
          .includes(q) ||
        String(member.organization ?? "")
          .toLowerCase()
          .includes(q) ||
        String(member.email ?? "")
          .toLowerCase()
          .includes(q) ||
        String(member.role ?? "")
          .toLowerCase()
          .includes(q)
    );
  }, [partners?.data, managers?.data, selectedRole, searchQuery]);

  return (
    <Box paddingX={8} paddingY={6}>
      <ToolbarTable
        className="!px-0"
        filters={[
          {
            mainActionLabel: "Role",
            variant: "secondary",
            mainActionOnClick: () =>
              setSelectedRole(selectedRole === "monitoring-partner" ? "project-manager" : "monitoring-partner"),
            otherActions: [
              {
                label: "Monitoring Partner",
                value: "monitoring-partner",
                onClick: () => setSelectedRole("monitoring-partner")
              },
              { label: "Project Manager", value: "project-manager", onClick: () => setSelectedRole("project-manager") }
            ]
          }
        ]}
        search={{
          label: t("Members"),
          placeholder: t("Search"),
          options: [
            { label: t("Name"), value: "name" },
            { label: t("Organization"), value: "organization" },
            { label: t("Email"), value: "email" },
            { label: t("Role"), value: "role" }
          ],
          displayResults: "none",
          onQueryChange: setSearchQuery,
          count: teamMembers.length
        }}
        button={{
          children: "Add Team Member",
          leftIcon: <UserAdd />,
          onClick: handleInvite
        }}
      />
      <Table
        data={teamMembers}
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
              <ChakraTableCell>{rowData?.organization}</ChakraTableCell>
              <ChakraTableCell>{rowData?.email}</ChakraTableCell>
              <ChakraTableCell>
                {rowData?.role ? teamMemberRoleChoices.find(choice => choice.id === rowData?.role)?.name : "-"}
              </ChakraTableCell>
              <ChakraTableCell>{rowData?.status}</ChakraTableCell>
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
