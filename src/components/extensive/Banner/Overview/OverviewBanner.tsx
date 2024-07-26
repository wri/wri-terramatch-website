import Pill from "@/components/elements/Pill/Pill";
import Text from "@/components/elements/Text/Text";
import Banner, { BannerProps } from "@/components/extensive/Banner/Banner";
import Icon, { IconNames } from "@/components/extensive/Icon/Icon";

export interface OverviewBannerProps extends BannerProps {
  iconName: IconNames;
  subtitle: string;
  pillText: string;
}

const OverviewBanner = ({ title, iconName, pillText, subtitle, children, ...props }: OverviewBannerProps) => {
  return (
    <Banner {...props}>
      <div className="flex w-full max-w-[82vw] items-center justify-between gap-8">
        <div className="flex flex-col gap-3 text-white">
          <Pill className="w-[75px] bg-tertiary">{pillText}</Pill>
          <Text variant="text-heading-700" className="first-letter:uppercase">
            {title}
          </Text>
          <div className="flex gap-2 ">
            <Icon name={iconName} className="fill-white" height={18} width={13} />
            <Text variant="text-body-300" className="flex-1 uppercase">
              {subtitle}
            </Text>
          </div>
        </div>
        {children}
      </div>
    </Banner>
  );
};

export default OverviewBanner;
