import ComentarySection from "../../PolygonReviewTab/components/ComentarySection/ComentarySection";
import PolygonStatus from "../../PolygonReviewTab/components/PolygonStatus/PolygonStatus";
import SelectPolygon from "../../PolygonReviewTab/components/SelectPolygon/SelectPolygon";

const SiteAuditLogPolygonStatusSide = () => {
  return (
    <div className="flex flex-col gap-6">
      <SelectPolygon />
      <PolygonStatus />
      <ComentarySection />
    </div>
  );
};

export default SiteAuditLogPolygonStatusSide;
