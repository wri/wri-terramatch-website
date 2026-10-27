import { Flex, Link, Text } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { FC, useMemo, useState } from "react";

import { zendeskSupportLink } from "@/constants/links";
import Button from "@/redesignComponents/actions/Buttons/Button/Button";
import Modal from "@/redesignComponents/containers/Modal/Modal";
import { NewTabIcon } from "@/redesignComponents/foundations/Icons";
import CarouselNavigation from "@/redesignComponents/navigation/CarouselNavigation/CarouselNavigation";

const MODAL_HEIGHT = "min(45rem, 80vh)";

const VIDEO_CONTAINER_CSS = {
  containerType: "size",
  "@container (max-height: 7.5rem)": { "& > video": { display: "none" } }
};

type WhatsNewUpdate = {
  media: string;
  title: string;
  description: string;
  link?: { label: string; href: string };
};

const useWhatsNewUpdates = (): WhatsNewUpdate[] => {
  const t = useT();
  return useMemo(
    () => [
      {
        media: "/images/whats-new/side-navigation.mp4",
        title: t("A clear side navigation"),
        description: t(
          "Open the panel with the arrow at the top of the left-hand menu to see every section by name: Dashboard, Organizations, Projects, Sites, Nurseries and Reports."
        )
      },
      {
        media: "/images/whats-new/progress-reports.mp4",
        title: t("Progress reports are now easier to find"),
        description: t(
          "Progress Report is now the first tab on the Reports page. Reports are grouped by reporting period, with status badges showing what is overdue or needs your attention, so you can find and finish them faster."
        )
      },
      {
        media: "/images/whats-new/additional-reports.mp4",
        title: t("A dedicated tab for additional reports"),
        description: t(
          "Financial reports and disturbance reports for TerraFund projects, and SRP reports for PPC projects, now live in a dedicated Additional Reports tab on the Reports page. Open the tab to see them grouped by report type, with due dates and status badges so you can spot what needs your attention."
        )
      },
      {
        media: "/images/whats-new/project-page.mp4",
        title: t("A new in-project experience"),
        description: t(
          "Your project profile now includes Sites and Nurseries tabs (PPC projects do not have a Nurseries tab), so you can open any site or nursery profile without leaving the project. Each profile has its own Reports tab, where you'll find that site's or nursery's reports."
        )
      },
      {
        media: "/images/whats-new/filters.mp4",
        title: t("Apply filters to find what you need easily"),
        description: t(
          "You can use the filters to narrow reports by type, status or reporting period, so you can quickly find what you need."
        ),
        link: { label: t("Learn more"), href: zendeskSupportLink }
      }
    ],
    [t]
  );
};

interface WhatsNewModalProps {
  onSkip: () => void;
  onFinish: () => void;
}

const WhatsNewModal: FC<WhatsNewModalProps> = ({ onSkip, onFinish }) => {
  const t = useT();
  const updates = useWhatsNewUpdates();
  const [current, setCurrent] = useState(0);
  const { media, title, description, link } = updates[current];
  const isLast = current === updates.length - 1;

  return (
    <Modal
      open
      onClose={onSkip}
      width="40rem"
      height={MODAL_HEIGHT}
      contentPadding={false}
      header={
        <Text textStyle="400-bold" color="neutral.800">
          {t("What’s new in TerraMatch")}
        </Text>
      }
      content={
        <Flex direction="column" gap={5} h="full" px={6} py={5} bg="primary.100">
          <Flex flex={1} minH={0} align="center" justify="center" css={VIDEO_CONTAINER_CSS}>
            <video
              key={media}
              src={media}
              aria-label={title}
              className="max-h-full max-w-full rounded-lg border border-theme-neutral-300"
              autoPlay
              loop
              muted
              playsInline
            />
          </Flex>
          <Flex direction="column" align="flex-start" gap={2} minH="8.5rem" flexShrink={0}>
            <Text as="h2" textStyle="700-bold" color="neutral.800">
              {title}
            </Text>
            <Text textStyle="400" color="neutral.700">
              {description}
            </Text>
            {link != null ? (
              <Link
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                color="primary.700"
                textDecoration="underline"
                gap={1}
              >
                <Text as="span" textStyle="500-bold">
                  {link.label}
                </Text>
                <NewTabIcon boxSize={4} />
              </Link>
            ) : null}
          </Flex>
        </Flex>
      }
      footer={
        <Flex direction="column" w="full">
          <Flex justify="center" py={4}>
            <CarouselNavigation total={updates.length} current={current} onChange={setCurrent} />
          </Flex>
          <Flex justify="flex-end" px={6} py={3}>
            {isLast ? (
              <Button onClick={onFinish}>{t("Got it")}</Button>
            ) : (
              <Button variant="secondary" onClick={onSkip}>
                {t("Skip")}
              </Button>
            )}
          </Flex>
        </Flex>
      }
    />
  );
};

export default WhatsNewModal;
