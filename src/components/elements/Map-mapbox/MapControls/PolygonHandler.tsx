import { useT } from "@transifex/react";
import { useEffect, useState } from "react";

import Text from "@/components/elements/Text/Text";
import Icon, { IconNames } from "@/components/extensive/Icon/Icon";
import ModalAdd from "@/components/extensive/Modal/ModalAdd";
import ModalConfirm from "@/components/extensive/Modal/ModalConfirm";
import { ModalId } from "@/components/extensive/Modal/ModalConst";
import { uploadProjectPolygonFileResource } from "@/connections/ProjectPolygons";
import { useLoading } from "@/context/loaderAdmin.provider";
import { useMapAreaContext } from "@/context/mapArea.provider";
import { useModalContext } from "@/context/modal.provider";
import { useNotificationContext } from "@/context/notification.provider";
import { useSitePolygonData } from "@/context/sitePolygon.provider";
import { FileType, UploadedFile } from "@/types/common";

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
    if (!siteData?.entityUUID) {
      openNotification("error", t("Error"), t("Missing project pitch information"));
      return;
    }

    if (!file?.rawFile) {
      openNotification("error", t("Error"), t("No file selected"));
      return;
    }

    showLoader();
    const fileToUpload = file.rawFile as File;
    const projectPitchUuid = siteData.entityUUID;

    try {
      await uploadProjectPolygonFileResource(projectPitchUuid, fileToUpload);
      openNotification("success", t("Success!"), t("File uploaded successfully"));
    } catch (error) {
      let errorMessage = t("Error uploading file");

      if (error && typeof error === "object" && "message" in error) {
        try {
          const message = error.message as string;
          const parsedMessage = JSON.parse(message);
          if (parsedMessage && typeof parsedMessage === "object" && "message" in parsedMessage) {
            errorMessage = parsedMessage.message;
          } else {
            errorMessage = message;
          }
        } catch {
          errorMessage = error.message as string;
        }
      }

      openNotification("error", t("Error uploading file"), errorMessage);
    } finally {
      hideLoader();
      closeModal(ModalId.ADD_POLYGONS);
      reloadSiteData?.();
    }
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
        <Text
          as="div"
          className="flex items-center font-bold uppercase text-[#637579] group-hover:text-black"
          variant="text-14"
        >
          <Icon name={IconNames.PLUS_PA} className="h-4 w-4" />
          &nbsp;{t("Create Polygon")}
        </Text>
      </Button>
      <Button variant="white-button-map" className="group " onClick={() => openFormModalHandlerConfirmUpload("Upload")}>
        <Text
          as="div"
          className="flex items-center font-bold uppercase text-[#637579] group-hover:text-black"
          variant="text-14"
        >
          <Icon name={IconNames.UPLOAD_PA} className="h-4 w-4" />
          &nbsp; {t("Upload Polygon")}
        </Text>
      </Button>
    </div>
  );
};
