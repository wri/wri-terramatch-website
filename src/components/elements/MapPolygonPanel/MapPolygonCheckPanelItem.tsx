import { useT } from "@transifex/react";
import classNames from "classnames";
import { DetailedHTMLProps, HTMLAttributes, useState } from "react";
import { When } from "react-if";

import Text from "@/components/elements/Text/Text";
import Icon, { IconNames } from "@/components/extensive/Icon/Icon";
import ModalConfirm from "@/components/extensive/Modal/ModalConfirm";
import { ModalId } from "@/components/extensive/Modal/ModalConst";
import { useMapAreaContext } from "@/context/mapArea.provider";
import { useModalContext } from "@/context/modal.provider";
import { useSitePolygonData } from "@/context/sitePolygon.provider";
import {
  fetchDeleteV2TerrafundPolygonUuid,
  fetchGetV2TerrafundGeojsonComplete,
  fetchGetV2TerrafundPolygonBboxUuid
} from "@/generated/apiComponents";

import Button from "../Button/Button";
import { formatFileName } from "../Map-mapbox/utils";
import Menu from "../Menu/Menu";
import { MENU_PLACEMENT_RIGHT_BOTTOM } from "../Menu/MenuVariant";

export interface MapPolygonCheckPanelItemProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  uuid: string;
  title: string;
  isSelected?: boolean;
  refContainer?: React.RefObject<HTMLDivElement> | null;
  valid: boolean;
  polygonValidation?: string[];
  mapFunctions: any;
}

const MapPolygonCheckPanelItem = ({
  uuid,
  title,
  isSelected,
  className,
  refContainer,
  polygonValidation,
  valid,
  mapFunctions,
  ...props
}: MapPolygonCheckPanelItemProps) => {
  const { openModal, closeModal } = useModalContext();
  const { setEditPolygon } = useMapAreaContext();
  const contextSite = useSitePolygonData();
  const reloadSiteData = contextSite?.reloadSiteData;
  const siteData = contextSite?.sitePolygonData;
  const [openCollapse, setOpenCollapse] = useState(true);
  const t = useT();

  const { map } = mapFunctions;

  const flyToPolygonBounds = async (polygonUuid: string) => {
    const bbox = await fetchGetV2TerrafundPolygonBboxUuid({ pathParams: { uuid: polygonUuid } });
    const bounds: any = bbox.bbox;
    if (!map.current) {
      return;
    }
    map.current.fitBounds(bounds, {
      padding: 100,
      linear: false
    });
  };

  const downloadGeoJsonPolygon = async (polygonUuid: string) => {
    const polygonGeojson = await fetchGetV2TerrafundGeojsonComplete({
      queryParams: { uuid: polygonUuid }
    });
    const blob = new Blob([JSON.stringify(polygonGeojson)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    const polygonName = siteData?.find(polygon => polygon.poly_id === uuid)?.poly_name ?? "polygon";
    link.download = `${formatFileName(polygonName)}.geojson`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const deletePolygon = async (polygonUuid: string) => {
    await fetchDeleteV2TerrafundPolygonUuid({ pathParams: { uuid: polygonUuid } });
    reloadSiteData?.();
  };

  const openFormModalHandlerConfirm = () => {
    openModal(
      ModalId.CONFIRM_POLYGON_DELETION,
      <ModalConfirm
        title={t("Confirm Polygon Deletion")}
        content={t("Do you want to delete this polygon?")}
        onClose={() => closeModal(ModalId.CONFIRM_POLYGON_DELETION)}
        onConfirm={() => deletePolygon(uuid)}
      />
    );
  };

  const itemsPrimaryMenu = (uuid: string) => [
    {
      id: "1",
      render: () => (
        <Text variant="text-14-semibold" className="flex items-center">
          <Icon name={IconNames.IC_SITE_VIEW} className="h-4 w-4 lg:h-5 lg:w-5" />
          &nbsp; {t("Edit Polygon")}
        </Text>
      ),
      onClick: () => setEditPolygon?.({ isOpen: true, uuid })
    },
    {
      id: "2",
      render: () => (
        <Text variant="text-14-semibold" className="flex items-center">
          <Icon name={IconNames.SEARCH} className="h-4 w-4 lg:h-5 lg:w-5" />
          &nbsp; {t("Zoom to")}
        </Text>
      ),
      onClick: () => flyToPolygonBounds(uuid)
    },
    {
      id: "3",
      render: () => (
        <Text variant="text-14-semibold" className="flex items-center">
          <Icon name={IconNames.DOWNLOAD_PA} className="h-4 w-4 lg:h-5 lg:w-5" />
          &nbsp; {t("Download")}
        </Text>
      ),
      onClick: () => downloadGeoJsonPolygon(uuid)
    },
    {
      id: "6",
      render: () => (
        <Button variant="text" onClick={openFormModalHandlerConfirm}>
          <Text variant="text-14-semibold" className="flex items-center ">
            <Icon name={IconNames.TRASH_PA} className="h-4 w-4 lg:h-5 lg:w-5" />
            &nbsp; {t("Delete Polygon")}
          </Text>
        </Button>
      )
    }
  ];

  return (
    <div>
      <div {...props} className={className}>
        <div className="flex items-center gap-2">
          <Icon name={valid ? IconNames.ROUND_GREEN_TICK : IconNames.ROUND_RED_CROSS} className="h-4 w-4" />
          <div className="flex flex-1 flex-col">
            <Text variant="text-14-light" className="text-white">
              {t(title)}
            </Text>
          </div>
          <div className="flex h-full items-start self-start">
            <When condition={!!polygonValidation}>
              <button
                onClick={() => {
                  setOpenCollapse(!openCollapse);
                }}
              >
                <Icon
                  name={IconNames.CHEVRON_DOWN}
                  className={classNames(
                    "h-3 w-3 rounded-lg text-white hover:fill-primary hover:text-primary lg:h-4 lg:w-4",
                    { "rotate-180 transform": !!openCollapse }
                  )}
                />
              </button>
            </When>

            <Menu
              container={refContainer?.current}
              placement={MENU_PLACEMENT_RIGHT_BOTTOM}
              menu={itemsPrimaryMenu(uuid)}
            >
              <Icon
                name={IconNames.IC_MORE_OUTLINED}
                className="h-4 w-4 rounded-lg text-white hover:fill-primary hover:text-primary lg:h-5 lg:w-5"
              />
            </Menu>
          </div>
        </div>
        <When condition={!!polygonValidation && !!openCollapse}>
          <div className="my-3 grid gap-3 px-4">
            {polygonValidation?.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <Icon name={IconNames.ERROR_WHITE_BORDER_RED} className="h-4 w-4 rounded-lg text-white lg:h-5 lg:w-5" />
                <Text variant="text-14-light" className="text-white">
                  {t(item)}
                </Text>
              </div>
            ))}
          </div>
        </When>
      </div>
    </div>
  );
};

export default MapPolygonCheckPanelItem;
