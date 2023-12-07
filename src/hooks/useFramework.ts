/**
 * To determine if entity belongs to ppc or terrafund
 * @param entity entity full resource
 * @returns
 */
export const useFramework = (entity: any) => {
  return {
    isPPC: entity.framework_key === "ppc",
    isTerrafund: entity.framework_key === "terrafund"
  };
};
