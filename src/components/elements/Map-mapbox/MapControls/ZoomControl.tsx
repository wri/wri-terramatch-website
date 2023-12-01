import IconButton from "@/components/elements/IconButton/IconButton";
import ControlButtonsGroup from "@/components/elements/Map-mapbox/components/ControlButtonsGroup";
import ControlDivider from "@/components/elements/Map-mapbox/components/ControlDivider";
import { IconNames } from "@/components/extensive/Icon/Icon";
import { useMapContext } from "@/context/map.provider";

export const ZoomControl = () => {
  const { map } = useMapContext();

  return (
    <ControlButtonsGroup direction="col">
      <IconButton
        iconProps={{
          name: IconNames.ZoomIn,
          width: 16
        }}
        onClick={() => map?.zoomIn()}
        className="h-8 w-8 rounded-b-none rounded-t-lg"
        aria-label="Zoom in"
      />
      <ControlDivider direction="horizontal" />
      <IconButton
        iconProps={{
          name: IconNames.ZoomOut,
          width: 16
        }}
        onClick={() => map?.zoomOut()}
        className="h-8 w-8 rounded-t-none rounded-b-lg"
        aria-label="Zoom out"
      />
    </ControlButtonsGroup>
  );
};
