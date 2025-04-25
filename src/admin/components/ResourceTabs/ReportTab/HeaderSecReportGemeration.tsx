import Text from "@/components/elements/Text/Text";

const HeaderSecReportGemeration = ({ title }: { title: string }) => {
  return (
    <div className="h-8 border-b-2 border-black bg-[#CECECE] px-2.5 py-1.5">
      <Text variant="text-12-bold" className="leading-[normal] text-black">
        {title}
      </Text>
    </div>
  );
};

export default HeaderSecReportGemeration;
