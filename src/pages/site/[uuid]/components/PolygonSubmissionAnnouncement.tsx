import { useT } from "@transifex/react";
import WelcomeBanner from "public/images/welcome-banner.webp";
import { FC } from "react";

import { ModalId } from "@/components/extensive/Modal/ModalConst";
import AnnouncementModal from "@/components/extensive/WelcomeTour/AnnouncementModal";
import { useDismissibleAnnouncement } from "@/components/extensive/WelcomeTour/useDismissibleAnnouncement";
import { polygonSubmissionTutorialsLink } from "@/constants/links";

const POLYGON_SUBMISSION_ANNOUNCEMENT_ID = "polygon_submission_announcement";

const PolygonSubmissionAnnouncement: FC = () => {
  const t = useT();

  useDismissibleAnnouncement({
    announcementId: POLYGON_SUBMISSION_ANNOUNCEMENT_ID,
    modalId: ModalId.POLYGON_SUBMISSION_ANNOUNCEMENT,
    renderModal: ({ onSkip, onPrimaryAction, onDontShowAgain }) => (
      <AnnouncementModal
        bannerImage={WelcomeBanner}
        title={t("A new polygon submission experience is here")}
        body={t(
          `We have redesigned the polygon submission interface to give you more tools to manage your data. You can now view and edit polygon attributes in a dedicated table, filter and search your polygon list, submit and run validations in bulk, and much more. <a href="{polygonSubmissionTutorialsLink}" target="_blank" rel="noopener noreferrer">Visit our tutorials page</a> to learn how to make the most of the new experience.<br><br>If you have any questions about your current polygon submission or have any bugs to report, please reach out to <a href="mailto:info@terramatch.org">info@terramatch.org</a>`,
          { polygonSubmissionTutorialsLink }
        )}
        primaryCtaLabel={t("Explore tutorials")}
        secondaryCtaLabel={t("Skip for now")}
        dontShowAgainLabel={t("Don't show this again")}
        onSkip={onSkip}
        onPrimaryAction={() => {
          window.open(polygonSubmissionTutorialsLink, "_blank", "noopener,noreferrer");
          onPrimaryAction();
        }}
        onDontShowAgain={onDontShowAgain}
      />
    )
  });

  return null;
};

export default PolygonSubmissionAnnouncement;
