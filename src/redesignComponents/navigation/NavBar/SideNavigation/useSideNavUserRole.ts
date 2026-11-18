import { useMyUser } from "@/connections/User";

const PROJECT_DEVELOPER_ROLE = "project-developer";

// Mirrors the report events: "admin" or "project-developer", otherwise the user's own role code.
export const useSideNavUserRole = (): string => {
  const [, { user, isAdmin }] = useMyUser();
  if (isAdmin) return "admin";

  const roles = user?.roles ?? [];
  return roles.includes(PROJECT_DEVELOPER_ROLE) ? PROJECT_DEVELOPER_ROLE : roles[0] ?? PROJECT_DEVELOPER_ROLE;
};
