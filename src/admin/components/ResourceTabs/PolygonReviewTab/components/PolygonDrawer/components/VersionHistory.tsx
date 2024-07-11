import { useT } from "@transifex/react";

import Button from "@/components/elements/Button/Button";
import Dropdown from "@/components/elements/Inputs/Dropdown/Dropdown";
import useAlertHook from "@/components/elements/MapPolygonPanel/hooks/useAlertHook";
import Icon, { IconNames } from "@/components/extensive/Icon/Icon";
import {
  useGetV2SitePolygonUuidVersions,
  usePostV2SitePolygonUuidNewVersion,
  usePutV2SitePolygonUuidMakeActive
} from "@/generated/apiComponents";
import { SitePolygon, SitePolygonsDataResponse } from "@/generated/apiSchemas";

const VersionHistory = ({
  selectedPolygon,
  setSelectPolygonVersion,
  selectPolygonVersion,
  refreshPolygonList
}: {
  selectedPolygon: SitePolygon;
  setSelectPolygonVersion: any;
  selectPolygonVersion: SitePolygon | undefined;
  refreshPolygonList?: () => void;
}) => {
  const t = useT();
  const { displayNotification } = useAlertHook();
  const { data, refetch } = useGetV2SitePolygonUuidVersions({
    pathParams: { uuid: selectedPolygon?.primary_uuid as string }
  });

  const { mutate: mutateNewVersion, isLoading: isLoadingVersion } = usePostV2SitePolygonUuidNewVersion({
    onSuccess: () => {
      displayNotification("New version created successfully", "success", "Success!");
      refetch();
    },
    onError: () => {
      displayNotification("Error creating new version", "error", "Error!");
    }
  });

  const { mutate: mutateMakeActive, isLoading } = usePutV2SitePolygonUuidMakeActive({
    onSuccess: () => {
      refreshPolygonList?.();
      displayNotification("Polygon version made active successfully", "success", "Success!");
    },
    onError: () => {
      displayNotification("Error making polygon version active", "error", "Error!");
    }
  });
  const clonePolygon = async () => {
    await mutateNewVersion({
      pathParams: { uuid: selectedPolygon.uuid as string }
    });
  };
  const makeActivePolygon = async () => {
    await mutateMakeActive({
      pathParams: { uuid: (selectPolygonVersion?.uuid as string) ?? selectedPolygon.uuid }
    });
  };

  const versionsOptions = (data as SitePolygonsDataResponse)?.map(item => {
    return {
      title: item?.version_name ?? "first version",
      value: item.uuid ?? ""
    };
  });

  return (
    <div className="flex flex-col gap-4">
      {versionsOptions && (
        <Dropdown
          label="Polygon Version"
          suffixLabel={
            <button
              onClick={clonePolygon}
              className="flex items-center justify-center rounded border-2 border-grey-500 bg-grey-500 text-white hover:border-primary hover:bg-white hover:text-primary"
              disabled={isLoadingVersion}
            >
              <Icon name={IconNames.PLUS_PA} className=" h-3 w-3 lg:h-3.5 lg:w-3.5" />
            </button>
          }
          suffixLabelView={true}
          labelClassName="capitalize"
          labelVariant="text-14-light"
          options={versionsOptions ?? []}
          defaultValue={[selectedPolygon?.uuid as string]}
          onChange={e => {
            const polygonVersionData = (data as SitePolygonsDataResponse)?.find(item => item.uuid === e[0]);
            setSelectPolygonVersion(polygonVersionData);
          }}
        />
      )}
      <div className="mt-auto flex items-center justify-end gap-5">
        <Button variant="semi-red" className="w-full">
          {t("Delete")}
        </Button>
        <Button onClick={makeActivePolygon} variant="semi-black" className="w-full" disabled={isLoading}>
          {t("Make Active")}
        </Button>
      </div>
    </div>
  );
};

export default VersionHistory;
