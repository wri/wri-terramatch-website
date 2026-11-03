import { FC, useMemo } from "react";
import { SelectArrayInput } from "react-admin";
import { useWatch } from "react-hook-form";

import { useGetUserRole } from "@/admin/hooks/useGetUserRole";
import { frameworkAdminPrimaryRoleChoices, isCombinableRole, userPrimaryRoleChoices } from "@/admin/modules/user/const";

type UserRolesInputProps = {
  defaultValue?: string[];
};

/**
 * Only combinable (framework admin) roles may be held together. Once a non-combinable role is selected, every
 * other choice is disabled; once a combinable role is selected, the non-combinable choices are disabled.
 */
const UserRolesInput: FC<UserRolesInputProps> = ({ defaultValue }) => {
  const { isSuperAdmin, roles } = useGetUserRole();
  const selectedRoles = useWatch({ name: "roles" }) as string[] | undefined;

  const choices = useMemo(() => {
    const available = isSuperAdmin
      ? userPrimaryRoleChoices
      : [...frameworkAdminPrimaryRoleChoices, ...userPrimaryRoleChoices.filter(({ id }) => roles.includes(id))];
    if (selectedRoles == null || selectedRoles.length === 0) return available;

    const hasExclusiveRole = selectedRoles.some(selected => !isCombinableRole(selected));
    return available.map(choice => ({
      ...choice,
      disabled: !selectedRoles.includes(choice.id) && (hasExclusiveRole || !isCombinableRole(choice.id))
    }));
  }, [isSuperAdmin, roles, selectedRoles]);

  return <SelectArrayInput source="roles" label="Roles" choices={choices} defaultValue={defaultValue} fullWidth />;
};

export default UserRolesInput;
