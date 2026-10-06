import { Framework } from "@/context/framework.provider";
import { Frameworks, Roles } from "@/generated/v3/userService/userServiceConstants";

export const userPrimaryRoleChoices = Object.entries(Roles.ROLE_NAMES).map(([id, name]) => ({ id, name }));

const FRAMEWORK_ADMIN_ROLES: string[] = ["project-developer", "project-manager"];

export const frameworkAdminPrimaryRoleChoices = userPrimaryRoleChoices.filter(({ id }) =>
  FRAMEWORK_ADMIN_ROLES.includes(id)
);

export const frameworkChoices = Object.entries(Frameworks.FRAMEWORK_NAMES).map(([id, name]) => ({ id, name }));

export const localeChoices = [
  { id: "en-US", name: "English" },
  { id: "es-MX", name: "Spanish" },
  { id: "fr-FR", name: "French" },
  { id: "pt-BR", name: "Portuguese" }
];

export const directFrameworkChoices = Object.values(Framework)
  .filter(slug => slug !== "undefined")
  .map(slug => ({ id: slug, name: slug }));
