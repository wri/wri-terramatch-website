import { MediaDto } from "@/generated/v3/entityService/entityServiceSchemas";

export type PolygonSubmitConfirmationRequest = {
  sitePolygonUuid: string;
  eligibleCount: number;
  totalCount: number;
};

let openPolygonSubmitConfirmationExternal: ((request: PolygonSubmitConfirmationRequest) => void) | null = null;
let openEditPhotoDetailsExternal: ((media: MediaDto) => void) | null = null;
let closeMapPopupsExternal: (() => void) | null = null;

export const registerMapAreaPopupActions = (actions: {
  openPolygonSubmitConfirmation: (request: PolygonSubmitConfirmationRequest) => void;
  openEditPhotoDetails: (media: MediaDto) => void;
  closeMapPopups: () => void;
}): void => {
  openPolygonSubmitConfirmationExternal = actions.openPolygonSubmitConfirmation;
  openEditPhotoDetailsExternal = actions.openEditPhotoDetails;
  closeMapPopupsExternal = actions.closeMapPopups;
};

export const unregisterMapAreaPopupActions = (): void => {
  openPolygonSubmitConfirmationExternal = null;
  openEditPhotoDetailsExternal = null;
  closeMapPopupsExternal = null;
};

export const openPolygonSubmitConfirmationFromMapPopup = (request: PolygonSubmitConfirmationRequest): void => {
  openPolygonSubmitConfirmationExternal?.(request);
};

export const closeMapPopupsFromMapPopup = (): void => {
  closeMapPopupsExternal?.();
};

export const openEditPhotoDetailsFromMapPopup = (media: MediaDto): void => {
  openEditPhotoDetailsExternal?.(media);
};
