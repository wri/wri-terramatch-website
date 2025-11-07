import { When } from "react-if";

import { ModalId } from "@/components/extensive/Modal/ModalConst";
import ModalFixOverlaps from "@/components/extensive/Modal/ModalFixOverlaps";
import { useMapAreaContext } from "@/context/mapArea.provider";
import { useModalContext } from "@/context/modal.provider";

import { FixPolygonButton } from "./CheckPolygonControl/components/FixPolygonButton";
import { PolygonChecksPanel } from "./CheckPolygonControl/components/PolygonChecksPanel";
import { ValidationButton } from "./CheckPolygonControl/components/ValidationButton";
import { usePolygonFixability } from "./CheckPolygonControl/hooks/usePolygonFixability";
import { usePolygonFixing } from "./CheckPolygonControl/hooks/usePolygonFixing";
import { useSiteValidation } from "./CheckPolygonControl/hooks/useSiteValidation";

export interface CheckSitePolygonProps {
  siteRecord?: {
    uuid: string;
  };
  polygonCheck: boolean;
  setIsLoadingDelayedJob?: (isLoading: boolean) => void;
  isLoadingDelayedJob?: boolean;
  setAlertTitle?: (value: string) => void;
}

const CheckPolygonControl = (props: CheckSitePolygonProps) => {
  const { siteRecord, polygonCheck, setIsLoadingDelayedJob, isLoadingDelayedJob, setAlertTitle } = props;
  const siteUuid = siteRecord?.uuid;
  const { setSelectedPolygonsInCheckbox } = useMapAreaContext();
  const { openModal, closeModal } = useModalContext();

  const { overlapValidations, setClickedValidation } = useSiteValidation({
    siteUuid,
    setIsLoadingDelayedJob,
    setAlertTitle
  });

  const { hasOverlaps, fixabilityResult, getFixabilityMessage } = usePolygonFixability(overlapValidations);

  const { runFixPolygonOverlaps } = usePolygonFixing({
    siteUuid,
    setIsLoadingDelayedJob,
    setAlertTitle
  });

  const openFormModalHandlerSubmitPolygon = () => {
    openModal(
      ModalId.FIX_POLYGONS,
      <ModalFixOverlaps
        title="Fix Polygons"
        site={siteRecord}
        onClose={() => closeModal(ModalId.FIX_POLYGONS)}
        content="The following polygons have one or more failed criteria, for which an automated solution may be applied. Click 'Fix Polygons' to correct the issue as a new version."
        primaryButtonText="Fix Polygons"
        primaryButtonProps={{
          className: "px-8 py-3",
          variant: "primary",
          onClick: runFixPolygonOverlaps
        }}
        secondaryButtonText="Cancel"
        secondaryButtonProps={{
          className: "px-8 py-3",
          variant: "white-page-admin",
          onClick: () => closeModal(ModalId.FIX_POLYGONS)
        }}
      />
    );
  };

  return (
    <div className="grid gap-2">
      <div className="rounded-lg bg-[#ffffff26] p-3 text-center text-white backdrop-blur-md">
        <ValidationButton
          polygonCheck={polygonCheck}
          isLoadingDelayedJob={isLoadingDelayedJob}
          onClick={() => {
            setClickedValidation(true);
            setSelectedPolygonsInCheckbox([]);
          }}
        />
        {hasOverlaps && (
          <FixPolygonButton
            isLoadingDelayedJob={isLoadingDelayedJob}
            canFixAny={fixabilityResult.canFixAny}
            fixableCount={fixabilityResult.fixableCount}
            totalCount={fixabilityResult.totalCount}
            onClick={openFormModalHandlerSubmitPolygon}
          />
        )}
      </div>
      <When condition={polygonCheck}>
        <PolygonChecksPanel
          hasOverlaps={hasOverlaps}
          canFixAny={fixabilityResult.canFixAny}
          fixableCount={fixabilityResult.fixableCount}
          totalCount={fixabilityResult.totalCount}
          getFixabilityMessage={getFixabilityMessage}
        />
      </When>
    </div>
  );
};

export default CheckPolygonControl;
