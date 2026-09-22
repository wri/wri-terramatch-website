import { Box, TableCell, TableRow } from "@chakra-ui/react";
import { useMediaQuery } from "@mui/material";
import { useT } from "@transifex/react";
import { Checkbox, showToast } from "@worldresources/wri-design-systems";
import { useRouter } from "next/router";
import { FC, useCallback, useMemo, useRef, useState } from "react";

import {
  bulkDeleteUserAssociations,
  updateOrganisationUserStatuses,
  useOrganisationUserAssociations
} from "@/connections/UserAssociation";
import { UserAssociationDto } from "@/generated/v3/userService/userServiceSchemas";
import ActionStatusTag from "@/redesignComponents/actions/Tags/ActionStatusTag/ActionStatusTag";
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
  EditIcon,
  InformationRequiredIcon,
  RejectedIcon,
  UserAddIcon
} from "@/redesignComponents/foundations/Icons";
import ToolbarTable from "@/redesignComponents/navigation/Toolbar/ToolbarTable/ToolbarTable";

import TeamBulkActionToolbar from "./TeamBulkActionToolbar";
import TeamMemberActionModal, { type TeamMemberAction } from "./TeamMemberActionModal";

type AssociationStatus = "requested" | "approved";

type TeamMemberRow = Omit<UserAssociationDto, "status"> & {
  id: string;
  status: string;
  associationStatus: AssociationStatus;
};

type RowActionState = {
  action: TeamMemberAction;
  member: TeamMemberRow;
};

const ROLE_LABELS: Record<string, string> = {
  "project-developer": "Monitoring Partner",
  "project-manager": "Project Manager"
};

const TeamTabContent: FC = () => {
  const t = useT();
  const { query } = useRouter();
  const organisationUuid = String(query.id ?? "");
  const isMobile = useMediaQuery("(max-width: 1200px)");

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResetKey, setSearchResetKey] = useState(0);
  const [showRoleFilter, setShowRoleFilter] = useState(false);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [rowAction, setRowAction] = useState<RowActionState | null>(null);
  const isSubmittingRef = useRef(false);

  const [approvedLoaded, { data: approvedUsers }] = useOrganisationUserAssociations({
    organisationUuid,
    status: "approved"
  });
  const [pendingLoaded, { data: pendingUsers }] = useOrganisationUserAssociations({
    organisationUuid,
    status: "requested"
  });

  const allMembers = useMemo<TeamMemberRow[]>(
    () => [
      ...(pendingUsers ?? []).map(user => ({
        ...user,
        id: user.uuid,
        status: t("Pending"),
        associationStatus: "requested" as const
      })),
      ...(approvedUsers ?? []).map(user => ({
        ...user,
        id: user.uuid,
        status: t("Accepted"),
        associationStatus: "approved" as const
      }))
    ],
    [approvedUsers, pendingUsers, t]
  );

  const roleOptions = useMemo(
    () =>
      Array.from(new Set(allMembers.map(member => member.roleName).filter((role): role is string => role != null))).map(
        role => ({
          label: t(ROLE_LABELS[role] ?? role),
          value: role,
          onClick: () => setSelectedRole(role)
        })
      ),
    [allMembers, t]
  );

  const teamMembers = useMemo(() => {
    const queryValue = searchQuery.trim().toLowerCase();

    return allMembers.filter(member => {
      if (selectedRole != null && member.roleName !== selectedRole) return false;
      if (queryValue.length === 0) return true;

      return [member.fullName, member.emailAddress, member.roleName, member.status]
        .filter((value): value is string => value != null)
        .some(value => value.toLowerCase().includes(queryValue));
    });
  }, [allMembers, searchQuery, selectedRole]);

  const { selectedRows, selectedRowIds, setSelectedRowIds, handleRowSelected, onAllItemsSelected } = useTableSelection(
    true,
    teamMembers
  );

  const openRowAction = useCallback((action: TeamMemberAction, member: TeamMemberRow) => {
    setRowAction({ action, member });
  }, []);

  const handleConfirmRowAction = useCallback(async () => {
    if (rowAction == null || organisationUuid === "" || isSubmittingRef.current) return;

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
        cell: (member: TeamMemberRow) => (
          <ActionStatusTag
            state={member.associationStatus === "requested" ? "attention" : "success"}
            size="small"
            label={member.status}
            icon={
              member.associationStatus === "requested" ? (
                <InformationRequiredIcon boxSize={3} color="warning.500" />
              ) : (
                <CheckApprovedIcon boxSize={3} color="success.500" />
              )
            }
          />
        )
      },
      {
        key: "actions",
        label: "",
        width: "214px",
        cell: (member: TeamMemberRow) =>
          member.associationStatus === "requested" ? (
            <ActionCell
              button={{
                children: t("Approve"),
                leftIcon: <CheckIcon boxSize={3} />,
                onClick: () => openRowAction("approve", member)
              }}
              buttonSecondary={{
                children: t("Reject"),
                leftIcon: <RejectedIcon boxSize={3} color="error.500" />,
                className: "!border-theme-error-300 !bg-theme-error-100 !text-theme-error-900",
                size: "small",
                onClick: () => openRowAction("reject", member)
              }}
            />
          ) : (
            <ActionCell
              button={{
                children: t("Edit"),
                leftIcon: <EditIcon boxSize={3} />,
                onClick: () => {}
              }}
              buttonSecondary={{
                children: t("Remove"),
                leftIcon: <DeleteIcon boxSize={3} color="error.500" />,
                className: "!border-theme-error-300 !bg-theme-error-100 !text-theme-error-900",
                size: "small",
                onClick: () => openRowAction("remove", member)
              }}
            />
          )
      }
    ],
    [isMobile, openRowAction, t]
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
    <Box paddingX={6} paddingTop={3} paddingBottom={8} minHeight="644px" width="100%" overflow="auto">
      <ToolbarTable
        className="mb-4 !px-0"
        classNameContentLeft="min-w-0"
        onClearFilters={() => {
          setSelectedRole(null);
          setShowRoleFilter(false);
          setSearchQuery("");
          setSearchResetKey(key => key + 1);
        }}
        onClickFilterButton={() => setShowRoleFilter(true)}
        filters={
          showRoleFilter
            ? [
                {
                  mainActionLabel: selectedRole == null ? t("Role") : t(ROLE_LABELS[selectedRole] ?? selectedRole),
                  mainActionOnClick: () => setSelectedRole(null),
                  otherActions: roleOptions,
                  variant: "secondary"
                }
              ]
            : undefined
        }
        search={{
          label: t("Results"),
          placeholder: t("Search"),
          options: [],
          displayResults: "none",
          onQueryChange: setSearchQuery,
          count: teamMembers.length,
          resetKey: searchResetKey
        }}
        button={{ children: t("Add Team Member"), leftIcon: <UserAddIcon /> }}
        showClearFilters={selectedRole != null || searchQuery.length > 0}
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
        loading={!approvedLoaded || !pendingLoaded}
      />

      <TeamBulkActionToolbar
        organisationUuid={organisationUuid}
        selectedMembers={selectedRows.map(member => ({
          id: member.id,
          fullName: member.fullName,
          associationStatus: member.associationStatus
        }))}
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
    </Box>
  );
};

export default TeamTabContent;
