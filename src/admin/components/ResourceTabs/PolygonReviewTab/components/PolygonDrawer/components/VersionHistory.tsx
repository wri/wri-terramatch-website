import { useT } from "@transifex/react";
import { Dispatch, SetStateAction, useEffect } from "react";

import Button from "@/components/elements/Button/Button";
import Dropdown from "@/components/elements/Inputs/Dropdown/Dropdown";
import useAlertHook from "@/components/elements/MapPolygonPanel/hooks/useAlertHook";
import Icon, { IconNames } from "@/components/extensive/Icon/Icon";
import ModalConfirm from "@/components/extensive/Modal/ModalConfirm";
import { ModalId } from "@/components/extensive/Modal/ModalConst";
import { useModalContext } from "@/context/modal.provider";
import {
  fetchGetV2SitePolygonUuidVersions,
  fetchPostV2SitePolygonUuidNewVersion,
  GetV2SitePolygonUuidVersionsResponse,
  useDeleteV2TerrafundPolygonUuid,
  usePutV2SitePolygonUuidMakeActive
} from "@/generated/apiComponents";
import { SitePolygon, SitePolygonsDataResponse } from "@/generated/apiSchemas";

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
  setIsLoadingDropdown
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
}) => {
  const t = useT();
  const { displayNotification } = useAlertHook();
  const { openModal, closeModal } = useModalContext();

  useEffect(() => {
    refetch();
  }, [selectPolygonVersion]);

  const { mutate: mutateMakeActive, isLoading } = usePutV2SitePolygonUuidMakeActive({
    onSuccess: () => {
      displayNotification("Polygon version made active successfully", "success", "Success!");
    },
    onError: () => {
      displayNotification("Error making polygon version active", "error", "Error!");
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
      displayNotification("Polygon version deleted successfully", "success", "Success!");
      setIsLoadingDropdown(false);
    },
    onError: () => {
      displayNotification("Error deleting polygon version", "error", "Error!");
    }
  });
  const createNewVersion = async () => {
    try {
      await fetchPostV2SitePolygonUuidNewVersion({
        pathParams: { uuid: (selectedPolygon.uuid ?? selectPolygonVersion?.uuid) as string }
      });
      refetch();
      refreshSiteData?.();
      displayNotification("New version created successfully", "success", "Success!");
    } catch (error) {
      displayNotification("Error creating new version", "error", "Error!");
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
      return;
    }
    displayNotification("Polygon version is already active", "warning", "Warning!");
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

  return (
    <div className="flex flex-col gap-4">
      {!isLoadingVersions && !isLoadingDropdown && (
        <>
          <Dropdown
            label="Polygon Version"
            suffixLabel={
              <button
                onClick={createNewVersion}
                className="flex items-center justify-center rounded border-2 border-grey-500 bg-grey-500 text-white hover:border-primary hover:bg-white hover:text-primary"
              >
                <Icon name={IconNames.PLUS_PA} className=" h-3 w-3 lg:h-3.5 lg:w-3.5" />
              </button>
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
