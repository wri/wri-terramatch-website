import Image from "next/image";
export interface IconProps {
  variant: string;
  className?: string;
  src: string;
  alt: string;
  classNameIcon?: string;
}
const Icon = (props: IconProps) => {
  const { variant, className, src, alt } = props;
  return <Image src={src} alt={alt} className={`${className} ${variant}`} width={0} height={0} />;
};

export default Icon;
