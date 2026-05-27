import { FC } from "react";

const ResponsiveTypography: FC = () => (
  <style>{`
    @media (min-width: 1800px) {
      html {
        font-size: 18px;
      }
    }

    @media (min-width: 2400px) {
      html {
        font-size: 22px;
      }
    }

    @media (min-width: 3700px) {
      html {
        font-size: 26px;
      }
    }
  `}</style>
);

export default ResponsiveTypography;
