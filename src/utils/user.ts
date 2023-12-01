import { UserRead } from "@/generated/apiSchemas";

export const getFullName = (user: UserRead | string) => {
  if (typeof user === "string") return user;

  return `${user?.first_name || ""} ${user?.last_name || ""}`.trim();
};
