import ComentarySection from "../../PolygonReviewTab/components/ComentarySection/ComentarySection";
import Status from "../../PolygonReviewTab/components/PolygonStatus/StatusDisplay ";

const SiteAuditLogProjectStatusSide = () => {
  return (
    <div className="flex flex-col gap-6">
      <Status titleStatus="Project" status="Needs More Info" />
      <ComentarySection />
    </div>
  );
};

export default SiteAuditLogProjectStatusSide;
