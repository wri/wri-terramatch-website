export type PolygonSubmitConfirmationRequest = {
  sitePolygonUuid: string;
  eligibleCount: number;
  totalCount: number;
};

let openPolygonSubmitConfirmationExternal: ((request: PolygonSubmitConfirmationRequest) => void) | null = null;
let closeMapPopupsExternal: (() => void) | null = null;

export const registerMapAreaPopupActions = (actions: {
  openPolygonSubmitConfirmation: (request: PolygonSubmitConfirmationRequest) => void;
  closeMapPopups: () => void;
}): void => {
  openPolygonSubmitConfirmationExternal = actions.openPolygonSubmitConfirmation;
  closeMapPopupsExternal = actions.closeMapPopups;
};

export const unregisterMapAreaPopupActions = (): void => {
  openPolygonSubmitConfirmationExternal = null;
  closeMapPopupsExternal = null;
};

export const openPolygonSubmitConfirmationFromMapPopup = (request: PolygonSubmitConfirmationRequest): void => {
  openPolygonSubmitConfirmationExternal?.(request);
};

export const closeMapPopupsFromMapPopup = (): void => {
  closeMapPopupsExternal?.();
};
