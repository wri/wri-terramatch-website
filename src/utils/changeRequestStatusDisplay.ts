/** Redesign empty/null display (matches polygon review). */
export const EMPTY_DISPLAY = "—";

/** True when there is no active change request (NULL or legacy no-update). */
export const isAbsentChangeRequestStatus = (value: string | null | undefined): boolean =>
  value == null || value === "" || value === "no-update";
