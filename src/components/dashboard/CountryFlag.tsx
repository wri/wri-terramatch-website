import classNames from "classnames";

export type CountryFlagSize = "xs" | "sm" | "md" | "lg";

const HEIGHT_BY_SIZE: Record<CountryFlagSize, string> = {
  xs: "h-3",
  sm: "h-4",
  md: "h-6",
  lg: "h-8"
};

interface CountryFlagProps {
  src: string;
  alt?: string;
  size?: CountryFlagSize;
  className?: string;
}

const CountryFlag = ({ src, alt = "flag", size = "sm", className }: CountryFlagProps) => (
  <span
    className={classNames(
      "inline-flex shrink-0 items-center justify-center overflow-visible",
      HEIGHT_BY_SIZE[size],
      "aspect-[3/2] w-auto",
      className
    )}
  >
    <img src={src} alt={alt} className="block h-full max-h-full w-full max-w-full object-contain object-center" />
  </span>
);

export default CountryFlag;
