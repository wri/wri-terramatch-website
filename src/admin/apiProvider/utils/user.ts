export type UserRole =
  | "admin-super"
  | "admin-ppc"
  | "admin-terrafund"
  | "admin-hbf"
  | "project-developer"
  | "project-manager";

export const isAdmin = (role: UserRole) => {
  return role === "project-manager" || role?.includes("admin");
};
