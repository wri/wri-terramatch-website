import { FC, PropsWithChildren } from "react";

import ModalSelection, { ModalSelectionProps } from "./ModalSelection";

export type ModalSubmitProps = PropsWithChildren<ModalSelectionProps>;

const ModalSubmit: FC<ModalSubmitProps> = props => <ModalSelection {...props} action="submit" />;

export default ModalSubmit;
