import React, { useRef, useState } from "react";

import Button from "@/components/elements/Button/Button";
import Comentary from "@/components/elements/Comentary/Comentary";
import ComentaryBox from "@/components/elements/ComentaryBox/ComentaryBox";
import DragAndDrop from "@/components/elements/DragAndDrop/DragAndDrop";
import Drawer from "@/components/elements/Drawer/Drawer";
import Menu from "@/components/elements/Menu/Menu";
import { MENU_PLACEMENT_LEFT_BOTTOM } from "@/components/elements/Menu/MenuVariant";
import StepProgressbar from "@/components/elements/ProgressBar/StepProgressbar/StepProgressbar";
import Text from "@/components/elements/Text/Text";
import Icon from "@/components/extensive/Icon/Icon";
import { IconNames } from "@/components/extensive/Icon/Icon";
import ModalConfirm from "@/components/extensive/Modal/ModalConfirm";
import { comentariesItems, polygonStatusLabels } from "@/components/extensive/Modal/ModalContent/MockedData";
import ModalWithLogo from "@/components/extensive/Modal/ModalWithLogo";
import { useModalContext } from "@/context/modal.provider";

import PolygonDrawer from "./PolygonDrawer/PolygonDrawer";

export interface IPolygonItem {
  id: string;
  status: "Draft" | "Submitted" | "Approved" | "Needs More Info";
  label: string;
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

  const openFormModalHandlerAddPolygon = () => {
    openModal(
      <ModalWithLogo
        title="Add Polygons"
        onCLose={closeModal}
        content={
          <Text variant="text-12-light" className="mt-1 mb-4" containHtml>
            Start by adding polygons to your site.
          </Text>
        }
        primaryButtonText="Close"
        primaryButtonProps={{ className: "px-8 py-3", variant: "primary", onClick: closeModal }}
      >
        <DragAndDrop
          description={
            <div className="flex flex-col">
              <Text variant="text-12-bold" className="text-center text-primary">
                Click to upload
              </Text>
              <Text variant="text-12-light" className="text-center">
                or
              </Text>
              <Text variant="text-12-light" className="max-w-[210px] text-center">
                Drag and drop a GeoJSON files only to store and display on TerraMatch.
              </Text>
            </div>
          }
        />
        <div>
          <div className="m-2 flex">
            <Text variant="text-12-bold">TerraMatch upload limits:&nbsp;</Text>
            <Text variant="text-12-light">50 MB per upload</Text>
          </div>
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
        </div>
      </ModalWithLogo>
    );
  };

  const openFormModalHandlerConfirm = () => {
    openModal(
      <ModalConfirm
        title={"Confirm Polygon Deletion"}
        content="Do you want to delete this polgyon?"
        onClose={closeModal}
        onConfirm={() => {}}
      />
    );
  };

  const openFormModalHandlerAddComentary = () => {
    openModal(
      <ModalWithLogo
        title="Blue Forest"
        onCLose={closeModal}
        status="Under Review"
        toogleButton
        content={
          <Text variant="text-12-bold" className="mt-1 mb-8" containHtml>
            Faja Lobi Project&nbsp;&nbsp;•&nbsp;&nbsp;Priceless Planet Coalition
          </Text>
        }
        primaryButtonText="Close"
        primaryButtonProps={{ className: "px-8 py-3", variant: "primary", onClick: closeModal }}
      >
        <div className="mb-[72px] px-20">
          <StepProgressbar value={80} labels={polygonStatusLabels} />
        </div>
        <div className="flex flex-col gap-4">
          <ComentaryBox name={"Ricardo"} lastName={"Saavedra"} />
          {comentariesItems.map(item => (
            <Comentary
              key={item.id}
              name={item.name}
              lastName={item.lastName}
              date={item.date}
              comentary={item.comentary}
              files={item.files}
              status={item.status}
            />
          ))}
        </div>
      </ModalWithLogo>
    );
  };
  const polygonMenuItems = [
    {
      id: "1",
      render: () => (
        <div className="flex items-center gap-2">
          <Icon name={IconNames.POLYGON} className="h-6 w-6" />
          <Text variant="text-12-bold">Edit Polygon</Text>
        </div>
      ),
      onClick: () => {
        setIsOpen(true);
      }
    },
    {
      id: "2",
      render: () => (
        <div className="flex items-center gap-2">
          <Icon name={IconNames.SEARCH_PA} className="h-6 w-6" />
          <Text variant="text-12-bold">Zoom to</Text>
        </div>
      )
    },
    {
      id: "3",
      render: () => (
        <div className="flex items-center gap-2">
          <Icon name={IconNames.DOWNLOAD_PA} className="h-6 w-6" />
          <Text variant="text-12-bold">Download</Text>
        </div>
      )
    },
    {
      id: "4",
      render: () => (
        <div className="flex items-center gap-2">
          <Icon name={IconNames.COMMENT} className="h-6 w-6" />
          <Text variant="text-12-bold">Comment</Text>
        </div>
      ),
      onClick: openFormModalHandlerAddComentary
    },
    {
      id: "5",
      render: () => (
        <div className="flex items-center gap-2">
          <Icon name={IconNames.REQUEST} className="h-6 w-6" />
          <Text variant="text-12-bold">Request Support</Text>
        </div>
      )
    },
    {
      id: "6",
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
        <PolygonDrawer />
      </Drawer>
      <Text variant="text-16-bold" className="mb-4 px-2 text-grey-300">
        Polygons
      </Text>
      <div className="mb-4 flex items-center gap-1">
        <Text variant="text-14" className="px-2 text-grey-250">
          Add Polygon
        </Text>
        <Button variant="text" onClick={openFormModalHandlerAddPolygon}>
          <Icon name={IconNames.PLUS_CIRCLE} className="h-4 w-4" />
        </Button>
      </div>
      <div ref={containerRef} className="flex max-h-[168px] flex-col overflow-auto">
        {props.menu.map(item => (
          <div
            key={item.id}
            className="flex items-center justify-between rounded-lg px-2 py-2 hover:cursor-pointer hover:bg-primary-200"
          >
            <div className="flex items-center gap-2">
              <div className={`h-4 w-4 rounded-full ${statusColor[item.status]}`} />
              <Text variant="text-14-light">{item.label}</Text>
            </div>
            <Menu container={containerRef.current} menu={polygonMenuItems} placement={MENU_PLACEMENT_LEFT_BOTTOM}>
              <Icon name={IconNames.ELIPSES} className="h-4 w-4" />
            </Menu>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Polygons;
