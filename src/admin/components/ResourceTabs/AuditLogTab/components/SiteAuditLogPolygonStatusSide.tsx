import Dropdown from "@/components/elements/Inputs/Dropdown/Dropdown";
import { fetchPutV2AdminSitePolygonUUID } from "@/generated/apiComponents";

import ComentarySection from "../../PolygonReviewTab/components/ComentarySection/ComentarySection";
import StatusDisplay from "../../PolygonReviewTab/components/PolygonStatus/StatusDisplay ";

const SiteAuditLogPolygonStatusSide = ({
  refresh,
  record,
  polygonList,
  selectedPolygon,
  setSelectedPolygon
}: {
  refresh?: any;
  record?: any;
  polygonList?: any[];
  selectedPolygon?: any;
  setSelectedPolygon?: any;
}) => {
  const mutate = fetchPutV2AdminSitePolygonUUID;
  return (
    <div className="flex flex-col gap-6">
      <Dropdown
        label="Select Polygon"
        labelVariant="text-16-bold"
        labelClassName="capitalize"
        optionsClassName="max-w-full"
        defaultValue={[selectedPolygon]}
        placeholder={selectedPolygon?.title ?? "Select Polygon"}
        options={polygonList!}
        onChange={e => {
          console.log("onChange", e);
          setSelectedPolygon(polygonList?.find(item => item.value === e[0]));
        }}
      />
      <StatusDisplay
        titleStatus={"Polygon"}
        name={selectedPolygon?.title}
        refresh={refresh}
        mutate={mutate}
        status={selectedPolygon?.meta}
        record={record}
      />
      <ComentarySection />
    </div>
  );
};

export default SiteAuditLogPolygonStatusSide;
