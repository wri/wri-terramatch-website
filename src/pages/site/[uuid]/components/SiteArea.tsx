import { useT } from "@transifex/react";
import { Dispatch, SetStateAction } from "react";
import { When } from "react-if";

import Button from "@/components/elements/Button/Button";
import OverviewMapArea from "@/components/elements/Map-mapbox/components/OverviewMapArea";
import Text from "@/components/elements/Text/Text";
import Icon, { IconNames } from "@/components/extensive/Icon/Icon";
import { useMapAreaContext } from "@/context/mapArea.provider";
import { useNotificationContext } from "@/context/notification.provider";
import { useGetV2SitePolygonUuidVersions, usePutV2SitePolygonUuidMakeActive } from "@/generated/apiComponents";
import { SitePolygonsDataResponse } from "@/generated/apiSchemas";
import { useValueChanged } from "@/hooks/useValueChanged";

interface SiteAreaProps {
  sites: any;
  editPolygon: boolean;
  setEditPolygon: Dispatch<SetStateAction<boolean>>;
  refetch?: () => void;
}

const SiteArea = ({ sites, refetch }: SiteAreaProps) => {
  const t = useT();
  const {
    selectedPolyVersion,
    setOpenModalConfirmation,
    openModalConfirmation,
    editPolygon: polygon,
    previewVersion,
    setPreviewVersion,
    setEditPolygon,
    setSelectedPolyVersion,
    shouldRefetchPolygonVersions
  } = useMapAreaContext();
  const { openNotification } = useNotificationContext();

  const { mutate: mutateMakeActive } = usePutV2SitePolygonUuidMakeActive({
    onSuccess: async () => {
      openNotification("success", t("Success!"), t("Polygon version made active successfully"));
      await refetchPolygonVersions();
      setSelectedPolyVersion({});
      setPreviewVersion(false);
      setOpenModalConfirmation(false);
      setEditPolygon?.({
        isOpen: true,
        uuid: selectedPolyVersion?.poly_id as string,
        primary_uuid: selectedPolyVersion?.primary_uuid
      });
    },
    onError: () => {
      openNotification("error", t("Error!"), t("Error making polygon version active"));
    }
  });

  const { data: polygonVersions, refetch: refetchPolygonVersions } = useGetV2SitePolygonUuidVersions(
    {
      pathParams: { uuid: polygon?.primary_uuid as string }
    },
    {
      enabled: !!polygon?.primary_uuid
    }
  );

  const makeActivePolygon = async () => {
    const versionActive = (polygonVersions as SitePolygonsDataResponse)?.find(
      item => item?.uuid == selectedPolyVersion?.uuid
    );
    if (!versionActive?.is_active) {
      await mutateMakeActive({
        pathParams: { uuid: selectedPolyVersion?.uuid as string }
      });
      await refetchPolygonVersions();
      return;
    }
    openNotification("warning", t("Warning!"), t("Polygon version is already active"));
  };

  useValueChanged(shouldRefetchPolygonVersions, () => {
    if (shouldRefetchPolygonVersions) {
      refetchPolygonVersions();
    }
  });

  const convertText = (text: string) => {
    return text?.replace(/-/g, " ");
  };

  return (
    <div className="flex h-[500px] rounded-lg text-darkCustom wide:h-[700px]">
      <div className="relative h-auto w-auto">
        <When condition={!!selectedPolyVersion && openModalConfirmation}>
          <div className="absolute top-5 left-[43vw] z-20 text-center">
            <Button variant="primary" className="" onClick={makeActivePolygon}>
              {t("Confirm Version")}
            </Button>
            <br />
            <Button
              variant="text"
              className="text-12-bold m-auto rounded-lg bg-[#a2a295b5] px-4 py-1 text-black underline underline-offset-2 hover:text-white"
              onClick={() => {
                setOpenModalConfirmation(false);
                setEditPolygon?.({ isOpen: false, uuid: "", primary_uuid: "" });
                setSelectedPolyVersion({});
                setPreviewVersion(false);
                refetch?.();
              }}
            >
              {t("Cancel")}
            </Button>
          </div>
        </When>
        <When condition={!!previewVersion}>
          <div className="absolute bottom-8 left-[54vw] z-20 w-[22vw] rounded bg-white p-3">
            <button className="absolute top-3 right-4 hover:opacity-60" onClick={() => setPreviewVersion?.(false)}>
              <Icon name={IconNames.CLEAR} className="h-3 w-3 wide:h-4 wide:w-4" />
            </button>
            <Text variant="text-10-bold" className="mb-4 text-center">
              {t("Preview Attributes")}
            </Text>
            <div className="grid grid-cols-2 gap-4 border-b border-grey-750 py-2">
              <Text variant="text-10-light" className="opacity-60">
                {t("Polygon Name")}
              </Text>
              <Text variant="text-10-light" className="capitalize">
                {convertText(selectedPolyVersion?.poly_name as string) ?? "-"}
              </Text>
            </div>
            <div className="grid grid-cols-2 gap-4 border-b border-grey-750 py-2">
              <Text variant="text-10-light" className="opacity-60">
                {t("Restoration Practice")}
              </Text>
              <Text variant="text-10-light" className="capitalize">
                {convertText(selectedPolyVersion?.practice as string) ?? "-"}
              </Text>
            </div>
            <div className="grid grid-cols-2 gap-4 border-b border-grey-750 py-2">
              <Text variant="text-10-light" className="opacity-60">
                {t("Target Land Use System")}
              </Text>
              <Text variant="text-10-light" className="capitalize">
                {convertText(selectedPolyVersion?.target_sys as string) ?? "-"}
              </Text>
            </div>
            <div className="grid grid-cols-2 gap-4 border-b border-grey-750 py-2">
              <Text variant="text-10-light" className="opacity-60">
                {t("Tree Distribution")}
              </Text>
              <Text variant="text-10-light" className="capitalize">
                {convertText(selectedPolyVersion?.distr as string) ?? "-"}
              </Text>
            </div>
            <div className="grid grid-cols-2 gap-4 border-b border-grey-750 py-2">
              <Text variant="text-10-light" className="opacity-60">
                {t("Source")}
              </Text>
              <Text variant="text-10-light" className="capitalize">
                {selectedPolyVersion?.source == "terramatch" ? "TerraMatch" : selectedPolyVersion?.source ?? "-"}
              </Text>
            </div>
          </div>
        </When>
      </div>
      <OverviewMapArea
        entityModel={sites}
        type="sites"
        refetch={refetch}
        polygonVersionData={polygonVersions as SitePolygonsDataResponse}
        refetchPolygonVersions={refetchPolygonVersions}
      />
    </div>
  );
};

export default SiteArea;
