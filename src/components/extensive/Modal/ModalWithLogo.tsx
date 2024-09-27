import { useT } from "@transifex/react";
import { FC, useMemo, useState } from "react";
import { When } from "react-if";
import { twMerge } from "tailwind-merge";

import AuditLogTable from "@/admin/components/ResourceTabs/AuditLogTab/components/AuditLogTable";
import { AuditLogButtonStates } from "@/admin/components/ResourceTabs/AuditLogTab/constants/enum";
import { AuditLogEntityEnum } from "@/admin/components/ResourceTabs/AuditLogTab/constants/types";
import { getRequestPathParam } from "@/admin/components/ResourceTabs/AuditLogTab/utils/util";
import Button from "@/components/elements/Button/Button";
import Commentary from "@/components/elements/Commentary/Commentary";
import CommentaryBox from "@/components/elements/CommentaryBox/CommentaryBox";
import { formatCommentaryDate } from "@/components/elements/Map-mapbox/utils";
import StepProgressbar from "@/components/elements/ProgressBar/StepProgressbar/StepProgressbar";
import { StatusEnum } from "@/components/elements/Status/constants/statusMap";
import Text from "@/components/elements/Text/Text";
import { myUserConnection } from "@/connections/User";
import { GetV2AuditStatusENTITYUUIDResponse, useGetV2AuditStatusENTITYUUID } from "@/generated/apiComponents";
import { statusActionsMap } from "@/hooks/AuditStatus/useAuditLogActions";
import { useConnection } from "@/hooks/useConnection";

import Icon, { IconNames } from "../Icon/Icon";
import { ModalProps } from "./Modal";
import { ModalBaseWithLogo } from "./ModalsBases";

export interface ModalWithLogoProps extends ModalProps {
  uuid: string;
  primaryButtonText?: string;
  secondaryButtonText?: string;
  toogleButton?: boolean;
  status?: StatusEnum;
  onClose?: () => void;
}

const ModalWithLogo: FC<ModalWithLogoProps> = ({
  uuid,
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

  const { data: auditLogData, refetch } = useGetV2AuditStatusENTITYUUID<{ data: GetV2AuditStatusENTITYUUIDResponse }>({
    pathParams: {
      entity: getRequestPathParam(AuditLogEntityEnum.Polygon),
      uuid
    }
  });

  const [, { user }] = useConnection(myUserConnection);

  const [commentsAuditLogData, restAuditLogData] = useMemo(() => {
    const commentsAuditLog: GetV2AuditStatusENTITYUUIDResponse = [];
    const restAuditLog: GetV2AuditStatusENTITYUUIDResponse = [];
    auditLogData?.data?.forEach(auditLog => {
      if (auditLog.type === "comment") {
        commentsAuditLog.push(auditLog);
      } else {
        restAuditLog.push(auditLog);
      }
    });
    return [commentsAuditLog, restAuditLog];
  }, [auditLogData]);

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
        <div className="mb-8 flex items-center justify-between">
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
              <CommentaryBox
                name={user?.firstName!}
                lastName={user?.lastName!}
                entity={AuditLogEntityEnum.Polygon}
                record={{ uuid, status }}
                refresh={refetch}
              />
              {commentsAuditLogData.map(item => (
                <Commentary
                  key={item.id}
                  name={item.first_name!}
                  lastName={item.last_name!}
                  date={formatCommentaryDate(new Date(item.date_created!))}
                  commentary={item.comment!}
                  files={item.attachments}
                  status={item.status}
                />
              ))}
            </div>
          </When>
          <When condition={!buttonToogle}>
            <AuditLogTable auditLogData={{ data: restAuditLogData }} />
          </When>
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
