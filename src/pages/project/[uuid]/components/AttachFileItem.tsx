import { Flex, Text } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { FC } from "react";

import Button from "@/redesignComponents/actions/Buttons/Button/Button";
import { AttachFileIcon } from "@/redesignComponents/foundations/Icons";
import { ChevronRightIcon } from "@/redesignComponents/foundations/Icons";

interface AttachFileItemProps {
  fileName: string;
  onClick: () => void;
  fileType: string;
  uploadedDate?: string;
}

const AttachFileItem: FC<AttachFileItemProps> = ({ fileName, onClick, fileType, uploadedDate = "-" }) => {
  const t = useT();
  return (
    <Flex gap={1} className="flex-col">
      <Flex gap={1} className="min-w-0 items-center">
        <AttachFileIcon boxSize={4} color="neutral.800" />
        <Text textStyle="300" color="neutral.900" className="truncate" title={`${fileName}.${fileType}`}>
          {fileName}.{fileType}
        </Text>
        <Button variant="borderless" size="small" onClick={onClick} rightIcon={<ChevronRightIcon boxSize={2.5} />}>
          {t("View")}
        </Button>
      </Flex>
      <Text textStyle="200" color="neutral.700">
        Date uploaded: {uploadedDate}
      </Text>
    </Flex>
  );
};

export default AttachFileItem;
