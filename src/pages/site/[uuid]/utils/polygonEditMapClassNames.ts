/** `classNames` input that switches a polygon map between inline and full screen while the edit drawer is open. */
export const getPolygonEditMapClassNames = (isEditPolygonOpen: boolean, isAdmin: boolean) => ({
  "!fixed top-0 bottom-0 left-0 right-0 z-[37] w-screen rounded-none": isEditPolygonOpen,
  "mt-12 ml-12 max-h-[calc(100vh_-_3rem)] max-w-[calc(100vw_-_3rem)]": isEditPolygonOpen && isAdmin,
  "mt-[70px]": isEditPolygonOpen && !isAdmin,
  "h-full w-full !rounded-[0.25rem_0.25rem_0_0]": !isEditPolygonOpen
});
