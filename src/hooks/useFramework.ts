export const useFramework = (entity: any) => {
  return {
    isPPC: entity.framework_key === "ppc",
    isTerrafund: entity.framework_key === "terrafund"
  };
};
