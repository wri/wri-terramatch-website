import { useT } from "@transifex/react";
import { FC, useMemo } from "react";
import { twMerge as tw } from "tailwind-merge";

import Button from "@/components/elements/Button/Button";
import Text from "@/components/elements/Text/Text";
import Icon, { IconNames } from "@/components/extensive/Icon/Icon";
import { ModalProps } from "@/components/extensive/Modal/Modal";
import { ModalBaseSubmit } from "@/components/extensive/Modal/ModalsBases";
import { useAllSitePolygons } from "@/connections/SitePolygons";

type IdentifiedPolygonItem = {
  id: number | string;
  name: string;
  is_present: boolean;
};

type ModalApproveProps = ModalProps & {
  primaryButtonText?: string;
  secondaryButtonText?: string;
  onClose?: () => void;
  existingUuids: string[];
  siteUuid: string;
  summary?: {
    featuresForVersioning: number;
    featuresForCreation: number;
    totalFeatures: number;
  };
  setSubmitPolygonLoaded?: (value: boolean) => void;
  setSaveFlags?: (value: boolean) => void;
  setPolygonLoaded?: (value: boolean) => void;
};

const ModalIdentified: FC<ModalApproveProps> = ({
  iconProps,
  title,
  content,
  primaryButtonProps,
  primaryButtonText,
  secondaryButtonProps,
  secondaryButtonText,
  existingUuids,
  siteUuid,
  summary,
  setSubmitPolygonLoaded,
  setSaveFlags,
  setPolygonLoaded,
  onClose,
  ...rest
}) => {
  const t = useT();

  const { data: sitePolygonData = [] } = useAllSitePolygons({
    entityName: "sites",
    entityUuid: siteUuid,
    enabled: !!siteUuid
  });

  const transformedPolygons = useMemo<IdentifiedPolygonItem[]>(() => {
    return existingUuids.map(uuid => {
      const polygon = sitePolygonData.find(p => p.uuid === uuid);
      const displayName = polygon != null ? polygon.name ?? polygon.versionName ?? t("Unnamed Polygon") : uuid;
      return {
        id: polygon?.uuid ?? uuid,
        name: displayName,
        is_present: polygon != null
      };
    });
  }, [existingUuids, sitePolygonData, t]);

  return (
    <ModalBaseSubmit {...rest}>
      <header className="flex w-full items-center justify-between border-b border-b-neutral-200 px-8 py-5">
        <Icon name={IconNames.WRI_LOGO} width={108} height={30} className="min-w-[108px]" />
      </header>
      <div className="max-h-[100%] w-full overflow-auto px-8 py-8">
        {iconProps != null && (
          <Icon
            {...iconProps}
            width={iconProps.width ?? 40}
            className={tw("mb-8", iconProps.className)}
            style={{ minHeight: iconProps.height ?? iconProps.width ?? 40 }}
          />
        )}
        <div className="flex items-center justify-between">
          <Text variant="text-24-bold">{title}</Text>
        </div>
        {content != null && (
          <Text as="div" variant="text-12-light" className="mt-1 mb-4" containHtml>
            {content}
          </Text>
        )}
        {summary != null && (
          <div className="mb-4 rounded-lg border border-grey-750 bg-neutral-50 px-4 py-3">
            <div className="flex flex-col gap-1">
              {summary.featuresForVersioning > 0 && (
                <Text variant="text-12-light">
                  {t("Features that will create new versions")}: <strong>{summary.featuresForVersioning}</strong>
                </Text>
              )}
              {summary.featuresForCreation > 0 && (
                <Text variant="text-12-light">
                  {t("Features that will create new polygons")}: <strong>{summary.featuresForCreation}</strong>
                </Text>
              )}
              <Text variant="text-12-light" className="mt-1">
                {t("Total features in file")}: <strong>{summary?.totalFeatures ?? 0}</strong>
              </Text>
            </div>
          </div>
        )}
        <div className="mb-6 flex flex-col rounded-lg border border-grey-750">
          <header className="flex items-center border-b border-grey-750 bg-neutral-150 px-4 py-2">
            <Text variant="text-12" className="flex-[2]">
              {t("Name")}
            </Text>
            <Text variant="text-12" className="flex flex-1 items-center justify-start">
              {t("Identified")}
            </Text>
          </header>
          {transformedPolygons.map((item, index) => (
            <div key={item.id ?? index} className="flex items-center border-b border-grey-750 px-4 py-2 last:border-0">
              <Text variant="text-12" className="flex-[2]">
                {item.name}
              </Text>
              <div className="flex flex-1 items-center justify-center">
                <div className="flex w-full items-center justify-start gap-2">
                  {item.is_present ? (
                    <>
                      <div className="h-4 w-4">
                        <Icon name={IconNames.ROUND_GREEN_TICK} width={16} height={16} className="text-green-500" />
                      </div>
                      <Text variant="text-10-light">{"Confirmed"}</Text>
                    </>
                  ) : (
                    <>
                      <div className="h-4 w-4">
                        <Icon name={IconNames.ROUND_RED_CROSS} width={16} height={16} className="text-red-500" />
                      </div>
                      <Text variant="text-10-light">{"Unknown Issue. Try Again."}</Text>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex w-full justify-end gap-3 px-8 py-4">
        {secondaryButtonProps != null && (
          <Button {...secondaryButtonProps} variant="white-page-admin">
            <Text variant="text-14-bold" className="capitalize">
              {secondaryButtonText}
            </Text>
          </Button>
        )}
        <Button {...primaryButtonProps}>
          <Text variant="text-14-bold" className="capitalize text-white">
            {primaryButtonText}
          </Text>
        </Button>
      </div>
    </ModalBaseSubmit>
  );
};

export default ModalIdentified;
