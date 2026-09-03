import { Box } from "@chakra-ui/react";
import { useT } from "@transifex/react";

import { useGetEditEntityHandler } from "@/hooks/entity/useGetEditEntityHandler";
import { getThemedColor } from "@/lib/theme";
import ActionCell from "@/redesignComponents/dataDisplay/Table/components/ActionCell";
import { EditIcon } from "@/redesignComponents/foundations/Icons";

import type { NurseryIndexRow } from "../nurseryIndex.types";

const NurseryIndexEditButton = ({ nursery }: { nursery: NurseryIndexRow }) => {
  const t = useT();
  const { handleEdit, EditModals } = useGetEditEntityHandler({
    entityName: "nurseries",
    entityUUID: nursery.uuid,
    entityStatus: nursery.status ?? "draft",
    updateRequestStatus: nursery.updateRequestStatus,
    useInformationRequiredModal: true
  });

  return (
    <>
      {EditModals}
      <Box pr="1.5625rem">
        <ActionCell
          button={{
            children: t("Edit"),
            onClick: () => handleEdit(),
            leftIcon: (
              <EditIcon
                css={{
                  "& svg path": {
                    fill: getThemedColor("neutral", 900) + " !important",
                    color: getThemedColor("neutral", 900) + " !important"
                  }
                }}
              />
            )
          }}
        />
      </Box>
    </>
  );
};

export default NurseryIndexEditButton;
