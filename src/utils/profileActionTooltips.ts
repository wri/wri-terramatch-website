type Translate = (message: string) => string;

type ProfileStatus = string | null | undefined;

/**
 * Bulk action tooltips for site and nursery profiles. Copy follows the "Action Tooltips" source of
 * truth: a single ineligible profile explains its own status, any other ineligible selection gets the
 * mixed selection copy.
 */
export const getProfileSubmitDisabledTooltip = (statuses: ProfileStatus[], t: Translate): string | undefined => {
  if (statuses.length === 0) return undefined;

  if (statuses.length === 1) {
    if (statuses[0] === "approved") return t("This profile has already been approved.");
    if (statuses[0] === "pending-approval") return t("This profile has already been submitted for review.");
  }

  return t(
    "One or more selected profiles can’t be submitted because they are incomplete, already submitted for review or approved."
  );
};

export const getProfileDeleteDisabledTooltip = (statuses: ProfileStatus[], t: Translate): string | undefined => {
  if (statuses.length === 0) return undefined;

  if (statuses.length === 1) {
    if (statuses[0] === "approved") return t("This profile has already been approved.");
    if (statuses[0] === "pending-approval") return t("This profile has already been submitted for review.");
    if (statuses[0] === "information-required") return t("This profile has been returned for more information.");
  }

  return t(
    "One or more selected profiles can’t be deleted because they are already submitted for review, approved or have reports."
  );
};
