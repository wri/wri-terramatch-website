import { useT } from "@transifex/react";
import { useEffect, useState } from "react";

import Button from "@/components/elements/Button/Button";
import Dropdown from "@/components/elements/Inputs/Dropdown/Dropdown";
import useAlertHook from "@/components/elements/MapPolygonPanel/hooks/useAlertHook";
import Icon, { IconNames } from "@/components/extensive/Icon/Icon";
import ModalConfirm from "@/components/extensive/Modal/ModalConfirm";
import { useModalContext } from "@/context/modal.provider";
import {
  fetchGetV2SitePolygonUuidVersions,
  fetchPostV2SitePolygonUuidNewVersion,
  useDeleteV2TerrafundPolygonUuid,
  useGetV2SitePolygonUuidVersions,
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
  setStatusSelectedPolygon
}: {
  selectedPolygon: SitePolygon;
  setSelectPolygonVersion: any;
  selectPolygonVersion: SitePolygon | undefined;
  refreshPolygonList?: () => void;
  refreshSiteData?: () => void;
  setSelectedPolygonData?: any;
  setStatusSelectedPolygon?: any;
}) => {
  const t = useT();
  const { displayNotification } = useAlertHook();
  const { openModal, closeModal } = useModalContext();
  const [isLoadingDropdown, setIsLoadingDropdown] = useState(false);
  const {
    data,
    refetch,
    isLoading: isLoadingVersions
  } = useGetV2SitePolygonUuidVersions(
    {
      pathParams: { uuid: selectPolygonVersion?.primary_uuid as string }
    },
    {
      enabled: !!selectPolygonVersion?.primary_uuid
    }
  );

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
      displayNotification("Polygon version deleted successfully", "success", "Success!");
      await refetch();
      await refreshPolygonList?.();
      await refreshSiteData?.();
      const response = (await fetchGetV2SitePolygonUuidVersions({
        pathParams: { uuid: selectedPolygon.primary_uuid as string }
      })) as SitePolygonsDataResponse;
      setSelectedPolygonData(response?.find(item => item.is_active == 1));
      setSelectPolygonVersion(response?.find(item => item.is_active == 1));
      setStatusSelectedPolygon(response?.find(item => item.is_active == 1)?.status ?? "");
      setIsLoadingDropdown(false);
    },
    onError: () => {
      displayNotification("Error deleting polygon version", "error", "Error!");
    }
  });
  const createNewVersion = async () => {
    try {
      const newVersion = await fetchPostV2SitePolygonUuidNewVersion({
        pathParams: { uuid: selectedPolygon.uuid as string }
      });
      setSelectPolygonVersion(newVersion);
      displayNotification("New version created successfully", "success", "Success!");
      refetch();
      refreshSiteData?.();
    } catch (error) {
      displayNotification("Error creating new version", "error", "Error!");
    }
  };

  const polygonVersionData = (data as SitePolygonsDataResponse)?.map(item => {
    return {
      title: item.version_name as string,
      value: item.uuid as string
    };
  });

  const makeActivePolygon = async () => {
    const polygonSelectedUuid = selectPolygonVersion?.uuid ?? selectedPolygon.uuid;
    const versionActive = (data as SitePolygonsDataResponse)?.find(item => item?.uuid == polygonSelectedUuid);
    if (versionActive?.is_active != 1) {
      await mutateMakeActive({
        pathParams: { uuid: polygonSelectedUuid as string }
      });
      await refetch();
      await refreshPolygonList?.();
      await refreshSiteData?.();
      setSelectedPolygonData(selectPolygonVersion);
      return;
    }
    displayNotification("Polygon version is already active", "warning", "Warning!");
  };

  const deletePolygonVersion = async () => {
    await mutateDeletePolygonVersion({
      pathParams: { uuid: selectPolygonVersion?.poly_id as string }
    });
  };

  const onDeleteVersion = () => {
    openModal(
      <ModalConfirm
        title={t("Confirmation")}
        content={t("Do you want to delete this version?")}
        onClose={closeModal}
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
            defaultValue={[selectPolygonVersion?.uuid] as string[]}
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
