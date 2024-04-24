import ComentarySection from "../../PolygonReviewTab/components/ComentarySection/ComentarySection";
import StatusDisplay from "../../PolygonReviewTab/components/PolygonStatus/StatusDisplay ";

const SiteAuditLogSiteStatusSide = () => {
  return (
    <div className="flex flex-col gap-6">
      <StatusDisplay titleStatus="Site" />
      {/*for inactive?*/}
      {/* <Button disabled className="mb-6">
        <Text variant="text-12-bold" className="text-white">
          NOT APPLICABLE
        </Text>
      </Button> */}
      <ComentarySection />
    </div>
  );
};

export default SiteAuditLogSiteStatusSide;
