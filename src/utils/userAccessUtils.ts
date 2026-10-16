export interface UserFramework {
  name: string;
  slug: string;
}

export interface User {
  uuid?: string;
  primaryRole?: string;
  frameworks?: UserFramework[];
}

const FRAMEWORKS_WITHOUT_NURSERIES: readonly string[] = ["ppc", "hbf"];

/**
 * PPC and HBF projects don't have nurseries, so users whose frameworks are all PPC or HBF don't get the Nurseries link.
 * Users without any framework keep it.
 */
export const userHasNurseries = (user: { frameworks?: UserFramework[] } | undefined): boolean => {
  if (user == null) return true;

  const frameworkSlugs = user.frameworks?.map(framework => framework.slug) ?? [];
  return frameworkSlugs.length === 0 || frameworkSlugs.some(slug => !FRAMEWORKS_WITHOUT_NURSERIES.includes(slug));
};

export const checkUserAccess = (
  user: User | undefined,
  projectFrameworkKey: string | null | undefined,
  backendHasAccess?: boolean
): boolean => {
  if (user == null) {
    return false;
  }

  const role = user.primaryRole;

  if (role != null && role.startsWith("admin")) return true;

  if (role === "government") {
    return false;
  }

  if (role === "funder") {
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
