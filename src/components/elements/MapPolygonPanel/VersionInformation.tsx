import { useT } from "@transifex/react";
import classNames from "classnames";
import { format } from "date-fns";
import { useEffect, useState } from "react";

import Icon, { IconNames } from "@/components/extensive/Icon/Icon";
import ModalAdd from "@/components/extensive/Modal/ModalAdd";
import ModalConfirm from "@/components/extensive/Modal/ModalConfirm";
import { ModalId } from "@/components/extensive/Modal/ModalConst";
import { useMapAreaContext } from "@/context/mapArea.provider";
import { useModalContext } from "@/context/modal.provider";
import { useNotificationContext } from "@/context/notification.provider";
import {
  fetchGetV2SitePolygonUuid,
  fetchGetV2SitePolygonUuidVersions,
  fetchGetV2TerrafundGeojsonComplete,
  fetchPostV2SitePolygonUuidNewVersion,
  fetchPostV2TerrafundUploadGeojson,
  fetchPostV2TerrafundUploadKml,
  fetchPostV2TerrafundUploadShapefile,
  useDeleteV2TerrafundPolygonUuid,
  usePutV2SitePolygonUuidMakeActive
} from "@/generated/apiComponents";
import { SitePolygon, SitePolygonsDataResponse } from "@/generated/apiSchemas";
import { FileType, UploadedFile } from "@/types/common";
import { getErrorMessageFromPayload } from "@/utils/errors";

import Menu from "../Menu/Menu";
import { MENU_PLACEMENT_RIGHT_BOTTOM } from "../Menu/MenuVariant";
import Text from "../Text/Text";

const VersionInformation = ({
  polygonVersionData,
  refetchPolygonVersions,
  recallEntityData
}: {
  polygonVersionData: SitePolygon[];
  refetchPolygonVersions?: () => void;
  recallEntityData?: () => void;
}) => {
  const { openModal, closeModal } = useModalContext();
  const { openNotification } = useNotificationContext();

  const {
    editPolygon,
    setSelectedPolyVersion,
    setOpenModalConfirmation,
    setPreviewVersion,
    selectedPolyVersion,
    setEditPolygon
  } = useMapAreaContext();
  const t = useT();
  const { mutate: mutateDeletePolygonVersion } = useDeleteV2TerrafundPolygonUuid({
    onSuccess: async () => {
      await refetchPolygonVersions?.();
      await recallEntityData?.();
      const response = (await fetchGetV2SitePolygonUuidVersions({
        pathParams: { uuid: editPolygon?.primary_uuid as string }
      })) as SitePolygonsDataResponse;
      const polygonActive = response?.find(item => item.is_active);
      setEditPolygon({
        isOpen: true,
        uuid: polygonActive?.poly_id as string,
        primary_uuid: polygonActive?.primary_uuid
      });
      openNotification("success", t("Success!"), t("Polygon version deleted successfully"));
    },
    onError: () => {
      openNotification("error", t("Error!"), t("Error deleting polygon version"));
    }
  });

  const { mutate: mutateMakeActive } = usePutV2SitePolygonUuidMakeActive({
    onSuccess: async () => {
      openNotification("success", t("Success!"), t("Polygon version made active successfully"));
      await refetchPolygonVersions?.();
      setPreviewVersion(false);
      setOpenModalConfirmation(false);
      setSelectedPolyVersion({});
    },
    onError: () => {
      openNotification("error", t("Error!"), t("Error making polygon version active"));
    }
  });

  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [saveFlags, setSaveFlags] = useState<boolean>(false);

  useEffect(() => {
    if (files && files.length > 0 && saveFlags) {
      uploadFiles();
      setSaveFlags(false);
    }
  }, [files, saveFlags]);

  const getFileType = (file: UploadedFile) => {
    const fileType = file?.file_name.split(".").pop()?.toLowerCase();
    return ["geojson", "zip", "kml"].includes(fileType as string) ? (fileType == "zip" ? "shapefile" : fileType) : null;
  };

  const uploadFiles = async () => {
    const polygonDefault = polygonVersionData?.find(polygon => polygon.poly_id == editPolygon?.uuid);
    const uploadPromises = [];
    const polygonSelectedUuid = selectedPolyVersion?.uuid ?? editPolygon.primary_uuid;
    for (const file of files) {
      const fileToUpload = file.rawFile as File;
      const formData = new FormData();
      const fileType = getFileType(file);
      formData.append("file", fileToUpload);
      formData.append("uuid", (selectedPolyVersion?.site_id ?? polygonDefault?.site_id) as string);
      formData.append("primary_uuid", polygonSelectedUuid as string);
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
      await refetchPolygonVersions?.();
      const polygonVersionData = (await fetchGetV2SitePolygonUuidVersions({
        pathParams: { uuid: editPolygon?.primary_uuid as string }
      })) as SitePolygon[];
      const polygonActive = polygonVersionData?.find(item => item.is_active);
      setEditPolygon({
        isOpen: true,
        uuid: polygonActive?.poly_id as string,
        primary_uuid: polygonActive?.primary_uuid
      });
      openNotification("success", t("Success!"), t("File uploaded successfully"));
      closeModal(ModalId.ADD_POLYGON);
    } catch (error) {
      if (error && typeof error === "object" && "message" in error) {
        let errorMessage = error.message as string;
        const parsedMessage = JSON.parse(errorMessage);
        if (parsedMessage && typeof parsedMessage === "object" && "message" in parsedMessage) {
          errorMessage = parsedMessage.message;
        }
        openNotification("error", t("Error uploading file"), errorMessage);
      } else {
        const errorMessage = getErrorMessageFromPayload(error);
        openNotification("error", t("Error uploading file"), t(errorMessage));
      }
    }
  };

  const openFormModalHandlerAddNewVersion = () => {
    openModal(
      ModalId.ADD_POLYGON,
      <ModalAdd
        title="Upload Polygon"
        descriptionInput={`Drag and drop a single GeoJSON, KML or SHP to create a new version of your polygon.`}
        descriptionList={
          <div className="mt-9 flex">
            <Text variant="text-12-bold">TerraMatch upload limits:&nbsp;</Text>
            <Text variant="text-12-light">50 MB per upload</Text>
          </div>
        }
        onClose={() => closeModal(ModalId.ADD_POLYGON)}
        content="Create a new polygon version."
        primaryButtonText="Save"
        primaryButtonProps={{ className: "px-8 py-3", variant: "primary", onClick: () => setSaveFlags(true) }}
        acceptedTypes={FileType.AcceptedShapefiles.split(",") as FileType[]}
        setFile={setFiles}
        allowMultiple={false}
      />
    );
  };

  const downloadGeoJsonPolygon = async (polygonUuid: string, polygon_name: string) => {
    const polygonGeojson = await fetchGetV2TerrafundGeojsonComplete({
      queryParams: { uuid: polygonUuid }
    });
    const blob = new Blob([JSON.stringify(polygonGeojson)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${polygon_name}.geojson`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const formatStringName = (name: string) => {
    return name.replace(/ /g, "_");
  };

  const openFormModalHandlerConfirm = (polyId: string) => {
    openModal(
      ModalId.CONFIRMATION,
      <ModalConfirm
        title={t("Confirmation")}
        content={t("Do you want to delete this version?")}
        onClose={() => closeModal(ModalId.CONFIRMATION)}
        onConfirm={() => {
          deletePolygonVersion(polyId);
        }}
      />
    );
  };

  const createNewVersion = async () => {
    const polygonVersionData = (await fetchGetV2SitePolygonUuidVersions({
      pathParams: { uuid: editPolygon.primary_uuid as string }
    })) as SitePolygon[];
    const polygonActive = polygonVersionData?.find(item => item.is_active);
    const polygonUuid = selectedPolyVersion?.uuid ?? polygonActive?.uuid;
    try {
      const newVersion = (await fetchPostV2SitePolygonUuidNewVersion({
        pathParams: { uuid: polygonUuid as string }
      })) as SitePolygon;
      setEditPolygon?.({
        isOpen: true,
        uuid: newVersion?.poly_id as string,
        primary_uuid: newVersion?.primary_uuid
      });
      refetchPolygonVersions?.();
      recallEntityData?.();
      openNotification("success", t("Success!"), t("New version created successfully"));
    } catch (error) {
      openNotification("error", t("Error!"), t("Error creating new version"));
    }
  };

  const itemsPrimaryMenu = (polyId: string, versionUuid?: string) => [
    {
      id: "1",
      render: () => (
        <Text variant="text-14-semibold" className="flex items-center">
          <Icon name={IconNames.SEARCH} className="h-4 w-4 lg:h-5 lg:w-5" />
          &nbsp; {t("Preview Version")}
        </Text>
      ),
      onClick: async () => {
        setSelectedPolyVersion({});
        const response = await fetchGetV2SitePolygonUuid({
          pathParams: { uuid: versionUuid as string }
        });
        setSelectedPolyVersion(response as SitePolygon);
        setPreviewVersion?.(true);
      }
    },
    {
      id: "2",
      render: () => (
        <Text variant="text-14-semibold" className="flex items-center">
          <Icon name={IconNames.TRASH_PA} className="h-4 w-4 lg:h-5 lg:w-5 " />
          &nbsp; {t("Delete Version")}
        </Text>
      ),
      onClick: () => openFormModalHandlerConfirm(polyId)
    }
  ];

  const deletePolygonVersion = async (polyId: string) => {
    await mutateDeletePolygonVersion({
      pathParams: { uuid: polyId }
    });
  };

  useEffect(() => {
    recallEntityData?.();
  }, [selectedPolyVersion]);

  const makeActivePolygon = async (polygon: any) => {
    const versionActive = (polygonVersionData as SitePolygonsDataResponse)?.find(
      item => item?.uuid == (polygon?.uuid as string)
    );
    if (!versionActive?.is_active) {
      await mutateMakeActive({
        pathParams: { uuid: polygon?.uuid as string }
      });
      setEditPolygon?.({
        isOpen: true,
        uuid: polygon?.poly_id as string,
        primary_uuid: polygon?.primary_uuid
      });
      return;
    }
    await refetchPolygonVersions?.();
    openNotification("warning", "Warning!", "Polygon version is already active");
  };

  return (
    <div className="flex h-full flex-col">
      <div className="grid grid-flow-col grid-cols-4 border-b-2 border-t border-[#ffffff1a] py-2 opacity-60">
        <Text variant="text-10-light" className="col-span-2 text-white">
          {t("Version/Name")}
        </Text>
        <Text variant="text-10-light" className="text-white">
          {t("Date")}
        </Text>
        <Text variant="text-10-light" className="text-white">
          {t("Active")}
        </Text>
      </div>
      {polygonVersionData?.map((item: any) => (
        <div key={item.id} className="grid grid-flow-col grid-cols-4 border-b border-[#ffffff1a] py-2 ">
          <Text variant="text-10" className="col-span-1 break-words pr-2 text-white sm:col-span-2">
            {item.version_name ?? item.poly_name}
          </Text>
          <Text variant="text-10" className="text-white">
            {format(new Date(item.created_at), "MMM dd, yy")}
          </Text>
          <div className="flex justify-between">
            <button
              className={classNames("text-10-bold h-min w-[64%] rounded-md border border-white", {
                "bg-white text-[#797F62]": !!item.is_active,
                "bg-transparent text-white": !item.is_active
              })}
              onClick={() => makeActivePolygon(item)}
            >
              {item.is_active ? t("Yes") : t("No")}
            </button>
            <Menu placement={MENU_PLACEMENT_RIGHT_BOTTOM} menu={itemsPrimaryMenu(item.poly_id, item.uuid)} className="">
              <Icon
                name={IconNames.IC_MORE_OUTLINED}
                className="h-4 w-4 rounded-lg text-white hover:fill-primary hover:text-primary lg:h-5 lg:w-5"
              />
            </Menu>
          </div>
        </div>
      ))}
      <div className="mt-auto flex justify-between">
        <button className="text-white hover:text-primary-300" onClick={createNewVersion}>
          <Text variant="text-14-bold" className="flex items-center uppercase ">
            <Icon name={IconNames.PLUS_CIRCLE_CUSTOM} className="h-4 w-6" />
            {t("Create")}
          </Text>
        </button>
        <button
          className="text-white hover:text-primary-300"
          onClick={() => {
            const polygonDefault = polygonVersionData?.find(polygon => polygon.poly_id == editPolygon?.uuid);
            const polygonUuid = selectedPolyVersion?.poly_id ?? polygonDefault?.poly_id;
            const polygonName = selectedPolyVersion?.poly_name ?? polygonDefault?.poly_name;
            downloadGeoJsonPolygon(polygonUuid as string, polygonName ? formatStringName(polygonName) : "polygon");
          }}
        >
          <Text variant="text-14-bold" className="flex items-center uppercase ">
            <Icon name={IconNames.DOWNLOAD_CUSTOM} className="h-4 w-6" />
            {t("Download")}
          </Text>
        </button>
        <button className="text-white hover:text-primary-300" onClick={openFormModalHandlerAddNewVersion}>
          <Text variant="text-14-bold" className="flex items-center uppercase ">
            <Icon name={IconNames.UPLOAD_CLOUD_CUSTOM} className="h-4 w-6" />
            {t("Upload")}
          </Text>
        </button>
      </div>
    </div>
  );
};

export default VersionInformation;
