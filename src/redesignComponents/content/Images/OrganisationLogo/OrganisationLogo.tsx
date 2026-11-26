import { Flex } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import classNames from "classnames";
import { FC } from "react";

import { resolveRemSizeValue } from "@/lib/sizing";
import Button from "@/redesignComponents/actions/Buttons/Button/Button";
import { EditIcon } from "@/redesignComponents/foundations/Icons";

const LOGO_SIZE_REM = resolveRemSizeValue(20);

export interface OrganisationLogoProps {
  src?: string;
  alt: string;
  onEditClick: () => void;
  className?: string;
}

const OrganisationLogo: FC<OrganisationLogoProps> = ({ src, alt, onEditClick, className }) => {
  const t = useT();

  if (src == null) {
    return (
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
        className={className}
      >
        <Button variant="borderless" size="small" onClick={onEditClick}>
          {t("Add logo")}
        </Button>
      </Flex>
    );
  }

  return (
    <Flex
      width={LOGO_SIZE_REM}
      height={LOGO_SIZE_REM}
      flexShrink={0}
      position="relative"
      overflow="hidden"
      borderRadius="full"
      background="neutral.100"
      className={classNames("group", className)}
    >
      <img src={src} alt={alt} className="h-full w-full object-cover" />
      <Flex
        position="absolute"
        inset={0}
        alignItems="center"
        justifyContent="center"
        borderRadius="full"
        className="bg-theme-primary-900/80 opacity-0 transition-opacity duration-200 focus-within:opacity-100 group-hover:opacity-100"
      >
        <Button
          variant="borderless"
          typeVariant="dark"
          size="small"
          leftIcon={<EditIcon className="h-3 w-3" />}
          onClick={onEditClick}
        >
          {t("Edit")}
        </Button>
      </Flex>
    </Flex>
  );
};

export default OrganisationLogo;
