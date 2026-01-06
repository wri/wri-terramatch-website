import { useT } from "@transifex/react";
import { Dispatch, SetStateAction, useCallback, useEffect, useMemo, useState } from "react";
import { useShowContext } from "react-admin";

import Button from "@/components/elements/Button/Button";
import Dropdown from "@/components/elements/Inputs/Dropdown/Dropdown";
import { downloadPolygonGeoJson } from "@/components/elements/Map-mapbox/utils";
import Text from "@/components/elements/Text/Text";
import Icon, { IconNames } from "@/components/extensive/Icon/Icon";
import ModalAdd from "@/components/extensive/Modal/ModalAdd";
import ModalConfirm from "@/components/extensive/Modal/ModalConfirm";
import { ModalId } from "@/components/extensive/Modal/ModalConst";
import { uploadVersionForPolygon } from "@/connections/GeometryUpload";
import {
  deletePolygonVersion,
  loadListPolygonVersions,
  updatePolygonVersionAsync,
  useListPolygonVersions
} from "@/connections/PolygonVersion";
import { createBlankVersion } from "@/connections/SitePolygons";
import { useModalContext } from "@/context/modal.provider";
import { useNotificationContext } from "@/context/notification.provider";
import { SitePolygon } from "@/generated/apiSchemas";
import { SitePolygonLightDto } from "@/generated/v3/researchService/researchServiceSchemas";
import ApiSlice from "@/store/apiSlice";
import { FileType, UploadedFile } from "@/types/common";

const VersionHistory = ({
  selectedPolygon,
  setSelectPolygonVersion,
  selectPolygonVersion,
  refreshPolygonList,
  refreshSiteData,
  setSelectedPolygonData,
  setStatusSelectedPolygon,
  isLoadingDropdown,
  setIsLoadingDropdown,
  setSelectedPolygonToDrawer,
  selectedPolygonIndex,
  setPolygonFromMap,
  polygonFromMap,
  wrapperRef
}: {
  selectedPolygon: SitePolygonLightDto;
  setSelectPolygonVersion: any;
  selectPolygonVersion: SitePolygonLightDto | undefined;
  refreshPolygonList?: () => void;
  refreshSiteData?: () => void;
  setSelectedPolygonData?: any;
  setStatusSelectedPolygon?: any;
  isLoadingDropdown: boolean;
  setIsLoadingDropdown: Dispatch<SetStateAction<boolean>>;
  setPolygonFromMap: Dispatch<SetStateAction<{ isOpen: boolean; uuid: string }>>;
  setSelectedPolygonToDrawer?: Dispatch<SetStateAction<{ id: string; status: string; label: string; uuid: string }>>;
  selectedPolygonIndex?: string;
  polygonFromMap?: { isOpen: boolean; uuid: string };
  wrapperRef: any;
}) => {
  const t = useT();
  const { openNotification } = useNotificationContext();

  const { openModal, closeModal } = useModalContext();
  const ctx = useShowContext();
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [saveFlags, setSaveFlags] = useState<boolean>(false);

  const primaryUuid = useMemo(
    () => selectPolygonVersion?.primaryUuid ?? selectedPolygon.primaryUuid,
    [selectPolygonVersion?.primaryUuid, selectedPolygon.primaryUuid]
  );

  const connectionProps = useMemo(
    () => ({
      uuid: (primaryUuid ?? undefined) as string | undefined,
      enabled: !!primaryUuid
    }),
    [primaryUuid]
  );

  const [isVersionsLoaded, { data: versionsData, refetch: refetchVersionsList }] =
    useListPolygonVersions(connectionProps);
  const isLoadingVersions = !isVersionsLoaded;

  const versionUuid = selectPolygonVersion?.uuid ?? selectedPolygon.uuid;
  const [isUpdating, setIsUpdating] = useState(false);

  const isActiveVersion = selectPolygonVersion?.isActive ?? selectedPolygon.isActive ?? false;

  const getPolygonSelectedUuid = useCallback(() => {
    return selectPolygonVersion?.primaryUuid ?? selectedPolygon.primaryUuid;
  }, [selectPolygonVersion, selectedPolygon]);

  const updatePolygonData = useCallback(
    async (polygonData: SitePolygon | undefined) => {
      if (polygonData != null) {
        if (setSelectedPolygonData != null) {
          setSelectedPolygonData(polygonData);
        }
        if (setSelectedPolygonToDrawer != null) {
          setSelectedPolygonToDrawer({
            id: selectedPolygonIndex as string,
            status: polygonData?.status as string,
            label: polygonData?.poly_name as string,
            uuid: polygonData?.poly_id as string
          });
        }
        setPolygonFromMap({ isOpen: true, uuid: polygonData?.poly_id ?? "" });
        if (setStatusSelectedPolygon != null) {
          setStatusSelectedPolygon(polygonData?.status ?? "");
        }
      }
    },
    [
      setSelectedPolygonData,
      setSelectedPolygonToDrawer,
      selectedPolygonIndex,
      setPolygonFromMap,
      setStatusSelectedPolygon
    ]
  );

  const handleError = useCallback((error: unknown, defaultMessage: string) => {
    if (error != null && typeof error === "object" && "message" in error) {
      try {
        const parsedMessage = JSON.parse(error.message as string);
        if (parsedMessage != null && typeof parsedMessage === "object" && "message" in parsedMessage) {
          return parsedMessage.message as string;
        }
      } catch {
        return error.message as string;
      }
      return error.message as string;
    }
    return defaultMessage;
  }, []);

  useEffect(() => {
    if (files && files.length > 0 && saveFlags) {
      uploadFiles();
      setSaveFlags(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [files, saveFlags]);

  const uploadFiles = async () => {
    const polygonUuid = selectPolygonVersion?.uuid ?? selectedPolygon.uuid;
    const siteId = ctx?.record?.uuid as string;

    if (!polygonUuid) {
      openNotification("error", t("Error!"), t("Missing polygon information"));
      setIsLoadingDropdown(false);
      return;
    }

    if (!siteId) {
      openNotification("error", t("Error!"), t("Missing site information"));
      setIsLoadingDropdown(false);
      return;
    }

    const file = files[0];
    if (!file?.rawFile) {
      openNotification("error", t("Error!"), t("No file selected"));
      setIsLoadingDropdown(false);
      return;
    }

    setIsLoadingDropdown(true);

    try {
      await uploadVersionForPolygon(polygonUuid, file.rawFile as File, siteId);

      if (polygonUuid) {
        ApiSlice.pruneCache("sitePolygons", [polygonUuid]);
      }

      await refreshSiteData?.();
      await refreshPolygonList?.();

      const polygonSelectedPrimaryUuid = getPolygonSelectedUuid();
      const versionsResponse = await loadListPolygonVersions({ uuid: polygonSelectedPrimaryUuid as string });
      const versionsList = versionsResponse?.data;
      const polygonActive = versionsList?.[0];

      if (polygonActive) {
        const legacyPolygonData = {
          poly_id: polygonActive.polygonUuid,
          poly_name: polygonActive.name,
          status: polygonActive.status,
          primary_uuid: polygonActive.primaryUuid
        } as SitePolygon;
        await updatePolygonData(legacyPolygonData);
      }
      setIsLoadingDropdown(false);
      openNotification("success", t("Success!"), t("File uploaded successfully"));
      closeModal(ModalId.ADD_POLYGON);
    } catch (error) {
      const errorMessage = handleError(error, t("An unknown error occurred"));
      openNotification("error", errorMessage, t("Error uploading file"));
      setIsLoadingDropdown(false);
    }
  };

  const [isLoadingDelete, setIsLoadingDelete] = useState(false);
  const createNewVersion = async () => {
    const polygonPrimaryUuid = getPolygonSelectedUuid();
    const polygonUuid = selectPolygonVersion?.polygonUuid ?? selectedPolygon.polygonUuid;
    try {
      setIsLoadingDropdown(true);

      const newVersion = await createBlankVersion(polygonPrimaryUuid as string, "Duplicate version");

      if (polygonUuid) {
        ApiSlice.pruneCache("sitePolygons", [polygonUuid]);
      }

      await refreshSiteData?.();
      await refreshPolygonList?.();

      await refetchVersionsList();

      const legacyPolygonData = {
        poly_id: newVersion.polygonUuid,
        poly_name: newVersion.name,
        status: newVersion.status,
        primary_uuid: newVersion.primaryUuid
      } as SitePolygon;

      await updatePolygonData(legacyPolygonData);
      setIsLoadingDropdown(false);
      openNotification("success", "Success!", "New version created successfully");
    } catch (error) {
      openNotification("error", "Error!", "Error creating new version");
      setIsLoadingDropdown(false);
    }
  };

  const polygonVersionData = versionsData?.map(item => {
    return {
      title: (item?.versionName ?? item.name) as string,
      value: item.uuid as string
    };
  });

  const makeActivePolygon = async () => {
    try {
      setIsUpdating(true);
      const polygonUuid = selectPolygonVersion?.polygonUuid ?? selectedPolygon.polygonUuid;

      await updatePolygonVersionAsync(versionUuid, {
        isActive: true
      });

      if (polygonUuid) {
        await ApiSlice.pruneCache("sitePolygons", [polygonUuid]);
      }

      const versionsResponse = await loadListPolygonVersions({ uuid: primaryUuid as string });
      const versionsList = versionsResponse?.data;
      const newlyActiveVersion = versionsList?.find(v => v.uuid === versionUuid) ?? selectPolygonVersion;

      await refreshPolygonList?.();
      if (setSelectedPolygonData != null && newlyActiveVersion) {
        setSelectedPolygonData(newlyActiveVersion);
      }

      const element = wrapperRef.current as HTMLElement;
      element.scrollTo({
        top: 1000000
      });

      if (setStatusSelectedPolygon != null && newlyActiveVersion) {
        setStatusSelectedPolygon(newlyActiveVersion.status ?? "");
      }

      setPolygonFromMap({ isOpen: true, uuid: polygonUuid ?? "" });
      openNotification("success", "Success!", "Polygon version made active successfully");
    } catch (error) {
      openNotification("error", "Error!", "Error making polygon version active");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeletePolygonVersion = async () => {
    try {
      setIsLoadingDelete(true);
      const uuidToDelete = selectPolygonVersion?.uuid ?? selectedPolygon.uuid;
      const polygonUuidToUpdate = selectPolygonVersion?.polygonUuid ?? selectedPolygon.polygonUuid;

      await deletePolygonVersion(uuidToDelete);

      if (polygonUuidToUpdate) {
        await ApiSlice.pruneCache("sitePolygons", [polygonUuidToUpdate]);
      }
      await ApiSlice.pruneIndex("sitePolygons", "");
      await refreshSiteData?.();
      await refreshPolygonList?.();

      await refetchVersionsList();

      openNotification("success", "Success!", "Polygon version deleted successfully");
      setIsLoadingDelete(false);
      setIsLoadingDropdown(false);
    } catch (error: any) {
      const errorMessage = error?.message ?? "Error deleting polygon version";
      openNotification("error", "Error!", errorMessage);
      setIsLoadingDelete(false);
      setIsLoadingDropdown(false);
    }
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
          handleDeletePolygonVersion();
          closeModal(ModalId.CONFIRMATION);
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
    await downloadPolygonGeoJson(polygonUuid, polygon_name, { includeExtendedData: true });
  };

  const formatStringName = (name: string) => {
    return name.replace(/ /g, "_");
  };

  return (
    <div className="flex flex-col gap-4">
      {isLoadingVersions || isLoadingDropdown ? (
        <div className="flex items-center justify-center p-4">
          <Text variant="text-14-light">{t("Loading versions...")}</Text>
        </div>
      ) : versionsData && versionsData.length > 0 ? (
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
                      selectPolygonVersion?.polygonUuid ?? "",
                      selectPolygonVersion?.name ? formatStringName(selectPolygonVersion.name) : "polygon"
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
            optionsClassName="!max-h-[182px] lg:!max-h-[195px] wide:max-h-[266px]"
            placeholder="Select Polygon Version"
            options={polygonVersionData ?? []}
            optionVariant="text-12-light"
            titleClassname="one-line-text !w-full !text-nowrap"
            titleContainerClassName="!w-[calc(100%-25px)] !text-nowrap"
            value={[selectPolygonVersion?.uuid ?? selectedPolygon?.uuid] as string[]}
            onChange={e => {
              const polygonVersionSelected = versionsData?.find(item => item.uuid === e[0]);
              setSelectPolygonVersion(polygonVersionSelected);
            }}
          />
          <div className="mt-auto flex items-center justify-end gap-5">
            <Button
              onClick={onDeleteVersion}
              variant="semi-red"
              className="w-full"
              disabled={isLoadingDelete || isActiveVersion}
              title={
                isActiveVersion
                  ? t("Cannot delete the active version. Please activate another version first.")
                  : undefined
              }
            >
              {t("Delete")}
            </Button>
            <Button onClick={makeActivePolygon} variant="semi-black" className="w-full" disabled={isUpdating}>
              {t("Make Active")}
            </Button>
          </div>
        </>
      ) : (
        <div className="flex items-center justify-center p-4">
          <Text variant="text-14-light">
            {t("No versions found. Primary UUID: {uuid}", { uuid: primaryUuid || "N/A" })}
          </Text>
        </div>
      )}
    </div>
  );
};

export default VersionHistory;
