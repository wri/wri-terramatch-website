import { useT } from "@transifex/react";
import classNames from "classnames";
import { format } from "date-fns";
import { useEffect, useState } from "react";

import { downloadPolygonGeoJson } from "@/components/elements/Map-mapbox/utils";
import Icon, { IconNames } from "@/components/extensive/Icon/Icon";
import ModalAdd from "@/components/extensive/Modal/ModalAdd";
import ModalConfirm from "@/components/extensive/Modal/ModalConfirm";
import { ModalId } from "@/components/extensive/Modal/ModalConst";
import { deletePolygonVersion, loadListPolygonVersions, updatePolygonVersionAsync } from "@/connections/PolygonVersion";
import { createBlankVersion } from "@/connections/SitePolygons";
import { useMapAreaContext } from "@/context/mapArea.provider";
import { useModalContext } from "@/context/modal.provider";
import { useNotificationContext } from "@/context/notification.provider";
import {
  fetchPostV2TerrafundUploadGeojson,
  fetchPostV2TerrafundUploadKml,
  fetchPostV2TerrafundUploadShapefile
} from "@/generated/apiComponents";
import { SitePolygon } from "@/generated/apiSchemas";
import ApiSlice from "@/store/apiSlice";
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

  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [saveFlags, setSaveFlags] = useState<boolean>(false);

  useEffect(() => {
    if (files && files.length > 0 && saveFlags) {
      uploadFiles();
      setSaveFlags(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [files, saveFlags]);

  const getFileType = (file: UploadedFile) => {
    const fileType = file?.fileName.split(".").pop()?.toLowerCase();
    return ["geojson", "zip", "kml"].includes(fileType as string) ? (fileType == "zip" ? "shapefile" : fileType) : null;
  };

  const uploadFiles = async () => {
    const polygonDefault = polygonVersionData?.find(polygon => polygon.poly_id == editPolygon?.uuid);
    const uploadPromises = [];
    const polygonSelectedUuid =
      (selectedPolyVersion as any)?.primaryUuid ??
      (selectedPolyVersion as any)?.primary_uuid ??
      editPolygon.primary_uuid;
    for (const file of files) {
      const fileToUpload = file.rawFile as File;
      const formData = new FormData();
      const fileType = getFileType(file);
      formData.append("file", fileToUpload);
      formData.append(
        "uuid",
        ((selectedPolyVersion as any)?.siteId ??
          (selectedPolyVersion as any)?.site_id ??
          polygonDefault?.site_id) as string
      );
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

      ApiSlice.pruneCache("sitePolygons");
      ApiSlice.pruneIndex("sitePolygons", "");

      await refetchPolygonVersions?.();

      await recallEntityData?.();

      if (editPolygon?.primary_uuid) {
        const response = await loadListPolygonVersions({
          uuid: editPolygon.primary_uuid
        });
        const polygonActive = response?.data?.find(item => item.isActive);
        if (polygonActive) {
          setEditPolygon({
            isOpen: true,
            uuid: polygonActive.polygonUuid as string,
            primary_uuid: polygonActive.primaryUuid ?? undefined
          });
        }
      }

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
    await downloadPolygonGeoJson(polygonUuid, polygon_name, { includeExtendedData: true });
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
          handleDeletePolygonVersion(polyId);
        }}
      />
    );
  };

  const createNewVersion = async () => {
    if (!editPolygon.primary_uuid) {
      openNotification("error", t("Error!"), t("Missing polygon information"));
      return;
    }

    try {
      const newVersion = await createBlankVersion(editPolygon.primary_uuid, "Created new version");

      ApiSlice.pruneCache("sitePolygons");
      ApiSlice.pruneIndex("sitePolygons", "");

      await refetchPolygonVersions?.();

      await recallEntityData?.();

      setEditPolygon?.({
        isOpen: true,
        uuid: newVersion.polygonUuid as string,
        primary_uuid: newVersion.primaryUuid ?? undefined
      });

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
        setSelectedPolyVersion({} as any);
        const version = polygonVersionData?.find(item => item.uuid === versionUuid);
        if (version) {
          setSelectedPolyVersion({
            uuid: version.uuid,
            poly_id: version.poly_id,
            poly_name: version.version_name ?? version.poly_name,
            primary_uuid: version.primary_uuid,
            practice: version.practice,
            target_sys: version.target_sys,
            distr: version.distr,
            source: version.source,
            is_active: version.is_active
          } as any);
          setPreviewVersion?.(true);
        } else {
          openNotification("error", t("Error!"), t("Polygon version not found"));
        }
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
      onClick: () => openFormModalHandlerConfirm(versionUuid as string)
    }
  ];

  const handleDeletePolygonVersion = async (polyId: string) => {
    try {
      await deletePolygonVersion(polyId);
      ApiSlice.pruneCache("sitePolygons");
      ApiSlice.pruneIndex("sitePolygons", "");

      await refetchPolygonVersions?.();

      await recallEntityData?.();

      if (editPolygon?.primary_uuid) {
        const response = await loadListPolygonVersions({
          uuid: editPolygon.primary_uuid
        });
        const polygonActive = response?.data?.find(item => item.isActive);
        if (polygonActive) {
          setEditPolygon({
            isOpen: true,
            uuid: polygonActive.polygonUuid as string,
            primary_uuid: polygonActive.primaryUuid ?? undefined
          });
        }
      }

      openNotification("success", t("Success!"), t("Polygon version deleted successfully"));
    } catch (error) {
      openNotification("error", t("Error!"), t("Error deleting polygon version"));
    }
  };

  const makeActivePolygon = async (polygon: any) => {
    const versionActive = polygonVersionData?.find(item => item?.uuid === (polygon?.uuid as string));
    if (!versionActive) {
      openNotification("error", t("Error!"), t("Polygon version not found"));
      return;
    }

    if (!versionActive.is_active) {
      try {
        await updatePolygonVersionAsync(polygon?.uuid as string, {
          isActive: true
        });

        ApiSlice.pruneCache("sitePolygons");
        ApiSlice.pruneIndex("sitePolygons", "");
        await refetchPolygonVersions?.();

        await recallEntityData?.();

        setPreviewVersion(false);
        setOpenModalConfirmation(false);
        setSelectedPolyVersion({} as any);
        setEditPolygon?.({
          isOpen: true,
          uuid: polygon?.poly_id as string,
          primary_uuid: polygon?.primary_uuid ?? undefined
        });

        openNotification("success", t("Success!"), t("Polygon version made active successfully"));
      } catch (error) {
        openNotification("error", t("Error!"), t("Error making polygon version active"));
      }
      return;
    }
    await refetchPolygonVersions?.();
    openNotification("warning", t("Warning!"), t("Polygon version is already active"));
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
        <div key={item.uuid ?? item.id} className="grid grid-flow-col grid-cols-4 border-b border-[#ffffff1a] py-2 ">
          <Text variant="text-10" className="col-span-1 break-words pr-2 text-white sm:col-span-2">
            {item.version_name ?? item.poly_name}
          </Text>
          <Text variant="text-10" className="text-white">
            {(() => {
              try {
                return format(new Date(item.created_at), "MMM dd, yy");
              } catch (e) {
                return "-";
              }
            })()}
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
            const polygonUuid =
              (selectedPolyVersion as any)?.polygonUuid ??
              (selectedPolyVersion as any)?.poly_id ??
              polygonDefault?.poly_id;
            const polygonName =
              (selectedPolyVersion as any)?.name ??
              (selectedPolyVersion as any)?.poly_name ??
              polygonDefault?.poly_name;
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
