export interface UserFramework {
  name: string;
  slug: string;
}

export interface User {
  uuid?: string;
  roles?: string[];
  frameworks?: UserFramework[];
}

export const checkUserAccess = (
  user: User | undefined,
  projectFrameworkKey: string | null | undefined,
  backendHasAccess?: boolean
): boolean => {
  if (user == null) {
    return false;
  }

  const roles = user.roles ?? [];

  if (roles.some(role => role.startsWith("admin"))) return true;

  if (roles.includes("government")) {
    return false;
  }

  if (roles.includes("funder")) {
    if (projectFrameworkKey == null) {
      return false;
    }

    const userFrameworkSlugs = user.frameworks?.map(f => f.slug) ?? [];
    return userFrameworkSlugs.includes(projectFrameworkKey);
  }

  if (backendHasAccess !== undefined) {
    return backendHasAccess;
  }

  return false;
};

export const getBlurTextType = (user: User | undefined, isAllowed: boolean) => {
  if (isAllowed) {
    return null;
  }

  if (user !== null) {
    return "textForLoggedUser";
  }

  return "textForNotLoggedUser";
};
