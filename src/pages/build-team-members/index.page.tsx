import { Box, TableCell as ChakraTableCell, TableRow } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { FC, useCallback, useMemo, useState } from "react";

import { IconNames } from "@/components/extensive/Icon/Icon";
import Modal from "@/components/extensive/Modal/Modal";
import { ModalId } from "@/components/extensive/Modal/ModalConst";
import { bulkDeleteUserAssociations, useUserAssociations } from "@/connections/UserAssociation";
import { useModalContext } from "@/context/modal.provider";
import { ProjectFullDto } from "@/generated/v3/entityService/entityServiceSchemas";
import { UserAssociationDto } from "@/generated/v3/userService/userServiceSchemas";
import { getThemedColor } from "@/lib/theme";
import ActionCell from "@/redesignComponents/dataDisplay/Table/components/ActionCell";
import CustomTableCell from "@/redesignComponents/dataDisplay/Table/components/TableCell";
import Table from "@/redesignComponents/dataDisplay/Table/Table";
import { RowData } from "@/redesignComponents/dataDisplay/Table/tableUtils";
import { Delete, UserAdd } from "@/redesignComponents/foundations/Icons";
import ToolbarTable from "@/redesignComponents/navigation/Toolbar/ToolbarTable";

import InviteMonitoringPartnerModal from "../project/[uuid]/components/InviteMonitoringPartnerModal";

interface BuildTeamMembersPageProps {
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

const BuildTeamMembersPage: FC<BuildTeamMembersPageProps> = ({ project }) => {
  const t = useT();
  const { openModal, closeModal } = useModalContext();
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const [, { data: associatedUsers }] = useUserAssociations({
    uuid: project.uuid
  });

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
              email_address: rowData?.emailAddress
            }
          )}
          primaryButtonProps={{
            children: t("Confirm"),
            onClick: () => {
              bulkDeleteUserAssociations(project.uuid, [rowData?.uuid ?? ""]);
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
    [closeModal, openModal, t, project.uuid]
  );

  const teamMembers = useMemo(() => {
    const all =
      associatedUsers
        ?.filter(member => (selectedRole ? member?.roleName?.toLowerCase() === selectedRole.toLowerCase() : true))
        .map((member, index) => ({
          ...member,
          //TODO: replace with actual image once it is implemented
          image: `https://i.pravatar.cc/300?img=${index}&w=640&q=71`
        })) ?? [];

    const q = searchQuery.trim().toLowerCase();
    if (q.length === 0) return all;
    return all?.filter(member => {
      const includes = (key: keyof UserAssociationDto) =>
        typeof member?.[key] === "string" && (member?.[key] as string).toLowerCase().includes(q);

      return includes("fullName") || includes("organisationName") || includes("emailAddress") || includes("roleName");
    });
  }, [associatedUsers, selectedRole, searchQuery]);

  return (
    <Box paddingX={8} paddingY={6}>
      <ToolbarTable
        className="!px-0"
        filters={[
          {
            mainActionLabel: t("Role"),
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
              },
              {
                label: t("Clear Filter"),
                value: "clear-filter",
                onClick: () => setSelectedRole("")
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
          count: teamMembers?.length ?? 0
        }}
        button={{
          children: t("Add Team Member"),
          leftIcon: <UserAdd />,
          onClick: handleInvite
        }}
      />
      <Table
        data={teamMembers ?? []}
        renderRow={useCallback(
          (rowData: RowData) => (
            <TableRow className="group">
              <ChakraTableCell>
                <CustomTableCell
                  avatars={[
                    {
                      name: rowData.fullName,
                      src: (rowData as any).image,
                      ariaLabel: rowData.fullName
                    }
                  ]}
                />
              </ChakraTableCell>
              <ChakraTableCell>{rowData?.organisationName}</ChakraTableCell>
              <ChakraTableCell>{rowData?.emailAddress}</ChakraTableCell>
              <ChakraTableCell>
                {rowData?.roleName != null
                  ? TEAM_MEMBER_ROLE_CHOICES.find(choice => choice.id === rowData.roleName)?.name
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

export default BuildTeamMembersPage;
