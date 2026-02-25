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
import { useDeleteAssociate } from "@/hooks/useDeleteAssociate";
import { getThemedColor } from "@/lib/theme";
import ActionCell from "@/redesignComponents/dataDisplay/Table/components/ActionCell";
import CustomTableCell from "@/redesignComponents/dataDisplay/Table/components/TableCell";
import Table from "@/redesignComponents/dataDisplay/Table/Table";
import { RowData } from "@/redesignComponents/dataDisplay/Table/tableUtils";
import { DeleteIcon, UserAddIcon } from "@/redesignComponents/foundations/Icons";
import ToolbarTable from "@/redesignComponents/navigation/Toolbar/ToolbarTable";

import InviteMonitoringPartnerModal from "../components/InviteMonitoringPartnerModal";

interface TeamMembersTabProps {
  project: ProjectFullDto;
}

export const TEAM_MEMBER_ROLE_CHOICES = [
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
  return teamMembers?.map(member => ({
    uuid: member?.uuid,
    name: `${member.first_name} ${member.last_name}`,
    organization: (member as any)?.organisation?.name,
    email: member?.email_address,
    role: role,
    status: member?.role == "project-manager" ? "Accepted" : member?.status,
    image: ``
  }));
};

const TeamMembersTab: FC<TeamMembersTabProps> = ({ project }) => {
  const t = useT();
  const { openModal, closeModal } = useModalContext();
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // TODO: The current pagination logic and data fetching for Monitoring Parts and Manager
  // will be replaced once these endpoints are migrated to V3.
  // Related migration ticket: TM-2880

  const { data: partners, refetch } = useGetV2ProjectsUUIDPartners<{
    data: GetV2ProjectsUUIDPartnersResponse;
  }>({
    pathParams: { uuid: project?.uuid ?? "d2c2a1fe-c5e8-435a-b865-00dce7a9809f" }
  });

  const { data: managers } = useGetV2ProjectsUUIDManagers<{ data: GetV2ProjectsUUIDManagersResponse }>({
    pathParams: { uuid: project?.uuid ?? "d2c2a1fe-c5e8-435a-b865-00dce7a9809f" }
  });

  const { deletePartner } = useDeleteAssociate("partner", project, refetch);
  const { deletePartner: deleteManager } = useDeleteAssociate("manager", project, refetch);

  const handleInvite = () => {
    openModal(
      ModalId.INVITE_MONITORING_PARTNER_MODAL,
      <InviteMonitoringPartnerModal projectUUID={project?.uuid} onSuccess={() => {}} />
    );
  };

  const ModalConfirmDeletePartner = useCallback(
    (rowData: RowData) => {
      openModal(
        ModalId.MODAL_CONFIRM_DELETE_PARTNER,
        <Modal
          iconProps={{ name: IconNames.EXCLAMATION_CIRCLE, width: 60, height: 60 }}
          title={t("REMOVE MONITORING PARTNER?")}
          content={t(
            "Remove {email_address} as Monitoring Partner to Ecosystem and livelihoods enhancement for People, Nature and Climate in Marsabit County International Tree Foundation??",
            {
              email_address: rowData?.email
            }
          )}
          primaryButtonProps={{
            children: t("Confirm"),
            onClick: () => {
              if (rowData.role === "monitoring-partner") {
                deletePartner(rowData?.email);
              } else if (rowData.role === "project-manager") {
                deleteManager(rowData?.uuid ?? "");
              }
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
    [closeModal, deleteManager, deletePartner, openModal, t]
  );

  const teamMembers = useMemo(() => {
    const all = [
      ...teamMembersFormatted(partners?.data ?? [], "monitoring-partner"),
      ...teamMembersFormatted(managers?.data ?? [], "project-manager")
    ].filter(member => (selectedRole ? member.role === selectedRole : true));

    const q = searchQuery.trim().toLowerCase();
    if (q.length === 0) return all;
    return all.filter(member => {
      const includes = (key: "name" | "organization" | "email" | "role") =>
        typeof member[key] === "string" && (member[key] as string).toLowerCase().includes(q);

      return includes("name") || includes("organization") || includes("email") || includes("role");
    });
  }, [partners?.data, managers?.data, selectedRole, searchQuery]);

  return (
    <Box paddingX={8} paddingY={6} minHeight="525px">
      <ToolbarTable
        className="!px-0"
        onClearFilters={() => {
          setSelectedRole(null);
          setSearchQuery("");
        }}
        filters={[
          {
            mainActionLabel: t(
              selectedRole !== null
                ? selectedRole === "monitoring-partner"
                  ? "Monitoring Partner"
                  : "Project Manager"
                : "Role"
            ),
            variant: "secondary",
            mainActionOnClick: () =>
              setSelectedRole(selectedRole === "monitoring-partner" ? "project-manager" : "monitoring-partner"),
            otherActions: [
              {
                label: t("Monitoring Partner"),
                value: "monitoring-partner",
                onClick: () => setSelectedRole("monitoring-partner")
              },
              {
                label: t("Project Manager"),
                value: "project-manager",
                onClick: () => setSelectedRole("project-manager")
              }
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
          children: t("Add Team Member"),
          leftIcon: <UserAddIcon />,
          onClick: handleInvite
        }}
        tooltipContent={t(
          "Team members who join your project as monitoring partners will have full access to your project data and reports."
        )}
        showClearFilters={selectedRole !== null}
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
                {rowData?.role != null
                  ? TEAM_MEMBER_ROLE_CHOICES.find(choice => choice.id === rowData.role)?.name
                  : "-"}
              </ChakraTableCell>
              <ChakraTableCell>{rowData?.status ? t(rowData.status as string) : "-"}</ChakraTableCell>
              <ChakraTableCell>
                <ActionCell
                  // TODO: comment out for now as we don't have an edit functionality yet
                  // button={{
                  //   children: t("Edit"),
                  //   onClick: () => Log.debug("Edit team member click"),
                  //   leftIcon: (
                  //     <Edit
                  //       // className="!text-theme-neutral-900 hidden"
                  //       className="hidden"
                  //       css={{
                  //         "& svg path": {
                  //           fill: getThemedColor("neutral", 900) + " !important",
                  //           color: getThemedColor("neutral", 900) + " !important"
                  //         }
                  //       }}
                  //     />
                  //   )
                  // }}
                  buttonSecondary={{
                    children: t("Remove"),
                    variant: "secondary",
                    onClick: () => ModalConfirmDeletePartner(rowData),
                    leftIcon: (
                      <DeleteIcon
                        className="!text-theme-error-500"
                        css={{
                          "& svg path": {
                            fill: getThemedColor("error", 500) + " !important",
                            color: getThemedColor("error", 500) + " !important"
                          }
                        }}
                      />
                    ),
                    className: "!text-theme-error-900 !border-theme-error-300 !bg-theme-error-100 aaaaa",
                    size: "small"
                  }}
                />
              </ChakraTableCell>
            </TableRow>
          ),
          [ModalConfirmDeletePartner, t]
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

export default TeamMembersTab;
