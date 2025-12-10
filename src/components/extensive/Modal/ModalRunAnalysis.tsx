import { useT } from "@transifex/react";
import { FC, useState } from "react";
import { When } from "react-if";

import { useMonitoredData } from "@/admin/components/ResourceTabs/MonitoredTab/hooks/useMonitoredData";
import Button from "@/components/elements/Button/Button";
import Checkbox from "@/components/elements/Inputs/Checkbox/Checkbox";
import Dropdown from "@/components/elements/Inputs/Dropdown/Dropdown";
import { VARIANT_DROPDOWN_DEFAULT } from "@/components/elements/Inputs/Dropdown/DropdownVariant";
import Input from "@/components/elements/Inputs/Input/Input";
import Text from "@/components/elements/Text/Text";
import InlineLoader from "@/components/generic/Loading/InlineLoader";
import { useMonitoredDataContext } from "@/context/monitoredData.provider";
import { useNotificationContext } from "@/context/notification.provider";
import { StartIndicatorCalculationPathParams } from "@/generated/v3/researchService/researchServiceComponents";
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
  const {
    runAnalysisIndicator,
    dropdownAnalysisOptions,
    loadingVerify,
    analysisToSlug,
    rerunDropdownOptions,
    rerunAnalysisToSlug,
    totalPolygonsForRerun,
    loadingRerunVerify
  } = useMonitoredData(entityType, entityUuid);
  const { openNotification } = useNotificationContext();
  const t = useT();
  const [selectSlug, setSelectSlug] = useState<string | undefined>();
  const [isRerunMode, setIsRerunMode] = useState<boolean>(false);

  const runAnalysis = async () => {
    const indicatorSlugSelected = selectSlug ? indicatorSlugAnalysis : indicatorSlug;
    setLoadingAnalysis?.(true);

    if (isRerunMode) {
      if (totalPolygonsForRerun === 0) {
        setLoadingAnalysis?.(false);
        return openNotification(
          "warning",
          t("Warning"),
          t("No polygons available for rerun. All polygons have complete analysis data.")
        );
      }

      await runAnalysisIndicator({
        slug: indicatorSlugSelected as StartIndicatorCalculationPathParams["slug"],
        body: {
          polygonUuids: rerunAnalysisToSlug[`${indicatorSlugSelected}`] || [],
          forceRecalculation: false,
          updateExisting: true
        }
      });
    } else {
      if (analysisToSlug[`${indicatorSlugSelected}`]?.message) {
        setLoadingAnalysis?.(false);
        return openNotification("warning", t("Warning"), analysisToSlug[`${indicatorSlugSelected}`].message);
      }

      let polygonUuids: string[] = [];

      if (Array.isArray(analysisToSlug[`${indicatorSlugSelected}`])) {
        polygonUuids = analysisToSlug[`${indicatorSlugSelected}`]?.filter((v: string) => typeof v === "string");
      } else if (
        typeof analysisToSlug[`${indicatorSlugSelected}`] === "object" &&
        analysisToSlug[`${indicatorSlugSelected}`] !== null
      ) {
        polygonUuids = Object.values(analysisToSlug[`${indicatorSlugSelected}`]).filter(
          (v): v is string => typeof v === "string"
        );
      }

      await runAnalysisIndicator({
        slug: indicatorSlugSelected as StartIndicatorCalculationPathParams["slug"],
        body: {
          polygonUuids: polygonUuids,
          forceRecalculation: false,
          updateExisting: false
        }
      });
    }

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

        <div className="mb-6 flex flex-col gap-4">
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

          <div className="flex items-center gap-3 rounded-lg border border-neutral-200 bg-neutral-50 p-4">
            <Checkbox
              name="rerunMode"
              checked={isRerunMode}
              onChange={e => {
                setIsRerunMode(e.target.checked);
                setSelectSlug(undefined);
                setIndicatorSlugAnalysis?.("treeCoverLoss");
              }}
              className="flex-shrink-0"
            />
            <div className="flex flex-col gap-1">
              <Text variant="text-14-semibold" className="text-darkCustom">
                {t("Rerun existing analysis")}
              </Text>
              <Text variant="text-12" className="text-neutral-600">
                {isRerunMode
                  ? t("Force rerun analysis for {{count}} polygons (will overwrite existing data)", {
                      count: totalPolygonsForRerun
                    })
                  : t("Run analysis only for polygons that haven't been processed yet")}
              </Text>
            </div>
          </div>

          <When condition={isRerunMode && totalPolygonsForRerun === 0}>
            <div className="border-yellow-200 bg-yellow-50 flex items-center gap-2 rounded-lg border p-3">
              <Icon name={IconNames.EXCLAMATION_CIRCLE_FILL} className="h-5 w-5 text-yellow-600" />
              <Text variant="text-12" className="text-yellow-800">
                {t("All polygons have complete analysis data. No rerun is needed.")}
              </Text>
            </div>
          </When>

          <When condition={!loadingVerify && !loadingRerunVerify}>
            <Dropdown
              placeholder={
                isRerunMode
                  ? rerunDropdownOptions.find(option => option.slug === indicatorSlug)?.title
                  : dropdownAnalysisOptions.find(option => option.slug === indicatorSlug)?.title
              }
              label="Indicator"
              options={isRerunMode ? rerunDropdownOptions : dropdownAnalysisOptions}
              value={
                isRerunMode
                  ? rerunDropdownOptions.find(option => option.slug === (selectSlug ?? indicatorSlug))?.value
                    ? [rerunDropdownOptions.find(option => option.slug === (selectSlug ?? indicatorSlug))?.value!]
                    : []
                  : dropdownAnalysisOptions.find(option => option.slug === (selectSlug ?? indicatorSlug))?.value
                  ? [dropdownAnalysisOptions.find(option => option.slug === (selectSlug ?? indicatorSlug))?.value!]
                  : []
              }
              onChange={e => {
                const options = isRerunMode ? rerunDropdownOptions : dropdownAnalysisOptions;
                const indicator = options.find(option => option.value === e[0])?.slug;
                setIndicatorSlugAnalysis?.(indicator!);
                setSelectSlug(indicator);
              }}
              variant={VARIANT_DROPDOWN_DEFAULT}
              className="!min-h-[44px] !py-[9px]"
              labelClassName="!capitalize !text-darkCustom"
              labelVariant="text-14-light"
            />
          </When>

          <When condition={loadingVerify || loadingRerunVerify}>
            <div className="flex items-center justify-center py-8">
              <InlineLoader loading={true} />
              <Text variant="text-12" className="ml-2 text-neutral-600">
                {t("Loading indicator data...")}
              </Text>
            </div>
          </When>
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
        <Button
          {...primaryButtonProps}
          onClick={runAnalysis}
          disabled={loadingVerify || loadingRerunVerify || (isRerunMode && totalPolygonsForRerun === 0)}
          variant="primary"
        >
          <Text variant="text-14-bold" className="capitalize text-white">
            {isRerunMode ? t("Rerun Analysis") : primaryButtonText}
          </Text>
          <InlineLoader loading={loadingVerify || loadingRerunVerify} />
        </Button>
      </div>
    </ModalBaseWithMonitored>
  );
};

export default ModalRunAnalysis;
