import { Provider as ReduxProvider } from "react-redux";

import ApiSlice from "@/store/apiSlice";

import TooltipMap from "../../TooltipMap/TooltipMap";
import type { PopupComponentProps } from "../Map.d";

export const AdminPopup = (event: PopupComponentProps) => {
  const { feature, popup, setPolygonFromMap, type, setEditPolygon } = event;
  const uuidPolygon = (feature.properties?.uuid ?? "") as string;
  return (
    <ReduxProvider store={ApiSlice.redux}>
      <TooltipMap
        polygon={uuidPolygon}
        type={type}
        setTooltipOpen={() => {
          if (popup) {
            popup.remove();
            setPolygonFromMap?.({ isOpen: false, uuid: "" });
            setEditPolygon?.({ isOpen: false, uuid: "" });
          }
        }}
        setEditPolygon={(primaryUuid?: string) => {
          setPolygonFromMap?.({ isOpen: true, uuid: uuidPolygon });
          setEditPolygon?.({
            isOpen: true,
            uuid: uuidPolygon,
            primaryUuid
          });
          if (popup) {
            popup.remove();
          }
        }}
      />
    </ReduxProvider>
  );
};
