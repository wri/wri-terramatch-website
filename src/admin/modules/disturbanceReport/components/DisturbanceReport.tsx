import Table from "@/components/elements/Table/Table";
import { VARIANT_TABLE_AIRTABLE_DASHBOARD } from "@/components/elements/Table/TableVariants";
import Text from "@/components/elements/Text/Text";
import Icon, { IconNames } from "@/components/extensive/Icon/Icon";

import DownloadMediaItem from "./DownloadMediaItem";
import Intensity, { IntensityEnum } from "./Intensity";
import { DisturbanceReportData } from "./MockedData";

interface DisturbanceReportProps {
  id: string;
  index: number;
}

const DisturbanceReport = (props: DisturbanceReportProps) => {
  const { index } = props;

  const columns = [
    {
      accessorKey: "sites_affected",
      header: "Sites Affected",
      cell: ({ getValue }: any) => (
        <Text variant="text-14-light" className="flex items-center gap-2 leading-none text-blueCustom-900">
          {getValue()}
          <Icon name={IconNames.LINK_PA} className="h-4 w-4 text-darkCustom-300 hover:text-primary" />
        </Text>
      ),
      enableSorting: false,
      meta: { width: "50%" }
    },
    {
      accessorKey: "polygon_affected",
      header: "Polygon Affected",
      enableSorting: false,
      meta: { width: "50%" }
    }
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4">
        <Text variant="text-20-bold" className="leading-none">
          Disturbance Report {index + 1}
        </Text>
        <div className="grid grid-cols-3 gap-x-4 gap-y-6">
          <div className="flex flex-col gap-2">
            <Text variant="text-14-light" className="leading-none text-darkCustom-300">
              Disturbance Type
            </Text>
            <Text variant="text-14" className="leading-none text-blueCustom-900">
              Climatic
            </Text>
          </div>
          <div className="col-span-2 flex flex-col gap-2">
            <Text variant="text-14-light" className="leading-none text-darkCustom-300">
              Disturbance Subtype
            </Text>
            <Text variant="text-14" className="leading-none text-blueCustom-900">
              Flooding, Pests-Disease, Extreme Heat, etc.
            </Text>
          </div>
          <div className="flex flex-col gap-2">
            <Text variant="text-14-light" className="leading-none text-darkCustom-300">
              Intensity
            </Text>
            <Intensity className="text-blueCustom-900" intensity={IntensityEnum.HIGH} />
          </div>
          <div className="flex flex-col gap-2">
            <Text variant="text-14-light" className="leading-none text-darkCustom-300">
              Extend
            </Text>
            <Text variant="text-14" className="leading-none text-blueCustom-900">
              0-20
            </Text>
          </div>
          <div className="flex flex-col gap-2">
            <Text variant="text-14-light" className="leading-none text-darkCustom-300">
              People Affected
            </Text>
            <Text variant="text-14" className="leading-none text-blueCustom-900">
              1
            </Text>
          </div>
          <div className="col-span-3 flex flex-col gap-2">
            <Text variant="text-14-light" className="leading-none text-darkCustom-300">
              Property affected
            </Text>
            <Text variant="text-14" className="leading-none text-blueCustom-900">
              Entity 1, Entity 2 Entity 5, Entity 4
            </Text>
          </div>
          <div className="flex flex-col gap-2">
            <Text variant="text-14-light" className="leading-none text-darkCustom-300">
              Date of Disturbance
            </Text>
            <Text variant="text-14" className="leading-none text-blueCustom-900">
              07/31/2025
            </Text>
          </div>
          <div className="flex flex-col gap-2">
            <Text variant="text-14-light" className="leading-none text-darkCustom-300">
              Monetary Damage
            </Text>
            <Text variant="text-14" className="leading-none text-blueCustom-900">
              $50,000
            </Text>
          </div>
        </div>
      </div>
      <Table
        data={DisturbanceReportData}
        columns={columns}
        hasPagination={false}
        invertSelectPagination={false}
        variant={VARIANT_TABLE_AIRTABLE_DASHBOARD}
      />
      <div className="flex flex-col gap-2">
        <Text variant="text-14-light" className="leading-none text-darkCustom-300">
          Description
        </Text>
        <Text variant="text-14" className="text-blueCustom-900">
          The organization faced significant revenue decline of 15% due to pandemic-related disruptions while
          maintaining stable operating margins through aggressive cost-cutting measures.
        </Text>
      </div>
      <div className="flex flex-col gap-2">
        <Text variant="text-14-light" className="leading-none text-darkCustom-300">
          Action Description
        </Text>
        <Text variant="text-14" className="text-blueCustom-900">
          The organization faced significant revenue decline of 15% due to pandemic-related disruptions while
          maintaining stable operating margins through aggressive cost-cutting measures.
        </Text>
      </div>
      <div className="flex flex-col gap-4">
        <Text variant="text-14-light" className="leading-none text-darkCustom-300">
          Download Media Assets
        </Text>
        <div className="grid grid-cols-3 gap-2">
          <DownloadMediaItem name={"Image-1.jpg"} src={"https://www.google.com"} />
          <DownloadMediaItem name={"Image-2.jpg"} src={"https://www.google.com"} />
          <DownloadMediaItem name={"Image-3.jpg"} src={"https://www.google.com"} />
          <DownloadMediaItem name={"Image-4.jpg"} src={"https://www.google.com"} />
          <DownloadMediaItem name={"Image-5.jpg"} src={"https://www.google.com"} />
          <DownloadMediaItem name={"Image-6.jpg"} src={"https://www.google.com"} />
        </div>
      </div>
    </div>
  );
};

export default DisturbanceReport;
