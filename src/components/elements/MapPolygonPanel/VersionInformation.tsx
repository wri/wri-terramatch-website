import { useT } from "@transifex/react";
import classNames from "classnames";
import { format } from "date-fns";
import { useEffect } from "react";

import Icon, { IconNames } from "@/components/extensive/Icon/Icon";
import ModalConfirm from "@/components/extensive/Modal/ModalConfirm";
import { ModalId } from "@/components/extensive/Modal/ModalConst";
import { useMapAreaContext } from "@/context/mapArea.provider";
import { useModalContext } from "@/context/modal.provider";
import {
  fetchGetV2SitePolygonUuid,
  fetchGetV2SitePolygonUuidVersions,
  fetchPostV2SitePolygonUuidNewVersion,
  useDeleteV2TerrafundPolygonUuid,
  usePutV2SitePolygonUuidMakeActive
} from "@/generated/apiComponents";
import { SitePolygon, SitePolygonsDataResponse } from "@/generated/apiSchemas";

import Menu from "../Menu/Menu";
import { MENU_PLACEMENT_RIGHT_BOTTOM } from "../Menu/MenuVariant";
import Text from "../Text/Text";
import useAlertHook from "./hooks/useAlertHook";

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
  const { displayNotification } = useAlertHook();
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
      displayNotification(t("Polygon version deleted successfully"), "success", t("Success!"));
    },
    onError: () => {
      displayNotification(t("Error deleting polygon version"), "error", t("Error!"));
    }
  });

  const { mutate: mutateMakeActive } = usePutV2SitePolygonUuidMakeActive({
    onSuccess: async () => {
      displayNotification(t("Polygon version made active successfully"), "success", t("Success!"));
      await refetchPolygonVersions?.();
      setPreviewVersion(false);
      setOpenModalConfirmation(false);
      setSelectedPolyVersion({});
    },
    onError: () => {
      displayNotification(t("Error making polygon version active"), "error", t("Error!"));
    }
  });

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
    try {
      await fetchPostV2SitePolygonUuidNewVersion({
        pathParams: { uuid: editPolygon.primary_uuid as string }
      });
      refetchPolygonVersions?.();
      recallEntityData?.();
      displayNotification(t("New version created successfully"), "success", t("Success!"));
    } catch (error) {
      displayNotification(t("Error creating new version"), "error", t("Error!"));
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
    displayNotification("Polygon version is already active", "warning", "Warning!");
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
            {item.poly_name}
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
      <button className="mt-auto text-white hover:text-primary-300" onClick={createNewVersion}>
        <Text variant="text-14-bold" className="flex items-center uppercase ">
          <Icon name={IconNames.PLUS_PA} className="h-4 w-6" />
          &nbsp; {t("Add Polygon")}
        </Text>
      </button>
    </div>
  );
};

export default VersionInformation;
