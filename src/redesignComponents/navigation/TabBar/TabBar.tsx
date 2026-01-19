import { TabBar as TabBarWri } from "@worldresources/wri-design-systems";

const TabBar = () => {
  return (
    <TabBarWri
      tabs={[
        {
          label: "One",
          value: "one"
        },
        {
          label: "Two",
          value: "two"
        },
        {
          label: "Three",
          value: "three"
        }
      ]}
      variant="panel"
    />
  );
};

export default TabBar;
