import { t } from "@transifex/native";
import { useMemo } from "react";

import Icon, { IconNames } from "@/components/extensive/Icon/Icon";
import ModalImageGallery, { TabImagesItem } from "@/components/extensive/Modal/ModalImageGallery";
import { useModalContext } from "@/context/modal.provider";
import { GetV2MODELUUIDFilesResponse } from "@/generated/apiComponents";

import Button from "../../Button/Button";
import Text from "../../Text/Text";

const ViewImageCarousel = ({ modelFilesData }: { modelFilesData: GetV2MODELUUIDFilesResponse["data"] }) => {
  const { openModal, closeModal } = useModalContext();

  const modelFilesTabItems: TabImagesItem[] = useMemo(() => {
    const modelFilesGeolocalized: GetV2MODELUUIDFilesResponse["data"] = [];
    const modelFilesNonGeolocalized: GetV2MODELUUIDFilesResponse["data"] = [];
    modelFilesData?.forEach(modelFile => {
      if (modelFile.location?.lat && modelFile.location?.lng) {
        modelFilesGeolocalized.push(modelFile);
      } else {
        modelFilesNonGeolocalized.push(modelFile);
      }
    });
    return [
      {
        id: "1",
        title: t("Non-Geotagged Images"),
        images: modelFilesNonGeolocalized.map(modelFile => ({
          id: modelFile.uuid!,
          src: modelFile.file_url!,
          title: modelFile.file_name!,
          dateCreated: modelFile.created_date!,
          geoTag: t("Not Geo-Referenced")
        }))
      },
      {
        id: "2",
        title: t("GeoTagged Images"),
        images: modelFilesGeolocalized.map(modelFile => ({
          id: modelFile.uuid!,
          src: modelFile.file_url!,
          title: modelFile.file_name!,
          dateCreated: modelFile.created_date!,
          geoTag: t("Geo-Referenced")
        }))
      }
    ];
  }, [modelFilesData]);

  const openFormModalHandlerImageGallery = () => {
    openModal(<ModalImageGallery onClose={closeModal} tabItems={modelFilesTabItems} title={""} />);
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
