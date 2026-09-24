import { FC } from "react";

import ModalSelection, { ModalSelectionProps } from "./ModalSelection";

export type ModalDeleteProps = ModalSelectionProps;

const ModalDelete: FC<ModalDeleteProps> = props => <ModalSelection {...props} action="delete" />;

export default ModalDelete;
