import { useT } from "@transifex/react";
import { FC, useMemo, useState } from "react";
import { twMerge } from "tailwind-merge";

import AuditLogTable from "@/admin/components/ResourceTabs/AuditLogTab/components/AuditLogTable";
import { AuditLogButtonStates } from "@/admin/components/ResourceTabs/AuditLogTab/constants/enum";
import Button from "@/components/elements/Button/Button";
import Commentary from "@/components/elements/Commentary/Commentary";
import CommentaryBox from "@/components/elements/CommentaryBox/CommentaryBox";
import { formatCommentaryDate } from "@/components/elements/Map-mapbox/utils";
import StepProgressbar from "@/components/elements/ProgressBar/StepProgressbar/StepProgressbar";
import { StatusEnum } from "@/components/elements/Status/constants/statusMap";
import Text from "@/components/elements/Text/Text";
import { useAuditStatuses } from "@/connections/AuditStatus";
import { useMyUser } from "@/connections/User";
import { AuditStatusDto } from "@/generated/v3/entityService/entityServiceSchemas";
import { useStatusActionsMap } from "@/hooks/AuditStatus/useStatusActionsMap";

import Icon, { IconNames } from "../Icon/Icon";
import { ModalProps } from "./Modal";
import { ModalBaseWithLogo } from "./ModalsBases";

export type ModalWithLogoProps = ModalProps & {
  uuid: string;
  primaryButtonText?: string;
  secondaryButtonText?: string;
  toogleButton?: boolean;
  status?: StatusEnum;
  onClose?: () => void;
};

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
  const [buttonToggle, setButtonToggle] = useState(true);
  const { valuesForStatus, statusLabels } = useStatusActionsMap(AuditLogButtonStates.POLYGON);

  const [, { data: auditStatusesData, refetch }] = useAuditStatuses({
    entity: "sitePolygons",
    uuid: uuid ?? ""
  });

  const [, { user }] = useMyUser();

  const [commentsAuditLogData, restAuditLogData] = useMemo(() => {
    if (auditStatusesData == null) {
      return [[], []];
    }

    const commentsAuditLog: AuditStatusDto[] = [];
    const restAuditLog: AuditStatusDto[] = [];

    auditStatusesData.forEach((auditLog: AuditStatusDto) => {
      if (auditLog.type === "comment") {
        commentsAuditLog.push(auditLog);
      } else {
        restAuditLog.push(auditLog);
      }
    });

    return [commentsAuditLog, restAuditLog];
  }, [auditStatusesData]);

  return (
    <ModalBaseWithLogo {...rest}>
      <header className="flex w-full items-center justify-between border-b border-b-neutral-200 px-8 py-5">
        <Icon name={IconNames.WRI_LOGO} width={108} height={30} className="min-w-[108px]" />
        <button onClick={onClose} className="ml-2 rounded p-1 hover:bg-grey-800">
          <Icon name={IconNames.CLEAR} width={16} height={16} className="text-darkCustom-100" />
        </button>
      </header>
      <div className="max-h-[100%] w-full overflow-auto px-8 py-8">
        {iconProps != null && (
          <Icon
            {...iconProps!}
            width={iconProps?.width ?? 40}
            className={twMerge("mb-8", iconProps?.className)}
            style={{ minHeight: iconProps?.height ?? iconProps?.width ?? 40 }}
          />
        )}
        <div className="mb-8 flex items-center justify-between">
          <Text variant="text-24-bold">{title}</Text>
          {toogleButton && (
            <div className="flex w-fit gap-1 rounded-lg bg-neutral-200 p-1">
              <Button
                variant={`${buttonToggle ? "white-toggle" : "transparent-toggle"}`}
                onClick={() => setButtonToggle(!buttonToggle)}
                className="w-[111px]"
              >
                <Text variant="text-14-semibold">{t("Comments")}</Text>
              </Button>
              <Button
                variant={`${buttonToggle ? "transparent-toggle" : "white-toggle"}`}
                onClick={() => setButtonToggle(!buttonToggle)}
                className="w-[111px]"
              >
                <Text variant="text-14-semibold">{t("History")}</Text>
              </Button>
            </div>
          )}
        </div>
        <div>
          <div className="mb-[72px] px-20">
            <StepProgressbar
              value={valuesForStatus(status as StatusEnum)}
              labels={statusLabels}
              classNameLabels="min-w-[111px]"
            />
          </div>
          {buttonToggle ? (
            <div className="flex flex-col gap-4">
              <CommentaryBox
                name={user?.firstName!}
                lastName={user?.lastName!}
                entity="sitePolygons"
                record={{ uuid, status }}
                refresh={refetch}
              />
              {commentsAuditLogData.map(item => (
                <Commentary
                  key={item.id}
                  name={item.firstName ?? ""}
                  lastName={item.lastName ?? ""}
                  date={item.dateCreated != null ? formatCommentaryDate(new Date(item.dateCreated)) : ""}
                  commentary={item.comment ?? ""}
                  files={item.attachments?.map(att => ({
                    uuid: att.uuid,
                    url: att.url,
                    fileName: att.fileName
                  }))}
                  status={item.status}
                />
              ))}
            </div>
          ) : (
            <AuditLogTable auditLogData={{ data: restAuditLogData }} />
          )}
        </div>
      </div>
      <div className="flex w-full justify-end gap-3 px-8 py-4">
        {secondaryButtonProps != null && (
          <Button {...secondaryButtonProps!} variant="white-page-admin">
            <Text variant="text-14-bold" className="capitalize">
              {secondaryButtonText}
            </Text>
          </Button>
        )}
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
