import Icon, { IconNames } from "../../Icon/Icon";

const PageFooter = () => (
  <div className="mt-0 flex h-28 items-center justify-between bg-[#353535] px-28 text-white" style={{ marginTop: 0 }}>
    <div className="flex">
      <Icon name={IconNames.FACEBOOK} className="mr-4 text-white" />
      <Icon name={IconNames.INSTAGRAM} className="mr-4 text-white" />
      <Icon name={IconNames.LINKEDIN} className="text-white" />
    </div>

    <Icon name={IconNames.WRI_LOGO} width={108} height={30} className="min-w-[108px]" />
    <p> © TerraMatch 2024</p>
  </div>
);

export default PageFooter;
