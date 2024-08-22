import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import TooltipMap from "../../TooltipMap/TooltipMap";

const client = new QueryClient();

export const AdminPopup = (event: any) => {
  const { feature, popup, setPolygonFromMap, type, setEditPolygon } = event;
  const uuidPolygon = feature.properties?.uuid;
  return (
    <QueryClientProvider client={client}>
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
        setEditPolygon={(primary_uuid?: string) => {
          setPolygonFromMap?.({ isOpen: true, uuid: uuidPolygon });
          setEditPolygon?.({
            isOpen: true,
            uuid: uuidPolygon,
            primary_uuid: primary_uuid
          });
          if (popup) {
            popup.remove();
          }
        }}
      />
    </QueryClientProvider>
  );
};
