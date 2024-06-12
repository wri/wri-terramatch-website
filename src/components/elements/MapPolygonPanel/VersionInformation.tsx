import { useT } from "@transifex/react";
import classNames from "classnames";
import { Dispatch, SetStateAction } from "react";

import Icon, { IconNames } from "@/components/extensive/Icon/Icon";
import ModalConfirm from "@/components/extensive/Modal/ModalConfirm";
import { useModalContext } from "@/context/modal.provider";

import Menu from "../Menu/Menu";
import { MENU_PLACEMENT_RIGHT_BOTTOM } from "../Menu/MenuVariant";
import Text from "../Text/Text";

const VersionInformation = ({ setPreviewVersion }: { setPreviewVersion: Dispatch<SetStateAction<boolean>> }) => {
  const { openModal, closeModal } = useModalContext();
  const t = useT();

  const openFormModalHandlerConfirm = () => {
    openModal(
      <ModalConfirm
        title={"Confirm Version Delete?"}
        content="Do you want to delete this version?"
        onClose={closeModal}
        onConfirm={() => {}}
      />
    );
  };
  const itemsPrimaryMenu = [
    {
      id: "1",
      render: () => (
        <Text variant="text-14-semibold" className="flex items-center">
          <Icon name={IconNames.SEARCH} className="h-4 w-4 lg:h-5 lg:w-5" />
          &nbsp; {t("Preview Version")}
        </Text>
      ),
      onClick: () => setPreviewVersion(true)
    },
    {
      id: "2",
      render: () => (
        <Text variant="text-14-semibold" className="flex items-center">
          <Icon name={IconNames.TRASH_PA} className="h-5 w-4 lg:h-6 lg:w-6 " />
          &nbsp; {t("Delete Version")}
        </Text>
      ),
      onClick: () => openFormModalHandlerConfirm()
    }
  ];

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
          {t("Current")}
        </Text>
      </div>

      <div className="grid grid-flow-col grid-cols-4 border-b border-[#ffffff1a] py-2 ">
        <Text variant="text-10" className="col-span-2 text-white">
          -
        </Text>
        <Text variant="text-10" className="text-white">
          -
        </Text>
        <div className="flex justify-between">
          <button
            className={classNames("text-10-bold w-[64%] rounded-md border border-white", {
              "bg-white text-[#797F62]": true, // Replace 'item.current === "Yes"' with 'true' or provide a valid variable
              "bg-transparent text-white": false // Replace 'item.current === "No"' with 'false' or provide a valid variable
            })}
          >
            -
          </button>
          <Menu placement={MENU_PLACEMENT_RIGHT_BOTTOM} menu={itemsPrimaryMenu} className="">
            <Icon
              name={IconNames.IC_MORE_OUTLINED}
              className="h-4 w-4 rounded-lg text-white hover:fill-primary hover:text-primary lg:h-5 lg:w-5"
            />
          </Menu>
        </div>
      </div>
    </div>
  );
};

export default VersionInformation;
