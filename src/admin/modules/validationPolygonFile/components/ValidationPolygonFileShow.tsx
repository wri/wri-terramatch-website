import { Stack } from "@mui/material";
import { useT } from "@transifex/react";
import { FC, useEffect, useState } from "react";

import Button from "@/components/elements/Button/Button";
import useAlertHook from "@/components/elements/MapPolygonPanel/hooks/useAlertHook";
import Text from "@/components/elements/Text/Text";
import ModalAdd from "@/components/extensive/Modal/ModalAdd";
import { ModalId } from "@/components/extensive/Modal/ModalConst";
import { useLoading } from "@/context/loaderAdmin.provider";
import { useModalContext } from "@/context/modal.provider";
import {
  fetchPostV2TerrafundUploadGeojsonValidate,
  fetchPostV2TerrafundUploadKmlValidate,
  fetchPostV2TerrafundUploadShapefileValidate
} from "@/generated/apiComponents";
import { FileType, UploadedFile } from "@/types/common";

const ValidatePolygonFileShow: FC = () => {
  const { openModal, closeModal } = useModalContext();
  const [file, setFile] = useState<UploadedFile | null>(null);
  const [saveFlags, setSaveFlags] = useState<boolean>(false);
  const { showLoader, hideLoader } = useLoading();
  const { displayNotification } = useAlertHook();
  const t = useT();
  useEffect(() => {
    if (file && saveFlags) {
      uploadFile();
      setSaveFlags(false);
    }
  }, [saveFlags]);

  const getFileType = (file: UploadedFile) => {
    const fileType = file?.file_name.split(".").pop()?.toLowerCase();
    if (fileType === "geojson") return "geojson";
    if (fileType === "zip") return "shapefile";
    if (fileType === "kml") return "kml";
    return null;
  };

  const uploadFile = async () => {
    showLoader();
    const fileToUpload = file?.rawFile as File;
    const formData = new FormData();
    const fileType = getFileType(file!);
    formData.append("file", fileToUpload);
    let newRequest: any = formData;

    let uploadPromise;

    switch (fileType) {
      case "geojson":
        uploadPromise = fetchPostV2TerrafundUploadGeojsonValidate({ body: newRequest });
        break;
      case "shapefile":
        uploadPromise = fetchPostV2TerrafundUploadShapefileValidate({ body: newRequest });
        break;
      case "kml":
        uploadPromise = fetchPostV2TerrafundUploadKmlValidate({ body: newRequest });
        break;
      default:
        break;
    }

    try {
      if (uploadPromise) {
        const response = await uploadPromise;
        if (response instanceof Blob) {
          displayNotification(t("File uploaded successfully"), "success", t("Success!"));
          const blob = response;
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement("a");
          const getFormattedDate = () => {
            const date = new Date();
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, "0");
            const day = String(date.getDate()).padStart(2, "0");
            return `${year}-${month}-${day}`;
          };

          const currentDate = getFormattedDate();
          a.href = url;
          a.download = `polygon-check-results-${currentDate}.csv`;
          a.click();
          window.URL.revokeObjectURL(url);
        }
      }
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
    hideLoader();
    closeModal(ModalId.ADD_POLYGON);
  };

  const openFormModalHandlerAddPolygon = () => {
    openModal(
      ModalId.ADD_POLYGON,
      <ModalAdd
        title="Add Polygon"
        descriptionInput={`Drag and drop a GeoJSON, Shapefile, or KML.`}
        descriptionList={
          <div className="mt-9 flex">
            <Text variant="text-12-bold">TerraMatch upload file:&nbsp;</Text>
            <Text variant="text-12-light">Test polygon</Text>
          </div>
        }
        onClose={() => closeModal(ModalId.ADD_POLYGON)}
        content="Add a polygon to test validation."
        primaryButtonText="Save"
        primaryButtonProps={{ className: "px-8 py-3", variant: "primary", onClick: () => setSaveFlags(true) }}
        acceptedTYpes={FileType.ShapeFiles.split(",") as FileType[]}
        setFile={(files: UploadedFile[]) => setFile(files[0])} // Only accept the first file
        allowMultiple={false}
      />
    );
  };

  return (
    <>
      <Stack gap={1} className="pb-6">
        <Text variant="text-36-bold" className="leading-none">
          Test Polygon
        </Text>
      </Stack>
      <div className="flex gap-3">
        <Button onClick={openFormModalHandlerAddPolygon} className="px-8 py-3" variant="primary">
          <Text variant="text-14-bold">Upload Polygon File</Text>
        </Button>
      </div>
    </>
  );
};

export default ValidatePolygonFileShow;
