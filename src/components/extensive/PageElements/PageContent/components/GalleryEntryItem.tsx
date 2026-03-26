import { Box, Flex, Text } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { useRouter } from "next/router";
import { FC } from "react";

import Button from "@/redesignComponents/actions/Buttons/Button/Button";
import GalleryImage from "@/redesignComponents/content/Images/GalleryImage/GalleryImage";
import { ChevronRightIcon } from "@/redesignComponents/foundations/Icons";

type GalleryEntryItemProps = {
  src: string;
  name: string;
  entityName?: "projects" | "sites";
  entityUUID?: string;
  url?: string;
};

const GalleryEntryItem: FC<GalleryEntryItemProps> = ({ src, name, entityName, entityUUID, url }) => {
  const t = useT();
  const router = useRouter();

  return (
    <Flex gap={2}>
      <GalleryImage src={src} alt={name} className="!h-12 !w-15" />
      <Box>
        <Text textStyle="400" color="neutral.800">
          {name}
        </Text>
        <Button
          variant="borderless"
          size="small"
          rightIcon={<ChevronRightIcon boxSize={2.5} />}
          onClick={() => {
            if (entityName && entityUUID) {
              router.push(`/${entityName === "projects" ? "project" : "site"}/${entityUUID}?tab=gallery`);
            } else {
              router.push(url ?? "");
            }
          }}
        >
          {t("Edit")}
        </Button>
      </Box>
    </Flex>
  );
};

export default GalleryEntryItem;
