import { Flex, Link, Text } from "@chakra-ui/react";
import DOMPurify from "isomorphic-dompurify";
import { FC, useCallback, useMemo } from "react";

import ModalConfirmation from "@/redesignComponents/containers/Modal/ModalConfirmation";
import { NewTabIcon } from "@/redesignComponents/foundations/Icons";

const BODY_LINK_CSS = {
  "& a": { fontWeight: "bold", textDecoration: "underline" }
};

export interface AnnouncementModalProps {
  title: string;
  /** Translated HTML string; it is sanitized before rendering. */
  body: string;
  primaryCtaLabel: string;
  primaryCtaHref: string;
  secondaryCtaLabel: string;
  dontShowAgainLabel: string;
  onSkip: () => void;
  onPrimaryAction: () => void;
  onDontShowAgain: () => void;
}

const AnnouncementModal: FC<AnnouncementModalProps> = ({
  title,
  body,
  primaryCtaLabel,
  primaryCtaHref,
  secondaryCtaLabel,
  dontShowAgainLabel,
  onSkip,
  onPrimaryAction,
  onDontShowAgain
}) => {
  const sanitizedBody = useMemo(() => DOMPurify.sanitize(body, { ADD_ATTR: ["target"] }), [body]);

  const handleOpenChange = useCallback(
    (open: boolean) => {
      if (!open) onSkip();
    },
    [onSkip]
  );

  return (
    <ModalConfirmation
      open
      onOpenChange={handleOpenChange}
      title={title}
      // contentLayout="custom"
      content={
        <Flex direction="column" gap={5}>
          <Text
            textStyle="400"
            color="neutral.900"
            css={BODY_LINK_CSS}
            dangerouslySetInnerHTML={{ __html: sanitizedBody }}
          />
          <Link
            href={primaryCtaHref}
            target="_blank"
            rel="noopener noreferrer"
            alignSelf="flex-start"
            color="primary.700"
            textDecoration="underline"
            gap={1}
            onClick={onPrimaryAction}
          >
            <Text as="span" textStyle="500-bold">
              {primaryCtaLabel}
            </Text>
            <NewTabIcon boxSize={4} />
          </Link>
        </Flex>
      }
      buttonsSecondary={[
        {
          id: "dont-show-again",
          variant: "borderless",
          className: "flex-1",
          children: dontShowAgainLabel,
          onClick: onDontShowAgain
        },
        { id: "skip", variant: "secondary", className: "flex-1", children: secondaryCtaLabel, onClick: onSkip }
      ]}
    />
  );
};

export default AnnouncementModal;
