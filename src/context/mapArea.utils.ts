import type { PolygonRunValidationWithResultsCallback } from "@/pages/site/[uuid]/components/polygonEdit.types";

export type PolygonSubmitConfirmationRequest = string;

export type MapPopupReviewActions = {
  isAdminReview: boolean;
  runPolygonValidation: PolygonRunValidationWithResultsCallback;
  openPolygonEditDrawerByPolygonId: (polygonId: string) => Promise<boolean>;
};

let openPolygonSubmitConfirmationExternal: ((sitePolygonUuid: PolygonSubmitConfirmationRequest) => void) | null = null;
let openEditPhotoDetailsExternal: ((mediaUuid: string) => void) | null = null;
let closeMapPopupsExternal: (() => void) | null = null;
let openPolygonPopupExternal: ((polygonUuid: string) => void | Promise<void>) | null = null;
let openPolygonApproveConfirmationExternal: ((sitePolygonUuid: string) => void) | null = null;
let openPolygonRequestInformationConfirmationExternal: ((sitePolygonUuid: string) => void) | null = null;
let mapPopupReviewActions: MapPopupReviewActions | null = null;

export const registerMapAreaPopupActions = (actions: {
  openPolygonSubmitConfirmation: (sitePolygonUuid: PolygonSubmitConfirmationRequest) => void;
  openEditPhotoDetails: (mediaUuid: string) => void;
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

export const registerMapPopupReviewActions = (actions: MapPopupReviewActions): void => {
  mapPopupReviewActions = actions;
};

export const unregisterMapPopupReviewActions = (): void => {
  mapPopupReviewActions = null;
};

export const isSitePolygonAdminReviewMode = (): boolean => mapPopupReviewActions?.isAdminReview ?? false;

export const runPolygonValidationFromMapPopup = (
  ...args: Parameters<PolygonRunValidationWithResultsCallback>
): Promise<void> | undefined => mapPopupReviewActions?.runPolygonValidation(...args);

export const openPolygonEditDrawerByPolygonIdFromMapPopup = (polygonId: string): Promise<boolean> | undefined =>
  mapPopupReviewActions?.openPolygonEditDrawerByPolygonId(polygonId);

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

export const openEditPhotoDetailsFromMapPopup = (mediaUuid: string): void => {
  openEditPhotoDetailsExternal?.(mediaUuid);
};

export const openPolygonPopupFromMapArea = (polygonUuid: string): void => {
  if (polygonUuid === "") {
    return;
  }
  void openPolygonPopupExternal?.(polygonUuid);
};
