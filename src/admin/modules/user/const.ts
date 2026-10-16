import * as yup from "yup";

import { Framework } from "@/context/framework.provider";
import { Roles } from "@/generated/v3/userService/userServiceConstants";

export const userPrimaryRoleChoices = Object.entries(Roles.ROLE_NAMES).map(([id, name]) => ({ id, name }));

const FRAMEWORK_ADMIN_ASSIGNABLE_ROLES: string[] = ["project-developer", "project-manager"];

export const frameworkAdminPrimaryRoleChoices = userPrimaryRoleChoices.filter(({ id }) =>
  FRAMEWORK_ADMIN_ASSIGNABLE_ROLES.includes(id)
);

// Widened so it can be checked against the form's plain string role values.
const COMBINABLE_ROLES: readonly string[] = Roles.COMBINABLE_ROLES;

export const isCombinableRole = (role: string) => COMBINABLE_ROLES.includes(role);

const roleName = (role: string) => Roles.ROLE_NAMES[role as keyof typeof Roles.ROLE_NAMES] ?? role;

export const ROLES_SCHEMA = yup
  .array()
  .of(yup.string().required())
  .required()
  .min(1, "At least one role is required")
  .test("exclusive-roles", function (roles) {
    if (roles.length < 2) return true;

    const exclusiveRole = roles.find(role => !isCombinableRole(role));
    return exclusiveRole == null
      ? true
      : this.createError({
          message: `${roleName(
            exclusiveRole
          )} cannot be combined with other roles. Only framework admin roles may be combined.`
        });
  });

export const isProjectDeveloper = (roles: string[] | null | undefined) => roles?.includes("project-developer") ?? false;

export const ORGANISATION_UUID_SCHEMA = yup
  .string()
  .nullable()
  .when("roles", {
    is: isProjectDeveloper,
    then: schema => schema.required("Organisation is required for project developers")
  });

export const localeChoices = [
  { id: "en-US", name: "English" },
  { id: "es-MX", name: "Spanish" },
  { id: "fr-FR", name: "French" },
  { id: "pt-BR", name: "Portuguese" }
];

export const directFrameworkChoices = Object.values(Framework)
  .filter(slug => slug !== "undefined")
  .map(slug => ({ id: slug, name: slug }));
