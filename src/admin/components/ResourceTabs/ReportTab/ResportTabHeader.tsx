import Text from "@/components/elements/Text/Text";

const ResportTabHeader = () => {
  return (
    <div id="pdf-header" className="print-header flex items-center justify-between border-b-2 border-black pb-2">
      <div>
        <Text variant="text-24" className="leading-[normal]">
          Report Generation
        </Text>
        <Text variant="text-12" className="leading-[normal]">
          Background information for site visit
        </Text>
      </div>
      <div className="text-end">
        <Text variant="text-10" className="leading-[normal]">
          View more reports online at&nbsp;
          <a
            href="https://terramatch.org"
            target="_blank"
            rel="noopener noreferrer"
            className="text-10-bold text-primary hover:underline"
          >
            terramatch.org
          </a>
          .
        </Text>
        <Text variant="text-10" className="mt-1 leading-[normal]">
          Printed on {new Date().toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" })}
        </Text>
      </div>
    </div>
  );
};

export default ResportTabHeader;
