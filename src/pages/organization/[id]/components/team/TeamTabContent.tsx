import { Flex, TableCell, TableRow } from "@chakra-ui/react";
import { useMediaQuery } from "@mui/material";
import { useT } from "@transifex/react";
import { Checkbox } from "@worldresources/wri-design-systems";
import { useRouter } from "next/router";
import { FC, useCallback, useMemo, useRef, useState } from "react";

import {
  bulkDeleteUserAssociations,
  updateOrganisationUserStatuses,
  useOrganisationUserAssociations
} from "@/connections/UserAssociation";
import { UserAssociationDto } from "@/generated/v3/userService/userServiceSchemas";
import ActionStatusTag from "@/redesignComponents/actions/Tags/ActionStatusTag/ActionStatusTag";
import { type ActionStatusTagState } from "@/redesignComponents/actions/Tags/ActionStatusTag/ActionStatusTag.type";
import ActionCell from "@/redesignComponents/dataDisplay/Table/components/ActionCell";
import CustomTableCell from "@/redesignComponents/dataDisplay/Table/components/TableCell";
import Table, {
  type TableColumn,
  type TableRenderRowContext,
  CHECKBOX_COLUMN_KEY
} from "@/redesignComponents/dataDisplay/Table/Table";
import { useTableSelection } from "@/redesignComponents/dataDisplay/Table/useTableSelection";
import {
  CheckApprovedIcon,
  CheckIcon,
  DeleteIcon,
  DisallowedIcon,
  InformationRequiredIcon,
  PendingIcon,
  RejectedIcon,
  UserAddIcon
} from "@/redesignComponents/foundations/Icons";
import ToolbarTable from "@/redesignComponents/navigation/Toolbar/ToolbarTable/ToolbarTable";
import { showToast } from "@/redesignComponents/status/Toast/showToast";

import InviteTeamMemberModal from "../InviteTeamMemberModal";
import InviteReminderCell from "./InviteReminderCell";
import TeamBulkActionToolbar from "./TeamBulkActionToolbar";
import TeamMemberActionModal, { type TeamMemberAction } from "./TeamMemberActionModal";

// "invited" is derived in the FE: an approved member whose organisation invite has not been accepted yet.
type AssociationStatus = "requested" | "approved" | "invited" | "rejected";

type TeamMemberRow = Omit<UserAssociationDto, "status"> & {
  id: string;
  status: string;
  associationStatus: AssociationStatus;
  roleName?: string;
};

type RowActionState = {
  action: TeamMemberAction;
  member: TeamMemberRow;
};

const ROLE_LABELS: Record<string, string> = {
  "project-developer": "Project Developer",
  "project-manager": "Project Manager"
};

const STATUS_LABELS: Record<AssociationStatus, string> = {
  requested: "Pending",
  approved: "Accepted",
  invited: "Invited",
  rejected: "Rejected"
};

const toTeamMemberRow = (
  user: UserAssociationDto,
  status: string,
  associationStatus: AssociationStatus
): TeamMemberRow => ({
  ...user,
  id: user.uuid,
  status,
  associationStatus,
  roleName: user.roles.find(role => ROLE_LABELS[role] != null)
});

const STATUS_TAG_CONFIG: Record<AssociationStatus, { state: ActionStatusTagState; iconColor: string }> = {
  requested: { state: "attention", iconColor: "warning.500" },
  approved: { state: "success", iconColor: "success.500" },
  invited: { state: "neutral-light", iconColor: "neutral.500" },
  rejected: { state: "warning", iconColor: "error.500" }
};

const TeamTabContent: FC = () => {
  const t = useT();
  const { query } = useRouter();
  const organisationUuid = String(query.id ?? "");
  const isMobile = useMediaQuery("(max-width: 1200px)");

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResetKey, setSearchResetKey] = useState(0);
  const [selectedStatus, setSelectedStatus] = useState<AssociationStatus | null>(null);
  const [rowAction, setRowAction] = useState<RowActionState | null>(null);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const isSubmittingRef = useRef(false);

  const handleInvite = () => setShowInviteModal(true);

  const [approvedLoaded, { data: approvedUsers }] = useOrganisationUserAssociations({
    organisationUuid,
    status: "approved"
  });

  const [pendingLoaded, { data: pendingUsers }] = useOrganisationUserAssociations({
    organisationUuid,
    status: "pending"
  });
  const [rejectedLoaded, { data: rejectedUsers }] = useOrganisationUserAssociations({
    organisationUuid,
    status: "rejected"
  });

  const allMembers = useMemo<TeamMemberRow[]>(
    () => [
      ...(pendingUsers ?? []).map(user => toTeamMemberRow(user, t(STATUS_LABELS.requested), "requested")),
      ...(approvedUsers ?? []).map(user =>
        user.invitePending === true
          ? toTeamMemberRow(user, t(STATUS_LABELS.invited), "invited")
          : toTeamMemberRow(user, t(STATUS_LABELS.approved), "approved")
      ),
      ...(rejectedUsers ?? []).map(user => toTeamMemberRow(user, t(STATUS_LABELS.rejected), "rejected"))
    ],
    [approvedUsers, pendingUsers, rejectedUsers, t]
  );

  const lastMemberId = useMemo(() => {
    const acceptedMembers = allMembers.filter(member => member.associationStatus === "approved");
    return acceptedMembers.length === 1 ? acceptedMembers[0].id : null;
  }, [allMembers]);

  const statusOptions = useMemo(
    () =>
      (Object.keys(STATUS_LABELS) as AssociationStatus[]).map(status => ({
        label: t(STATUS_LABELS[status]),
        value: status,
        onClick: () => setSelectedStatus(status)
      })),
    [t]
  );

  const teamMembers = useMemo(() => {
    const queryValue = searchQuery.trim().toLowerCase();

    return allMembers.filter(member => {
      if (selectedStatus != null && member.associationStatus !== selectedStatus) return false;
      if (queryValue.length === 0) return true;

      return [member.fullName, member.emailAddress, member.roleName, member.status]
        .filter((value): value is string => value != null)
        .some(value => value.toLowerCase().includes(queryValue));
    });
  }, [allMembers, searchQuery, selectedStatus]);

  const { selectedRows, selectedRowIds, setSelectedRowIds, handleRowSelected, onAllItemsSelected } = useTableSelection(
    true,
    teamMembers
  );

  const openRowAction = useCallback((action: TeamMemberAction, member: TeamMemberRow) => {
    setRowAction({ action, member });
  }, []);

  const handleConfirmRowAction = useCallback(async () => {
    if (rowAction == null || isSubmittingRef.current) return;

    if (organisationUuid === "") return;

    isSubmittingRef.current = true;
    try {
      if (rowAction.action === "remove") {
        await bulkDeleteUserAssociations(organisationUuid, [rowAction.member.id], "organisations");
      } else {
        await updateOrganisationUserStatuses(
          organisationUuid,
          [rowAction.member.id],
          rowAction.action === "approve" ? "approved" : "rejected"
        );
      }
      showToast({
        label:
          rowAction.action === "approve"
            ? t("Access request approved")
            : rowAction.action === "reject"
            ? t("Access request rejected")
            : t("Team member removed"),
        type: "success",
        placement: "bottom",
        duration: 5000
      });
      setRowAction(null);
    } catch {
      showToast({
        label:
          rowAction.action === "approve"
            ? t("Unable to approve the selected team members.")
            : rowAction.action === "reject"
            ? t("Unable to reject the selected team members.")
            : t("Unable to remove the selected team members from the Organization."),
        type: "error",
        placement: "bottom",
        duration: 5000
      });
    } finally {
      isSubmittingRef.current = false;
    }
  }, [organisationUuid, rowAction, t]);

  const columns = useMemo<TableColumn[]>(
    () => [
      {
        key: "fullName",
        label: t("Name"),
        sortable: true,
        cell: (member: TeamMemberRow) => (
          <CustomTableCell avatars={[{ name: member.fullName, ariaLabel: member.fullName }]} />
        )
      },
      ...(!isMobile ? [{ key: "emailAddress", label: t("Email"), sortable: true }] : []),
      {
        key: "roleName",
        label: t("Role"),
        sortable: true,
        cell: (member: TeamMemberRow) => t(ROLE_LABELS[member.roleName ?? ""] ?? member.roleName ?? "—")
      },
      {
        key: "status",
        label: t("Status"),
        sortable: true,
        cell: (member: TeamMemberRow) => {
          const statusConfig = STATUS_TAG_CONFIG[member.associationStatus];
          const StatusIcon =
            member.associationStatus === "requested"
              ? InformationRequiredIcon
              : member.associationStatus === "rejected"
              ? RejectedIcon
              : member.associationStatus === "invited"
              ? PendingIcon
              : CheckApprovedIcon;

          return (
            <ActionStatusTag
              state={statusConfig.state}
              size="small"
              label={member.status}
              icon={<StatusIcon boxSize={3} color={statusConfig.iconColor} />}
            />
          );
        }
      },
      {
        key: "actions",
        label: "",
        width: "214px",
        cell: (member: TeamMemberRow) => {
          if (member.associationStatus === "invited") {
            return <InviteReminderCell organisationUuid={organisationUuid} userUuid={member.id} />;
          }

          if (member.associationStatus === "requested") {
            return (
              <ActionCell
                button={{
                  children: t("Accept"),
                  leftIcon: <CheckIcon boxSize={3} />,
                  onClick: () => openRowAction("approve", member)
                }}
                buttonSecondary={{
                  children: t("Reject"),
                  leftIcon: <DisallowedIcon boxSize={3} color="error.500" />,
                  className: "!border-theme-error-300 !bg-theme-error-100 !text-theme-error-900",
                  size: "small",
                  onClick: () => openRowAction("reject", member)
                }}
              />
            );
          }

          if (member.associationStatus === "rejected") {
            return (
              <ActionCell
                button={{
                  children: t("Accept"),
                  leftIcon: <CheckIcon boxSize={3} />,
                  onClick: () => openRowAction("approve", member)
                }}
                buttonSecondary={{
                  children: t("Remove"),
                  leftIcon: <DeleteIcon boxSize={3} color="error.500" />,
                  className: "!border-theme-error-300 !bg-theme-error-100 !text-theme-error-900",
                  size: "small",
                  onClick: () => openRowAction("remove", member)
                }}
              />
            );
          }

          if (member.id === lastMemberId) return null;

          return (
            <ActionCell
              buttonSecondary={{
                children: t("Remove"),
                leftIcon: <DeleteIcon boxSize={3} color="error.500" />,
                className: "!border-theme-error-300 !bg-theme-error-100 !text-theme-error-900",
                size: "small",
                onClick: () => openRowAction("remove", member)
              }}
            />
          );
        }
      }
    ],
    [isMobile, lastMemberId, openRowAction, organisationUuid, t]
  );

  const renderRow = useCallback(
    (member: TeamMemberRow, context?: TableRenderRowContext) => {
      const isSelected = selectedRowIds.has(member.id);

      return (
        <TableRow
          className={context?.className != null ? `group ${context.className}` : "group"}
          aria-selected={isSelected}
        >
          <TableCell {...context?.getCellProps(CHECKBOX_COLUMN_KEY)}>
            <Checkbox
              name={`team-member-${member.id}`}
              aria-label={t("Select {name}", { name: member.fullName })}
              checked={isSelected}
              onCheckedChange={({ checked }) => handleRowSelected(member, checked === true)}
            />
          </TableCell>
          {columns.map(column => (
            <TableCell key={column.key} {...context?.getCellProps(column.key)}>
              {column.cell != null
                ? column.cell(member)
                : (member as unknown as Record<string, React.ReactNode>)[column.key] ?? "—"}
            </TableCell>
          ))}
        </TableRow>
      );
    },
    [columns, handleRowSelected, selectedRowIds, t]
  );

  return (
    <Flex direction="column" paddingX={6} paddingTop={3} paddingBottom={8} minHeight="644px" width="100%">
      <ToolbarTable
        className="mb-7 mt-3 !px-0"
        classNameContentLeft="min-w-0"
        onClearFilters={() => {
          setSelectedStatus(null);
          setSearchQuery("");
          setSearchResetKey(key => key + 1);
        }}
        filters={[
          {
            mainActionLabel: selectedStatus == null ? t("Status") : t(STATUS_LABELS[selectedStatus]),
            mainActionOnClick: () => setSelectedStatus(null),
            otherActions: statusOptions,
            variant: "secondary"
          }
        ]}
        search={{
          label: t("Results"),
          placeholder: t("Search"),
          options: [],
          displayResults: "none",
          onQueryChange: setSearchQuery,
          count: teamMembers.length,
          resetKey: searchResetKey
        }}
        button={{ children: t("Add Team Member"), leftIcon: <UserAddIcon />, onClick: handleInvite }}
        showClearFilters={selectedStatus != null || searchQuery.length > 0}
      />
      <InviteTeamMemberModal
        organisationUUID={organisationUuid}
        open={showInviteModal}
        onClose={() => setShowInviteModal(false)}
      />

      <Table<TeamMemberRow>
        data={teamMembers}
        columns={columns}
        selectable
        selectedRows={selectedRows}
        onRowSelected={handleRowSelected}
        onAllItemsSelected={onAllItemsSelected}
        renderRow={renderRow}
        pageSize={10}
        loading={!approvedLoaded || !pendingLoaded || !rejectedLoaded}
        className="mb-8"
      />

      <TeamBulkActionToolbar
        organisationUuid={organisationUuid}
        selectedMembers={selectedRows.map(member => ({
          id: member.id,
          fullName: member.fullName,
          associationStatus: member.associationStatus
        }))}
        lastMemberId={lastMemberId}
        onCancel={() => setSelectedRowIds(new Set())}
      />
      <TeamMemberActionModal
        action={rowAction?.action ?? null}
        members={
          rowAction == null
            ? []
            : [
                {
                  id: rowAction.member.id,
                  fullName: rowAction.member.fullName,
                  associationStatus: rowAction.member.associationStatus
                }
              ]
        }
        onClose={() => setRowAction(null)}
        onConfirm={() => {
          void handleConfirmRowAction();
        }}
      />
    </Flex>
  );
};

export default TeamTabContent;
