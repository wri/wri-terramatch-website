import { t } from "@transifex/native";

import Icon, { IconNames } from "@/components/extensive/Icon/Icon";
import { dataImageGallery } from "@/components/extensive/Modal/ModalContent/MockedData";
import ModalImageGallery from "@/components/extensive/Modal/ModalImageGallery";
import { useModalContext } from "@/context/modal.provider";

import Button from "../../Button/Button";
import Text from "../../Text/Text";

const ViewImageCarousel = () => {
  const { openModal, closeModal } = useModalContext();

  const openFormModalHandlerImageGallery = () => {
    openModal(<ModalImageGallery onCLose={closeModal} tabItems={dataImageGallery} title={""} />);
  };

  return (
    <div className="relative">
      <Button variant="white-button-map" className="flex items-center gap-2" onClick={openFormModalHandlerImageGallery}>
        <Icon name={IconNames.IMAGE_ICON} className="h-4 w-4" />
        <Text variant="text-12-bold"> {t("View Gallery")}</Text>
      </Button>
    </div>
  );
};

export default ViewImageCarousel;
