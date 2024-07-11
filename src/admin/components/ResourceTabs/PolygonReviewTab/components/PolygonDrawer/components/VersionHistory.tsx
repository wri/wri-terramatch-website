import { useT } from "@transifex/react";

import Button from "@/components/elements/Button/Button";
import Dropdown from "@/components/elements/Inputs/Dropdown/Dropdown";
import Icon, { IconNames } from "@/components/extensive/Icon/Icon";
import {
  fetchPostV2SitePolygonUuidNewVersion,
  fetchPutV2SitePolygonUuidMakeActive,
  useGetV2SitePolygonUuidVersions
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
  const { data, refetch } = useGetV2SitePolygonUuidVersions({
    pathParams: { uuid: selectedPolygon?.primary_uuid as string }
  });

  const mutateNewVersion = fetchPostV2SitePolygonUuidNewVersion;
  const mutateMakeActive = fetchPutV2SitePolygonUuidMakeActive;
  const clonePolygon = async () => {
    try {
      const response = await mutateNewVersion({
        pathParams: { uuid: selectedPolygon.uuid as string }
      });
      refetch();
      console.log("Response:", response);
    } catch (err) {
      console.error("Error:", err);
    }
  };
  const makeActivePolygon = async () => {
    try {
      const response = await mutateMakeActive({
        pathParams: { uuid: (selectPolygonVersion?.uuid as string) ?? selectedPolygon.uuid }
      });
      refreshPolygonList?.();
      console.log("Response:", response);
    } catch (err) {
      console.error("Error:", err);
    }
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
        <Button onClick={makeActivePolygon} variant="semi-black" className="w-full">
          {t("Make Active")}
        </Button>
      </div>
    </div>
  );
};

export default VersionHistory;
