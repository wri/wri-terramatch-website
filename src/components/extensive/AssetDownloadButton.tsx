import { useT } from "@transifex/react";
import { FC, useCallback, useState } from "react";

import Button from "@/components/elements/Button/Button";
import { ToastType, useToastContext } from "@/context/toast.provider";
import { entityAssetGet } from "@/generated/v3/entityService/entityServiceComponents";
import Log from "@/utils/log";

import Icon, { IconNames } from "./Icon/Icon";

export const ASSET_DOWNLOAD_ENTITIES = ["projects", "sites", "nurseries"] as const;
export type AssetDownloadEntity = (typeof ASSET_DOWNLOAD_ENTITIES)[number];

type AssetDownloadButtonProps = {
  entity: AssetDownloadEntity;
  uuid: string;
  className?: string;
};

const AssetDownloadButton: FC<AssetDownloadButtonProps> = ({ entity, uuid, className }) => {
  const t = useT();
  const [isGenerating, setIsGenerating] = useState(false);
  const { openToast } = useToastContext();
  const downloadAssets = useCallback(async () => {
    try {
      setIsGenerating(true);
      await entityAssetGet.downloadFile({ pathParams: { entity, uuid } });
    } catch (err) {
      Log.error("Error downloading assets", err);
      openToast("Asset generation failed", ToastType.ERROR);
    } finally {
      setIsGenerating(false);
    }
  }, [entity, openToast, uuid]);

  return (
    <Button className={className} disabled={isGenerating} variant="secondary-blue" onClick={downloadAssets}>
      {isGenerating && <Icon className="mr-2 inline" name={IconNames.SPINNER} width={14} height={14} />}
      {t("Download Asset .zip")}
    </Button>
  );
};

export default AssetDownloadButton;
