import { useT } from "@transifex/react";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useShowContext } from "react-admin";

import Button from "@/components/elements/Button/Button";
import Dropdown from "@/components/elements/Inputs/Dropdown/Dropdown";
import Text from "@/components/elements/Text/Text";
import Icon, { IconNames } from "@/components/extensive/Icon/Icon";
import ModalAdd from "@/components/extensive/Modal/ModalAdd";
import ModalConfirm from "@/components/extensive/Modal/ModalConfirm";
import { ModalId } from "@/components/extensive/Modal/ModalConst";
import { useModalContext } from "@/context/modal.provider";
import { useNotificationContext } from "@/context/notification.provider";
import {
  fetchGetV2SitePolygonUuidVersions,
  fetchGetV2TerrafundGeojsonComplete,
  fetchPostV2SitePolygonUuidNewVersion,
  fetchPostV2TerrafundUploadGeojson,
  fetchPostV2TerrafundUploadKml,
  fetchPostV2TerrafundUploadShapefile,
  GetV2SitePolygonUuidVersionsResponse,
  useDeleteV2TerrafundPolygonUuid,
  usePutV2SitePolygonUuidMakeActive
} from "@/generated/apiComponents";
import { SitePolygon, SitePolygonsDataResponse } from "@/generated/apiSchemas";
import { FileType, UploadedFile } from "@/types/common";

const VersionHistory = ({
  selectedPolygon,
  setSelectPolygonVersion,
  selectPolygonVersion,
  refreshPolygonList,
  refreshSiteData,
  setSelectedPolygonData,
  setStatusSelectedPolygon,
  data,
  isLoadingVersions,
  refetch,
  isLoadingDropdown,
  setIsLoadingDropdown,
  setPolygonFromMap
}: {
  selectedPolygon: SitePolygon;
  setSelectPolygonVersion: any;
  selectPolygonVersion: SitePolygon | undefined;
  refreshPolygonList?: () => void;
  refreshSiteData?: () => void;
  setSelectedPolygonData?: any;
  setStatusSelectedPolygon?: any;
  data: GetV2SitePolygonUuidVersionsResponse | [];
  isLoadingVersions: boolean;
  refetch: () => void;
  isLoadingDropdown: boolean;
  setIsLoadingDropdown: Dispatch<SetStateAction<boolean>>;
  setPolygonFromMap: Dispatch<SetStateAction<{ isOpen: boolean; uuid: string }>>;
}) => {
  const t = useT();
  const { openNotification } = useNotificationContext();

  const { openModal, closeModal } = useModalContext();
  const ctx = useShowContext();
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [saveFlags, setSaveFlags] = useState<boolean>(false);

  useEffect(() => {
    refetch();
  }, [selectPolygonVersion]);

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
    const uploadPromises = [];
    const polygonSelectedUuid = selectPolygonVersion?.uuid ?? selectedPolygon.uuid;
    for (const file of files) {
      const fileToUpload = file.rawFile as File;
      const formData = new FormData();
      const fileType = getFileType(file);
      formData.append("file", fileToUpload);
      formData.append("uuid", ctx?.record?.uuid as string);
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
      await refetch();
      openNotification("success", t("Success!"), t("File uploaded successfully"));
      closeModal(ModalId.ADD_POLYGON);
    } catch (error) {
      if (error && typeof error === "object" && "message" in error) {
        let errorMessage = error.message as string;
        const parsedMessage = JSON.parse(errorMessage);
        if (parsedMessage && typeof parsedMessage === "object" && "message" in parsedMessage) {
          errorMessage = parsedMessage.message;
        }
        openNotification("error", errorMessage, t("Error uploading file"));
      } else {
        openNotification("error", t("An unknown error occurred"), t("Error uploading file"));
      }
    }
  };

  const { mutate: mutateMakeActive, isLoading } = usePutV2SitePolygonUuidMakeActive({
    onSuccess: () => {
      openNotification("success", "Success!", "Polygon version made active successfully");
    },
    onError: () => {
      openNotification("error", "Error!", "Error making polygon version active");
    }
  });

  const { mutate: mutateDeletePolygonVersion, isPaused: isLoadingDelete } = useDeleteV2TerrafundPolygonUuid({
    onSuccess: async () => {
      await refreshPolygonList?.();
      await refreshSiteData?.();
      await refetch();
      const response = (await fetchGetV2SitePolygonUuidVersions({
        pathParams: { uuid: selectedPolygon.primary_uuid as string }
      })) as SitePolygonsDataResponse;
      const polygonActive = response?.find(item => item.is_active);
      setSelectedPolygonData(polygonActive);
      setStatusSelectedPolygon(polygonActive?.status ?? "");
      openNotification("success", "Success!", "Polygon version deleted successfully");
      setIsLoadingDropdown(false);
    },
    onError: () => {
      openNotification("error", "Error!", "Error deleting polygon version");
    }
  });
  const createNewVersion = async () => {
    const polygonSelectedUuid = selectPolygonVersion?.uuid ?? selectedPolygon.uuid;
    try {
      await fetchPostV2SitePolygonUuidNewVersion({
        pathParams: { uuid: polygonSelectedUuid as string }
      });
      refetch();
      refreshSiteData?.();
      openNotification("success", "Success!", "New version created successfully");
    } catch (error) {
      openNotification("error", "Error!", "Error creating new version");
    }
  };

  const polygonVersionData = (data as SitePolygonsDataResponse)?.map(item => {
    return {
      title: item.poly_name as string,
      value: item.uuid as string
    };
  });

  const makeActivePolygon = async () => {
    const polygonSelectedUuid = selectPolygonVersion?.uuid ?? selectedPolygon.uuid;
    const polygonUuid = selectPolygonVersion?.poly_id ?? selectedPolygon.poly_id;
    const versionActive = (data as SitePolygonsDataResponse)?.find(item => item?.uuid == polygonSelectedUuid);
    if (!versionActive?.is_active) {
      await mutateMakeActive({
        pathParams: { uuid: polygonSelectedUuid as string }
      });
      await refetch();
      await refreshPolygonList?.();
      await refreshSiteData?.();
      setSelectedPolygonData(selectPolygonVersion);
      setStatusSelectedPolygon(selectPolygonVersion?.status ?? "");
      setPolygonFromMap({ isOpen: true, uuid: polygonUuid ?? "" });
      return;
    }
    openNotification("warning", "Warning!", "Polygon version is already active");
  };

  const deletePolygonVersion = async () => {
    await mutateDeletePolygonVersion({
      pathParams: { uuid: (selectPolygonVersion?.poly_id ?? selectedPolygon.poly_id) as string }
    });
  };

  const onDeleteVersion = () => {
    openModal(
      ModalId.CONFIRMATION,
      <ModalConfirm
        title={t("Confirmation")}
        content={t("Do you want to delete this version?")}
        onClose={() => closeModal(ModalId.CONFIRMATION)}
        onConfirm={() => {
          setIsLoadingDropdown(true);
          deletePolygonVersion();
        }}
      />
    );
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

  return (
    <div className="flex flex-col gap-4">
      {!isLoadingVersions && !isLoadingDropdown && (
        <>
          <Dropdown
            label="Polygon Version"
            suffixLabel={
              <div className="flex items-center gap-2 text-blue">
                <div
                  className="flex cursor-pointer items-center gap-1 text-blue hover:opacity-50"
                  onClick={createNewVersion}
                >
                  <button className="border-blue-500 border-1 flex items-center justify-center rounded-md bg-blue text-white">
                    <Icon name={IconNames.PLUS_PA} className="h-2.5 w-2.5 lg:h-2.5 lg:w-2.5" />
                  </button>
                  <Text variant="text-12" className="flex-[2]">
                    Create
                  </Text>
                </div>
                <div
                  className="flex cursor-pointer items-center gap-1 text-blue hover:opacity-50"
                  onClick={() =>
                    downloadGeoJsonPolygon(
                      selectPolygonVersion?.poly_id ?? "",
                      selectPolygonVersion?.poly_name ? formatStringName(selectPolygonVersion.poly_name) : "polygon"
                    )
                  }
                >
                  <button className="border-1 flex items-center justify-center">
                    <Icon name={IconNames.DOWNLOAD_CUSTOM} className="h-3.5 w-3.5 lg:h-3.5 lg:w-3.5" />
                  </button>
                  <Text variant="text-12" className="flex-[2]">
                    Download
                  </Text>
                </div>
                <div
                  className="flex cursor-pointer items-center gap-1 text-blue hover:opacity-50"
                  onClick={openFormModalHandlerAddNewVersion}
                >
                  <button className="border-1 flex items-center justify-center">
                    <Icon name={IconNames.UPLOAD_CLOUD_CUSTOM} className="h-3.5 w-3.5 lg:h-3.5 lg:w-3.5" />
                  </button>
                  <Text variant="text-12" className="flex-[2]">
                    Upload
                  </Text>
                </div>
              </div>
            }
            suffixLabelView={true}
            labelClassName="capitalize"
            labelVariant="text-14-light"
            options={polygonVersionData ?? []}
            defaultValue={[selectPolygonVersion?.uuid ?? selectedPolygon?.uuid] as string[]}
            onChange={e => {
              const polygonVersionData = (data as SitePolygonsDataResponse)?.find(item => item.uuid === e[0]);
              setSelectPolygonVersion(polygonVersionData);
            }}
          />
          <div className="mt-auto flex items-center justify-end gap-5">
            <Button onClick={onDeleteVersion} variant="semi-red" className="w-full" disabled={isLoadingDelete}>
              {t("Delete")}
            </Button>
            <Button onClick={makeActivePolygon} variant="semi-black" className="w-full" disabled={isLoading}>
              {t("Make Active")}
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default VersionHistory;
