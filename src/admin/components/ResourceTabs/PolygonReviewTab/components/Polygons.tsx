import React, { useRef, useState } from "react";

import Drawer from "@/components/elements/Drawer/Drawer";
import Menu from "@/components/elements/Menu/Menu";
import { MENU_PLACEMENT_LEFT_BOTTOM } from "@/components/elements/Menu/MenuVariant";
import Text from "@/components/elements/Text/Text";
import Icon from "@/components/extensive/Icon/Icon";
import { IconNames } from "@/components/extensive/Icon/Icon";
import ModalConfirm from "@/components/extensive/Modal/ModalConfirm";
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

const Polygons = (props: IPolygonProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { openModal, closeModal } = useModalContext();
  const containerRef = useRef<HTMLDivElement>(null);
  const openFormModalHandler = () => {
    openModal(
      <ModalConfirm
        title={"Confirm Polygon Deletion"}
        content="Do you want to delete this polgyon?"
        onClose={closeModal}
        onConfirm={() => {}}
      />
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
      )
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
      onClick: openFormModalHandler
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
        <Icon name={IconNames.PLUS_CIRCLE} className="h-4 w-4" />
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
