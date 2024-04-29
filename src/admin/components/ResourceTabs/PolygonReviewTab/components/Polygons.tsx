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
import ModalAdd from "@/components/extensive/Modal/ModalAdd";
import ModalConfirm from "@/components/extensive/Modal/ModalConfirm";
import ModalWithLogo from "@/components/extensive/Modal/ModalWithLogo";
import ModalWithMap from "@/components/extensive/Modal/ModalWithMap";
import { useModalContext } from "@/context/modal.provider";
import { fetchGetV2TerrafundGeojsonComplete, fetchGetV2TerrafundPolygonBboxUuid } from "@/generated/apiComponents";

import PolygonDrawer from "./PolygonDrawer/PolygonDrawer";

export interface IPolygonItem {
  id: string;
  status: "Draft" | "Submitted" | "Approved" | "Needs More Info";
  label: string;
  uuid: string;
}
export interface IPolygonProps {
  menu: IPolygonItem[];
}
const statusColor = {
  Draft: "bg-purple",
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
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { openModal, closeModal } = useModalContext();
  const [selectedPolygon, setSelectedPolygon] = useState<IPolygonItem>();

  useEffect(() => {
    if (!isOpen) {
      setSelectedPolygon(undefined);
    }
  }, [isOpen]);

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

  const openFormModalHandlerAddPolygon = () => {
    openModal(
      <ModalAdd
        title="Add Polygons"
        descriptionInput="Drag and drop a GeoJSON, Shapefile, or KML for your site Tannous/Brayton Road."
        descriptionList={
          <div className="mt-9 flex">
            <Text variant="text-12-bold">TerraMatch upload limits:&nbsp;</Text>
            <Text variant="text-12-light">50 MB per upload</Text>
          </div>
        }
        onCLose={closeModal}
        content="Start by adding polygons to your site."
        primaryButtonText="Close"
        primaryButtonProps={{ className: "px-8 py-3", variant: "primary", onClick: closeModal }}
      >
        {/* Next div is only Mocked data delete this children later*/}
        <div className="mb-6 flex flex-col gap-4">
          {polygonData.map(polygon => (
            <div
              key={polygon.id}
              className="border-grey-75 flex items-center justify-between rounded-lg border border-grey-750 py-[10px] pr-6 pl-4"
            >
              <div className="flex gap-3">
                <div className="rounded-lg bg-neutral-150 p-2">
                  <Icon name={IconNames.POLYGON} className="h-6 w-6 text-grey-720" />
                </div>
                <div>
                  <Text variant="text-12">{polygon.name}</Text>
                  <Text variant="text-12" className="opacity-50">
                    {polygon.status}
                  </Text>
                </div>
              </div>
              <Icon
                name={polygon.isUploaded ? IconNames.CHECK_POLYGON : IconNames.ELLIPSE_POLYGON}
                className="h-6 w-6"
              />
            </div>
          ))}
        </div>
      </ModalAdd>
    );
  };

  const openFormModalHandlerConfirm = () => {
    openModal(
      <ModalConfirm
        title={"Confirm Polygon Deletion"}
        content="Do you want to delete this polygon?"
        onClose={closeModal}
        onConfirm={() => {}}
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

  const openFormModalHandlerRequestPolygonSupport = () => {
    openModal(
      <ModalWithMap
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
        return setIsOpen(true);
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
      onClick: openFormModalHandlerRequestPolygonSupport
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
      onClick: openFormModalHandlerConfirm
    }
  ];

  return (
    <div>
      <Drawer isOpen={isOpen} setIsOpen={setIsOpen}>
        <PolygonDrawer polygonSelected={selectedPolygon?.uuid || ""} />
      </Drawer>
      <div className="mb-4 flex items-center gap-1">
        <Text variant="text-16-bold" className="pl-2 text-grey-300">
          Polygons
        </Text>
        <Button variant="text" onClick={openFormModalHandlerAddPolygon}>
          <Icon name={IconNames.PLUS_CIRCLE} className="h-4 w-4" />
        </Button>
      </div>
      <div ref={containerRef} className="flex max-h-full flex-col overflow-auto">
        {props.menu.map(item => {
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
