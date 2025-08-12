import Text from "@/components/elements/Text/Text";
import Tooltip from "@/components/elements/Tooltip/Tooltip";
import Icon, { IconNames } from "@/components/extensive/Icon/Icon";

const NoDataMap = () => {
  const indicatorDescription1 =
    "From the <b>23 August 2024</b> analysis, 12.2M out of 20M hectares are being restored. Of those, <b>Direct Seeding was the most prevalent strategy used with more 765,432ha</b>, followed by Tree Planting with 453,89ha and Assisted Natural Regeneration with 93,345ha.";
  const indicatorDescription2 =
    "The numbers and reports below display data related to Indicator 2: Hectares Under Restoration described in TerraFund’s MRV framework. Please refer to the linked MRV framework for details on how these numbers are sourced and verified.";

  return (
    <div className="absolute top-0 flex h-full w-full">
      <div className="relative flex w-[23vw] flex-col gap-3 p-6">
        <div className="absolute top-0 left-0 h-full w-full rounded-l-xl bg-white bg-opacity-20 backdrop-blur" />
        <Text
          variant="text-14-semibold"
          className="z-10 w-fit border-b-2 border-white border-opacity-20 pb-1.5 text-white"
        >
          Indicator Description
        </Text>
        <div className="z-[5] flex min-h-0 flex-col gap-3 overflow-auto pr-1">
          <Text variant="text-14-light" className="text-white" containHtml>
            {indicatorDescription1}
          </Text>
          <Text variant="text-14-light" className="text-white" containHtml>
            {indicatorDescription2}
          </Text>
        </div>
      </div>
      <div className="w-full p-6">
        <div className="relative flex h-full w-full flex-col items-center justify-center gap-2 rounded-xl border border-white">
          <div className="absolute top-0 left-0 h-full w-full rounded-xl bg-white bg-opacity-20 backdrop-blur" />
          <Text variant="text-32-semibold" className="z-10 text-white">
            No Data to Display
          </Text>
          <div className="flex items-center gap-1">
            <Text variant="text-14" className="z-10 text-white">
              RUN ANALYSIS ON PROJECT POLYGONS TO SEE DATA
            </Text>
            <Tooltip content="Tooltip">
              <Icon name={IconNames.IC_INFO_WHITE_BLACK} className="h-4 w-4" />
            </Tooltip>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoDataMap;
