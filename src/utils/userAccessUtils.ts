export interface UserFramework {
  name: string;
  slug: string;
}

export interface User {
  uuid?: string;
  primaryRole?: string;
  frameworks?: UserFramework[];
}

export const checkUserAccess = (
  user: User | undefined,
  projectFrameworkKey: string | null | undefined,
  backendHasAccess?: boolean
): boolean => {
  if (!user) {
    return false;
  }

  const role = user.primaryRole;

  if (role === "admin-super" || role === "admin-ppc" || role === "admin-terrafund" || role === "admin") {
    return true;
  }

  if (role === "government") {
    return false;
  }

  if (role === "funder") {
    if (!projectFrameworkKey) {
      return false;
    }

    const userFrameworkSlugs = user.frameworks?.map(f => f.slug) || [];
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

  if (user !== undefined) {
    return "textForLoggedUser";
  }

  return "textForNotLoggedUser";
};
