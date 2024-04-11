import { useState } from "react";

import ModalConfirm from "@/components/extensive/Modal/ModalConfirm";
import { useModalContext } from "@/context/modal.provider";

import Dropdown from "../../Inputs/Dropdown/Dropdown";
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
  }
];

const PolygonStatus = () => {
  const { openModal, closeModal } = useModalContext();
  const [confirmChange, setConfirmChange] = useState(true);

  const openFormModalHandler = () => {
    openModal(
      <ModalConfirm
        title={"Confirm Polygon Deletion"}
        content="Do you want to delete this polgyon?"
        onClose={closeModal}
        onConfirm={() => {
          setConfirmChange(true);
          closeModal;
        }}
      />
    );
  };

  return (
    <div className="flex h-fit flex-col gap-1 rounded-lg bg-white p-3 shadow">
      <Text variant="text-14-light" className="opacity-60">
        Polygon Status
      </Text>
      <Dropdown
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
