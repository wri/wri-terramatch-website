import { Box, Flex, Text } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { FC, ReactNode } from "react";

import { SiteFullDto } from "@/generated/v3/entityService/entityServiceSchemas";

const MOCK_TAB_KEYS = ["Overview", "Site Details", "Polygons", "Gallery", "Progress & Goals", "History"] as const;
const ACTIVE_TAB = "Polygons";

interface AdminSitePolygonReviewShellProps {
  site: SiteFullDto;
  children: ReactNode;
}

const AdminSitePolygonReviewShell: FC<AdminSitePolygonReviewShellProps> = ({ site, children }) => {
  const t = useT();

  return (
    <Flex minHeight="100vh" width="100%" alignItems="stretch">
      <Box as="aside" flexShrink={0} width="64px" className="bg-theme-primary-900" aria-hidden />

      <Flex direction="column" flex={1} minWidth={0}>
        <Box as="header" className="border-b border-theme-neutral-200 bg-white px-6 pt-4">
          <Flex alignItems="center" justifyContent="space-between" gap={4}>
            <Box minWidth={0}>
              <Text textStyle="300" color="neutral.700" truncate>
                {site.projectName ?? ""}
              </Text>
              <Text textStyle="600" color="primary.900" truncate>
                {site.name ?? t("Site")}
              </Text>
            </Box>
            <Text textStyle="300" color="neutral.700" flexShrink={0}>
              {t("Admin Polygon Review")}
            </Text>
          </Flex>

          <Flex gap={6} marginTop={3}>
            {MOCK_TAB_KEYS.map(tab => (
              <Box
                key={tab}
                paddingBottom={2}
                className={tab === ACTIVE_TAB ? "border-b-2 border-theme-primary-500" : "cursor-default opacity-60"}
              >
                <Text textStyle="400" color={tab === ACTIVE_TAB ? "primary.900" : "neutral.700"}>
                  {t(tab)}
                </Text>
              </Box>
            ))}
          </Flex>
        </Box>

        <Box as="main" flex={1} minWidth={0}>
          {children}
        </Box>
      </Flex>
    </Flex>
  );
};

export default AdminSitePolygonReviewShell;
