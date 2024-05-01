import { useT } from "@transifex/react";
import bbox from "@turf/bbox";
import classNames from "classnames";
import mapboxgl, { LngLatBoundsLike } from "mapbox-gl";
import { useEffect, useRef, useState } from "react";

import IconButton from "@/components/elements/IconButton/IconButton";
import ControlButtonsGroup from "@/components/elements/Map-mapbox/components/ControlButtonsGroup";
import ControlDivider from "@/components/elements/Map-mapbox/components/ControlDivider";
import { useConvertShapeFileToGeoJson } from "@/components/elements/Map-mapbox/hooks/useConvertShapefileToGeoJson";
import { IconNames } from "@/components/extensive/Icon/Icon";
import Modal from "@/components/extensive/Modal/Modal";
import { useMapContext } from "@/context/map.providerOLD";
import { useModalContext } from "@/context/modal.provider";
import { ToastType, useToastContext } from "@/context/toast.provider";
import { useFilePicker } from "@/hooks/useFilePicker";
import { FileType } from "@/types/common";

export const EditControl = () => {
  const { draw, map } = useMapContext();
  const { openModal, closeModal } = useModalContext();
  const t = useT();
  const clicked = useRef(1);
  const [mode, setMode] = useState<string>();
  const { openToast } = useToastContext();

  const { mutate: convertShapeFile } = useConvertShapeFileToGeoJson({
    async onSuccess(data) {
      const geoJson = await data.json();
      draw?.add(geoJson);
      map?.fitBounds(bbox(draw?.getAll()) as LngLatBoundsLike, { padding: 50, animate: false });
      map?.fire("draw.upload");
    },
    onError() {
      openToast(t("File is not supported!"), ToastType.ERROR);
    }
  });

  const { open: openFilePicker } = useFilePicker(
    files => {
      for (const file of Array.from(files)) {
        convertShapeFile({ file });
      }
    },
    { accept: [FileType.ShapeFiles], multiple: true }
  );

  useEffect(() => {
    if (!map || !draw) return;

    const mouseTooltip = new mapboxgl.Popup({
      closeOnClick: false,
      className: "mouse-tooltip",
      closeButton: false,
      anchor: "left",
      offset: 10
    });
    mouseTooltip.trackPointer();

    const onModeChangeListener = () => {
      setMode(draw.getMode());
      const TooltipMapping: any = {
        draw_polygon: t("Click to start drawing"),
        draw_circle: t("Click to add a circle"),
        drag_circle: t("Click, hold and drag to draw a circle"),
        draw_point: t("Click to add a point")
      };

      const tooltip = TooltipMapping[draw.getMode()];

      if (tooltip) {
        mouseTooltip.setHTML(tooltip);
        mouseTooltip.addTo(map);
        map.getCanvas().style.cursor = "crosshair";
      } else {
        mouseTooltip.remove();
        clicked.current = 1;
        map.getCanvas().style.cursor = "default";
      }
    };

    const onRenderListener = () => {
      if (draw.getMode() === "draw_polygon") {
        if (clicked.current > 2) {
          mouseTooltip.setHTML(t("Click first point to close this shape"));
        } else if (clicked.current >= 1) {
          mouseTooltip.setHTML(t("Click to continue drawing shape"));
        }
      }

      clicked.current++;
    };

    map.on("draw.actionable", onModeChangeListener);
    map.on("click", onRenderListener);

    return () => {
      map.off("draw.actionable", onModeChangeListener);
      map.off("click", onRenderListener);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, draw]);

  const handleClearMap = () => {
    openModal(
      <Modal
        iconProps={{ name: IconNames.EXCLAMATION_CIRCLE, width: 60, height: 60 }}
        title={t("Confirm Map Clear")}
        content={t("Are you sure you want to clear all shapes on the map, this action is irreversible.")}
        primaryButtonProps={{
          children: t("Clear"),
          onClick: () => {
            draw?.deleteAll();
            map?.fire("draw.clear");
            closeModal();
          }
        }}
        secondaryButtonProps={{
          children: t("Cancel"),
          onClick: closeModal
        }}
      />
    );
  };

  if (!draw) return null;

  return (
    <ControlButtonsGroup direction="col">
      <IconButton
        iconProps={{
          name: IconNames.DrawPoint,
          width: 16
        }}
        onClick={() => draw?.changeMode("draw_point")}
        className={classNames("h-8 w-8 rounded-t-lg rounded-b-none", mode === "draw_point" && "bg-neutral-200")}
        aria-label={t("Draw Point")}
      />
      <ControlDivider direction="horizontal" />
      <IconButton
        iconProps={{
          name: IconNames.DrawPolygon,
          width: 16
        }}
        onClick={() => draw?.changeMode("draw_polygon")}
        className={classNames("h-8 w-8 rounded-none", mode === "draw_polygon" && "bg-neutral-200")}
        aria-label={t("Draw Polygon")}
      />
      <ControlDivider direction="horizontal" />
      <IconButton
        iconProps={{
          name: IconNames.DragCircle,
          width: 16
        }}
        onClick={() => draw?.changeMode("drag_circle")}
        className={classNames("h-8 w-8 rounded-none", mode === "drag_circle" && "bg-neutral-200")}
        aria-label={t("Drag Circle")}
      />
      <ControlDivider direction="horizontal" />
      <IconButton
        iconProps={{
          name: IconNames.TRASH,
          width: 16
        }}
        onClick={handleClearMap}
        className={classNames("h-8 w-8 rounded-none", mode === "drag_circle" && "bg-neutral-200")}
        aria-label={t("Clear Map")}
      />
      <ControlDivider direction="horizontal" />
      <IconButton
        iconProps={{
          name: IconNames.UPLOAD,
          width: 16
        }}
        onClick={openFilePicker}
        className={classNames("h-8 w-8 rounded-b-lg rounded-t-none", mode === "drag_circle" && "bg-neutral-200")}
        aria-label={t("Upload Shape File")}
      />
    </ControlButtonsGroup>
  );
};
