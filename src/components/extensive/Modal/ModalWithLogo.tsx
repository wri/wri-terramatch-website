import { useT } from "@transifex/react";
import { FC, useState } from "react";
import { When } from "react-if";
import { twMerge } from "tailwind-merge";

import { AuditLogButtonStates } from "@/admin/components/ResourceTabs/AuditLogTab/constants/enum";
import Button from "@/components/elements/Button/Button";
import Commentary from "@/components/elements/Commentary/Commentary";
import CommentaryBox from "@/components/elements/CommentaryBox/CommentaryBox";
import StepProgressbar from "@/components/elements/ProgressBar/StepProgressbar/StepProgressbar";
import { StatusEnum } from "@/components/elements/Status/constants/statusMap";
import Text from "@/components/elements/Text/Text";
import { statusActionsMap } from "@/hooks/AuditStatus/useAuditLogActions";

import Icon, { IconNames } from "../Icon/Icon";
import { ModalProps } from "./Modal";
import { commentariesItems } from "./ModalContent/MockedData";
import { ModalBaseWithLogo } from "./ModalsBases";

export interface ModalWithLogoProps extends ModalProps {
  primaryButtonText?: string;
  secondaryButtonText?: string;
  toogleButton?: boolean;
  status?: StatusEnum;
  onClose?: () => void;
}

const ModalWithLogo: FC<ModalWithLogoProps> = ({
  iconProps,
  title,
  primaryButtonProps,
  primaryButtonText,
  secondaryButtonProps,
  secondaryButtonText,
  toogleButton,
  children,
  status,
  onClose,
  ...rest
}) => {
  const t = useT();
  const [buttonToogle, setButtonToogle] = useState(true);
  const { valuesForStatus, statusLabels } = statusActionsMap[AuditLogButtonStates.POLYGON];

  return (
    <ModalBaseWithLogo {...rest}>
      <header className="flex w-full items-center justify-between border-b border-b-neutral-200 px-8 py-5">
        <Icon name={IconNames.WRI_LOGO} width={108} height={30} className="min-w-[108px]" />
        <button onClick={onClose} className="ml-2 rounded p-1 hover:bg-grey-800">
          <Icon name={IconNames.CLEAR} width={16} height={16} className="text-darkCustom-100" />
        </button>
      </header>
      <div className="max-h-[100%] w-full overflow-auto px-8 py-8">
        <When condition={!!iconProps}>
          <Icon
            {...iconProps!}
            width={iconProps?.width ?? 40}
            className={twMerge("mb-8", iconProps?.className)}
            style={{ minHeight: iconProps?.height ?? iconProps?.width ?? 40 }}
          />
        </When>
        <div className="flex items-center justify-between">
          <Text variant="text-24-bold">{title}</Text>
          <When condition={toogleButton}>
            <div className="flex w-fit gap-1 rounded-lg bg-neutral-200 p-1">
              <Button
                variant={`${buttonToogle ? "white-toggle" : "transparent-toggle"}`}
                onClick={() => setButtonToogle(!buttonToogle)}
                className="w-[111px]"
              >
                <Text variant="text-14-semibold">{t("Comments")}</Text>
              </Button>
              <Button
                variant={`${buttonToogle ? "transparent-toggle" : "white-toggle"}`}
                onClick={() => setButtonToogle(!buttonToogle)}
                className="w-[111px]"
              >
                <Text variant="text-14-semibold">{t("History")}</Text>
              </Button>
            </div>
          </When>
        </div>
        <div>
          <div className="mb-[72px] px-20">
            <StepProgressbar
              value={valuesForStatus(status as StatusEnum)}
              labels={statusLabels}
              classNameLabels="min-w-[111px]"
            />
          </div>
          <When condition={buttonToogle}>
            <div className="flex flex-col gap-4">
              <CommentaryBox name={"Ricardo"} lastName={"Saavedra"} />
              {commentariesItems.map(item => (
                <Commentary
                  key={item.id}
                  name={item.name}
                  lastName={item.lastName}
                  date={item.date}
                  commentary={item.commentary}
                  files={item.files}
                  status={item.status as "draft" | "submitted" | undefined}
                />
              ))}
            </div>
          </When>
          <When condition={!buttonToogle}></When>
        </div>
      </div>
      <div className="flex w-full justify-end gap-3 px-8 py-4">
        <When condition={!!secondaryButtonProps}>
          <Button {...secondaryButtonProps!} variant="white-page-admin">
            <Text variant="text-14-bold" className="capitalize">
              {secondaryButtonText}
            </Text>
          </Button>
        </When>
        <Button {...primaryButtonProps}>
          <Text variant="text-14-bold" className="capitalize text-white">
            {primaryButtonText}
          </Text>
        </Button>
      </div>
    </ModalBaseWithLogo>
  );
};

export default ModalWithLogo;
