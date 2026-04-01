import { UserDto } from "@/generated/v3/userService/userServiceSchemas";

export const getFullName = (user: UserDto | string) => {
  if (typeof user === "string") return user;
  return `${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim();
};
