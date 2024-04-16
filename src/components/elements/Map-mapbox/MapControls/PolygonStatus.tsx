import { useState } from "react";

import ModalConfirm from "@/components/extensive/Modal/ModalConfirm";
import { useModalContext } from "@/context/modal.provider";

import Dropdown from "../../Inputs/Dropdown/Dropdown";
import TextArea from "../../Inputs/textArea/TextArea";
import Text from "../../Text/Text";

const dropdownOptions = [
  {
    title: "Site Approved",
    value: 1
  },
  {
    title: "Polygons Submitted",
    value: 2
  },
  {
    title: "Polygons Approved",
    value: 3
  },
  {
    title: "Monitoring Begins",
    value: 4
  },
  {
    title: "Planting Complete",
    value: 5
  }
];

const PolygonStatus = () => {
  const { openModal, closeModal } = useModalContext();
  const [confirmChange, setConfirmChange] = useState(true);

  const openFormModalHandler = () => {
    openModal(
      <ModalConfirm
        className="w-[300px]"
        title={"Confirm Polygon Status Change"}
        content={
          <Text variant="text-14-light" className="text-center">
            Are you sure you want to change the polgyon status to Planting Complete?
          </Text>
        }
        onClose={closeModal}
        onConfirm={() => {
          setConfirmChange(true);
          closeModal;
        }}
      >
        <TextArea
          placeholder="Type comment here..."
          name=""
          className="text-14-light max-h-72 !min-h-0 resize-none rounded-lg border border-grey-750 px-4 py-3"
          containerClassName="w-full"
          rows={4}
        />
      </ModalConfirm>
    );
  };

  return (
    <div className="flex h-fit flex-col gap-1 rounded-lg bg-white p-3 shadow">
      <Text variant="text-14-light" className="opacity-60">
        Polygon Status
      </Text>
      <Dropdown
        optionClassName="w-full whitespace-nowrap"
        placeholder="PolygonStatus"
        options={dropdownOptions}
        onChange={openFormModalHandler}
        onChangeConfirm={confirmChange}
        setOnChangeConfirm={setConfirmChange}
      />
    </div>
  );
};

export default PolygonStatus;
