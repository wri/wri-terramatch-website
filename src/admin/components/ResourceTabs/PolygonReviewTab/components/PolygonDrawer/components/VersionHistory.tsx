import { useT } from "@transifex/react";

import Button from "@/components/elements/Button/Button";
import Dropdown from "@/components/elements/Inputs/Dropdown/Dropdown";
import { useGetV2SitePolygonUuidVersions } from "@/generated/apiComponents";
import { SitePolygonResponse } from "@/generated/apiSchemas";

const VersionHistory = ({ polygonUUID }: { polygonUUID: string }) => {
  const t = useT();
  const { data } = useGetV2SitePolygonUuidVersions({
    pathParams: { uuid: polygonUUID }
  });

  const versionsOptions = data?.map((item: SitePolygonResponse) => {
    return {
      title: item?.poly_name,
      value: item?.uuid
    };
  });
  console.log("test", data);
  console.log("test", polygonUUID);
  console.log("test", versionsOptions);
  return (
    <div className="flex flex-col gap-4">
      <Dropdown
        label="Polygon Version"
        labelClassName="capitalize"
        labelVariant="text-14-light"
        options={versionsOptions ?? []}
        defaultValue={[polygonUUID]}
        onChange={() => {}}
      />
      <div className="mt-auto flex items-center justify-end gap-5">
        <Button variant="semi-red" className="w-full">
          {t("Delete")}
        </Button>
        <Button variant="semi-black" className="w-full">
          {t("Make Active")}
        </Button>
      </div>
    </div>
  );
};

export default VersionHistory;
