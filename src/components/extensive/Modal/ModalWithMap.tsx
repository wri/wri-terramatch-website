import { useT } from "@transifex/react";
import { remove } from "lodash";
import { FC, useState } from "react";
import { When } from "react-if";

import Button from "@/components/elements/Button/Button";
import FileInput from "@/components/elements/Inputs/FileInput/FileInput";
import { VARIANT_FILE_INPUT_MODAL_ADD_IMAGES_WITH_MAP } from "@/components/elements/Inputs/FileInput/FileInputVariants";
import TextArea from "@/components/elements/Inputs/textArea/TextArea";
import Map from "@/components/elements/Map-mapbox/Map";
import StepProgressbar from "@/components/elements/ProgressBar/StepProgressbar/StepProgressbar";
import Status from "@/components/elements/Status/Status";
import Text from "@/components/elements/Text/Text";
import { UploadedFile } from "@/types/common";

import Icon, { IconNames } from "../Icon/Icon";
import { ModalProps } from "./Modal";
import { polygonStatusLabels } from "./ModalContent/MockedData";
import { ModalBaseWithMap } from "./ModalsBases";

export interface ModalWithMapProps extends ModalProps {
  polygonSelected?: string;
  primaryButtonText?: string;
  status?: "under-review" | "approved" | "draft" | "submitted";
  onClose?: () => void;
}

const ModalWithMap: FC<ModalWithMapProps> = ({
  polygonSelected,
  iconProps,
  title,
  content,
  primaryButtonProps,
  primaryButtonText,
  children,
  status,
  onClose,
  ...rest
}) => {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const t = useT();

  return (
    <ModalBaseWithMap {...rest}>
      <div className="flex h-full w-full">
        <div className="flex w-[40%] flex-col">
          <header className="flex w-full items-center justify-between border-b border-b-neutral-200 px-8 py-5">
            <Icon name={IconNames.WRI_LOGO} width={108} height={30} className="min-w-[108px]" />
            <div className="flex items-center">
              <When condition={status}>
                <Status status={status ?? "draft"} />
              </When>
            </div>
          </header>
          <div className="max-h-[100%] w-full flex-[1_1_0] overflow-auto px-8 py-8">
            <div className="flex items-center justify-between">
              <Text variant="text-24-bold">{title}</Text>
            </div>
            <When condition={!!content}>
              <Text as="div" variant="text-12-bold" className="mt-1 mb-8" containHtml>
                {content}
              </Text>
            </When>
            <div className="mb-[72px]">
              <StepProgressbar value={80} labels={polygonStatusLabels} classNameLabels="min-w-[111px]" />
            </div>
            <TextArea
              name={""}
              label="Comment"
              labelVariant="text-12-light"
              labelClassName="capitalize "
              className="text-12-light max-h-72 !min-h-0 resize-none"
              placeholder="Insert my comment"
              rows={4}
            />
            <Text variant="text-12-light" className="mt-6 mb-2">
              {t("Attachments")}
            </Text>
            <FileInput
              descriptionInput="Drag and drop documents or images to help reviewer"
              variant={VARIANT_FILE_INPUT_MODAL_ADD_IMAGES_WITH_MAP}
              onDelete={file =>
                setFiles(state => {
                  const tmp = [...state];
                  remove(tmp, f => f.uuid === file.uuid);
                  return tmp;
                })
              }
              onChange={files =>
                setFiles(f => [
                  ...f,
                  ...files.map(file => ({
                    title: file.name,
                    file_name: file.name,
                    mime_type: file.type,
                    collection_name: "storybook",
                    size: file.size,
                    url: "https://google.com",
                    created_at: "now",
                    uuid: file.name,
                    is_public: true,
                    original_file: file
                  }))
                ])
              }
              files={files}
            />
          </div>
          <div className="flex w-full justify-end px-8 py-4">
            <Button {...primaryButtonProps}>
              <Text variant="text-14-bold" className="capitalize text-white">
                {primaryButtonText}
              </Text>
            </Button>
          </div>
        </div>
        <div className="relative h-[700px] w-[60%]">
          <Map className="h-full w-full" hasControls={false} />
          <button onClick={onClose} className="absolute right-1 top-1 z-10 rounded bg-grey-750 p-1 drop-shadow-md">
            <Icon name={IconNames.CLEAR} className="h-4 w-4 text-darkCustom-100" />
          </button>
        </div>
      </div>
    </ModalBaseWithMap>
  );
};

export default ModalWithMap;
