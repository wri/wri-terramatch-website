import { useT } from "@transifex/react";
import { useEffect, useState } from "react";

import Text from "@/components/elements/Text/Text";
import Icon, { IconNames } from "@/components/extensive/Icon/Icon";
import ModalAdd from "@/components/extensive/Modal/ModalAdd";
import ModalConfirm from "@/components/extensive/Modal/ModalConfirm";
import { ModalId } from "@/components/extensive/Modal/ModalConst";
import { useLoading } from "@/context/loaderAdmin.provider";
import { useMapAreaContext } from "@/context/mapArea.provider";
import { useModalContext } from "@/context/modal.provider";
import { useNotificationContext } from "@/context/notification.provider";
import { useSitePolygonData } from "@/context/sitePolygon.provider";
import {
  fetchPostV2TerrafundUploadGeojsonProject,
  fetchPostV2TerrafundUploadKmlProject,
  fetchPostV2TerrafundUploadShapefileProject
} from "@/generated/apiComponents";
import { FileType, UploadedFile } from "@/types/common";
import { getErrorMessageFromPayload } from "@/utils/errors";

import Button from "../../Button/Button";

export const PolygonHandler = () => {
  const t = useT();
  const contextMapArea = useMapAreaContext();
  const { setIsUserDrawingEnabled, siteData } = contextMapArea;
  const { openModal, closeModal } = useModalContext();
  const { showLoader, hideLoader } = useLoading();
  const context = useSitePolygonData();
  const reloadSiteData = context?.reloadSiteData;
  const { openNotification } = useNotificationContext();

  const [file, setFile] = useState<UploadedFile | null>(null);
  const [saveFlags, setSaveFlags] = useState<boolean>(false);

  useEffect(() => {
    if (file && saveFlags) {
      uploadFile();
      setSaveFlags(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [file, saveFlags]);

  const uploadFile = async () => {
    showLoader();
    const fileToUpload = file?.rawFile as File;
    const formData = new FormData();
    const fileType = getFileType(file!);
    formData.append("file", fileToUpload);
    formData.append("entity_uuid", siteData?.entityUUID);
    formData.append("entity_type", siteData?.entityName);
    let newRequest: any = formData;

    let uploadPromise;

    switch (fileType) {
      case "geojson":
        uploadPromise = fetchPostV2TerrafundUploadGeojsonProject({ body: newRequest });
        break;
      case "shapefile":
        uploadPromise = fetchPostV2TerrafundUploadShapefileProject({ body: newRequest });
        break;
      case "kml":
        uploadPromise = fetchPostV2TerrafundUploadKmlProject({ body: newRequest });
        break;
      default:
        break;
    }

    try {
      if (uploadPromise) {
        const response = await uploadPromise;
        if (response instanceof Blob) {
          openNotification("success", t("Success!"), t("File uploaded successfully"));
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
        openNotification("error", errorMessage, t("Error uploading file"));
      } else {
        const errorMessage = getErrorMessageFromPayload(error);
        openNotification("error", t("Error uploading file"), t(errorMessage));
      }
    }
    hideLoader();
    closeModal(ModalId.ADD_POLYGONS);
    reloadSiteData?.();
  };

  const getFileType = (file: UploadedFile) => {
    const fileType = file?.file_name.split(".").pop()?.toLowerCase();
    if (fileType === "geojson") return "geojson";
    if (fileType === "zip") return "shapefile";
    if (fileType === "kml") return "kml";
    return null;
  };

  const openFormModalHandlerConfirmUpload = (type: string) => {
    openModal(
      ModalId.CONFIRM_POLYGON_TYPE,
      <ModalConfirm
        title={t(`Confirm Polygon ${type}`)}
        content={t(
          `${
            type === "Creation" ? "Creating" : "Uploading"
          } a new polygon will overwrite the existing geometry. Proceed?`
        )}
        onClose={() => closeModal(ModalId.CONFIRM_POLYGON_TYPE)}
        onConfirm={() => {
          type === "Creation" ? setIsUserDrawingEnabled(true) : openFormModalHandlerAddPolygon();
        }}
      />
    );
  };

  const openFormModalHandlerAddPolygon = () => {
    openModal(
      ModalId.ADD_POLYGONS,
      <ModalAdd
        title={t("Add Polygons")}
        descriptionInput={t("Drag and drop a GeoJSON, Shapefile, or KML.")}
        descriptionList={
          <div className="mt-9 flex">
            <Text variant="text-12-bold">{t("TerraMatch upload limits:")}&nbsp;</Text>
            <Text variant="text-12-light">{t("1 MB per upload")}</Text>
          </div>
        }
        onClose={() => closeModal(ModalId.ADD_POLYGONS)}
        content={t("Start by adding polygons to your site.")}
        primaryButtonText={t("Save")}
        primaryButtonProps={{ className: "px-8 py-3", variant: "primary", onClick: () => setSaveFlags(true) }}
        acceptedTypes={FileType.AcceptedShapefiles.split(",") as FileType[]}
        setFile={(files: UploadedFile[]) => setFile(files[0])} // Only accept the first file
        allowMultiple={false}
      />
    );
  };

  return (
    <div className="flex gap-2">
      <Button
        variant="white-button-map"
        className="group  bg-[#E5F9FD] "
        onClick={() => openFormModalHandlerConfirmUpload("Creation")}
      >
        <Text className="flex items-center font-bold uppercase text-[#637579] group-hover:text-black" variant="text-14">
          <Icon name={IconNames.PLUS_PA} className="h-4 w-4" />
          &nbsp;{t("Create Polygon")}
        </Text>
      </Button>
      <Button variant="white-button-map" className="group " onClick={() => openFormModalHandlerConfirmUpload("Upload")}>
        <Text className="flex items-center font-bold uppercase text-[#637579] group-hover:text-black" variant="text-14">
          <Icon name={IconNames.UPLOAD_PA} className="h-4 w-4" />
          &nbsp; {t("Upload Polygon")}
        </Text>
      </Button>
    </div>
  );
};
