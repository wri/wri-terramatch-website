import { useT } from "@transifex/react";

import ModalConfirm from "@/components/extensive/Modal/ModalConfirm";
import { ModalId } from "@/components/extensive/Modal/ModalConst";
import { useModalContext } from "@/context/modal.provider";

import Dropdown from "../../Inputs/Dropdown/Dropdown";
import Text from "../../Text/Text";

const dropdownOptions = [
  {
    title: "Draft",
    value: 1,
    status: "draft"
  },
  {
    title: "Pending Approval",
    value: 2,
    status: "pending-approval"
  },
  {
    title: "Information Required",
    value: 3,
    status: "information-required"
  },
  {
    title: "Approved",
    value: 5,
    status: "approved"
  }
];

const SiteStatus = ({ record, refresh }: { record: any; refresh: any }) => {
  const { openModal, closeModal } = useModalContext();
  const t = useT();

  const openFormModalHandler = (indexes: any[]) => {
    const optionSelected = dropdownOptions.find(option => option.value === indexes[0]);
    openModal(
      ModalId.CONFIRM_SITES_STATUS_CHANGE,
      <ModalConfirm
        title={"Confirm Site Status Change"}
        commentArea
        content={
          <Text variant="text-14-light" className="text-center">
            {t("Are you sure you want to change the site status to")} {optionSelected?.title}?
          </Text>
        }
        onClose={() => closeModal(ModalId.CONFIRM_SITES_STATUS_CHANGE)}
        onConfirm={() => {}}
      />
    );
  };

  return (
    <div className="min-w-[152px] rounded-lg bg-white p-3 shadow lg:min-w-[167px] wide:min-w-[182px]">
      <Dropdown
        label={"Site Status"}
        labelClassName="capitalize"
        labelVariant="text-12-bold"
        optionClassName="py-[6px] px-3"
        optionTextClassName="w-full whitespace-nowrap"
        optionVariant="text-12-light"
        containerClassName="space-y-0"
        placeholder={record.readable_status ?? "Site Status"}
        inputVariant="text-12-light"
        options={dropdownOptions}
        onChange={openFormModalHandler}
      />
    </div>
  );
};

export default SiteStatus;
