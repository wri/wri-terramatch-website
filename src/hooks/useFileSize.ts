import { filesize } from "filesize";
import { useRouter } from "next/router";

/**
 * @returns Human readable file size
 */
export const useFileSize = () => {
  const { locale } = useRouter();

  return {
    format: (fileSize: number) => {
      const { value, symbol, unit } = filesize(fileSize, { locale, round: 2, output: "object" });

      switch (unit) {
        case "kB":
          return `${parseInt(value)} ${symbol}`;
        case "MB":
          return `${value} ${symbol}`;

        default:
          return filesize(fileSize, { locale, round: 0 });
      }
    }
  };
};
