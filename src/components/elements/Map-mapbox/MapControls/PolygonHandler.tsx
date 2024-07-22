import { useT } from "@transifex/react";
import mapboxgl from "mapbox-gl";
import { useEffect, useState } from "react";

import Text from "@/components/elements/Text/Text";
import ModalAdd from "@/components/extensive/Modal/ModalAdd";
import { useLoading } from "@/context/loaderAdmin.provider";
import { useMapAreaContext } from "@/context/mapArea.provider";
import { useModalContext } from "@/context/modal.provider";
import {
  fetchPostV2TerrafundUploadGeojson,
  fetchPostV2TerrafundUploadKml,
  fetchPostV2TerrafundUploadShapefile
} from "@/generated/apiComponents";
import { FileType, UploadedFile } from "@/types/common";

import Button from "../../Button/Button";
import useAlertHook from "../../MapPolygonPanel/hooks/useAlertHook";

export const PolygonHandler = ({ map }: { map: mapboxgl.Map | null }) => {
  const t = useT();
  const contextMapArea = useMapAreaContext();
  console.log("context", contextMapArea);
  const { setIsUserDrawingEnabled } = contextMapArea;
  const { openModal, closeModal } = useModalContext();
  const { showLoader, hideLoader } = useLoading();
  const { displayNotification } = useAlertHook();

  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [saveFlags, setSaveFlags] = useState<boolean>(false);

  useEffect(() => {
    if (files && files.length > 0 && saveFlags) {
      uploadFiles();
      setSaveFlags(false);
    }
  }, [files, saveFlags]);

  const uploadFiles = async () => {
    const uploadPromises = [];
    showLoader();

    for (const file of files) {
      const fileToUpload = file.rawFile as File;
      // const site_uuid = record.uuid;
      const formData = new FormData();
      const fileType = getFileType(file);
      formData.append("file", fileToUpload);
      // formData.append("uuid", site_uuid);
      let newRequest: any = formData;

      switch (fileType) {
        case "geojson":
          uploadPromises.push(fetchPostV2TerrafundUploadGeojson({ body: newRequest }));
          break;
        case "shapefile":
          uploadPromises.push(fetchPostV2TerrafundUploadShapefile({ body: newRequest }));
          break;
        case "kml":
          uploadPromises.push(fetchPostV2TerrafundUploadKml({ body: newRequest }));
          break;
        default:
          break;
      }
    }
    try {
      await Promise.all(uploadPromises);
      displayNotification(t("File uploaded successfully"), "success", t("Success!"));
      // refetch();
      // refetchSiteBbox();
      closeModal();
      hideLoader();
    } catch (error) {
      if (error && typeof error === "object" && "message" in error) {
        let errorMessage = error.message as string;
        const parsedMessage = JSON.parse(errorMessage);
        if (parsedMessage && typeof parsedMessage === "object" && "message" in parsedMessage) {
          errorMessage = parsedMessage.message;
        }
        displayNotification(t("Error uploading file"), "error", errorMessage);
      } else {
        displayNotification(t("Error uploadig file"), "error", t("An unknown error occurred"));
      }
    }
  };

  const getFileType = (file: UploadedFile) => {
    const fileType = file?.file_name.split(".").pop()?.toLowerCase();
    if (fileType === "geojson") return "geojson";
    if (fileType === "zip") return "shapefile";
    if (fileType === "kml") return "kml";
    return null;
  };

  const openFormModalHandlerAddPolygon = () => {
    openModal(
      <ModalAdd
        title="Add Polygons"
        descriptionInput={`Drag and drop a GeoJSON, Shapefile, or KML.`}
        descriptionList={
          <div className="mt-9 flex">
            <Text variant="text-12-bold">TerraMatch upload limits:&nbsp;</Text>
            <Text variant="text-12-light">50 MB per upload</Text>
          </div>
        }
        onClose={closeModal}
        content="Start by adding polygons to your site."
        primaryButtonText="Save"
        primaryButtonProps={{ className: "px-8 py-3", variant: "primary", onClick: () => setSaveFlags(true) }}
        acceptedTYpes={FileType.ShapeFiles.split(",") as FileType[]}
        setFile={setFiles}
      />
    );
  };

  return (
    <div className="flex gap-2">
      <Button
        variant="text"
        className="text-10-bold flex w-full justify-center whitespace-nowrap rounded-lg border border-white bg-white p-2 text-black hover:border-black"
        onClick={() => setIsUserDrawingEnabled(true)}
      >
        {t("Create Polygon")}
      </Button>
      <Button
        variant="text"
        className="text-10-bold flex w-full justify-center whitespace-nowrap rounded-lg border border-tertiary-600 bg-tertiary-600 p-2 text-white hover:border-white"
        onClick={openFormModalHandlerAddPolygon}
      >
        {t("Upload Polygon")}
      </Button>
    </div>
  );
};
