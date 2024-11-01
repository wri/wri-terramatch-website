import { FC } from "react";
import { When } from "react-if";

import Button from "@/components/elements/Button/Button";
import Checkbox from "@/components/elements/Inputs/Checkbox/Checkbox";
import Table from "@/components/elements/Table/Table";
import { VARIANT_TABLE_SITE_POLYGON_REVIEW } from "@/components/elements/Table/TableVariants";
import Text from "@/components/elements/Text/Text";

import Icon, { IconNames } from "../Icon/Icon";
import { ModalProps } from "./Modal";
import { ModalBaseWithLogo } from "./ModalsBases";

export interface ModalRunAnalysisProps extends ModalProps {
  secondaryButtonText?: string;
  onClose?: () => void;
  primaryButtonText: string;
  title: string;
}

const ModalRunAnalysis: FC<ModalRunAnalysisProps> = ({
  primaryButtonProps,
  title,
  primaryButtonText,
  secondaryButtonProps,
  secondaryButtonText,
  children,
  content,
  onClose,
  ...rest
}) => {
  const columAnalysis = [
    {
      accessorKey: "polygonName",
      header: "Polygon Name",
      enableSorting: false
    },
    {
      accessorKey: "dateOfLastAnalysis",
      header: "Date of Last Analysis",
      enableSorting: false
    },
    {
      accessorKey: "run",
      header: "Run Analysis",
      enableSorting: false,
      cell: () => <Checkbox name="Select All" onClick={() => {}} />
    }
  ];

  const dataTable = [
    {
      polygonName: "Aerobic-agroforestry",
      dateOfLastAnalysis: "November 1, 2022"
    },
    {
      polygonName: "Arcos",
      dateOfLastAnalysis: "November 1, 2022"
    },
    {
      polygonName: "Bccp",
      dateOfLastAnalysis: "November 1, 2022"
    },
    {
      polygonName: "Blue-forest",
      dateOfLastAnalysis: "November 1, 2022"
    },
    {
      polygonName: "Durrell",
      dateOfLastAnalysis: "November 1, 2022"
    },
    {
      polygonName: "Ecofix",
      dateOfLastAnalysis: "November 1, 2022"
    },
    {
      polygonName: "Env-coffee-forest-forum",
      dateOfLastAnalysis: "November 1, 2022"
    },
    {
      polygonName: "Env-found-afr-sl",
      dateOfLastAnalysis: "November 1, 2022"
    }
  ];

  return (
    <ModalBaseWithLogo {...rest}>
      <header className="flex w-full items-center justify-between border-b border-b-neutral-200 px-8 py-5">
        <Icon name={IconNames.WRI_LOGO} width={108} height={30} className="min-w-[108px]" />
        <button onClick={onClose} className="ml-2 rounded p-1 hover:bg-grey-800">
          <Icon name={IconNames.CLEAR} width={16} height={16} className="text-darkCustom-100" />
        </button>
      </header>
      <div className="max-h-[100%] w-full overflow-auto px-8 py-8">
        <Text variant="text-20-bold" className="">
          {title}
        </Text>
        <Text variant="text-12-light" className="mb-8">
          {content}
        </Text>
        <div className="mb-8 flex items-center justify-between">
          <Table columns={columAnalysis} data={dataTable} variant={VARIANT_TABLE_SITE_POLYGON_REVIEW} />
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

export default ModalRunAnalysis;
