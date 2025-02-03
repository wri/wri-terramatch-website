export const replaceTextWithParams = (params: Record<string, any>, text: string): string => {
  return Object.entries(params).reduce((result, [key, value]) => {
    const escapedKey = key.replace(/([.*+?^=!:${}()|[\]/\\])/g, "\\$1");
    return result.replace(new RegExp(escapedKey, "g"), value?.toString() || "");
  }, text);
};

export const getOrderTop3 = (data: any[]) => {
  return data.sort((a, b) => b.value - a.value).slice(0, 3);
};

export const getKeyValue = (data: { [key: string]: number }) => {
  if (data) {
    const name = Object?.keys(data!)?.[0];
    const value = data[name];
    return { name: name, value: value };
  }
};

export const calculatePercentage = (value: number, total: number): number => {
  if (!total) return 0;
  return Math.round(Number(((value / total) * 100).toFixed(1)));
};

export const formatDescriptionIndicator = (
  items: { [key: string]: number | undefined },
  totalHectares: number,
  percentage?: boolean,
  baseText?: string
) => {
  const validItems = Object.entries(items)
    .filter(([key, value]) => value != undefined && value != null && !Number.isNaN(value))
    .map(
      ([key, value]) =>
        `<b>${key}</b> with <b>${value} ha </b>${
          percentage ? `(<b>${calculatePercentage(value!, totalHectares)}%</b>)` : ""
        }`
    );

  if (validItems.length == 0) return "";

  const formattedItems =
    validItems.length == 1
      ? validItems[0]
      : validItems.slice(0, -1).join(", ") + " and " + validItems[validItems.length - 1];

  if (baseText) return `${baseText} ${formattedItems}`;
  return formattedItems;
};
