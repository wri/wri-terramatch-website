import React, { useEffect, useRef, useState } from "react";

import Button from "@/components/elements/Button/Button";
import Drawer from "@/components/elements/Drawer/Drawer";
import _MapService from "@/components/elements/Map-mapbox/MapService";
import Menu from "@/components/elements/Menu/Menu";
import { MENU_PLACEMENT_LEFT_BOTTOM } from "@/components/elements/Menu/MenuVariant";
import { MENU_ITEM_VARIANT_DIVIDER } from "@/components/elements/MenuItem/MenuItemVariant";
import Text from "@/components/elements/Text/Text";
import Icon from "@/components/extensive/Icon/Icon";
import { IconNames } from "@/components/extensive/Icon/Icon";
import ModalConfirm from "@/components/extensive/Modal/ModalConfirm";
import ModalWithLogo from "@/components/extensive/Modal/ModalWithLogo";
import ModalWithMap from "@/components/extensive/Modal/ModalWithMap";
import { useModalContext } from "@/context/modal.provider";
import { useSitePolygonData } from "@/context/sitePolygon.provider";
import {
  fetchDeleteV2TerrafundPolygonUuid,
  fetchGetV2TerrafundGeojsonComplete,
  fetchGetV2TerrafundPolygonBboxUuid
} from "@/generated/apiComponents";

import PolygonDrawer from "./PolygonDrawer/PolygonDrawer";

export interface IPolygonItem {
  id: string;
  status: "Draft" | "Submitted" | "Approved" | "Needs More Info";
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
}
const statusColor = {
  Draft: "bg-pinkCustom",
  Submitted: "bg-blue",
  Approved: "bg-green",
  "Needs More Info": "bg-tertiary-600"
};

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
  const { polygonFromMap, setPolygonFromMap } = props;
  const containerRef = useRef<HTMLDivElement>(null);
  const { openModal, closeModal } = useModalContext();
  const [selectedPolygon, setSelectedPolygon] = useState<IPolygonItem>();
  const context = useSitePolygonData();
  const reloadSiteData = context?.reloadSiteData;
  const { toggleUserDrawing } = context || {};

  useEffect(() => {
    console.log("props.menu", props.menu);
    setPolygonMenu(props.menu);
  }, [props.menu]);
  useEffect(() => {
    if (!isOpenPolygonDrawer) {
      setSelectedPolygon(undefined);
    }
  }, [isOpenPolygonDrawer]);

  useEffect(() => {
    if (polygonFromMap?.isOpen) {
      const newSelectedPolygon = polygonMenu.find(polygon => polygon.uuid === polygonFromMap.uuid);
      setSelectedPolygon(newSelectedPolygon);
      setIsOpenPolygonDrawer(true);
    } else {
      setIsOpenPolygonDrawer(false);
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
    link.download = `polygon.geojson`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const flyToPolygonBounds = async (polygon: IPolygonItem) => {
    const bbox = await fetchGetV2TerrafundPolygonBboxUuid({ pathParams: { uuid: polygon.uuid } });
    const bounds: any = bbox.bbox;
    _MapService.map?.fitBounds(bounds, {
      padding: 100,
      linear: false
    });
  };

  const deletePolygon = async (polygon: IPolygonItem) => {
    const response: any = await fetchDeleteV2TerrafundPolygonUuid({ pathParams: { uuid: polygon.uuid } });
    if (response && response?.uuid) {
      if (reloadSiteData) {
        reloadSiteData();
      }
      closeModal();
    }
  };

  const openFormModalHandlerConfirm = (item: any) => {
    openModal(
      <ModalConfirm
        title={"Confirm Polygon Deletion"}
        content="Do you want to delete this polygon?"
        onClose={closeModal}
        onConfirm={() => {
          deletePolygon(item);
        }}
      />
    );
  };

  const openFormModalHandlerAddCommentary = () => {
    openModal(
      <ModalWithLogo
        title="Blue Forest"
        onCLose={closeModal}
        status="Under Review"
        toogleButton
        content="Faja Lobi Project&nbsp;&nbsp;•&nbsp;&nbsp;Priceless Planet Coalition"
        primaryButtonText="Close"
        primaryButtonProps={{ className: "px-8 py-3", variant: "primary", onClick: closeModal }}
      />
    );
  };

  const openFormModalHandlerRequestPolygonSupport = (item: any) => {
    openModal(
      <ModalWithMap
        polygonSelected={item?.uuid || ""}
        title="Request Support"
        onCLose={closeModal}
        content="Faja Lobi Project&nbsp;&nbsp;•&nbsp;&nbsp;Priceless Planet Coalition"
        primaryButtonText="Submit"
        primaryButtonProps={{ className: "px-8 py-3", variant: "primary", onClick: closeModal }}
      ></ModalWithMap>
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
        setPolygonFromMap({ isOpen: true, uuid: item.uuid });
        setIsOpenPolygonDrawer(true);
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
      id: "4",
      render: () => (
        <div className="flex items-center gap-2">
          <Icon name={IconNames.COMMENT} className="h-6 w-6" />
          <Text variant="text-12-bold">Comment</Text>
        </div>
      ),
      onClick: openFormModalHandlerAddCommentary
    },
    {
      id: "5",
      render: () => (
        <div className="flex items-center gap-2">
          <Icon name={IconNames.REQUEST} className="h-6 w-6" />
          <Text variant="text-12-bold">Request Support</Text>
        </div>
      ),
      onClick: () => {
        openFormModalHandlerRequestPolygonSupport(item);
      }
    },
    {
      id: "6",
      render: () => <div className="h-[1px] w-full bg-grey-750" />,
      MenuItemVariant: MENU_ITEM_VARIANT_DIVIDER
    },
    {
      id: "7",
      render: () => (
        <div className="flex items-center gap-2">
          <Icon name={IconNames.TRASH_PA} className="h-6 w-6" />
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
      <Drawer isOpen={isOpenPolygonDrawer} setIsOpen={setIsOpenPolygonDrawer} setPolygonFromMap={setPolygonFromMap}>
        <PolygonDrawer polygonSelected={selectedPolygon?.uuid || ""} />
      </Drawer>
      <div className="mb-4 flex items-center gap-1">
        <Text variant="text-16-bold" className="pl-2 text-darkCustom">
          Polygons
        </Text>
        <Button variant="text" onClick={() => toggleUserDrawing?.(true)}>
          <Icon name={IconNames.PLUS_CIRCLE} className="h-4 w-4" />
        </Button>
      </div>
      <div ref={containerRef} className="flex max-h-full flex-col overflow-auto">
        {polygonMenu.map(item => {
          return (
            <div
              key={item.id}
              className="flex items-center justify-between rounded-lg px-2 py-2 hover:cursor-pointer hover:bg-primary-200"
            >
              <div className="flex items-center gap-2">
                <div className={`h-4 w-4 rounded-full ${statusColor[item.status]}`} />
                <Text variant="text-14-light">{item.label}</Text>
              </div>
              <Menu
                container={containerRef.current}
                menu={polygonMenuItems(item)}
                placement={MENU_PLACEMENT_LEFT_BOTTOM}
              >
                <Icon name={IconNames.ELIPSES} className="h-4 w-4" />
              </Menu>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Polygons;
