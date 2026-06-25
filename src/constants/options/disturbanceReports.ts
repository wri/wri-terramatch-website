export const formatOptions = (options: any) => {
  if (!Array.isArray(options)) return options?.replace(/-/g, " ").replace(/\b\w/g, (l: string) => l.toUpperCase());
  return options.map(option => {
    return option.replace(/-/g, " ").replace(/\b\w/g, (l: string) => l.toUpperCase());
  });
};
