import { useT } from "@transifex/react";
import classNames from "classnames";
import { FC, useEffect, useRef, useState } from "react";
import { When } from "react-if";

import Button from "@/components/elements/Button/Button";
import Text, { TextProps } from "@/components/elements/Text/Text";

interface IProps extends TextProps {}

const ReadMoreText: FC<IProps> = ({ className, ...rest }) => {
  const t = useT();
  const contentRef = useRef<HTMLDivElement>(null);
  const [isClamped, setClamped] = useState(false);
  const [isExpanded, setExpanded] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (contentRef && contentRef.current && !isExpanded) {
        setClamped(contentRef.current.scrollHeight > contentRef.current.clientHeight);
      }
    };

    if (!isExpanded) {
      handleResize();
    }

    // Add event listener to window resize
    window.addEventListener("resize", handleResize);

    // Remove event listener on cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, [isExpanded]);

  return (
    <div className={className}>
      <div className={classNames(isExpanded ? "line-clamp-none" : "line-clamp-1")} ref={contentRef}>
        <Text {...rest} />
      </div>
      <When condition={isClamped}>
        <Button variant="text" onClick={() => setExpanded(prev => !prev)} className="text-primary-500 underline">
          {t(isExpanded ? "Read Less" : "Read More")}
        </Button>
      </When>
    </div>
  );
};

export default ReadMoreText;
