import { Box, Flex, Text } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import classNames from "classnames";
import { FC, useCallback } from "react";
import Twemoji from "react-twemoji";

import { resolveRemSizeValue } from "@/lib/sizing";
import Button from "@/redesignComponents/actions/Buttons/Button/Button";
import { ProfileImage } from "@/redesignComponents/content/Images/ProfileImage/ProfileImage";
import { DownloadIcon, EditIcon, LinkIcon } from "@/redesignComponents/foundations/Icons";
import EllipsisDivider from "@/redesignComponents/miscellaneous/Dividers/EllipsisDivider";

import TeamSection, { TeamMember } from "../components/TeamSection";
import { countryCodeToFlag } from "../ProjectHeader/projectHeader.utils";

const LOGO_SIZE = 20;
const LOGO_SIZE_REM = resolveRemSizeValue(LOGO_SIZE);

export interface OrganisationHeaderProps {
  name: string;
  logoSrc?: string;
  organisationType?: string;
  country?: string;
  countryCode?: string;
  foundedYear?: string;
  websiteUrl?: string;
  team?: TeamMember[];
  isDownloadDisabled?: boolean;
  onLogoClick: () => void;
  onEditClick: () => void;
  onDownloadClick: () => void;
  onAddTeamClick: () => void;
  gotoTeamMembers: () => void;
}

const OrganisationHeader: FC<OrganisationHeaderProps> = ({
  name,
  logoSrc,
  organisationType,
  country,
  countryCode,
  foundedYear,
  websiteUrl,
  team,
  isDownloadDisabled = false,
  onLogoClick,
  onEditClick,
  onDownloadClick,
  onAddTeamClick,
  gotoTeamMembers
}) => {
  const t = useT();

  const handleWebsiteClick = useCallback(() => {
    if (websiteUrl != null) window.open(websiteUrl, "_blank", "noopener,noreferrer");
  }, [websiteUrl]);

  return (
    <Flex
      gap={2}
      paddingX={6}
      paddingY={5}
      justifyContent="space-between"
      background="primary.100"
      className="items-center mobile:flex-col mobile:items-start"
    >
      <Flex gap={6} alignItems="flex-start">
        {logoSrc == null ? (
          <Flex
            width={LOGO_SIZE_REM}
            height={LOGO_SIZE_REM}
            flexShrink={0}
            alignItems="center"
            justifyContent="center"
            borderRadius="full"
            borderWidth="0.0625rem"
            borderColor="neutral.300"
            background="neutral.200"
          >
            <Button variant="borderless" size="small" onClick={onLogoClick}>
              {t("Add logo")}
            </Button>
          </Flex>
        ) : (
          <ProfileImage
            size={LOGO_SIZE}
            src={logoSrc}
            alt={name}
            onClickEdit={onLogoClick}
            className="!border-0 bg-theme-neutral-100"
          />
        )}

        <Flex flexDirection="column" gap={2}>
          <Text as="h1" textStyle="800-bold" color="primary.900">
            {name}
          </Text>

          <Flex flexDirection="column" gap={1}>
            <Flex gap={2} alignItems="center" flexWrap="wrap" paddingBottom="0.125rem">
              <Text textStyle="300" color={organisationType == null ? "neutral.700" : "primary.900"}>
                {organisationType ?? t("Organisation Type")}
              </Text>
              <EllipsisDivider />
              <Flex gap={1} alignItems="center">
                {countryCode != null && (
                  <Twemoji options={{ className: "h-4 w-4" }}>{countryCodeToFlag(countryCode)}</Twemoji>
                )}
                <Text textStyle="300" color={country == null ? "neutral.700" : "primary.900"}>
                  {country ?? t("Country")}
                </Text>
              </Flex>
              <EllipsisDivider />
              <Flex gap={1} alignItems="center">
                <Text textStyle="300" color="neutral.700">
                  {t("Founded:")}
                </Text>
                <Text textStyle="300-bold" color="primary.900">
                  {foundedYear ?? t("YYYY")}
                </Text>
              </Flex>
            </Flex>

            <Flex gap={2} alignItems="center" paddingBottom={1}>
              <LinkIcon boxSize={4} color={websiteUrl == null ? "neutral.500" : "neutral.700"} />
              <Button
                variant="borderless"
                disabled={websiteUrl == null}
                onClick={handleWebsiteClick}
                className="!h-6 !px-0 !py-1"
              >
                {t("Website link")}
              </Button>
            </Flex>
          </Flex>

          <Flex gap={3} alignItems="center">
            <Button variant="secondary" size="small" leftIcon={<EditIcon />} onClick={onEditClick}>
              {t("Edit Information")}
            </Button>
            <Button
              variant="secondary"
              size="small"
              leftIcon={<DownloadIcon />}
              disabled={isDownloadDisabled}
              onClick={onDownloadClick}
              className={classNames({ "!shadow-none": isDownloadDisabled })}
            >
              {t("Download")}
            </Button>
          </Flex>
        </Flex>
      </Flex>

      <Box alignSelf="stretch" className="flex items-end mobile:w-full">
        <TeamSection team={team} onAddTeamClick={onAddTeamClick} gotoTeamMembers={gotoTeamMembers} />
      </Box>
    </Flex>
  );
};

export default OrganisationHeader;
