import { useEffect } from "react";

import {
  type MapPopupReviewActions,
  registerMapPopupReviewActions,
  unregisterMapPopupReviewActions
} from "@/context/mapArea.utils";

export const useMapPopupReviewActions = ({
  isAdminReview,
  runPolygonValidation,
  openPolygonEditDrawerByPolygonId
}: MapPopupReviewActions) => {
  useEffect(() => {
    registerMapPopupReviewActions({ isAdminReview, runPolygonValidation, openPolygonEditDrawerByPolygonId });
    return unregisterMapPopupReviewActions;
  }, [isAdminReview, openPolygonEditDrawerByPolygonId, runPolygonValidation]);
};
