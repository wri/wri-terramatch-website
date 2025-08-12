import Icon, { IconNames } from "../../Icon/Icon";

const PageFooter = () => {
  const year = new Date().getFullYear();

  return (
    <div
      className="mt-0 flex h-28 items-center justify-between bg-[#353535] px-28 text-white mobile:sticky mobile:top-full mobile:min-h-[56px] mobile:px-3 "
      style={{ marginTop: 0 }}
    >
      <div className="flex">
        <Icon name={IconNames.FACEBOOK} className="mr-4 text-white" />
        <Icon name={IconNames.INSTAGRAM} className="mr-4 text-white" />
        <Icon name={IconNames.LINKEDIN} className="text-white" />
      </div>

      <Icon name={IconNames.WRI_LOGO} width={108} height={30} className="min-w-[108px]" />
      <p> © TerraMatch {year}</p>
    </div>
  );
};

export default PageFooter;
