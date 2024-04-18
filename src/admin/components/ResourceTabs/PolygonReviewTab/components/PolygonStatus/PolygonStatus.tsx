import Button from "@/components/elements/Button/Button";
import TextArea from "@/components/elements/Inputs/textArea/TextArea";
import Text from "@/components/elements/Text/Text";
import Icon, { IconNames } from "@/components/extensive/Icon/Icon";
import ModalConfirm from "@/components/extensive/Modal/ModalConfirm";
import { useModalContext } from "@/context/modal.provider";

const PolygonStatus = () => {
  const { openModal, closeModal } = useModalContext();
  const contentStatus = (
    <Text variant="text-12-light" as="p" className="text-center">
      Are you sure you want to change the polygon status to <b style={{ fontSize: "inherit" }}>Monitoring Begins</b>?
    </Text>
  );
  const contentRequest = (
    <Text variant="text-12-light" as="p" className="text-center">
      Provide an explanation for your change request for the polygon: <b style={{ fontSize: "inherit" }}>Malanga.</b>?
    </Text>
  );

  const openFormModalHandlerStatus = () => {
    openModal(
      <ModalConfirm
        className="max-w-xs"
        title="Polygon Status Change"
        onClose={closeModal}
        content={contentStatus}
        onConfirm={() => {
          closeModal;
        }}
      >
        <div className="rounded-lg border border-grey-750 p-3">
          <TextArea
            placeholder="Type comment here..."
            name=""
            className="max-h-72 !min-h-0 resize-none border-none !p-0 text-xs"
            containerClassName="w-full"
            rows={4}
          />
        </div>
      </ModalConfirm>
    );
  };

  const openFormModalHandlerRequest = () => {
    openModal(
      <ModalConfirm
        className="max-w-xs"
        title={"Confirm Polygon Deletion"}
        content={contentRequest}
        onClose={closeModal}
        onConfirm={() => {
          closeModal;
        }}
      >
        <div className="rounded-lg border border-grey-750 p-3">
          <TextArea
            placeholder="Type comment here..."
            name=""
            className="max-h-72 !min-h-0 resize-none border-none !p-0 text-xs"
            containerClassName="w-full"
            rows={4}
          />
        </div>
      </ModalConfirm>
    );
  };
  return (
    <div className="flex flex-wrap items-center gap-4">
      <div className="flex w-full items-center gap-2">
        <Text variant="text-16-bold">Status:</Text>
        <div className="flex items-center gap-[6px] rounded-xl bg-secondary-200 py-[2px] px-[6px]">
          <Icon name={IconNames.STATUS_APPROVED} className="h-4 w-4" />
          <Text variant="text-12-semibold" className="text-green-500">
            Approved
          </Text>
        </div>
      </div>
      <Button variant="semi-black" className="flex-1 whitespace-nowrap" onClick={openFormModalHandlerRequest}>
        Request change
      </Button>
      <Button className="flex-1 border-[3px] border-primary" onClick={openFormModalHandlerStatus}>
        change status
      </Button>
    </div>
  );
};

export default PolygonStatus;
