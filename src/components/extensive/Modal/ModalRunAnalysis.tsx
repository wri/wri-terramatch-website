import { FC } from "react";
import { When } from "react-if";

import { useMonitoredData } from "@/admin/components/ResourceTabs/MonitoredTab/hooks/useMonitoredData";
import Button from "@/components/elements/Button/Button";
import Dropdown from "@/components/elements/Inputs/Dropdown/Dropdown";
import { VARIANT_DROPDOWN_DEFAULT } from "@/components/elements/Inputs/Dropdown/DropdownVariant";
import FileInput from "@/components/elements/Inputs/FileInput/FileInput";
import { VARIANT_FILE_INPUT_MODAL_ADD } from "@/components/elements/Inputs/FileInput/FileInputVariants";
import Input from "@/components/elements/Inputs/Input/Input";
import Text from "@/components/elements/Text/Text";
import { useMonitoredDataContext } from "@/context/monitoredData.provider";
import { useNotificationContext } from "@/context/notification.provider";
import { EntityName } from "@/types/common";

import Icon, { IconNames } from "../Icon/Icon";
import { ModalProps } from "./Modal";
import { ModalBaseWithLogo } from "./ModalsBases";

export interface ModalRunAnalysisProps extends ModalProps {
  secondaryButtonText?: string;
  onClose?: () => void;
  primaryButtonText: string;
  title: string;
  projectName?: string;
  entityType?: EntityName;
  entityUuid?: string;
  polygonsUiids: any;
}

const DROPDOWN_OPTIONS = [
  {
    title: "Tree Cover Loss",
    value: "1",
    slug: "treeCoverLoss"
  },
  {
    title: "Tree Cover Loss from Fire",
    value: "2",
    slug: "treeCoverLossFires"
  },
  {
    title: "Hectares Under Restoration By WWF EcoRegion",
    value: "3",
    slug: "restorationByEcoRegion"
  },
  {
    title: "Hectares Under Restoration By Strategy",
    value: "4",
    slug: "restorationByStrategy"
  },
  {
    title: "Hectares Under Restoration By Target Land Use System",
    value: "5",
    slug: "restorationByLandUse"
  },
  {
    title: "Tree Count",
    value: "6",
    slug: "treeCount"
  }
];

const ModalRunAnalysis: FC<ModalRunAnalysisProps> = ({
  primaryButtonProps,
  title,
  projectName,
  entityType,
  entityUuid,
  polygonsUiids,
  primaryButtonText,
  secondaryButtonProps,
  secondaryButtonText,
  children,
  content,
  onClose,
  ...rest
}) => {
  const { indicatorSlugAnalysis, setIndicatorSlugAnalysis, setLoadingAnalysis } = useMonitoredDataContext();
  const { runAnalysisIndicator, unparsedUuids } = useMonitoredData(entityType, entityUuid);
  const { openNotification } = useNotificationContext();
  // const [dropdownPlaceholder, setDropdownPlaceholder] = useState(
  //   DROPDOWN_OPTIONS.find(option => option.slug === indicatorSlugAnalysis)?.title +
  //     ` (${polygonsUiids.length} polygons not run)`
  // );
  const runAnalysis = async () => {
    setLoadingAnalysis?.(true);
    /* eslint-disable */
    if (unparsedUuids?.message) {
      setLoadingAnalysis?.(false);
      /* eslint-disable */
      return openNotification("warning", "Warning", unparsedUuids.message);
    }
    await runAnalysisIndicator({
      pathParams: {
        slug: indicatorSlugAnalysis!
      },
      body: {
        uuids: unparsedUuids
      }
    });
    onClose?.();
  };

  console.log(polygonsUiids.message);
  // const test = DROPDOWN_OPTIONS.map(option => {
  //   if (option.slug !== indicatorSlugAnalysis) {
  //     return option;
  //   }
  //   return {
  //     ...option,
  //     title: `${option.title} (${polygonsUiids.length} polygons not run)` // Actualizar solo el título de la opción seleccionada
  //   };
  // });
  // useEffect(() => {
  //   setDropdownPlaceholder(
  //     DROPDOWN_OPTIONS.find(option => option.slug === indicatorSlugAnalysis)?.title +
  //       ` (${polygonsUiids.length} polygons not run)`
  //   );
  // }, [indicatorSlugAnalysis, polygonsUiids]);

  // console.log(dropdownPlaceholder);

  // const updateTitleDropdownOptions = useMemo(() => {
  //   return DROPDOWN_OPTIONS.map(option => {
  //     if (option.slug !== indicatorSlugAnalysis) {
  //       return option;
  //     }
  //     return {
  //       ...option,
  //       title: `${option.title} (${polygonsUiids.length} polygons not run)` // Actualizar solo el título de la opción seleccionada
  //     };
  //   });
  // }, [indicatorSlugAnalysis, polygonsUiids]);
  // console.log(updateTitleDropdownOptions);
  return (
    <ModalBaseWithLogo {...rest}>
      <header className="flex w-full items-center justify-between border-b border-b-neutral-200 px-8 py-5">
        <Icon name={IconNames.WRI_LOGO} width={108} height={30} className="min-w-[108px]" />
        <button onClick={onClose} className="ml-2 rounded p-1 hover:bg-grey-800">
          <Icon name={IconNames.CLEAR} width={16} height={16} className="text-darkCustom-100" />
        </button>
      </header>
      <div className="h-auto w-full overflow-auto px-8 py-8">
        <Text variant="text-20-bold" className="">
          {title}
        </Text>
        <Text variant="text-12-light" className="mb-8">
          {content}
        </Text>
        <div className="mb-8 flex flex-col gap-4">
          <Input
            type="text"
            name="projectName"
            placeholder={projectName!}
            label="Project Name"
            variant="default"
            labelClassName="!capitalize !text-darkCustom"
            labelVariant="text-14-light"
            disabled={true}
            className="bg-neutral-150"
          />
          <Dropdown
            placeholder={
              DROPDOWN_OPTIONS.find(option => option.slug === indicatorSlugAnalysis)?.title +
              " ( " +
              // (polygonsUiids?.message ? 0 : Object?.keys(unparsedUuids!)?.length!) +
              0 +
              " polygons not run)"
            }
            label="Indicator"
            options={DROPDOWN_OPTIONS}
            onChange={e => {
              const indicator = DROPDOWN_OPTIONS.find(option => option.value === e[0])?.slug;
              setIndicatorSlugAnalysis?.(indicator!);
            }}
            variant={VARIANT_DROPDOWN_DEFAULT}
            className="!min-h-[44px] !py-[9px]"
            labelClassName="!capitalize !text-darkCustom"
            labelVariant="text-14-light"
          />
          <FileInput
            label="Upload Manually"
            labelClassName="!capitalize !text-darkCustom"
            labelVariant="text-14-light"
            files={[]}
            variant={VARIANT_FILE_INPUT_MODAL_ADD}
            descriptionInput={
              <Text variant="text-12-light" className="min-w-max text-center">
                Drag and drop a CSV File based on the required{" "}
                <Text variant="text-12-bold" className="text-primary" as="span">
                  data table
                </Text>{" "}
                schema
              </Text>
            }
          />
        </div>
      </div>
      <div className="flex w-full justify-end gap-3 px-8 py-4">
        <When condition={!!secondaryButtonProps}>
          <Button {...secondaryButtonProps!} variant="white-page-admin">
            <Text variant="text-14-bold" className="capitalize text-darkCustom">
              {secondaryButtonText}
            </Text>
          </Button>
        </When>
        <Button {...primaryButtonProps} onClick={runAnalysis}>
          <Text variant="text-14-bold" className="capitalize text-white">
            {primaryButtonText}
          </Text>
        </Button>
      </div>
    </ModalBaseWithLogo>
  );
};

export default ModalRunAnalysis;
