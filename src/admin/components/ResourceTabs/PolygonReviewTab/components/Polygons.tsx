import React, { useEffect, useRef, useState } from "react";

import Button from "@/components/elements/Button/Button";
import Drawer from "@/components/elements/Drawer/Drawer";
import { formatFileName } from "@/components/elements/Map-mapbox/utils";
import Menu from "@/components/elements/Menu/Menu";
import { MENU_PLACEMENT_LEFT_BOTTOM } from "@/components/elements/Menu/MenuVariant";
import { MENU_ITEM_VARIANT_DIVIDER } from "@/components/elements/MenuItem/MenuItemVariant";
import Notification from "@/components/elements/Notification/Notification";
import Text from "@/components/elements/Text/Text";
import Icon from "@/components/extensive/Icon/Icon";
import { IconNames } from "@/components/extensive/Icon/Icon";
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

import PolygonDrawer from "./PolygonDrawer/PolygonDrawer";
import PolygonItem from "./PolygonItem";

export interface IPolygonItem {
  id: string;
  status: "draft" | "submitted" | "approved" | "needs-more-information";
  label: string;
  uuid: string;
}

export interface IpolygonFromMap {
  isOpen: boolean;
  uuid: string;
}
export interface IPolygonProps {
  menu: IPolygonItem[];
  polygonFromMap?: IpolygonFromMap;
  setPolygonFromMap?: any;
  refresh?: () => void;
  mapFunctions: any;
}

export const polygonData = [
  { id: "1", name: "Site-polygon001.geojson", status: "We are processing your polygon", isUploaded: false },
  { id: "2", name: "Site-polygon002.geojson", status: "We are processing your polygon", isUploaded: false },
  { id: "3", name: "Site-polygon003.geojson", status: "We are processing your polygon", isUploaded: true },
  { id: "4", name: "Site-polygon004.geojson", status: "We are processing your polygon", isUploaded: true },
  { id: "5", name: "Site-polygon005.geojson", status: "We are processing your polygon", isUploaded: true }
];

const Polygons = (props: IPolygonProps) => {
  const [isOpenPolygonDrawer, setIsOpenPolygonDrawer] = useState(false);
  const [polygonMenu, setPolygonMenu] = useState<IPolygonItem[]>(props.menu);
  const { polygonFromMap, setPolygonFromMap, mapFunctions } = props;
  const { map } = mapFunctions;
  const containerRef = useRef<HTMLDivElement>(null);
  const { openModal, closeModal } = useModalContext();
  const [selectedPolygon, setSelectedPolygon] = useState<IPolygonItem>();
  const [isPolygonStatusOpen, setIsPolygonStatusOpen] = useState(false);
  const context = useSitePolygonData();
  const contextMapArea = useMapAreaContext();
  const reloadSiteData = context?.reloadSiteData;
  const { setIsUserDrawingEnabled, polygonNotificationStatus } = contextMapArea;
  const [openCollapseAll, setOpenCollapseAll] = useState(false);

  useEffect(() => {
    setPolygonMenu(props.menu);
  }, [props.menu]);

  useEffect(() => {
    if (polygonFromMap?.isOpen) {
      const newSelectedPolygon = polygonMenu.find(polygon => polygon.uuid === polygonFromMap.uuid);
      setSelectedPolygon(newSelectedPolygon);
      setIsOpenPolygonDrawer(true);
    } else {
      setIsOpenPolygonDrawer(false);
      setSelectedPolygon(undefined);
    }
  }, [polygonFromMap, polygonMenu]);

  const downloadGeoJsonPolygon = async (polygon: IPolygonItem) => {
    const polygonGeojson = await fetchGetV2TerrafundGeojsonComplete({
      queryParams: { uuid: polygon.uuid }
    });
    const blob = new Blob([JSON.stringify(polygonGeojson)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${formatFileName(polygon?.label === "Unnamed Polygon" ? "polygon" : polygon?.label)}.geojson`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const flyToPolygonBounds = async (polygon: IPolygonItem) => {
    const bbox = await fetchGetV2TerrafundPolygonBboxUuid({ pathParams: { uuid: polygon.uuid } });
    const bounds: any = bbox.bbox;
    if (!map.current) {
      return;
    }
    map.current.fitBounds(bounds, {
      padding: 100,
      linear: false
    });
  };

  const deletePolygon = async (polygon: IPolygonItem) => {
    const response: any = await fetchDeleteV2TerrafundPolygonUuid({ pathParams: { uuid: polygon.uuid } });
    if (response?.uuid) {
      reloadSiteData?.();
      closeModal(ModalId.CONFIRM_POLYGON_DELETION);
    }
  };

  const openFormModalHandlerConfirm = (item: any) => {
    openModal(
      ModalId.CONFIRM_POLYGON_DELETION,
      <ModalConfirm
        title={"Confirm Polygon Deletion"}
        content="Do you want to delete this polygon?"
        onClose={() => closeModal(ModalId.CONFIRM_POLYGON_DELETION)}
        onConfirm={() => {
          deletePolygon(item);
        }}
      />
    );
  };

  const polygonMenuItems = (item: any) => [
    {
      id: "1",
      render: () => (
        <div className="flex w-full items-center gap-2">
          <Icon name={IconNames.POLYGON} className="h-6 w-6" />
          <Text variant="text-12-bold">Edit Polygon</Text>
        </div>
      ),
      onClick: () => {
        setSelectedPolygon(item);
        flyToPolygonBounds(item);
        setPolygonFromMap({ isOpen: true, uuid: item.uuid });
        setIsOpenPolygonDrawer(true);
        setIsPolygonStatusOpen(false);
      }
    },
    {
      id: "2",
      render: () => (
        <div className="flex items-center gap-2">
          <Icon name={IconNames.SEARCH_PA} className="h-6 w-6" />
          <Text variant="text-12-bold">Zoom to</Text>
        </div>
      ),
      onClick: () => {
        flyToPolygonBounds(item);
      }
    },
    {
      id: "3",
      render: () => (
        <div className="flex items-center gap-2">
          <Icon name={IconNames.DOWNLOAD_PA} className="h-6 w-6" />
          <Text variant="text-12-bold">Download</Text>
        </div>
      ),
      onClick: () => {
        downloadGeoJsonPolygon(item);
      }
    },
    {
      id: "5",
      render: () => <div className="h-[1px] w-full bg-grey-750" />,
      MenuItemVariant: MENU_ITEM_VARIANT_DIVIDER
    },
    {
      id: "6",
      render: () => (
        <div className="flex items-center gap-2">
          <Icon name={IconNames.TRASH_PA} className="h-5 w-5" />
          <Text variant="text-12-bold">Delete Polygon</Text>
        </div>
      ),
      onClick: () => {
        openFormModalHandlerConfirm(item);
      }
    }
  ];

  return (
    <div>
      <Notification {...polygonNotificationStatus} />
      <Drawer isOpen={isOpenPolygonDrawer} setIsOpen={setIsOpenPolygonDrawer} setPolygonFromMap={setPolygonFromMap}>
        <PolygonDrawer
          polygonSelected={selectedPolygon?.uuid ?? ""}
          isPolygonStatusOpen={isPolygonStatusOpen}
          refresh={props?.refresh}
          isOpenPolygonDrawer={isOpenPolygonDrawer}
          setPolygonFromMap={setPolygonFromMap}
        />
      </Drawer>
      <div className="mb-4 flex flex-col gap-1">
        <Text variant="text-16-bold" className="text-darkCustom">
          Polygons
        </Text>
        <div className="flex items-center justify-between">
          <Button variant="text" onClick={() => setIsUserDrawingEnabled?.(true)}>
            <Text variant="text-14-semibold" className="flex items-center gap-1">
              Add Polygon <Icon name={IconNames.PLUS_CIRCLE} className="h-4 w-4" />
            </Text>
          </Button>
          <Button variant="white-border" onClick={() => setOpenCollapseAll(!openCollapseAll)} className="mb-2">
            {openCollapseAll ? "SHIRNK" : "EXPAND"}
          </Button>
        </div>
      </div>
      <div ref={containerRef} className="flex max-h-[150vh] flex-col gap-2 overflow-auto">
        {polygonMenu.map(item => (
          <div key={item.id}>
            <PolygonItem
              uuid={item.uuid}
              title={item.label}
              status={item.status}
              menu={
                <Menu
                  className="ml-auto"
                  container={containerRef.current}
                  menu={polygonMenuItems(item)}
                  placement={MENU_PLACEMENT_LEFT_BOTTOM}
                >
                  <Icon name={IconNames.ELIPSES} className="h-4 w-4" />
                </Menu>
              }
              isCollapsed={openCollapseAll}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Polygons;
