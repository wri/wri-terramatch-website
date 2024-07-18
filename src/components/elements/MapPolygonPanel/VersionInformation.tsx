import { useT } from "@transifex/react";
import classNames from "classnames";
import { format } from "date-fns";
import { useEffect } from "react";

import Icon, { IconNames } from "@/components/extensive/Icon/Icon";
import ModalConfirm from "@/components/extensive/Modal/ModalConfirm";
import { useMapAreaContext } from "@/context/mapArea.provider";
import { useModalContext } from "@/context/modal.provider";
import {
  fetchGetV2SitePolygonUuid,
  fetchPostV2SitePolygonUuidNewVersion,
  useDeleteV2TerrafundPolygonUuid
} from "@/generated/apiComponents";
import { SitePolygon } from "@/generated/apiSchemas";

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
  const { editPolygon, setSelectedPolyVersion, setOpenModalConfirmation, setPreviewVersion, selectedPolyVersion } =
    useMapAreaContext();
  const t = useT();
  const { mutate: mutateDeletePolygonVersion } = useDeleteV2TerrafundPolygonUuid({
    onSuccess: async () => {
      refetchPolygonVersions?.();
      recallEntityData?.();
      displayNotification("Polygon version deleted successfully", "success", "Success!");
    },
    onError: () => {
      displayNotification("Error deleting polygon version", "error", "Error!");
    }
  });

  const openFormModalHandlerConfirm = (polyId: string) => {
    openModal(
      <ModalConfirm
        title={t("Confirmation")}
        content={t("Do you want to delete this version?")}
        onClose={closeModal}
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
      displayNotification("New version created successfully", "success", "Success!");
    } catch (error) {
      displayNotification("Error creating new version", "error", "Error!");
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
        const response = await fetchGetV2SitePolygonUuid({
          pathParams: { uuid: versionUuid as string }
        });
        setSelectedPolyVersion(response as SitePolygon);
        setPreviewVersion?.(true);
        setOpenModalConfirmation(true);
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

  return (
    <div className="grid">
      <div className="grid grid-flow-col grid-cols-4 border-b-2 border-t border-[#ffffff1a] py-2 opacity-60">
        <Text variant="text-10-light" className="col-span-2 text-white">
          {t("Version")}
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
          <Text variant="text-10" className="col-span-2 text-white">
            {item.version_name}
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
            >
              {item.is_active == 1 ? "Yes" : "No"}
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
      <button className="pt-40 text-white hover:text-primary-300" onClick={createNewVersion}>
        <Text variant="text-14-bold" className="flex items-center uppercase ">
          <Icon name={IconNames.PLUS_PA} className="h-4 w-6" />
          &nbsp; {t("Add Polygon")}
        </Text>
      </button>
    </div>
  );
};

export default VersionInformation;
