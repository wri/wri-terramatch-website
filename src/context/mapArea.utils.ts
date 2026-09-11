import { MediaDto } from "@/generated/v3/entityService/entityServiceSchemas";

export type PolygonSubmitConfirmationRequest = string;

let openPolygonSubmitConfirmationExternal: ((sitePolygonUuid: PolygonSubmitConfirmationRequest) => void) | null = null;
let openEditPhotoDetailsExternal: ((media: MediaDto) => void) | null = null;
let closeMapPopupsExternal: (() => void) | null = null;
let openPolygonPopupExternal: ((polygonUuid: string) => void | Promise<void>) | null = null;
let openPolygonApproveConfirmationExternal: ((sitePolygonUuid: string) => void) | null = null;
let openPolygonRequestInformationConfirmationExternal: ((sitePolygonUuid: string) => void) | null = null;
let sitePolygonAdminReviewMode = false;
let runPolygonValidationFromMapPopupExternal: ((geometryPolygonUuids: string[]) => Promise<void>) | null = null;

export const registerMapAreaPopupActions = (actions: {
  openPolygonSubmitConfirmation: (sitePolygonUuid: PolygonSubmitConfirmationRequest) => void;
  openEditPhotoDetails: (media: MediaDto) => void;
  closeMapPopups: () => void;
  openPolygonApproveConfirmation?: (sitePolygonUuid: string) => void;
  openPolygonRequestInformationConfirmation?: (sitePolygonUuid: string) => void;
}): void => {
  openPolygonSubmitConfirmationExternal = actions.openPolygonSubmitConfirmation;
  openEditPhotoDetailsExternal = actions.openEditPhotoDetails;
  closeMapPopupsExternal = actions.closeMapPopups;
  openPolygonApproveConfirmationExternal = actions.openPolygonApproveConfirmation ?? null;
  openPolygonRequestInformationConfirmationExternal = actions.openPolygonRequestInformationConfirmation ?? null;
};

export const unregisterMapAreaPopupActions = (): void => {
  openPolygonSubmitConfirmationExternal = null;
  openEditPhotoDetailsExternal = null;
  closeMapPopupsExternal = null;
  openPolygonApproveConfirmationExternal = null;
  openPolygonRequestInformationConfirmationExternal = null;
};

export const registerSitePolygonAdminReviewMode = (isAdminReview: boolean): void => {
  sitePolygonAdminReviewMode = isAdminReview;
};

export const isSitePolygonAdminReviewMode = (): boolean => sitePolygonAdminReviewMode;

// Phase 1 project-level polygon review is view + validate + approve/request-information only — no
// geometry editing. Defaults to true (editable) so the site page's per-polygon edit drawer is
// unaffected; the project workspace registers false while mounted.
let polygonGeometryEditable = true;

export const registerPolygonGeometryEditable = (editable: boolean): void => {
  polygonGeometryEditable = editable;
};

export const isPolygonGeometryEditable = (): boolean => polygonGeometryEditable;

// The map may only enter polygon vertex-editing when geometry editing is enabled for the current
// surface. Project-level review registers geometry editing OFF (view + review only), so even when
// the edit drawer opens for a polygon, the map must NOT enter vertex-editing there — that edit has
// no save path at project scope and would be silently discarded. Site scope keeps the default
// (editable), so its per-polygon geometry editing is unaffected.
export const resolvePolygonMapEditEnabled = (editDrawerOpen: boolean): boolean =>
  editDrawerOpen && isPolygonGeometryEditable();

// Project-level review is read-only for polygon data: the edit drawer's "Edit" tab (attribute +
// geometry editing) is hidden, leaving System Validation + Comments. Defaults to false so the site
// page keeps its Edit tab; the project workspace registers true while mounted.
let polygonReviewOnly = false;

export const registerPolygonReviewOnly = (reviewOnly: boolean): void => {
  polygonReviewOnly = reviewOnly;
};

export const isPolygonReviewOnly = (): boolean => polygonReviewOnly;

export const registerRunPolygonValidationFromMapPopup = (
  handler: (geometryPolygonUuids: string[]) => Promise<void>
): void => {
  runPolygonValidationFromMapPopupExternal = handler;
};

export const unregisterRunPolygonValidationFromMapPopup = (): void => {
  runPolygonValidationFromMapPopupExternal = null;
};

export const runPolygonValidationFromMapPopup = (geometryPolygonUuids: string[]): Promise<void> | undefined =>
  runPolygonValidationFromMapPopupExternal?.(geometryPolygonUuids);

export const registerOpenPolygonPopupHandler = (handler: (polygonUuid: string) => void | Promise<void>): void => {
  openPolygonPopupExternal = handler;
};

export const unregisterOpenPolygonPopupHandler = (): void => {
  openPolygonPopupExternal = null;
};

export const openPolygonSubmitConfirmationFromMapPopup = (sitePolygonUuid: PolygonSubmitConfirmationRequest): void => {
  openPolygonSubmitConfirmationExternal?.(sitePolygonUuid);
};

export const openPolygonApproveConfirmationFromMapPopup = (sitePolygonUuid: string): void => {
  openPolygonApproveConfirmationExternal?.(sitePolygonUuid);
};

export const openPolygonRequestInformationConfirmationFromMapPopup = (sitePolygonUuid: string): void => {
  openPolygonRequestInformationConfirmationExternal?.(sitePolygonUuid);
};

export const closeMapPopupsFromMapPopup = (): void => {
  closeMapPopupsExternal?.();
};

export const openEditPhotoDetailsFromMapPopup = (media: MediaDto): void => {
  openEditPhotoDetailsExternal?.(media);
};

export const openPolygonPopupFromMapArea = (polygonUuid: string): void => {
  if (polygonUuid === "") {
    return;
  }
  void openPolygonPopupExternal?.(polygonUuid);
};
