export type ReportOwner = { uuid?: string | null; name?: string | null };

/**
 * A report can only be edited or submitted by members of the organisation that owns it. Admins are not
 * limited by ownership, and when either side is unknown the report stays editable (the API still enforces it).
 */
export const isReportOwnedByOtherOrg = (
  owner: ReportOwner | null | undefined,
  myOrganisationUuid: string | null | undefined,
  isAdmin: boolean
) => !isAdmin && owner?.uuid != null && myOrganisationUuid != null && owner.uuid !== myOrganisationUuid;
