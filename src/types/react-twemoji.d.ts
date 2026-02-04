declare module "react-twemoji" {
  import { FC, ReactNode } from "react";

  interface TwemojiOptions {
    className?: string;
    folder?: string;
    ext?: string;
    base?: string;
    size?: string | number;
  }

  interface TwemojiProps {
    options?: TwemojiOptions;
    children?: ReactNode;
  }

  const Twemoji: FC<TwemojiProps>;
  export default Twemoji;
}
