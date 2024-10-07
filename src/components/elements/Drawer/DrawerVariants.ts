export interface DrawerVariant {
  conteiner: string;
  headerClassname: string;
  iconClassName: string;
}

export const DRAWER_VARIANT_DEFAULT = {
  conteiner: "",
  headerClassname: "items-center",
  iconClassName: "opacity-50 text-blueCustom-900"
};
export const DRAWER_VARIANT_FILTER = {
  conteiner: "",
  headerClassname: "items-start",
  iconClassName: "text-primary"
};
