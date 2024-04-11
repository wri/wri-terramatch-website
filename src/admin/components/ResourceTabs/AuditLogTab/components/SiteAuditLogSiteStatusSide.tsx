import Button from "@/components/elements/Button/Button";
import Text from "@/components/elements/Text/Text";

import ComentarySection from "../../PolygonReviewTab/components/ComentarySection/ComentarySection";

const SiteAuditLogSiteStatusSide = () => {
  return (
    <div>
      <Text variant="text-16-bold" className="mb-4">
        Site Status
      </Text>
      <Button disabled className="mb-6">
        <Text variant="text-12-bold" className="text-white">
          NOT APPLICABLE
        </Text>
      </Button>
      <ComentarySection />
    </div>
  );
};

export default SiteAuditLogSiteStatusSide;
