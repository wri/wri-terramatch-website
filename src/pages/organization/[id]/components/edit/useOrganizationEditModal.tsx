import { useCallback } from "react";

import { ModalId } from "@/components/extensive/Modal/ModalConst";
import { useModalContext } from "@/context/modal.provider";
import { OrganisationFullDto } from "@/generated/v3/userService/userServiceSchemas";

import OrganizationEditModal from "./OrganizationEditModal";

/** Returns a stable callback that opens the organization edit modal for the given organization. */
export const useOrganizationEditModal = (organization?: OrganisationFullDto) => {
  const { openModal } = useModalContext();

  return useCallback(
    () => openModal(ModalId.ORGANIZATION_EDIT_MODAL, <OrganizationEditModal organization={organization} />),
    [openModal, organization]
  );
};
