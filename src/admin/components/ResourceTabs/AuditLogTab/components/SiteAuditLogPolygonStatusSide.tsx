import Dropdown from "@/components/elements/Inputs/Dropdown/Dropdown";

import ComentarySection from "../../PolygonReviewTab/components/ComentarySection/ComentarySection";
import StatusDisplay from "../../PolygonReviewTab/components/PolygonStatus/StatusDisplay ";

const SiteAuditLogPolygonStatusSide = ({
  polygonList,
  selectedPolygon,
  setSelectedPolygon
}: {
  polygonList: any[];
  selectedPolygon: any;
  setSelectedPolygon: any;
}) => {
  return (
    <div className="flex flex-col gap-6">
      <Dropdown
        label="Select Polygon"
        labelVariant="text-16-bold"
        labelClassName="capitalize"
        optionsClassName="max-w-full"
        defaultValue={[selectedPolygon]}
        placeholder={selectedPolygon?.name ?? "Select Polygon"}
        options={polygonList}
        onChange={e => {
          console.log("onChange", e);
          setSelectedPolygon(e);
        }}
      />
      <StatusDisplay status={selectedPolygon?.meta} />
      <ComentarySection />
    </div>
  );
};

export default SiteAuditLogPolygonStatusSide;
