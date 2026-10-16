import * as yup from "yup";

import { Framework } from "@/context/framework.provider";
import { Roles } from "@/generated/v3/userService/userServiceConstants";

export const userPrimaryRoleChoices = Object.entries(Roles.ROLE_NAMES).map(([id, name]) => ({ id, name }));

const FRAMEWORK_ADMIN_ROLES: string[] = ["project-developer", "project-manager"];

export const frameworkAdminPrimaryRoleChoices = userPrimaryRoleChoices.filter(({ id }) =>
  FRAMEWORK_ADMIN_ROLES.includes(id)
);

export const ROLES_SCHEMA = yup.array().of(yup.string()).required().min(1, "At least one role is required");

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
