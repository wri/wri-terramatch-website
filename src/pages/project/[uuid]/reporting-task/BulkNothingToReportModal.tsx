import { useT } from "@transifex/react";
import { FC, useCallback, useMemo, useState } from "react";

import Button, { IButtonProps } from "@/components/elements/Button/Button";
import Checkbox from "@/components/elements/Inputs/Checkbox/Checkbox";
import Text from "@/components/elements/Text/Text";
import Icon, { IconNames } from "@/components/extensive/Icon/Icon";
import { ModalProps } from "@/components/extensive/Modal/Modal";
import { ModalBaseSubmit } from "@/components/extensive/Modal/ModalsBases";
import { TaskReport } from "@/pages/project/[uuid]/reporting-task/[reportingTaskUUID].page";
import { isNotNull } from "@/utils/array";

export type BulkNothingToReportProps = Pick<ModalProps, "content"> & {
  data: TaskReport[];
  onClose: () => void;
  onSubmit: (reports: TaskReport[]) => void;
};

type ButtonSpec = { text: string; props: IButtonProps };

type RowProps = {
  report: TaskReport;
  selected: boolean;
  onToggle: (uuid: string) => void;
};

const Row: FC<RowProps> = ({ report, selected, onToggle }) => {
  const onChange = useCallback(() => onToggle(report.uuid), [report.uuid, onToggle]);
  const t = useT();
  return (
    <div className="flex flex-col border-b border-grey-750 px-4 py-2 last:border-0">
      <div className="flex items-center ">
        <Text variant="text-12" className="flex-[2]">
          {report.parentName}
        </Text>
        <Text variant="text-12" className="flex-1">
          {report.type === "site-report" ? t("Site") : t("Nursery")}
        </Text>
        <div className="flex flex-1 items-center justify-center">
          <Checkbox name="" checked={selected} onChange={onChange} />
        </div>
      </div>
    </div>
  );
};

const BulkNothingToReportModal: FC<BulkNothingToReportProps> = ({ content, data, onClose, onSubmit }) => {
  const t = useT();
  const [selected, setSelected] = useState<string[]>([]);

  const submitAction = useCallback(() => {
    onClose();
    onSubmit(selected.map(uuid => data.find(report => report.uuid === uuid)).filter(isNotNull));
  }, [data, onClose, onSubmit, selected]);

  const buttons = useMemo(
    (): {
      primary: ButtonSpec;
      secondary: ButtonSpec;
    } => ({
      primary: {
        text: t("Submit"),
        props: {
          className: "px-8 py-3",
          variant: "primary"
        }
      },
      secondary: {
        text: t("Cancel"),
        props: {
          className: "px-8 py-3",
          variant: "white-page-admin",
          onClick: onClose
        }
      }
    }),
    [onClose, t]
  );

  const toggleSelect = useCallback((uuid: string) => {
    setSelected(selected => {
      if (selected.includes(uuid)) {
        return selected.filter(id => id !== uuid);
      } else {
        return [...selected, uuid];
      }
    });
  }, []);

  const toggleSelectAll = () => {
    if (selected.length === data.length) {
      setSelected([]);
    } else {
      setSelected(data.map(({ uuid }) => uuid));
    }
  };

  return (
    <ModalBaseSubmit>
      <header className="flex w-full items-center justify-between border-b border-b-neutral-200 px-8 py-5">
        <Icon name={IconNames.WRI_LOGO} width={108} height={30} className="min-w-[108px]" />
      </header>
      <div className="max-h-[100%] w-full overflow-auto px-8 py-8">
        <div className="flex items-center justify-between">
          <Text variant="text-24-bold">{t("Bulk Update - Nothing to Report")}</Text>
          {data?.length > 0 && (
            <Button variant="white-page-admin" className="text-14-semibold text-black" onClick={toggleSelectAll}>
              {selected.length === data.length ? "Deselect All" : "Select All"}
            </Button>
          )}
        </div>
        <div className="my-2 flex items-center">
          {content != null && (
            <Text as="div" variant="text-12-light" className="my-1" containHtml>
              {content}
            </Text>
          )}
        </div>

        <div className="mb-6 flex flex-col rounded-lg border border-grey-750">
          <header className="flex items-center border-b border-grey-750 bg-neutral-150 px-4 py-2">
            <Text variant="text-12" className="flex-[2]">
              {t("Name")}
            </Text>
            <Text variant="text-12" className="flex flex-1 items-center justify-start">
              {t("Report Type")}
            </Text>
            <Text variant="text-12" className="flex flex-1 items-center justify-center">
              {t("Select")}
            </Text>
          </header>
          {data?.length > 0 ? (
            data.map(report => (
              <Row
                key={report.uuid}
                report={report}
                selected={selected.includes(report.uuid)}
                onToggle={toggleSelect}
              />
            ))
          ) : (
            <div className="flex items-center justify-center py-8">
              <Text variant="text-14-light" className="text-neutral-500">
                {t("No reports available for bulk action")}
              </Text>
            </div>
          )}
        </div>
      </div>
      <div className="flex w-full justify-end gap-3 px-8 py-4">
        <Button {...buttons.secondary.props} variant="white-page-admin">
          <Text variant="text-14-bold" className="capitalize">
            {buttons.secondary.text}
          </Text>
        </Button>
        {data?.length > 0 && (
          <Button {...buttons.primary.props} onClick={submitAction} disabled={selected.length === 0}>
            <Text variant="text-14-bold" className="capitalize text-white">
              {buttons.primary.text}
            </Text>
          </Button>
        )}
      </div>
    </ModalBaseSubmit>
  );
};

export default BulkNothingToReportModal;
