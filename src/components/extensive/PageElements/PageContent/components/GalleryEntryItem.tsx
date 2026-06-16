import { Flex, Text } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { useRouter } from "next/router";
import { FC } from "react";

import { isEntityReport } from "@/helpers/entity";
import Button from "@/redesignComponents/actions/Buttons/Button/Button";
import GalleryImage from "@/redesignComponents/content/Images/GalleryImage/GalleryImage";
import { MediaType } from "@/redesignComponents/content/Images/Image";
import { ChevronRightIcon } from "@/redesignComponents/foundations/Icons";
import { EntityName, SingularEntityName } from "@/types/common";

type GalleryEntryItemProps = {
  src: string;
  name: string;
  entityName?: EntityName | SingularEntityName;
  entityUUID?: string;
  url?: string;
  type?: MediaType;
};

const GalleryEntryItem: FC<GalleryEntryItemProps> = ({ src, name, entityName, entityUUID, url, type }) => {
  const t = useT();
  const router = useRouter();
  // TODO: Report entities have no Gallery tab yet; per-image Edit links to profile gallery today.
  // Re-enable once site/nursery/project report Gallery tabs ship (use getEntityDetailPageLink + tab=gallery).
  const isReportEntity = entityName != null && isEntityReport(entityName as EntityName);

  return (
    <Flex gap={0.5} alignItems="center">
      <GalleryImage
        hideNotAvailableText
        src={src}
        alt={name}
        className="!h-12 !w-15 shrink-0"
        type={type}
        classNamesVideoIcon="!h-3 !w-3"
      />
      <Flex direction="column" alignItems="start">
        <Text textStyle="300" color="neutral.800" pl={2} className="truncate" title={name}>
          {name}
        </Text>
        <Button
          variant="borderless"
          size="small"
          rightIcon={<ChevronRightIcon boxSize={2.5} />}
          disabled={isReportEntity}
          onClick={() => {
            if (entityName && entityUUID) {
              router.push(`/${entityName === "projects" ? "project" : "site"}/${entityUUID}?tab=gallery`);
            } else {
              window.open(url ?? "", "_blank");
            }
          }}
        >
          {t("Edit")}
        </Button>
      </Flex>
    </Flex>
  );
};

export default GalleryEntryItem;
