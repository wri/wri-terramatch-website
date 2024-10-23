import Icon, { IconNames } from "@/components/extensive/Icon/Icon";

const Homepage = () => {
  return (
    <div className="w-full pt-16 pb-20 pl-13 pr-26">
      <Icon name={IconNames.WRI_LOGO} width={108} height={30} className="min-w-[108px]" />
      <div className="mt-5 grid gap-16">
        <div>Sec1</div>
        <div>Sec2</div>
        <div>Sec3</div>
      </div>
    </div>
  );
};

export default Homepage;
