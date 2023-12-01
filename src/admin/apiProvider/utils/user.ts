export type UserRole = "admin-super" | "admin-ppc" | "admin-terrafund" | "project-developer";

export const isAdmin = (role: UserRole) => {
  return role?.includes("admin");
};
