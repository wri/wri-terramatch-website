import Icon, { IconNames } from "@/components/extensive/Icon/Icon";
import ModalWithMap from "@/components/extensive/Modal/ModalWithMap";
import { useModalContext } from "@/context/modal.provider";
import { polygonStatusLabels } from "@/pages/site/[uuid]/components/MockecData";

import Button from "../Button/Button";
import DragAndDrop from "../DragAndDrop/DragAndDrop";
import TextArea from "../Inputs/textArea/TextArea";
import StepProgressbar from "../ProgressBar/StepProgressbar/StepProgressbar";
import Text from "../Text/Text";

const ChecklistInformation = () => {
  const { openModal, closeModal } = useModalContext();
  const openFormModalHandlerRequestPolygonSupport = () => {
    openModal(
      <ModalWithMap
        title="Request Support"
        onCLose={closeModal}
        content={
          <Text variant="text-16-bold" className="mt-1 mb-8" containHtml>
            Faja Lobi Project&nbsp;&nbsp;•&nbsp;&nbsp;Priceless Planet Coalition
          </Text>
        }
        primaryButtonText="Submit"
        primaryButtonProps={{ className: "px-8 py-3", variant: "primary", onClick: closeModal }}
      >
        <div className="mb-[72px]">
          <StepProgressbar value={80} labels={polygonStatusLabels} />
        </div>
        <TextArea
          name={""}
          label="Comment"
          labelVariant="text-12-light"
          labelClassname="capitalize "
          className="text-12-light max-h-72 !min-h-0 resize-none"
          placeholder="Insert my comment"
          rows={4}
        />
        <Text variant="text-12-light" className="mt-6 mb-2">
          Attachments
        </Text>
        <DragAndDrop
          description={
            <div className="flex flex-col">
              <Text variant="text-12-bold" className="text-center text-primary">
                Click to upload
              </Text>
              <Text variant="text-12-bold" className="whitespace-nowrap text-center text-primary">
                documents or images to help reviewer
              </Text>
            </div>
          }
        />
      </ModalWithMap>
    );
  };
  return (
    <div className="text-white">
      <Text variant="text-14-bold">3 out 14</Text>
      <Text variant="text-14-light">Validation criteria are not met</Text>
      <Button variant="primary" className="mt-4" onClick={openFormModalHandlerRequestPolygonSupport}>
        request support
      </Button>
      <div className="mt-3 grid gap-3">
        <Text variant="text-14-light" className="flex items-center gap-2">
          <Icon name={IconNames.CHECK_PROGRESSBAR} className="h-4 w-4 text-green-400 lg:h-5 lg:w-5" />
          GeoJSON Format
        </Text>
        <Text variant="text-14-light" className="flex items-center gap-2">
          <Icon name={IconNames.CHECK_PROGRESSBAR} className="h-4 w-4 text-green-400 lg:h-5 lg:w-5" />
          WGS84 Projection
        </Text>
        <Text variant="text-14-light" className="flex items-center gap-2">
          <Icon name={IconNames.IC_ERROR} className="h-5 w-5 lg:h-6 lg:w-6" />
          Earth Location
        </Text>
        <Text variant="text-14-light" className="flex items-center gap-2">
          <Icon name={IconNames.IC_ERROR} className="h-5 w-5 lg:h-6 lg:w-6" />
          Country
        </Text>
        <Text variant="text-14-light" className="flex items-center gap-2">
          <Icon name={IconNames.CHECK_PROGRESSBAR} className="h-4 w-4 text-green-400 lg:h-5 lg:w-5" />
          Reasonable Size Self-Intersecting Topology
        </Text>
        <Text variant="text-14-light" className="flex items-center gap-2">
          <Icon name={IconNames.IC_ERROR} className="h-5 w-5 lg:h-6 lg:w-6" />
          Overlapping Polygons
        </Text>
        <Text variant="text-14-light" className="flex items-center gap-2">
          <Icon name={IconNames.CHECK_PROGRESSBAR} className="h-4 w-4 text-green-400 lg:h-5 lg:w-5" />
          Spike
        </Text>
        <Text variant="text-14-light" className="flex items-center gap-2">
          <Icon name={IconNames.CHECK_PROGRESSBAR} className="h-4 w-4 text-green-400 lg:h-5 lg:w-5" />
          Polygon Integrity
        </Text>
        <Text variant="text-14-light" className="flex items-center gap-2">
          <Icon name={IconNames.CHECK_PROGRESSBAR} className="h-4 w-4 text-green-400 lg:h-5 lg:w-5" />
          GeoJSON Format
        </Text>
        <Text variant="text-14-light" className="flex items-center gap-2">
          <Icon name={IconNames.CHECK_PROGRESSBAR} className="h-4 w-4 text-green-400 lg:h-5 lg:w-5" />
          WGS84 Projection
        </Text>
        <Text variant="text-14-light" className="flex items-center gap-2">
          <Icon name={IconNames.IC_ERROR} className="h-5 w-5 lg:h-6 lg:w-6" />
          Earth Location
        </Text>
        <Text variant="text-14-light" className="flex items-center gap-2">
          <Icon name={IconNames.IC_ERROR} className="h-5 w-5 lg:h-6 lg:w-6" />
          Country
        </Text>
      </div>
    </div>
  );
};

export default ChecklistInformation;
