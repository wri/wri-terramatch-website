import { useT } from "@transifex/react";
import { useEffect } from "react";

import Button from "@/components/elements/Button/Button";
import Dropdown from "@/components/elements/Inputs/Dropdown/Dropdown";
import useAlertHook from "@/components/elements/MapPolygonPanel/hooks/useAlertHook";
import Icon, { IconNames } from "@/components/extensive/Icon/Icon";
import Modal from "@/components/extensive/Modal/Modal";
import { useModalContext } from "@/context/modal.provider";
import { useSitePolygonData } from "@/context/sitePolygon.provider";
import {
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
  refreshPolygonList
}: {
  selectedPolygon: SitePolygon;
  setSelectPolygonVersion: any;
  selectPolygonVersion: SitePolygon | undefined;
  refreshPolygonList?: () => void;
}) => {
  const t = useT();
  const { displayNotification } = useAlertHook();
  const { openModal, closeModal } = useModalContext();
  const contextSite = useSitePolygonData();
  const reloadSiteData = contextSite?.reloadSiteData;
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
      refreshPolygonList?.();
      displayNotification("Polygon version made active successfully", "success", "Success!");
    },
    onError: () => {
      displayNotification("Error making polygon version active", "error", "Error!");
    }
  });

  const { mutate: mutateDeletePolygonVersion, isPaused: isLoadingDelete } = useDeleteV2TerrafundPolygonUuid({
    onSuccess: () => {
      displayNotification("Polygon version deleted successfully", "success", "Success!");
      refetch();
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
      reloadSiteData?.();
    } catch (error) {
      displayNotification("Error creating new version", "error", "Error!");
    }
  };

  const makeActivePolygon = async () => {
    if (selectedPolygon?.uuid !== selectPolygonVersion?.uuid && !!selectPolygonVersion) {
      await mutateMakeActive({
        pathParams: { uuid: (selectPolygonVersion?.uuid as string) ?? selectedPolygon.uuid }
      });
      setSelectPolygonVersion(selectedPolygon);
      return;
    }
    displayNotification("Polygon version is already active", "warning", "Warning!");
  };

  const deletePolygonVersion = async () => {
    await mutateDeletePolygonVersion({
      pathParams: { uuid: selectPolygonVersion?.poly_id as string }
    });
  };

  const onDeleteProject = () => {
    openModal(
      <Modal
        title={t("Confirmation")}
        content={t("Do you want to delete this version? ")}
        primaryButtonProps={{
          children: t("Confirm"),
          onClick: () => {
            deletePolygonVersion();
            closeModal();
          }
        }}
        secondaryButtonProps={{
          children: t("Cancel"),
          onClick: closeModal
        }}
      />
    );
  };

  const polygonVersionData = (data as SitePolygonsDataResponse)?.map(item => {
    return {
      title: item.version_name as string,
      value: item.uuid as string
    };
  });

  return (
    <div className="flex flex-col gap-4">
      {!isLoadingVersions && selectPolygonVersion && (
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
            <Button onClick={onDeleteProject} variant="semi-red" className="w-full" disabled={isLoadingDelete}>
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
