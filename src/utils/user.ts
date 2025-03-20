import { UserRead } from "@/generated/apiSchemas";

export const getFullName = (user: UserRead | string) => {
  if (typeof user === "string") return user;
  // @ts-ignore
  return `${(user?.first_name ?? user?.firstName) || ""} ${(user?.last_name ?? user?.lastName) || ""}`.trim();
};
