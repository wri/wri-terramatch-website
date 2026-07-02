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
