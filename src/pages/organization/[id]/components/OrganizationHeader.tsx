import { Box, Flex, Text } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { FC, useMemo } from "react";
import Twemoji from "react-twemoji";

import { useGadmOptions } from "@/connections/Gadm";
import { useOrganisationMediaByCollection } from "@/connections/Organisation";
import { useOrganisationUserAssociations } from "@/connections/UserAssociation";
import { getOrganisationTypeOptions } from "@/constants/options/organisations";
import { OrganisationFullDto } from "@/generated/v3/userService/userServiceSchemas";
import Button from "@/redesignComponents/actions/Buttons/Button/Button";
import { countryCodeToFlag } from "@/redesignComponents/content/headers/PageHeaders/ProjectHeader/projectHeader.utils";
import { ProfileImage } from "@/redesignComponents/content/Images/ProfileImage/ProfileImage";
import { DownloadIcon, EditIcon } from "@/redesignComponents/foundations/Icons";
import Avatar from "@/redesignComponents/navigation/Avatar/Avatar";
import { formatOptionsList } from "@/utils/options";

export type OrganizationHeaderProps = {
  organization?: OrganisationFullDto;
};

const OrganizationHeader: FC<OrganizationHeaderProps> = ({ organization }) => {
  const t = useT();
  const countryOptions = useGadmOptions({ level: 0 });

  const [, { media: logoMedia }] = useOrganisationMediaByCollection({
    organisationUuid: organization?.uuid ?? "",
    collectionName: "logo"
  });
  const [, { data: approvedUsers }] = useOrganisationUserAssociations({
    organisationUuid: organization?.uuid ?? "",
    status: "approved"
  });

  const teamMembers = useMemo(() => (approvedUsers ?? []).slice(0, 5), [approvedUsers]);
  const country = formatOptionsList(countryOptions ?? [], organization?.hqCountry ? [organization.hqCountry] : []);
  const organizationType = formatOptionsList(getOrganisationTypeOptions(t), organization?.type ?? undefined) ?? "—";

  return (
    <Box
      display="flex"
      gap={4}
      px={6}
      py={5}
      minHeight="13.6875rem"
      justifyContent="space-between"
      background="secondary.neutral"
      className="mobile:flex-col"
    >
      <Flex gap={6} alignItems="flex-start" className="mobile:flex-col">
        <ProfileImage
          size="10.25rem"
          alt={organization?.name ?? t("Organization")}
          src={logoMedia[0]?.url ?? "/images/pitch-placeholder.webp"}
        />

        <Box className="flex max-w-[53.8125rem] flex-col gap-2">
          <Text fontSize="1.875rem" lineHeight="2.25rem" color="primary.900" fontWeight="bold">
            {organization?.name ?? t("Organization")}
          </Text>

          <Flex alignItems="center" gap={2} className="mobile:flex-wrap">
            <Text textStyle="400-bold" color="neutral.900">
              {organizationType}
            </Text>
            <Text color="neutral.500">•</Text>
            <Twemoji options={{ className: "h-4 w-4" }}>{countryCodeToFlag(organization?.hqCountry)}</Twemoji>
            <Text textStyle="300" color="primary.900">
              {country}
            </Text>
          </Flex>

          <Text textStyle="300" color="neutral.900" className="min-h-[3.75rem] max-w-[49.375rem] line-clamp-3">
            {organization?.description ?? t("No organization description available.")}
          </Text>

          <Flex gap={3}>
            <Button variant="secondary" size="small" leftIcon={<EditIcon />}>
              {t("Edit")}
            </Button>
            <Button variant="secondary" size="small" leftIcon={<DownloadIcon />}>
              {t("Download")}
            </Button>
          </Flex>
        </Box>
      </Flex>

      <Box
        width="15rem"
        minWidth="15rem"
        className="flex flex-col self-end pb-1 mobile:!w-full mobile:min-w-0 mobile:self-start"
      >
        <Text color="primary.900" textStyle="300-bold" className="mb-2">
          {t("Team:")}
        </Text>
        <Flex className="flex-wrap pr-3.5">
          {teamMembers.map(member => (
            <Box key={member.uuid} className="relative h-10 w-7">
              <Box className="absolute">
                <Avatar name={member.fullName} ariaLabel={member.fullName} />
              </Box>
            </Box>
          ))}
        </Flex>
      </Box>
    </Box>
  );
};

export default OrganizationHeader;
