import { Flex, Text } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { useRouter } from "next/router";
import { FC } from "react";

import { STEP_QUERY_PARAM } from "@/components/extensive/WizardForm/useFormNavigation";
import { getEntityDetailPageLink, pluralEntityName } from "@/helpers/entity";
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
  stepId?: string;
};

const GalleryEntryItem: FC<GalleryEntryItemProps> = ({ src, name, entityName, entityUUID, url, type, stepId }) => {
  const t = useT();
  const router = useRouter();

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
      <Flex direction="column" alignItems="start" minW={0}>
        <Text textStyle="300" color="neutral.800" pl={2} className="w-full truncate" title={name}>
          {name}
        </Text>
        <Button
          variant="borderless"
          size="small"
          rightIcon={<ChevronRightIcon boxSize={2.5} />}
          onClick={() => {
            if (stepId != null) {
              router.push(
                `/entity/${pluralEntityName(entityName!)}/edit/${entityUUID}?${STEP_QUERY_PARAM}=${encodeURIComponent(
                  stepId ?? ""
                )}`
              );
            } else {
              if (entityName != null && entityUUID != null) {
                router.push(getEntityDetailPageLink(pluralEntityName(entityName), entityUUID, "gallery"));
              } else {
                window.open(url ?? "", "_blank");
              }
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
