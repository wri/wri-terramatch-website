import { useT } from "@transifex/react";
import { remove } from "lodash";
import { FC, useCallback, useEffect, useState } from "react";

import Button from "@/components/elements/Button/Button";
import FileInput from "@/components/elements/Inputs/FileInput/FileInput";
import { VARIANT_FILE_INPUT_MODAL_ADD_IMAGES_WITH_MAP } from "@/components/elements/Inputs/FileInput/FileInputVariants";
import TextArea from "@/components/elements/Inputs/textArea/TextArea";
import { BBox } from "@/components/elements/Map-mapbox/GeoJSON";
import { MapContainer } from "@/components/elements/Map-mapbox/Map";
import StepProgressbar from "@/components/elements/ProgressBar/StepProgressbar/StepProgressbar";
import { StatusEnum } from "@/components/elements/Status/constants/statusMap";
import Status from "@/components/elements/Status/Status";
import Text from "@/components/elements/Text/Text";
import { formatFile } from "@/components/extensive/Modal/ModalAdd";
import { useBoundingBox } from "@/connections/BoundingBox";
import { fetchGetV2TerrafundPolygonGeojsonUuid } from "@/generated/apiComponents";
import { UploadedFile } from "@/types/common";

import Icon, { IconNames } from "../Icon/Icon";
import { ModalProps } from "./Modal";
import { polygonStatusLabels } from "./ModalContent/MockedData";
import { ModalBaseWithMap } from "./ModalsBases";

export interface ModalWithMapProps extends ModalProps {
  polygonSelected?: string;
  primaryButtonText?: string;
  status?: StatusEnum;
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
  const [polygonData, setPolygonData] = useState<any>();
  const [initialPolygonData, setInitialPolygonData] = useState<any>();
  const t = useT();

  const polygonBbox = useBoundingBox({ polygonUuid: polygonSelected });

  useEffect(() => {
    const getPolygonData = async () => {
      if (polygonSelected) {
        const polygonGeojson = await fetchGetV2TerrafundPolygonGeojsonUuid({
          pathParams: { uuid: polygonSelected }
        });
        setInitialPolygonData(polygonGeojson);
      }
    };
    getPolygonData();
  }, [polygonSelected]);

  useEffect(() => {
    if (initialPolygonData) {
      const selectedPolygon: any = {};
      const entry = initialPolygonData?.site_polygon;
      selectedPolygon[entry?.status] = entry?.poly_id;
      setPolygonData(selectedPolygon);
    }
  }, [initialPolygonData]);

  const onChange = useCallback((files: File[]) => setFiles(f => [...f, ...files.map(formatFile)]), []);

  return (
    <ModalBaseWithMap {...rest}>
      <div className="flex h-full w-full">
        <div className="flex w-[40%] flex-col">
          <header className="flex w-full items-center justify-between border-b border-b-neutral-200 px-8 py-5">
            <Icon name={IconNames.WRI_LOGO} width={108} height={30} className="min-w-[108px]" />
            <div className="flex items-center">{status == null ? null : <Status status={status} />}</div>
          </header>
          <div className="max-h-[100%] w-full flex-[1_1_0] overflow-auto px-8 py-8">
            <div className="flex items-center justify-between">
              <Text variant="text-24-bold">{t(title)}</Text>
            </div>
            {content == null ? null : (
              <Text as="div" variant="text-12-bold" className="mt-1 mb-8" containHtml>
                {t(content)}
              </Text>
            )}
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
              onChange={onChange}
              files={files}
            />
          </div>
          <div className="flex w-full justify-end px-8 py-4">
            <Button {...primaryButtonProps}>
              <Text variant="text-14-bold" className="capitalize text-white">
                {t(primaryButtonText)}
              </Text>
            </Button>
          </div>
        </div>
        <div className="relative h-[700px] w-[60%]">
          <MapContainer
            className="h-full w-full"
            hasControls={false}
            polygonChecks
            polygonsData={polygonData}
            bbox={polygonBbox as BBox}
          />
          <button onClick={onClose} className="drop-shadow-md absolute right-1 top-1 z-10 rounded bg-grey-750 p-1">
            <Icon name={IconNames.CLEAR} className="h-4 w-4 text-darkCustom-100" />
          </button>
        </div>
      </div>
    </ModalBaseWithMap>
  );
};

export default ModalWithMap;
