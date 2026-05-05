import { ChakraProvider } from "@chakra-ui/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useRef, useState } from "react";
import { Provider as ReduxProvider } from "react-redux";

import { system } from "@/lib/theme";
import MapPopUp from "@/redesignComponents/geospatial/MapPopUp/MapPopUp";
import PointMarker from "@/redesignComponents/geospatial/PointMarker/PointMarker";
import ApiSlice from "@/store/apiSlice";

import TooltipMap from "../../TooltipMap/TooltipMap";
import type { PopupComponentProps } from "../Map.d";
import PopupContentPolygon from "./PopupPolygon/PopupContentPolygon";
import PopupFooterPolygon from "./PopupPolygon/PopupFooterPolygon";
import PopupHeaderPolygon from "./PopupPolygon/PopupHeaderPolygon";

const client = new QueryClient();

export const AdminPopup = (event: PopupComponentProps) => {
  const { feature, popup, setPolygonFromMap, type, setEditPolygon, championsMap } = event;
  const uuidPolygon = (feature.properties?.uuid ?? "") as string;
  const [open, setOpen] = useState(true);
  const triggerRef = useRef<HTMLButtonElement>(null);

  return (
    <ReduxProvider store={ApiSlice.redux}>
      <ChakraProvider value={system}>
        <QueryClientProvider client={client}>
          {!championsMap ? (
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
          ) : (
            <>
              <PointMarker
                ariaLabel="This is a custom icon marker"
                variant="simple-pin"
                onClick={() => setOpen(true)}
                triggerRef={triggerRef}
                showFocusState={open}
              />
              <MapPopUp
                anchorRef={triggerRef}
                content={<PopupContentPolygon />}
                footer={<PopupFooterPolygon />}
                placement="right"
                open={open}
                onOpenChange={nextOpen => {
                  if (!nextOpen) {
                    setOpen(nextOpen);
                    popup?.remove();
                  } else {
                    setOpen(nextOpen);
                  }
                }}
                header={<PopupHeaderPolygon />}
              />
            </>
          )}
        </QueryClientProvider>
      </ChakraProvider>
    </ReduxProvider>
  );
};
