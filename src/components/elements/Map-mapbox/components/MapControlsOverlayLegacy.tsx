import type { FC } from "react";

import ControlGroup from "@/components/elements/Map-mapbox/components/ControlGroup";
import Icon, { IconNames } from "@/components/extensive/Icon/Icon";

import { zoomToBbox, zoomToCenter } from "../adapters/camera";
import CheckIndividualPolygonControl from "../MapControls/CheckIndividualPolygonControl";
import CheckPolygonControl from "../MapControls/CheckPolygonControl";
import EditControl from "../MapControls/EditControl";
import ImageControl from "../MapControls/ImageControl";
import { PolygonHandler } from "../MapControls/PolygonHandler";
import PolygonModifier from "../MapControls/PolygonModifier";
import ProcessBulkPolygonsControl from "../MapControls/ProcessBulkPolygonsControl";
import { StyleControl } from "../MapControls/StyleControl";
import TrashButton from "../MapControls/TrashButton";
import ViewImageGalleryButton from "../MapControls/ViewImageGalleryButton";
import { ZoomControl } from "../MapControls/ZoomControl";
import type { MapControlsOverlayProps } from "./MapControlsOverlay.types";

/** Default map controls layout (admin, dashboard, forms, etc.).
 * this will be deleted or joined with the Champions map controls
 * once the redesign is complete
 */
const MapControlsOverlayLegacy: FC<MapControlsOverlayProps> = ({
  hasControls,
  draw,
  style,
  admin,
  form,
  camera,
  gallery,
  download,
  fullscreen
}: MapControlsOverlayProps) => {
  const {
    record,
    siteData,
    validationType,
    status,
    isFullscreen,
    setIsLoadingDelayedJob,
    isLoadingDelayedJob,
    setAlertTitle,
    disabledPolygonPanel,
    selectedPolygonsInCheckbox
  } = admin;
  const { formMap, editable, polygonFromMap, viewImages, setViewImages } = form;
  const { map, center, zoom, bbox, hasControls: cameraHasControls } = camera;
  const { dashboardMode, showViewGallery, imageGalleryRef } = gallery;
  const { showDownloadPolygons, isDownloadingPolygons, downloadGeoJsonPolygon } = download;
  const { isEditing, handleEditPolygon, onSaveEdit, onCancelEdit, handleTrashDelete } = draw;
  const { toggleFullscreen } = fullscreen;
  const { currentStyle, handleStyleChange, styleReady } = style;

  return (
    <>
      {showDownloadPolygons ? (
        <ControlGroup position="top-right">
          <button
            type="button"
            className="shadow-lg z-10 flex h-10 w-56 items-center justify-center gap-2 rounded border border-neutral-175 bg-white p-2.5 text-darkCustom-100 hover:bg-neutral-200 disabled:cursor-not-allowed disabled:opacity-50"
            onClick={downloadGeoJsonPolygon}
            disabled={isDownloadingPolygons}
          >
            {isDownloadingPolygons ? (
              <Icon name={IconNames.SPINNER} className="h-5 w-5 animate-spin lg:h-6 lg:w-6" />
            ) : (
              <Icon name={IconNames.DOWNLOAD} className="h-5 w-5 lg:h-6 lg:w-6" />
            )}
            <span>{isDownloadingPolygons ? "Downloading..." : "Download Polygons"}</span>
          </button>
        </ControlGroup>
      ) : null}

      {hasControls ? (
        <>
          {polygonFromMap?.isOpen && !formMap && !disabledPolygonPanel ? (
            <ControlGroup position={siteData ? "top-centerSite" : "top-center"}>
              <EditControl onClick={handleEditPolygon} onSave={onSaveEdit} onCancel={onCancelEdit} />
            </ControlGroup>
          ) : null}

          {selectedPolygonsInCheckbox.length > 0 && !disabledPolygonPanel ? (
            <ControlGroup position={siteData ? "top-centerSite" : "top-centerPolygonsInCheckbox"}>
              <ProcessBulkPolygonsControl
                entityData={record}
                setIsLoadingDelayedJob={setIsLoadingDelayedJob}
                isLoadingDelayedJob={isLoadingDelayedJob}
                setAlertTitle={setAlertTitle}
              />
            </ControlGroup>
          ) : null}

          {dashboardMode !== "dashboard" && dashboardMode !== "modal" && styleReady && map != null ? (
            <ControlGroup position="top-right">
              <StyleControl map={map} currentStyle={currentStyle} setCurrentStyle={handleStyleChange} />
            </ControlGroup>
          ) : null}

          {dashboardMode === "modal" && map != null ? (
            <ControlGroup position="top-right" className="!top-5 z-[19]">
              <StyleControl map={map} currentStyle={currentStyle} setCurrentStyle={handleStyleChange} />
            </ControlGroup>
          ) : null}

          <ControlGroup
            position="top-right"
            className={dashboardMode === "modal" ? "top-[8.25rem] z-[19]" : "top-[4.5rem] z-[19]"}
          >
            <ZoomControl map={map} isFullscreen={isFullscreen} toggleFullscreen={toggleFullscreen} />
          </ControlGroup>

          {record?.uuid != null && validationType === "bulkValidation" && !disabledPolygonPanel ? (
            <ControlGroup position={siteData ? "top-left-site" : "top-left"} isFullscreen={isFullscreen}>
              <CheckPolygonControl
                siteRecord={record.uuid != null ? { ...record, uuid: record.uuid } : undefined}
                polygonCheck={!siteData}
                setIsLoadingDelayedJob={setIsLoadingDelayedJob}
                isLoadingDelayedJob={isLoadingDelayedJob}
                setAlertTitle={setAlertTitle}
              />
            </ControlGroup>
          ) : null}

          {formMap === true ? (
            <>
              <ControlGroup position="top-left">
                <PolygonHandler />
              </ControlGroup>
              <ControlGroup position="top-right" className="top-[17rem]">
                <PolygonModifier
                  polygonFromMap={polygonFromMap}
                  onClick={handleEditPolygon}
                  onSave={onSaveEdit}
                  onCancel={onCancelEdit}
                />
              </ControlGroup>
            </>
          ) : null}

          {status != null && status && validationType === "individualValidation" && !disabledPolygonPanel ? (
            <ControlGroup position={siteData ? "top-left-site" : "top-left"}>
              <CheckIndividualPolygonControl viewRequestSuport={!siteData} entityData={record} />
            </ControlGroup>
          ) : null}

          {viewImages ? (
            <ControlGroup position={siteData ? "bottom-left-site" : "bottom-left"}>
              <ImageControl viewImages={viewImages} setViewImages={setViewImages} />
            </ControlGroup>
          ) : null}

          {!editable && !viewImages ? <ControlGroup position={siteData ? "bottom-left-site" : "bottom-left"} /> : null}

          <ControlGroup
            position="top-right"
            className={dashboardMode === "modal" ? "top-[14.5rem] z-[19]" : "top-[10.5rem]"}
          >
            <button
              type="button"
              className="h-10 w-10 rounded-sm border border-neutral-175 bg-white p-2 text-darkCustom-100 hover:bg-neutral-200"
              onClick={() => {
                if (center != null && zoom !== undefined && map != null) {
                  zoomToCenter(center, zoom, map);
                } else if (bbox != null && map != null) {
                  zoomToBbox(bbox, map, cameraHasControls ?? false);
                }
              }}
            >
              <Icon name={IconNames.IC_EARTH_MAP} className="h-6 w-6" />
            </button>
          </ControlGroup>

          {dashboardMode == null ? (
            <ControlGroup position="top-right" className="top-[13.75rem]">
              <button
                type="button"
                className="h-10 w-10 rounded-sm border border-neutral-175 bg-white p-2 text-darkCustom-100 hover:bg-neutral-200"
                onClick={toggleFullscreen}
                aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
              >
                <Icon name={isFullscreen ? IconNames.IC_SHINK : IconNames.IC_EXPAND} className="h-6 w-6" />
              </button>
            </ControlGroup>
          ) : null}

          {isEditing ? (
            <ControlGroup position="top-right" className="top-[272px]">
              <TrashButton onClick={handleTrashDelete} />
            </ControlGroup>
          ) : null}

          {formMap !== true && showViewGallery ? (
            <ControlGroup position="bottom-right" className="bottom-8 flex flex-row gap-2 mobile:hidden">
              {dashboardMode === "dashboard" && styleReady && map != null && (
                <StyleControl map={map} currentStyle={currentStyle} setCurrentStyle={handleStyleChange} />
              )}
              {dashboardMode !== "dashboard" && dashboardMode !== "modal" && !disabledPolygonPanel && (
                <ViewImageGalleryButton imageGalleryRef={imageGalleryRef} />
              )}
            </ControlGroup>
          ) : null}
        </>
      ) : null}
    </>
  );
};

export default MapControlsOverlayLegacy;
