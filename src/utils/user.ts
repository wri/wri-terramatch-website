import { UserRead } from "@/generated/apiSchemas";

export const getFullName = (user: UserRead | string) => {
  if (typeof user === "string") return user;
  // @ts-ignore
  return `${(user?.firstName ?? user?.firstName) || ""} ${(user?.lastName ?? user?.lastName) || ""}`.trim();
};
