import Text from "@/components/elements/Text/Text";

const HeaderSecDashboard = ({ title }: { title: string }) => {
  return (
    <div>
      <Text variant="text-14">{title}</Text>
    </div>
  );
};

export default HeaderSecDashboard;
