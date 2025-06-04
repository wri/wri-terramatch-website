import Text from "@/components/elements/Text/Text";

const HeaderSecReportGemeration = ({ title }: { title: string }) => {
  return (
    <div
      className="header-section-report h-8 border-b-2 border-black bg-grey-735 px-2 py-1.5"
      style={{ backgroundColor: "#CECECE", background: "#CECECE" }}
    >
      <Text variant="text-12-bold" className="leading-[normal] text-black">
        {title}
      </Text>
    </div>
  );
};

export default HeaderSecReportGemeration;
