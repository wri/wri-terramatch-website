import { t } from "@transifex/native";
import classNames from "classnames";
import { Dispatch, SetStateAction } from "react";

import Icon, { IconNames } from "@/components/extensive/Icon/Icon";
import ModalAdd from "@/components/extensive/Modal/ModalAdd";
import { ModalId } from "@/components/extensive/Modal/ModalConst";
import { uploadImageData } from "@/components/extensive/Modal/ModalContent/MockedData";
import { useModalContext } from "@/context/modal.provider";

import { VARIANT_FILE_INPUT_MODAL_ADD_IMAGES } from "../../Inputs/FileInput/FileInputVariants";
import Text from "../../Text/Text";

const ImageControl = ({
  viewImages,
  setViewImages
}: {
  viewImages: boolean;
  setViewImages: Dispatch<SetStateAction<boolean>>;
}) => {
  const { openModal, closeModal } = useModalContext();

  const openFormModalHandlerUploadImages = () => {
    openModal(
      ModalId.UPLOAD_IMAGES,
      <ModalAdd
        title="Upload Images"
        variantFileInput={VARIANT_FILE_INPUT_MODAL_ADD_IMAGES}
        descriptionInput="Drag and drop a geotagged or non-geotagged PNG, GIF or JPEG for your site Tannous/Brayton Road.."
        descriptionList={
          <Text variant="text-12-bold" className="mt-9 ">
            {t("Uploaded Files")}
          </Text>
        }
        onClose={() => closeModal(ModalId.UPLOAD_IMAGES)}
        content="Start by adding images for processing."
        primaryButtonText="Save"
        primaryButtonProps={{
          className: "px-8 py-3",
          variant: "primary",
          onClick: () => closeModal(ModalId.UPLOAD_IMAGES)
        }}
      >
        {/* Next div is only Mocked data delete this children later*/}
        <div className="mb-6 flex flex-col gap-4">
          {uploadImageData.map(image => (
            <div
              key={image.id}
              className="border-grey-75 flex items-center justify-between rounded-lg border border-grey-750 py-[10px] px-4"
            >
              <div className="flex gap-3">
                <div className="rounded-lg bg-neutral-150 p-2">
                  <Icon name={IconNames.IMAGE} className="h-6 w-6 text-grey-720" />
                </div>
                <div>
                  <Text variant="text-12">{image.name}</Text>
                  <Text variant="text-12" className="opacity-50">
                    {image.status}
                  </Text>
                </div>
              </div>
              <div
                className={classNames("flex w-[146px] items-center justify-center rounded border py-2", {
                  "border-blue": image.isVerified,
                  "border-red": !image.isVerified
                })}
              >
                <Text
                  variant="text-12-bold"
                  className={classNames("text-center", {
                    "text-blue": image.isVerified,
                    "text-red": !image.isVerified
                  })}
                >
                  {image.isVerified ? "GeoTagged Verified" : "Not Verified"}
                </Text>
              </div>
            </div>
          ))}
        </div>
      </ModalAdd>
    );
  };

  return (
    <>
      <div className="flex gap-4">
        <button
          className="text-12-bold h-fit rounded-lg bg-white px-5 py-2 shadow hover:bg-neutral-200"
          onClick={() => setViewImages(!viewImages)}
        >
          {t("Close Images")}
        </button>
        <button
          className="text-12-bold h-fit rounded-lg bg-white px-5 py-2 shadow hover:bg-neutral-200"
          onClick={openFormModalHandlerUploadImages}
        >
          {t("Add Images")}
        </button>
      </div>
    </>
  );
};

export default ImageControl;
