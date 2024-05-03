import Dropdown from "@/components/elements/Inputs/Dropdown/Dropdown";
import { toArray } from "@/utils/array";

import ComentarySection from "../../PolygonReviewTab/components/ComentarySection/ComentarySection";
import { dropdownPolygonOptions } from "../../PolygonReviewTab/components/mockedData";
import StatusDisplay from "../../PolygonReviewTab/components/PolygonStatus/StatusDisplay ";

const SiteAuditLogPolygonStatusSide = () => {
  return (
    <div className="flex flex-col gap-6">
      <Dropdown
        label="Select Polygon"
        labelVariant="text-16-bold"
        labelClassName="capitalize"
        optionsClassName="max-w-full"
        defaultValue={toArray(dropdownPolygonOptions[0].value)}
        placeholder="Select Polygon"
        options={dropdownPolygonOptions}
        onChange={() => {}}
      />
      <StatusDisplay status="Approved" />
      <ComentarySection />
    </div>
  );
};

export default SiteAuditLogPolygonStatusSide;
