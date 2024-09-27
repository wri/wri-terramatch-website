import classNames from "classnames";
import Image, { StaticImageData } from "next/image";
import Link from "next/link";
import { DetailedHTMLProps, HTMLAttributes } from "react";

import Button from "../Button/Button";
import ImageCredit from "../ImageCredit/ImageCredit";
import Text from "../Text/Text";

export interface AlternatingSectionProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  title: string;
  description: string;
  imageSrc: string | StaticImageData;
  imageCredit?: { name: string; position: "right" | "left" };
  buttonText: string;
  buttonLink: string;
}

const AlternatingSection = (props: AlternatingSectionProps) => {
  const { title, description, imageSrc, imageCredit, buttonText, buttonLink, className, ...divProps } = props;
  return (
    <div {...divProps} className={classNames("w-full md:flex", className)}>
      <div className="flex items-center justify-center px-12 py-9 md:w-[50%]">
        <div className="flex max-w-[400px] flex-col items-start gap-4">
          <Text variant="text-heading-700">{title}</Text>
          <Text variant="text-heading-100" containHtml>
            {description}
          </Text>
          <Button as={Link} href={buttonLink}>
            {buttonText}
          </Button>
        </div>
      </div>
      <div className="flex justify-center bg-background md:w-[50%]">
        <div className="relative h-[278px] w-full md:h-[510px]">
          <Image src={imageSrc} alt="image" fill style={{ objectFit: "cover" }} placeholder="blur" />
          <ImageCredit
            className={classNames(`absolute bottom-0`, {
              "left-5": imageCredit?.position === "left",
              "right-5": imageCredit?.position === "right"
            })}
          >
            {imageCredit?.name}
          </ImageCredit>
        </div>
      </div>
    </div>
  );
};

export default AlternatingSection;
