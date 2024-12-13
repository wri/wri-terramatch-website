import { FC, useState } from "react";
import { When } from "react-if";

import { useMonitoredData } from "@/admin/components/ResourceTabs/MonitoredTab/hooks/useMonitoredData";
import Button from "@/components/elements/Button/Button";
import Dropdown from "@/components/elements/Inputs/Dropdown/Dropdown";
import { VARIANT_DROPDOWN_DEFAULT } from "@/components/elements/Inputs/Dropdown/DropdownVariant";
import Input from "@/components/elements/Inputs/Input/Input";
import Text from "@/components/elements/Text/Text";
import InlineLoader from "@/components/generic/Loading/InlineLoader";
import { useMonitoredDataContext } from "@/context/monitoredData.provider";
import { useNotificationContext } from "@/context/notification.provider";
import { EntityName } from "@/types/common";

import Icon, { IconNames } from "../Icon/Icon";
import { ModalProps } from "./Modal";
import { ModalBaseWithMonitored } from "./ModalsBases";

export interface ModalRunAnalysisProps extends ModalProps {
  secondaryButtonText?: string;
  onClose?: () => void;
  primaryButtonText: string;
  title: string;
  projectName?: string;
  entityType?: EntityName;
  entityUuid?: string;
}

const ModalRunAnalysis: FC<ModalRunAnalysisProps> = ({
  primaryButtonProps,
  title,
  projectName,
  entityType,
  entityUuid,
  primaryButtonText,
  secondaryButtonProps,
  secondaryButtonText,
  children,
  content,
  onClose,
  ...rest
}) => {
  const { indicatorSlugAnalysis, setIndicatorSlugAnalysis, setLoadingAnalysis, indicatorSlug } =
    useMonitoredDataContext();
  const { runAnalysisIndicator, dropdownAnalysisOptions, loadingVerify, analysisToSlug } = useMonitoredData(
    entityType,
    entityUuid
  );
  const { openNotification } = useNotificationContext();
  const [selectSlug, setSelectSlug] = useState<string | undefined>();
  const runAnalysis = async () => {
    const indicatorSlugSelected = selectSlug ? indicatorSlugAnalysis : indicatorSlug;
    setLoadingAnalysis?.(true);
    if (analysisToSlug[`${indicatorSlugSelected}`]?.message) {
      setLoadingAnalysis?.(false);
      return openNotification("warning", "Warning", analysisToSlug[`${indicatorSlugSelected}`].message);
    }
    await runAnalysisIndicator({
      pathParams: {
        slug: indicatorSlugSelected!
      },
      body: {
        uuids: analysisToSlug[`${indicatorSlugSelected}`]
      }
    });
    setIndicatorSlugAnalysis?.("treeCoverLoss");
    onClose?.();
  };

  return (
    <ModalBaseWithMonitored {...rest}>
      <header className="flex w-full items-center justify-between border-b border-b-neutral-200 px-8 py-5">
        <Icon name={IconNames.WRI_LOGO} width={108} height={30} className="min-w-[108px]" />
        <button
          onClick={() => {
            setIndicatorSlugAnalysis?.("treeCoverLoss");
            onClose?.();
          }}
          className="ml-2 rounded p-1 hover:bg-grey-800"
        >
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
          <When condition={!loadingVerify}>
            <Dropdown
              placeholder={dropdownAnalysisOptions.find(option => option.slug === indicatorSlug)?.title}
              label="Indicator"
              options={dropdownAnalysisOptions}
              onChange={e => {
                const indicator = dropdownAnalysisOptions.find(option => option.value === e[0])?.slug;
                setIndicatorSlugAnalysis?.(indicator!);
                setSelectSlug(indicator);
              }}
              variant={VARIANT_DROPDOWN_DEFAULT}
              className="!min-h-[44px] !py-[9px]"
              labelClassName="!capitalize !text-darkCustom"
              labelVariant="text-14-light"
            />
          </When>
        </div>
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
      </div>
      <div className="flex w-full justify-end gap-3 px-8 py-4">
        <When condition={!!secondaryButtonProps}>
          <Button {...secondaryButtonProps!} variant="white-page-admin">
            <Text variant="text-14-bold" className="capitalize text-darkCustom">
              {secondaryButtonText}
            </Text>
          </Button>
        </When>
        <Button {...primaryButtonProps} onClick={runAnalysis} disabled={loadingVerify}>
          <Text variant="text-14-bold" className="capitalize text-white">
            {primaryButtonText}
          </Text>
          <InlineLoader loading={loadingVerify} />
        </Button>
      </div>
    </ModalBaseWithMonitored>
  );
};

export default ModalRunAnalysis;
