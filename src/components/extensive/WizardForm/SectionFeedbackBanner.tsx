import { useT } from "@transifex/react";
import { FC, useEffect, useRef } from "react";

import InlineMessage from "@/redesignComponents/status/InlineMessage/InlineMessage";

type SectionFeedbackBannerProps = {
  sectionName: string;
  feedback?: string | null;
  isVisible: boolean;
  onDisplayed: (sectionName: string) => void;
};

const SectionFeedbackBanner: FC<SectionFeedbackBannerProps> = ({ sectionName, feedback, isVisible, onDisplayed }) => {
  const t = useT();
  const lastTrackedSection = useRef<string | null>(null);

  useEffect(() => {
    if (!isVisible || sectionName === "") return;
    if (lastTrackedSection.current === sectionName) return;

    lastTrackedSection.current = sectionName;
    onDisplayed(sectionName);
  }, [isVisible, onDisplayed, sectionName]);

  if (!isVisible) return null;

  return (
    <div className="mb-6 px-14">
      <InlineMessage
        size="full-width"
        label={t("Feedback from Reviewer")}
        caption={
          feedback != null && feedback.trim().length > 0
            ? feedback
            : t("Please update the highlighted fields based on the reviewer feedback.")
        }
        variant="warning"
      />
    </div>
  );
};

export default SectionFeedbackBanner;
